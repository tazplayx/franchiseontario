import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import Stripe from 'stripe'

// ── Internal helper — fire-and-forget email from webhook ──────────────────────
async function fireEmail(to: string, type: string, data: Record<string, unknown>) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.franchiseontario.com'
    await fetch(`${base}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, type, data }),
    })
  } catch {
    // Never let email failure break the webhook response
  }
}

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text() // raw body needed for signature verification
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`[Webhook] Received: ${event.type}`)

  try {
    switch (event.type) {

      // ── New subscription paid ────────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { plan, franchiseName, contactName, isUpgrade } = session.metadata ?? {}
        const customerEmail = session.customer_email ?? ''

        console.log(`[Webhook] ${isUpgrade === 'true' ? 'Upgrade' : 'New subscription'} — Plan: ${plan}, Franchise: ${franchiseName}`)

        // Retrieve the subscription to get amount + next billing date
        let amountDisplay = ''
        let nextBillingDate = ''
        let invoiceUrl = ''
        if (session.subscription) {
          try {
            const sub = await getStripe().subscriptions.retrieve(session.subscription as string)
            const item = sub.items.data[0]
            if (item?.price) {
              const cents = item.price.unit_amount ?? 0
              const currency = (item.price.currency ?? 'cad').toUpperCase()
              amountDisplay = `$${(cents / 100).toFixed(2)} ${currency} / month`
            }
            const periodEnd = (sub as unknown as Record<string, unknown>).current_period_end as number | undefined
            if (periodEnd) {
              nextBillingDate = new Date(periodEnd * 1000).toLocaleDateString('en-CA', {
                year: 'numeric', month: 'long', day: 'numeric',
              })
            }
          } catch { /* non-critical */ }
        }

        // Retrieve hosted invoice URL from latest invoice
        if (session.invoice) {
          try {
            const inv = await getStripe().invoices.retrieve(session.invoice as string)
            invoiceUrl = inv.hosted_invoice_url ?? ''
          } catch { /* non-critical */ }
        }

        // Send payment receipt to customer
        if (customerEmail) {
          const planName = (plan ?? '').charAt(0).toUpperCase() + (plan ?? '').slice(1)
          await fireEmail(customerEmail, 'payment-receipt', {
            franchiseName, contactName, plan: planName,
            amount: amountDisplay, invoiceUrl, nextBillingDate,
          })
        }

        break
      }

      // ── Subscription upgraded / downgraded ───────────────────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const { plan, franchiseName } = subscription.metadata ?? {}

        console.log(`[Webhook] Subscription updated — ${franchiseName} → ${plan}`)

        // TODO: Update listing tier in database
        // await db.listing.update({ subscriptionId: subscription.id, plan })

        break
      }

      // ── Subscription cancelled ───────────────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const { franchiseName, plan, contactEmail } = subscription.metadata ?? {}

        console.log(`[Webhook] Subscription cancelled — ${franchiseName}`)

        // TODO: Downgrade listing to Basic (free) tier
        // await db.listing.update({ subscriptionId: subscription.id, plan: 'basic' })

        // Notify customer that their subscription has ended
        if (contactEmail) {
          await fireEmail(contactEmail, 'membership-ending', { franchiseName, plan })
        }

        break
      }

      // ── Payment failed ───────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const customerEmail = invoice.customer_email ?? ''

        console.log(`[Webhook] Payment failed — Customer: ${customerId}`)

        // TODO: Flag listing for review
        // await db.listing.update({ customerId, paymentFailed: true })

        // Notify customer to update their payment method
        if (customerEmail) {
          // invoice.subscription may not exist on all Stripe SDK versions — use optional cast
          const subscriptionId = (invoice as unknown as { subscription?: string }).subscription
          const sub = subscriptionId
            ? await getStripe().subscriptions.retrieve(subscriptionId)
            : null
          const { franchiseName, plan } = sub?.metadata ?? {}
          await fireEmail(customerEmail, 'payment-failed', { franchiseName, plan })
        }

        break
      }

      // ── Invoice paid (recurring monthly charge) ─────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`[Webhook] Invoice paid — ${invoice.id}`)

        // Skip the very first invoice — already handled by checkout.session.completed
        if (invoice.billing_reason === 'subscription_create') break

        const customerEmail = invoice.customer_email ?? ''
        if (!customerEmail) break

        // Retrieve subscription metadata for plan + franchise info
        const subscriptionId = (invoice as unknown as { subscription?: string }).subscription
        const sub = subscriptionId
          ? await getStripe().subscriptions.retrieve(subscriptionId).catch(() => null)
          : null
        const { plan, franchiseName, contactName } = sub?.metadata ?? {}

        const planName = (plan ?? '').charAt(0).toUpperCase() + (plan ?? '').slice(1)
        const cents = invoice.amount_paid ?? 0
        const currency = (invoice.currency ?? 'cad').toUpperCase()
        const amountDisplay = `$${(cents / 100).toFixed(2)} ${currency}`
        const invoiceUrl = invoice.hosted_invoice_url ?? ''

        let nextBillingDate = ''
        const subPeriodEnd = (sub as unknown as Record<string, unknown> | null)?.current_period_end as number | undefined
        if (subPeriodEnd) {
          nextBillingDate = new Date(subPeriodEnd * 1000).toLocaleDateString('en-CA', {
            year: 'numeric', month: 'long', day: 'numeric',
          })
        }

        await fireEmail(customerEmail, 'payment-receipt', {
          franchiseName, contactName, plan: planName,
          amount: amountDisplay, invoiceUrl, nextBillingDate,
        })

        break
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(`[Webhook] Handler error for ${event.type}:`, err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

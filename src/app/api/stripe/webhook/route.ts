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
        const { plan, franchiseName, contactName, addFeatureSpotlight } = session.metadata ?? {}

        console.log(`[Webhook] New subscription — Plan: ${plan}, Franchise: ${franchiseName}`)

        // TODO: In production, persist to your database here:
        // await db.listing.create({
        //   customerId: session.customer as string,
        //   subscriptionId: session.subscription as string,
        //   plan,
        //   franchiseName,
        //   status: 'pending_review',
        // })

        // Send admin notification email
        // await sendAdminEmail({ franchiseName, plan, contactName, addFeatureSpotlight })

        // Send confirmation to customer
        // await sendCustomerEmail({ email: session.customer_email, plan })

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

      // ── Invoice paid (recurring) ─────────────────────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`[Webhook] Invoice paid — ${invoice.id}`)

        // TODO: Update subscription renewal date in DB
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

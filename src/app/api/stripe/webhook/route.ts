import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import Stripe from 'stripe'

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
        const { franchiseName } = subscription.metadata ?? {}

        console.log(`[Webhook] Subscription cancelled — ${franchiseName}`)

        // TODO: Downgrade listing to Basic (free) tier
        // await db.listing.update({ subscriptionId: subscription.id, plan: 'basic' })

        break
      }

      // ── Payment failed ───────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        console.log(`[Webhook] Payment failed — Customer: ${customerId}`)

        // TODO: Send payment failure email, flag listing for review
        // await sendPaymentFailedEmail({ customerId })

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

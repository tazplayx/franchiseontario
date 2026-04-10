import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PLANS, type PlanKey } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      plan,
      addFeatureSpotlight,
      franchiseName,
      email,
      contactName,
    }: {
      plan: PlanKey
      addFeatureSpotlight?: boolean
      franchiseName?: string
      email?: string
      contactName?: string
    } = body

    const planConfig = PLANS[plan]
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const lineItems: { price: string; quantity: number }[] = [
      { price: planConfig.priceId, quantity: 1 },
    ]

    if (addFeatureSpotlight) {
      lineItems.push({ price: PLANS.feature_spotlight.priceId, quantity: 1 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.franchiseontario.com'

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,

      // Success/cancel redirects
      success_url: `${baseUrl}/register/success?plan=paid&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/register?cancelled=true`,

      // Pre-fill customer info if provided
      customer_email: email || undefined,

      // Collect billing address
      billing_address_collection: 'required',

      // Metadata attached to the Checkout Session and carried to webhooks
      metadata: {
        plan,
        franchiseName: franchiseName ?? '',
        contactName: contactName ?? '',
        addFeatureSpotlight: addFeatureSpotlight ? 'true' : 'false',
      },

      // Also attach to the subscription itself for webhook lookups
      subscription_data: {
        metadata: {
          plan,
          franchiseName: franchiseName ?? '',
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[Stripe Checkout] Error:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

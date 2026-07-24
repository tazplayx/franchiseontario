import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

/**
 * Server-verified subscription status.
 * Given an email, looks up the customer(s) in Stripe and returns the REAL
 * active plan tier derived from the subscription's price ID. This is the
 * source of truth for entitlements — never trust a client-supplied tier or
 * a URL parameter, which can be forged.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string }
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ tier: 'basic', active: false, note: 'stripe-not-configured' })
    }

    const stripe = getStripe()
    const premiumPrice = process.env.STRIPE_PRICE_PREMIUM
    const enterprisePrice = process.env.STRIPE_PRICE_ENTERPRISE

    // A given email may have multiple Stripe customers (checkout creates a new
    // one each time) — inspect all of them and take the highest active tier.
    const customers = await stripe.customers.list({ email, limit: 20 })
    let tier: 'basic' | 'premium' | 'enterprise' = 'basic'
    let active = false
    let currentPeriodEnd: number | null = null
    let subscriptionId: string | null = null

    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 20,
      })
      for (const sub of subs.data) {
        for (const item of sub.items.data) {
          const priceId = item.price.id
          // In this Stripe API version current_period_end is on the item
          const periodEnd = (item as { current_period_end?: number }).current_period_end ?? null
          if (enterprisePrice && priceId === enterprisePrice) {
            tier = 'enterprise'
            active = true
            currentPeriodEnd = periodEnd
            subscriptionId = sub.id
          } else if (premiumPrice && priceId === premiumPrice && tier !== 'enterprise') {
            tier = 'premium'
            active = true
            currentPeriodEnd = periodEnd
            subscriptionId = sub.id
          }
        }
      }
    }

    return NextResponse.json({ tier, active, currentPeriodEnd, subscriptionId })
  } catch (err) {
    console.error('[subscription-status] Error:', err)
    // Fail closed — do not grant a paid tier if we cannot verify
    return NextResponse.json({ tier: 'basic', active: false, error: 'verification-failed' }, { status: 200 })
  }
}

import Stripe from 'stripe'

// Lazy singleton — only instantiated at runtime (not during Next.js build)
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables.')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia',
    })
  }
  return _stripe
}



// ── Plan definitions ─────────────────────────────────────────────────
// Price IDs come from your Stripe Dashboard → Products → Prices
// Create them there, then paste the IDs into .env.local
export const PLANS = {
  premium: {
    name: 'Premium',
    priceCAD: 79,
    interval: 'month' as const,
    priceId: process.env.STRIPE_PRICE_PREMIUM!,
    description: 'Priority placement, photo gallery, analytics dashboard',
  },
  enterprise: {
    name: 'Enterprise',
    priceCAD: 199,
    interval: 'month' as const,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    description: 'Gold VIP badge, top placement, account manager',
  },
  feature_spotlight: {
    name: 'Homepage Feature Spotlight',
    priceCAD: 14.99,
    interval: 'week' as const,
    priceId: process.env.STRIPE_PRICE_FEATURE_SPOTLIGHT!,
    description: 'Rotating weekly homepage feature — maximum visibility',
  },
} as const

export type PlanKey = keyof typeof PLANS

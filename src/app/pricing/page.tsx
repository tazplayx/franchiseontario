import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Crown, Zap, Star, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Franchise Listing Plans & Pricing — Free, Premium & Enterprise',
  description:
    "List your franchise in Ontario for free, or upgrade to Premium ($79/mo) or Enterprise ($199/mo). Add a homepage feature spotlight for $14.99/week. No contracts. Cancel anytime.",
  keywords: ['franchise listing pricing Ontario', 'advertise franchise Ontario', 'franchise directory cost Canada'],
  alternates: { canonical: 'https://www.franchiseontario.com/pricing' },
  openGraph: {
    title: 'List Your Franchise in Ontario — Pricing & Plans',
    description: "Free basic listing, Premium at $79/mo, Enterprise at $199/mo. Homepage feature spots at $14.99/week. Ontario's most active franchise directory.",
    url: 'https://www.franchiseontario.com/pricing',
  },
}

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    priceNum: 0,
    period: 'forever',
    tagline: 'Get discovered at no cost',
    icon: '🏷️',
    color: 'gray',
    borderClass: 'border-gray-200',
    badgeClass: 'bg-gray-100 text-gray-600',
    ctaClass: 'bg-gray-800 hover:bg-gray-700 text-white',
    features: [
      { text: 'Basic franchise profile page', included: true },
      { text: 'Category listing & searchable', included: true },
      { text: 'Contact info (phone/email)', included: true },
      { text: 'Company description (500 chars)', included: true },
      { text: 'Location & established date', included: true },
      { text: 'Priority search placement', included: false },
      { text: 'Photo gallery', included: false },
      { text: 'Expanded highlights section', included: false },
      { text: 'Enquiry management dashboard', included: false },
      { text: 'Analytics & view tracking', included: false },
      { text: 'VIP badge & verified status', included: false },
      { text: 'News & press releases', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$79',
    priceNum: 79,
    period: '/month',
    tagline: 'Stand out from the crowd',
    icon: '⚡',
    color: 'blue',
    borderClass: 'border-blue-500',
    badgeClass: 'bg-blue-600 text-white',
    ctaClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    popular: true,
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Priority search placement', included: true },
      { text: 'Highlighted listing with blue border', included: true },
      { text: 'Photo gallery (up to 5 photos)', included: true },
      { text: 'Expanded highlights section', included: true },
      { text: 'Enquiry management dashboard', included: true },
      { text: 'Analytics & view tracking', included: true },
      { text: 'Premium badge', included: true },
      { text: 'VIP gold badge', included: false },
      { text: 'News & press releases', included: false },
      { text: 'Dedicated account manager', included: false },
      { text: 'Top-of-category placement', included: false },
      { text: 'Unlimited photos', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199',
    priceNum: 199,
    period: '/month',
    tagline: 'Maximum visibility & impact',
    icon: '👑',
    color: 'gold',
    borderClass: 'border-amber-400',
    badgeClass: '',
    ctaClass: 'btn-gold',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Gold VIP badge + verified crown', included: true },
      { text: 'Top-of-category & top-of-directory', included: true },
      { text: 'Unlimited photos & media', included: true },
      { text: 'News & press release distribution', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Full analytics dashboard', included: true },
      { text: 'Gold shimmer card border', included: true },
      { text: 'Custom franchise profile layout', included: true },
      { text: 'Multi-location management', included: true },
      { text: 'Priority support (24hr response)', included: true },
      { text: 'Quarterly performance reports', included: true },
      { text: 'Franchise lead notifications', included: true },
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            List Your Franchise in Ontario
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Start free, upgrade as you grow. Join Ontario's most active franchise discovery platform and connect with serious investors.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              id={plan.id}
              className={`relative bg-white rounded-2xl border-2 ${plan.borderClass} overflow-hidden shadow-sm ${
                plan.popular ? 'shadow-blue-100 shadow-xl' : ''
              } ${plan.color === 'gold' ? 'enterprise-card' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />
              )}
              {plan.color === 'gold' && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              )}

              {/* Popular / Best badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              {plan.color === 'gold' && (
                <div className="absolute top-4 right-4">
                  <span className="vip-badge text-[10px] font-black px-2 py-0.5 rounded-full">
                    BEST VALUE
                  </span>
                </div>
              )}

              <div className={`${plan.color === 'gold' ? 'bg-white rounded-[14px] m-0.5 p-6' : 'p-6'}`}>
                {/* Plan header */}
                <div className="text-3xl mb-3">{plan.icon}</div>
                {plan.badgeClass ? (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${plan.badgeClass}`}>
                    {plan.name.toUpperCase()}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 vip-badge">
                    ENTERPRISE
                  </span>
                )}

                <div className="flex items-baseline gap-1 mt-2 mb-1">
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">{plan.tagline}</p>

                {/* Feature list */}
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 text-sm ${f.included ? 'text-green-500' : 'text-gray-200'}`}>
                        {f.included ? '✓' : '✕'}
                      </span>
                      <span className={`text-sm ${f.included ? 'text-gray-700' : 'text-gray-300 line-through'}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-xl font-bold text-sm transition-all ${plan.ctaClass}`}
                >
                  {plan.priceNum === 0 ? 'Start for Free' : `Get ${plan.name}`} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Homepage Feature Add-On */}
        <div id="featured" className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-2xl p-1 mb-16">
          <div className="bg-white rounded-[14px] p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">⭐</span>
                  <h2 className="text-2xl font-black text-gray-900">Homepage Feature Spotlight</h2>
                  <span className="vip-badge text-[10px] px-2 py-0.5 rounded-full font-black">ADD-ON</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-2xl">
                  Get maximum visibility with a rotating <strong>featured spot on the FranchiseOntario.com homepage</strong>. Your franchise appears in the "Featured This Week" spotlight section, which is the highest-traffic area of our site — visible to every visitor before they even search.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: '👁️', label: 'Top placement', sub: 'Above all directory listings' },
                    { icon: '🔄', label: 'Rotating weekly', sub: 'Fair exposure for all featured brands' },
                    { icon: '📊', label: '10,000+ monthly views', sub: 'High-traffic homepage position' },
                  ].map((b) => (
                    <div key={b.label} className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                      <div className="text-xl mb-1">{b.icon}</div>
                      <div className="text-sm font-bold text-gray-800">{b.label}</div>
                      <div className="text-xs text-gray-500">{b.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-green-500">✓</span> Available as add-on to any plan
                  <span className="mx-2 text-gray-200">|</span>
                  <span className="text-green-500">✓</span> Weekly billing — cancel anytime
                  <span className="mx-2 text-gray-200">|</span>
                  <span className="text-green-500">✓</span> Limited spots available each week
                </div>
              </div>
              <div className="shrink-0 text-center">
                <div className="text-5xl font-black text-gray-900">$14.99</div>
                <div className="text-sm text-gray-400 mb-4">/week</div>
                <Link href="/register" className="btn-gold block text-center px-8 py-3 rounded-xl font-bold text-sm">
                  Reserve Your Spot →
                </Link>
                <p className="text-xs text-gray-400 mt-2">Limited weekly spots</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I upgrade or downgrade my plan at any time?',
                a: 'Yes — you can upgrade, downgrade, or cancel your subscription at any time from your account dashboard. Changes take effect at the next billing cycle.',
              },
              {
                q: 'What payment methods are accepted?',
                a: 'We accept all major credit cards (Visa, Mastercard, Amex) as well as PayPal. All billing is in Canadian dollars (CAD).',
              },
              {
                q: 'How does the homepage feature rotation work?',
                a: 'Featured spots rotate among all active feature advertisers each week. We ensure fair exposure across all paying feature brands. Spots are limited to maintain quality and visibility for each featured franchise.',
              },
              {
                q: 'How long does it take for my listing to go live?',
                a: 'Basic listings are reviewed and live within 24 hours. Premium and Enterprise listings are expedited and typically live within 4 hours after submission.',
              },
              {
                q: 'What makes Enterprise different from Premium?',
                a: 'Enterprise includes a gold VIP badge, top placement across the entire directory and within your category, press release distribution, a dedicated account manager, and unlimited media. It\'s the full white-glove experience for established franchise brands.',
              },
              {
                q: 'Is there a contract or commitment?',
                a: 'No long-term contracts. All paid plans are month-to-month. The homepage feature add-on is billed weekly. Cancel anytime with no penalty.',
              },
            ].map((item) => (
              <details key={item.q} className="bg-white rounded-xl border border-gray-200 group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-sm text-gray-900 hover:text-red-600 transition-colors">
                  {item.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 rounded-2xl p-10 text-white">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-2xl font-black mb-2">Start Growing Your Franchise Today</h2>
          <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto">
            Join the fastest-growing franchise directory in Ontario. Start free, no credit card required.
          </p>
          <Link href="/register" className="btn-red inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold">
            Create Your Free Listing <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

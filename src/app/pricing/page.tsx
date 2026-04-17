import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Franchise Listing Plans & Pricing — List in Ontario & Across Canada',
  description:
    "List your Ontario or Canadian franchise for free, or upgrade to Premium ($79/mo) or Enterprise ($199/mo). Reach Ontario's most active franchise-buyer audience. No contracts. Cancel anytime.",
  keywords: ['franchise listing pricing Ontario', 'advertise franchise Ontario', 'franchise directory Canada', 'list franchise Canada Ontario'],
  alternates: { canonical: 'https://www.franchiseontario.com/pricing' },
  openGraph: {
    title: 'List Your Franchise — Ontario & Canada | FranchiseOntario.com',
    description: "Free basic listing, Premium at $79/mo, Enterprise at $199/mo. Reach Ontario's most active franchise-buyer audience — Canada-wide brand visibility included.",
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
    cardClass: 'border-gray-200',
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
    cardClass: 'border-blue-500 shadow-xl shadow-blue-100',
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
    cardClass: 'border-2 border-amber-400',
    badgeClass: 'bg-amber-500 text-white',
    ctaClass: 'btn-gold',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Gold VIP badge + verified crown', included: true },
      { text: 'Top-of-category & top-of-directory', included: true },
      { text: 'Unlimited photos & media', included: true },
      { text: 'News & press release distribution', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Full analytics dashboard', included: true },
      { text: 'Gold border on franchise card', included: true },
      { text: 'Custom franchise profile layout', included: true },
      { text: 'Multi-location management', included: true },
      { text: 'Priority support (24hr response)', included: true },
      { text: 'Quarterly performance reports', included: true },
      { text: 'Franchise lead notifications', included: true },
    ],
  },
]

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://www.franchiseontario.com/pricing#webpage',
  name: 'Franchise Listing Plans & Pricing — FranchiseOntario.com',
  url: 'https://www.franchiseontario.com/pricing',
  description: "List your Ontario or Canadian franchise for free, or upgrade to Premium ($79/mo) or Enterprise ($199/mo).",
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.franchiseontario.com' },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://www.franchiseontario.com/pricing' },
    ],
  },
  mainEntity: {
    '@type': 'ItemList',
    name: 'Franchise Listing Plans',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Offer',
          name: 'Basic Listing',
          description: 'Free franchise profile listing on FranchiseOntario.com — visible across Ontario and Canada.',
          price: '0',
          priceCurrency: 'CAD',
          eligibleRegion: { '@type': 'Place', name: 'Ontario, Canada' },
          seller: { '@type': 'Organization', name: 'FranchiseOntario.com' },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Offer',
          name: 'Premium Listing',
          description: 'Priority placement, photo gallery, highlights section, analytics, and premium badge. $79/month.',
          price: '79',
          priceCurrency: 'CAD',
          billingIncrement: 'P1M',
          eligibleRegion: { '@type': 'Place', name: 'Ontario, Canada' },
          seller: { '@type': 'Organization', name: 'FranchiseOntario.com' },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Offer',
          name: 'Enterprise Listing',
          description: 'Top-of-category placement, VIP badge, dedicated account manager, press releases, unlimited photos, and full brand profile. $199/month.',
          price: '199',
          priceCurrency: 'CAD',
          billingIncrement: 'P1M',
          eligibleRegion: { '@type': 'Place', name: 'Ontario, Canada' },
          seller: { '@type': 'Organization', name: 'FranchiseOntario.com' },
        },
      },
    ],
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={pricingSchema} />
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-red-600 text-xs font-bold uppercase tracking-widest">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            List Your Franchise in Ontario & Across Canada
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Start free, upgrade as you grow. Join Ontario&apos;s most active franchise discovery platform — reaching investors across Ontario and Canada-wide.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              id={plan.id}
              className={`relative bg-white rounded-2xl border-2 ${plan.cardClass} overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />
              )}
              {plan.id === 'enterprise' && (
                <div className="absolute top-0 inset-x-0 h-1 bg-amber-400" />
              )}

              {/* Plan badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              {plan.id === 'enterprise' && (
                <div className="absolute top-4 right-4">
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    BEST VALUE
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan header */}
                <div className="text-3xl mb-3">{plan.icon}</div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 ${plan.badgeClass}`}>
                  {plan.name.toUpperCase()}
                </span>

                <div className="flex items-baseline gap-1 mt-2 mb-1">
                  <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mb-8">{plan.tagline}</p>

                {/* Feature list */}
                <ul className="space-y-3 mb-10">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 shrink-0 text-sm font-bold ${f.included ? 'text-green-500' : 'text-gray-200'}`}>
                        {f.included ? '✓' : '✕'}
                      </span>
                      <span className={`text-[15px] ${f.included ? 'text-gray-700' : 'text-gray-300 line-through'}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block text-center py-3.5 rounded-xl font-bold text-sm transition-all ${plan.ctaClass}`}
                >
                  {plan.priceNum === 0 ? 'Start for Free' : `Get ${plan.name}`} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Homepage Feature Add-On — dark background, white title */}
        <div id="featured" className="bg-gray-900 rounded-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⭐</span>
                <h2 className="text-2xl font-black text-white">Homepage Feature Spotlight</h2>
                <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  ADD-ON
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-2xl">
                Get maximum visibility with a rotating <strong className="text-white">featured spot on the FranchiseOntario.com homepage</strong>. Your franchise appears in the &ldquo;Featured This Week&rdquo; spotlight section — the highest-traffic area of our site, visible to every visitor before they even search.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { icon: '👁️', label: 'Top placement', sub: 'Above all directory listings' },
                  { icon: '🔄', label: 'Rotating weekly', sub: 'Fair exposure for all featured brands' },
                  { icon: '📊', label: '10,000+ monthly views', sub: 'High-traffic homepage position' },
                ].map((b) => (
                  <div key={b.label} className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <div className="text-xl mb-1.5">{b.icon}</div>
                    <div className="text-sm font-bold text-white">{b.label}</div>
                    <div className="text-xs text-gray-400">{b.sub}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                <span><span className="text-amber-400 font-bold">✓</span> Available as add-on to any plan</span>
                <span><span className="text-amber-400 font-bold">✓</span> Weekly billing — cancel anytime</span>
                <span><span className="text-amber-400 font-bold">✓</span> Limited spots available each week</span>
              </div>
            </div>
            <div className="shrink-0 text-center md:text-right">
              <div className="text-5xl font-black text-white">$14.99</div>
              <div className="text-sm text-gray-400 mb-5">/week</div>
              <Link href="/register" className="btn-gold block text-center px-8 py-3 rounded-xl font-bold text-sm">
                Reserve Your Spot →
              </Link>
              <p className="text-xs text-gray-500 mt-2">Limited weekly spots</p>
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
                a: "Enterprise includes a gold VIP badge, top placement across the entire directory and within your category, press release distribution, a dedicated account manager, and unlimited media. It's the full white-glove experience for established franchise brands.",
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
        <div className="mt-16 text-center bg-red-600 rounded-2xl p-10 text-white">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-2xl font-black mb-2 text-white">Start Growing Your Franchise Today</h2>
          <p className="text-red-100 text-sm mb-6 max-w-md mx-auto">
            Join the fastest-growing franchise directory in Ontario — with Canada-wide reach. Start free, no credit card required.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-8 py-3.5 rounded-xl hover:bg-red-50 transition-colors">
            Create Your Free Listing <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

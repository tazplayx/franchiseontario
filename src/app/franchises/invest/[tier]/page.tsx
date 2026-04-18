import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import SEOBreadcrumb from '@/components/seo/SEOBreadcrumb'
import FranchiseSEOCard from '@/components/seo/FranchiseSEOCard'
import { getTierBySlug, getFranchisesByInvestment } from '@/lib/seo/queries'
import { INVESTMENT_TIERS } from '@/lib/seo/data'

const BASE = 'https://www.franchiseontario.com'

interface Props { params: { tier: string } }

export function generateStaticParams() {
  return INVESTMENT_TIERS.map((t) => ({ tier: t.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const tier = getTierBySlug(params.tier)
  if (!tier) return {}
  const count = getFranchisesByInvestment(params.tier).length

  return {
    title: `Ontario Franchise Opportunities ${tier.label} | FranchiseOntario.com`,
    description: `Browse ${count} franchise opportunities in Ontario with a total investment ${tier.label.toLowerCase()}. Compare brands, investment requirements, and franchise support packages.`,
    keywords: [
      `franchise ${tier.label.toLowerCase()} Ontario`,
      `affordable franchise Ontario`,
      `franchise investment ${tier.label} Canada`,
      `buy franchise Ontario ${tier.label}`,
      `low cost franchise Ontario`,
    ],
    alternates: { canonical: `${BASE}/franchises/invest/${params.tier}` },
    openGraph: {
      title: `Ontario Franchise Opportunities ${tier.label}`,
      description: tier.description,
      url: `${BASE}/franchises/invest/${params.tier}`,
    },
  }
}

export default function InvestmentTierPage({ params }: Props) {
  const tier = getTierBySlug(params.tier)
  if (!tier) notFound()

  const listings = getFranchisesByInvestment(params.tier)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Ontario Franchise Opportunities ${tier.label}`,
    url: `${BASE}/franchises/invest/${params.tier}`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 10).map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.name,
      url: `${BASE}/directory/${f.id}`,
    })),
  }

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="min-h-screen bg-gray-50">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SEOBreadcrumb items={[
              { label: 'Home', href: '/' },
              { label: 'Directory', href: '/directory' },
              { label: `Investment ${tier.label}` },
            ]} />

            <div className="mt-5">
              <h1
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
              >
                {tier.headline}
              </h1>
              <p className="text-gray-500 text-sm max-w-2xl mb-5">
                {tier.description}
                {listings.length > 0
                  ? ` Browse ${listings.length} franchise${listings.length !== 1 ? 's' : ''} matching this investment range below.`
                  : ''
                }
              </p>

              {/* Investment tier navigation */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 self-center mr-1">Other budgets:</span>
                {INVESTMENT_TIERS.filter((t) => t.slug !== params.tier).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/franchises/invest/${t.slug}`}
                    className="text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all hover:border-red-300 hover:text-red-600"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'white' }}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Listings ─────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {listings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {listings.map((f) => (
                  <FranchiseSEOCard key={f.id} franchise={f} />
                ))}
              </div>

              {/* Financing callout */}
              <div className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start"
                style={{ background: 'var(--cream)', border: '1px solid var(--gold)' }}>
                <div className="text-2xl shrink-0">💰</div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: 'var(--rust-deep)' }}>
                    Financing Your {tier.label} Ontario Franchise
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Most franchise buyers in Canada finance 50–70% of their investment. The Canada Small Business Financing (CSBF) Program
                    provides government-backed loans up to $1.15M, and the Business Development Bank of Canada (BDC) actively funds
                    Ontario franchise acquisitions with repayment terms up to 10 years.
                    {' '}
                    <Link href="/resources#financing" className="font-semibold underline" style={{ color: 'var(--rust-deep)' }}>
                      Explore financing options →
                    </Link>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="text-5xl mb-4">💼</div>
              <p className="font-bold text-gray-700 mb-2">No franchises currently in this range</p>
              <p className="text-sm text-gray-500 mb-6">Try a different investment bracket or browse all Ontario franchises.</p>
              <Link href="/directory" className="btn-red px-6 py-2.5 text-sm inline-block">
                Browse All Franchises
              </Link>
            </div>
          )}

          {/* ── Financing info block ─────────────────────────────────── */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '🏦', title: 'CSBF Program', body: 'Federal government-backed loans covering up to 85% of eligible franchise costs. Available through all major Canadian banks.' },
              { icon: '🇨🇦', title: 'BDC Franchise Loans', body: 'Canada\'s dedicated entrepreneur bank offers flexible franchise financing with repayment terms up to 10 years and no prepayment penalties.' },
              { icon: '📋', title: 'Arthur Wishart Act', body: 'Ontario law requires every franchisor to provide a full Franchise Disclosure Document at least 14 days before any agreement is signed.' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="text-2xl mb-2">{card.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

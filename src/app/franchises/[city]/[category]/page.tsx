import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import SEOBreadcrumb from '@/components/seo/SEOBreadcrumb'
import FranchiseSEOCard from '@/components/seo/FranchiseSEOCard'
import { categories } from '@/data/franchises'
import {
  getCategoryBySlug,
  getCityBySlug,
  getCityCategoryParams,
  getFranchisesForCityCategory,
  getCategorySlug,
} from '@/lib/seo/queries'
import { CATEGORY_META } from '@/lib/seo/data'

const BASE = 'https://www.franchiseontario.com'

interface Props { params: { city: string; category: string } }

export function generateStaticParams() {
  return getCityCategoryParams()
}

export function generateMetadata({ params }: Props): Metadata {
  const city = getCityBySlug(params.city)
  const catName = getCategoryBySlug(params.category)
  if (!city || !catName) return {}

  const listings = getFranchisesForCityCategory(params.city, params.category)

  return {
    title: `${catName} Franchises in ${city.name}, Ontario | FranchiseOntario.com`,
    description: `Find ${catName.toLowerCase()} franchise opportunities available in ${city.name}, Ontario. ${listings.length} franchise${listings.length !== 1 ? 's' : ''} listed — compare investment levels, brands, and support packages.`,
    keywords: [
      `${catName.toLowerCase()} franchise ${city.name}`,
      `${catName.toLowerCase()} franchise ${city.name} Ontario`,
      `franchise opportunities ${city.name}`,
      `buy ${catName.toLowerCase()} franchise ${city.name}`,
      `${city.name} franchise for sale`,
      `Ontario ${catName.toLowerCase()} franchise`,
    ],
    alternates: { canonical: `${BASE}/franchises/${params.city}/${params.category}` },
    openGraph: {
      title: `${catName} Franchises in ${city.name}, Ontario`,
      description: `${listings.length} ${catName.toLowerCase()} franchise opportunities available in ${city.name}, Ontario.`,
      url: `${BASE}/franchises/${params.city}/${params.category}`,
    },
  }
}

export default function CityCategoryPage({ params }: Props) {
  const city = getCityBySlug(params.city)
  const catName = getCategoryBySlug(params.category)
  if (!city || !catName) notFound()

  const listings = getFranchisesForCityCategory(params.city, params.category)
  const catData = categories.find((c) => c.name === catName)
  const meta = CATEGORY_META[catName]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${catName} Franchises in ${city.name}, Ontario`,
    url: `${BASE}/franchises/${params.city}/${params.category}`,
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
              { label: 'Ontario', href: '/ontario' },
              { label: city.name, href: `/ontario/${params.city}` },
              { label: catName },
            ]} />

            <div className="mt-5 flex items-start gap-4">
              {catData && <div className="text-4xl shrink-0 mt-1">{catData.icon}</div>}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'var(--bg-soft)', color: 'var(--text-muted)' }}>
                    {city.region}
                  </span>
                  <span className="text-xs text-gray-400">Pop. {city.population}</span>
                </div>

                <h1
                  className="text-3xl md:text-4xl font-black mb-2"
                  style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
                >
                  {catName} Franchise Opportunities in {city.name}, Ontario
                </h1>

                <p className="text-gray-500 text-sm max-w-2xl mb-3">
                  {listings.length > 0
                    ? `${listings.length} ${catName.toLowerCase()} franchise${listings.length !== 1 ? 's' : ''} available in the Ontario market, each operating or expanding into ${city.name}. ${city.blurb}`
                    : `${catName} franchise opportunities coming soon for ${city.name}. Browse all available franchises in the Ontario market below.`
                  }
                </p>

                {/* Market insight pill */}
                <div className="inline-flex items-center gap-2 text-[11px] font-medium px-3 py-1.5 rounded-full"
                  style={{ background: 'var(--cream)', color: 'var(--rust-deep)' }}>
                  📍 {city.name} · {city.region} · Population {city.population}
                </div>
              </div>
            </div>

            {/* Sibling city links */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 self-center mr-1">
                Other cities:
              </span>
              {['toronto', 'ottawa', 'mississauga', 'hamilton', 'london']
                .filter((s) => s !== params.city)
                .slice(0, 5)
                .map((slug) => {
                  const c = getCityBySlug(slug)
                  return c ? (
                    <Link
                      key={slug}
                      href={`/franchises/${slug}/${params.category}`}
                      className="text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all hover:border-red-300 hover:text-red-600"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'white' }}
                    >
                      {c.name}
                    </Link>
                  ) : null
                })}
              <Link
                href={`/franchises/category/${params.category}`}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{ borderColor: 'var(--rust)', color: 'var(--rust)', background: 'white' }}
              >
                All Ontario →
              </Link>
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

              {/* Arthur Wishart callout */}
              <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start">
                <div className="text-2xl shrink-0">⚖️</div>
                <div>
                  <p className="font-bold text-blue-900 text-sm mb-1">Ontario Franchise Law — Arthur Wishart Act</p>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    All {catName.toLowerCase()} franchises available in {city.name} are governed by Ontario&apos;s Arthur Wishart (Franchise Disclosure) Act.
                    Every franchisor must provide a complete Franchise Disclosure Document at least 14 days before any agreement is signed.
                    {' '}
                    <Link href="/resources#arthur-wishart" className="font-semibold underline hover:no-underline">Learn more about your rights →</Link>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="text-5xl mb-4">{catData?.icon ?? '🔍'}</div>
              <p className="font-bold text-gray-700 mb-2">No {catName} listings currently in {city.name}</p>
              <p className="text-sm text-gray-500 mb-6">Browse province-wide {catName.toLowerCase()} franchises available across Ontario.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href={`/franchises/category/${params.category}`} className="btn-red px-5 py-2.5 text-sm">
                  {catName} Franchises in Ontario
                </Link>
                <Link href={`/ontario/${params.city}`} className="btn-outline px-5 py-2.5 text-sm">
                  All Franchises in {city.name}
                </Link>
              </div>
            </div>
          )}

          {/* ── Browse other categories for this city ─────────────────── */}
          <div className="mt-14 pt-8 border-t border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Other Franchise Categories in {city.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories
                .filter((c) => c.name !== catName)
                .map((c) => (
                  <Link
                    key={c.name}
                    href={`/franchises/${params.city}/${getCategorySlug(c.name)}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:border-red-300 hover:text-red-600"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'white' }}
                  >
                    {c.icon} {c.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

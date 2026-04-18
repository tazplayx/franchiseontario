import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import SEOBreadcrumb from '@/components/seo/SEOBreadcrumb'
import FranchiseSEOCard from '@/components/seo/FranchiseSEOCard'
import { categories } from '@/data/franchises'
import {
  getCategoryBySlug,
  getFranchisesByCategory,
  getAllCategoryParams,
  getCategorySlug,
} from '@/lib/seo/queries'
import { ONTARIO_CITIES, CATEGORY_META } from '@/lib/seo/data'

const BASE = 'https://www.franchiseontario.com'

interface Props { params: { category: string } }

export function generateStaticParams() {
  return getAllCategoryParams()
}

export function generateMetadata({ params }: Props): Metadata {
  const catName = getCategoryBySlug(params.category)
  if (!catName) return {}
  const meta = CATEGORY_META[catName]
  const count = getFranchisesByCategory(params.category).length

  return {
    title: `${catName} Franchise Opportunities in Ontario | FranchiseOntario.com`,
    description: `Browse ${count} ${catName.toLowerCase()} franchise opportunities in Ontario. Compare investment levels, franchise fees, and support packages from leading Canadian brands.`,
    keywords: [
      `${catName.toLowerCase()} franchise Ontario`,
      `${catName.toLowerCase()} franchise opportunities Canada`,
      `buy ${catName.toLowerCase()} franchise Ontario`,
      `${catName.toLowerCase()} franchise investment`,
      `Ontario ${catName.toLowerCase()} franchise for sale`,
    ],
    alternates: { canonical: `${BASE}/franchises/category/${params.category}` },
    openGraph: {
      title: `${catName} Franchise Opportunities in Ontario`,
      description: meta?.description ?? `Find ${catName.toLowerCase()} franchises for sale in Ontario. Browse listings, compare brands, and connect with franchisors.`,
      url: `${BASE}/franchises/category/${params.category}`,
    },
  }
}

export default function CategoryPage({ params }: Props) {
  const catName = getCategoryBySlug(params.category)
  if (!catName) notFound()

  const listings = getFranchisesByCategory(params.category)
  const meta = CATEGORY_META[catName]
  const catData = categories.find((c) => c.name === catName)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${catName} Franchise Opportunities in Ontario`,
    url: `${BASE}/franchises/category/${params.category}`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 10).map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.name,
      url: `${BASE}/directory/${f.id}`,
    })),
  }

  // City nav links — link to city × category combos
  const topCities = ONTARIO_CITIES.filter((c) => c.tier === 'major').slice(0, 8)

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="min-h-screen bg-gray-50">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SEOBreadcrumb items={[
              { label: 'Home', href: '/' },
              { label: 'Categories', href: '/categories' },
              { label: catName },
            ]} />

            <div className="mt-5 flex items-start gap-4">
              {catData && (
                <div className="text-4xl shrink-0 mt-1">{catData.icon}</div>
              )}
              <div>
                <h1
                  className="text-3xl md:text-4xl font-black mb-2"
                  style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}
                >
                  {catName} Franchise Opportunities in Ontario
                </h1>
                <p className="text-gray-500 text-sm max-w-2xl">
                  {listings.length > 0
                    ? `${listings.length} ${catName.toLowerCase()} franchise${listings.length !== 1 ? 's' : ''} available across Ontario. Compare brands, investment levels, and franchise packages below.`
                    : `${catName} franchise listings coming soon. In the meantime, browse all Ontario franchise opportunities.`
                  }
                </p>
              </div>
            </div>

            {/* City filter links */}
            {listings.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 self-center mr-1">Browse by city:</span>
                {topCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/franchises/${city.slug}/${params.category}`}
                    className="text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all hover:border-red-300 hover:text-red-600"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'white' }}
                  >
                    {city.name}
                  </Link>
                ))}
                <Link
                  href="/ontario"
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:border-red-300 hover:text-red-600"
                  style={{ borderColor: 'var(--border)', color: 'var(--rust)', background: 'white' }}
                >
                  All Ontario Cities →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Listings ─────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((f) => (
                <FranchiseSEOCard key={f.id} franchise={f} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="text-5xl mb-4">{catData?.icon ?? '🔍'}</div>
              <p className="font-bold text-gray-700 mb-2">No {catName} listings yet</p>
              <p className="text-sm text-gray-500 mb-6">Check back soon, or browse all Ontario franchise opportunities.</p>
              <Link href="/directory" className="btn-red px-6 py-2.5 text-sm inline-block">
                Browse All Franchises
              </Link>
            </div>
          )}

          {/* ── Related categories ───────────────────────────────────── */}
          {listings.length > 0 && (
            <div className="mt-14 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Explore Other Franchise Categories in Ontario</h2>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => c.name !== catName)
                  .map((c) => (
                    <Link
                      key={c.name}
                      href={`/franchises/category/${getCategorySlug(c.name)}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:border-red-300 hover:text-red-600"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'white' }}
                    >
                      {c.icon} {c.name}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

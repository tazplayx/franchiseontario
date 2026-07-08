import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { franchises } from '@/data/franchises'
import { applyListingStore } from '@/lib/store'
import FranchiseCard from '@/components/FranchiseCard'
import JsonLd from '@/components/JsonLd'

const BASE = 'https://www.franchiseontario.com'

/* ── City + Category definitions ────────────────────────────── */

const CITY_META: Record<string, { label: string; region: string }> = {
  toronto:      { label: 'Toronto',            region: 'Greater Toronto Area' },
  ottawa:       { label: 'Ottawa',             region: 'Eastern Ontario' },
  mississauga:  { label: 'Mississauga',        region: 'Peel Region' },
  brampton:     { label: 'Brampton',           region: 'Peel Region' },
  hamilton:     { label: 'Hamilton',           region: 'Hamilton-Wentworth' },
  london:       { label: 'London',             region: 'Southwestern Ontario' },
  kitchener:    { label: 'Kitchener-Waterloo', region: 'Waterloo Region' },
  windsor:      { label: 'Windsor',            region: 'Essex County' },
  barrie:       { label: 'Barrie',             region: 'Simcoe County' },
  oshawa:       { label: 'Oshawa',             region: 'Durham Region' },
  sudbury:      { label: 'Greater Sudbury',    region: 'Northern Ontario' },
  'thunder-bay':{ label: 'Thunder Bay',        region: 'Northwestern Ontario' },
}

const CAT_META: Record<string, { label: string; franchiseCategory: string }> = {
  'food-and-beverage':  { label: 'Food & Beverage', franchiseCategory: '' },
  'fast-food':          { label: 'Fast Food',        franchiseCategory: 'Fast Food' },
  'coffee':             { label: 'Coffee & Café',    franchiseCategory: 'Coffee & Café' },
  'pizza':              { label: 'Pizza',             franchiseCategory: 'Pizza' },
  'fitness':            { label: 'Fitness',           franchiseCategory: 'Fitness & Wellness' },
  'home-services':      { label: 'Home Services',     franchiseCategory: 'Home Services' },
  'cleaning':           { label: 'Cleaning Services', franchiseCategory: 'Cleaning Services' },
  'education':          { label: 'Education',         franchiseCategory: 'Education' },
  'automotive':         { label: 'Automotive',        franchiseCategory: 'Automotive' },
  'beauty-salon':       { label: 'Beauty & Salon',    franchiseCategory: 'Beauty & Salon' },
  'retail':             { label: 'Retail',             franchiseCategory: 'Retail' },
  'pet-services':       { label: 'Pet Services',       franchiseCategory: 'Pet Services' },
  'senior-care':        { label: 'Senior Care',        franchiseCategory: 'Senior Care' },
  'financial-services': { label: 'Financial Services', franchiseCategory: 'Financial Services' },
  'business-services':  { label: 'Business Services',  franchiseCategory: 'Business Services' },
}

export async function generateStaticParams() {
  const params: { city: string; category: string }[] = []
  for (const city of Object.keys(CITY_META)) {
    for (const category of Object.keys(CAT_META)) {
      params.push({ city, category })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; category: string }>
}): Promise<Metadata> {
  const { city, category } = await params
  const cityMeta = CITY_META[city]
  const catMeta = CAT_META[category]
  if (!cityMeta || !catMeta) return {}

  const title = `${catMeta.label} Franchises in ${cityMeta.label}, Ontario`
  const description = `Browse the top ${catMeta.label.toLowerCase()} franchise opportunities available in ${cityMeta.label}, Ontario. Compare investment ranges, royalties, and brand details — all verified and FDD-ready.`

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/browse/${city}/${category}` },
    openGraph: { title, description, url: `${BASE}/browse/${city}/${category}` },
  }
}

export default async function BrowsePage({
  params,
}: {
  params: Promise<{ city: string; category: string }>
}) {
  const { city, category } = await params
  const cityMeta = CITY_META[city]
  const catMeta = CAT_META[category]
  if (!cityMeta || !catMeta) notFound()

  const allListings = applyListingStore(franchises)

  const filtered = catMeta.franchiseCategory
    ? allListings.filter((f) => f.category === catMeta.franchiseCategory)
    : allListings.filter((f) =>
        ['Fast Food', 'Pizza', 'Coffee & Café', 'Bar & Grill', 'Specialty Food', 'Bakery & Desserts', 'Healthy Eating'].includes(f.category)
      )

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Browse', item: `${BASE}/browse` },
      { '@type': 'ListItem', position: 3, name: cityMeta.label, item: `${BASE}/ontario/${city}` },
      { '@type': 'ListItem', position: 4, name: catMeta.label, item: `${BASE}/browse/${city}/${category}` },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${catMeta.label} Franchises in ${cityMeta.label}`,
    description: `Top ${catMeta.label.toLowerCase()} franchise opportunities available in ${cityMeta.label}, Ontario`,
    url: `${BASE}/browse/${city}/${category}`,
    numberOfItems: filtered.length,
    itemListElement: filtered.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.name,
      url: `${BASE}/directory/${f.id}`,
      description: f.description,
    })),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-5">
            <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
            <span>›</span>
            <Link href="/directory" className="hover:text-gray-700 transition-colors">Directory</Link>
            <span>›</span>
            <Link href={`/ontario/${city}`} className="hover:text-gray-700 transition-colors">{cityMeta.label}</Link>
            <span>›</span>
            <span className="text-gray-700">{catMeta.label}</span>
          </nav>

          <h1
            className="text-2xl md:text-3xl font-black text-gray-900 mb-2"
            style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif' }}
          >
            {catMeta.label} Franchises in {cityMeta.label}, Ontario
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Browse {filtered.length} {catMeta.label.toLowerCase()} franchise opportunities available in {cityMeta.label} ({cityMeta.region}).
            Compare investment ranges and connect directly with franchisors.
          </p>
        </div>
      </div>

      {/* Why this market */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Market</p>
              <p className="text-sm font-bold text-gray-900">{cityMeta.label}, {cityMeta.region}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Listings</p>
              <p className="text-sm font-bold text-gray-900">{filtered.length} {catMeta.label} brands</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Arthur Wishart Act</p>
              <p className="text-sm font-bold text-gray-900">Ontario buyer protection applies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-4">No {catMeta.label.toLowerCase()} franchises found yet.</p>
            <Link href="/directory" className="text-sm font-semibold text-red-600 hover:underline">Browse all franchises →</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
              {filtered.map((f) => (
                <FranchiseCard key={f.id} franchise={f} />
              ))}
            </div>

            {/* SEO content block */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-3xl">
              <h2 className="text-lg font-black text-gray-900 mb-3" style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif' }}>
                Starting a {catMeta.label} Franchise in {cityMeta.label}
              </h2>
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  {cityMeta.label} is one of Ontario's most active markets for franchise investment. The {cityMeta.region} region supports a strong consumer base, skilled workforce, and growing suburban corridors — all key factors when evaluating a {catMeta.label.toLowerCase()} franchise territory.
                </p>
                <p>
                  As an Ontario franchise buyer, you are protected by the <strong>Arthur Wishart Act (Franchise Disclosure), 2000</strong>. Franchisors must provide a complete Franchise Disclosure Document (FDD) at least <strong>14 days</strong> before you sign any agreement or pay any money. Always have a qualified Ontario franchise lawyer review your FDD.
                </p>
                <p>
                  Compare the {filtered.length} {catMeta.label.toLowerCase()} brands above across investment range, royalty structure, training, and territory exclusivity before making contact. FranchiseOntario.com connects buyers directly with franchisors — free of charge.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/resources#arthur-wishart"
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Arthur Wishart Act guide →
                </Link>
                <Link
                  href="/resources#checklist"
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Due diligence checklist →
                </Link>
                <Link
                  href={`/directory?category=${encodeURIComponent(catMeta.franchiseCategory || catMeta.label)}`}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  All {catMeta.label} franchises →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

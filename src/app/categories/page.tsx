import type { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp, Star, MapPin } from 'lucide-react'
import { franchises, categories } from '@/data/franchises'
import JsonLd from '@/components/JsonLd'
import { getCategorySlug } from '@/lib/seo/queries'

export const metadata: Metadata = {
  title: 'Ontario Franchise Categories — Browse by Industry',
  description:
    'Browse Ontario franchise opportunities by industry category: Bar & Grill, Coffee & Café, Seafood, Fast Food, Fitness, Retail, Home Services, Automotive, Education, Beauty, Pet Services, and more.',
  keywords: ['franchise categories Ontario', 'food franchise Ontario', 'fitness franchise Canada', 'home services franchise Ontario', 'retail franchise Ontario'],
  alternates: { canonical: 'https://www.franchiseontario.com/categories' },
  openGraph: {
    title: 'Ontario Franchise Categories — Browse by Industry',
    description: 'Find franchise opportunities in your preferred industry across Ontario, Canada.',
    url: 'https://www.franchiseontario.com/categories',
  },
}

const categoriesSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://www.franchiseontario.com/categories#webpage',
  name: 'Ontario Franchise Categories — Browse by Industry',
  url: 'https://www.franchiseontario.com/categories',
  description: 'Browse Ontario franchise opportunities by industry category.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.franchiseontario.com' },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://www.franchiseontario.com/categories' },
    ],
  },
  about: {
    '@type': 'ItemList',
    name: 'Franchise Industry Categories in Ontario',
    itemListElement: categories.map((cat, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: cat.name,
      url: `https://www.franchiseontario.com/directory?category=${encodeURIComponent(cat.name)}`,
    })),
  },
}

export default function CategoriesPage() {
  // Build category stats
  const categoryData = categories.map((cat) => {
    const members = franchises.filter((f) => f.category === cat.name)
    const topFranchise = members.sort((a, b) => a.rank - b.rank)[0]
    const avgRating = members.length
      ? (members.reduce((s, f) => s + f.rating, 0) / members.length).toFixed(1)
      : '—'
    const totalLocations = members.reduce((s, f) => s + f.locations, 0)
    return { ...cat, members, topFranchise, avgRating, totalLocations }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={categoriesSchema} />
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-14 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Franchise Categories in Ontario
          </h1>
          <p className="text-gray-500 text-sm">
            Explore franchise opportunities organized by industry — from food & beverage to automotive, fitness, and beyond.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Quick jump */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Jump to Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={`#${cat.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 hover:border-red-300 hover:text-red-600 transition-all bg-white"
                style={{ color: cat.color }}
              >
                {cat.icon} {cat.name}
              </a>
            ))}
          </div>
        </div>

        {/* Category cards */}
        <div className="space-y-6">
          {categoryData.map((cat, idx) => (
            <section
              key={cat.name}
              id={cat.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Category header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ background: `${cat.bg}` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ background: `${cat.color}20`, border: `2px solid ${cat.color}30` }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">{cat.name}</h2>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">
                        <strong className="text-gray-700">{cat.members.length}</strong> listing{cat.members.length !== 1 ? 's' : ''}
                      </span>
                      {cat.members.length > 0 && (
                        <>
                          <span className="text-gray-300">·</span>
                          <span className="text-xs text-gray-500">
                            Avg rating <strong className="text-gray-700">{cat.avgRating}</strong>⭐
                          </span>
                          {cat.totalLocations > 0 && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className="text-xs text-gray-500">
                                <strong className="text-gray-700">{cat.totalLocations}+</strong> Ontario locations
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/franchises/category/${getCategorySlug(cat.name)}`}
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border"
                  style={{ color: cat.color, borderColor: `${cat.color}40`, background: `${cat.color}10` }}
                >
                  View All →
                </Link>
              </div>

              {/* Members */}
              <div className="p-5">
                {cat.members.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400">No franchises in this category yet.</p>
                    <Link href="/register" className="text-sm text-red-600 hover:underline font-medium mt-1 inline-block">
                      List the first one →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {cat.members.sort((a, b) => a.rank - b.rank).map((franchise, fi) => (
                      <Link
                        key={franchise.id}
                        href={`/directory/${franchise.id}`}
                        className="group flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all bg-gray-50/50 hover:bg-white"
                      >
                        {/* Logo */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-sm"
                          style={{ background: franchise.logoBg, color: franchise.logoColor }}
                        >
                          {franchise.logoInitials}
                        </div>
                        <div className="min-w-0">
                          {/* Rank */}
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-black text-gray-300">#{fi + 1}</span>
                            {franchise.isVIP && (
                              <span className="vip-badge text-[9px] px-1.5 py-0.5 rounded-full">VIP</span>
                            )}
                            {franchise.tier === 'premium' && (
                              <span className="bg-blue-100 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">PRO</span>
                            )}
                          </div>
                          <h3 className="text-xs font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                            {franchise.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-amber-400 text-[10px]">★</span>
                            <span className="text-[10px] font-semibold text-gray-600">{franchise.rating}</span>
                            <span className="text-[10px] text-gray-400">·</span>
                            <span className="text-[10px] text-gray-400">{franchise.locations}+ loc</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Ranking explanation for active categories */}
              {cat.members.length > 0 && (
                <div className="px-5 pb-4">
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <TrendingUp size={10} />
                    Rankings based on popularity score, rating, number of reviews, and Ontario locations.
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Add to category CTA */}
        <div className="mt-10 bg-red-600 rounded-2xl p-8 text-center text-white">
          <div className="text-3xl mb-3">🏢</div>
          <h2 className="text-xl font-black mb-2 text-white">Don't See Your Category?</h2>
          <p className="text-red-100 text-sm mb-5 max-w-md mx-auto">
            We're always adding new categories. List your franchise and select your category — we'll make sure you're found.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors">
            List Your Franchise Free →
          </Link>
        </div>
      </div>
    </div>
  )
}

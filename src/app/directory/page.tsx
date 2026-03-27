'use client'
import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, TrendingUp, Star, Crown, Zap } from 'lucide-react'
import { franchises, categories } from '@/data/franchises'
import FranchiseCard from '@/components/FranchiseCard'
import type { FranchiseTier } from '@/data/franchises'

type SortKey = 'rank' | 'rating' | 'newest' | 'alpha' | 'locations'

export default function DirectoryPage() {
  const [query, setQuery] = useState('')
  const [tier, setTier] = useState<FranchiseTier | 'all'>('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortKey>('rank')

  const filtered = useMemo(() => {
    let list = [...franchises]

    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.tagline.toLowerCase().includes(q)
      )
    }
    if (tier !== 'all') list = list.filter((f) => f.tier === tier)
    if (category !== 'all') list = list.filter((f) => f.category === category)

    switch (sort) {
      case 'rank':      list.sort((a, b) => a.rank - b.rank); break
      case 'rating':    list.sort((a, b) => b.rating - a.rating); break
      case 'newest':    list.sort((a, b) => b.established - a.established); break
      case 'alpha':     list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'locations': list.sort((a, b) => b.locations - a.locations); break
    }

    return list
  }, [query, tier, category, sort])

  const tierCounts = {
    all: franchises.length,
    enterprise: franchises.filter((f) => f.tier === 'enterprise').length,
    premium: franchises.filter((f) => f.tier === 'premium').length,
    basic: franchises.filter((f) => f.tier === 'basic').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Ontario Franchise Directory
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Browse {franchises.length} franchise listings across {categories.length} categories in Ontario
          </p>

          {/* Search */}
          <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl">
            <div className="pl-4 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, or keyword..."
              className="flex-1 px-3 py-3.5 text-sm text-gray-700 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="px-3 text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0 space-y-5">
            {/* Tier filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Crown size={14} className="text-amber-500" />
                Listing Tier
              </h3>
              <div className="space-y-2">
                {(
                  [
                    { key: 'all', label: 'All Tiers', icon: null },
                    { key: 'enterprise', label: 'Enterprise', icon: <Crown size={12} className="text-amber-500" /> },
                    { key: 'premium', label: 'Premium', icon: <Zap size={12} className="text-blue-500" /> },
                    { key: 'basic', label: 'Basic', icon: null },
                  ] as { key: FranchiseTier | 'all'; label: string; icon: React.ReactNode }[]
                ).map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setTier(key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      tier === key
                        ? 'bg-red-600 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {icon}
                      {label}
                    </span>
                    <span className={`text-xs ${tier === key ? 'text-red-100' : 'text-gray-400'}`}>
                      {tierCounts[key]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-gray-400" />
                Category
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                    category === 'all' ? 'bg-red-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`w-full flex items-center gap-2 text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                      category === cat.name ? 'bg-red-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List CTA */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-4 text-white">
              <div className="text-2xl mb-2">🏢</div>
              <h4 className="font-bold text-sm mb-1">List Your Franchise</h4>
              <p className="text-red-100 text-xs mb-3">Start free — no credit card required</p>
              <a href="/register" className="block text-center bg-white text-red-600 font-bold text-xs py-2 rounded-lg hover:bg-red-50 transition-colors">
                Get Started →
              </a>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{filtered.length}</span> franchises
                {query && <span> for "<span className="text-red-600">{query}</span>"</span>}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 whitespace-nowrap">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-red-400"
                >
                  <option value="rank">Top Ranked</option>
                  <option value="rating">Highest Rated</option>
                  <option value="locations">Most Locations</option>
                  <option value="newest">Newest</option>
                  <option value="alpha">A–Z</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-gray-800 mb-1">No franchises found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setQuery(''); setTier('all'); setCategory('all') }}
                  className="mt-4 text-sm text-red-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((franchise) => (
                  <FranchiseCard key={franchise.id} franchise={franchise} showRank />
                ))}
              </div>
            )}

            {/* Load more placeholder */}
            <div className="mt-8 text-center">
              <button className="btn-red px-8 py-3 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">
                Load More Franchises — Coming Soon
              </button>
              <p className="text-xs text-gray-400 mt-2">More franchises being added daily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, TrendingUp, Star, Crown, Zap, DollarSign, MapPin, Filter, X } from 'lucide-react'
import { franchises, categories } from '@/data/franchises'
import FranchiseCard from '@/components/FranchiseCard'
import type { FranchiseTier } from '@/data/franchises'
import Link from 'next/link'

type SortKey = 'rank' | 'rating' | 'newest' | 'alpha' | 'locations'
type InvestmentBracket = 'all' | 'under150' | '150to350' | '350to600' | 'over600'

const investmentBrackets: { key: InvestmentBracket; label: string; sub: string }[] = [
  { key: 'all', label: 'Any Budget', sub: '' },
  { key: 'under150', label: 'Under $150K', sub: 'Lower-cost concepts' },
  { key: '150to350', label: '$150K – $350K', sub: 'Mid-market' },
  { key: '350to600', label: '$350K – $600K', sub: 'Full-service' },
  { key: 'over600', label: '$600K+', sub: 'Premium flagship' },
]

export default function DirectoryPage() {
  const [query, setQuery] = useState('')
  const [tier, setTier] = useState<FranchiseTier | 'all'>('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortKey>('rank')
  const [investment, setInvestment] = useState<InvestmentBracket>('all')
  const [compareList, setCompareList] = useState<string[]>([])

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

    if (investment !== 'all') {
      list = list.filter((f) => {
        const min = f.financials.investmentMin
        const max = f.financials.investmentMax
        if (investment === 'under150') return min < 150000
        if (investment === '150to350') return min >= 100000 && min <= 350000
        if (investment === '350to600') return min >= 250000 && max <= 750000
        if (investment === 'over600') return max >= 600000
        return true
      })
    }

    switch (sort) {
      case 'rank':      list.sort((a, b) => a.rank - b.rank); break
      case 'rating':    list.sort((a, b) => b.rating - a.rating); break
      case 'newest':    list.sort((a, b) => b.established - a.established); break
      case 'alpha':     list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'locations': list.sort((a, b) => b.locations - a.locations); break
    }

    return list
  }, [query, tier, category, sort, investment])

  const tierCounts = {
    all: franchises.length,
    enterprise: franchises.filter((f) => f.tier === 'enterprise').length,
    premium: franchises.filter((f) => f.tier === 'premium').length,
    basic: franchises.filter((f) => f.tier === 'basic').length,
  }

  const activeFiltersCount = [
    tier !== 'all',
    category !== 'all',
    investment !== 'all',
    query !== '',
  ].filter(Boolean).length

  function clearAllFilters() {
    setQuery('')
    setTier('all')
    setCategory('all')
    setInvestment('all')
    setSort('rank')
  }

  function toggleCompare(id: string) {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Ontario Franchise Directory
          </h1>
          <p className="text-gray-500 text-sm mb-5">
            Browse {franchises.length} franchise listings across {categories.length} categories in Ontario
          </p>

          {/* Search */}
          <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden max-w-2xl focus-within:border-red-400 transition-colors">
            <div className="pl-4 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, or keyword..."
              className="flex-1 px-3 py-3 text-sm text-gray-700 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="px-3 text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>

          {/* Quick investment filter pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-gray-500 self-center mr-1 font-medium">Budget:</span>
            {investmentBrackets.map((b) => (
              <button
                key={b.key}
                onClick={() => setInvestment(b.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  investment === b.key
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compare bar */}
      {compareList.length > 0 && (
        <div className="bg-blue-600 text-white py-3 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-sm font-bold shrink-0">Compare ({compareList.length}/3):</span>
            <div className="flex gap-2 flex-wrap">
              {compareList.map((id) => {
                const f = franchises.find(x => x.id === id)
                return f ? (
                  <span key={id} className="bg-blue-500 border border-blue-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    {f.name}
                    <button onClick={() => toggleCompare(id)} className="hover:text-red-300">✕</button>
                  </span>
                ) : null
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {compareList.length >= 2 && (
              <Link
                href={`/compare?ids=${compareList.join(',')}`}
                className="bg-white text-blue-600 font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-blue-50 transition-colors"
              >
                Compare Now →
              </Link>
            )}
            <button
              onClick={() => setCompareList([])}
              className="text-blue-200 hover:text-white text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0 space-y-5">

            {/* Active filters count */}
            {activeFiltersCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Filter size={14} className="text-red-500" />
                  <span className="text-red-700 font-semibold">{activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active</span>
                </div>
                <button onClick={clearAllFilters} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                  <X size={12} /> Clear all
                </button>
              </div>
            )}

            {/* Investment filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <DollarSign size={14} className="text-green-500" />
                Investment Budget
              </h3>
              <div className="space-y-2">
                {investmentBrackets.map(({ key, label, sub }) => (
                  <button
                    key={key}
                    onClick={() => setInvestment(key)}
                    className={`w-full flex flex-col items-start px-3 py-2 rounded-lg text-sm transition-all ${
                      investment === key
                        ? 'bg-red-600 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{label}</span>
                    {sub && <span className={`text-[10px] mt-0.5 ${investment === key ? 'text-red-100' : 'text-gray-400'}`}>{sub}</span>}
                  </button>
                ))}
              </div>
            </div>

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

            {/* Quiz CTA */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-4 text-white">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-bold text-sm mb-1">Not sure where to start?</h4>
              <p className="text-red-100 text-xs mb-3">Take our 2-min Franchise Fit Quiz to find your perfect match.</p>
              <Link href="/quiz" className="block text-center bg-white text-red-600 font-bold text-xs py-2 rounded-lg hover:bg-red-50 transition-colors">
                Take the Quiz →
              </Link>
            </div>

            {/* List CTA */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-white">
              <div className="text-2xl mb-2">🏢</div>
              <h4 className="font-bold text-sm mb-1">List Your Franchise</h4>
              <p className="text-gray-400 text-xs mb-3">Start free — no credit card required</p>
              <Link href="/register" className="block text-center bg-white text-gray-900 font-bold text-xs py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Get Started →
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{filtered.length}</span> franchises
                  {query && <span> for "<span className="text-red-600">{query}</span>"</span>}
                </p>
                {compareList.length < 3 && filtered.length > 0 && (
                  <span className="text-xs text-gray-400 hidden sm:inline">Select up to 3 to compare →</span>
                )}
              </div>
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
                <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((franchise) => (
                  <div key={franchise.id} className="relative">
                    <FranchiseCard franchise={franchise} showRank />
                    {/* Compare checkbox */}
                    <div className="absolute top-2 left-2 z-20">
                      <label className="flex items-center gap-1.5 bg-white/90 backdrop-blur border border-gray-200 rounded-full px-2.5 py-1 cursor-pointer shadow-sm hover:border-blue-400 transition-all group">
                        <input
                          type="checkbox"
                          checked={compareList.includes(franchise.id)}
                          onChange={() => toggleCompare(franchise.id)}
                          disabled={!compareList.includes(franchise.id) && compareList.length >= 3}
                          className="w-3 h-3 accent-blue-600"
                        />
                        <span className="text-[10px] font-semibold text-gray-600 group-hover:text-blue-600">
                          {compareList.includes(franchise.id) ? 'Added' : 'Compare'}
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination placeholder */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 mb-3">More franchise brands being added regularly.</p>
              <Link href="/register" className="text-sm text-red-600 font-medium hover:underline">
                Add your franchise listing →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

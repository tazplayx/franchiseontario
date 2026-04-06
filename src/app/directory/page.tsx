'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, Crown, Zap, DollarSign, Filter, X, ArrowRight } from 'lucide-react'
import { franchises, categories } from '@/data/franchises'
import type { Franchise, FranchiseTier } from '@/data/franchises'
import FranchiseCard from '@/components/FranchiseCard'
import Link from 'next/link'
import { applyListingStore } from '@/lib/store'

type SortKey = 'rank' | 'rating' | 'newest' | 'alpha' | 'locations'
type InvestmentBracket = 'all' | 'under150' | '150to350' | '350to600' | 'over600'

const PAGE_SIZE = 10

const investmentBrackets: { key: InvestmentBracket; label: string; sub: string }[] = [
  { key: 'all', label: 'Any Budget', sub: '' },
  { key: 'under150', label: 'Under $150K', sub: 'Lower-cost concepts' },
  { key: '150to350', label: '$150K – $350K', sub: 'Mid-market' },
  { key: '350to600', label: '$350K – $600K', sub: 'Full-service' },
  { key: 'over600', label: '$600K+', sub: 'Premium flagship' },
]

export default function DirectoryPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [tier, setTier] = useState<FranchiseTier | 'all'>('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortKey>('rank')
  const [investment, setInvestment] = useState<InvestmentBracket>('all')
  const [compareList, setCompareList] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Live search dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownFranchises, setDropdownFranchises] = useState<Franchise[]>([])
  const [dropdownCategories, setDropdownCategories] = useState<typeof categories>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Apply localStorage overrides (admin edits + removals + approved pending) on the client
  const [liveListings, setLiveListings] = useState<Franchise[]>(franchises)
  const SEED_IDS = useMemo(() => new Set(franchises.map((f) => f.id)), [])
  useEffect(() => {
    setLiveListings(applyListingStore(franchises))
  }, [])

  // Seed filters from URL params (?q=… and ?category=…)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    const cat = params.get('category')
    const sortParam = params.get('sort') as SortKey | null
    const tierParam = params.get('tier') as FranchiseTier | null
    if (q) setQuery(q)
    if (cat) setCategory(cat)
    if (sortParam) setSort(sortParam)
    if (tierParam) setTier(tierParam)
  }, [])

  // Live dropdown — fires on every keystroke
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      setDropdownFranchises([])
      setDropdownCategories([])
      setDropdownOpen(false)
      return
    }

    // Match franchises by brand name, tagline, or category
    const matchedFranchises = liveListings
      .filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.tagline.toLowerCase().includes(q)
      )
      .slice(0, 6)

    // Match categories by name
    const matchedCategories = categories
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 3)

    setDropdownFranchises(matchedFranchises)
    setDropdownCategories(matchedCategories)
    setDropdownOpen(matchedFranchises.length > 0 || matchedCategories.length > 0)
  }, [query, liveListings])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goToListing = (id: string) => {
    setDropdownOpen(false)
    router.push(SEED_IDS.has(id) ? `/directory/${id}` : `/contact`)
  }

  const pickCategory = (catName: string) => {
    setDropdownOpen(false)
    setCategory(catName)
  }

  const filtered = useMemo(() => {
    let list = [...liveListings]

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
  }, [query, tier, category, sort, investment, liveListings])

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1) }, [query, tier, category, sort, investment, liveListings])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goToPage(p: number) {
    setPage(p)
    // Scroll results area back to top smoothly
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const tierCounts = {
    all: liveListings.length,
    enterprise: liveListings.filter((f) => f.tier === 'enterprise').length,
    premium: liveListings.filter((f) => f.tier === 'premium').length,
    basic: liveListings.filter((f) => f.tier === 'basic').length,
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
            Ontario Franchise Directory — Canada-Wide Brands
          </h1>
          <p className="text-gray-500 text-sm mb-5">
            Browse {liveListings.length} franchise listings across {categories.length} categories — Ontario-based brands and Canada's top national concepts
          </p>

          {/* Search with live dropdown */}
          <div ref={searchRef} className="relative max-w-2xl">
            <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-red-400 transition-colors">
              <div className="pl-4 text-gray-400 shrink-0">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setDropdownOpen(false)
                }}
                onFocus={() => (dropdownFranchises.length > 0 || dropdownCategories.length > 0) && setDropdownOpen(true)}
                placeholder="Search by brand name, category, or keyword..."
                className="flex-1 px-3 py-3 text-sm text-gray-700 outline-none bg-transparent"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setDropdownOpen(false) }}
                  className="px-3 text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Live dropdown */}
            {dropdownOpen && (dropdownFranchises.length > 0 || dropdownCategories.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden">

                {/* Category shortcuts */}
                {dropdownCategories.length > 0 && (
                  <>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">
                      Browse Category
                    </p>
                    {dropdownCategories.map((cat) => (
                      <button
                        key={cat.name}
                        onMouseDown={() => pickCategory(cat.name)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                      >
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                          style={{ background: cat.bg }}
                        >
                          {cat.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm">{cat.name}</div>
                          <div className="text-[11px] text-gray-400">Filter by category</div>
                        </div>
                        <ArrowRight size={13} className="text-gray-300 shrink-0" />
                      </button>
                    ))}
                  </>
                )}

                {/* Brand results */}
                {dropdownFranchises.length > 0 && (
                  <>
                    <p className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pb-1 ${dropdownCategories.length > 0 ? 'pt-2 border-t border-gray-100 mt-1' : 'pt-3'}`}>
                      Matching Brands
                    </p>
                    {dropdownFranchises.map((f) => (
                      <button
                        key={f.id}
                        onMouseDown={() => goToListing(f.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-gray-50 first:border-0"
                      >
                        {f.logoUrl ? (
                          <img
                            src={f.logoUrl}
                            alt=""
                            className="w-9 h-9 rounded-xl object-contain bg-gray-50 border border-gray-100 shrink-0 p-0.5"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0"
                            style={{ background: f.logoBg, color: f.logoColor }}
                          >
                            {f.logoInitials}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm leading-tight truncate">{f.name}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{f.category} · {f.city}</div>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          f.tier === 'enterprise' ? 'bg-amber-100 text-amber-700' :
                          f.tier === 'premium' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {f.tier.toUpperCase()}
                        </span>
                        <ArrowRight size={13} className="text-gray-300 shrink-0" />
                      </button>
                    ))}
                  </>
                )}

                {/* See all */}
                <button
                  onMouseDown={() => setDropdownOpen(false)}
                  className="w-full px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 text-left"
                >
                  See all {filtered.length} results below →
                </button>
              </div>
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
                {investment === b.key && ' ✓'}
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
                const f = liveListings.find(x => x.id === id)
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

            {/* Active filters summary */}
            {activeFiltersCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Filter size={14} className="text-red-500" />
                    <span className="text-red-700 font-semibold">{activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active</span>
                  </div>
                  <button onClick={clearAllFilters} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                    <X size={12} /> Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {query && (
                    <span className="inline-flex items-center gap-1 bg-white border border-red-200 text-red-700 text-[11px] font-semibold px-2 py-1 rounded-full">
                      Search: "{query}"
                      <button onMouseDown={() => setQuery('')}><X size={10} /></button>
                    </span>
                  )}
                  {tier !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-white border border-red-200 text-red-700 text-[11px] font-semibold px-2 py-1 rounded-full capitalize">
                      Tier: {tier}
                      <button onMouseDown={() => setTier('all')}><X size={10} /></button>
                    </span>
                  )}
                  {category !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-white border border-red-200 text-red-700 text-[11px] font-semibold px-2 py-1 rounded-full">
                      {categories.find(c => c.name === category)?.icon} {category}
                      <button onMouseDown={() => setCategory('all')}><X size={10} /></button>
                    </span>
                  )}
                  {investment !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-white border border-red-200 text-red-700 text-[11px] font-semibold px-2 py-1 rounded-full">
                      {investmentBrackets.find(b => b.key === investment)?.label}
                      <button onMouseDown={() => setInvestment('all')}><X size={10} /></button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Investment filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <DollarSign size={14} className="text-green-500" />
                Investment Budget
              </h3>
              <div className="space-y-1.5">
                {investmentBrackets.map(({ key, label, sub }) => (
                  <button
                    key={key}
                    onClick={() => setInvestment(key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                      investment === key
                        ? 'bg-red-600 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span>{label}</span>
                      {sub && <span className={`text-[10px] mt-0.5 ${investment === key ? 'text-red-100' : 'text-gray-400'}`}>{sub}</span>}
                    </div>
                    {investment === key && (
                      <span className="text-white text-xs font-bold ml-2">✓</span>
                    )}
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
              <div className="space-y-1.5">
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
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs ${tier === key ? 'text-red-100' : 'text-gray-400'}`}>
                        {tierCounts[key]}
                      </span>
                      {tier === key && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
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
                  className={`w-full flex items-center justify-between text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                    category === 'all' ? 'bg-red-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>All Categories</span>
                  {category === 'all' && <span className="text-white text-xs font-bold">✓</span>}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`w-full flex items-center justify-between text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                      category === cat.name ? 'bg-red-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    {category === cat.name && <span className="text-white text-xs font-bold shrink-0">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz CTA */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-4 text-white">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-bold text-sm mb-1 text-white">Not sure where to start?</h4>
              <p className="text-red-100 text-xs mb-3">Take our 2-min Franchise Fit Quiz to find your perfect match.</p>
              <Link href="/quiz" className="block text-center bg-white text-red-600 font-bold text-xs py-2 rounded-lg hover:bg-red-50 transition-colors">
                Take the Quiz →
              </Link>
            </div>

            {/* List CTA */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-white">
              <div className="text-2xl mb-2">🏢</div>
              <h4 className="font-bold text-sm mb-1 text-white">List Your Franchise</h4>
              <p className="text-gray-400 text-xs mb-3">Start free — no credit card required</p>
              <Link href="/register" className="block text-center bg-white text-gray-900 font-bold text-xs py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Get Started →
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500">
                  {filtered.length === 0 ? (
                    <>No results</>
                  ) : (
                    <>
                      Showing{' '}
                      <span className="font-semibold text-gray-900">
                        {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-semibold text-gray-900">{filtered.length}</span>{' '}
                      franchise{filtered.length !== 1 ? 's' : ''}
                      {query && <span> for &ldquo;<span className="text-red-600">{query}</span>&rdquo;</span>}
                    </>
                  )}
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

            {/* Active filter chips — inline above results */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-gray-500 font-medium">Filtering by:</span>
                {query && (
                  <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Search size={11} />
                    &ldquo;{query}&rdquo;
                    <button onClick={() => setQuery('')} className="hover:text-red-900 ml-0.5">
                      <X size={11} />
                    </button>
                  </span>
                )}
                {tier !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                    <Crown size={11} />
                    {tier}
                    <button onClick={() => setTier('all')} className="hover:text-amber-900 ml-0.5">
                      <X size={11} />
                    </button>
                  </span>
                )}
                {category !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {categories.find(c => c.name === category)?.icon}
                    {category}
                    <button onClick={() => setCategory('all')} className="hover:text-blue-900 ml-0.5">
                      <X size={11} />
                    </button>
                  </span>
                )}
                {investment !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <DollarSign size={11} />
                    {investmentBrackets.find(b => b.key === investment)?.label}
                    <button onClick={() => setInvestment('all')} className="hover:text-green-900 ml-0.5">
                      <X size={11} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-400 hover:text-red-600 font-medium underline underline-offset-2 ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

          <div ref={resultsRef} className="scroll-mt-4" />
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
                {paginated.map((franchise) => (
                  <div key={franchise.id} className="relative">
                    <FranchiseCard
                      franchise={franchise}
                      showRank
                      detailHref={SEED_IDS.has(franchise.id) ? undefined : `mailto:${franchise.email}`}
                    />
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {/* Prev */}
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>

                  {/* Page numbers */}
                  {(() => {
                    const pages: (number | '…')[] = []
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i)
                    } else {
                      pages.push(1)
                      if (page > 3) pages.push('…')
                      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
                      if (page < totalPages - 2) pages.push('…')
                      pages.push(totalPages)
                    }
                    return pages.map((p, i) =>
                      p === '…' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => goToPage(p as number)}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all ${
                            page === p
                              ? 'bg-red-600 text-white border-red-600 shadow-sm'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )
                  })()}

                  {/* Next */}
                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Page {page} of {totalPages} · {filtered.length} total listings
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
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

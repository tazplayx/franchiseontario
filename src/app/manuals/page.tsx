'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { BookOpen, Lock, Download, Clock, FileText, Search, ChevronRight, Star, X } from 'lucide-react'
import { MANUALS, CATEGORIES, type ManualCategory } from '@/data/manuals/index'
import { getSession } from '@/lib/leads'

const CATEGORY_COLORS: Record<ManualCategory, string> = {
  'Getting Started':    'bg-blue-50 text-blue-700 border-blue-200',
  'Legal & Regulatory': 'bg-purple-50 text-purple-700 border-purple-200',
  'Financial':          'bg-green-50 text-green-700 border-green-200',
  'Operations':         'bg-orange-50 text-orange-700 border-orange-200',
  'Marketing':          'bg-pink-50 text-pink-700 border-pink-200',
  'Human Resources':    'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Growth':             'bg-amber-50 text-amber-700 border-amber-200',
}

export default function ManualsPage() {
  const session = typeof window !== 'undefined' ? getSession() : null
  const tier = session?.tier ?? null
  const isPaid = tier === 'premium' || tier === 'enterprise'

  const [search, setSearch] = useState('')
  const [cat, setCat] = useState<ManualCategory | 'All'>('All')

  const filtered = useMemo(() => MANUALS.filter((m) => {
    const q = search.toLowerCase()
    const matchQ = !q || m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    const matchC = cat === 'All' || m.category === cat
    return matchQ && matchC
  }), [search, cat])

  function canRead(access: 'free' | 'member') {
    if (access === 'free') return !!session
    return isPaid
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#00228e] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <BookOpen size={14} /> Franchise Owner Resource Library
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Master Your Ontario Franchise
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">
            30 comprehensive manuals written specifically for Ontario franchise owners — covering everything from the Arthur Wishart Act to multi-unit expansion.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><FileText size={14} /><strong className="text-white">30</strong> manuals</span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} /><strong className="text-white">2</strong> free with registration</span>
            <span className="flex items-center gap-1.5"><Download size={14} />All downloadable as PDF</span>
            <span className="flex items-center gap-1.5"><Star size={14} />Ontario-specific content</span>
          </div>
        </div>
      </div>

      {/* Access banner */}
      {!session && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-amber-800 font-medium">
              📖 Register free to access 2 manuals instantly. Upgrade to Premium for all 30.
            </p>
            <div className="flex gap-2">
              <Link href="/register" className="bg-[#00228e] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
                Register Free
              </Link>
              <Link href="/pricing" className="bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      )}
      {session && !isPaid && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-blue-800 font-medium">
              ✅ You have access to 2 free manuals. <strong>Upgrade to Premium</strong> to unlock all 30.
            </p>
            <Link href="/pricing" className="bg-[#00228e] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
              Unlock All 30 →
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="relative flex-1 min-w-52">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search manuals…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-400 shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['All', ...CATEGORIES] as const).map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${cat === c ? 'bg-[#00228e] text-white border-[#00228e]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-5">{filtered.length} manual{filtered.length !== 1 ? 's' : ''}</p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((manual) => {
            const unlocked = canRead(manual.access)
            return (
              <div key={manual.id}
                className={`bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all hover:shadow-md ${unlocked ? 'border-gray-200 hover:border-blue-200' : 'border-gray-200'}`}>
                {/* Card top */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl">{manual.icon}</span>
                    <div className="flex flex-col items-end gap-1.5">
                      {manual.access === 'free' ? (
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">FREE</span>
                      ) : (
                        <span className="text-[10px] font-bold bg-[#00228e]/10 text-[#00228e] border border-[#00228e]/20 px-2 py-0.5 rounded-full">MEMBERS</span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[manual.category]}`}>
                        {manual.category}
                      </span>
                    </div>
                  </div>

                  <div className="mb-1 text-xs font-semibold text-gray-400">Manual #{manual.id}</div>
                  <h3 className="font-black text-gray-900 text-sm leading-snug mb-1">{manual.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{manual.description}</p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={10} />{manual.readTime} min read</span>
                    <span className="flex items-center gap-1"><FileText size={10} />{manual.pages} pages</span>
                  </div>
                </div>

                {/* Card actions */}
                <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex gap-2">
                  {unlocked ? (
                    <>
                      <Link href={`/manuals/${manual.slug}`}
                        className="flex-1 bg-[#00228e] hover:bg-blue-900 text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5">
                        <BookOpen size={12} /> Read Now
                      </Link>
                      <Link href={`/manuals/${manual.slug}?print=1`} target="_blank"
                        className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors">
                        <Download size={12} />
                      </Link>
                    </>
                  ) : (
                    <Link href={session ? '/pricing' : '/register'}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-bold py-2.5 rounded-xl border border-gray-200 transition-colors">
                      <Lock size={12} /> {session ? 'Upgrade to Read' : 'Register to Unlock'}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No manuals match your search</p>
            <button onClick={() => { setSearch(''); setCat('All') }} className="text-xs text-blue-600 mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        )}

        {/* Upgrade CTA */}
        {!isPaid && (
          <div className="mt-16 bg-gradient-to-br from-[#00228e] to-blue-800 rounded-3xl p-8 text-white text-center">
            <div className="text-4xl mb-3">📚</div>
            <h2 className="text-2xl font-black mb-2">Unlock All 30 Manuals</h2>
            <p className="text-blue-200 text-sm max-w-md mx-auto mb-6">
              Get instant access to every manual in the collection — Ontario-specific, franchise-focused, and written by industry experts.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/pricing"
                className="bg-white text-[#00228e] font-black px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2">
                See Membership Plans <ChevronRight size={16} />
              </Link>
              {!session && (
                <Link href="/register"
                  className="border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
                  Register Free First
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'
import { franchises } from '@/data/franchises'
import type { Franchise } from '@/data/franchises'
import { applyListingStore } from '@/lib/store'

export default function HeroSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Franchise[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // Live filter as user types
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) { setResults([]); setOpen(false); return }

    // Apply any admin overrides / removals before searching
    const live = applyListingStore(franchises)
    const matched = live.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.tagline.toLowerCase().includes(q) ||
      f.city.toLowerCase().includes(q)
    ).slice(0, 7)

    setResults(matched)
    setOpen(matched.length > 0)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goSearch = () => {
    const q = query.trim()
    setOpen(false)
    router.push(q ? `/directory?q=${encodeURIComponent(q)}` : '/directory')
  }

  const goToListing = (id: string) => {
    setOpen(false)
    setQuery('')
    router.push(`/directory/${id}`)
  }

  return (
    <div ref={containerRef} className="relative max-w-xl">
      {/* Input row */}
      <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:border-red-200 transition-colors overflow-hidden focus-within:border-red-400 focus-within:shadow-md">
        <div className="flex items-center pl-5 text-gray-400 shrink-0">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goSearch()
            if (e.key === 'Escape') setOpen(false)
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search franchises, categories, or brands..."
          className="flex-1 px-4 py-4 text-sm text-gray-700 outline-none bg-transparent"
          autoComplete="off"
        />
        <button
          onClick={goSearch}
          className="btn-red m-2 px-6 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0"
        >
          Search
        </button>
      </div>

      {/* Live results dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">
            Matching Franchises
          </p>
          {results.map((f) => (
            <button
              key={f.id}
              onMouseDown={() => goToListing(f.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-gray-50 first:border-0"
            >
              {/* Logo */}
              {f.logoUrl ? (
                <img
                  src={f.logoUrl}
                  alt=""
                  className="w-9 h-9 rounded-xl object-contain bg-gray-50 border border-gray-100 shrink-0 p-0.5"
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
              <ArrowRight size={13} className="text-gray-300 shrink-0" />
            </button>
          ))}
          {/* View all */}
          <button
            onMouseDown={goSearch}
            className="w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
          >
            See all results for &ldquo;{query}&rdquo; →
          </button>
        </div>
      )}
    </div>
  )
}

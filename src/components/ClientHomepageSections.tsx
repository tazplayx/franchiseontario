'use client'
/**
 * Client-side wrappers for homepage sections that depend on the listing store.
 * The server-rendered versions (FeaturedSpotlight / TopRanked) read the static
 * seed array directly and cannot reflect admin removals or approved pending
 * listings. These components hydrate with the seed data on first render (no
 * layout shift) then apply localStorage overrides on mount.
 */
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { franchises, getFeaturedFranchises, getTopRanked } from '@/data/franchises'
import { applyListingStore } from '@/lib/store'
import FranchiseCard from '@/components/FranchiseCard'

// ── Featured Spotlight ─────────────────────────────────────────────────────────
export function ClientFeaturedSpotlight() {
  const [featured, setFeatured] = useState(getFeaturedFranchises)

  useEffect(() => {
    const live = applyListingStore(franchises)
    setFeatured(live.filter((f) => f.isFeatured))
  }, [])

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full bg-red-600" />
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Featured This Week</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Spotlight Franchises
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Rotating weekly features —{' '}
              <Link href="/pricing#featured" className="text-red-600 hover:underline font-medium">
                add your listing for $14.99/week →
              </Link>
            </p>
          </div>
          <Link
            href="/directory"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured cards */}
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((franchise) => (
              <div key={franchise.id} className="featured-glow rounded-xl">
                <FranchiseCard franchise={franchise} showRank />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 text-sm">
            No featured listings at the moment.{' '}
            <Link href="/pricing#featured" className="text-red-600 hover:underline">
              Get featured →
            </Link>
          </div>
        )}

        {/* CTA strip */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-white font-black text-lg">
              ⭐
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Get your franchise featured on the homepage</p>
              <p className="text-xs text-gray-500">
                Rotating weekly feature spots — only <strong>$14.99/week</strong>
              </p>
            </div>
          </div>
          <Link href="/pricing#featured" className="btn-gold shrink-0 px-5 py-2 rounded-lg text-sm font-bold">
            Get Featured →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Top Ranked ─────────────────────────────────────────────────────────────────
export function ClientTopRanked() {
  const [top, setTop] = useState(() => getTopRanked(6))

  useEffect(() => {
    const live = applyListingStore(franchises)
    const sorted = [...live].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
    setTop(sorted.slice(0, 6))
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Rankings</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Ontario&apos;s Top Ranked Franchises
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Ranked by popularity, reviews, locations &amp; category performance
            </p>
          </div>
          <Link
            href="/directory?sort=rank"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Full Rankings <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {top.map((franchise) => (
            <FranchiseCard key={franchise.id} franchise={franchise} showRank />
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { franchises, type Franchise } from '@/data/franchises'

interface Props {
  franchise: Franchise
}

export default function RelatedListings({ franchise }: Props) {
  const related = useMemo(() => {
    return franchises
      .filter((f) => f.id !== franchise.id && f.category === franchise.category)
      .slice(0, 4)
  }, [franchise])

  if (related.length === 0) return null

  return (
    <section className="mt-10 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black text-gray-900" style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif' }}>
          More {franchise.category} Franchises
        </h2>
        <Link
          href={`/directory?category=${encodeURIComponent(franchise.category ?? '')}`}
          className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          See all <ArrowRight size={13} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {related.map((f) => (
          <Link
            key={f.id}
            href={`/directory/${f.id}`}
            className="rounded-xl border border-gray-100 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <div
              className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center text-white text-xs font-black"
              style={{ background: 'var(--rust)' }}
            >
              {f.name.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight line-clamp-2">
              {f.name}
            </p>
            {f.financials?.investmentMin > 0 && (
              <p className="text-[11px] text-gray-400 mt-1">${(f.financials.investmentMin / 1000).toFixed(0)}K+</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}

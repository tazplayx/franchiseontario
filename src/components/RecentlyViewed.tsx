'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { franchises, type Franchise } from '@/data/franchises'
import { getRecentIds } from '@/lib/recently-viewed'

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [items, setItems] = useState<Franchise[]>([])

  useEffect(() => {
    const ids = getRecentIds().filter((id) => id !== excludeId)
    const matched = ids
      .map((id) => franchises.find((f) => f.id === id))
      .filter(Boolean) as Franchise[]
    setItems(matched.slice(0, 6))
  }, [excludeId])

  if (items.length === 0) return null

  return (
    <section className="py-8 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={15} className="text-gray-400" />
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Recently Viewed</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {items.map((f) => (
          <Link
            key={f.id}
            href={`/directory/${f.id}`}
            className="shrink-0 w-40 rounded-xl border border-gray-100 bg-white p-3 hover:border-gray-300 transition-colors shadow-sm group"
          >
            <div
              className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center text-white text-xs font-black"
              style={{ background: 'var(--rust)' }}
            >
              {f.name.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
              {f.name}
            </p>
            {f.category && (
              <p className="text-[10px] text-gray-400 mt-1 truncate">{f.category}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}

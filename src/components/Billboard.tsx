'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAdSlot, formatCad, monthlyVisitors } from '@/lib/ad-slots'

export interface LiveAd {
  id: string
  title: string
  body: string
  imageUrl?: string
  ctaUrl: string
  ctaLabel: string
}

/**
 * A billboard location. Shows a rotating live advertisement when one is booked,
 * otherwise an invitation to advertise (with price and traffic) so the space sells itself.
 */
export default function Billboard({ slot, className = '' }: { slot: string; className?: string }) {
  const config = getAdSlot(slot)
  const [ads, setAds] = useState<LiveAd[]>([])
  const [chosen, setChosen] = useState<LiveAd | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/ads/${slot}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : []))
      .then((list: LiveAd[]) => {
        if (cancelled || !Array.isArray(list) || list.length === 0) return
        setAds(list)
        // Rotation: each page view shows a different advertiser at random
        setChosen(list[Math.floor(Math.random() * list.length)])
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [slot])

  if (!config) return null

  if (chosen) {
    return (
      <aside className={`rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm ${className}`} aria-label="Advertisement">
        <p className="text-[9px] uppercase tracking-widest text-gray-400 px-4 pt-2">Advertisement</p>
        <a
          href={chosen.ctaUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={() => navigator.sendBeacon?.('/api/ads/event', new Blob([JSON.stringify({ campaignId: chosen.id, type: 'click' })], { type: 'application/json' }))}
          className="block p-4 hover:bg-gray-50 transition-colors"
        >
          {chosen.imageUrl && <img src={chosen.imageUrl} alt="" className="w-full h-28 object-cover rounded-xl mb-3" />}
          <p className="font-bold text-gray-900 text-sm leading-snug">{chosen.title}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{chosen.body}</p>
          <span className="inline-block mt-3 text-xs font-semibold text-red-600">{chosen.ctaLabel} →</span>
        </a>
      </aside>
    )
  }

  // Placeholder: advertises the space itself
  return (
    <aside className={`rounded-2xl border-2 border-dashed border-red-300 bg-red-50/40 p-5 text-center ${className}`} aria-label="Advertise here">
      <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">Advertise here</p>
      <p className="font-bold text-gray-900 mt-1 text-sm">{config.name}</p>
      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{config.where}.</p>
      <div className="grid grid-cols-2 gap-2 mt-3 text-left">
        <div className="bg-white rounded-lg p-2 border border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase">Visitors / month</p>
          <p className="font-black text-gray-900 text-sm">{monthlyVisitors().toLocaleString('en-CA')}+</p>
        </div>
        <div className="bg-white rounded-lg p-2 border border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase">From</p>
          <p className="font-black text-gray-900 text-sm">{formatCad(config.weeklyCents)}<span className="text-[10px] font-normal text-gray-400">/wk</span></p>
        </div>
      </div>
      <Link href="/advertise" className="inline-block mt-3 text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors">
        Reserve this spot
      </Link>
    </aside>
  )
}

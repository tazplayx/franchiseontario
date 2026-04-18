'use client'

import Link from 'next/link'
import { MapPin, TrendingUp } from 'lucide-react'
import type { Franchise } from '@/data/franchises'
import { formatInvestment } from '@/lib/seo/queries'

const FALLBACK_BG: Record<string, string> = {
  'Bar & Grill':         'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop&auto=format',
  'Coffee & Café':       'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop&auto=format',
  'Fast Food':           'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=200&fit=crop&auto=format',
  'Fitness & Wellness':  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop&auto=format',
  'Cleaning Services':   'https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&h=200&fit=crop&auto=format',
  'Home Services':       'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=200&fit=crop&auto=format',
  'Education':           'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=200&fit=crop&auto=format',
  'Automotive':          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=200&fit=crop&auto=format',
  'Retail':              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop&auto=format',
  'Pet Services':        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=200&fit=crop&auto=format',
  'Beauty & Salon':      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=200&fit=crop&auto=format',
}

function TierPill({ tier }: { tier: Franchise['tier'] }) {
  if (tier === 'enterprise') {
    return (
      <span className="inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide vip-badge">
        ENTERPRISE
      </span>
    )
  }
  if (tier === 'premium') {
    return (
      <span className="inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide text-white" style={{ background: 'var(--teal)' }}>
        PREMIUM
      </span>
    )
  }
  return (
    <span className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-wide" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
      BASIC
    </span>
  )
}

export default function FranchiseSEOCard({ franchise }: { franchise: Franchise }) {
  const bg = franchise.mediaImages?.[0] || FALLBACK_BG[franchise.category] ||
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop&auto=format'

  return (
    <Link
      href={`/directory/${franchise.id}`}
      className="group bg-white flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ borderRadius: '1.25rem', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,34,142,0.05)' }}
    >
      {/* Image */}
      <div className="h-36 relative overflow-hidden" style={{ borderRadius: '1.25rem 1.25rem 0 0' }}>
        <img
          src={bg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,14,26,0.08) 0%, rgba(10,14,26,0.55) 100%)' }} />

        {/* Logo */}
        {franchise.logoUrl ? (
          <img
            src={franchise.logoUrl}
            alt={`${franchise.name} logo`}
            className="absolute inset-0 m-auto w-14 h-14 object-contain bg-white p-1 z-10"
            style={{ borderRadius: '0.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.18)' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div
            className="absolute inset-0 m-auto w-14 h-14 flex items-center justify-center text-lg font-black z-10"
            style={{ background: franchise.logoBg, color: franchise.logoColor, borderRadius: '0.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.18)', maxWidth: '3.5rem', maxHeight: '3.5rem' }}
          >
            {franchise.logoInitials}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <TierPill tier={franchise.tier} />
          <span className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{franchise.category}</span>
        </div>

        <h2 className="font-bold text-[14px] leading-snug mb-1 line-clamp-2 group-hover:text-red-600 transition-colors"
          style={{ color: 'var(--text-primary)', fontFamily: 'Bricolage Grotesque, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
          {franchise.name}
        </h2>

        <p className="text-[11px] mb-3 line-clamp-2 leading-snug flex-1" style={{ color: 'var(--text-muted)' }}>
          {franchise.tagline}
        </p>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <TrendingUp size={10} />
            <span className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {formatInvestment(franchise.financials.investmentMin)}+
            </span>
          </div>
          <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <MapPin size={10} />
            <span className="text-[11px]">{franchise.locations}+ locations</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

'use client'
import Link from 'next/link'
import { MapPin, TrendingUp, Crown, Zap } from 'lucide-react'
import type { Franchise } from '@/data/franchises'

// Stock photos per category
const CATEGORY_BG: Record<string, string> = {
  'Bar & Grill':          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=240&fit=crop&auto=format',
  'Seafood':              'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&h=240&fit=crop&auto=format',
  'Coffee & Café':        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=240&fit=crop&auto=format',
  'Fast Food':            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=240&fit=crop&auto=format',
  'Pizza':                'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=240&fit=crop&auto=format',
  'Specialty Food':       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=240&fit=crop&auto=format',
  'Bakery & Desserts':    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=240&fit=crop&auto=format',
  'Healthy Eating':       'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=240&fit=crop&auto=format',
  'Fitness & Wellness':   'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=240&fit=crop&auto=format',
  'Health & Medical':     'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=240&fit=crop&auto=format',
  'Senior Care':          'https://images.unsplash.com/photo-1576765608866-5b51046452be?w=600&h=240&fit=crop&auto=format',
  'Sports & Recreation':  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=240&fit=crop&auto=format',
  'Home Services':        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=240&fit=crop&auto=format',
  'Cleaning Services':    'https://images.unsplash.com/photo-1527515545081-5db817172677?w=600&h=240&fit=crop&auto=format',
  'Real Estate':          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=240&fit=crop&auto=format',
  'Education':            'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=240&fit=crop&auto=format',
  "Children's Services":  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=240&fit=crop&auto=format',
  'Financial Services':   'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=240&fit=crop&auto=format',
  'Business Services':    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=240&fit=crop&auto=format',
  'Technology & IT':      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=240&fit=crop&auto=format',
  'Printing & Signs':     'https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?w=600&h=240&fit=crop&auto=format',
  'Retail':               'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=240&fit=crop&auto=format',
  'Automotive':           'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=240&fit=crop&auto=format',
  'Beauty & Salon':       'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=240&fit=crop&auto=format',
  'Pet Services':         'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=240&fit=crop&auto=format',
  'Travel & Hospitality': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=240&fit=crop&auto=format',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TierBadge({ tier }: { tier: Franchise['tier'] }) {
  if (tier === 'enterprise') {
    return (
      <span className="vip-badge inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
        <Crown size={8} /> ENTERPRISE
      </span>
    )
  }
  if (tier === 'premium') {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full text-white tracking-wide" style={{ background: 'var(--teal)' }}>
        <Zap size={8} /> PREMIUM
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-wide" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
      BASIC
    </span>
  )
}

export default function FranchiseCard({
  franchise,
  showRank = false,
  detailHref,
}: {
  franchise: Franchise
  showRank?: boolean
  detailHref?: string
}) {
  const isEnterprise = franchise.tier === 'enterprise'
  const isPremium    = franchise.tier === 'premium'

  const borderStyle = isEnterprise
    ? '1.5px solid #d4a85a'
    : isPremium
    ? '1.5px solid var(--teal)'
    : '1px solid var(--border)'

  return (
    <div
      className="relative bg-white overflow-hidden card-hover flex flex-col"
      style={{ borderRadius: '1.25rem', border: borderStyle }}
    >
      {/* Featured ribbon */}
      {franchise.isFeatured && (
        <div className="absolute top-3 right-0 z-10">
          <span className="top-ribbon">FEATURED</span>
        </div>
      )}

      {/* VIP pill */}
      {franchise.isVIP && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ background: 'var(--gold)', color: 'var(--rust-deep)' }}
          >
            ⭐ VIP
          </span>
        </div>
      )}

      {/* Header image */}
      <div className="h-32 flex items-center justify-center relative overflow-hidden" style={{ borderRadius: '1.25rem 1.25rem 0 0' }}>
        <img
          src={franchise.mediaImages?.[0] || CATEGORY_BG[franchise.category] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=240&fit=crop&auto=format'}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle gradient — less dark than before */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,14,26,0.12) 0%, rgba(10,14,26,0.60) 100%)' }} />

        {/* Logo */}
        {franchise.logoUrl ? (
          <img
            src={franchise.logoUrl}
            alt={`${franchise.name} logo`}
            className="w-16 h-16 object-contain relative z-10 bg-white p-1"
            style={{ borderRadius: '0.875rem', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div
            className="w-16 h-16 flex items-center justify-center text-xl font-black relative z-10"
            style={{
              background: franchise.logoBg,
              color: franchise.logoColor,
              borderRadius: '0.875rem',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            }}
          >
            {franchise.logoInitials}
          </div>
        )}

        {/* Rank badge */}
        {showRank && (
          <div className="absolute bottom-2 left-2.5 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
            <span className="rank-number text-xs font-black">#{franchise.rank}</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">

        {/* Tier + category */}
        <div className="flex items-center gap-2 mb-2.5">
          <TierBadge tier={franchise.tier} />
          <span className="text-[10px] font-medium truncate" style={{ color: 'var(--text-muted)' }}>
            {franchise.category}
          </span>
        </div>

        {/* Name */}
        <h3
          className="font-bold text-[15px] leading-snug mb-1 line-clamp-2"
          style={{ color: 'var(--text-primary)', fontFamily: 'Bricolage Grotesque, system-ui, sans-serif', letterSpacing: '-0.02em' }}
        >
          {franchise.name}
        </h3>

        {/* Tagline */}
        <p className="text-[12px] mb-3 line-clamp-2 leading-snug" style={{ color: 'var(--text-muted)' }}>
          {franchise.tagline}
        </p>

        {/* Rating */}
        {franchise.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={franchise.rating} />
            <span className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{franchise.rating}</span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>({franchise.reviews.toLocaleString()})</span>
          </div>
        )}

        {/* Stats — inline with dividers, no boxy backgrounds */}
        <div className="flex items-center gap-0 mb-3 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          <div className="flex-1 text-center">
            <div className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{franchise.locations}+</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Locations</div>
          </div>
          <div className="w-px self-stretch" style={{ background: 'var(--border-light)' }} />
          <div className="flex-1 text-center">
            <div className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>Est. {franchise.established}</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Founded</div>
          </div>
          <div className="w-px self-stretch" style={{ background: 'var(--border-light)' }} />
          <div className="flex-1 text-center">
            <div className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>
              ${(franchise.financials.investmentMin / 1000).toFixed(0)}K+
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Min. Invest.</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{franchise.city}</span>
        </div>

        {/* Highlights — enterprise / premium only */}
        {(isEnterprise || isPremium) && franchise.highlights.length > 0 && (
          <ul className="space-y-1 mb-4">
            {franchise.highlights.slice(0, 2).map((h, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                <span className="text-green-500 mt-0.5 shrink-0 text-[10px]">✓</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-auto pt-1">
          <Link
            href={detailHref ?? `/directory/${franchise.id}`}
            className={`block text-center w-full py-2.5 text-[13px] font-bold transition-all ${
              isEnterprise ? 'btn-gold' : isPremium ? 'btn-teal' : 'btn-outline'
            }`}
          >
            {detailHref
              ? 'Enquire Now'
              : isEnterprise
              ? 'View Enterprise Profile'
              : isPremium
              ? 'View Premium Profile'
              : 'View Listing'}
          </Link>
        </div>
      </div>
    </div>
  )
}

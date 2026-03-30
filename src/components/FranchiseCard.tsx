import Link from 'next/link'
import { Star, MapPin, TrendingUp, Crown, Award, Zap } from 'lucide-react'
import type { Franchise } from '@/data/franchises'

// Stock photos per category — used as card header backgrounds
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
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TierBadge({ tier }: { tier: Franchise['tier'] }) {
  if (tier === 'enterprise') {
    return (
      <span className="vip-badge inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full">
        <Crown size={9} /> ENTERPRISE
      </span>
    )
  }
  if (tier === 'premium') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
        <Zap size={9} /> PREMIUM
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
      BASIC
    </span>
  )
}

export default function FranchiseCard({ franchise, showRank = false }: { franchise: Franchise; showRank?: boolean }) {
  const isEnterprise = franchise.tier === 'enterprise'
  const isPremium = franchise.tier === 'premium'

  const cardBase = 'relative bg-white rounded-xl overflow-hidden card-hover'
  const cardBorder = isEnterprise
    ? 'enterprise-card'
    : isPremium
    ? 'premium-card border-2 border-blue-500'
    : 'border border-gray-200'

  return (
    <div className={`${cardBase} ${cardBorder}`}>
      {/* Inner wrapper for enterprise (sits above ::before pseudo) */}
      <div className={`${isEnterprise ? 'bg-white rounded-xl m-0.5' : ''} h-full flex flex-col`}>

        {/* Featured ribbon */}
        {franchise.isFeatured && (
          <div className="absolute top-3 right-0 z-10">
            <span className="top-ribbon">FEATURED</span>
          </div>
        )}

        {/* VIP indicator */}
        {franchise.isVIP && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              ⭐ VIP
            </span>
          </div>
        )}

        {/* Logo area — background photo + logo/initials centred on top */}
        <div className="h-36 flex items-center justify-center relative overflow-hidden">
          {/* Background: first media image, else category stock photo */}
          <img
            src={franchise.mediaImages?.[0] || CATEGORY_BG[franchise.category] || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=240&fit=crop&auto=format`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/65" />

          {franchise.logoUrl ? (
            /* Uploaded logo */
            <img
              src={franchise.logoUrl}
              alt={`${franchise.name} logo`}
              className="w-20 h-20 rounded-2xl object-contain shadow-lg relative z-10 bg-white p-1.5"
            />
          ) : (
            /* Coloured initials */
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg text-2xl font-black relative z-10 ring-2 ring-white/30"
              style={{ background: franchise.logoBg, color: franchise.logoColor }}
            >
              {franchise.logoInitials}
            </div>
          )}

          {/* Rank badge */}
          {showRank && (
            <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
              <span className="rank-number text-sm font-black">#{franchise.rank}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Tier + Category */}
          <div className="flex items-center gap-2 mb-2">
            <TierBadge tier={franchise.tier} />
            <span className="text-[10px] text-gray-400 font-medium truncate">{franchise.category}</span>
          </div>

          {/* Name */}
          <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-2">
            {franchise.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-gray-500 italic mb-2">{franchise.tagline}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={franchise.rating} />
            <span className="text-xs font-semibold text-gray-700">{franchise.rating}</span>
            <span className="text-xs text-gray-400">({franchise.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-gray-900">{franchise.locations}+</div>
              <div className="text-[10px] text-gray-400">Locations</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-gray-900">Est. {franchise.established}</div>
              <div className="text-[10px] text-gray-400">Founded</div>
            </div>
          </div>

          {/* Investment */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <TrendingUp size={12} className="text-green-500 shrink-0" />
            <span>
              Investment: <span className="font-semibold text-gray-700">
                ${(franchise.financials.investmentMin / 1000).toFixed(0)}K – ${(franchise.financials.investmentMax / 1000).toFixed(0)}K
              </span>
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <MapPin size={11} className="shrink-0" />
            <span>{franchise.city}</span>
          </div>

          {/* Highlights — enterprise/premium only */}
          {(isEnterprise || isPremium) && (
            <ul className="space-y-1 mb-4">
              {franchise.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {h}
                </li>
              ))}
            </ul>
          )}

          {/* CTA */}
          <div className="mt-auto">
            <Link
              href={`/directory/${franchise.id}`}
              className={`block text-center w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                isEnterprise
                  ? 'btn-gold'
                  : isPremium
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isEnterprise ? 'View Enterprise Profile' : isPremium ? 'View Premium Profile' : 'View Listing'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

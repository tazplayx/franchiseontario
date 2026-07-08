'use client'
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { isWishlisted, toggleWishlist } from '@/lib/wishlist'

interface Props {
  franchiseId: string
  size?: 'sm' | 'md'
}

export default function WishlistButton({ franchiseId, size = 'sm' }: Props) {
  const [saved, setSaved] = useState(false)

  useEffect(() => { setSaved(isWishlisted(franchiseId)) }, [franchiseId])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const next = toggleWishlist(franchiseId)
    setSaved(next)
    window.dispatchEvent(new Event('fo_wishlist_change'))
  }

  const iconSize = size === 'md' ? 18 : 14

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? 'Remove from saved' : 'Save franchise'}
      className={`rounded-full transition-all ${
        size === 'md'
          ? 'p-2.5 hover:scale-110'
          : 'p-1.5 hover:scale-110'
      } ${
        saved
          ? 'bg-red-50 text-red-500'
          : 'bg-white/80 text-gray-400 hover:text-red-400 hover:bg-red-50'
      }`}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <Heart
        size={iconSize}
        fill={saved ? 'currentColor' : 'none'}
        strokeWidth={saved ? 0 : 1.5}
      />
    </button>
  )
}

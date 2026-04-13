'use client'
import { useRef, useEffect } from 'react'

function useParallaxDOM(strength = 0.15) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const img = container.querySelector('img') as HTMLImageElement | null
    if (!img) return

    const update = () => {
      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight
      // progress: -0.5 (element entering bottom) → 0.5 (element leaving top)
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / (vh + rect.height)
      img.style.transform = `scale(1.15) translateY(${progress * strength * 100}%)`
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [strength])

  return containerRef
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  strength = 0.15,
}: {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  strength?: number
}) {
  const ref = useParallaxDOM(strength)

  return (
    <div ref={ref} className={`overflow-hidden ${containerClassName}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover will-change-transform ${className}`}
        loading="lazy"
      />
    </div>
  )
}

export function ParallaxSection({
  src,
  children,
  className = '',
  overlayOpacity = 0.55,
}: {
  src: string
  children: React.ReactNode
  className?: string
  overlayOpacity?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const inner = container.querySelector('[data-parallax-inner]') as HTMLDivElement | null
    if (!inner) return

    const update = () => {
      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / (vh + rect.height)
      inner.style.transform = `scale(1.25) translateY(${progress * 12}%)`
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div data-parallax-inner className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.25)' }}>
        <img src={src} alt="" aria-hidden className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlayOpacity})` }} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

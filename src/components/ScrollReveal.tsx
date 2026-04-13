'use client'
import { useRef, useEffect } from 'react'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * All scroll-reveal components use direct DOM manipulation in useEffect
 * so that the initial React render (both server and client) produces
 * identical markup — no inline opacity/transform styles — preventing
 * any hydration mismatch. Styles are applied after hydration via refs.
 */

function applyReveal(
  el: HTMLDivElement,
  delay: number,
  hiddenStyle: { opacity?: string; transform?: string },
  visibleStyle: { opacity: string; transform: string },
  margin = '-60px'
) {
  const rect = el.getBoundingClientRect()
  const isAboveFold = rect.bottom > 0 && rect.top < window.innerHeight

  const transition = Object.keys(hiddenStyle)
    .map((prop) => `${prop === 'opacity' ? 'opacity' : 'transform'} 0.65s ${delay}s ${EASE}`)
    .join(', ')

  if (!isAboveFold) {
    // Below fold: start hidden
    Object.assign(el.style, hiddenStyle)
    el.style.transition = transition
  }

  const obs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.style.transition = transition
        Object.assign(el.style, visibleStyle)
        obs.disconnect()
      }
    },
    { rootMargin: margin }
  )
  obs.observe(el)
  return () => obs.disconnect()
}

export function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    return applyReveal(
      ref.current, delay,
      { opacity: '0', transform: 'translateY(40px)' },
      { opacity: '1', transform: 'translateY(0)' }
    )
  }, [delay])
  return <div ref={ref} className={className}>{children}</div>
}

export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    return applyReveal(
      ref.current, delay,
      { opacity: '0' },
      { opacity: '1', transform: 'none' }
    )
  }, [delay])
  return <div ref={ref} className={className}>{children}</div>
}

export function StaggerGroup({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}

export function StaggerItem({
  children,
  className = '',
  index = 0,
}: {
  children: React.ReactNode
  className?: string
  index?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    return applyReveal(
      ref.current, index * 0.07,
      { opacity: '0', transform: 'translateY(28px)' },
      { opacity: '1', transform: 'translateY(0)' }
    )
  }, [index])
  return <div ref={ref} className={className}>{children}</div>
}

export function SlideInLeft({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    return applyReveal(
      ref.current, delay,
      { opacity: '0', transform: 'translateX(-56px)' },
      { opacity: '1', transform: 'translateX(0)' }
    )
  }, [delay])
  return <div ref={ref} className={className}>{children}</div>
}

export function SlideInRight({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    return applyReveal(
      ref.current, delay,
      { opacity: '0', transform: 'translateX(56px)' },
      { opacity: '1', transform: 'translateX(0)' }
    )
  }, [delay])
  return <div ref={ref} className={className}>{children}</div>
}

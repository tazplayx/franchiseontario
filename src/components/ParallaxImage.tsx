'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

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
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength * 100}%`, `${strength * 100}%`])

  return (
    <div ref={ref} className={`overflow-hidden ${containerClassName}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className={`w-full h-full object-cover scale-110 ${className}`}
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
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 scale-125">
        <img src={src} alt="" aria-hidden className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlayOpacity})` }} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

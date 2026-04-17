'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// /news is permanently redirected to /insights via next.config.js
// This component is a client-side fallback for any edge cases
export default function NewsRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/insights') }, [router])
  return null
}

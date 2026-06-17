'use client'
import { useEffect, useState } from 'react'
import { franchises } from '@/data/franchises'
import { applyListingStore } from '@/lib/store'

export function LiveListingCount({ suffix = '+', className }: { suffix?: string; className?: string }) {
  const [count, setCount] = useState(franchises.length)

  useEffect(() => {
    setCount(applyListingStore(franchises).length)
  }, [])

  return <span className={className}>{count}{suffix}</span>
}

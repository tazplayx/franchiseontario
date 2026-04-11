'use client'
/**
 * ClientApprovedListingPage
 *
 * Rendered server-side when a directory ID isn't found in the static franchises array.
 * On mount, checks localStorage for user-submitted approved listings and renders
 * the full listing profile if found, or a 404 message if not.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle } from 'lucide-react'
import { getApprovedListings } from '@/lib/store'
import type { Franchise } from '@/data/franchises'
import ClientListingBody from '@/components/ClientListingBody'

export default function ClientApprovedListingPage({ id }: { id: string }) {
  const [franchise, setFranchise] = useState<Franchise | null | 'loading'>('loading')

  useEffect(() => {
    const approved = getApprovedListings()
    const found = approved.find((f) => f.id === id) ?? null
    setFranchise(found)
  }, [id])

  if (franchise === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-red-600" />
      </div>
    )
  }

  if (!franchise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">Listing Not Found</h1>
        <p className="text-sm text-gray-500 max-w-sm">
          This franchise listing doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/directory"
          className="mt-2 inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          Browse Directory →
        </Link>
      </div>
    )
  }

  return <ClientListingBody seed={franchise} />
}

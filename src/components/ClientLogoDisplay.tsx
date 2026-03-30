'use client'
/**
 * ClientLogoDisplay
 *
 * Renders a franchise logo for the public detail page.
 * On mount it checks localStorage for any admin-saved override,
 * so edits made in the admin panel are reflected immediately on the
 * public listing page — even though the detail page is server-rendered.
 */
import { useEffect, useState } from 'react'
import { getListingOverrides } from '@/lib/store'

interface Props {
  id: string
  seedLogoUrl?: string
  logoBg: string
  logoColor: string
  logoInitials: string
}

export default function ClientLogoDisplay({
  id,
  seedLogoUrl,
  logoBg,
  logoColor,
  logoInitials,
}: Props) {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(seedLogoUrl)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const overrides = getListingOverrides()
    const override = overrides[id]
    if (override && 'logoUrl' in override) {
      setLogoUrl(override.logoUrl || undefined)
    }
  }, [id])

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt="Franchise logo"
        className="w-24 h-24 rounded-2xl object-contain shadow-md shrink-0 border border-gray-100 bg-white p-1"
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md shrink-0 border border-gray-100"
      style={{ background: logoBg, color: logoColor }}
    >
      {logoInitials}
    </div>
  )
}

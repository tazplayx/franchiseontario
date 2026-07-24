import { NextResponse } from 'next/server'
import { sbSelect, supabaseConfigured } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

interface ListingRow {
  id: string
  name: string
  category: string
  tier: string
  email: string
  phone: string
  website: string
  city: string
  description: string
  long_description: string
  locations: number
  established: number
  logo_url: string
  media_images: string[]
  video_url: string
  is_vip: boolean
  is_featured: boolean
  status: string
}

/**
 * Public: returns admin-APPROVED franchisor listings so they can be merged
 * into the directory for ALL visitors (server-side, not per-browser).
 */
export async function GET() {
  try {
    if (!supabaseConfigured()) return NextResponse.json([])
    const rows = await sbSelect<ListingRow>(
      'listings',
      'status=eq.approved&order=submitted_at.desc',
    )
    // Map DB → the shape the directory expects (partial Franchise)
    const listings = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category || 'Business Services',
      tier: (r.tier as 'basic' | 'premium' | 'enterprise') || 'basic',
      email: r.email || '',
      phone: r.phone || '',
      website: r.website || '',
      city: r.city || 'Ontario',
      description: r.description || r.name,
      longDescription: r.long_description || r.description || r.name,
      locations: r.locations || 0,
      established: r.established || new Date().getFullYear(),
      logoUrl: r.logo_url || undefined,
      mediaImages: Array.isArray(r.media_images) ? r.media_images : [],
      videoUrl: r.video_url || '',
      isVIP: !!r.is_vip,
      isFeatured: !!r.is_featured,
    }))
    return NextResponse.json(listings)
  } catch (err) {
    console.error('[listings] Error:', err)
    return NextResponse.json([])
  }
}

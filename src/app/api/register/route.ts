import { NextRequest, NextResponse } from 'next/server'
import { sbSelect, sbInsert, supabaseConfigured } from '@/lib/supabase-server'
import { hashPassword } from '@/lib/password'

export const dynamic = 'force-dynamic'

function slugify(s: string): string {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

interface Body {
  franchiseName: string
  category?: string
  contactName: string
  title?: string
  email: string
  phone?: string
  password: string
  website?: string
  established?: number
  locations?: number
  description?: string
  logoUrl?: string
  mediaImages?: string[]
  videoUrl?: string
  plan?: string // Basic | Premium | Enterprise
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: 'Registration is temporarily unavailable.' }, { status: 503 })
    }
    const b = (await req.json()) as Body
    if (!b.franchiseName || !b.email || !b.password || !b.contactName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const email = b.email.toLowerCase().trim()

    // Reject duplicate account
    const existing = await sbSelect('accounts', `email=eq.${encodeURIComponent(email)}&select=id`)
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 409 })
    }

    const franchiseId = slugify(b.franchiseName)
    const plan = b.plan ?? 'Basic'
    const tier = plan.toLowerCase() as 'basic' | 'premium' | 'enterprise'

    // Create account (paid tier is NOT granted here — only after Stripe
    // confirms payment via the webhook / subscription-status verification).
    await sbInsert('accounts', {
      id: `fa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      franchise_id: franchiseId,
      franchise_name: b.franchiseName,
      name: b.contactName,
      email,
      title: b.title ?? '',
      password_hash: hashPassword(b.password),
      tier: 'basic',
      registered_at: new Date().toISOString(),
    })

    // Create the pending listing for admin review
    await sbInsert('listings', {
      id: franchiseId,
      name: b.franchiseName,
      category: b.category ?? '',
      plan,
      tier: tier === 'premium' || tier === 'enterprise' ? tier : 'basic',
      email,
      contact_name: b.contactName,
      phone: b.phone ?? '',
      website: b.website ?? '',
      city: '',
      description: b.description ?? '',
      long_description: b.description ?? '',
      locations: b.locations ?? 0,
      established: b.established ?? new Date().getFullYear(),
      logo_url: b.logoUrl ?? '',
      media_images: b.mediaImages ?? [],
      video_url: b.videoUrl ?? '',
      status: 'pending',
      submitted_at: new Date().toISOString(),
    }, true)

    return NextResponse.json({ ok: true, franchiseId, email, franchiseName: b.franchiseName, name: b.contactName, tier: 'basic' })
  } catch (err) {
    console.error('[register] Error:', err)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}

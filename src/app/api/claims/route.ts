import { NextRequest, NextResponse } from 'next/server'
import { sbInsert, sbSelect, sbUpdate, supabaseConfigured } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// POST — submit a claim for a (usually sourced) listing
export async function POST(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: 'Claims are temporarily unavailable.' }, { status: 503 })
    }
    const b = await req.json() as {
      franchiseId: string; franchiseName: string
      claimantName: string; claimantEmail: string; claimantTitle?: string
      message?: string; domainMatch?: boolean
      sourceListingUrl?: string; sourceSite?: string
    }
    if (!b.franchiseId || !b.claimantName || !b.claimantEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    await sbInsert('claims', {
      id: `claim-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      franchise_id: b.franchiseId,
      franchise_name: b.franchiseName ?? b.franchiseId,
      claimant_name: b.claimantName,
      claimant_email: b.claimantEmail.toLowerCase(),
      claimant_title: b.claimantTitle ?? '',
      message: b.message ?? '',
      domain_match: !!b.domainMatch,
      source_listing_url: b.sourceListingUrl ?? '',
      source_site: b.sourceSite ?? '',
      status: 'pending',
      submitted_at: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[claims POST] Error:', err)
    return NextResponse.json({ error: 'Could not submit claim.' }, { status: 500 })
  }
}

// GET — admin: list claims (optionally ?status=pending)
export async function GET(req: NextRequest) {
  try {
    if (!supabaseConfigured()) return NextResponse.json([])
    const status = req.nextUrl.searchParams.get('status')
    const q = status ? `status=eq.${status}&order=submitted_at.desc` : 'order=submitted_at.desc'
    return NextResponse.json(await sbSelect('claims', q))
  } catch (err) {
    console.error('[claims GET] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 })
  }
}

// PATCH — admin: approve/reject a claim  ?id=xxx { status }
export async function PATCH(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const { status } = await req.json() as { status: string }
    await sbUpdate('claims', `id=eq.${encodeURIComponent(id)}`, { status })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[claims PATCH] Error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

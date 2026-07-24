import { NextRequest, NextResponse } from 'next/server'
import { sbSelect, sbUpdate, sbDelete, supabaseConfigured } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// GET /api/admin/listings?status=pending  (omit status for all)
export async function GET(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }
    const status = req.nextUrl.searchParams.get('status')
    const q = status ? `status=eq.${status}&order=submitted_at.desc` : 'order=submitted_at.desc'
    const rows = await sbSelect('listings', q)
    return NextResponse.json(rows)
  } catch (err) {
    console.error('[admin/listings GET] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

// PATCH /api/admin/listings?id=xxx  { status: 'approved'|'rejected', tier?, isVIP?, isFeatured? }
export async function PATCH(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const body = (await req.json()) as {
      status?: string; tier?: string; isVIP?: boolean; isFeatured?: boolean
    }
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (body.status) patch.status = body.status
    if (body.tier) patch.tier = body.tier
    if (typeof body.isVIP === 'boolean') patch.is_vip = body.isVIP
    if (typeof body.isFeatured === 'boolean') patch.is_featured = body.isFeatured
    await sbUpdate('listings', `id=eq.${encodeURIComponent(id)}`, patch)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/listings PATCH] Error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// DELETE /api/admin/listings?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await sbDelete('listings', `id=eq.${encodeURIComponent(id)}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/listings DELETE] Error:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

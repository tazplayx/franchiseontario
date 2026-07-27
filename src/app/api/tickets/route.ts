import { NextRequest, NextResponse } from 'next/server'
import { sbInsert, sbSelect, sbUpdate, supabaseConfigured } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// POST — submit a support ticket
export async function POST(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: 'Support is temporarily unavailable.' }, { status: 503 })
    }
    const b = await req.json() as {
      name: string; email: string; category?: string; subject: string; message?: string
    }
    if (!b.name || !b.email || !b.subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    await sbInsert('tickets', {
      id: `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: b.name,
      email: b.email.toLowerCase(),
      category: b.category ?? 'General Enquiry',
      subject: b.subject,
      message: b.message ?? '',
      status: 'Open',
      submitted_at: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[tickets POST] Error:', err)
    return NextResponse.json({ error: 'Could not submit ticket.' }, { status: 500 })
  }
}

// GET — admin: list tickets
export async function GET() {
  try {
    if (!supabaseConfigured()) return NextResponse.json([])
    return NextResponse.json(await sbSelect('tickets', 'order=submitted_at.desc'))
  } catch (err) {
    console.error('[tickets GET] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

// PATCH — admin: set status  ?id=xxx { status: 'Open'|'Resolved' }
export async function PATCH(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const { status } = await req.json() as { status: string }
    await sbUpdate('tickets', `id=eq.${encodeURIComponent(id)}`, { status })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[tickets PATCH] Error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

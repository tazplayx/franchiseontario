import { NextRequest, NextResponse } from 'next/server'
import { sbSelect, sbUpdate, supabaseConfigured } from '@/lib/supabase-server'
import { getFranchisorAccount } from '@/lib/franchisor-account'

export const dynamic = 'force-dynamic'

const STATUSES = ['new', 'contacted', 'qualified', 'meeting_scheduled', 'proposal_sent', 'closed_won', 'closed_lost']

/** Update a lead's sales stage or read flag. Only leads belonging to the signed-in franchisor can be changed. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    const account = await getFranchisorAccount(req)
    if (!account) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
    const { id } = await params
    const owned = await sbSelect('leads', `id=eq.${encodeURIComponent(id)}&franchise_id=eq.${encodeURIComponent(account.franchise_id)}&select=id`)
    if (owned.length === 0) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 })

    const body = (await req.json()) as { status?: string; read?: boolean }
    const patch: Record<string, unknown> = {}
    if (body.status && STATUSES.includes(body.status)) patch.status = body.status
    if (typeof body.read === 'boolean') patch.read = body.read
    if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
    await sbUpdate('leads', `id=eq.${encodeURIComponent(id)}`, patch)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[franchisor/leads PATCH] Error:', err)
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 })
  }
}

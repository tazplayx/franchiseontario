import { NextResponse } from 'next/server'
import { sbSelect, supabaseConfigured } from '@/lib/supabase-server'
import { AD_SLOTS } from '@/lib/ad-slots'

export const dynamic = 'force-dynamic'

/** Admin: all campaigns with revenue totals and live status. */
export async function GET() {
  try {
    if (!supabaseConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    const campaigns = await sbSelect<{ id: string; franchise_id: string; account_email: string; slot_id: string; weeks: number; amount_cents: number; status: string; start_at: string | null; end_at: string | null; paid_at: string | null }>(
      'ad_campaigns', 'status=eq.active&order=paid_at.desc&select=*',
    )
    const now = Date.now()
    const revenue = campaigns.reduce((s, c) => s + (c.amount_cents ?? 0), 0)
    const live = campaigns.filter((c) => c.end_at && new Date(c.end_at).getTime() > now)
    return NextResponse.json({
      revenueCents: revenue,
      liveCount: live.length,
      slots: AD_SLOTS.map((s) => ({ id: s.id, name: s.name, capacity: s.capacity, live: live.filter((c) => c.slot_id === s.id).length })),
      campaigns,
    })
  } catch (err) {
    console.error('[admin/ads]', err)
    return NextResponse.json({ error: 'Could not load advertising.' }, { status: 500 })
  }
}

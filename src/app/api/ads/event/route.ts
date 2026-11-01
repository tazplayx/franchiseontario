import { NextRequest, NextResponse } from 'next/server'
import { sbInsert, supabaseConfigured } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

/** Public: records one impression or click for a live campaign. */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseConfigured()) return NextResponse.json({ ok: false }, { status: 500 })
    const { campaignId, type } = (await req.json().catch(() => ({}))) as { campaignId?: string; type?: string }
    if (!campaignId || (type !== 'impression' && type !== 'click')) return NextResponse.json({ ok: false }, { status: 400 })
    if (!/^ad-[a-z0-9-]+$/i.test(campaignId)) return NextResponse.json({ ok: false }, { status: 400 })
    await sbInsert('ad_events', { campaign_id: campaignId, type })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

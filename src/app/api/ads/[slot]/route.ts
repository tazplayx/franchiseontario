import { NextResponse } from 'next/server'
import { sbSelect, supabaseConfigured } from '@/lib/supabase-server'
import { getAdSlot } from '@/lib/ad-slots'

export const dynamic = 'force-dynamic'

/** Public: live, paid and in-date advertisements for one billboard location. Empty when none are booked. */
export async function GET(_req: Request, { params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params
  if (!getAdSlot(slot) || !supabaseConfigured()) return NextResponse.json([])
  try {
    const now = new Date().toISOString()
    const rows = await sbSelect<{ id: string; title: string; body: string; image_url: string | null; cta_url: string; cta_label: string }>(
      'ad_campaigns',
      `slot_id=eq.${encodeURIComponent(slot)}&status=eq.active&end_at=gt.${encodeURIComponent(now)}&select=id,title,body,image_url,cta_url,cta_label`,
    )
    return NextResponse.json(rows.map((r) => ({ id: r.id, title: r.title, body: r.body, imageUrl: r.image_url ?? undefined, ctaUrl: r.cta_url, ctaLabel: r.cta_label })))
  } catch {
    // Ad tables not created yet — show the placeholder instead of breaking the page
    return NextResponse.json([])
  }
}

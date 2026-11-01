import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getStripe } from '@/lib/stripe'
import { sbInsert, sbSelect, sbUpdate, supabaseConfigured } from '@/lib/supabase-server'
import { getFranchisorAccount } from '@/lib/franchisor-account'
import { AD_SLOTS, AD_DURATIONS, getAdSlot, priceFor } from '@/lib/ad-slots'

export const dynamic = 'force-dynamic'

interface CampaignRow {
  id: string; slot_id: string; weeks: number; title: string; body: string; image_url: string | null
  cta_url: string; cta_label: string; amount_cents: number; status: string; start_at: string | null; end_at: string | null
}

/** The signed-in franchisor's ad campaigns with impression and click counts. */
export async function GET(req: NextRequest) {
  try {
    if (!supabaseConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    const account = await getFranchisorAccount(req)
    if (!account) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
    const campaigns = await sbSelect<CampaignRow>('ad_campaigns', `franchise_id=eq.${encodeURIComponent(account.franchise_id)}&order=created_at.desc&select=*`)
    const ids = campaigns.map((c) => c.id)
    const events = ids.length
      ? await sbSelect<{ campaign_id: string; type: string }>('ad_events', `campaign_id=in.(${ids.map(encodeURIComponent).join(',')})&select=campaign_id,type`)
      : []
    const counts = (id: string, type: string) => events.filter((e) => e.campaign_id === id && e.type === type).length
    return NextResponse.json({
      campaigns: campaigns.map((c) => ({
        id: c.id, slotId: c.slot_id, weeks: c.weeks, title: c.title, body: c.body, imageUrl: c.image_url ?? '',
        ctaUrl: c.cta_url, ctaLabel: c.cta_label, amountCents: c.amount_cents, status: c.status,
        startAt: c.start_at, endAt: c.end_at,
        impressions: counts(c.id, 'impression'), clicks: counts(c.id, 'click'),
      })),
      slots: AD_SLOTS,
      durations: AD_DURATIONS,
    })
  } catch (err) {
    console.error('[franchisor/ads GET]', err)
    return NextResponse.json({ error: 'Could not load advertising.' }, { status: 500 })
  }
}

/** Book a billboard: creates a pending campaign and a Stripe Checkout for the full amount. */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    const account = await getFranchisorAccount(req)
    if (!account) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })

    const b = (await req.json()) as { slotId?: string; weeks?: number; title?: string; body?: string; imageUrl?: string; ctaUrl?: string; ctaLabel?: string }
    const slot = getAdSlot(b.slotId ?? '')
    if (!slot) return NextResponse.json({ error: 'Choose a billboard location.' }, { status: 400 })
    const weeks = Number(b.weeks)
    if (!AD_DURATIONS.some((d) => d.weeks === weeks)) return NextResponse.json({ error: 'Choose a valid duration.' }, { status: 400 })
    const title = (b.title ?? '').trim().slice(0, 80)
    const body = (b.body ?? '').trim().slice(0, 220)
    const ctaUrl = (b.ctaUrl ?? '').trim()
    const ctaLabel = (b.ctaLabel ?? '').trim().slice(0, 30) || 'Learn more'
    if (!title || !body) return NextResponse.json({ error: 'Add a headline and message for your advertisement.' }, { status: 400 })
    if (!/^https:\/\//.test(ctaUrl)) return NextResponse.json({ error: 'Your link must start with https://' }, { status: 400 })
    const imageUrl = (b.imageUrl ?? '').trim()
    if (imageUrl && !/^https:\/\//.test(imageUrl)) return NextResponse.json({ error: 'Your image link must start with https://' }, { status: 400 })

    // Capacity: the location is full when every rotation place is taken by a live booking
    const now = new Date().toISOString()
    const live = await sbSelect<{ id: string }>('ad_campaigns', `slot_id=eq.${slot.id}&status=eq.active&end_at=gt.${encodeURIComponent(now)}&select=id`)
    if (live.length >= slot.capacity) {
      return NextResponse.json({ error: `${slot.name} is fully booked right now. Try another location or check back soon.` }, { status: 409 })
    }

    const amount = priceFor(slot, weeks)
    const id = `ad-${Date.now()}-${randomBytes(3).toString('hex')}`
    await sbInsert('ad_campaigns', {
      id, franchise_id: account.franchise_id, account_email: account.email, slot_id: slot.id, weeks,
      title, body, image_url: imageUrl || null, cta_url: ctaUrl, cta_label: ctaLabel, amount_cents: amount,
      status: 'pending_payment', created_at: now,
    })

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.franchiseontario.com'
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: account.email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'cad',
          unit_amount: amount,
          product_data: { name: `${slot.name} — ${weeks} week${weeks > 1 ? 's' : ''}`, description: 'Billboard advertising on FranchiseOntario.com' },
        },
      }],
      automatic_tax: { enabled: process.env.STRIPE_TAX_ENABLED === 'true' },
      metadata: { kind: 'ad_campaign', campaignId: id, email: account.email, franchiseId: account.franchise_id },
      success_url: `${base}/dashboard?ad_paid=${encodeURIComponent(id)}`,
      cancel_url: `${base}/dashboard?ad_cancelled=1`,
    })
    await sbUpdate('ad_campaigns', `id=eq.${encodeURIComponent(id)}`, { stripe_session_id: session.id })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[franchisor/ads POST]', err)
    return NextResponse.json({ error: 'Could not start payment. Please try again.' }, { status: 500 })
  }
}

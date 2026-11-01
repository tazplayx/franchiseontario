import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { sbSelect, sbUpdate, supabaseConfigured } from '@/lib/supabase-server'
import { getFranchisorAccount, includesLeadAccess, LEAD_PRICE_CENTS } from '@/lib/franchisor-account'

export const dynamic = 'force-dynamic'

/**
 * Unlock one lead's contact details.
 * - Premium / Enterprise members: unlocked at no extra charge.
 * - Everyone else: a one-time Stripe Checkout. The webhook records the unlock once payment succeeds.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    const account = await getFranchisorAccount(req)
    if (!account) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
    const { id } = await params

    const rows = await sbSelect<{ id: string; franchise_id: string; unlocked_at: string | null; investment_budget: string | null; city: string | null }>(
      'leads',
      `id=eq.${encodeURIComponent(id)}&franchise_id=eq.${encodeURIComponent(account.franchise_id)}&select=id,franchise_id,unlocked_at,investment_budget,city`,
    )
    const lead = rows[0]
    if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 })
    if (lead.unlocked_at) return NextResponse.json({ unlocked: true })

    if (includesLeadAccess(account.tier)) {
      await sbUpdate('leads', `id=eq.${encodeURIComponent(id)}`, { unlocked_at: new Date().toISOString(), unlocked_by: account.email })
      return NextResponse.json({ unlocked: true, included: true })
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.franchiseontario.com'
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: account.email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'cad',
          unit_amount: LEAD_PRICE_CENTS,
          product_data: { name: `Franchise lead contact${lead.city ? ` — ${lead.city}` : ''}`, description: `Contact details for one inquiry (budget: ${lead.investment_budget ?? 'not stated'})` },
        },
      }],
      automatic_tax: { enabled: process.env.STRIPE_TAX_ENABLED === 'true' },
      metadata: { kind: 'lead_unlock', leadId: lead.id, email: account.email, franchiseId: account.franchise_id },
      success_url: `${base}/dashboard?lead_unlocked=${encodeURIComponent(lead.id)}`,
      cancel_url: `${base}/dashboard?lead_cancelled=1`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[franchisor/unlock] Error:', err)
    return NextResponse.json({ error: 'Could not start payment. Please try again.' }, { status: 500 })
  }
}

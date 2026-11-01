import { NextRequest, NextResponse } from 'next/server'
import { sbSelect, supabaseConfigured } from '@/lib/supabase-server'
import { getFranchisorAccount, includesLeadAccess, LEAD_PRICE_CENTS } from '@/lib/franchisor-account'

export const dynamic = 'force-dynamic'

interface LeadRow {
  id: string; franchise_id: string; franchise_name: string; name: string; email: string
  phone: string | null; city: string | null; investment_budget: string | null; message: string | null
  status: string | null; read: boolean | null; submitted_at: string; unlocked_at: string | null; unlocked_by: string | null
}

/** Leads for the signed-in franchisor. Contact details are only included once unlocked (or with a membership). */
export async function GET(req: NextRequest) {
  try {
    if (!supabaseConfigured()) return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    const account = await getFranchisorAccount(req)
    if (!account) return NextResponse.json({ error: 'Please sign in to view your leads.' }, { status: 401 })

    const rows = await sbSelect<LeadRow>(
      'leads',
      `franchise_id=eq.${encodeURIComponent(account.franchise_id)}&order=submitted_at.desc&select=*`,
    )
    const hasMembership = includesLeadAccess(account.tier)
    const leads = rows.map((r) => {
      const unlocked = hasMembership || !!r.unlocked_at
      return {
        id: r.id,
        franchiseId: r.franchise_id,
        franchiseName: r.franchise_name,
        submittedAt: r.submitted_at,
        city: r.city ?? '',
        investmentBudget: r.investment_budget ?? '',
        status: r.status ?? 'new',
        read: !!r.read,
        unlocked,
        // Masked until unlocked: first initial only, no contact details or message
        name: unlocked ? r.name : `${r.name.charAt(0)}•••`,
        email: unlocked ? r.email : '',
        phone: unlocked ? (r.phone ?? '') : '',
        message: unlocked ? (r.message ?? '') : '',
      }
    })
    return NextResponse.json({ leads, tier: account.tier, leadPriceCents: LEAD_PRICE_CENTS })
  } catch (err) {
    console.error('[franchisor/leads GET] Error:', err)
    return NextResponse.json({ error: 'Could not load leads.' }, { status: 500 })
  }
}


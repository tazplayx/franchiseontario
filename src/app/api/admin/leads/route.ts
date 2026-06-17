import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY!

function headers() {
  return {
    'Content-Type': 'application/json',
    'apikey': supabaseKey(),
    'Authorization': `Bearer ${supabaseKey()}`,
  }
}

// GET /api/admin/leads — fetch all leads ordered by submitted_at desc
export async function GET() {
  const res = await fetch(
    `${supabaseUrl()}/rest/v1/leads?select=*&order=submitted_at.desc`,
    { headers: headers() }
  )
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  const rows = await res.json() as Record<string, unknown>[]
  // Map snake_case → camelCase for the frontend
  const leads = rows.map((r) => ({
    id: r.id,
    franchiseId: r.franchise_id,
    franchiseName: r.franchise_name,
    name: r.name,
    email: r.email,
    phone: r.phone ?? '',
    city: r.city ?? '',
    investmentBudget: r.investment_budget,
    message: r.message ?? '',
    status: r.status ?? 'new',
    read: r.read ?? false,
    submittedAt: r.submitted_at,
  }))
  return NextResponse.json(leads)
}

// PATCH /api/admin/leads?id=xxx — update status
export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const { status } = await req.json() as { status: string }
  const res = await fetch(
    `${supabaseUrl()}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { ...headers(), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ status, read: true }),
    }
  )
  if (!res.ok) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE /api/admin/leads?id=xxx — delete a lead
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const res = await fetch(
    `${supabaseUrl()}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`,
    { method: 'DELETE', headers: headers() }
  )
  if (!res.ok) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { sbSelect, supabaseConfigured } from '@/lib/supabase-server'
import { verifyPassword } from '@/lib/password'

export const dynamic = 'force-dynamic'

interface AccountRow {
  id: string
  franchise_id: string
  franchise_name: string
  name: string
  email: string
  password_hash: string
  tier: string
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseConfigured()) {
      return NextResponse.json({ error: 'Login is temporarily unavailable.' }, { status: 503 })
    }
    const { email, password } = (await req.json()) as { email?: string; password?: string }
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    const rows = await sbSelect<AccountRow>(
      'accounts',
      `email=eq.${encodeURIComponent(email.toLowerCase().trim())}&select=*`,
    )
    const account = rows[0]
    if (!account || !verifyPassword(password, account.password_hash)) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
    }
    // Return the session payload (no password hash)
    return NextResponse.json({
      ok: true,
      session: {
        franchiseId: account.franchise_id,
        franchiseName: account.franchise_name,
        email: account.email,
        name: account.name,
        tier: account.tier,
      },
    })
  } catch (err) {
    console.error('[login] Error:', err)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}

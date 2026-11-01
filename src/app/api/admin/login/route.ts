import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'
import { ADMIN_COOKIE, ADMIN_SESSION_MS, createAdminToken } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

// Constant-time comparison of two strings (hashed first so lengths never leak)
function same(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export async function POST(req: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503 })
  }
  const { email = '', password = '' } = (await req.json().catch(() => ({}))) as { email?: string; password?: string }
  const ok = same(email.trim().toLowerCase(), adminEmail.toLowerCase()) && same(password, adminPassword)
  if (!ok) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })

  const token = await createAdminToken()
  if (!token) return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 503 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: ADMIN_SESSION_MS / 1000 })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 0 })
  return res
}

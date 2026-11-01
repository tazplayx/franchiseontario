import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin-session'

/**
 * Server-side admin protection.
 * - /admin/* pages redirect to the admin login unless a valid signed session exists.
 * - /api/admin/* (except login) return 401 without a session.
 * - /api/claims and /api/tickets: public POST (submissions) only; reading or changing them needs a session.
 * Browser-side flags alone are no longer enough to see any admin data.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin' || pathname === '/api/admin/login') return NextResponse.next()

  const isPublicSubmission =
    (pathname === '/api/claims' || pathname === '/api/tickets') && req.method === 'POST'
  if (isPublicSubmission) return NextResponse.next()

  const authed = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value)
  if (authed) return NextResponse.next()

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.redirect(new URL('/admin', req.url))
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/claims', '/api/tickets'],
}

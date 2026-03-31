/**
 * GET /api/email/verify?token=<token>
 * Validates a stateless HMAC verification token.
 *
 * Returns: { valid: true, email: string } or { valid: false, error: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/verification'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ valid: false, error: 'Missing token parameter' }, { status: 400 })
  }

  const result = verifyToken(token)

  if (!result.valid) {
    return NextResponse.json(
      { valid: false, error: 'Token is invalid or has expired' },
      { status: 200 } // 200 so the client can read the JSON body
    )
  }

  return NextResponse.json({ valid: true, email: result.email })
}

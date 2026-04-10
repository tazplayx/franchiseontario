/**
 * POST /api/email/send
 * Central transactional email endpoint.
 *
 * Body: { to: string, type: EmailType, data: EmailData }
 *
 * Requires RESEND_API_KEY in .env.local.
 * If the key is missing, logs a warning and returns 200 (silent no-op).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getEmailContent, type EmailType, type EmailData } from '@/lib/email'
import { generateVerificationToken } from '@/lib/verification'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { to, type, data }: { to: string; type: EmailType; data: EmailData } = body

    if (!to || !type) {
      return NextResponse.json({ error: 'Missing required fields: to, type' }, { status: 400 })
    }

    // Auto-generate token URLs if not supplied
    let resolvedData: EmailData = { ...data }
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.franchiseontario.com'
    if (type === 'verify-email' && !resolvedData.verifyUrl) {
      const token = generateVerificationToken(to)
      resolvedData = { ...resolvedData, verifyUrl: `${base}/verify-email?token=${token}` }
    }
    if (type === 'reset-password' && !resolvedData.resetUrl) {
      const token = generateVerificationToken(to)
      resolvedData = { ...resolvedData, resetUrl: `${base}/reset-password?token=${token}` }
    }

    const { subject, html } = getEmailContent(type, resolvedData)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[Email] RESEND_API_KEY not set. Email not sent:', { to, type })
      // For verification emails, return the verifyUrl so the UI can provide a manual fallback
      return NextResponse.json({
        ok: true,
        note: 'Email skipped — RESEND_API_KEY not configured',
        devMode: true,
        verifyUrl: type === 'verify-email' ? resolvedData.verifyUrl : undefined,
        resetUrl: type === 'reset-password' ? resolvedData.resetUrl : undefined,
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'FranchiseOntario <info@franchiseontario.com>',
        to: [to],
        bcc: ['info@franchiseontario.com'],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[Email] Resend API error:', errText)
      return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 })
    }

    const result = await res.json()
    return NextResponse.json({ ok: true, id: result.id })
  } catch (err) {
    console.error('[Email] Handler error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

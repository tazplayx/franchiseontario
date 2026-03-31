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

    // Auto-generate verifyUrl for verify-email type if not supplied
    let resolvedData: EmailData = { ...data }
    if (type === 'verify-email' && !resolvedData.verifyUrl) {
      const token = generateVerificationToken(to)
      const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.franchiseontario.com'
      resolvedData = { ...resolvedData, verifyUrl: `${base}/verify-email?token=${token}` }
    }

    const { subject, html } = getEmailContent(type, resolvedData)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      // Resend key not yet configured — log and return silently
      console.warn('[Email] RESEND_API_KEY not set. Email not sent:', { to, type })
      return NextResponse.json({ ok: true, note: 'Email skipped — RESEND_API_KEY not configured' })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'FranchiseOntario <noreply@franchiseontario.com>',
        to: [to],
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

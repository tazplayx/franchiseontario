import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limit: 1 request per email per 60 minutes
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_MS = 60 * 60 * 1000 // 1 hour

/** Escape user-supplied strings before embedding in HTML email */
function esc(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { franchiseName, franchiseId, contactName, email, reason } = body

    // Basic field validation
    if (!franchiseName || !email || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (typeof reason !== 'string' || reason.trim().length < 20) {
      return NextResponse.json({ error: 'Please provide a reason of at least 20 characters' }, { status: 400 })
    }

    // Rate limit: one request per email per hour
    const emailKey = email.toLowerCase().trim()
    const lastSent = rateLimitMap.get(emailKey) ?? 0
    const now = Date.now()
    if (now - lastSent < RATE_LIMIT_MS) {
      const minutesLeft = Math.ceil((RATE_LIMIT_MS - (now - lastSent)) / 60000)
      return NextResponse.json(
        { error: `A removal request was already submitted from this address. Please wait ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} before trying again.` },
        { status: 429 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[Removal Request] RESEND_API_KEY not set — request logged only')
      rateLimitMap.set(emailKey, now)
      return NextResponse.json({ ok: true, note: 'Logged — email service not configured' })
    }

    // Escape all user inputs before embedding in HTML
    const safeName = esc(franchiseName)
    const safeId   = esc(franchiseId ?? 'N/A')
    const safeContact = esc(contactName ?? '')
    const safeEmail = esc(email)
    const safeReason = esc(reason.trim())

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FranchiseOntario <info@franchiseontario.com>',
        to: 'info@franchiseontario.com',
        reply_to: email,
        subject: `[Removal Request] ${safeName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0a1428">
            <div style="background:#00228e;padding:20px 24px;border-radius:8px 8px 0 0">
              <h1 style="color:white;margin:0;font-size:18px">Listing Removal Request</h1>
              <p style="color:#fca5a5;margin:4px 0 0;font-size:13px">FranchiseOntario.com</p>
            </div>
            <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:8px 12px 8px 0;color:#64748b;vertical-align:top"><strong>Franchise</strong></td><td style="padding:8px 0">${safeName}</td></tr>
                <tr><td style="padding:8px 12px 8px 0;color:#64748b;vertical-align:top"><strong>Listing ID</strong></td><td style="padding:8px 0;font-family:monospace;font-size:13px">${safeId}</td></tr>
                <tr><td style="padding:8px 12px 8px 0;color:#64748b;vertical-align:top"><strong>Contact</strong></td><td style="padding:8px 0">${safeContact}</td></tr>
                <tr><td style="padding:8px 12px 8px 0;color:#64748b;vertical-align:top"><strong>Email</strong></td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#00228e">${safeEmail}</a></td></tr>
              </table>
              <div style="margin-top:20px;padding:16px;background:white;border:1px solid #e2e8f0;border-radius:8px">
                <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:600">REASON FOR REMOVAL</p>
                <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${safeReason}</p>
              </div>
              <p style="margin:20px 0 0;font-size:12px;color:#94a3b8">Reply to this email to respond to the requester.</p>
            </div>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Removal Request] Resend error:', err)
      return NextResponse.json({ error: 'Failed to send request' }, { status: 500 })
    }

    // Only record the rate-limit timestamp after a successful send
    rateLimitMap.set(emailKey, now)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Removal Request] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

/**
 * POST /api/claim
 * Notifies the admin when a user submits a listing claim request.
 * The claim itself is persisted in the browser (localStorage) by the client.
 * This route just sends the admin notification email via Resend.
 */
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      franchiseId,
      franchiseName,
      claimantName,
      claimantEmail,
      claimantTitle,
      message,
      sourceListingUrl,
      domainMatch,
    } = body

    if (!franchiseId || !claimantEmail || !franchiseName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[Claim] RESEND_API_KEY not set — claim notification skipped')
      return NextResponse.json({ ok: true, note: 'Email skipped — RESEND_API_KEY not configured' })
    }

    const adminEmail = 'cdeneire@proton.me'
    const domainNote = domainMatch
      ? '✅ Domain match — email domain aligns with the listing website.'
      : '⚠️ Domain mismatch — manually verify ownership before approving.'

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px">
        <div style="background:#C8102E;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px">
          <h1 style="margin:0;font-size:18px">🍁 New Listing Claim — FranchiseOntario</h1>
        </div>
        <p style="margin:0 0 16px;color:#374151;font-size:15px">
          A franchise owner has requested to claim a sourced listing.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
          <tr><td style="padding:8px 0;color:#6b7280;width:160px">Listing</td><td style="padding:8px 0;font-weight:600;color:#111827">${franchiseName}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Listing ID</td><td style="padding:8px 0;color:#374151">${franchiseId}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Source URL</td><td style="padding:8px 0"><a href="${sourceListingUrl}" style="color:#C8102E">${sourceListingUrl}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Claimant Name</td><td style="padding:8px 0;font-weight:600;color:#111827">${claimantName}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Title</td><td style="padding:8px 0;color:#374151">${claimantTitle}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${claimantEmail}" style="color:#C8102E">${claimantEmail}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Domain Check</td><td style="padding:8px 0;font-weight:600">${domainNote}</td></tr>
        </table>
        ${message ? `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-bottom:20px"><p style="margin:0 0 6px;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Message from claimant</p><p style="margin:0;font-size:14px;color:#374151">${message}</p></div>` : ''}
        <a href="https://www.franchiseontario.com/admin/claims" style="display:inline-block;background:#C8102E;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          Review in Admin → Claims
        </a>
        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">FranchiseOntario.com — Admin notification</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'FranchiseOntario <noreply@franchiseontario.com>',
        to: [adminEmail],
        subject: `[Claim Request] ${franchiseName} — ${claimantName}`,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[Claim] Resend error:', errText)
      return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Claim] Handler error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { franchiseName, franchiseId, contactName, email, reason } = await req.json()

    if (!franchiseName || !email || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[Removal Request] RESEND_API_KEY not set — request logged only')
      return NextResponse.json({ ok: true, note: 'Logged — email service not configured' })
    }

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
        subject: `[Removal Request] ${franchiseName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0a1428">
            <div style="background:#00228e;padding:20px 24px;border-radius:8px 8px 0 0">
              <h1 style="color:white;margin:0;font-size:18px">Listing Removal Request</h1>
              <p style="color:#fca5a5;margin:4px 0 0;font-size:13px">FranchiseOntario.com</p>
            </div>
            <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:8px 12px 8px 0;color:#64748b;vertical-align:top"><strong>Franchise</strong></td><td style="padding:8px 0">${franchiseName}</td></tr>
                <tr><td style="padding:8px 12px 8px 0;color:#64748b;vertical-align:top"><strong>Listing ID</strong></td><td style="padding:8px 0;font-family:monospace;font-size:13px">${franchiseId || 'N/A'}</td></tr>
                <tr><td style="padding:8px 12px 8px 0;color:#64748b;vertical-align:top"><strong>Contact</strong></td><td style="padding:8px 0">${contactName}</td></tr>
                <tr><td style="padding:8px 12px 8px 0;color:#64748b;vertical-align:top"><strong>Email</strong></td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#00228e">${email}</a></td></tr>
              </table>
              <div style="margin-top:20px;padding:16px;background:white;border:1px solid #e2e8f0;border-radius:8px">
                <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:600">REASON FOR REMOVAL</p>
                <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${reason}</p>
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

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Removal Request] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

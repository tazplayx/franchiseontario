import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Email service unavailable' }, { status: 500 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FranchiseOntario <noreply@franchiseontario.com>',
        to: 'info@franchiseontario.com',
        reply_to: email,
        subject: `[FranchiseOntario Contact] ${subject || 'General Inquiry'} — from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0D1B2A">
            <div style="background:#C8102E;padding:20px 24px;border-radius:8px 8px 0 0">
              <h1 style="color:white;margin:0;font-size:18px">New Contact Form Message</h1>
              <p style="color:#fca5a5;margin:4px 0 0;font-size:13px">FranchiseOntario.com</p>
            </div>
            <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none">
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#64748b;white-space:nowrap;vertical-align:top"><strong>Name</strong></td>
                  <td style="padding:8px 0;color:#0D1B2A">${name}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#64748b;white-space:nowrap;vertical-align:top"><strong>Email</strong></td>
                  <td style="padding:8px 0"><a href="mailto:${email}" style="color:#C8102E">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 12px 8px 0;color:#64748b;white-space:nowrap;vertical-align:top"><strong>Subject</strong></td>
                  <td style="padding:8px 0;color:#0D1B2A">${subject || 'General Inquiry'}</td>
                </tr>
              </table>
              <div style="margin-top:20px;padding:16px;background:white;border:1px solid #e2e8f0;border-radius:8px">
                <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:600">MESSAGE</p>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#0D1B2A;white-space:pre-wrap">${message}</p>
              </div>
              <p style="margin:20px 0 0;font-size:12px;color:#94a3b8">
                Reply directly to this email to respond to ${name}.
              </p>
            </div>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

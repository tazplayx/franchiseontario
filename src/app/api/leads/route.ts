/**
 * POST /api/leads
 * Notifies franchise owner of a new lead via email (Resend).
 * The lead itself is persisted on the client in localStorage.
 */
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lead, ownerEmail, franchiseName } = body as {
      lead: {
        name: string; email: string; phone: string
        city: string; investmentBudget: string; message: string
      }
      ownerEmail: string
      franchiseName: string
    }

    if (!lead || !ownerEmail || !franchiseName) {
      return NextResponse.json({ ok: true }) // silent — lead already saved client-side
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ ok: true, note: 'Email skipped — RESEND_API_KEY not configured' })
    }

    const html = `
      <div style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px">
        <div style="background:#00228e;color:#fff;padding:14px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px">
          <h1 style="margin:0;font-size:17px">🔔 New Lead — ${franchiseName}</h1>
        </div>
        <p style="color:#374151;font-size:14px;margin:0 0 16px">
          A potential franchisee has submitted their information via FranchiseOntario.com.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
          <tr><td style="padding:8px 0;color:#6b7280;width:140px">Name</td><td style="padding:8px 0;font-weight:600;color:#111827">${lead.name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${lead.email}" style="color:#00228e">${lead.email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td style="padding:8px 0;color:#374151">${lead.phone || 'Not provided'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">City</td><td style="padding:8px 0;color:#374151">${lead.city || 'Not provided'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Investment Budget</td><td style="padding:8px 0;font-weight:600;color:#111827">${lead.investmentBudget}</td></tr>
        </table>
        ${lead.message ? `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-bottom:20px"><p style="margin:0 0 6px;font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase">Message</p><p style="margin:0;font-size:14px;color:#374151">${lead.message}</p></div>` : ''}
        <a href="https://www.franchiseontario.com/dashboard" style="display:inline-block;background:#00228e;color:#fff;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">
          View All Leads in Dashboard →
        </a>
        <p style="margin:20px 0 0;font-size:11px;color:#9ca3af">FranchiseOntario.com — your franchise lead management platform</p>
      </div>
    `

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: 'FranchiseOntario <noreply@franchiseontario.com>',
        to: [ownerEmail],
        subject: `New Lead: ${lead.name} is interested in ${franchiseName}`,
        html,
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Leads] Error:', err)
    return NextResponse.json({ ok: true }) // non-blocking — lead saved client-side regardless
  }
}

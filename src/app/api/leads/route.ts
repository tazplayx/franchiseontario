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
    const { lead, ownerEmail, franchiseName, franchiseContactEmail } = body as {
      lead: {
        name: string; email: string; phone: string
        city: string; investmentBudget: string; message: string
      }
      ownerEmail: string
      franchiseName: string
      franchiseContactEmail?: string
    }

    if (!lead || !ownerEmail || !franchiseName) {
      return NextResponse.json({ ok: true })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ ok: true, note: 'Email skipped — RESEND_API_KEY not configured' })
    }

    const resend = (to: string, subject: string, html: string) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ from: 'FranchiseOntario <noreply@franchiseontario.com>', to: [to], subject, html }),
      })

    // ── 1. Notify the registered account owner ────────────────────────────────
    const ownerHtml = `
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
      </div>`

    // ── 2. Pitch email to franchise's public contact ───────────────────────────
    const pitchHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#0a1428">
        <div style="background:#00228e;padding:22px 28px;border-radius:10px 10px 0 0">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:8px;text-align:center;line-height:32px;font-size:16px">🍁</div>
            <div>
              <div style="color:white;font-weight:800;font-size:16px">FranchiseOntario.com</div>
              <div style="color:rgba(255,255,255,0.6);font-size:12px;margin-top:2px">Ontario's #1 Franchise Directory</div>
            </div>
          </div>
        </div>
        <div style="background:#f8fafc;padding:28px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px">
          <p style="margin:0 0 14px;font-size:14px;line-height:1.7">Hi ${franchiseName} Franchise Team,</p>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.7">
            A qualified lead just expressed interest in <strong>${franchiseName}</strong> through
            <a href="https://www.franchiseontario.com" style="color:#ff000d;text-decoration:none;font-weight:600">FranchiseOntario.com</a> —
            Ontario's fastest-growing franchise discovery platform.
          </p>

          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin:0 0 20px">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#64748b">Lead Summary</p>
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <tr>
                <td style="padding:6px 0;color:#6b7280;width:130px">Name</td>
                <td style="padding:6px 0;font-weight:700;color:#0a1428">${lead.name}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280">Location</td>
                <td style="padding:6px 0;color:#374151">${lead.city || 'Ontario'}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280">Investment Budget</td>
                <td style="padding:6px 0;font-weight:700;color:#ff000d">${lead.investmentBudget}</td>
              </tr>
              ${lead.message ? `<tr><td style="padding:6px 0;color:#6b7280;vertical-align:top">Message</td><td style="padding:6px 0;color:#374151;font-style:italic">"${lead.message}"</td></tr>` : ''}
            </table>
            <div style="margin-top:14px;padding-top:14px;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8">
              ⚠️ Full contact details (email &amp; phone) are available in your franchisor dashboard after creating a free account.
            </div>
          </div>

          <p style="margin:0 0 14px;font-size:14px;line-height:1.7">
            <strong>${franchiseName}</strong> is already featured on FranchiseOntario.com and appearing in front of
            <strong>2,500+ Ontario investors</strong> every month. Create your free account to:
          </p>
          <ul style="padding-left:20px;margin:0 0 20px;font-size:14px;line-height:2;color:#374151">
            <li>View this lead's full contact details</li>
            <li>Receive instant email alerts for every new lead</li>
            <li>Manage and respond to inquiries from your dashboard</li>
            <li>Upgrade your listing for priority placement</li>
          </ul>

          <a href="https://www.franchiseontario.com/register" style="display:inline-block;background:#ff000d;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin-bottom:20px">
            Claim Your Listing &amp; View This Lead →
          </a>

          <p style="margin:0 0 14px;font-size:13px;color:#64748b;line-height:1.6">
            Already have an account?
            <a href="https://www.franchiseontario.com/dashboard/login" style="color:#ff000d;text-decoration:none;font-weight:600">Sign in to your dashboard</a> to view the full lead details.
          </p>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0 16px" />
          <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6">
            FranchiseOntario.com — Ontario's #1 Franchise Directory<br />
            You're receiving this because ${franchiseName} is listed on our platform.<br />
            <a href="https://www.franchiseontario.com/support" style="color:#64748b;text-decoration:none">Unsubscribe</a> ·
            <a href="https://www.franchiseontario.com/support" style="color:#64748b;text-decoration:none">Contact Us</a>
          </p>
        </div>
      </div>`

    const sends: Promise<unknown>[] = [
      resend(ownerEmail, `New Lead: ${lead.name} is interested in ${franchiseName}`, ownerHtml),
    ]

    // Only pitch the public contact if it's a real email and different from the owner
    const isValidPublicEmail = (e?: string) =>
      !!e && e !== 'See website' && e.includes('@') && e !== ownerEmail

    if (isValidPublicEmail(franchiseContactEmail)) {
      sends.push(
        resend(
          franchiseContactEmail!,
          `New franchise lead captured for ${franchiseName} on FranchiseOntario.com`,
          pitchHtml,
        )
      )
    }

    await Promise.allSettled(sends)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Leads] Error:', err)
    return NextResponse.json({ ok: true })
  }
}

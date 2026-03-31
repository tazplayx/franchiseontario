/**
 * Email template library for FranchiseOntario transactional emails.
 * All emails use the Resend API via /api/email/send route.
 *
 * To activate: add RESEND_API_KEY=re_xxxxxxx to .env.local
 * and verify franchiseontario.com at resend.com/domains
 */

export type EmailType =
  | 'welcome'
  | 'verify-email'
  | 'listing-approved'
  | 'listing-rejected'
  | 'listing-removed'
  | 'listing-edited-admin'
  | 'listing-removed-user'
  | 'listing-edited-user'
  | 'membership-ending'
  | 'payment-failed'

export interface EmailData {
  franchiseName?: string
  contactName?: string
  plan?: string
  verifyUrl?: string
  editedFields?: string[]
}

// ── Branded shell ──────────────────────────────────────────────────────────────
function shell(title: string, body: string): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#0D1B2A">
  <div style="background:#C8102E;padding:22px 28px;border-radius:10px 10px 0 0">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:32px;height:32px;background:rgba(255,255,255,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px">🍁</div>
      <div>
        <div style="color:white;font-weight:800;font-size:16px;margin:0">${title}</div>
        <div style="color:rgba(255,255,255,0.6);font-size:12px;margin:2px 0 0">FranchiseOntario.com</div>
      </div>
    </div>
  </div>
  <div style="background:#f8fafc;padding:28px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px">
    ${body}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0 18px" />
    <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6">
      FranchiseOntario.com — Ontario&rsquo;s #1 Franchise Directory<br />
      Questions? <a href="https://www.franchiseontario.com/support" style="color:#C8102E;text-decoration:none">Visit our support page</a> or reply to this email.
    </p>
  </div>
</div>`.trim()
}

function btn(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#C8102E;color:white;padding:13px 26px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;margin:16px 0">${label}</a>`
}

function p(text: string): string {
  return `<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#0D1B2A">${text}</p>`
}

// ── Templates ─────────────────────────────────────────────────────────────────
export function getEmailContent(
  type: EmailType,
  data: EmailData
): { subject: string; html: string } {
  const name = data.contactName || 'there'
  const franchise = data.franchiseName || 'your franchise'
  const plan = data.plan || 'Basic'

  switch (type) {

    case 'welcome':
      return {
        subject: `Welcome to FranchiseOntario — ${franchise} is under review`,
        html: shell('Welcome to FranchiseOntario! 🎉', `
          ${p(`Hi ${name},`)}
          ${p(`Thank you for submitting <strong>${franchise}</strong> to FranchiseOntario.com — Ontario's #1 franchise directory.`)}
          ${p('<strong>What happens next:</strong>')}
          <ol style="padding-left:20px;line-height:2;font-size:14px;color:#0D1B2A;margin:0 0 14px">
            <li>Our team will review your listing within 1–4 business hours</li>
            <li>You'll receive an email confirmation once it's approved and live</li>
            <li>Your listing will be visible to thousands of Ontario franchise investors</li>
          </ol>
          ${p(`Your selected plan: <strong>${plan}</strong>`)}
          ${btn('https://www.franchiseontario.com/dashboard', 'Go to Your Dashboard →')}
        `),
      }

    case 'verify-email':
      return {
        subject: 'Verify your email — FranchiseOntario registration',
        html: shell('Verify Your Email Address', `
          ${p(`Hi ${name},`)}
          ${p('Please verify your email address to continue your FranchiseOntario listing registration. This link expires in <strong>24 hours</strong>.')}
          ${btn(data.verifyUrl ?? 'https://www.franchiseontario.com/register', 'Verify My Email →')}
          ${p(`<span style="color:#64748b;font-size:13px">If you didn't start a registration on FranchiseOntario, you can safely ignore this email.</span>`)}
          <p style="margin:12px 0 0;font-size:11px;color:#94a3b8;word-break:break-all">Or copy this link into your browser:<br />${data.verifyUrl}</p>
        `),
      }

    case 'listing-approved':
      return {
        subject: `🎉 Your listing is live! — ${franchise}`,
        html: shell("Your Listing is Approved & Live! 🎉", `
          ${p(`Hi ${name},`)}
          ${p(`Great news! Your franchise listing for <strong>${franchise}</strong> has been reviewed and approved by our team. It's now live on FranchiseOntario.com.`)}
          ${p(`Your listing plan: <strong>${plan}</strong>`)}
          ${btn('https://www.franchiseontario.com/directory', 'View the Directory →')}
          ${p(`Manage your listing, view analytics, and get support from your <a href="https://www.franchiseontario.com/dashboard" style="color:#C8102E">Franchisor Dashboard</a>.`)}
        `),
      }

    case 'listing-rejected':
      return {
        subject: `Update on your listing submission — ${franchise}`,
        html: shell('Listing Review Update', `
          ${p(`Hi ${name},`)}
          ${p(`Thank you for submitting <strong>${franchise}</strong> to FranchiseOntario.com.`)}
          ${p('After review, we were unable to approve your listing at this time. This may be due to incomplete information, content that doesn\'t meet our guidelines, or eligibility requirements.')}
          ${p('Our team would be happy to help you resubmit with the right information.')}
          ${btn('https://www.franchiseontario.com/support', 'Contact Support →')}
        `),
      }

    case 'listing-removed':
      return {
        subject: `Your listing has been removed — ${franchise}`,
        html: shell('Listing Removed from Directory', `
          ${p(`Hi ${name},`)}
          ${p(`Your listing for <strong>${franchise}</strong> has been removed from FranchiseOntario.com by our team.`)}
          ${p('If you believe this was done in error or would like to discuss reinstatement, please contact our support team.')}
          ${btn('https://www.franchiseontario.com/support', 'Contact Support →')}
          ${p(`If you'd like to re-list your franchise, you're welcome to <a href="https://www.franchiseontario.com/register" style="color:#C8102E">submit a new listing</a> at any time.`)}
        `),
      }

    case 'listing-edited-admin':
      return {
        subject: `Your listing has been updated — ${franchise}`,
        html: shell('Your Listing Was Updated by Our Team', `
          ${p(`Hi ${name},`)}
          ${p(`A member of the FranchiseOntario team has made updates to your listing for <strong>${franchise}</strong>.`)}
          ${data.editedFields && data.editedFields.length > 0
            ? `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin:0 0 14px;font-size:13px">
                <strong style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.05em">Fields Updated</strong><br />
                <span style="color:#0D1B2A">${data.editedFields.join(', ')}</span>
               </div>`
            : ''}
          ${p('You can review your listing and request any corrections from your dashboard.')}
          ${btn('https://www.franchiseontario.com/dashboard', 'Review Your Listing →')}
        `),
      }

    case 'listing-removed-user':
      return {
        subject: `Listing removal confirmed — ${franchise}`,
        html: shell('Your Listing Has Been Removed', `
          ${p(`Hi ${name},`)}
          ${p(`We've confirmed the removal of <strong>${franchise}</strong> from FranchiseOntario.com as requested.`)}
          ${p('Your listing is no longer visible to the public. If you have an active paid subscription, please cancel it through your billing settings to avoid future charges.')}
          ${p('We\'re sorry to see you go! You can always <a href="https://www.franchiseontario.com/register" style="color:#C8102E">re-list your franchise</a> at any time.')}
        `),
      }

    case 'listing-edited-user':
      return {
        subject: `Listing updated — ${franchise}`,
        html: shell('Your Listing Has Been Updated', `
          ${p(`Hi ${name},`)}
          ${p(`Your listing for <strong>${franchise}</strong> has been successfully updated on FranchiseOntario.com.`)}
          ${btn('https://www.franchiseontario.com/directory', 'View Your Live Listing →')}
        `),
      }

    case 'membership-ending':
      return {
        subject: `Your FranchiseOntario subscription has ended — ${franchise}`,
        html: shell('Subscription Cancelled', `
          ${p(`Hi ${name},`)}
          ${p(`Your <strong>${plan}</strong> subscription for <strong>${franchise}</strong> on FranchiseOntario.com has been cancelled.`)}
          ${p('Your listing will remain visible on the directory under the Basic (free) tier. To restore premium features, you can resubscribe at any time from your dashboard.')}
          ${btn('https://www.franchiseontario.com/dashboard', 'Resubscribe →')}
        `),
      }

    case 'payment-failed':
      return {
        subject: `Payment failed — action required for ${franchise}`,
        html: shell('Payment Failed — Action Required', `
          ${p(`Hi ${name},`)}
          ${p(`We were unable to process the payment for your <strong>${plan}</strong> subscription on FranchiseOntario.com.`)}
          ${p('To keep your premium listing features active, please update your payment method as soon as possible.')}
          ${btn('https://www.franchiseontario.com/dashboard', 'Update Payment Method →')}
          ${p('<span style="color:#64748b;font-size:13px">If payment is not updated, your listing may be moved to the Basic tier after 7 days.</span>')}
        `),
      }

    default:
      return {
        subject: 'Message from FranchiseOntario',
        html: shell('Message from FranchiseOntario', p('Thank you for using FranchiseOntario.com.')),
      }
  }
}

// ── Fire-and-forget helper for client components ──────────────────────────────
/**
 * Call from client components / server actions to send a transactional email.
 * Silently catches errors so UI is never blocked by email failures.
 *
 * Every call is also written to the admin notification log in localStorage so
 * admins can audit all outgoing emails even if Resend is not yet configured.
 */
export async function sendEmail(
  to: string,
  type: EmailType,
  data: EmailData
): Promise<void> {
  // Derive the subject line so we can show it in the admin log
  const { subject } = getEmailContent(type, data)

  // Write to the in-app notification log (localStorage — client side only)
  if (typeof window !== 'undefined') {
    // Lazy-import to avoid a circular module issue at build time
    import('@/lib/store').then(({ saveNotification }) => {
      saveNotification({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        to,
        franchiseName: data.franchiseName ?? '',
        subject,
        sentAt: new Date().toISOString(),
      })
    }).catch(() => { /* non-critical */ })
  }

  // Fire the email via the centralized API route
  try {
    await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, type, data }),
    })
  } catch {
    // Never block the UI on email failures
  }
}

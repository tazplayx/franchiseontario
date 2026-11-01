import { NextRequest, NextResponse } from 'next/server'
import rawPosts from '@/data/blog-posts.json'
import { franchises } from '@/data/franchises'
import { sbSelect, supabaseConfigured } from '@/lib/supabase-server'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type Check = { name: string; ok: boolean; detail: string; fix?: string }

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.franchiseontario.com'

const PAGES = [
  '/', '/directory', '/compare', '/pricing', '/register', '/dashboard', '/insights', '/resources',
  '/faq', '/support', '/quiz', '/categories', '/ontario', '/ontario/toronto', '/claim/chucks-roadhouse',
  '/browse/toronto/fast-food', '/sitemap.xml', '/robots.txt',
]

const REQUIRED_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_PREMIUM', 'STRIPE_PRICE_ENTERPRISE', 'STRIPE_PRICE_FEATURE_SPOTLIGHT', 'RESEND_API_KEY',
  'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET', 'FRANCHISOR_SESSION_SECRET', 'CRON_SECRET', 'HMAC_SECRET',
]

async function fetchStatus(path: string): Promise<number> {
  try {
    const res = await fetch(BASE + path, { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(20000) })
    return res.status
  } catch {
    return 0
  }
}

async function checkPages(): Promise<Check[]> {
  const results = await Promise.all(PAGES.map(async (p) => ({ p, s: await fetchStatus(p) })))
  const failing: Check[] = results
    .filter((r) => r.s !== 200)
    .map((r) => ({ name: `Page ${r.p}`, ok: false, detail: `returned HTTP ${r.s || 'no response'}`, fix: 'Check the latest deployment in Vercel and the build logs.' }))
  const summary: Check = { name: 'Public pages', ok: failing.length === 0, detail: `${PAGES.length - failing.length}/${PAGES.length} responding` }
  return [summary, ...failing]
}

async function checkApis(): Promise<Check[]> {
  const out: Check[] = []
  // Protected endpoints must refuse anonymous access
  for (const p of ['/api/admin/leads', '/api/franchisor/leads']) {
    const s = await fetchStatus(p)
    out.push({ name: `Access control ${p}`, ok: s === 401, detail: s === 401 ? 'refuses anonymous access (good)' : `returned HTTP ${s} — should be 401`, fix: 'Check middleware.ts matcher and the session secrets.' })
  }
  try {
    const res = await fetch(BASE + '/api/listings', { cache: 'no-store', signal: AbortSignal.timeout(20000) })
    const data = (await res.json()) as unknown[]
    out.push({ name: 'Approved listings API', ok: res.ok, detail: `${Array.isArray(data) ? data.length : 0} approved listings served from the database` })
  } catch (e) {
    out.push({ name: 'Approved listings API', ok: false, detail: String(e), fix: 'The database may be paused or misconfigured.' })
  }
  return out
}

async function checkDatabase(): Promise<Check[]> {
  if (!supabaseConfigured()) return [{ name: 'Database', ok: false, detail: 'Supabase not configured', fix: 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' }]
  const tables = ['leads', 'accounts', 'listings', 'claims', 'tickets', 'subscriptions', 'newsletter_subscribers']
  const out: Check[] = []
  for (const t of tables) {
    try {
      await sbSelect(t, 'select=*&limit=1')
      out.push({ name: `Table ${t}`, ok: true, detail: 'reachable' })
    } catch (e) {
      const msg = String(e)
      const paused = /fetch failed|ENOTFOUND|EAI_AGAIN|521|503/.test(msg)
      out.push({
        name: `Table ${t}`,
        ok: false,
        detail: msg.slice(0, 160),
        fix: paused
          ? 'Supabase looks unreachable or paused. Open supabase.com/dashboard and restore the project.'
          : `The table may be missing. Re-run supabase/schema.sql in the Supabase SQL Editor.`,
      })
    }
  }
  return out
}

async function checkStripe(): Promise<Check[]> {
  const out: Check[] = []
  try {
    const stripe = getStripe()
    await stripe.balance.retrieve()
    out.push({ name: 'Stripe API key', ok: true, detail: 'valid' })

    for (const [label, id] of [
      ['Premium price', process.env.STRIPE_PRICE_PREMIUM],
      ['Enterprise price', process.env.STRIPE_PRICE_ENTERPRISE],
      ['Spotlight price', process.env.STRIPE_PRICE_FEATURE_SPOTLIGHT],
    ] as const) {
      try {
        const p = await stripe.prices.retrieve(id!)
        out.push({ name: label, ok: p.active, detail: `${(p.unit_amount ?? 0) / 100} ${p.currency.toUpperCase()}/${p.recurring?.interval ?? 'one-time'} ${p.active ? 'active' : 'INACTIVE'}`, fix: p.active ? undefined : 'Re-activate the price in the Stripe Dashboard.' })
      } catch (e) {
        out.push({ name: label, ok: false, detail: String(e).slice(0, 140), fix: 'The price ID in Vercel does not match Stripe. Update the env var.' })
      }
    }

    const endpoints = await stripe.webhookEndpoints.list({ limit: 20 })
    const mine = endpoints.data.find((e) => e.url === `${BASE}/api/stripe/webhook`)
    out.push({
      name: 'Stripe webhook endpoint',
      ok: !!mine && mine.status === 'enabled',
      detail: mine ? `${mine.status}, ${mine.enabled_events.length} events` : 'no endpoint for this site',
      fix: mine ? undefined : `Add ${BASE}/api/stripe/webhook in Stripe → Developers → Webhooks.`,
    })
  } catch (e) {
    out.push({ name: 'Stripe', ok: false, detail: String(e).slice(0, 160), fix: 'Stripe key may be expired or revoked. Roll a new secret key and update Vercel.' })
  }
  return out
}

async function checkEmail(): Promise<Check[]> {
  try {
    const res = await fetch('https://api.resend.com/domains', { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` }, signal: AbortSignal.timeout(15000) })
    if (!res.ok) return [{ name: 'Email (Resend)', ok: false, detail: `HTTP ${res.status}`, fix: 'Resend key is invalid or revoked. Create a new key and update RESEND_API_KEY in Vercel.' }]
    const body = (await res.json()) as { data?: { name: string; status: string }[] }
    const domain = (body.data ?? []).find((d) => d.name === 'franchiseontario.com')
    return [{
      name: 'Email domain',
      ok: domain?.status === 'verified',
      detail: domain ? `franchiseontario.com ${domain.status}` : 'domain not found in Resend',
      fix: domain?.status === 'verified' ? undefined : 'Verify franchiseontario.com in Resend → Domains, or emails will not reach customers.',
    }]
  } catch (e) {
    return [{ name: 'Email (Resend)', ok: false, detail: String(e).slice(0, 140), fix: 'Could not reach Resend. Check the key and Resend status.' }]
  }
}

function checkContent(): Check[] {
  const out: Check[] = []
  const posts = rawPosts as { id: string; publishedAt: string }[]
  const latest = posts.reduce((a, b) => (new Date(a.publishedAt) > new Date(b.publishedAt) ? a : b))
  const ageDays = (Date.now() - new Date(latest.publishedAt).getTime()) / 86400000
  out.push({
    name: 'Blog freshness',
    ok: ageDays <= 5,
    detail: `latest post ${Math.floor(ageDays)} day(s) old (${posts.length} total)`,
    fix: ageDays <= 5 ? undefined : 'The blog generator has stopped. Check the "Generate Blog Post" GitHub Action and the Anthropic credit balance.',
  })
  const postIds = posts.map((p) => p.id)
  const dupPosts = postIds.filter((id, i) => postIds.indexOf(id) !== i)
  const dupPostIds = Array.from(new Set(dupPosts))
  out.push({ name: 'Blog URL uniqueness', ok: dupPostIds.length === 0, detail: dupPostIds.length ? `duplicate URLs: ${dupPostIds.join(', ')}` : 'all unique', fix: 'Give each duplicate post a unique id in src/data/blog-posts.json.' })

  const ids = franchises.map((f) => f.id)
  const dupListings = ids.filter((id, i) => ids.indexOf(id) !== i)
  const dupListingIds = Array.from(new Set(dupListings))
  out.push({ name: 'Directory uniqueness', ok: dupListingIds.length === 0, detail: dupListingIds.length ? `duplicate listing ids: ${dupListingIds.join(', ')}` : 'all unique', fix: 'Duplicate listing ids break pages. The scraper now prevents this; re-run the directory scrape.' })

  const sourced = franchises.filter((f) => f.sourced).length
  out.push({ name: 'Sourced directory listings', ok: sourced >= 300, detail: `${sourced} sourced listings`, fix: sourced >= 300 ? undefined : 'The directory scraper is returning too few listings. Check the "Scrape Franchise Listings" GitHub Action.' })
  out.push({ name: 'Directory size', ok: franchises.length >= 300, detail: `${franchises.length} listings total` })
  return out
}

function checkConfig(): Check[] {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k])
  const out: Check[] = [{
    name: 'Configuration',
    ok: missing.length === 0,
    detail: missing.length ? `missing: ${missing.join(', ')}` : 'all required settings present',
    fix: missing.length ? 'Add the missing variables in Vercel → Settings → Environment Variables, then redeploy.' : undefined,
  }]
  if (process.env.HMAC_SECRET === 'change-me-to-a-random-32-char-string' || (process.env.HMAC_SECRET ?? '').length < 32) {
    out.push({ name: 'Email token secret', ok: false, detail: 'HMAC_SECRET is weak or a placeholder', fix: 'Set HMAC_SECRET to a random 32+ character value.' })
  }
  if (process.env.STRIPE_TAX_ENABLED !== 'true') {
    out.push({ name: 'Sales tax (HST/GST)', ok: false, detail: 'STRIPE_TAX_ENABLED is not set to true', fix: 'Set STRIPE_TAX_ENABLED=true in Vercel and redeploy so tax is collected.' })
  }
  return out
}

async function sendAlert(failures: Check[]) {
  const to = process.env.ADMIN_EMAIL
  if (!to || !process.env.RESEND_API_KEY) return false
  const rows = failures.map((f) => `
    <tr><td style="padding:10px 0;border-bottom:1px solid #eee;vertical-align:top">
      <strong style="color:#b91c1c">${f.name}</strong><br/>
      <span style="color:#374151;font-size:13px">${f.detail}</span>
      ${f.fix ? `<br/><span style="color:#1d4ed8;font-size:13px">→ ${f.fix}</span>` : ''}
    </td></tr>`).join('')
  const html = `
    <div style="font-family:sans-serif;max-width:620px;margin:0 auto">
      <div style="background:#b91c1c;color:#fff;padding:16px 22px;border-radius:10px 10px 0 0">
        <strong>FranchiseOntario health check — ${failures.length} issue${failures.length === 1 ? '' : 's'} need attention</strong>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:18px 22px;border-radius:0 0 10px 10px">
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <p style="font-size:12px;color:#6b7280;margin-top:16px">Checked ${new Date().toISOString()} · ${BASE}</p>
      </div>
    </div>`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'FranchiseOntario Health <noreply@franchiseontario.com>',
      to: [to],
      subject: `⚠ FranchiseOntario: ${failures.length} issue${failures.length === 1 ? '' : 's'} need attention`,
      html,
    }),
  })
  return res.ok
}

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Checks run from the GitHub Action (scheduled jobs, Anthropic) are merged in from the request body
  const external = ((await req.json().catch(() => ({}))) as { checks?: Check[] }).checks ?? []

  const checks: Check[] = [
    ...(await checkPages()),
    ...(await checkApis()),
    ...(await checkDatabase()),
    ...(await checkStripe()),
    ...(await checkEmail()),
    ...checkContent(),
    ...checkConfig(),
    ...external,
  ]
  const failures = checks.filter((c) => !c.ok)
  const emailed = failures.length ? await sendAlert(failures) : false
  return NextResponse.json({ healthy: failures.length === 0, checked: checks.length, failures: failures.length, emailed, checks })
}

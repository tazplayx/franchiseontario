// Health checks that must run outside the website:
//  - the scheduled jobs (directory scraper, blog generator, keep-alive) are actually succeeding
//  - the Anthropic account can still make calls (credits, key validity)
// Results are sent to /api/cron/health, which merges them with the site checks and emails the owner on failure.

const BASE = process.env.SITE_URL ?? 'https://www.franchiseontario.com'
const REPO = process.env.GITHUB_REPOSITORY ?? 'tazplayx/franchiseontario'
const GH = process.env.GITHUB_TOKEN
const DAY = 86400000

const checks = []
const add = (name, ok, detail, fix) => checks.push({ name, ok, detail, ...(fix && !ok ? { fix } : {}) })

async function lastRun(file) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${file}/runs?per_page=1&status=completed`, {
    headers: { Authorization: `Bearer ${GH}`, Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) return { error: `GitHub API ${res.status}` }
  const run = (await res.json()).workflow_runs?.[0]
  return run ? { conclusion: run.conclusion, at: new Date(run.created_at), url: run.html_url } : { error: 'never run' }
}

async function checkWorkflow(label, file, maxAgeDays, fix) {
  const r = await lastRun(file)
  if (r.error) return add(label, false, r.error, fix)
  const ageDays = (Date.now() - r.at.getTime()) / DAY
  const ok = r.conclusion === 'success' && ageDays <= maxAgeDays
  add(label, ok, `last run ${r.conclusion} ${Math.floor(ageDays)} day(s) ago`, ok ? undefined : `${fix} (${r.url})`)
}

async function checkAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return add('Anthropic API key', false, 'ANTHROPIC_API_KEY is not set in GitHub secrets', 'Add the key in GitHub → Settings → Secrets → Actions.')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-5-5', max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] }),
  })
  const text = await res.text()
  if (res.ok) return add('Anthropic API (blog + descriptions)', true, 'account can make calls')
  if (/credit balance|billing|insufficient/i.test(text)) {
    return add('Anthropic API (blog + descriptions)', false, 'account is out of credits', 'Add credits at console.anthropic.com → Plans & Billing. Blog posts and AI listing descriptions stop without them.')
  }
  if (res.status === 401 || res.status === 403) {
    return add('Anthropic API (blog + descriptions)', false, `key rejected (HTTP ${res.status})`, 'Create a new key at console.anthropic.com and update the ANTHROPIC_API_KEY GitHub secret.')
  }
  return add('Anthropic API (blog + descriptions)', false, `HTTP ${res.status}: ${text.slice(0, 120)}`, 'Check the Anthropic status page and the model ID in scripts/generate-blog-post.mjs.')
}

if (!GH) add('GitHub access', false, 'GITHUB_TOKEN missing', 'The workflow must provide GITHUB_TOKEN with actions read permission.')
else {
  await checkWorkflow('Directory scraper (weekly)', 'scrape-franchises.yml', 9, 'The weekly directory scrape failed. Open the run log and fix the error.')
  await checkWorkflow('Blog generator (Mon/Wed/Fri)', 'generate-blog-post.yml', 4, 'The blog generator failed. Usually the Anthropic credit balance or key.')
  await checkWorkflow('Database keep-alive (daily)', 'supabase-keepalive.yml', 2, 'The keep-alive failed, so the database may be pausing. Check the site and Supabase.')
}
await checkAnthropic()

const secret = process.env.CRON_SECRET
if (!secret) {
  console.error('CRON_SECRET is not set; cannot report to the site.')
  process.exit(1)
}

const res = await fetch(`${BASE}/api/cron/health`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ checks }),
})
const report = await res.json().catch(() => ({}))
if (!res.ok) {
  console.error(`Health endpoint returned HTTP ${res.status}:`, report.error ?? '')
  process.exit(1)
}

console.log(`Checked ${report.checked} items — ${report.healthy ? 'ALL HEALTHY' : `${report.failures} need attention`}`)
for (const c of report.checks ?? []) console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name} — ${c.detail}`)
if (report.emailed) console.log('Alert email sent.')
if (!report.healthy) process.exit(1)

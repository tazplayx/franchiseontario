'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, TrendingUp, MousePointerClick, Eye, ArrowUpRight,
  CheckCircle, AlertCircle, ExternalLink, RefreshCw, Info,
  BarChart3, Globe, Zap,
} from 'lucide-react'

interface GscRow {
  keys: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface ApiResponse {
  configured: boolean
  data?: { rows?: GscRow[] }
  error?: string
}

function SetupGuide() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
          <Info size={16} className="text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Google Search Console Setup</h3>
          <p className="text-xs text-gray-500">Complete these steps to unlock real search data</p>
        </div>
      </div>
      <div className="space-y-4">
        {[
          {
            n: 1, title: 'Add GA4 Measurement ID',
            body: 'Set NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX in .env.local. GA4 tracks page views, bounce rate, and user engagement automatically.',
          },
          {
            n: 2, title: 'Verify site in Google Search Console',
            body: 'Go to search.google.com/search-console → Add property → URL prefix → https://www.franchiseontario.com. Copy the verification token and set NEXT_PUBLIC_GSC_VERIFICATION=<token> in .env.local.',
          },
          {
            n: 3, title: 'Create a Google Cloud service account',
            body: 'Google Cloud Console → New project → Enable "Google Search Console API" → IAM & Admin → Service Accounts → Create → Download JSON key.',
          },
          {
            n: 4, title: 'Grant GSC access to service account',
            body: 'Search Console → Settings → Users and permissions → Add user → paste the service_account email from the JSON key → set role to "Owner".',
          },
          {
            n: 5, title: 'Add credentials to .env.local',
            body: 'Set GOOGLE_SERVICE_ACCOUNT_KEY with the full JSON string (stringify the key file), and GOOGLE_GSC_SITE_URL=sc-domain:franchiseontario.com',
          },
          {
            n: 6, title: 'Link Search Console to GA4',
            body: 'In GA4 → Admin → Property settings → Search Console links → Link. This unlocks search query data directly inside GA4 reports.',
          },
        ].map((step) => (
          <div key={step.n} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {step.n}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {[
          { label: 'Search Console', href: 'https://search.google.com/search-console' },
          { label: 'Google Cloud Console', href: 'https://console.cloud.google.com' },
          { label: 'Google Analytics', href: 'https://analytics.google.com' },
        ].map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline">
            {l.label} <ExternalLink size={11} />
          </a>
        ))}
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, icon, color }: {
  label: string; value: string; sub: string; icon: React.ReactNode; color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-700 mt-0.5">{label}</p>
      <p className="text-[11px] text-gray-400">{sub}</p>
    </div>
  )
}

export default function AdminSeoPage() {
  const [queryRows, setQueryRows] = useState<GscRow[]>([])
  const [pageRows, setPageRows] = useState<GscRow[]>([])
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(28)
  const [tab, setTab] = useState<'queries' | 'pages'>('queries')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [qRes, pRes] = await Promise.all([
        fetch(`/api/gsc?type=queries&days=${days}`),
        fetch(`/api/gsc?type=pages&days=${days}`),
      ])
      const qJson = (await qRes.json()) as ApiResponse
      const pJson = (await pRes.json()) as ApiResponse
      setConfigured(qJson.configured)
      setQueryRows(qJson.data?.rows ?? [])
      setPageRows(pJson.data?.rows ?? [])
    } catch { /* network error */ }
    setLoading(false)
  }, [days])

  useEffect(() => { fetchData() }, [fetchData])

  const rows = tab === 'queries' ? queryRows : pageRows
  const totals = rows.reduce((acc, r) => ({ clicks: acc.clicks + r.clicks, impressions: acc.impressions + r.impressions }), { clicks: 0, impressions: 0 })
  const avgCtr = rows.length ? (rows.reduce((a, r) => a + r.ctr, 0) / rows.length * 100).toFixed(1) : '—'
  const avgPos = rows.length ? (rows.reduce((a, r) => a + r.position, 0) / rows.length).toFixed(1) : '—'

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/admin/dashboard" className="hover:text-red-600">Admin</Link>
            <span>/</span>
            <span className="text-gray-700">SEO Dashboard</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">SEO & Search Console</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor search performance and indexing health</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-red-400">
            <option value={7}>Last 7 days</option>
            <option value={28}>Last 28 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button onClick={fetchData} disabled={loading}
            className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors disabled:opacity-50">
            <RefreshCw size={15} className={loading ? 'animate-spin text-gray-400' : 'text-gray-600'} />
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div className={`rounded-2xl p-4 flex items-center gap-3 mb-6 ${configured ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
        {configured
          ? <CheckCircle size={16} className="text-green-600 shrink-0" />
          : <AlertCircle size={16} className="text-amber-600 shrink-0" />}
        <p className={`text-sm font-medium ${configured ? 'text-green-800' : 'text-amber-800'}`}>
          {configured
            ? 'Google Search Console connected — live search data below.'
            : 'GSC not configured. Complete setup below to unlock real search analytics.'}
        </p>
        {configured && (
          <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
            className="ml-auto text-xs font-semibold text-green-700 flex items-center gap-1 hover:underline shrink-0">
            Open GSC <ExternalLink size={11} />
          </a>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Robots.txt', href: '/robots.txt', icon: <Globe size={14} /> },
          { label: 'Sitemap', href: '/sitemap.xml', icon: <BarChart3 size={14} /> },
          { label: 'OG Image Preview', href: '/opengraph-image', icon: <Eye size={14} /> },
          { label: 'Submit Sitemap', href: 'https://search.google.com/search-console', icon: <Zap size={14} />, external: true },
        ].map((link) => (
          <a key={link.label} href={link.href} target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-2.5 hover:border-red-300 transition-colors group">
            <span className="text-gray-400 group-hover:text-red-500 transition-colors">{link.icon}</span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{link.label}</span>
            <ArrowUpRight size={12} className="ml-auto text-gray-300 group-hover:text-red-400" />
          </a>
        ))}
      </div>

      {/* Metrics (only when configured) */}
      {configured && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricCard label="Total Clicks" value={totals.clicks.toLocaleString()} sub={`Last ${days} days`} icon={<MousePointerClick size={18} />} color="text-blue-500" />
          <MetricCard label="Impressions" value={totals.impressions.toLocaleString()} sub={`Last ${days} days`} icon={<Eye size={18} />} color="text-indigo-500" />
          <MetricCard label="Avg CTR" value={`${avgCtr}%`} sub="Click-through rate" icon={<TrendingUp size={18} />} color="text-green-500" />
          <MetricCard label="Avg Position" value={avgPos} sub="Search ranking" icon={<Search size={18} />} color="text-amber-500" />
        </div>
      )}

      {/* Data table (only when configured and has data) */}
      {configured && rows.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 mb-6 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex gap-1">
              {(['queries', 'pages'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${tab === t ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {t === 'queries' ? 'Top Queries' : 'Top Pages'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">Last {days} days · Top {rows.length} results</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase">{tab === 'queries' ? 'Query' : 'Page'}</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Clicks</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Impr.</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase">CTR</th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-gray-400 uppercase">Position</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const key = row.keys[0]
                  return (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-5 font-medium text-gray-900 max-w-xs truncate">
                        {tab === 'pages' ? (
                          <a href={key} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            {key.replace('https://www.franchiseontario.com', '') || '/'} <ExternalLink size={10} />
                          </a>
                        ) : key}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">{row.clicks.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-gray-500">{row.impressions.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-semibold ${row.ctr * 100 >= 5 ? 'text-green-600' : row.ctr * 100 >= 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {(row.ctr * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <span className={`font-semibold ${row.position <= 5 ? 'text-green-600' : row.position <= 15 ? 'text-amber-600' : 'text-red-500'}`}>
                          #{row.position.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Setup guide */}
      {!configured && <SetupGuide />}

      {/* SEO health checklist */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" /> SEO Health Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: 'Sitemap.xml auto-generated', ok: true },
            { label: 'Robots.txt with AI crawler allowlist', ok: true },
            { label: 'Dynamic OG images (per page)', ok: true },
            { label: 'JSON-LD structured data (Organization, LocalBusiness)', ok: true },
            { label: 'generateMetadata() per franchise profile', ok: true },
            { label: 'Canonical URLs on all pages', ok: true },
            { label: 'Geo-targeting meta tags (CA-ON)', ok: true },
            { label: 'Security headers (X-Frame, nosniff, etc.)', ok: true },
            { label: 'AI indexing via llms.txt + robots.txt', ok: true },
            { label: 'GA4 tracking active', ok: false },
            { label: 'GSC site verification token set', ok: false },
            { label: 'GSC API connected (live data)', ok: configured === true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-sm">
              {item.ok
                ? <CheckCircle size={14} className="text-green-500 shrink-0" />
                : <AlertCircle size={14} className="text-amber-400 shrink-0" />}
              <span className={item.ok ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indexing actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-4">
        <h3 className="font-bold text-gray-900 mb-3">Indexing Actions</h3>
        <p className="text-sm text-gray-500 mb-3">After deploying changes, use these to trigger re-crawling immediately:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Request Indexing (GSC)', href: 'https://search.google.com/search-console' },
            { label: 'Bing Webmaster Tools', href: 'https://www.bing.com/webmasters' },
            { label: 'IndexNow (Bing + Yandex)', href: 'https://www.indexnow.org' },
            { label: 'Ping Sitemap to Google', href: 'https://www.google.com/ping?sitemap=https://www.franchiseontario.com/sitemap.xml' },
            { label: 'Rich Results Test', href: 'https://search.google.com/test/rich-results' },
            { label: 'PageSpeed Insights', href: 'https://pagespeed.web.dev/?url=https://www.franchiseontario.com' },
          ].map((action) => (
            <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-red-300 hover:text-red-600 transition-colors">
              {action.label} <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

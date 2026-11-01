'use client'
import { useEffect, useState } from 'react'
import { AD_SLOTS, AD_DURATIONS, getAdSlot, priceFor, formatCad, monthlyVisitors, type AdSlot } from '@/lib/ad-slots'

interface Campaign {
  id: string; slotId: string; weeks: number; title: string; body: string; imageUrl: string
  ctaUrl: string; ctaLabel: string; amountCents: number; status: string; startAt: string | null; endAt: string | null
  impressions: number; clicks: number
}

const EMPTY = { slotId: AD_SLOTS[0].id, weeks: 1, title: '', body: '', imageUrl: '', ctaUrl: '', ctaLabel: 'Learn more' }

function statusOf(c: Campaign): { label: string; cls: string } {
  if (c.status === 'pending_payment') return { label: 'Awaiting payment', cls: 'bg-amber-100 text-amber-700' }
  if (c.status === 'active' && c.endAt && new Date(c.endAt).getTime() > Date.now()) return { label: 'Live', cls: 'bg-green-100 text-green-700' }
  if (c.status === 'active') return { label: 'Finished', cls: 'bg-gray-100 text-gray-500' }
  return { label: c.status, cls: 'bg-gray-100 text-gray-500' }
}

/** Member dashboard: book billboard locations, pay through Stripe, and see how each ad performs. */
export default function AdvertisingTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/franchisor/ads', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? 'Could not load advertising.')
      else { setError(''); setCampaigns(data.campaigns) }
    } catch {
      setError('Network error. Please refresh the page.')
    }
    setLoading(false)
  }

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('ad_paid')) {
      setNotice('Payment received. Your advertisement is going live now.')
      setTimeout(load, 2500) // the webhook activates the booking a moment after payment
    }
    if (q.get('ad_cancelled')) setNotice('Payment cancelled. You have not been charged.')
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const slot: AdSlot = getAdSlot(form.slotId) ?? AD_SLOTS[0]
  const total = priceFor(slot, form.weeks)

  const book = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/franchisor/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not start payment. Please try again.')
        setSubmitting(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900">Advertising</h2>
        <p className="text-sm text-gray-400 mt-0.5">Put your franchise in front of {monthlyVisitors().toLocaleString('en-CA')}+ buyers every month.</p>
      </div>

      {notice && <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-xl px-4 py-3">{notice}</div>}
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

      {/* Book a location */}
      <form onSubmit={book} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5 mb-8">
        <div>
          <p className="text-sm font-bold text-gray-900 mb-2">1. Choose a location</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {AD_SLOTS.map((s) => (
              <button type="button" key={s.id} onClick={() => setForm({ ...form, slotId: s.id })}
                className={`text-left rounded-xl border p-4 transition-colors ${form.slotId === s.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <p className="font-semibold text-sm text-gray-900">{s.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{s.where}</p>
                <p className="text-xs text-gray-700 mt-2"><strong>{formatCad(s.weeklyCents)}</strong>/week · shared by up to {s.capacity}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-gray-900 mb-2">2. Choose a duration</p>
          <div className="flex flex-wrap gap-2">
            {AD_DURATIONS.map((d) => (
              <button type="button" key={d.weeks} onClick={() => setForm({ ...form, weeks: d.weeks })}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border ${form.weeks === d.weeks ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`}>
                {d.weeks} week{d.weeks > 1 ? 's' : ''}{d.discount > 0 ? ` (save ${Math.round(d.discount * 100)}%)` : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-900">3. Write your advertisement</p>
          <input required maxLength={80} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Headline (e.g. Now franchising across Ontario)" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          <textarea required maxLength={220} rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="One or two sentences about your franchise" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          <div className="grid sm:grid-cols-2 gap-3">
            <input required type="url" value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
              placeholder="Link to your website (https://…)" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
            <input maxLength={30} value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
              placeholder="Button text (e.g. Learn more)" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
          </div>
          <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="Image link (optional, https://…)" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">{slot.name}, {form.weeks} week{form.weeks > 1 ? 's' : ''}: <strong className="text-gray-900">{formatCad(total)} CAD</strong> (tax calculated at checkout)</p>
          <button type="submit" disabled={submitting} className="btn-red px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
            {submitting ? 'Opening payment…' : 'Pay with Stripe and go live'}
          </button>
        </div>
        <p className="text-[11px] text-gray-400">Your advertisement goes live as soon as payment is confirmed and runs for the full period. Creative must follow our advertising policy.</p>
      </form>

      {/* Campaigns */}
      <h3 className="text-sm font-bold text-gray-900 mb-3">Your advertisements</h3>
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-400">No advertisements yet. Book a location above.</div>
      ) : (
        <div className="space-y-3">
          {campaigns.filter((c) => c.status !== 'cancelled').map((c) => {
            const st = statusOf(c)
            const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(1) : '0.0'
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{getAdSlot(c.slotId)?.name ?? c.slotId} · {c.weeks} week{c.weeks > 1 ? 's' : ''} · {formatCad(c.amountCents)}</p>
                    {c.startAt && c.endAt && (
                      <p className="text-xs text-gray-400">{new Date(c.startAt).toLocaleDateString('en-CA')} – {new Date(c.endAt).toLocaleDateString('en-CA')}</p>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400 uppercase">Views</p><p className="font-black text-gray-900">{c.impressions.toLocaleString('en-CA')}</p></div>
                  <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400 uppercase">Clicks</p><p className="font-black text-gray-900">{c.clicks.toLocaleString('en-CA')}</p></div>
                  <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400 uppercase">Click rate</p><p className="font-black text-gray-900">{ctr}%</p></div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

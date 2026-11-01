'use client'
import { useEffect, useState } from 'react'
import { formatCad } from '@/lib/ad-slots'

interface AdminAds {
  revenueCents: number
  liveCount: number
  slots: { id: string; name: string; capacity: number; live: number }[]
  campaigns: { id: string; franchise_id: string; account_email: string; slot_id: string; weeks: number; amount_cents: number; status: string; start_at: string | null; end_at: string | null; paid_at: string | null }[]
}

/** Admin: advertising revenue, live placements and booking history. Access is enforced by the server. */
export default function AdminAdsPage() {
  const [data, setData] = useState<AdminAds | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/ads', { cache: 'no-store' })
      .then(async (r) => {
        const body = await r.json()
        if (!r.ok) setError(body.error ?? 'Could not load advertising.')
        else setData(body)
      })
      .catch(() => setError('Network error.'))
  }, [])

  if (error) return <div className="p-8 text-sm text-red-600">{error} <a href="/admin" className="underline">Sign in to admin</a></div>
  if (!data) return <div className="p-8 text-sm text-gray-400">Loading advertising…</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Advertising</h1>
      <p className="text-sm text-gray-400 mb-6">All advertising revenue is collected through Stripe.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5"><p className="text-xs text-gray-400 uppercase">Booked revenue</p><p className="text-2xl font-black text-gray-900">{formatCad(data.revenueCents)}</p></div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5"><p className="text-xs text-gray-400 uppercase">Live advertisements</p><p className="text-2xl font-black text-gray-900">{data.liveCount}</p></div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5"><p className="text-xs text-gray-400 uppercase">Bookings</p><p className="text-2xl font-black text-gray-900">{data.campaigns.length}</p></div>
      </div>

      <h2 className="text-sm font-bold text-gray-900 mb-3">Locations</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {data.slots.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between text-sm">
            <span className="font-semibold text-gray-900">{s.name}</span>
            <span className="text-gray-500">{s.live} / {s.capacity} in use</span>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-bold text-gray-900 mb-3">Bookings</h2>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-gray-400 uppercase"><tr><th className="p-3">Advertiser</th><th className="p-3">Location</th><th className="p-3">Weeks</th><th className="p-3">Amount</th><th className="p-3">Runs until</th></tr></thead>
          <tbody>
            {data.campaigns.map((c) => (
              <tr key={c.id} className="border-t border-gray-100">
                <td className="p-3">{c.account_email}</td>
                <td className="p-3">{data.slots.find((s) => s.id === c.slot_id)?.name ?? c.slot_id}</td>
                <td className="p-3">{c.weeks}</td>
                <td className="p-3">{formatCad(c.amount_cents)}</td>
                <td className="p-3">{c.end_at ? new Date(c.end_at).toLocaleDateString('en-CA') : '—'}</td>
              </tr>
            ))}
            {data.campaigns.length === 0 && <tr><td className="p-3 text-gray-400" colSpan={5}>No paid bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

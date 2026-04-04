'use client'
import { useState, useEffect } from 'react'
import { X, Loader2, CheckCircle, Users, TrendingUp } from 'lucide-react'
import { addLead, getLeadCount, getAccountByFranchiseId, type FranchiseLead } from '@/lib/leads'

interface Props {
  franchiseId: string
  franchiseName: string
}

const BUDGETS = [
  'Under $100K',
  '$100K – $250K',
  '$250K – $500K',
  '$500K – $1M',
  '$1M+',
  'Not sure yet',
]

// ── Lead count badge (hydrates from localStorage) ─────────────────────────────
export function LeadCountBadge({ franchiseId }: { franchiseId: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => { setCount(getLeadCount(franchiseId)) }, [franchiseId])
  if (count === 0) return null
  return (
    <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
      <TrendingUp size={11} />
      {count} {count === 1 ? 'inquiry' : 'inquiries'} submitted
    </div>
  )
}

// ── Contact Franchise button + modal ──────────────────────────────────────────
export default function ClientLeadSection({ franchiseId, franchiseName }: Props) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [count, setCount] = useState(0)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '', investmentBudget: '', message: '',
  })

  useEffect(() => { setCount(getLeadCount(franchiseId)) }, [franchiseId])

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const lead: FranchiseLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      franchiseId,
      franchiseName,
      submittedAt: new Date().toISOString(),
      ...form,
      read: false,
    }

    // Save locally
    addLead(lead)
    setCount((c) => c + 1)

    // Notify owner via email (fire-and-forget)
    const ownerAccount = getAccountByFranchiseId(franchiseId)
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead: { name: form.name, email: form.email, phone: form.phone, city: form.city, investmentBudget: form.investmentBudget, message: form.message },
        ownerEmail: ownerAccount?.email ?? 'cdeneire@proton.me',
        franchiseName,
      }),
    }).catch(() => {})

    setStatus('success')
  }

  return (
    <>
      {/* CTA button */}
      <button
        onClick={() => setOpen(true)}
        className="btn-red px-6 py-2.5 rounded-xl font-semibold text-sm text-center w-full"
      >
        Contact Franchise
      </button>

      {/* Lead count */}
      {count > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 justify-center">
          <Users size={11} />
          <span>{count} {count === 1 ? 'person has' : 'people have'} inquired</span>
        </div>
      )}

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Contact {franchiseName}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Your information goes directly to the franchise team</p>
              </div>
              <button onClick={() => { setOpen(false); setStatus('idle') }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="p-8 text-center">
                <CheckCircle className="mx-auto mb-3 text-green-500" size={36} />
                <h4 className="font-bold text-gray-900 mb-1">Request Sent!</h4>
                <p className="text-sm text-gray-500 mb-5">
                  The {franchiseName} team will be in touch with you shortly.
                </p>
                <button
                  onClick={() => { setOpen(false); setStatus('idle'); setForm({ name: '', email: '', phone: '', city: '', investmentBudget: '', message: '' }) }}
                  className="btn-red px-6 py-2 rounded-xl font-semibold text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text" required value={form.name} onChange={(e) => set('name', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                      type="email" required value={form.email} onChange={(e) => set('email', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                      placeholder="(416) 555-0100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                    <input
                      type="text" required value={form.city} onChange={(e) => set('city', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                      placeholder="Toronto, ON"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Investment Budget *</label>
                  <select
                    required value={form.investmentBudget} onChange={(e) => set('investmentBudget', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 bg-white"
                  >
                    <option value="">Select a range…</option>
                    {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={3} value={form.message} onChange={(e) => set('message', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none"
                    placeholder="Anything you'd like the franchise team to know…"
                  />
                </div>

                <button
                  type="submit" disabled={status === 'loading'}
                  className="w-full btn-red py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status === 'loading' ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : 'Send My Information'}
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  Your details are shared only with {franchiseName}. FranchiseOntario does not sell your data.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

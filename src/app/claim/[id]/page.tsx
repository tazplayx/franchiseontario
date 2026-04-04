'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, CheckCircle, AlertCircle, Shield, ExternalLink, Loader2, Eye, EyeOff } from 'lucide-react'
import { franchises } from '@/data/franchises'
import { saveClaim } from '@/lib/store'
import { registerAccount, getAccountByFranchiseId, setSession } from '@/lib/leads'

function domainFromEmail(email: string): string {
  return email.split('@')[1]?.toLowerCase() ?? ''
}
function domainFromUrl(url: string): string {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch { return '' }
}

export default function ClaimListingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const franchise = franchises.find((f) => f.id === id)

  const [form, setForm] = useState({ name: '', email: '', title: '', password: '', confirm: '', message: '' })
  const [showPw, setShowPw] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  if (!franchise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Listing not found. <Link href="/directory" className="text-red-600 hover:underline">Back to Directory</Link></p>
      </div>
    )
  }

  const existingAccount = getAccountByFranchiseId(franchise.id)
  if (existingAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-sm w-full text-center shadow-sm">
          <CheckCircle className="mx-auto mb-3 text-green-500" size={32} />
          <h2 className="font-bold text-gray-900 mb-2">This listing is already claimed</h2>
          <p className="text-gray-500 text-sm mb-5">
            {franchise.name} already has an owner account. Sign in to your dashboard to manage leads.
          </p>
          <Link href="/dashboard" className="btn-red px-6 py-2.5 rounded-xl font-semibold text-sm inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!franchise.sourced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="mx-auto mb-3 text-amber-500" size={32} />
          <p className="font-semibold text-gray-800 mb-2">This listing already has a registered owner.</p>
          <Link href={`/directory/${id}`} className="text-red-600 hover:underline text-sm">Back to listing</Link>
        </div>
      </div>
    )
  }

  const emailDomain = domainFromEmail(form.email)
  const siteDomain = domainFromUrl(franchise.website)
  const domainMatch = emailDomain.length > 0 && siteDomain.length > 0 && (
    emailDomain === siteDomain || emailDomain.endsWith('.' + siteDomain) || siteDomain.endsWith('.' + emailDomain)
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setErrorMsg('Passwords do not match.')
      setStatus('error')
      return
    }
    if (form.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    if (!franchise) return

    // Register the franchisor account (basic tier)
    const account = registerAccount({
      franchiseId: franchise.id,
      franchiseName: franchise.name,
      name: form.name,
      email: form.email,
      title: form.title,
      tier: 'basic',
      password: form.password,
    })

    // Save claim record
    saveClaim({
      id: `claim-${Date.now()}`,
      franchiseId: franchise.id,
      franchiseName: franchise.name,
      claimantName: form.name,
      claimantEmail: form.email,
      claimantTitle: form.title,
      message: form.message,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      domainMatch,
      sourceListingUrl: franchise.sourceListingUrl,
      sourceSite: franchise.sourceSite,
    })

    // Notify admin
    fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        franchiseId: franchise.id, franchiseName: franchise.name,
        claimantName: form.name, claimantEmail: form.email,
        claimantTitle: form.title, message: form.message,
        sourceListingUrl: franchise.sourceListingUrl, domainMatch,
      }),
    }).catch(() => {})

    // Start session and redirect to dashboard
    setSession({ franchiseId: account.franchiseId, franchiseName: account.franchiseName, email: account.email, name: account.name, tier: account.tier })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/directory" className="hover:text-red-600">Directory</Link>
          <ChevronRight size={14} />
          <Link href={`/directory/${id}`} className="hover:text-red-600">{franchise.name}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">Claim Listing</span>
        </div>

        {/* Listing card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0" style={{ background: franchise.logoBg, color: franchise.logoColor }}>
            {franchise.logoInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Sourced · {franchise.sourceSite}</span>
            </div>
            <p className="font-bold text-gray-900 text-sm">{franchise.name}</p>
            <a href={franchise.sourceListingUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-red-600 flex items-center gap-1">
              View original <ExternalLink size={9} />
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex gap-3">
          <Shield size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Claiming this listing</strong> creates a free Basic account that lets you manage leads, respond to inquiries, and upgrade your profile. Our team will verify ownership within 1–2 business days.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-base">Create Your Owner Account</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" placeholder="Jane Smith" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title / Role *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" placeholder="Franchise Owner" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Business Email *</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" placeholder="you@yourbrand.ca" />
            {form.email.includes('@') && (
              <div className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${domainMatch ? 'text-green-600' : 'text-amber-600'}`}>
                {domainMatch ? <><CheckCircle size={11} /> Domain match — faster verification</> : <><AlertCircle size={11} /> Domain mismatch — team will verify manually</>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:border-red-400" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password *</label>
              <input type={showPw ? 'text' : 'password'} required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" placeholder="Repeat password" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Ownership Proof (optional)</label>
            <textarea rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none"
              placeholder="Any additional context to help us verify faster — e.g. your role, corporate registration number, etc." />
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button type="submit" disabled={status === 'loading'}
            className="w-full btn-red py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {status === 'loading' ? <><Loader2 size={14} className="animate-spin" /> Creating account…</> : 'Claim Listing & Create Account'}
          </button>

          <p className="text-[11px] text-gray-400 text-center">
            Free Basic account. Upgrade to Premium or Enterprise anytime from your dashboard.
          </p>
        </form>
      </div>
    </div>
  )
}

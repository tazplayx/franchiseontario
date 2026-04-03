'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, CheckCircle, AlertCircle, Shield, ExternalLink, Loader2 } from 'lucide-react'
import { franchises } from '@/data/franchises'
import { saveClaim } from '@/lib/store'

function domainFromEmail(email: string): string {
  return email.split('@')[1]?.toLowerCase() ?? ''
}

function domainFromUrl(url: string): string {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export default function ClaimListingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const franchise = franchises.find((f) => f.id === id)

  const [form, setForm] = useState({
    name: '',
    email: '',
    title: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  if (!franchise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Listing not found.</p>
          <Link href="/directory" className="text-red-600 hover:underline text-sm">Back to Directory</Link>
        </div>
      </div>
    )
  }

  if (!franchise.sourced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto mb-3 text-amber-500" size={32} />
          <p className="font-semibold text-gray-800 mb-2">This listing already has a registered owner.</p>
          <p className="text-gray-500 text-sm mb-4">To make changes to a managed listing, please contact support.</p>
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
    setStatus('loading')
    setErrorMsg('')

    const claim = {
      id: `claim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      franchiseId: franchise!.id,
      franchiseName: franchise!.name,
      claimantName: form.name,
      claimantEmail: form.email,
      claimantTitle: form.title,
      message: form.message,
      submittedAt: new Date().toISOString(),
      status: 'pending' as const,
      domainMatch,
      sourceListingUrl: franchise!.sourceListingUrl,
      sourceSite: franchise!.sourceSite,
    }

    // Persist claim locally
    saveClaim(claim)

    // Notify admin via email
    try {
      await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          franchiseId: claim.franchiseId,
          franchiseName: claim.franchiseName,
          claimantName: form.name,
          claimantEmail: form.email,
          claimantTitle: form.title,
          message: form.message,
          sourceListingUrl: claim.sourceListingUrl,
          domainMatch,
        }),
      })
    } catch {
      // Email failure is non-blocking — claim is still saved locally
    }

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center shadow-sm">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={40} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Claim Request Submitted</h2>
          <p className="text-gray-500 text-sm mb-6">
            Our team will verify your ownership and reach out to <strong>{form.email}</strong> within 1–2 business days.
          </p>
          <Link href={`/directory/${id}`} className="btn-red px-6 py-2.5 rounded-xl font-semibold text-sm inline-block">
            Back to Listing
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/directory" className="hover:text-red-600">Directory</Link>
          <ChevronRight size={14} />
          <Link href={`/directory/${id}`} className="hover:text-red-600">{franchise.name}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">Claim Listing</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-7 mb-6">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
              style={{ background: franchise.logoBg, color: franchise.logoColor }}
            >
              {franchise.logoInitials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  Sourced · {franchise.sourceSite}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{franchise.name}</h1>
              <a
                href={franchise.sourceListingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1 mt-0.5"
              >
                View original listing <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <Shield size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Claiming this listing</p>
            <p className="text-amber-700 leading-relaxed">
              Claiming gives you the ability to manage and update this listing on FranchiseOntario.
              We verify ownership by checking that your email domain matches the franchise website.
              Our team will review your request within 1–2 business days.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-7 space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Ownership Verification</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title / Role *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
                placeholder="Franchise Owner / VP Marketing"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
              placeholder="you@yourbrand.ca"
            />
            {/* Domain match indicator */}
            {form.email.includes('@') && (
              <div className={`mt-2 flex items-center gap-2 text-xs font-medium ${domainMatch ? 'text-green-600' : 'text-amber-600'}`}>
                {domainMatch ? (
                  <>
                    <CheckCircle size={13} />
                    Domain match — <span className="font-mono">{emailDomain}</span> matches the listing website
                  </>
                ) : (
                  <>
                    <AlertCircle size={13} />
                    {siteDomain
                      ? `Domain mismatch — listing website is ${siteDomain}. Our team will verify manually.`
                      : 'Our team will verify ownership manually.'}
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Information</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 resize-none"
              placeholder="Optional — any additional context to help us verify your ownership faster."
            />
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm">{errorMsg}</p>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-red px-7 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <><Loader2 size={14} className="animate-spin" /> Submitting…</>
              ) : (
                'Submit Claim Request'
              )}
            </button>
            <Link href={`/directory/${id}`} className="text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </Link>
          </div>

          <p className="text-xs text-gray-400 pt-1">
            By submitting, you confirm you are an authorized representative of {franchise.name}.
            False claims may result in account suspension.
          </p>
        </form>
      </div>
    </div>
  )
}

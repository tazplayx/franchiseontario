'use client'
/**
 * /reset-password?token=<token>
 *
 * Validates the HMAC token (same format as email verification tokens),
 * then lets the user choose a new password.
 */
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { getAccountByEmail, resetAccountPassword, setSession } from '@/lib/leads'

type Status = 'loading' | 'ready' | 'saving' | 'done' | 'error' | 'expired'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<Status>('loading')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!token) { setStatus('error'); return }

    fetch(`/api/email/verify?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid && data.email) {
          setEmail(data.email)
          setStatus('ready')
        } else {
          setStatus('expired')
        }
      })
      .catch(() => setStatus('error'))
  }, [token])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setFormError('Passwords do not match.')
      return
    }

    setStatus('saving')
    const account = getAccountByEmail(email)
    if (!account) {
      setFormError('No account found for this email. Please register instead.')
      setStatus('ready')
      return
    }

    resetAccountPassword(account.id, password)

    // Log them in automatically
    setSession({
      franchiseId: account.franchiseId,
      franchiseName: account.franchiseName,
      email: account.email,
      name: account.name,
      tier: account.tier,
    })

    setStatus('done')
    setTimeout(() => router.replace('/dashboard'), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
      <div className="flex justify-center mb-6">
        <svg viewBox="0 0 40 40" fill="none" className="w-12 h-12">
          <rect width="40" height="40" rx="9" fill="#C8102E" />
          <path d="M10 9 H30 V14 H15 V19.5 H27 V24.5 H15 V31 H10 Z" fill="white" />
        </svg>
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-sm text-gray-400">Validating your reset link…</p>
        </div>
      )}

      {/* Form */}
      {(status === 'ready' || status === 'saving') && (
        <>
          <h1 className="text-xl font-black text-gray-900 text-center mb-1">Choose a New Password</h1>
          <p className="text-sm text-gray-400 text-center mb-6">
            For <strong className="text-gray-700">{email}</strong>
          </p>

          {formError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{formError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  className={`w-full border rounded-xl px-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 ${confirm && password !== confirm ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {confirm && password !== confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === 'saving'}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === 'saving' ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Set New Password'}
            </button>
          </form>
        </>
      )}

      {/* Success */}
      {status === 'done' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-green-600" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Password Updated!</h1>
          <p className="text-sm text-gray-500 mb-1">You're now logged in.</p>
          <p className="text-sm text-gray-400">Redirecting to your dashboard…</p>
        </div>
      )}

      {/* Expired / error */}
      {(status === 'expired' || status === 'error') && (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <XCircle size={28} className="text-red-600" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">
            {status === 'expired' ? 'Link Expired' : 'Invalid Link'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {status === 'expired'
              ? 'This reset link has expired (links are valid for 1 hour). Please request a new one.'
              : 'This reset link is invalid or has already been used. Please request a new one.'}
          </p>
          <Link
            href="/forgot-password"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Request New Link →
          </Link>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">FranchiseOntario.com — Ontario&apos;s #1 Franchise Directory</p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 w-full max-w-sm text-center">
          <Loader2 size={36} className="animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </div>
  )
}

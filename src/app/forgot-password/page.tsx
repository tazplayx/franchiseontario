'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          type: 'reset-password',
          data: { contactName: '' },
        }),
      })
      const json = await res.json()
      if (json.devMode && json.resetUrl) {
        setDevResetUrl(json.resetUrl)
      }
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 40 40" fill="none" className="w-12 h-12">
            <rect width="40" height="40" rx="9" fill="#ff000d" />
            <path d="M10 9 H30 V14 H15 V19.5 H27 V24.5 H15 V31 H10 Z" fill="white" />
          </svg>
        </div>

        {!sent ? (
          <>
            <h1 className="text-xl font-black text-gray-900 text-center mb-1">Forgot Password</h1>
            <p className="text-sm text-gray-400 text-center mb-6">
              Enter your registered email and we'll send you a reset link.
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourfranchise.ca"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h1 className="text-xl font-black text-gray-900 text-center mb-2">Check Your Inbox</h1>
            <p className="text-sm text-gray-500 text-center mb-2">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox and spam folder.
            </p>
            <p className="text-xs text-gray-400 text-center mb-6">The link expires in 1 hour.</p>

            {devResetUrl && (
              <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                <p className="text-xs font-bold text-amber-800 mb-1">Email delivery not configured</p>
                <a href={devResetUrl} className="text-xs text-red-600 underline break-all font-medium">
                  Reset my password →
                </a>
              </div>
            )}
          </>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

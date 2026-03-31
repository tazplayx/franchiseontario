'use client'
/**
 * /verify-email?token=<token>
 *
 * Validates the HMAC token via /api/email/verify, then sets a localStorage
 * flag so the registration flow can confirm the email was verified.
 */
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'

type Status = 'loading' | 'success' | 'error' | 'expired'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    fetch(`/api/email/verify?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid && data.email) {
          setEmail(data.email)
          // Persist verification in localStorage so the registration page can read it
          if (typeof window !== 'undefined') {
            localStorage.setItem(`fo_email_verified_${data.email}`, 'true')
          }
          setStatus('success')
        } else {
          setStatus('expired')
        }
      })
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 w-full max-w-md text-center">

      {/* Loading */}
      {status === 'loading' && (
        <>
          <Loader2 size={40} className="animate-spin text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-black text-gray-900 mb-2">Verifying your email…</h1>
          <p className="text-sm text-gray-400">This will only take a moment.</p>
        </>
      )}

      {/* Success */}
      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-sm text-gray-500 mb-1">
            Your email address <strong className="text-gray-700">{email}</strong> has been confirmed.
          </p>
          <p className="text-sm text-gray-500 mb-7">
            You can now return to registration and complete your listing.
          </p>
          <Link
            href="/register"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            Continue Registration →
          </Link>
        </>
      )}

      {/* Expired / invalid token */}
      {(status === 'expired' || status === 'error') && (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <XCircle size={32} className="text-red-600" />
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">
            {status === 'expired' ? 'Link Expired' : 'Invalid Link'}
          </h1>
          <p className="text-sm text-gray-500 mb-7">
            {status === 'expired'
              ? 'This verification link has expired (links are valid for 24 hours). Please return to registration to request a new one.'
              : 'This verification link is invalid or malformed. Please return to registration to request a new one.'}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            <Mail size={15} /> Back to Registration
          </Link>
        </>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          FranchiseOntario.com — Ontario&apos;s #1 Franchise Directory
        </p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 w-full max-w-md text-center">
          <Loader2 size={40} className="animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}

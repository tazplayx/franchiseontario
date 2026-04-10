'use client'
/**
 * /verify-email?token=<token>
 *
 * Validates the HMAC token, then:
 * - If a registration draft is in localStorage (fo_reg_draft), creates the
 *   franchisor account, sets the session, clears the draft, and redirects to
 *   the dashboard.
 * - Otherwise shows a "Continue Registration" fallback button.
 */
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { registerAccount, setSession, getAccountByEmail } from '@/lib/leads'

type Status = 'loading' | 'creating' | 'success' | 'error' | 'expired'

interface RegDraft {
  franchiseId: string
  franchiseName: string
  name: string
  email: string
  title: string
  tier: 'basic' | 'premium' | 'enterprise'
  password: string
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    if (!token) { setStatus('error'); return }

    fetch(`/api/email/verify?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.valid || !data.email) { setStatus('expired'); return }

        const verifiedEmail: string = data.email
        setEmail(verifiedEmail)

        // Mark email as verified in localStorage (polled by the register page)
        localStorage.setItem(`fo_email_verified_${verifiedEmail}`, 'true')

        // Check if a registration draft is saved — if so, finalize the account now
        const raw = localStorage.getItem('fo_reg_draft')
        if (raw) {
          try {
            const draft: RegDraft = JSON.parse(raw)
            // Only use the draft if it matches the verified email
            if (draft.email.toLowerCase() === verifiedEmail.toLowerCase()) {
              setStatus('creating')
              // Create account if it doesn't already exist
              let account = getAccountByEmail(verifiedEmail)
              if (!account) {
                account = registerAccount({
                  franchiseId: draft.franchiseId,
                  franchiseName: draft.franchiseName,
                  name: draft.name,
                  email: draft.email,
                  title: draft.title || 'Franchise Owner',
                  tier: draft.tier || 'basic',
                  password: draft.password,
                })
              }
              setSession({
                franchiseId: account.franchiseId,
                franchiseName: account.franchiseName,
                email: account.email,
                name: account.name,
                tier: account.tier,
              })
              localStorage.removeItem('fo_reg_draft')
              router.replace('/dashboard')
              return
            }
          } catch { /* bad draft — ignore */ }
        }

        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [token, router])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 w-full max-w-md text-center">

      {/* Loading / Creating account */}
      {(status === 'loading' || status === 'creating') && (
        <>
          <Loader2 size={40} className="animate-spin text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-black text-gray-900 mb-2">
            {status === 'creating' ? 'Setting up your account…' : 'Verifying your email…'}
          </h1>
          <p className="text-sm text-gray-400">This will only take a moment.</p>
        </>
      )}

      {/* Success (no draft found — falls back to continue registration) */}
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
            Return to the registration tab to complete your listing — the page should have advanced automatically.
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

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle, Zap } from 'lucide-react'
import { getAccountByEmail, verifyPassword, setSession, registerAccount } from '@/lib/leads'

const DEMO_EMAIL = 'demo@franchiseontario.com'
const DEMO_PASSWORD = 'Demo1234!'

function seedDemoAccount() {
  if (typeof window === 'undefined') return
  // Only seed if not already present
  const existing = getAccountByEmail(DEMO_EMAIL)
  if (!existing) {
    registerAccount({
      franchiseId: 'demo-franchise',
      franchiseName: 'Demo Franchise Co.',
      name: 'Demo User',
      email: DEMO_EMAIL,
      title: 'Franchise Owner',
      tier: 'premium',
      password: DEMO_PASSWORD,
    })
  }
}

export default function DashboardLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const account = getAccountByEmail(form.email)
    if (!account || !verifyPassword(account, form.password)) {
      setErrorMsg('Invalid email or password.')
      setStatus('error')
      return
    }

    setSession({
      franchiseId: account.franchiseId,
      franchiseName: account.franchiseName,
      email: account.email,
      name: account.name,
      tier: account.tier,
    })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black text-red-600 tracking-tight">Franchise<span className="text-gray-900">Ontario</span></span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to your owner dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400"
              placeholder="you@yourbrand.ca"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:border-red-400"
                placeholder="Your password"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <AlertCircle size={13} /> {errorMsg}
            </div>
          )}

          <button type="submit" disabled={status === 'loading'}
            className="w-full btn-red py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {status === 'loading' ? <><Loader2 size={14} className="animate-spin" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-1.5"><Zap size={12} /> Try the Demo Portal</p>
          <p className="text-xs text-blue-600 mb-3">See exactly what a franchisor owner sees — pre-loaded with sample leads and a Premium listing.</p>
          <button
            type="button"
            onClick={() => {
              seedDemoAccount()
              const account = getAccountByEmail(DEMO_EMAIL)
              if (account && verifyPassword(account, DEMO_PASSWORD)) {
                setSession({
                  franchiseId: account.franchiseId,
                  franchiseName: account.franchiseName,
                  email: account.email,
                  name: account.name,
                  tier: account.tier,
                })
                router.push('/dashboard')
              }
            }}
            className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Launch Demo → (demo@franchiseontario.com)
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/directory" className="text-red-600 hover:underline">Find your listing</Link>
          {' '}and claim it.
        </p>
      </div>
    </div>
  )
}

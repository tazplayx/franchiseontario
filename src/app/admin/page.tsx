'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'

// Admin credentials — change ADMIN_PASSWORD to your preferred password
const ADMIN_EMAIL = 'cdeneire@proton.me'
const ADMIN_PASSWORD = 'FranchiseON2026!'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('fo_admin', 'authenticated')
        router.push('/admin/dashboard')
      } else {
        setError('Invalid email or password.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white">FranchiseOntario</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="bg-gray-800 rounded-2xl border border-gray-700 p-7 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-700 rounded-xl px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-red w-full py-3 rounded-xl font-bold text-sm disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In to Admin'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          FranchiseOntario.com — Admin Access Only
        </p>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, FileText, CreditCard, LifeBuoy, LogOut,
  Pencil, Trash2, X, Save, AlertTriangle, CheckCircle,
  ExternalLink, Star, Crown, TrendingUp, Eye, Loader2,
} from 'lucide-react'

// Simulated logged-in franchisee data
const MOCK_USER = {
  name: 'James Trent',
  email: 'james.t@sunsetpoutine.ca',
  franchise: {
    id: 'sunset-poutine',
    name: 'Sunset Poutine Co.',
    tagline: 'Authentic Quebec Poutine, Served Ontario Proud',
    description: 'A Quebec-inspired poutine franchise bringing authentic curds and gravy to Ontario markets. 3 existing locations in Quebec, expanding across Ontario.',
    category: 'Fast Food',
    tier: 'premium' as const,
    isVIP: false,
    isFeatured: false,
    city: 'Mississauga, ON',
    phone: '905-555-0192',
    website: 'https://sunsetpoutine.ca',
    established: 2021,
    locations: 3,
    status: 'active' as const,
    stripeCustomerId: 'cus_mock123', // would come from DB in production
    nextBillingDate: '2026-04-25',
    plan: 'Premium',
    planAmount: '$79.00 CAD/month',
  },
}

type EditForm = {
  name: string
  tagline: string
  description: string
  city: string
  phone: string
  website: string
}

type ActiveTab = 'listing' | 'billing' | 'support'

function DashNav({ active, onTab, onLogout }: { active: ActiveTab; onTab: (t: ActiveTab) => void; onLogout: () => void }) {
  const nav: { label: string; tab: ActiveTab; icon: React.ReactNode }[] = [
    { label: 'My Listing', tab: 'listing', icon: <LayoutDashboard size={16} /> },
    { label: 'Billing', tab: 'billing', icon: <CreditCard size={16} /> },
    { label: 'Support', tab: 'support', icon: <LifeBuoy size={16} /> },
  ]
  return (
    <aside className="bg-[#0D1B2A] text-white w-56 shrink-0 min-h-screen flex-col hidden md:flex">
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 shrink-0">
            <rect width="40" height="40" rx="9" fill="#C8102E" />
            <path d="M10 9 H30 V14 H15 V19.5 H27 V24.5 H15 V31 H10 Z" fill="white" />
          </svg>
          <div>
            <div className="text-sm font-bold leading-tight">FranchiseOntario</div>
            <div className="text-[10px] text-white/40 mt-0.5">Franchisor Portal</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => (
          <button
            key={item.tab}
            onClick={() => onTab(item.tab)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${active === item.tab ? 'bg-red-600 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'}`}
          >
            {item.icon}{item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/30 mb-2 px-3 truncate">{MOCK_USER.email}</div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={15} />Sign Out
        </button>
      </div>
    </aside>
  )
}

// ── Login screen ───────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo: any credentials work — in production this would hit your auth API
    if (!email || !password) { setError('Please enter your email and password.'); return }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fo_user', 'authenticated')
    }
    onLogin()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 40 40" fill="none" className="w-12 h-12">
            <rect width="40" height="40" rx="9" fill="#C8102E" />
            <path d="M10 9 H30 V14 H15 V19.5 H27 V24.5 H15 V31 H10 Z" fill="white" />
          </svg>
        </div>
        <h1 className="text-xl font-black text-gray-900 text-center mb-1">Franchisor Login</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Manage your FranchiseOntario listing</p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourfranchise.ca"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Don&apos;t have a listing yet?</p>
          <Link href="/register" className="text-sm font-semibold text-red-600 hover:underline">Register your franchise →</Link>
        </div>
      </div>
    </div>
  )
}

// ── My Listing tab ─────────────────────────────────────────────────────────────
function ListingTab() {
  const { franchise } = MOCK_USER
  const [isEditing, setIsEditing] = useState(false)
  const [removeConfirm, setRemoveConfirm] = useState(false)
  const [removed, setRemoved] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<EditForm>({
    name: franchise.name,
    tagline: franchise.tagline,
    description: franchise.description,
    city: franchise.city,
    phone: franchise.phone,
    website: franchise.website,
  })
  const [current, setCurrent] = useState({ ...franchise })

  const handleSave = () => {
    setCurrent({ ...current, ...form })
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleRemove = () => {
    setRemoveConfirm(false)
    setRemoved(true)
  }

  if (removed) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-600" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Listing Removed</h2>
        <p className="text-sm text-gray-500 mb-6">Your franchise listing has been removed from FranchiseOntario. Your subscription will not renew.</p>
        <Link href="/register" className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-red-700 transition-colors">
          Re-list your franchise
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">My Listing</h2>
          <p className="text-sm text-gray-400 mt-0.5">What visitors see on your public listing page</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
              <CheckCircle size={14} /> Saved
            </span>
          )}
          <a
            href={`/directory/${franchise.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-colors"
          >
            <Eye size={14} /> Preview
          </a>
        </div>
      </div>

      {/* Status banner */}
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6">
        <CheckCircle size={18} className="text-green-600 shrink-0" />
        <div>
          <div className="text-sm font-bold text-green-800">Listing Active</div>
          <div className="text-xs text-green-600">Your franchise is live and visible to all visitors on FranchiseOntario.</div>
        </div>
        <div className="ml-auto">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{current.plan}</span>
        </div>
      </div>

      {/* Listing card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-black text-sm shrink-0">SP</div>
            <div className="flex-1">
              <h3 className="font-black text-gray-900 text-lg leading-tight">{current.name}</h3>
              <p className="text-sm text-gray-500 italic mt-0.5">{current.tagline}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{current.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-400 text-xs">Category</span><div className="font-medium text-gray-700">{current.category}</div></div>
            <div><span className="text-gray-400 text-xs">Location</span><div className="font-medium text-gray-700">{current.city}</div></div>
            <div><span className="text-gray-400 text-xs">Phone</span><div className="font-medium text-gray-700">{current.phone}</div></div>
            <div><span className="text-gray-400 text-xs">Website</span><div className="font-medium text-gray-700 truncate">{current.website}</div></div>
          </div>
        </div>
        <div className="flex border-t border-gray-100 divide-x divide-gray-100">
          <button
            onClick={() => { setIsEditing(true); setForm({ name: current.name, tagline: current.tagline, description: current.description, city: current.city, phone: current.phone, website: current.website }) }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Pencil size={14} /> Edit Listing
          </button>
          <button
            onClick={() => setRemoveConfirm(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} /> Remove Listing
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Profile Views', value: '1,284', sub: 'Last 30 days', icon: <Eye size={16} />, color: 'text-blue-500' },
          { label: 'Enquiry Clicks', value: '47', sub: 'Last 30 days', icon: <TrendingUp size={16} />, color: 'text-green-500' },
          { label: 'Directory Rank', value: '#12', sub: 'In Fast Food', icon: <Star size={16} />, color: 'text-amber-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className={`${stat.color} mb-2`}>{stat.icon}</div>
            <div className="text-xl font-black text-gray-900">{stat.value}</div>
            <div className="text-xs font-semibold text-gray-600">{stat.label}</div>
            <div className="text-[10px] text-gray-400">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setIsEditing(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900">Edit Your Listing</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tagline</label>
                <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">City / Region</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Website</label>
                <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                To change your listing tier (upgrade/downgrade), use the <strong>Billing</strong> tab to manage your subscription.
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setIsEditing(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove confirmation modal */}
      {removeConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setRemoveConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-2xl mx-auto mb-4">
              <AlertTriangle size={22} className="text-red-600" />
            </div>
            <h3 className="font-black text-gray-900 text-center text-lg mb-1">Remove Your Listing?</h3>
            <p className="text-sm text-gray-500 text-center mb-2">
              Your listing will be taken offline immediately. If you have an active paid plan, please cancel your subscription first via the Billing tab to avoid future charges.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setRemoveConfirm(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleRemove} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Billing tab ────────────────────────────────────────────────────────────────
function BillingTab() {
  const { franchise } = MOCK_USER
  const [loading, setLoading] = useState(false)

  const openPortal = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: franchise.stripeCustomerId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900">Billing & Subscription</h2>
        <p className="text-sm text-gray-400 mt-0.5">Manage your plan, payment method, and invoices</p>
      </div>

      {/* Current plan */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm">Current Plan</h3>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{franchise.plan}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div><span className="text-gray-400 text-xs">Amount</span><div className="font-semibold text-gray-900">{franchise.planAmount}</div></div>
          <div><span className="text-gray-400 text-xs">Next billing date</span><div className="font-semibold text-gray-900">{franchise.nextBillingDate}</div></div>
          <div><span className="text-gray-400 text-xs">Status</span><div className="font-semibold text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Active</div></div>
          <div><span className="text-gray-400 text-xs">Payment</span><div className="font-semibold text-gray-900">Visa •••• 4242</div></div>
        </div>
        <button
          onClick={openPortal}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#0D1B2A] hover:bg-[#1a2d45] text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={16} />}
          {loading ? 'Opening portal…' : 'Manage Subscription & Invoices'}
        </button>
      </div>

      {/* Plan comparison */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 text-sm mb-4">Compare Plans</h3>
        <div className="space-y-3">
          {[
            { name: 'Basic', price: 'Free', desc: 'Standard directory listing, no analytics', icon: <FileText size={14} /> },
            { name: 'Premium', price: '$79/mo', desc: 'Priority placement, photo gallery, analytics dashboard', icon: <Star size={14} className="text-blue-500" />, current: true },
            { name: 'Enterprise', price: '$199/mo', desc: 'VIP badge, top placement, dedicated account manager', icon: <Crown size={14} className="text-amber-500" /> },
          ].map((plan) => (
            <div key={plan.name} className={`flex items-center gap-4 p-4 rounded-xl border ${plan.current ? 'border-blue-200 bg-blue-50' : 'border-gray-100'}`}>
              <div className="shrink-0">{plan.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">{plan.name}</span>
                  {plan.current && <span className="bg-blue-200 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded">CURRENT</span>}
                </div>
                <p className="text-xs text-gray-500">{plan.desc}</p>
              </div>
              <div className="text-sm font-bold text-gray-900 shrink-0">{plan.price}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">To upgrade or downgrade, click "Manage Subscription" above. All plan changes take effect immediately.</p>
      </div>
    </div>
  )
}

// ── Support tab ────────────────────────────────────────────────────────────────
function SupportTab() {
  const [form, setForm] = useState({ category: 'Listing Issue', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject || !form.message) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={26} className="text-green-600" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Ticket Submitted</h2>
        <p className="text-sm text-gray-500 mb-6">We've received your request. Our team typically responds within 1–2 business days.</p>
        <button onClick={() => { setSubmitted(false); setForm({ category: 'Listing Issue', subject: '', message: '' }) }} className="text-sm font-semibold text-red-600 hover:underline">
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900">Support</h2>
        <p className="text-sm text-gray-400 mt-0.5">Need help? Submit a ticket and our team will respond within 1–2 business days.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white"
              >
                <option>Listing Issue</option>
                <option>Billing & Payments</option>
                <option>Account Access</option>
                <option>Upgrade / Downgrade</option>
                <option>General Enquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Message</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Please describe your issue in detail…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              Submit Ticket
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Quick Help</h3>
            <div className="space-y-2.5">
              {[
                { q: 'How do I upgrade my plan?', href: '/pricing' },
                { q: 'How do I update my listing photos?', href: '/support' },
                { q: 'What is the Arthur Wishart Act?', href: '/faq' },
                { q: 'How are rankings calculated?', href: '/faq' },
              ].map((item) => (
                <Link key={item.q} href={item.href} className="flex items-center gap-2 text-xs text-gray-600 hover:text-red-600 transition-colors">
                  <span className="w-1 h-1 bg-red-400 rounded-full shrink-0" />
                  {item.q}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-[#0D1B2A] rounded-2xl p-5 text-white">
            <div className="text-sm font-bold mb-1">Enterprise clients</div>
            <p className="text-xs text-white/60 mb-3">Enterprise plan subscribers have access to a dedicated account manager.</p>
            <Link href="/pricing" className="text-xs font-semibold text-red-400 hover:text-red-300">Upgrade to Enterprise →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('listing')

  // Restore session on page load / refresh
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('fo_user') === 'authenticated') {
      setLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem('fo_user')
    setLoggedIn(false)
  }

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashNav active={activeTab} onTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 p-6 md:p-8 max-w-4xl">
        <div className="mb-6">
          <p className="text-sm text-gray-400">Welcome back,</p>
          <h1 className="text-2xl font-black text-gray-900">{MOCK_USER.name}</h1>
        </div>
        {activeTab === 'listing' && <ListingTab />}
        {activeTab === 'billing' && <BillingTab />}
        {activeTab === 'support' && <SupportTab />}
      </main>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, FileText, CreditCard, LifeBuoy, LogOut,
  Pencil, Trash2, X, Save, AlertTriangle, CheckCircle,
  ExternalLink, Star, Crown, TrendingUp, Eye, Loader2,
  Users, Mail, Phone, MapPin, DollarSign, MessageSquare,
  Clock, Lock, Zap,
} from 'lucide-react'
import {
  getUserFranchiseOverrides,
  saveUserFranchise,
  removeUserFranchise,
  removeListing,
  isUserFranchiseRemoved,
  addUserTicket,
} from '@/lib/store'
import { sendEmail } from '@/lib/email'
import {
  getSession, clearSession, setSession, getLeads, markLeadRead,
  getAccountByEmail, verifyPassword,
  FREE_LEAD_LIMIT, type FranchisorSession, type FranchiseLead,
} from '@/lib/leads'

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
  longDescription: string
  city: string
  phone: string
  email: string
  website: string
  locations: string
  established: string
  territory: string
  videoUrl: string
  highlights: string
  idealCandidate: string
  supportOffered: string
  franchiseFee: string
  royaltyRate: string
  investmentMin: string
  investmentMax: string
}

type ActiveTab = 'leads' | 'listing' | 'billing' | 'support'

function DashNav({ active, onTab, onLogout, email, unread }: { active: ActiveTab; onTab: (t: ActiveTab) => void; onLogout: () => void; email: string; unread?: number }) {
  const nav: { label: string; tab: ActiveTab; icon: React.ReactNode; badge?: number }[] = [
    { label: 'Leads', tab: 'leads', icon: <Users size={16} />, badge: unread },
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
            {item.badge != null && item.badge > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/30 mb-2 px-3 truncate">{email}</div>
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
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    setError('')

    // Real credential check against localStorage accounts
    const account = getAccountByEmail(email)
    if (!account || !verifyPassword(account, password)) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }

    // Set the session and log in
    setSession({
      franchiseId: account.franchiseId,
      franchiseName: account.franchiseName,
      email: account.email,
      name: account.name,
      tier: account.tier,
    })
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-500">Password</label>
              <Link href="/forgot-password" className="text-xs text-red-600 hover:underline">Forgot password?</Link>
            </div>
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
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center space-y-2">
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

  // Merge stored overrides on top of the seed franchise
  const storedOverrides = getUserFranchiseOverrides()
  const merged = { ...franchise, ...storedOverrides } as typeof franchise

  const [current, setCurrent] = useState(merged)
  const [form, setForm] = useState<EditForm>({
    name: merged.name,
    tagline: merged.tagline ?? '',
    description: merged.description,
    longDescription: '',
    city: merged.city,
    phone: merged.phone,
    email: MOCK_USER.email,
    website: merged.website,
    locations: String(merged.locations),
    established: String(merged.established),
    territory: '',
    videoUrl: '',
    highlights: '',
    idealCandidate: '',
    supportOffered: '',
    franchiseFee: '',
    royaltyRate: '',
    investmentMin: '',
    investmentMax: '',
  })

  // Check removal flag on first render
  useEffect(() => {
    if (isUserFranchiseRemoved()) setRemoved(true)
  }, [])

  const handleSave = () => {
    const extras: Record<string, unknown> = {}
    if (form.highlights) extras.highlights = form.highlights.split('\n').filter(Boolean)
    if (form.idealCandidate) extras.idealCandidate = form.idealCandidate.split('\n').filter(Boolean)
    if (form.supportOffered) extras.supportOffered = form.supportOffered.split('\n').filter(Boolean)
    if (form.locations) extras.locations = Number(form.locations)
    if (form.established) extras.established = Number(form.established)
    if (form.investmentMin || form.investmentMax || form.franchiseFee || form.royaltyRate) {
      const baseFin = (current as unknown as Record<string, unknown>).financials as Record<string, unknown> ?? {}
      extras.financials = {
        ...baseFin,
        ...(form.franchiseFee ? { franchiseFee: form.franchiseFee } : {}),
        ...(form.royaltyRate ? { royaltyRate: form.royaltyRate } : {}),
        ...(form.investmentMin ? { investmentMin: Number(form.investmentMin) } : {}),
        ...(form.investmentMax ? { investmentMax: Number(form.investmentMax) } : {}),
      }
    }
    const saveData = {
      name: form.name, tagline: form.tagline, description: form.description,
      longDescription: form.longDescription || undefined,
      city: form.city, phone: form.phone, email: form.email, website: form.website,
      territory: form.territory || undefined, videoUrl: form.videoUrl || undefined,
      ...extras,
    }
    const updated = { ...current, ...saveData }
    saveUserFranchise(saveData as Record<string, unknown>)
    setCurrent(updated)
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    sendEmail(MOCK_USER.email, 'listing-edited-user', {
      franchiseName: form.name || franchise.name,
      contactName: MOCK_USER.name,
    })
  }

  const handleRemove = () => {
    // Remove from user dashboard flag
    removeUserFranchise()
    // Also add to global removed set so directory + homepage stop showing it
    removeListing(franchise.id)
    // Notify user of confirmed removal
    sendEmail(MOCK_USER.email, 'listing-removed-user', {
      franchiseName: franchise.name,
      contactName: MOCK_USER.name,
    })
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
            onClick={() => { setIsEditing(true); setForm({ name: current.name, tagline: current.tagline ?? '', description: current.description, longDescription: '', city: current.city, phone: current.phone, email: MOCK_USER.email, website: current.website, locations: String(current.locations), established: String(current.established), territory: '', videoUrl: '', highlights: '', idealCandidate: '', supportOffered: '', franchiseFee: '', royaltyRate: '', investmentMin: '', investmentMax: '' }) }}
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
            <div className="p-6 space-y-5">
              {/* Basic Info */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Basic Info</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Tagline</label>
                    <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Short Description</label>
                    <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Full Description <span className="font-normal text-gray-400">(shown on your listing page)</span></label>
                    <textarea rows={5} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} placeholder="Full brand story and details. Use double line breaks for paragraphs." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Contact & Location</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">City / Region</label>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Contact Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Website</label>
                    <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Ontario Locations</label>
                    <input type="number" value={form.locations} onChange={(e) => setForm({ ...form, locations: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Year Established</label>
                    <input type="number" value={form.established} onChange={(e) => setForm({ ...form, established: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Territory Description</label>
                    <input value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })} placeholder="e.g. Protected radius, exclusive region" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Video URL (YouTube or Vimeo)</label>
                    <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Financials</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise Fee</label>
                    <input value={form.franchiseFee} onChange={(e) => setForm({ ...form, franchiseFee: e.target.value })} placeholder="e.g. $40,000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Royalty Rate</label>
                    <input value={form.royaltyRate} onChange={(e) => setForm({ ...form, royaltyRate: e.target.value })} placeholder="e.g. 5% of gross sales" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Investment Min ($)</label>
                    <input type="number" value={form.investmentMin} onChange={(e) => setForm({ ...form, investmentMin: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Investment Max ($)</label>
                    <input type="number" value={form.investmentMax} onChange={(e) => setForm({ ...form, investmentMax: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Franchise Highlights</p>
                <p className="text-xs text-gray-400 mb-2">One item per line — shown as bullet points on your listing</p>
                <textarea rows={4} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} placeholder="Proven operating system&#10;Award-winning brand&#10;Exclusive territory protection" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
              </div>

              {/* Ideal Candidate */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ideal Franchisee Profile</p>
                <p className="text-xs text-gray-400 mb-2">One trait per line</p>
                <textarea rows={3} value={form.idealCandidate} onChange={(e) => setForm({ ...form, idealCandidate: e.target.value })} placeholder="Passionate about hospitality&#10;Strong community ties&#10;Minimum $150K liquid capital" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
              </div>

              {/* Support */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Training & Support</p>
                <p className="text-xs text-gray-400 mb-2">One item per line</p>
                <textarea rows={3} value={form.supportOffered} onChange={(e) => setForm({ ...form, supportOffered: e.target.value })} placeholder="8-week training program&#10;Grand opening support&#10;Ongoing field visits" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
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

// ── Leads tab ─────────────────────────────────────────────────────────────────
function LeadsTab({ session }: { session: FranchisorSession | null }) {
  const franchiseId = session?.franchiseId ?? ''
  const tier = session?.tier ?? 'basic'
  const [leads, setLeads] = useState<FranchiseLead[]>([])
  const [selectedLead, setSelectedLead] = useState<FranchiseLead | null>(null)

  useEffect(() => {
    if (franchiseId) setLeads(getLeads(franchiseId))
  }, [franchiseId])

  function handleView(lead: FranchiseLead) {
    setSelectedLead(lead)
    if (!lead.read && franchiseId) {
      markLeadRead(franchiseId, lead.id)
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, read: true } : l))
    }
  }

  const isBasic = tier === 'basic'
  const visibleLeads = isBasic ? leads.slice(0, FREE_LEAD_LIMIT) : leads
  const lockedLeads = isBasic ? leads.slice(FREE_LEAD_LIMIT) : []
  const locked = lockedLeads.length

  return (
    <div>
      {/* Lead detail modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600 uppercase">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedLead.name}</p>
                  <p className="text-xs text-gray-400">{new Date(selectedLead.submittedAt).toLocaleString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} className="text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"><Mail size={11} /> {selectedLead.email}</a>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Phone</p>
                  {selectedLead.phone
                    ? <a href={`tel:${selectedLead.phone}`} className="text-sm text-gray-800 font-medium hover:text-red-600 flex items-center gap-1"><Phone size={11} /> {selectedLead.phone}</a>
                    : <span className="text-sm text-gray-400">Not provided</span>}
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">City</p>
                  <p className="text-sm text-gray-800 font-medium flex items-center gap-1"><MapPin size={11} /> {selectedLead.city}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Budget</p>
                  <p className="text-sm text-gray-800 font-medium flex items-center gap-1"><DollarSign size={11} /> {selectedLead.investmentBudget}</p>
                </div>
              </div>
              {selectedLead.message && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Message</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedLead.message}</p>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <a href={`mailto:${selectedLead.email}?subject=Your Inquiry About ${encodeURIComponent(selectedLead.franchiseName)}&body=Hi ${encodeURIComponent(selectedLead.name)},%0A%0AThank you for your interest in ${encodeURIComponent(selectedLead.franchiseName)}.`}
                  className="flex-1 btn-red py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <Mail size={13} /> Send Email
                </a>
                {selectedLead.phone && (
                  <a href={`tel:${selectedLead.phone}`}
                    className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                    <Phone size={13} /> Call Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Leads</h2>
          <p className="text-sm text-gray-400 mt-0.5">{leads.length} total leads for {session?.franchiseName ?? 'your listing'}</p>
        </div>
        {isBasic && locked > 0 && (
          <button className="btn-red px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
            <Zap size={13} /> Upgrade to Unlock {locked} More
          </button>
        )}
      </div>

      {/* Upgrade banner */}
      {isBasic && locked > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Lock size={18} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{locked} lead{locked !== 1 ? 's' : ''} locked — upgrade to view</p>
            <p className="text-xs text-gray-500 mt-0.5">Basic accounts see the first {FREE_LEAD_LIMIT} leads. Upgrade to Premium or Enterprise for unlimited access.</p>
          </div>
        </div>
      )}

      {leads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
          <Users size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="font-semibold text-gray-700 mb-1">No leads yet</p>
          <p className="text-sm text-gray-400">When prospects contact your franchise, they&apos;ll appear here.</p>
          {session && (
            <Link href={`/directory/${session.franchiseId}`} className="mt-4 inline-block text-sm text-red-600 font-semibold hover:underline">
              View your listing →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visibleLeads.map((lead) => {
            const timeAgo = (() => {
              const diff = Date.now() - new Date(lead.submittedAt).getTime()
              const mins = Math.floor(diff / 60000)
              if (mins < 60) return `${mins}m ago`
              const hrs = Math.floor(mins / 60)
              if (hrs < 24) return `${hrs}h ago`
              return `${Math.floor(hrs / 24)}d ago`
            })()
            return (
              <div key={lead.id} className={`bg-white rounded-2xl border ${lead.read ? 'border-gray-200' : 'border-red-200'} p-5 shadow-sm flex items-center gap-4`}>
                {!lead.read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600 text-sm shrink-0 uppercase">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1"><MapPin size={9} /> {lead.city}</span>
                    <span className="flex items-center gap-1"><DollarSign size={9} /> {lead.investmentBudget}</span>
                    {lead.message && <span className="flex items-center gap-1"><MessageSquare size={9} /> Has message</span>}
                    <span className="flex items-center gap-1"><Clock size={9} /> {timeAgo}</span>
                  </div>
                </div>
                <button onClick={() => handleView(lead)} className="shrink-0 text-xs text-red-600 font-semibold flex items-center gap-1 hover:underline">
                  <Eye size={12} /> View
                </button>
              </div>
            )
          })}
          {lockedLeads.map((lead) => (
            <div key={lead.id} className="relative bg-white rounded-2xl border border-gray-200 p-5 shadow-sm overflow-hidden">
              <div className="filter blur-sm select-none pointer-events-none flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-400 text-sm shrink-0">?</div>
                <div>
                  <p className="font-semibold text-gray-400 text-sm">Hidden Contact</p>
                  <div className="flex gap-3 text-xs text-gray-300 mt-0.5">
                    <span>Hidden City</span>
                    <span>$???K – $???K</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
                <div className="text-center">
                  <Lock size={16} className="mx-auto mb-1 text-amber-500" />
                  <p className="text-xs font-semibold text-gray-700">Upgrade to unlock</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom upgrade CTA */}
      {isBasic && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white text-center mt-6">
          <Zap size={22} className="mx-auto mb-2 text-amber-400" />
          <h3 className="font-bold text-base mb-1">Upgrade to Premium</h3>
          <p className="text-sm text-gray-300 mb-4">Unlock all leads, priority placement, a verified badge, and advanced analytics.</p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-colors">
            See Pricing
          </button>
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
function SupportTab({ session }: { session: FranchisorSession | null }) {
  const [form, setForm] = useState({ category: 'Listing Issue', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [showRemoval, setShowRemoval] = useState(false)
  const [removalForm, setRemovalForm] = useState({ reason: '' })
  const [removalLoading, setRemovalLoading] = useState(false)
  const [removalSubmitted, setRemovalSubmitted] = useState(false)
  const [removalError, setRemovalError] = useState('')

  const displayName = session?.name ?? MOCK_USER.name
  const displayEmail = session?.email ?? MOCK_USER.email
  const franchiseName = session?.franchiseName ?? MOCK_USER.franchise.name
  const franchiseId = session?.franchiseId ?? MOCK_USER.franchise.id

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject || !form.message) return
    addUserTicket({
      id: `user_${Date.now()}`,
      name: displayName,
      email: displayEmail,
      category: form.category,
      subject: form.subject,
      message: form.message,
      status: 'Open',
      submittedAt: new Date().toISOString().split('T')[0],
    })
    setSubmitted(true)
  }

  const handleRemovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!removalForm.reason.trim()) return
    setRemovalLoading(true)
    setRemovalError('')
    try {
      const res = await fetch('/api/removal-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          franchiseName,
          franchiseId,
          contactName: displayName,
          email: displayEmail,
          reason: removalForm.reason,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setRemovalError(data.error || 'Something went wrong. Please try again.')
      } else {
        setRemovalSubmitted(true)
        setShowRemoval(false)
      }
    } catch {
      setRemovalError('Network error. Please try again.')
    } finally {
      setRemovalLoading(false)
    }
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
      {/* Removal request modal */}
      {showRemoval && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-gray-900">Request Listing Removal</h3>
                <p className="text-xs text-gray-500 mt-0.5">For: <span className="font-semibold">{franchiseName}</span></p>
              </div>
              <button onClick={() => { setShowRemoval(false); setRemovalError('') }} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <div className="flex gap-2">
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  This will send a removal request to our team. We will review it and contact you at <strong>{displayEmail}</strong> within 1–2 business days.
                </p>
              </div>
            </div>
            <form onSubmit={handleRemovalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Reason for Removal *</label>
                <textarea
                  required
                  rows={4}
                  value={removalForm.reason}
                  onChange={(e) => setRemovalForm({ reason: e.target.value })}
                  placeholder="Please explain why you'd like your listing removed (e.g. no longer franchising, incorrect listing, duplicate entry)…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                />
              </div>
              {removalError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{removalError}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowRemoval(false); setRemovalError('') }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={removalLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {removalLoading ? <><Loader2 size={13} className="animate-spin" /> Sending…</> : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900">Support</h2>
        <p className="text-sm text-gray-400 mt-0.5">Need help? Submit a ticket and our team will respond within 1–2 business days.</p>
      </div>

      {removalSubmitted && (
        <div className="mb-5 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          <p className="text-sm text-green-800">Your listing removal request has been submitted. We'll follow up at <strong>{displayEmail}</strong> within 1–2 business days.</p>
        </div>
      )}

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
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
              <Trash2 size={14} className="text-red-500" /> Request Listing Removal
            </h3>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">Need your listing taken down? Submit a removal request and our team will process it within 1–2 business days.</p>
            <button
              onClick={() => setShowRemoval(true)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline"
            >
              Submit removal request →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('leads')
  const [realSession, setRealSession] = useState<FranchisorSession | null>(null)
  const [leadCount, setLeadCount] = useState(0)

  useEffect(() => {
    // Check for real franchisor session first
    const session = getSession()
    if (session) {
      setRealSession(session)
      setLeadCount(getLeads(session.franchiseId).filter((l) => !l.read).length)
      setLoggedIn(true)
      return
    }
    // Fall back to demo session
    if (typeof window !== 'undefined' && localStorage.getItem('fo_user') === 'authenticated') {
      setLoggedIn(true)
      setActiveTab('listing')
    }
  }, [])

  const handleLogout = () => {
    clearSession()
    if (typeof window !== 'undefined') localStorage.removeItem('fo_user')
    setLoggedIn(false)
    setRealSession(null)
  }

  const handleRealLogin = () => {
    const session = getSession()
    if (session) {
      setRealSession(session)
      setLeadCount(getLeads(session.franchiseId).filter((l) => !l.read).length)
    }
    setLoggedIn(true)
    setActiveTab('listing')
  }

  if (!loggedIn) return <LoginScreen onLogin={handleRealLogin} />

  const displayName = realSession?.name ?? MOCK_USER.name
  const displayEmail = realSession?.email ?? MOCK_USER.email

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashNav active={activeTab} onTab={setActiveTab} onLogout={handleLogout} email={displayEmail} unread={leadCount} />
      <main className="flex-1 p-6 md:p-8 max-w-4xl">
        <div className="mb-6">
          <p className="text-sm text-gray-400">Welcome back,</p>
          <h1 className="text-2xl font-black text-gray-900">{displayName}</h1>
        </div>
        {activeTab === 'leads' && <LeadsTab session={realSession} />}
        {activeTab === 'listing' && <ListingTab />}
        {activeTab === 'billing' && <BillingTab />}
        {activeTab === 'support' && <SupportTab session={realSession} />}
      </main>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Clock, CheckCircle, Ticket, TrendingUp, LogOut, Menu, X, LayoutDashboard, ListChecks, MessageSquare, Settings, Building2 } from 'lucide-react'

// Mock pending franchises
const mockPending = [
  { id: 'p1', name: 'Sunset Poutine Co.', category: 'Fast Food', plan: 'Premium', email: 'owner@sunsetpoutine.ca', submittedAt: '2026-03-25', city: 'Mississauga, ON' },
  { id: 'p2', name: 'CleanPro Home Services', category: 'Home Services', plan: 'Basic', email: 'info@cleanpro.ca', submittedAt: '2026-03-24', city: 'Ottawa, ON' },
  { id: 'p3', name: 'GlowBar Beauty Studio', category: 'Beauty & Salon', plan: 'Enterprise', email: 'franchise@glowbar.ca', submittedAt: '2026-03-24', city: 'Toronto, ON' },
  { id: 'p4', name: 'Paw Palace Pet Spa', category: 'Pet Services', plan: 'Basic', email: 'hello@pawpalace.ca', submittedAt: '2026-03-23', city: 'Hamilton, ON' },
  { id: 'p5', name: 'TurboTech Auto Care', category: 'Automotive', plan: 'Premium', email: 'franchise@turbotech.ca', submittedAt: '2026-03-22', city: 'Brampton, ON' },
]

// Mock support tickets
const mockTickets = [
  { id: 't1', name: 'Sarah M.', category: 'Billing & Payments', subject: 'Charged twice for Premium plan', status: 'Open', submittedAt: '2026-03-25' },
  { id: 't2', name: 'James T.', category: 'Listing Issue', subject: 'My photos are not showing on my profile', status: 'Open', submittedAt: '2026-03-24' },
  { id: 't3', name: 'Priya K.', category: 'General Enquiry', subject: 'Question about Enterprise upgrade process', status: 'Resolved', submittedAt: '2026-03-23' },
  { id: 't4', name: 'Marcus L.', category: 'Account Access', subject: 'Cannot reset my password', status: 'Open', submittedAt: '2026-03-22' },
]

function useAdminAuth() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('fo_admin') !== 'authenticated') {
      router.replace('/admin')
    }
  }, [router])
}

function AdminNav({ active }: { active: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const nav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Active Listings', href: '/admin/listings', icon: <Building2 size={16} /> },
    { label: 'Pending Listings', href: '/admin/franchises', icon: <ListChecks size={16} /> },
    { label: 'Support Tickets', href: '/admin/tickets', icon: <MessageSquare size={16} /> },
  ]

  const logout = () => {
    sessionStorage.removeItem('fo_admin')
    router.push('/admin')
  }

  return (
    <aside className="bg-gray-900 text-white w-60 shrink-0 min-h-screen flex flex-col hidden md:flex">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-sm">🍁</div>
          <div>
            <div className="text-sm font-bold leading-none">FranchiseOntario</div>
            <div className="text-xs text-gray-500 mt-0.5">Admin Portal</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === item.label ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 mb-2 px-3">cdeneire@proton.me</div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default function AdminDashboardPage() {
  useAdminAuth()

  const stats = [
    { label: 'Total Listings', value: '3', sub: '3 enterprise VIP', icon: <Users size={18} />, color: 'bg-blue-500' },
    { label: 'Pending Approval', value: mockPending.length, sub: 'Awaiting review', icon: <Clock size={18} />, color: 'bg-amber-500' },
    { label: 'Open Tickets', value: mockTickets.filter(t => t.status === 'Open').length, sub: 'Need response', icon: <Ticket size={18} />, color: 'bg-red-500' },
    { label: 'This Month Revenue', value: '$597', sub: '3 active paid plans', icon: <TrendingUp size={18} />, color: 'bg-green-500' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNav active="Dashboard" />
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back — here's what needs your attention.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className={`w-9 h-9 ${stat.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-700 mt-0.5">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending franchises */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-sm">Pending Listing Approvals</h2>
              <Link href="/admin/franchises" className="text-xs text-red-600 hover:underline font-medium">View all →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {mockPending.slice(0, 3).map((f) => (
                <div key={f.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{f.name}</div>
                    <div className="text-xs text-gray-400">{f.category} · {f.city} · {f.plan}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors">
                      Approve
                    </button>
                    <button className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support tickets */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-sm">Recent Support Tickets</h2>
              <Link href="/admin/tickets" className="text-xs text-red-600 hover:underline font-medium">View all →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {mockTickets.slice(0, 3).map((t) => (
                <div key={t.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 line-clamp-1">{t.subject}</div>
                    <div className="text-xs text-gray-400">{t.name} · {t.category} · {t.submittedAt}</div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'Open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue breakdown */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Active Paid Listings</h2>
          <div className="space-y-3">
            {[
              { name: "Chuck's Roadhouse Bar and Grill", plan: 'Enterprise', amount: '$199/mo', featured: true, status: 'Active' },
              { name: "Crabby Joe's", plan: 'Enterprise', amount: '$199/mo', featured: false, status: 'Active' },
              { name: 'Coffee Culture Café & Eatery', plan: 'Enterprise', amount: '$199/mo', featured: true, status: 'Active' },
            ].map((listing) => (
              <div key={listing.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{listing.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{listing.plan}</span>
                    {listing.featured && (
                      <span className="vip-badge text-[9px] px-1.5 py-0.5 rounded-full">Featured</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600">{listing.amount}</div>
                  <div className="text-[10px] text-gray-400">{listing.status}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Monthly Recurring Revenue</span>
            <span className="text-lg font-black text-green-600">$597.00 CAD</span>
          </div>
        </div>
      </main>
    </div>
  )
}

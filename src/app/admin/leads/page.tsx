'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, ListChecks, MessageSquare, Shield, LogOut,
  Building2, Users, BarChart3, Inbox, Search, X, Phone, Mail,
  MapPin, DollarSign, Calendar, ChevronDown, Download, Eye, Trash2, TrendingUp,
} from 'lucide-react'
import { type FranchiseLead, type LeadStatus } from '@/lib/leads'

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  meeting_scheduled: 'Meeting Scheduled',
  proposal_sent: 'Proposal Sent',
  closed_won: 'Closed — Won',
  closed_lost: 'Closed — Lost',
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  meeting_scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  proposal_sent: 'bg-orange-50 text-orange-700 border-orange-200',
  closed_won: 'bg-green-50 text-green-700 border-green-200',
  closed_lost: 'bg-gray-100 text-gray-500 border-gray-200',
}

function AdminNav({ active }: { active: string }) {
  const router = useRouter()
  const nav = [
    { label: 'Dashboard',        href: '/admin/dashboard',  icon: <LayoutDashboard size={16} /> },
    { label: 'Active Listings',  href: '/admin/listings',   icon: <Building2 size={16} /> },
    { label: 'Pending Listings', href: '/admin/franchises', icon: <ListChecks size={16} /> },
    { label: 'All Leads',        href: '/admin/leads',      icon: <Inbox size={16} /> },
    { label: 'Claim Requests',   href: '/admin/claims',     icon: <Shield size={16} /> },
    { label: 'Support Tickets',  href: '/admin/tickets',    icon: <MessageSquare size={16} /> },
    { label: 'User Accounts',    href: '/admin/users',      icon: <Users size={16} /> },
    { label: 'SEO Dashboard',    href: '/admin/seo',        icon: <BarChart3 size={16} /> },
  ]
  const logout = () => { localStorage.removeItem('fo_admin'); router.push('/admin') }
  return (
    <aside className="bg-gray-900 text-white w-60 shrink-0 min-h-screen flex-col hidden md:flex">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-sm">🍁</div>
          <div><div className="text-sm font-bold">FranchiseOntario</div><div className="text-xs text-gray-500 mt-0.5">Admin Portal</div></div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active === item.label ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            {item.icon}{item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-full px-3 py-2 rounded-xl hover:bg-gray-800 transition-all">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function exportCsv(leads: FranchiseLead[]) {
  const headers = ['Date', 'Franchise', 'Name', 'Email', 'Phone', 'City', 'Budget', 'Status', 'Message']
  const rows = leads.map((l) => [
    fmt(l.submittedAt),
    l.franchiseName,
    l.name,
    l.email,
    l.phone || '',
    l.city || '',
    l.investmentBudget,
    l.status ?? 'new',
    (l.message || '').replace(/,/g, ' '),
  ])
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `fo-leads-${Date.now()}.csv`; a.click()
  URL.revokeObjectURL(url)
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<FranchiseLead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all')
  const [franchiseFilter, setFranchiseFilter] = useState('all')
  const [selected, setSelected] = useState<FranchiseLead | null>(null)

  async function fetchLeads() {
    const res = await fetch('/api/admin/leads')
    if (res.ok) setLeads(await res.json() as FranchiseLead[])
    setLoading(false)
  }

  useEffect(() => {
    if (localStorage.getItem('fo_admin') !== 'authenticated') {
      router.push('/admin'); return
    }
    fetchLeads()
  }, [router])

  const franchiseNames = useMemo(() =>
    ['all', ...Array.from(new Set(leads.map((l) => l.franchiseName))).sort()],
    [leads]
  )

  const filtered = useMemo(() => leads.filter((l) => {
    const q = search.toLowerCase()
    const matchSearch = !q || [l.name, l.email, l.phone, l.city, l.franchiseName, l.message]
      .some((f) => (f ?? '').toLowerCase().includes(q))
    const matchStatus = statusFilter === 'all' || (l.status ?? 'new') === statusFilter
    const matchFranchise = franchiseFilter === 'all' || l.franchiseName === franchiseFilter
    return matchSearch && matchStatus && matchFranchise
  }), [leads, search, statusFilter, franchiseFilter])

  const stats = useMemo(() => ({
    total: leads.length,
    newCount: leads.filter((l) => !l.status || l.status === 'new').length,
    thisWeek: leads.filter((l) => Date.now() - new Date(l.submittedAt).getTime() < 7 * 86400000).length,
    wonCount: leads.filter((l) => l.status === 'closed_won').length,
  }), [leads])

  async function changeStatus(lead: FranchiseLead, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, status } : l))
    if (selected?.id === lead.id) setSelected({ ...lead, status })
    await fetch(`/api/admin/leads?id=${encodeURIComponent(lead.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  async function deleteLead(lead: FranchiseLead) {
    if (!confirm(`Delete lead from ${lead.name}?`)) return
    setLeads((prev) => prev.filter((l) => l.id !== lead.id))
    if (selected?.id === lead.id) setSelected(null)
    await fetch(`/api/admin/leads?id=${encodeURIComponent(lead.id)}`, { method: 'DELETE' })
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNav active="All Leads" />

      <main className="flex-1 p-6 md:p-8 overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-gray-900">All Leads</h1>
            <p className="text-sm text-gray-500 mt-0.5">Every franchise inquiry captured across the directory.</p>
          </div>
          <button
            onClick={() => exportCsv(filtered)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Leads', value: stats.total, icon: <Inbox size={16} />, color: 'text-blue-600' },
            { label: 'New / Unread', value: stats.newCount, icon: <TrendingUp size={16} />, color: 'text-red-600' },
            { label: 'This Week', value: stats.thisWeek, icon: <Calendar size={16} />, color: 'text-purple-600' },
            { label: 'Closed Won', value: stats.wonCount, icon: <Eye size={16} />, color: 'text-green-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1 ${s.color}`}>{s.icon}{s.label}</div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, city…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-400"
            />
          </div>
          <select
            value={franchiseFilter} onChange={(e) => setFranchiseFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-red-400"
          >
            <option value="all">All Franchises</option>
            {franchiseNames.slice(1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | LeadStatus)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-red-400"
          >
            <option value="all">All Statuses</option>
            {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          {(search || statusFilter !== 'all' || franchiseFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setStatusFilter('all'); setFranchiseFilter('all') }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 font-medium">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium">Loading leads…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <Inbox size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No leads found</p>
              <p className="text-xs mt-1">Leads appear here when prospects submit inquiries on listing pages</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Lead</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Contact</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Franchise</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Budget</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((lead) => {
                    const status = (lead.status ?? 'new') as LeadStatus
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">{lead.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <MapPin size={10} />{lead.city || '—'}
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline flex items-center gap-1 text-xs font-medium">
                            <Mail size={11} />{lead.email}
                          </a>
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="text-gray-500 flex items-center gap-1 text-xs mt-0.5">
                              <Phone size={11} />{lead.phone}
                            </a>
                          )}
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <div className="text-gray-700 font-medium text-xs">{lead.franchiseName}</div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                            <DollarSign size={11} className="text-gray-400" />{lead.investmentBudget}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="relative group">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${STATUS_COLORS[status]}`}>
                              {STATUS_LABELS[status]} <ChevronDown size={10} />
                            </span>
                            <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden hidden group-hover:block min-w-44">
                              {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => changeStatus(lead, s)}
                                  className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 transition-colors ${status === s ? 'bg-gray-50 font-bold' : ''}`}
                                >
                                  {STATUS_LABELS[s]}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell text-xs text-gray-400">
                          {fmt(lead.submittedAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => setSelected(lead)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600">
                              <Eye size={14} />
                            </button>
                            <button onClick={() => deleteLead(lead)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-300 hover:text-red-500">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-right">{filtered.length} of {leads.length} leads</p>
      </main>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-black text-gray-900 text-base">Lead Detail</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.franchiseName} · {fmt(selected.submittedAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Prospect info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Prospect</p>
                <div className="text-lg font-black text-gray-900">{selected.name}</div>
                <div className="grid grid-cols-1 gap-2">
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium">
                    <Mail size={14} />{selected.email}
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone size={14} />{selected.phone}
                    </a>
                  )}
                  {selected.city && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} />{selected.city}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <DollarSign size={14} className="text-gray-400" />{selected.investmentBudget}
                  </div>
                </div>
              </div>

              {selected.message && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Message</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
                </div>
              )}

              {/* Status update */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => changeStatus(selected, s)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${(selected.status ?? 'new') === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'}`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a href={`mailto:${selected.email}`}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-xl text-center transition-colors">
                  Email Prospect
                </a>
                <button onClick={() => { deleteLead(selected); setSelected(null) }}
                  className="flex items-center gap-1.5 border border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-400 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

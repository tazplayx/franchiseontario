'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, ListChecks, MessageSquare, Shield, LogOut, Mail, Building2, BarChart3, Users } from 'lucide-react'
import { applyTicketStore, saveTicketStatus, type StoredTicket } from '@/lib/store'

const seedTickets: StoredTicket[] = [
  { id: 't1', name: 'Sarah M.', email: 'sarah.m@email.com', category: 'Billing & Payments', subject: 'Charged twice for Premium plan in March', message: 'Hello, I noticed I was billed twice for my Premium listing on March 1st and March 3rd. Could you please look into this and issue a refund for the duplicate charge? My invoice number is #PRE-2024-0891.', status: 'Open', submittedAt: '2026-03-25' },
  { id: 't2', name: 'James T.', email: 'james.t@sunsetpoutine.ca', category: 'Listing Issue', subject: 'Uploaded photos are not appearing on my profile', message: 'I uploaded 4 photos to my franchise listing 3 days ago but they are still not showing on my public profile page. I am on the Premium plan. Please advise.', status: 'Open', submittedAt: '2026-03-24' },
  { id: 't3', name: 'Priya K.', email: 'priya@glowbar.ca', category: 'General Enquiry', subject: 'Question about upgrading to Enterprise', message: 'Hi, I currently have a Premium listing and I am considering upgrading to Enterprise. I had a few questions about what the account manager support looks like and whether the press release feature is included immediately upon upgrade.', status: 'Resolved', submittedAt: '2026-03-23' },
  { id: 't4', name: 'Marcus L.', email: 'marcus@turbotech.ca', category: 'Account Access', subject: 'Cannot reset password — not receiving reset email', message: 'I have tried resetting my password 3 times but I am not receiving the reset email. I have checked my spam folder as well. My registered email is marcus@turbotech.ca.', status: 'Open', submittedAt: '2026-03-22' },
  { id: 't5', name: 'Linda H.', email: 'linda@pawpalace.ca', category: 'Listing Issue', subject: 'Wrong category showing on my listing', message: 'My listing was approved but it is showing under Home Services instead of Pet Services. Could this be corrected please?', status: 'Resolved', submittedAt: '2026-03-21' },
]

function AdminNav({ active }: { active: string }) {
  const router = useRouter()
  const nav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Active Listings', href: '/admin/listings', icon: <Building2 size={16} /> },
    { label: 'Pending Listings', href: '/admin/franchises', icon: <ListChecks size={16} /> },
    { label: 'Claim Requests', href: '/admin/claims', icon: <Shield size={16} /> },
    { label: 'Support Tickets', href: '/admin/tickets', icon: <MessageSquare size={16} /> },
    { label: 'User Accounts', href: '/admin/users', icon: <Users size={16} /> },
    { label: 'SEO Dashboard', href: '/admin/seo', icon: <BarChart3 size={16} /> },
  ]
  const logout = () => { sessionStorage.removeItem('fo_admin'); router.push('/admin') }
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
        <div className="text-xs text-gray-500 mb-2 px-3">cdeneire@proton.me</div>
        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 w-full"><LogOut size={15} />Sign Out</button>
      </div>
    </aside>
  )
}

export default function AdminTicketsPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('fo_admin') !== 'authenticated') {
      router.replace('/admin')
    }
  }, [router])

  const [tickets, setTickets] = useState<StoredTicket[]>(() => applyTicketStore(seedTickets))
  const [filter, setFilter] = useState<'all' | 'Open' | 'Resolved'>('all')
  const [selected, setSelected] = useState<StoredTicket | null>(null)

  // Re-apply store on mount to pick up any user-submitted tickets added since render
  useEffect(() => {
    setTickets(applyTicketStore(seedTickets))
  }, [])

  const resolve = (id: string) => {
    saveTicketStatus(id, 'Resolved')
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)))
    setSelected(null)
  }

  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNav active="Support Tickets" />
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-0.5">Respond to and resolve incoming user support requests.</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-5">
          {(['all', 'Open', 'Resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {f} ({f === 'all' ? tickets.length : tickets.filter(t => t.status === f).length})
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelected(ticket)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ticket.status === 'Open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                      {ticket.status}
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{ticket.category}</span>
                    <span className="text-[10px] text-gray-400">{ticket.submittedAt}</span>
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{ticket.subject}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{ticket.name}</div>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">{ticket.message}</p>
                </div>
                <a
                  href={`mailto:${ticket.email}?subject=Re: ${encodeURIComponent(ticket.subject)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <Mail size={13} /> Reply
                </a>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
              No tickets in this category
            </div>
          )}
        </div>

        {/* Ticket detail modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selected.status === 'Open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{selected.status}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{selected.category}</span>
                  </div>
                  <h3 className="font-black text-gray-900">{selected.subject}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-3">&times;</button>
              </div>
              <div className="space-y-2 text-sm mb-4 bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between"><span className="text-gray-500">From</span><span className="font-semibold">{selected.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-semibold">{selected.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Submitted</span><span className="font-semibold">{selected.submittedAt}</span></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
                <p className="text-xs font-semibold text-gray-500 mb-2">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
              </div>
              <div className="flex gap-3">
                {selected.status === 'Open' && (
                  <button onClick={() => resolve(selected.id)} className="flex-1 bg-green-100 text-green-700 font-bold py-2.5 rounded-xl text-sm hover:bg-green-200 transition-colors">
                    Mark Resolved
                  </button>
                )}
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}&body=Hi ${selected.name.split(' ')[0]},%0D%0A%0D%0AThank you for reaching out to FranchiseOntario support.%0D%0A%0D%0A`}
                  className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm text-center hover:bg-blue-700 transition-colors"
                >
                  Reply by Email
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

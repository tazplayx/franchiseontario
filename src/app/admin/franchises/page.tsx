'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Eye, LayoutDashboard, ListChecks, MessageSquare, LogOut, Building2 } from 'lucide-react'
import { getPendingStatuses, savePendingStatus, saveApprovedListing, removeApprovedListing, type PendingStatus } from '@/lib/store'
import type { Franchise, FranchiseCategory } from '@/data/franchises'
import { sendEmail } from '@/lib/email'

const initialPending = [
  { id: 'p1', name: 'Sunset Poutine Co.', category: 'Fast Food', plan: 'Premium', email: 'owner@sunsetpoutine.ca', submittedAt: '2026-03-25', city: 'Mississauga, ON', description: 'A Quebec-inspired poutine franchise bringing authentic curds and gravy to Ontario markets. 3 existing locations in Quebec.', status: 'pending' },
  { id: 'p2', name: 'CleanPro Home Services', category: 'Home Services', plan: 'Basic', email: 'info@cleanpro.ca', submittedAt: '2026-03-24', city: 'Ottawa, ON', description: 'Professional residential and commercial cleaning franchise. 8 locations across Ontario.', status: 'pending' },
  { id: 'p3', name: 'GlowBar Beauty Studio', category: 'Beauty & Salon', plan: 'Enterprise', email: 'franchise@glowbar.ca', submittedAt: '2026-03-24', city: 'Toronto, ON', description: 'Premium eyebrow and lash bar franchise targeting urban Ontario markets. 12 locations across Canada.', status: 'pending' },
  { id: 'p4', name: 'Paw Palace Pet Spa', category: 'Pet Services', plan: 'Basic', email: 'hello@pawpalace.ca', submittedAt: '2026-03-23', city: 'Hamilton, ON', description: 'Full-service pet grooming and boarding franchise. New concept with 2 pilot locations in Ontario.', status: 'pending' },
  { id: 'p5', name: 'TurboTech Auto Care', category: 'Automotive', plan: 'Premium', email: 'franchise@turbotech.ca', submittedAt: '2026-03-22', city: 'Brampton, ON', description: 'Quick-service automotive maintenance franchise specializing in EV-compatible service bays.', status: 'pending' },
]

/** Convert a pending listing submission into a full Franchise object with sensible defaults. */
function pendingToFranchise(p: typeof initialPending[0]): Franchise {
  const tierMap: Record<string, Franchise['tier']> = {
    Enterprise: 'enterprise',
    Premium: 'premium',
    Basic: 'basic',
  }
  const initials = p.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return {
    id: p.id,
    name: p.name,
    tagline: p.description.split('.')[0].trim(),
    description: p.description,
    longDescription: p.description,
    category: p.category as FranchiseCategory,
    tier: tierMap[p.plan] ?? 'basic',
    isVIP: p.plan === 'Enterprise',
    isFeatured: false,
    logoInitials: initials,
    logoColor: '#FFFFFF',
    logoBg: '#6B7280',
    locations: 0,
    rating: 0,
    reviews: 0,
    established: new Date().getFullYear(),
    financials: {
      franchiseFee: 'Contact for details',
      royaltyRate: 'Contact for details',
      marketingFee: 'Contact for details',
      investmentMin: 0,
      investmentMax: 0,
      averageUnitVolume: 'Contact for details',
      netWorthRequired: 'Contact for details',
      liquidCapitalRequired: 'Contact for details',
    },
    website: '',
    phone: '',
    email: p.email,
    city: p.city,
    highlights: [],
    popularityScore: 0,
    rank: 999,
    badges: [],
    trainingWeeks: 0,
    territory: '',
    franchiseeCount: 0,
    parent: '',
    idealCandidate: [],
    supportOffered: [],
    mediaImages: [],
    videoUrl: '',
    faqs: [],
  }
}

function AdminNav({ active }: { active: string }) {
  const router = useRouter()
  const nav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Active Listings', href: '/admin/listings', icon: <Building2 size={16} /> },
    { label: 'Pending Listings', href: '/admin/franchises', icon: <ListChecks size={16} /> },
    { label: 'Support Tickets', href: '/admin/tickets', icon: <MessageSquare size={16} /> },
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

export default function AdminFranchisesPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('fo_admin') !== 'authenticated') {
      router.replace('/admin')
    }
  }, [router])

  const [listings, setListings] = useState(() => {
    const statuses = getPendingStatuses()
    return initialPending.map((l) =>
      statuses[l.id] ? { ...l, status: statuses[l.id] as PendingStatus } : l
    )
  })
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selected, setSelected] = useState<typeof initialPending[0] | null>(null)

  // Re-apply store on mount (handles SSR hydration)
  useEffect(() => {
    const statuses = getPendingStatuses()
    setListings(initialPending.map((l) =>
      statuses[l.id] ? { ...l, status: statuses[l.id] as PendingStatus } : l
    ))
  }, [])

  const update = (id: string, status: 'approved' | 'rejected') => {
    savePendingStatus(id, status)
    const listing = initialPending.find((l) => l.id === id)
    if (listing) {
      if (status === 'approved') {
        saveApprovedListing(pendingToFranchise(listing))
        // Notify listing owner of approval
        sendEmail(listing.email, 'listing-approved', {
          franchiseName: listing.name,
          plan: listing.plan,
        })
      } else {
        // Remove from approved store in case it was previously approved then rejected
        removeApprovedListing(id)
        // Notify listing owner of rejection
        sendEmail(listing.email, 'listing-rejected', {
          franchiseName: listing.name,
        })
      }
    }
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    setSelected(null)
  }

  const filtered = filter === 'all' ? listings : listings.filter((l) => l.status === filter)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNav active="Pending Listings" />
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Franchise Listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and approve new franchise submissions before they go live.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {f} ({f === 'all' ? listings.length : listings.filter(l => l.status === f).length})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Franchise</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Submitted</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{listing.name}</div>
                    <div className="text-xs text-gray-400">{listing.category} · {listing.city}</div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${listing.plan === 'Enterprise' ? 'vip-badge' : listing.plan === 'Premium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {listing.plan}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-400 hidden md:table-cell">{listing.submittedAt}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${listing.status === 'pending' ? 'bg-amber-100 text-amber-700' : listing.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(listing)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye size={15} />
                      </button>
                      {listing.status === 'pending' && (
                        <>
                          <button onClick={() => update(listing.id, 'approved')} className="p-1.5 text-gray-400 hover:text-green-600 transition-colors">
                            <CheckCircle size={15} />
                          </button>
                          <button onClick={() => update(listing.id, 'rejected')} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                            <XCircle size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No listings in this category</div>
          )}
        </div>

        {/* Detail modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">{selected.name}</h3>
                  <p className="text-xs text-gray-400">{selected.category} · {selected.city}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="font-semibold">{selected.plan}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Contact Email</span><span className="font-semibold">{selected.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Submitted</span><span className="font-semibold">{selected.submittedAt}</span></div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-500 text-xs mb-1">Description</p>
                  <p className="text-gray-700">{selected.description}</p>
                </div>
              </div>
              {selected.status === 'pending' && (
                <div className="flex gap-3">
                  <button onClick={() => update(selected.id, 'rejected')} className="flex-1 bg-red-100 text-red-600 font-bold py-2.5 rounded-xl text-sm hover:bg-red-200 transition-colors">
                    Reject
                  </button>
                  <button onClick={() => update(selected.id, 'approved')} className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-green-600 transition-colors">
                    Approve & Go Live
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

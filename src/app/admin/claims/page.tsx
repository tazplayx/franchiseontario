'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Building2, ListChecks, MessageSquare, Shield, LogOut, CheckCircle, XCircle, ExternalLink, Clock, AlertCircle } from 'lucide-react'
import { getClaims, updateClaimStatus, type ListingClaim } from '@/lib/store'

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
  const nav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Active Listings', href: '/admin/listings', icon: <Building2 size={16} /> },
    { label: 'Pending Listings', href: '/admin/franchises', icon: <ListChecks size={16} /> },
    { label: 'Claim Requests', href: '/admin/claims', icon: <Shield size={16} /> },
    { label: 'Support Tickets', href: '/admin/tickets', icon: <MessageSquare size={16} /> },
  ]
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
          onClick={() => { sessionStorage.removeItem('fo_admin'); router.push('/admin') }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

function statusBadge(status: ListingClaim['status']) {
  if (status === 'approved') return <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Approved</span>
  if (status === 'rejected') return <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">Rejected</span>
  return <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={9} />Pending</span>
}

export default function AdminClaimsPage() {
  useAdminAuth()
  const [claims, setClaims] = useState<ListingClaim[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    setClaims(getClaims())
  }, [])

  function handleDecision(id: string, decision: 'approved' | 'rejected') {
    updateClaimStatus(id, decision)
    setClaims(getClaims())
  }

  const filtered = filter === 'all' ? claims : claims.filter((c) => c.status === filter)
  const pendingCount = claims.filter((c) => c.status === 'pending').length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav active="Claim Requests" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Claim Requests</h1>
              <p className="text-gray-500 text-sm mt-1">
                Franchise owners requesting to claim sourced listings.
                {pendingCount > 0 && <span className="ml-2 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount} pending</span>}
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {(['pending', 'all', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                  filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Claims list */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <Shield className="mx-auto mb-3 text-gray-300" size={36} />
              <p className="font-semibold text-gray-500">No {filter === 'all' ? '' : filter} claim requests</p>
              <p className="text-xs text-gray-400 mt-1">Claims submitted by franchise owners will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((claim) => (
                <div key={claim.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{claim.franchiseName}</h3>
                        {statusBadge(claim.status)}
                        {claim.domainMatch ? (
                          <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle size={9} /> Domain match
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle size={9} /> Verify manually
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Submitted {new Date(claim.submittedAt).toLocaleDateString('en-CA', { dateStyle: 'medium' })} &mdash; listing ID: <span className="font-mono">{claim.franchiseId}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/directory/${claim.franchiseId}`}
                        target="_blank"
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors"
                      >
                        View listing <ExternalLink size={10} />
                      </Link>
                      {claim.sourceListingUrl && (
                        <a
                          href={claim.sourceListingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors"
                        >
                          Source <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Claimant details */}
                  <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold mb-0.5">Name</p>
                      <p className="font-semibold text-gray-800">{claim.claimantName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold mb-0.5">Title</p>
                      <p className="text-gray-700">{claim.claimantTitle || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold mb-0.5">Email</p>
                      <a href={`mailto:${claim.claimantEmail}`} className="text-red-600 hover:underline">{claim.claimantEmail}</a>
                    </div>
                  </div>

                  {claim.message && (
                    <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
                      <p className="text-xs text-gray-400 font-semibold mb-1">Message</p>
                      <p className="text-sm text-gray-700">{claim.message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {claim.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDecision(claim.id, 'approved')}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <CheckCircle size={14} /> Approve & Contact
                      </button>
                      <button
                        onClick={() => handleDecision(claim.id, 'rejected')}
                        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-red-300 text-gray-600 hover:text-red-600 px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

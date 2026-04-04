'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, ListChecks, MessageSquare, Shield, LogOut, Building2,
  Pencil, Trash2, X, Save, AlertTriangle, Star, Crown,
  Plus, ImagePlus, Video, Image as ImageIcon, Eye, BarChart3, Users,
} from 'lucide-react'
import { franchises, type Franchise, type FranchiseTier } from '@/data/franchises'
import { applyListingStore, saveListing, removeListing } from '@/lib/store'
import { sendEmail } from '@/lib/email'

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
        <div className="text-xs text-gray-500 mb-2 px-3">cdeneire@proton.me</div>
        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 w-full"><LogOut size={15} />Sign Out</button>
      </div>
    </aside>
  )
}

type EditableFields = {
  name: string
  tagline: string
  description: string
  longDescription: string
  category: string
  tier: FranchiseTier
  isVIP: boolean
  isFeatured: boolean
  city: string
  locations: number
  established: number
  franchiseeCount: number
  territory: string
  email: string
  phone: string
  website: string
  logoUrl: string
  videoUrl: string
  mediaImages: string[]
  highlights: string[]
  idealCandidate: string[]
  supportOffered: string[]
  // Financials
  franchiseFee: string
  royaltyRate: string
  marketingFee: string
  investmentMin: number
  investmentMax: number
  averageUnitVolume: string
  netWorthRequired: string
  liquidCapitalRequired: string
}

// ── Image Gallery Editor ────────────────────────────────────────────────────────
function GalleryEditor({
  images,
  onChange,
}: {
  images: string[]
  onChange: (imgs: string[]) => void
}) {
  const [urlInput, setUrlInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const addUrl = () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    onChange([...images, trimmed])
    setUrlInput('')
  }

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = ev.target?.result as string
        if (result) onChange([...images, result])
      }
      reader.readAsDataURL(file)
    })
    if (fileRef.current) fileRef.current.value = ''
  }

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      {/* Existing images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden aspect-video bg-gray-100">
              <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={11} />
              </button>
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      )}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-xs">
          <ImageIcon size={20} className="mx-auto mb-1 opacity-40" />
          No gallery images yet
        </div>
      )}
      {/* Add controls */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
          placeholder="Paste image URL…"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-200"
        />
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={12} /> Add URL
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
        >
          <ImagePlus size={12} /> Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addFile} />
      </div>
    </div>
  )
}

export default function AdminListingsPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('fo_admin') !== 'authenticated') {
      router.replace('/admin')
    }
  }, [router])

  const [listings, setListings] = useState<Franchise[]>(() => applyListingStore(franchises))
  const [filter, setFilter] = useState<'all' | FranchiseTier>('all')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Franchise | null>(null)
  const [editForm, setEditForm] = useState<EditableFields | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Franchise | null>(null)
  const [saved, setSaved] = useState(false)
  const logoFileRef = useRef<HTMLInputElement>(null)

  const filtered = listings.filter((l) => {
    const matchesTier = filter === 'all' || l.tier === filter
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
    return matchesTier && matchesSearch
  })

  const openEdit = (franchise: Franchise) => {
    setEditing(franchise)
    setEditForm({
      name: franchise.name,
      tagline: franchise.tagline,
      description: franchise.description,
      longDescription: franchise.longDescription || '',
      category: franchise.category,
      tier: franchise.tier,
      isVIP: franchise.isVIP,
      isFeatured: franchise.isFeatured,
      city: franchise.city,
      locations: franchise.locations,
      established: franchise.established,
      franchiseeCount: franchise.franchiseeCount || 0,
      territory: franchise.territory || '',
      email: franchise.email,
      phone: franchise.phone,
      website: franchise.website,
      logoUrl: franchise.logoUrl || '',
      videoUrl: franchise.videoUrl || '',
      mediaImages: franchise.mediaImages || [],
      highlights: franchise.highlights || [],
      idealCandidate: franchise.idealCandidate || [],
      supportOffered: franchise.supportOffered || [],
      franchiseFee: franchise.financials.franchiseFee,
      royaltyRate: franchise.financials.royaltyRate,
      marketingFee: franchise.financials.marketingFee,
      investmentMin: franchise.financials.investmentMin,
      investmentMax: franchise.financials.investmentMax,
      averageUnitVolume: franchise.financials.averageUnitVolume,
      netWorthRequired: franchise.financials.netWorthRequired,
      liquidCapitalRequired: franchise.financials.liquidCapitalRequired,
    })
  }

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editForm) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      if (result) setEditForm((f) => f ? { ...f, logoUrl: result } : f)
    }
    reader.readAsDataURL(file)
    if (logoFileRef.current) logoFileRef.current.value = ''
  }

  const saveEdit = () => {
    if (!editing || !editForm) return
    const updatedFields: Partial<Franchise> = {
      name: editForm.name,
      tagline: editForm.tagline,
      description: editForm.description,
      longDescription: editForm.longDescription,
      category: editForm.category as Franchise['category'],
      tier: editForm.tier,
      isVIP: editForm.isVIP,
      isFeatured: editForm.isFeatured,
      city: editForm.city,
      locations: editForm.locations,
      established: editForm.established,
      franchiseeCount: editForm.franchiseeCount,
      territory: editForm.territory,
      email: editForm.email,
      phone: editForm.phone,
      website: editForm.website,
      logoUrl: editForm.logoUrl || undefined,
      videoUrl: editForm.videoUrl || undefined,
      mediaImages: editForm.mediaImages,
      highlights: editForm.highlights,
      idealCandidate: editForm.idealCandidate,
      supportOffered: editForm.supportOffered,
      financials: {
        ...editing.financials,
        franchiseFee: editForm.franchiseFee,
        royaltyRate: editForm.royaltyRate,
        marketingFee: editForm.marketingFee,
        investmentMin: editForm.investmentMin,
        investmentMax: editForm.investmentMax,
        averageUnitVolume: editForm.averageUnitVolume,
        netWorthRequired: editForm.netWorthRequired,
        liquidCapitalRequired: editForm.liquidCapitalRequired,
      },
    }
    // Persist to localStorage
    saveListing(editing.id, updatedFields)
    // Update React state
    setListings((prev) =>
      prev.map((l) => l.id === editing.id ? { ...l, ...updatedFields } : l)
    )
    // Notify listing owner of admin edit
    if (editing.email) {
      // Detect which fields changed
      const changedFields = (Object.keys(updatedFields) as Array<keyof typeof updatedFields>)
        .filter((k) => updatedFields[k] !== editing[k as keyof Franchise])
        .map((k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim())
      sendEmail(editing.email, 'listing-edited-admin', {
        franchiseName: editing.name,
        editedFields: changedFields,
      })
    }
    setEditing(null)
    setEditForm(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    // Notify listing owner before removing
    if (deleteTarget.email) {
      sendEmail(deleteTarget.email, 'listing-removed', {
        franchiseName: deleteTarget.name,
      })
    }
    // Persist removal to localStorage
    removeListing(deleteTarget.id)
    // Update React state
    setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const tierBadge = (tier: FranchiseTier) => {
    if (tier === 'enterprise') return <span className="vip-badge text-[9px] px-2 py-0.5 rounded-full">Enterprise</span>
    if (tier === 'premium') return <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Premium</span>
    return <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full">Basic</span>
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNav active="Active Listings" />
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Active Listings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage all live franchise listings — edit any field or remove listings.</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-2 rounded-xl">
              <Save size={14} /> Changes saved
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <input
            type="text"
            placeholder="Search by name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 w-64"
          />
          <div className="flex gap-2">
            {(['all', 'enterprise', 'premium', 'basic'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                {f} ({f === 'all' ? listings.length : listings.filter(l => l.tier === f).length})
              </button>
            ))}
          </div>
        </div>

        {/* Listings table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Franchise</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tier</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Media</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Flags</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {listing.logoUrl ? (
                        <img src={listing.logoUrl} alt={listing.name} className="w-9 h-9 rounded-xl object-contain bg-gray-50 border border-gray-100" />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                          style={{ background: listing.logoBg, color: listing.logoColor }}
                        >
                          {listing.logoInitials}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 leading-tight">
                          <span className="font-semibold text-gray-900">{listing.name}</span>
                          {listing.sourced && (
                            <a
                              href={listing.sourceListingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Sourced from ${listing.sourceSite}`}
                              className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full hover:bg-blue-200 transition-colors whitespace-nowrap"
                            >
                              Sourced · {listing.sourceSite}
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{listing.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">{tierBadge(listing.tier)}</td>
                  <td className="px-4 py-4 text-xs text-gray-500 hidden lg:table-cell">{listing.city}</td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {listing.mediaImages?.length > 0 && (
                        <span className="flex items-center gap-0.5"><ImageIcon size={11} /> {listing.mediaImages.length}</span>
                      )}
                      {listing.videoUrl && (
                        <span className="flex items-center gap-0.5"><Video size={11} /> 1</span>
                      )}
                      {!listing.mediaImages?.length && !listing.videoUrl && <span>—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      {listing.isVIP && <span title="VIP"><Crown size={13} className="text-amber-500" /></span>}
                      {listing.isFeatured && <span title="Featured"><Star size={13} className="text-blue-500" /></span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/directory/${listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 hover:bg-gray-100 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Eye size={12} />
                      </a>
                      <button
                        onClick={() => openEdit(listing)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(listing)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No listings match your search</div>
          )}
        </div>

        {/* ── Edit modal ─────────────────────────────────────────────────────── */}
        {editing && editForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="font-black text-gray-900">Edit Listing — {editing.name}</h3>
                <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>

              <div className="p-6 space-y-5">

                {/* ── Section: Basic Info ── */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Basic Info</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Franchise Name</label>
                      <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Tagline</label>
                      <input value={editForm.tagline} onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Short Description</label>
                      <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Long Description (shown on listing page)</label>
                      <textarea rows={5} value={editForm.longDescription} onChange={(e) => setEditForm({ ...editForm, longDescription: e.target.value })}
                        placeholder="Full franchise story and details. Use double line breaks for paragraphs."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                        <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white">
                          {['Bar & Grill','Seafood','Coffee & Café','Fast Food','Pizza','Specialty Food','Bakery & Desserts','Healthy Eating','Fitness & Wellness','Health & Medical','Senior Care','Sports & Recreation','Home Services','Cleaning Services','Real Estate','Education',"Children's Services",'Financial Services','Business Services','Technology & IT','Printing & Signs','Retail','Automotive','Beauty & Salon','Pet Services','Travel & Hospitality'].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Listing Tier</label>
                        <select value={editForm.tier} onChange={(e) => setEditForm({ ...editForm, tier: e.target.value as FranchiseTier })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-white">
                          <option value="basic">Basic (Free)</option>
                          <option value="premium">Premium ($79/mo)</option>
                          <option value="enterprise">Enterprise ($199/mo)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">City / Region</label>
                        <input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Territory</label>
                        <input value={editForm.territory} onChange={(e) => setEditForm({ ...editForm, territory: e.target.value })}
                          placeholder="e.g. Protected radius 5km"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Ontario Locations</label>
                        <input type="number" value={editForm.locations} onChange={(e) => setEditForm({ ...editForm, locations: Number(e.target.value) })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Established</label>
                        <input type="number" value={editForm.established} onChange={(e) => setEditForm({ ...editForm, established: Number(e.target.value) })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Franchisee Count</label>
                        <input type="number" value={editForm.franchiseeCount} onChange={(e) => setEditForm({ ...editForm, franchiseeCount: Number(e.target.value) })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section: Contact ── */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Contact Details</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Contact Email</label>
                      <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                        <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Website</label>
                        <input value={editForm.website} onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section: Logo ── */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Logo / Thumbnail</p>
                  <div className="flex items-start gap-4">
                    {/* Preview */}
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 bg-gray-50">
                      {editForm.logoUrl ? (
                        <img src={editForm.logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon size={22} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Logo URL</label>
                        <input
                          type="url"
                          value={editForm.logoUrl}
                          onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
                          placeholder="https://…"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => logoFileRef.current?.click()}
                          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                        >
                          <ImagePlus size={12} /> Upload File
                        </button>
                        {editForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setEditForm({ ...editForm, logoUrl: '' })}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        )}
                        <input ref={logoFileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section: Gallery ── */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Photo Gallery</p>
                  <p className="text-xs text-gray-400 mb-3">Add up to 10 photos. Shown on the listing detail page for Premium and Enterprise tiers.</p>
                  <GalleryEditor
                    images={editForm.mediaImages}
                    onChange={(imgs) => setEditForm({ ...editForm, mediaImages: imgs.slice(0, 10) })}
                  />
                </div>

                {/* ── Section: Video ── */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Video</p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      <Video size={11} className="inline mr-1" />YouTube or Vimeo URL
                    </label>
                    <input
                      type="url"
                      value={editForm.videoUrl}
                      onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=…"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                    {editForm.videoUrl && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        Video will be embedded on the listing page.
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Section: Financials ── */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Financials</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Franchise Fee', key: 'franchiseFee' as const, placeholder: 'e.g. $40,000' },
                      { label: 'Royalty Rate', key: 'royaltyRate' as const, placeholder: 'e.g. 5% of gross sales' },
                      { label: 'Marketing Fee', key: 'marketingFee' as const, placeholder: 'e.g. 2%' },
                      { label: 'Avg. Unit Volume', key: 'averageUnitVolume' as const, placeholder: 'e.g. $1.2M–$1.8M' },
                      { label: 'Net Worth Required', key: 'netWorthRequired' as const, placeholder: 'e.g. $500,000' },
                      { label: 'Liquid Capital Required', key: 'liquidCapitalRequired' as const, placeholder: 'e.g. $150,000' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                        <input value={editForm[key] as string} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                          placeholder={placeholder}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Investment Min ($)</label>
                      <input type="number" value={editForm.investmentMin} onChange={(e) => setEditForm({ ...editForm, investmentMin: Number(e.target.value) })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Investment Max ($)</label>
                      <input type="number" value={editForm.investmentMax} onChange={(e) => setEditForm({ ...editForm, investmentMax: Number(e.target.value) })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
                    </div>
                  </div>
                </div>

                {/* ── Section: Highlights ── */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Franchise Highlights</p>
                  <p className="text-xs text-gray-400 mb-3">One highlight per line. Shown as bullet points on the listing.</p>
                  <textarea
                    rows={4}
                    value={editForm.highlights.join('\n')}
                    onChange={(e) => setEditForm({ ...editForm, highlights: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Proven operating system&#10;Award-winning brand&#10;Exclusive territory protection"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                  />
                </div>

                {/* ── Section: Ideal Candidate ── */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ideal Franchisee Profile</p>
                  <p className="text-xs text-gray-400 mb-3">One trait per line.</p>
                  <textarea
                    rows={4}
                    value={editForm.idealCandidate.join('\n')}
                    onChange={(e) => setEditForm({ ...editForm, idealCandidate: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Passionate about food & hospitality&#10;Strong community ties&#10;Minimum $150K liquid capital"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                  />
                </div>

                {/* ── Section: Support Offered ── */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Training & Support</p>
                  <p className="text-xs text-gray-400 mb-3">One item per line.</p>
                  <textarea
                    rows={4}
                    value={editForm.supportOffered.join('\n')}
                    onChange={(e) => setEditForm({ ...editForm, supportOffered: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="8-week classroom and in-store training&#10;Grand opening support&#10;Ongoing field operations visits"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
                  />
                </div>

                {/* ── Section: Flags ── */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Visibility Flags</p>
                  <div className="flex items-center gap-6 bg-gray-50 rounded-xl p-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editForm.isVIP} onChange={(e) => setEditForm({ ...editForm, isVIP: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Crown size={13} className="text-amber-500" /> VIP Badge</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editForm.isFeatured} onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })} className="w-4 h-4 accent-blue-500" />
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Star size={13} className="text-blue-500" /> Featured</span>
                    </label>
                  </div>
                </div>

              </div>

              <div className="flex gap-3 px-6 pb-6 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                <button onClick={() => setEditing(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={saveEdit} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-2xl mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-600" />
              </div>
              <h3 className="font-black text-gray-900 text-center text-lg mb-1">Remove Listing</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to remove <span className="font-semibold text-gray-700">{deleteTarget.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

'use client'
/**
 * ClientListingBody
 *
 * Renders all content sections on the public franchise profile page.
 * On mount it merges localStorage overrides so edits appear without redeploy.
 * When the logged-in franchisor owns this listing (or an admin is logged in),
 * a floating "Edit Listing" button opens a comprehensive edit modal.
 */
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  MapPin, Globe, Phone, Mail, Star, TrendingUp, Users, Calendar,
  Crown, ChevronRight, Building2, DollarSign, Percent, BadgeCheck,
  Video, ImageIcon, Pencil, X, Save, Plus, Trash2, Loader2,
} from 'lucide-react'
import { getListingOverrides, saveListing } from '@/lib/store'
import { getSession } from '@/lib/leads'
import ClientLeadSection, { LeadCountBadge } from '@/components/ClientLeadSection'
import type { Franchise } from '@/data/franchises'

const CATEGORIES = [
  'Fast Food','Bar & Grill','Coffee & Café','Specialty Food','Beauty & Salon',
  'Fitness & Wellness','Pet Services','Printing & Signs','Real Estate','Education',
  'Children\'s Services','Senior Care','Cleaning Services','Home Services','Automotive',
  'Financial Services','Technology & IT','Retail','Travel & Hospitality',
  'Sports & Recreation','Health & Medical','Business Services','Staffing & HR',
  'Marketing & Advertising','Food & Beverage','Other',
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} className={`w-5 h-5 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  return null
}

// ── Edit tab types ─────────────────────────────────────────────────────────────
type EditTab = 'basic'|'description'|'media'|'highlights'|'candidate'|'support'|'faq'|'financials'|'contact'

interface EditState {
  name: string
  tagline: string
  category: string
  city: string
  locations: string
  established: string
  franchiseeCount: string
  territory: string
  trainingWeeks: string
  description: string
  longDescription: string
  logoUrl: string
  logoBg: string
  logoInitials: string
  videoUrl: string
  photos: string[]
  highlights: string[]
  idealCandidate: string[]
  supportOffered: string[]
  faqs: Array<{ q: string; a: string }>
  phone: string
  email: string
  website: string
  franchiseFee: string
  royaltyRate: string
  marketingFee: string
  investmentMin: string
  investmentMax: string
  averageUnitVolume: string
  liquidCapitalRequired: string
  netWorthRequired: string
}

function toEditState(f: Franchise): EditState {
  return {
    name: f.name,
    tagline: f.tagline,
    category: f.category,
    city: f.city,
    locations: String(f.locations),
    established: String(f.established),
    franchiseeCount: String(f.franchiseeCount ?? ''),
    territory: f.territory ?? '',
    trainingWeeks: String(f.trainingWeeks),
    description: f.description,
    longDescription: f.longDescription,
    logoUrl: f.logoUrl ?? '',
    logoBg: f.logoBg,
    logoInitials: f.logoInitials,
    videoUrl: f.videoUrl ?? '',
    photos: f.mediaImages ?? [],
    highlights: [...(f.highlights ?? [])],
    idealCandidate: [...(f.idealCandidate ?? [])],
    supportOffered: [...(f.supportOffered ?? [])],
    faqs: [...(f.faqs ?? [])],
    phone: f.phone,
    email: f.email,
    website: f.website,
    franchiseFee: f.financials?.franchiseFee ?? '',
    royaltyRate: f.financials?.royaltyRate ?? '',
    marketingFee: f.financials?.marketingFee ?? '',
    investmentMin: String(f.financials?.investmentMin ?? ''),
    investmentMax: String(f.financials?.investmentMax ?? ''),
    averageUnitVolume: f.financials?.averageUnitVolume ?? '',
    liquidCapitalRequired: f.financials?.liquidCapitalRequired ?? '',
    netWorthRequired: f.financials?.netWorthRequired ?? '',
  }
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ClientListingBody({ seed }: { seed: Franchise }) {
  const [f, setF] = useState<Franchise>(seed)
  const [isOwner, setIsOwner] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<EditTab>('basic')
  const [edit, setEdit] = useState<EditState>(toEditState(seed))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    // Merge stored overrides into displayed data
    const overrides = getListingOverrides()
    const override = overrides[seed.id]
    if (override) {
      const merged = { ...seed, ...override } as Franchise
      setF(merged)
      setEdit(toEditState(merged))
    }
    // Check ownership
    const session = getSession()
    const adminAuth = typeof window !== 'undefined' && localStorage.getItem('fo_admin') === 'authenticated'
    if (adminAuth || (session && session.franchiseId === seed.id)) {
      setIsOwner(true)
    }
  }, [seed.id])

  function openEdit() {
    setEdit(toEditState(f))
    setActiveTab('basic')
    setEditOpen(true)
    setSaved(false)
  }

  function handleSave() {
    setSaving(true)
    const fields: Partial<Franchise> = {
      name: edit.name,
      tagline: edit.tagline,
      category: edit.category as Franchise['category'],
      city: edit.city,
      locations: Number(edit.locations) || f.locations,
      established: Number(edit.established) || f.established,
      franchiseeCount: Number(edit.franchiseeCount) || f.franchiseeCount,
      territory: edit.territory,
      trainingWeeks: Number(edit.trainingWeeks) || f.trainingWeeks,
      description: edit.description,
      longDescription: edit.longDescription,
      logoUrl: edit.logoUrl || undefined,
      logoBg: edit.logoBg,
      logoInitials: edit.logoInitials,
      videoUrl: edit.videoUrl || undefined,
      mediaImages: edit.photos.filter(Boolean),
      highlights: edit.highlights.filter(Boolean),
      idealCandidate: edit.idealCandidate.filter(Boolean),
      supportOffered: edit.supportOffered.filter(Boolean),
      faqs: edit.faqs.filter((faq) => faq.q && faq.a),
      phone: edit.phone,
      email: edit.email,
      website: edit.website,
      financials: {
        ...f.financials,
        franchiseFee: edit.franchiseFee,
        royaltyRate: edit.royaltyRate,
        marketingFee: edit.marketingFee,
        investmentMin: Number(edit.investmentMin) || f.financials?.investmentMin || 0,
        investmentMax: Number(edit.investmentMax) || f.financials?.investmentMax || 0,
        averageUnitVolume: edit.averageUnitVolume,
        liquidCapitalRequired: edit.liquidCapitalRequired,
        netWorthRequired: edit.netWorthRequired,
      },
    }
    saveListing(seed.id, fields)
    const merged = { ...f, ...fields } as Franchise
    setF(merged)
    setLogoError(false)
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setEditOpen(false); setSaved(false) }, 900)
  }

  function setField(key: keyof EditState, value: unknown) {
    setEdit((prev) => ({ ...prev, [key]: value }))
  }

  function setListItem(key: 'highlights'|'idealCandidate'|'supportOffered', idx: number, value: string) {
    setEdit((prev) => {
      const arr = [...prev[key]]
      arr[idx] = value
      return { ...prev, [key]: arr }
    })
  }
  function addListItem(key: 'highlights'|'idealCandidate'|'supportOffered') {
    setEdit((prev) => ({ ...prev, [key]: [...prev[key], ''] }))
  }
  function removeListItem(key: 'highlights'|'idealCandidate'|'supportOffered', idx: number) {
    setEdit((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }))
  }

  // ── Logo display ─────────────────────────────────────────────────────────────
  const logoEl = (f.logoUrl && !logoError) ? (
    <img src={f.logoUrl} alt="Franchise logo" className="w-24 h-24 rounded-2xl object-contain shadow-md shrink-0 border border-gray-100 bg-white p-1" onError={() => setLogoError(true)} />
  ) : (
    <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md shrink-0 border border-gray-100" style={{ background: f.logoBg, color: f.logoColor }}>
      {f.logoInitials}
    </div>
  )

  // ── Video/photo media ─────────────────────────────────────────────────────────
  const embedUrl = f.videoUrl ? toEmbedUrl(f.videoUrl) : null
  const hasMedia = (f.mediaImages?.length ?? 0) > 0 || !!f.videoUrl

  // ── Tab labels ────────────────────────────────────────────────────────────────
  const TABS: { id: EditTab; label: string }[] = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'description', label: 'Description' },
    { id: 'media', label: 'Logo & Media' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'candidate', label: 'Ideal Candidate' },
    { id: 'support', label: 'Training & Support' },
    { id: 'faq', label: 'FAQs' },
    { id: 'financials', label: 'Financials' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/directory" className="hover:text-red-600 transition-colors">Directory</Link>
            <ChevronRight size={14} />
            <span className="text-gray-700 font-medium">{f.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-7">
            {/* Logo */}
            <div className="relative shrink-0">
              {logoEl}
              {isOwner && (
                <button onClick={openEdit} className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors" title="Edit logo">
                  <Pencil size={11} className="text-white" />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {f.isVIP && <span className="vip-badge inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"><Crown size={10} /> VIP Enterprise</span>}
                {f.sourced && (
                  <a href={f.sourceListingUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full hover:bg-blue-200 transition-colors">
                    Sourced · {f.sourceSite}
                  </a>
                )}
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">{f.category}</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">Est. {f.established}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{f.name}</h1>
              <p className="text-gray-400 text-base italic mb-2">&ldquo;{f.tagline}&rdquo;</p>
              <LeadCountBadge franchiseId={seed.id} />
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <StarRating rating={f.rating} />
                  <span className="text-gray-900 font-semibold text-sm">{f.rating}</span>
                  <span className="text-gray-400 text-sm">({f.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm"><MapPin size={13} className="text-red-500" />{f.locations}+ Locations</div>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm"><Building2 size={13} className="text-gray-400" />{f.parent}</div>
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
              {isOwner && (
                <button onClick={openEdit} className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all w-full">
                  <Pencil size={14} /> Edit This Listing
                </button>
              )}
              <ClientLeadSection franchiseId={seed.id} franchiseName={f.name} />
              <a href={f.website} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm text-center transition-all">
                Visit Website
              </a>
              {f.sourced && (
                <Link href={`/claim/${seed.id}`} className="bg-blue-50 border border-blue-200 hover:border-blue-400 text-blue-700 px-6 py-2.5 rounded-xl font-semibold text-sm text-center transition-all flex items-center justify-center gap-1.5">
                  <BadgeCheck size={14} /> Claim this Listing
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sourced disclaimer ────────────────────────────────────────────────── */}
      {f.sourced && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-amber-800">
            <p className="font-bold mb-1">⚠ Legal Notice — Third-Party Sourced Listing</p>
            <p className="leading-relaxed">
              This listing was compiled by automated means from publicly available information published on{' '}
              <a href={f.sourceListingUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">{f.sourceSite}</a>.
              {' '}It has <strong>not</strong> been submitted, reviewed, or verified by the franchisor.
              All information — including fees, investment ranges, unit counts, and financial data — must be independently verified.{' '}
              <strong>FranchiseOntario.com expressly disclaims all liability for inaccuracies.</strong>{' '}
              Is this your franchise?{' '}<Link href={`/claim/${seed.id}`} className="font-bold underline">Claim this listing</Link>.
            </p>
          </div>
        </div>
      )}
      {!f.sourced && (
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="font-semibold shrink-0">ℹ Information Notice:</span>
            <span>Information provided directly by the franchisor, who is solely responsible for its accuracy. Always request a Franchise Disclosure Document (FDD) before any investment decision.</span>
          </div>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-7">

            {/* About */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-red-600 inline-block" />
                  About {f.name}
                </h2>
                {isOwner && <button onClick={() => { openEdit(); setActiveTab('description') }} className="text-gray-400 hover:text-red-600 transition-colors"><Pencil size={15} /></button>}
              </div>
              {f.longDescription.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
              ))}
            </section>

            {/* Media */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-amber-500 inline-block" />
                  Photos &amp; Videos
                </h2>
                {isOwner && <button onClick={() => { openEdit(); setActiveTab('media') }} className="text-gray-400 hover:text-red-600 transition-colors"><Pencil size={15} /></button>}
              </div>
              {!hasMedia && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400">
                  <ImageIcon size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No media uploaded yet</p>
                  {isOwner && <p className="text-xs mt-1">Click the pencil icon above to add photos and video.</p>}
                </div>
              )}
              {embedUrl && (
                <div className="rounded-xl overflow-hidden aspect-video mb-4 bg-gray-900">
                  <iframe src={embedUrl} title="Franchise video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                </div>
              )}
              {f.videoUrl && !embedUrl && (
                <a href={f.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mb-4 text-sm text-blue-600 hover:underline">
                  <Video size={15} /> Watch brand video →
                </a>
              )}
              {(f.mediaImages?.length ?? 0) > 0 && (
                <div className={`grid gap-3 ${(f.mediaImages?.length ?? 0) === 1 ? 'grid-cols-1' : (f.mediaImages?.length ?? 0) === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {(f.mediaImages ?? []).map((src, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <img src={src} alt={`Gallery photo ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Highlights */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-green-500 inline-block" />
                  Franchise Highlights
                </h2>
                {isOwner && <button onClick={() => { openEdit(); setActiveTab('highlights') }} className="text-gray-400 hover:text-red-600 transition-colors"><Pencil size={15} /></button>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(f.highlights ?? []).map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-xs font-bold">✓</span></span>
                    <span className="text-sm text-gray-700 font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Ideal Candidate */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-blue-500 inline-block" />
                  Ideal Franchisee Profile
                </h2>
                {isOwner && <button onClick={() => { openEdit(); setActiveTab('candidate') }} className="text-gray-400 hover:text-red-600 transition-colors"><Pencil size={15} /></button>}
              </div>
              <ul className="space-y-3">
                {(f.idealCandidate ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-blue-600 font-black text-xs">{i + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Training & Support */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-purple-500 inline-block" />
                  Training &amp; Support
                </h2>
                {isOwner && <button onClick={() => { openEdit(); setActiveTab('support') }} className="text-gray-400 hover:text-red-600 transition-colors"><Pencil size={15} /></button>}
              </div>
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl p-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar size={22} className="text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{f.trainingWeeks}-Week Training Program</div>
                  <div className="text-xs text-gray-500">Comprehensive onboarding before your doors open</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(f.supportOffered ?? []).map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <BadgeCheck size={15} className="text-purple-500 shrink-0" />{s}
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            {(f.faqs?.length ?? 0) > 0 && (
              <section className="bg-white rounded-2xl border border-gray-200 p-7">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full bg-orange-500 inline-block" />
                    Frequently Asked Questions
                  </h2>
                  {isOwner && <button onClick={() => { openEdit(); setActiveTab('faq') }} className="text-gray-400 hover:text-red-600 transition-colors"><Pencil size={15} /></button>}
                </div>
                <div className="space-y-3">
                  {(f.faqs ?? []).map((faq, i) => (
                    <details key={i} className="group border border-gray-200 rounded-xl">
                      <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer font-semibold text-sm text-gray-900 hover:text-red-600 transition-colors">
                        {faq.q}
                        <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg shrink-0 ml-2">▾</span>
                      </summary>
                      <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-5">

            {/* Investment Summary */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-amber-600" />
                  <h3 className="font-black text-gray-900 text-base">Investment Summary</h3>
                </div>
                {isOwner && <button onClick={() => { openEdit(); setActiveTab('financials') }} className="text-gray-400 hover:text-red-600 transition-colors"><Pencil size={15} /></button>}
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Initial Franchise Fee', value: f.financials?.franchiseFee },
                  { label: 'Royalty Fee', value: f.financials?.royaltyRate ? `${f.financials.royaltyRate} of gross sales` : '—' },
                  { label: 'Marketing Fund', value: f.financials?.marketingFee ? `${f.financials.marketingFee} of gross sales` : '—' },
                  { label: 'Avg. Unit Volume', value: f.financials?.averageUnitVolume, className: 'text-green-600' },
                  { label: 'Liquid Capital Required', value: f.financials?.liquidCapitalRequired },
                  { label: 'Net Worth Required', value: f.financials?.netWorthRequired },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-500">{row.label}</span>
                    <span className={`font-bold text-gray-900 ${row.className ?? ''}`}>{row.value ?? '—'}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-sm text-gray-500">Total Investment Range</span>
                  <span className="font-bold text-gray-900">
                    ${((f.financials?.investmentMin ?? 0) / 1000).toFixed(0)}K – ${((f.financials?.investmentMax ?? 0) / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>

            {/* Franchise Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-gray-900 text-base">Franchise Stats</h3>
                {isOwner && <button onClick={() => { openEdit(); setActiveTab('basic') }} className="text-gray-400 hover:text-red-600 transition-colors"><Pencil size={15} /></button>}
              </div>
              <div className="space-y-3">
                {[
                  { icon: <Building2 size={15} className="text-red-500" />, label: 'Locations', value: `${f.locations}+` },
                  { icon: <Users size={15} className="text-blue-500" />, label: 'Active Franchisees', value: f.franchiseeCount },
                  { icon: <Calendar size={15} className="text-green-500" />, label: 'Years in Business', value: `${2026 - f.established} years` },
                  { icon: <TrendingUp size={15} className="text-amber-500" />, label: 'Training Duration', value: `${f.trainingWeeks} weeks` },
                  { icon: <MapPin size={15} className="text-purple-500" />, label: 'Territory', value: 'Protected' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2 text-sm text-gray-500">{stat.icon}{stat.label}</div>
                    <span className="font-semibold text-gray-900 text-sm">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-black text-base text-white">Ready to Learn More?</h3>
                {isOwner && <button onClick={() => { openEdit(); setActiveTab('contact') }} className="text-red-200 hover:text-white transition-colors"><Pencil size={15} /></button>}
              </div>
              <p className="text-red-100 text-xs mb-4 leading-relaxed">Request the official franchise information package directly from {f.name}.</p>
              <div className="space-y-2.5 mb-4">
                <a href={`mailto:${f.email}`} className="flex items-center gap-2 text-sm text-red-100 hover:text-white transition-colors"><Mail size={14} />{f.email}</a>
                <a href={`tel:${f.phone}`} className="flex items-center gap-2 text-sm text-red-100 hover:text-white transition-colors"><Phone size={14} />{f.phone}</a>
                <a href={f.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-red-100 hover:text-white transition-colors"><Globe size={14} />{f.website.replace('https://', '')}</a>
              </div>
              <ClientLeadSection franchiseId={seed.id} franchiseName={f.name} />
            </div>

            {/* Arthur Wishart */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-base">⚖️</span>
                <h4 className="font-bold text-amber-900 text-xs">Arthur Wishart Act Protection</h4>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed mb-2">As an Ontario franchise buyer, you are protected by the <strong>Arthur Wishart Act (Franchise Disclosure), 2000</strong>. Franchisors must provide a complete FDD at least <strong>14 days</strong> before signing any agreement or paying any money.</p>
              <a href="/resources#arthur-wishart" className="text-[11px] text-amber-700 hover:underline font-medium">Learn about your legal rights →</a>
            </div>

            {/* Compare */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">Want to compare this brand to others?</p>
              <a href={`/compare?ids=${seed.id}`} className="block text-center border-2 border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-600 font-semibold text-sm py-2 rounded-xl transition-all">Compare Franchises →</a>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2.5">
              <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Legal Disclaimer</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">All financial figures are estimates. Actual investment costs, royalties, and revenues will vary. Past performance does not guarantee future results.</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">FranchiseOntario.com is an independent directory and is not affiliated with any franchisor listed on this site.</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {f.sourced ? 'This listing was aggregated from third-party public sources. Use this information at your own risk.' : 'The accuracy of information is the responsibility of the franchisor who submitted it.'}
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed">Always review the official FDD and consult a qualified franchise lawyer. <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a> · <a href="/terms" className="underline hover:text-gray-600">Terms</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-lg">Edit Listing — {seed.name}</h2>
              <button onClick={() => setEditOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} className="text-gray-500" /></button>
            </div>

            {/* Tab bar */}
            <div className="flex overflow-x-auto border-b border-gray-100 px-4">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6 space-y-4 min-h-[320px]">

              {activeTab === 'basic' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Franchise Name</label>
                      <input type="text" value={edit.name} onChange={(e) => setField('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Tagline</label>
                      <input type="text" value={edit.tagline} onChange={(e) => setField('tagline', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                      <select value={edit.category} onChange={(e) => setField('category', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 bg-white">
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">City / Region</label>
                      <input type="text" value={edit.city} onChange={(e) => setField('city', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Locations (count)</label>
                      <input type="number" value={edit.locations} onChange={(e) => setField('locations', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Year Established</label>
                      <input type="number" value={edit.established} onChange={(e) => setField('established', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Active Franchisees</label>
                      <input type="number" value={edit.franchiseeCount} onChange={(e) => setField('franchiseeCount', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Training Weeks</label>
                      <input type="number" value={edit.trainingWeeks} onChange={(e) => setField('trainingWeeks', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Territory Description</label>
                      <input type="text" value={edit.territory} onChange={(e) => setField('territory', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'description' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Short Description (directory card)</label>
                    <textarea rows={3} value={edit.description} onChange={(e) => setField('description', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Description (listing page — use blank lines between paragraphs)</label>
                    <textarea rows={10} value={edit.longDescription} onChange={(e) => setField('longDescription', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-y" />
                  </div>
                </>
              )}

              {activeTab === 'media' && (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Logo URL</label>
                      <input type="url" value={edit.logoUrl} onChange={(e) => setField('logoUrl', e.target.value)} placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Logo Background Colour</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={edit.logoBg} onChange={(e) => setField('logoBg', e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                        <input type="text" value={edit.logoBg} onChange={(e) => setField('logoBg', e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Logo Initials (fallback)</label>
                      <input type="text" value={edit.logoInitials} onChange={(e) => setField('logoInitials', e.target.value)} maxLength={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Video URL (YouTube or Vimeo)</label>
                    <input type="url" value={edit.videoUrl} onChange={(e) => setField('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-600">Photo Gallery (image URLs)</label>
                      <button type="button" onClick={() => setField('photos', [...edit.photos, ''])} className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"><Plus size={12} /> Add Photo</button>
                    </div>
                    <div className="space-y-2">
                      {edit.photos.map((url, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="url" value={url} onChange={(e) => { const p = [...edit.photos]; p[i] = e.target.value; setField('photos', p) }} placeholder="https://..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                          <button type="button" onClick={() => setField('photos', edit.photos.filter((_, j) => j !== i))} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      ))}
                      {edit.photos.length === 0 && <p className="text-xs text-gray-400">No photos yet. Click &quot;Add Photo&quot; to add image URLs.</p>}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'highlights' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500">Key selling points shown on your listing page.</p>
                    <button type="button" onClick={() => addListItem('highlights')} className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"><Plus size={12} /> Add</button>
                  </div>
                  <div className="space-y-2">
                    {edit.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={h} onChange={(e) => setListItem('highlights', i, e.target.value)} placeholder="e.g. 110+ Ontario locations and growing" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                        <button type="button" onClick={() => removeListItem('highlights', i)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'candidate' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500">Describe your ideal franchisee candidate.</p>
                    <button type="button" onClick={() => addListItem('idealCandidate')} className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"><Plus size={12} /> Add</button>
                  </div>
                  <div className="space-y-2">
                    {edit.idealCandidate.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={item} onChange={(e) => setListItem('idealCandidate', i, e.target.value)} placeholder="e.g. Proven hospitality or food service background" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                        <button type="button" onClick={() => removeListItem('idealCandidate', i)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'support' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-gray-600">Support Items Offered</label>
                    <button type="button" onClick={() => addListItem('supportOffered')} className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"><Plus size={12} /> Add</button>
                  </div>
                  <div className="space-y-2">
                    {edit.supportOffered.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input type="text" value={s} onChange={(e) => setListItem('supportOffered', i, e.target.value)} placeholder="e.g. Site selection & lease negotiation" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                        <button type="button" onClick={() => removeListItem('supportOffered', i)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500">Common questions answered on your listing page.</p>
                    <button type="button" onClick={() => setEdit((prev) => ({ ...prev, faqs: [...prev.faqs, { q: '', a: '' }] }))} className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"><Plus size={12} /> Add FAQ</button>
                  </div>
                  <div className="space-y-4">
                    {edit.faqs.map((faq, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500">FAQ #{i + 1}</span>
                          <button type="button" onClick={() => setEdit((prev) => ({ ...prev, faqs: prev.faqs.filter((_, j) => j !== i) }))} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                        </div>
                        <input type="text" value={faq.q} onChange={(e) => { const faqs = [...edit.faqs]; faqs[i] = { ...faqs[i], q: e.target.value }; setField('faqs', faqs) }} placeholder="Question" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                        <textarea rows={2} value={faq.a} onChange={(e) => { const faqs = [...edit.faqs]; faqs[i] = { ...faqs[i], a: e.target.value }; setField('faqs', faqs) }} placeholder="Answer" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none" />
                      </div>
                    ))}
                    {edit.faqs.length === 0 && <p className="text-xs text-gray-400 text-center py-6">No FAQs yet. Click &quot;Add FAQ&quot; to create your first one.</p>}
                  </div>
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Franchise Fee (e.g. $35,000)', field: 'franchiseFee' as const },
                    { label: 'Royalty Rate (e.g. 5%)', field: 'royaltyRate' as const },
                    { label: 'Marketing Fee (e.g. 2%)', field: 'marketingFee' as const },
                    { label: 'Avg. Unit Volume (e.g. $1.2M)', field: 'averageUnitVolume' as const },
                    { label: 'Liquid Capital Required (e.g. $150,000)', field: 'liquidCapitalRequired' as const },
                    { label: 'Net Worth Required (e.g. $300,000)', field: 'netWorthRequired' as const },
                  ].map(({ label, field }) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                      <input type="text" value={edit[field]} onChange={(e) => setField(field, e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Min Total Investment ($)</label>
                    <input type="number" value={edit.investmentMin} onChange={(e) => setField('investmentMin', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Max Total Investment ($)</label>
                    <input type="number" value={edit.investmentMax} onChange={(e) => setField('investmentMax', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                    <input type="tel" value={edit.phone} onChange={(e) => setField('phone', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                    <input type="email" value={edit.email} onChange={(e) => setField('email', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Website URL</label>
                    <input type="url" value={edit.website} onChange={(e) => setField('website', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-gray-400">Changes save to your listing immediately.</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-colors disabled:opacity-70"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : saved ? '✓ Saved!' : <><Save size={14} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

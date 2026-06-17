'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, BookOpen, Clock, FileText, Download, Lock,
  ChevronRight, ChevronLeft, Printer, ChevronDown,
} from 'lucide-react'
import { MANUALS } from '@/data/manuals/index'
import { getSession } from '@/lib/leads'

export default function ManualPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isPrint = searchParams.get('print') === '1'

  const manual = MANUALS.find((m) => m.slug === params.slug)
  const session = typeof window !== 'undefined' ? getSession() : null
  const tier = session?.tier ?? null
  const isPaid = tier === 'premium' || tier === 'enterprise'
  const [activeSection, setActiveSection] = useState(0)
  const [tocOpen, setTocOpen] = useState(false)

  const prevManual = MANUALS.find((m) => m.id === (manual?.id ?? 0) - 1)
  const nextManual = MANUALS.find((m) => m.id === (manual?.id ?? 0) + 1)

  useEffect(() => {
    if (isPrint) {
      setTimeout(() => window.print(), 600)
    }
  }, [isPrint])

  if (!manual) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <div className="text-center">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Manual not found</p>
          <Link href="/manuals" className="text-sm text-blue-600 mt-2 inline-block hover:underline">Back to library</Link>
        </div>
      </div>
    )
  }

  const canRead = manual.access === 'free' ? !!session : isPaid
  const isLocked = !canRead

  function handlePrint() {
    if (!manual) return
    window.open(`/manuals/${manual.slug}?print=1`, '_blank')
  }

  // ── Print layout ───────────────────────────────────────────────────────────
  if (isPrint) {
    return (
      <div className="print-manual max-w-3xl mx-auto px-8 py-12 font-serif">
        <style>{`
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
          .print-manual h1 { font-size: 2rem; font-weight: 900; color: #00228e; margin-bottom: 0.5rem; }
          .print-manual h2 { font-size: 1rem; color: #6b7280; margin-bottom: 2rem; font-weight: 400; font-style: italic; }
          .print-manual .section-heading { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 2rem 0 0.75rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
          .print-manual p { line-height: 1.8; color: #374151; margin-bottom: 1rem; font-size: 0.95rem; }
          .print-manual .cover { border-bottom: 3px solid #00228e; padding-bottom: 2rem; margin-bottom: 2rem; }
          .print-manual .meta { display: flex; gap: 1.5rem; font-size: 0.8rem; color: #6b7280; margin-top: 1rem; }
          .print-manual .footer { margin-top: 4rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; font-size: 0.75rem; color: #9ca3af; display: flex; justify-content: space-between; }
        `}</style>
        <div className="cover">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{manual.icon}</div>
          <h1>{manual.title}</h1>
          <h2>{manual.subtitle}</h2>
          <p style={{ color: '#374151', fontStyle: 'normal', fontFamily: 'sans-serif', fontSize: '0.875rem' }}>{manual.description}</p>
          <div className="meta">
            <span>Manual #{manual.id}</span>
            <span>{manual.readTime} min read</span>
            <span>{manual.pages} pages</span>
            <span>Updated {manual.updated}</span>
          </div>
        </div>
        {manual.sections.map((section, i) => (
          <div key={i}>
            <div className="section-heading">{section.heading}</div>
            {section.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
          </div>
        ))}
        <div className="footer">
          <span>FranchiseOntario.com — Franchise Owner Resource Library</span>
          <span>franchiseontario.com/manuals</span>
        </div>
      </div>
    )
  }

  // ── Locked state ───────────────────────────────────────────────────────────
  if (isLocked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Link href="/manuals" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8">
            <ArrowLeft size={14} /> Back to Library
          </Link>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#00228e] p-8 text-white">
              <div className="text-5xl mb-3">{manual.icon}</div>
              <div className="text-xs font-bold text-blue-300 mb-1">Manual #{manual.id} · {manual.category}</div>
              <h1 className="text-2xl font-black mb-1">{manual.title}</h1>
              <p className="text-blue-200 text-sm">{manual.subtitle}</p>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">
                {session ? 'Upgrade to Access This Manual' : 'Register to Access This Manual'}
              </h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                {session
                  ? 'This manual is included with Premium and Enterprise membership. Upgrade to unlock all 30 manuals instantly.'
                  : 'Create a free account to access 2 manuals. Upgrade to Premium to unlock all 30.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!session && (
                  <Link href="/register"
                    className="bg-[#00228e] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-900 transition-colors">
                    Register Free — Get 2 Manuals
                  </Link>
                )}
                <Link href="/pricing"
                  className={`font-bold px-6 py-3 rounded-xl transition-colors ${session ? 'bg-[#00228e] text-white hover:bg-blue-900' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                  {session ? 'Upgrade to Premium →' : 'See All Plans'}
                </Link>
              </div>
              {/* Preview — first section teaser */}
              <div className="mt-8 text-left bg-gray-50 rounded-2xl p-6 relative overflow-hidden">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Preview</p>
                <h3 className="font-bold text-gray-900 mb-2">{manual.sections[0]?.heading}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{manual.sections[0]?.paragraphs[0]}</p>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Full reader ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/manuals" className="shrink-0 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft size={14} /> Library
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-900 truncate">{manual.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />{manual.readTime} min
            </span>
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
              <Download size={12} /> <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8 w-full flex-1">
        {/* Sidebar TOC — desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="text-3xl mb-3">{manual.icon}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Manual #{manual.id}</div>
              <h2 className="font-black text-gray-900 text-sm leading-snug mb-3">{manual.title}</h2>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Clock size={10} />{manual.readTime} min</span>
                <span className="flex items-center gap-1"><FileText size={10} />{manual.pages} pg</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Contents</p>
              <nav className="space-y-1">
                {manual.sections.map((s, i) => (
                  <button key={i} onClick={() => setActiveSection(i)}
                    className={`w-full text-left text-xs px-2.5 py-2 rounded-lg transition-all leading-snug ${activeSection === i ? 'bg-[#00228e] text-white font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                    {s.heading}
                  </button>
                ))}
              </nav>
            </div>

            {/* Prev/Next */}
            <div className="mt-4 space-y-2">
              {prevManual && (
                <Link href={`/manuals/${prevManual.slug}`}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2.5 transition-colors">
                  <ChevronLeft size={13} />
                  <span className="truncate">{prevManual.title}</span>
                </Link>
              )}
              {nextManual && (
                <Link href={`/manuals/${nextManual.slug}`}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2.5 transition-colors">
                  <span className="truncate">{nextManual.title}</span>
                  <ChevronRight size={13} className="shrink-0" />
                </Link>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile TOC toggle */}
          <div className="lg:hidden mb-4">
            <button onClick={() => setTocOpen(!tocOpen)}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700">
              <span className="flex items-center gap-2"><BookOpen size={14} /> Table of Contents</span>
              <ChevronDown size={14} className={`transition-transform ${tocOpen ? 'rotate-180' : ''}`} />
            </button>
            {tocOpen && (
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl px-4 pb-4 space-y-1">
                {manual.sections.map((s, i) => (
                  <button key={i} onClick={() => { setActiveSection(i); setTocOpen(false) }}
                    className={`w-full text-left text-sm px-2 py-2 rounded-lg transition-all ${activeSection === i ? 'bg-[#00228e] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {s.heading}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual header */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 mb-6">
            <span className="text-5xl mb-4 block">{manual.icon}</span>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Manual #{manual.id}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs font-semibold text-[#00228e]">{manual.category}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{manual.title}</h1>
            <p className="text-gray-500 text-base mb-4">{manual.subtitle}</p>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{manual.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-100">
              <span className="flex items-center gap-1"><Clock size={11} />{manual.readTime} min read</span>
              <span className="flex items-center gap-1"><FileText size={11} />{manual.pages} pages</span>
              <span>Updated {manual.updated}</span>
            </div>
          </div>

          {/* Section reader */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Section tabs */}
            <div className="border-b border-gray-100 px-6 pt-5 pb-0 flex gap-1 overflow-x-auto">
              {manual.sections.map((s, i) => (
                <button key={i} onClick={() => setActiveSection(i)}
                  className={`text-xs font-semibold px-3 py-2 rounded-t-lg border-b-2 whitespace-nowrap transition-all -mb-px ${activeSection === i ? 'border-[#00228e] text-[#00228e] bg-blue-50/50' : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'}`}>
                  {i + 1}. {s.heading.length > 28 ? s.heading.slice(0, 28) + '…' : s.heading}
                </button>
              ))}
            </div>

            {/* Active section content */}
            <div className="p-7">
              <h2 className="text-xl font-black text-gray-900 mb-5 pb-4 border-b border-gray-100">
                {manual.sections[activeSection]?.heading}
              </h2>
              <div className="prose-content space-y-4">
                {manual.sections[activeSection]?.paragraphs.map((para, i) => (
                  <p key={i} className="text-gray-700 leading-8 text-[0.95rem]">{para}</p>
                ))}
              </div>

              {/* Section nav */}
              <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
                  disabled={activeSection === 0}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft size={14} /> Previous
                </button>
                <span className="text-xs text-gray-400">{activeSection + 1} of {manual.sections.length}</span>
                <button
                  onClick={() => setActiveSection((s) => Math.min(manual.sections.length - 1, s + 1))}
                  disabled={activeSection === manual.sections.length - 1}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Download CTA */}
          <div className="mt-5 bg-gray-900 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-sm">Download this manual as PDF</p>
              <p className="text-gray-400 text-xs mt-0.5">Save for offline reading or share with your team.</p>
            </div>
            <button onClick={handlePrint}
              className="flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Download size={14} /> Download PDF
            </button>
          </div>

          {/* Next manual */}
          {nextManual && (
            <div className="mt-4">
              <Link href={`/manuals/${nextManual.slug}`}
                className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl p-4 hover:border-blue-300 transition-all group">
                <div>
                  <p className="text-xs text-blue-500 font-semibold mb-0.5">Up Next</p>
                  <p className="font-bold text-gray-900 text-sm">{nextManual.title}</p>
                </div>
                <ChevronRight size={18} className="text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

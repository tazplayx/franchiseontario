import Link from 'next/link'
import { Search, MapPin, Sparkles, ArrowRight, Home, LayoutGrid } from 'lucide-react'
import { getTopRanked } from '@/data/franchises'

const featuredFranchises = getTopRanked(4)

const quickLinks = [
  { href: '/directory',  label: 'Browse All Franchises', icon: <LayoutGrid size={15} /> },
  { href: '/categories', label: 'Browse Categories',     icon: <Search size={15} /> },
  { href: '/ontario',    label: 'Ontario Cities',        icon: <MapPin size={15} /> },
  { href: '/quiz',       label: 'Franchise Fit Quiz',    icon: <Sparkles size={15} /> },
]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top accent */}
      <div className="h-1 w-full" style={{ background: 'var(--rust)' }} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* 404 number */}
        <div
          className="text-[9rem] sm:text-[12rem] font-black leading-none mb-2 select-none"
          style={{
            fontFamily: 'Bricolage Grotesque, system-ui, sans-serif',
            background: 'linear-gradient(135deg, var(--rust) 0%, var(--rust-deep) 60%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.05em',
          }}
        >
          404
        </div>

        <h1
          className="text-2xl md:text-3xl font-black text-center mb-3"
          style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
        >
          This page doesn&apos;t exist
        </h1>
        <p className="text-sm text-center max-w-sm mb-10" style={{ color: 'var(--text-muted)' }}>
          The franchise listing or page you&apos;re looking for may have moved or been removed. Let&apos;s find you something better.
        </p>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14 w-full max-w-2xl">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all hover:-translate-y-1 hover:shadow-md group"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}
            >
              <span style={{ color: 'var(--rust)' }}>{link.icon}</span>
              <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-secondary)' }}>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Featured franchises */}
        <div className="w-full max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-center mb-4" style={{ color: 'var(--text-muted)' }}>
            Top Franchises in Ontario
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featuredFranchises.map((f) => (
              <Link
                key={f.id}
                href={`/directory/${f.id}`}
                className="group bg-white rounded-2xl border p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ borderColor: 'var(--border)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center text-xs font-black"
                  style={{ background: f.logoBg, color: f.logoColor }}
                >
                  {f.logoInitials}
                </div>
                <p className="text-[11px] font-semibold leading-tight line-clamp-2 group-hover:text-red-600 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {f.name}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.category}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Back home */}
        <div className="mt-12 flex items-center gap-4">
          <Link
            href="/"
            className="btn-red px-6 py-2.5 text-sm inline-flex items-center gap-2"
          >
            <Home size={14} /> Back to Homepage
          </Link>
          <Link
            href="/directory"
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: 'var(--rust)' }}
          >
            Browse Directory <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}

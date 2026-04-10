'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  Menu, X, MapPin, Sparkles, LayoutDashboard, LogOut,
  Users, CreditCard, LifeBuoy, FileText, ChevronDown,
  Shield, ListChecks, Ticket, Building2, BarChart3, UserCog,
} from 'lucide-react'
import { getSession, clearSession, type FranchisorSession } from '@/lib/leads'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [realSession, setRealSession] = useState<FranchisorSession | null>(null)
  const [demoLoggedIn, setDemoLoggedIn] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => {
      const session = getSession()
      const isAdmin = localStorage.getItem('fo_admin') === 'authenticated'
      const isDemo = !session && !isAdmin && localStorage.getItem('fo_user') === 'authenticated'
      setRealSession(session)
      setAdminLoggedIn(isAdmin)
      setDemoLoggedIn(isDemo)
    }
    check()
    window.addEventListener('focus', check)
    window.addEventListener('storage', check)
    return () => {
      window.removeEventListener('focus', check)
      window.removeEventListener('storage', check)
    }
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = () => {
    clearSession()
    localStorage.removeItem('fo_user')
    localStorage.removeItem('fo_admin')
    setRealSession(null)
    setDemoLoggedIn(false)
    setAdminLoggedIn(false)
    setDropdownOpen(false)
    window.location.href = '/'
  }

  const isLoggedIn = !!realSession || demoLoggedIn || adminLoggedIn
  const displayName = realSession?.name ?? null

  const franchisorItems = [
    { label: 'My Leads', href: '/dashboard?tab=leads', icon: <Users size={13} /> },
    { label: 'My Listing', href: '/dashboard?tab=listing', icon: <FileText size={13} /> },
    { label: 'Billing', href: '/dashboard?tab=billing', icon: <CreditCard size={13} /> },
    { label: 'Support', href: '/dashboard?tab=support', icon: <LifeBuoy size={13} /> },
  ]

  const adminItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={13} /> },
    { label: 'Listings', href: '/admin/listings', icon: <ListChecks size={13} /> },
    { label: 'Franchise Requests', href: '/admin/franchises', icon: <Building2 size={13} /> },
    { label: 'Users', href: '/admin/users', icon: <UserCog size={13} /> },
    { label: 'Support Tickets', href: '/admin/tickets', icon: <Ticket size={13} /> },
    { label: 'SEO', href: '/admin/seo', icon: <BarChart3 size={13} /> },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/96 backdrop-blur-sm border-b shadow-sm" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="FranchiseOntario — Canada's Franchise Hub"
              className="w-[250px] h-auto max-h-12 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {[
              { href: '/', label: 'Home' },
              { href: '/directory', label: 'Directory' },
              { href: '/categories', label: 'Categories' },
              { href: '/news', label: 'News', dot: true },
              { href: '/resources', label: 'Resources' },
              { href: '/faq', label: 'FAQ' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-[13px] font-semibold rounded-full transition-all tracking-wide flex items-center gap-1.5"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.background = 'var(--cream)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--rust)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.background = ''
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                }}
              >
                {item.label}
                {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
              </Link>
            ))}
            <Link
              href="/ontario"
              className="px-4 py-2 text-[13px] font-semibold rounded-full transition-all tracking-wide flex items-center gap-1.5"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'var(--cream)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--rust)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.background = ''
                ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
              }}
            >
              <MapPin size={12} style={{ color: 'var(--rust)' }} /> Ontario
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {adminLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-full border transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: 'var(--rust-deep)' }}>
                    <Shield size={11} />
                  </div>
                  <span className="max-w-[120px] truncate">Admin</span>
                  <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl border shadow-lg py-1.5 z-50" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'var(--border-light)' }}>
                      <p className="text-xs font-bold text-black">Administrator</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>FranchiseOntario.com</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase" style={{ background: 'var(--rust-deep)' }}>Admin</span>
                    </div>
                    {adminItems.map((item) => (
                      <Link key={item.label} href={item.href} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-orange-50"
                        style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1" style={{ borderColor: 'var(--border-light)' }}>
                      <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-red-50" style={{ color: 'var(--rust)' }}>
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : realSession ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-full border transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: 'var(--rust)' }}>
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl border shadow-lg py-1.5 z-50" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'var(--border-light)' }}>
                      <p className="text-xs font-bold text-black truncate">{displayName}</p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{realSession.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ background: '#fdeee7', color: 'var(--rust)' }}>{realSession.tier}</span>
                    </div>
                    {franchisorItems.map((item) => (
                      <Link key={item.label} href={item.href} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-orange-50"
                        style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1" style={{ borderColor: 'var(--border-light)' }}>
                      {realSession.franchiseId && (
                        <Link href={`/directory/${realSession.franchiseId}`} onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-orange-50"
                          style={{ color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--text-muted)' }}><FileText size={13} /></span>
                          View My Listing
                        </Link>
                      )}
                      <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-red-50" style={{ color: 'var(--rust)' }}>
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : demoLoggedIn ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all" style={{ color: 'var(--text-secondary)' }}>
                  <LayoutDashboard size={14} style={{ color: 'var(--rust)' }} />
                  My Dashboard
                </Link>
                <button onClick={handleSignOut} className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all" style={{ color: 'var(--text-muted)' }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <Link href="/dashboard" className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all" style={{ color: 'var(--text-secondary)' }}>
                <LayoutDashboard size={14} style={{ color: 'var(--text-muted)' }} />
                Franchisor Login
              </Link>
            )}

            <Link href="/quiz" className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all border" style={{ background: 'var(--cream)', color: 'var(--rust-dark)', borderColor: '#e5c185' }}>
              <Sparkles size={13} style={{ color: 'var(--gold-dark, #c8a06a)' }} />
              Fit Quiz
            </Link>
            <Link href="/register" className="btn-red px-5 py-2.5 text-[13px]">
              List Your Franchise
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 rounded-full transition-colors" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t px-6 pb-6 pt-3 space-y-1" style={{ borderColor: 'var(--border)' }}>
          {[
            { href: '/', label: 'Home' },
            { href: '/directory', label: 'Directory' },
            { href: '/ontario', label: '🍁 Ontario Cities' },
            { href: '/categories', label: 'Categories' },
            { href: '/news', label: 'News' },
            { href: '/resources', label: 'Buyer Resources' },
            { href: '/faq', label: 'FAQ' },
            { href: '/pricing', label: 'Pricing' },
            { href: '/support', label: 'Support' },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className="block px-4 py-2.5 text-sm font-semibold rounded-full transition-all"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
            {adminLoggedIn ? (
              <>
                <div className="px-4 py-2 rounded-2xl mb-2 flex items-center gap-2" style={{ background: 'var(--rust-deep)' }}>
                  <Shield size={14} className="text-white shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Administrator</p>
                    <p className="text-[11px] text-gray-300">FranchiseOntario.com</p>
                  </div>
                </div>
                {adminItems.map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-full" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-full" style={{ color: 'var(--rust)' }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : isLoggedIn ? (
              <>
                {realSession && (
                  <div className="px-4 py-2 rounded-2xl mb-2" style={{ background: 'var(--bg-soft)' }}>
                    <p className="text-xs font-bold text-black">{realSession.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{realSession.email}</p>
                  </div>
                )}
                {franchisorItems.map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-full" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-full" style={{ color: 'var(--rust)' }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-full" style={{ color: 'var(--text-secondary)' }} onClick={() => setMenuOpen(false)}>
                <LayoutDashboard size={15} style={{ color: 'var(--text-muted)' }} /> Franchisor Login
              </Link>
            )}
            <Link href="/quiz" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border" style={{ background: 'var(--cream)', color: 'var(--rust-dark)', borderColor: 'var(--gold)' }} onClick={() => setMenuOpen(false)}>
              <Sparkles size={14} /> Franchise Fit Quiz
            </Link>
            <Link href="/register" className="btn-red block text-center px-4 py-2.5 text-sm font-semibold" onClick={() => setMenuOpen(false)}>
              List Your Franchise
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

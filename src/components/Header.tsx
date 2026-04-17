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
      const isAdmin = localStorage.getItem('fo_admin') === 'authenticated'
      const session = isAdmin ? null : getSession()
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
    { label: 'My Leads',   href: '/dashboard?tab=leads',   icon: <Users size={13} /> },
    { label: 'My Listing', href: '/dashboard?tab=listing', icon: <FileText size={13} /> },
    { label: 'Billing',    href: '/dashboard?tab=billing', icon: <CreditCard size={13} /> },
    { label: 'Support',    href: '/dashboard?tab=support', icon: <LifeBuoy size={13} /> },
  ]

  const adminItems = [
    { label: 'Dashboard',          href: '/admin/dashboard',  icon: <LayoutDashboard size={13} /> },
    { label: 'Listings',           href: '/admin/listings',   icon: <ListChecks size={13} /> },
    { label: 'Franchise Requests', href: '/admin/franchises', icon: <Building2 size={13} /> },
    { label: 'Users',              href: '/admin/users',      icon: <UserCog size={13} /> },
    { label: 'Support Tickets',    href: '/admin/tickets',    icon: <Ticket size={13} /> },
    { label: 'SEO',                href: '/admin/seo',        icon: <BarChart3 size={13} /> },
  ]

  const navLinks = [
    { href: '/',          label: 'Home' },
    { href: '/directory', label: 'Directory' },
    { href: '/categories',label: 'Categories' },
    { href: '/news',      label: 'News', dot: true },
    { href: '/resources', label: 'Resources' },
    { href: '/faq',       label: 'FAQ' },
  ]

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between h-[4.5rem]">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <img
              src="/logo.png"
              alt="FranchiseOntario — Canada's Franchise Hub"
              className="w-[220px] h-auto max-h-10 object-contain"
            />
          </Link>

          {/* Desktop Nav — underline hover style */}
          <nav className="hidden lg:flex items-center">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link flex items-center gap-1.5">
                {item.label}
                {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
              </Link>
            ))}
            <Link href="/ontario" className="nav-link flex items-center gap-1.5">
              <MapPin size={11} style={{ color: 'var(--rust)' }} />
              Ontario
            </Link>
          </nav>

          {/* CTA area */}
          <div className="hidden lg:flex items-center gap-2">
            {adminLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium rounded-full border transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: 'var(--rust-deep)' }}>
                    <Shield size={11} />
                  </div>
                  <span>Admin</span>
                  <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border shadow-lg py-1.5 z-50" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <div className="px-3.5 py-2.5 border-b mb-1" style={{ borderColor: 'var(--border-light)' }}>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Administrator</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>FranchiseOntario.com</p>
                    </div>
                    {adminItems.map((item) => (
                      <Link key={item.label} href={item.href} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-blue-50"
                        style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1" style={{ borderColor: 'var(--border-light)' }}>
                      <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-red-50" style={{ color: 'var(--rust)' }}>
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
                  className="flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium rounded-full border transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: 'var(--rust)' }}>
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate">{displayName}</span>
                  <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border shadow-lg py-1.5 z-50" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <div className="px-3.5 py-2.5 border-b mb-1" style={{ borderColor: 'var(--border-light)' }}>
                      <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
                      <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{realSession.email}</p>
                    </div>
                    {franchisorItems.map((item) => (
                      <Link key={item.label} href={item.href} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-blue-50"
                        style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1" style={{ borderColor: 'var(--border-light)' }}>
                      {realSession.franchiseId && (
                        <Link href={`/directory/${realSession.franchiseId}`} onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-blue-50"
                          style={{ color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--text-muted)' }}><FileText size={13} /></span>
                          View My Listing
                        </Link>
                      )}
                      <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors hover:bg-red-50" style={{ color: 'var(--rust)' }}>
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : demoLoggedIn ? (
              <>
                <Link href="/dashboard" className="nav-link flex items-center gap-1.5">
                  <LayoutDashboard size={14} style={{ color: 'var(--rust)' }} />
                  My Dashboard
                </Link>
                <button onClick={handleSignOut} className="nav-link flex items-center gap-1.5">
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <Link href="/dashboard" className="nav-link flex items-center gap-1.5">
                <LayoutDashboard size={14} style={{ color: 'var(--text-muted)' }} />
                Sign In
              </Link>
            )}

            <Link
              href="/quiz"
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all border ml-1"
              style={{ background: 'var(--cream)', color: 'var(--rust-deep)', borderColor: 'var(--gold)' }}
            >
              <Sparkles size={13} style={{ color: 'var(--gold)' }} />
              Fit Quiz
            </Link>
            <Link href="/register" className="btn-red px-5 py-2.5 text-[13px] ml-1">
              List Your Franchise
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t px-5 pb-6 pt-4" style={{ borderColor: 'var(--border)' }}>
          <nav className="space-y-0.5 mb-4">
            {[
              { href: '/',          label: 'Home' },
              { href: '/directory', label: 'Directory' },
              { href: '/ontario',   label: '🍁 Ontario Cities' },
              { href: '/categories',label: 'Categories' },
              { href: '/news',      label: 'News' },
              { href: '/resources', label: 'Buyer Resources' },
              { href: '/faq',       label: 'FAQ' },
              { href: '/pricing',   label: 'Pricing' },
              { href: '/support',   label: 'Support' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2.5 text-[15px] font-medium rounded-xl transition-colors hover:bg-gray-50"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t space-y-2.5" style={{ borderColor: 'var(--border)' }}>
            {adminLoggedIn ? (
              <>
                <div className="px-3 py-2.5 rounded-xl flex items-center gap-2" style={{ background: 'var(--rust-deep)' }}>
                  <Shield size={14} className="text-white shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Administrator</p>
                    <p className="text-[11px] text-blue-200">FranchiseOntario.com</p>
                  </div>
                </div>
                {adminItems.map((item) => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center gap-2 px-3 py-2.5 text-[14px] font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setMenuOpen(false)}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[14px] font-medium rounded-xl hover:bg-red-50 transition-colors"
                  style={{ color: 'var(--rust)' }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : isLoggedIn ? (
              <>
                {realSession && (
                  <div className="px-3 py-2.5 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{realSession.name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{realSession.email}</p>
                  </div>
                )}
                {franchisorItems.map((item) => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center gap-2 px-3 py-2.5 text-[14px] font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setMenuOpen(false)}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[14px] font-medium rounded-xl hover:bg-red-50 transition-colors"
                  style={{ color: 'var(--rust)' }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <Link href="/dashboard"
                className="flex items-center gap-2 px-3 py-2.5 text-[14px] font-medium rounded-xl hover:bg-gray-50 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMenuOpen(false)}>
                <LayoutDashboard size={15} style={{ color: 'var(--text-muted)' }} /> Sign In
              </Link>
            )}

            <Link
              href="/quiz"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[14px] font-bold border transition-all"
              style={{ background: 'var(--cream)', color: 'var(--rust-deep)', borderColor: 'var(--gold)' }}
              onClick={() => setMenuOpen(false)}
            >
              <Sparkles size={14} /> Franchise Fit Quiz
            </Link>
            <Link
              href="/register"
              className="btn-red block text-center px-4 py-3 text-[14px]"
              onClick={() => setMenuOpen(false)}
            >
              List Your Franchise
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

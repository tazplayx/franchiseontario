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

  // Close dropdown on outside click
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

  // Franchisor dropdown items
  const franchisorItems = [
    { label: 'My Leads', href: '/dashboard?tab=leads', icon: <Users size={13} /> },
    { label: 'My Listing', href: '/dashboard?tab=listing', icon: <FileText size={13} /> },
    { label: 'Billing', href: '/dashboard?tab=billing', icon: <CreditCard size={13} /> },
    { label: 'Support', href: '/dashboard?tab=support', icon: <LifeBuoy size={13} /> },
  ]

  // Admin dropdown items
  const adminItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={13} /> },
    { label: 'Listings', href: '/admin/listings', icon: <ListChecks size={13} /> },
    { label: 'Franchise Requests', href: '/admin/franchises', icon: <Building2 size={13} /> },
    { label: 'Users', href: '/admin/users', icon: <UserCog size={13} /> },
    { label: 'Support Tickets', href: '/admin/tickets', icon: <Ticket size={13} /> },
    { label: 'SEO', href: '/admin/seo', icon: <BarChart3 size={13} /> },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
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
            <Link href="/" className="px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all tracking-wide">
              Home
            </Link>
            <Link href="/directory" className="px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all tracking-wide">
              Directory
            </Link>
            <Link href="/ontario" className="px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-1.5 tracking-wide">
              <MapPin size={12} className="text-red-500" /> Ontario
            </Link>
            <Link href="/categories" className="px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all tracking-wide">
              Categories
            </Link>
            <Link href="/news" className="px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-1.5 tracking-wide">
              News
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </Link>
            <Link href="/resources" className="px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all tracking-wide">
              Resources
            </Link>
            <Link href="/faq" className="px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all tracking-wide">
              FAQ
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {adminLoggedIn ? (
              /* Admin session — admin name + dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 border border-gray-200 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    <Shield size={11} />
                  </div>
                  <span className="max-w-[120px] truncate">Admin</span>
                  <ChevronDown size={13} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs font-bold text-gray-900">Administrator</p>
                      <p className="text-[11px] text-gray-400">FranchiseOntario.com</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-900 text-white uppercase">Admin</span>
                    </div>
                    {adminItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      >
                        <span className="text-gray-400">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : realSession ? (
              /* Franchisor real session — name dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 border border-gray-200 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown size={13} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                      <p className="text-[11px] text-gray-400 truncate">{realSession.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 uppercase">{realSession.tier}</span>
                    </div>
                    {franchisorItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                      >
                        <span className="text-gray-400">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      {realSession.franchiseId && (
                        <Link
                          href={`/directory/${realSession.franchiseId}`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                        >
                          <span className="text-gray-400"><FileText size={13} /></span>
                          View My Listing
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : demoLoggedIn ? (
              /* Demo session — simple links */
              <>
                <Link href="/dashboard" className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
                  <LayoutDashboard size={14} className="text-red-500" />
                  My Dashboard
                </Link>
                <button onClick={handleSignOut} className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/dashboard" className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
                <LayoutDashboard size={14} className="text-gray-400" />
                Franchisor Login
              </Link>
            )}
            <Link href="/quiz" className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all">
              <Sparkles size={13} className="text-amber-500" />
              Fit Quiz
            </Link>
            <Link href="/register" className="btn-red px-5 py-2.5 rounded-xl text-[13px] font-semibold shadow-sm">
              List Your Franchise
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 pb-6 pt-3 space-y-1">
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
            <Link key={item.label} href={item.href} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {adminLoggedIn ? (
              <>
                <div className="px-4 py-2 bg-gray-900 rounded-xl mb-2 flex items-center gap-2">
                  <Shield size={14} className="text-white shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Administrator</p>
                    <p className="text-[11px] text-gray-400">FranchiseOntario.com</p>
                  </div>
                </div>
                {adminItems.map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setMenuOpen(false)}>
                    <span className="text-gray-400">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : isLoggedIn ? (
              <>
                {realSession && (
                  <div className="px-4 py-2 bg-gray-50 rounded-xl mb-2">
                    <p className="text-xs font-bold text-gray-900">{realSession.name}</p>
                    <p className="text-[11px] text-gray-400">{realSession.email}</p>
                  </div>
                )}
                {franchisorItems.map((item) => (
                  <Link key={item.label} href={item.href} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setMenuOpen(false)}>
                    <span className="text-gray-400">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl">
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setMenuOpen(false)}>
                <LayoutDashboard size={15} className="text-gray-400" /> Franchisor Login
              </Link>
            )}
            <Link href="/quiz" className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-xl text-sm font-bold" onClick={() => setMenuOpen(false)}>
              <Sparkles size={14} /> Franchise Fit Quiz
            </Link>
            <Link href="/register" className="btn-red block text-center px-4 py-2.5 rounded-xl text-sm font-semibold" onClick={() => setMenuOpen(false)}>
              List Your Franchise
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

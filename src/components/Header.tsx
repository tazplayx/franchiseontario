'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, MapPin, Sparkles, LayoutDashboard, LogOut } from 'lucide-react'


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const check = () => setLoggedIn(sessionStorage.getItem('fo_user') === 'authenticated')
    check()
    // Re-check when tab regains focus (e.g. after logging in from another tab)
    window.addEventListener('focus', check)
    return () => window.removeEventListener('focus', check)
  }, [])

  const handleSignOut = () => {
    sessionStorage.removeItem('fo_user')
    setLoggedIn(false)
    window.location.href = '/'
  }

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
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <LayoutDashboard size={14} className="text-red-500" />
                  My Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
              >
                <LayoutDashboard size={14} className="text-gray-400" />
                Franchisor Login
              </Link>
            )}
            <Link
              href="/quiz"
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all"
            >
              <Sparkles size={13} className="text-amber-500" />
              Fit Quiz
            </Link>
            <Link
              href="/register"
              className="btn-red px-5 py-2.5 rounded-xl text-[13px] font-semibold shadow-sm"
            >
              List Your Franchise
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
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
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard size={15} className="text-red-500" /> My Dashboard
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={15} className="text-gray-400" /> Franchisor Login
              </Link>
            )}
            <Link
              href="/quiz"
              className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-xl text-sm font-bold"
              onClick={() => setMenuOpen(false)}
            >
              <Sparkles size={14} /> Franchise Fit Quiz
            </Link>
            <Link
              href="/register"
              className="btn-red block text-center px-4 py-2.5 rounded-xl text-sm font-semibold"
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

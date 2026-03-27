'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, MapPin, ChevronDown } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md group-hover:shadow-red-200 transition-shadow">
              <span className="text-white font-bold text-sm">🍁</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-gray-900 text-lg tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Franchise<span className="text-red-600">Ontario</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase font-medium">
                Canada's Franchise Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              Home
            </Link>
            <Link href="/directory" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              Directory
            </Link>
            <Link href="/categories" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              Categories
            </Link>
            <Link href="/news" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1">
              News
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
            </Link>
            <Link href="/pricing" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              Pricing
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/register"
              className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-red px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
            >
              List Your Franchise
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1">
          {[
            { href: '/', label: 'Home' },
            { href: '/directory', label: 'Directory' },
            { href: '/categories', label: 'Categories' },
            { href: '/news', label: 'News' },
            { href: '/pricing', label: 'Pricing' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <Link
              href="/register"
              className="btn-red block text-center px-4 py-2 rounded-lg text-sm font-semibold"
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

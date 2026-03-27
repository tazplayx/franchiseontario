import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top section divider */}
      <div className="section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍁</span>
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Franchise<span className="text-red-400">Ontario</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Ontario's most comprehensive franchise directory. Connecting investors, operators, and entrepreneurs with top franchise opportunities since 2024.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={14} className="text-red-400 shrink-0" />
              <span>Ontario, Canada</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Directory</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Browse All Franchises', '/directory'],
                ['Top Ranked', '/directory?sort=rank'],
                ['New Listings', '/directory?sort=newest'],
                ['Enterprise Brands', '/directory?tier=enterprise'],
                ['Premium Listings', '/directory?tier=premium'],
                ['Browse Categories', '/categories'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-red-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Franchisors */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">For Franchisors</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['List Your Franchise', '/register'],
                ['Pricing Plans', '/pricing'],
                ['Homepage Feature ($14.99/wk)', '/pricing#featured'],
                ['Premium Listing ($79/mo)', '/pricing#premium'],
                ['Enterprise Listing ($199/mo)', '/pricing#enterprise'],
                ['Advertise With Us', '/pricing'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-red-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2 text-sm mb-6">
              {[
                ['Franchise News', '/news'],
                ['Industry Reports', '/news?category=Industry'],
                ['Investment Guides', '/news?category=Guides'],
                ['Legal & Regulatory', '/news?category=Legal+%26+Regulatory'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-red-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-red-400" />
                <a href="mailto:hello@franchiseontario.com" className="hover:text-red-400 transition-colors">
                  hello@franchiseontario.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 FranchiseOntario.com — All rights reserved. Ontario, Canada.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

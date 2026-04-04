import Link from 'next/link'
import { MapPin, Sparkles } from 'lucide-react'
import ContactForm from './ContactForm'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top section divider */}
      <div className="section-divider" />

      {/* Quiz strip */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-sm">Not sure which franchise is right for you?</p>
              <p className="text-red-200 text-xs">Take the 2-minute Franchise Fit Quiz — free, no email required</p>
            </div>
          </div>
          <Link href="/quiz" className="shrink-0 bg-white text-red-700 font-bold px-5 py-2 rounded-xl text-sm hover:bg-red-50 transition-colors">
            Take the Quiz →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍁</span>
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Franchise<span className="text-red-400">Ontario</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Ontario-focused. Canada-wide. FranchiseOntario.com is the province's most comprehensive franchise directory — featuring Ontario-based brands alongside Canada's top national franchise concepts. Includes a Franchise Fit Quiz, Ontario city-level market pages, and Arthur Wishart Act buyer guides.
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
                ['Compare Franchises', '/compare'],
                ['Enterprise Brands', '/directory?tier=enterprise'],
                ['Browse Categories', '/categories'],
                ['Ontario Cities', '/ontario'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-red-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Buyer Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Buyer Tools</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Franchise Fit Quiz ✨', '/quiz'],
                ['Buyer\'s Guide', '/resources#guide'],
                ['Due Diligence Checklist', '/resources#checklist'],
                ['Arthur Wishart Act', '/resources#arthur-wishart'],
                ['Financing Sources', '/resources#financing'],
                ['FAQ', '/faq'],
                ['Franchise News', '/news'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-red-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Franchisors + Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">For Franchisors</h4>
            <ul className="space-y-2 text-sm mb-6">
              {[
                ['List Your Franchise', '/register'],
                ['Pricing Plans', '/pricing'],
                ['Homepage Feature ($14.99/wk)', '/pricing#featured'],
                ['Premium Listing ($79/mo)', '/pricing#premium'],
                ['Enterprise Listing ($199/mo)', '/pricing#enterprise'],
                ['Support', '/support'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-red-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <p className="text-xs text-white font-semibold uppercase tracking-widest mb-1">Contact Us</p>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Ontario Cities */}
        <div className="mt-10 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3">Franchise Opportunities by Ontario City</p>
          <div className="flex flex-wrap gap-2">
            {[
              ['Toronto', 'toronto'],
              ['Ottawa', 'ottawa'],
              ['Mississauga', 'mississauga'],
              ['Brampton', 'brampton'],
              ['Hamilton', 'hamilton'],
              ['London', 'london'],
              ['Kitchener-Waterloo', 'kitchener'],
              ['Windsor', 'windsor'],
              ['Barrie', 'barrie'],
              ['Oshawa', 'oshawa'],
              ['Greater Sudbury', 'sudbury'],
              ['Thunder Bay', 'thunder-bay'],
            ].map(([name, slug]) => (
              <Link
                key={slug}
                href={`/ontario/${slug}`}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                {name}
              </Link>
            ))}
            <span className="text-gray-700 text-xs select-none">|</span>
            <Link href="/ontario" className="text-xs text-red-500 hover:text-red-400 transition-colors font-medium">
              All Ontario Cities →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 FranchiseOntario.com — Ontario-Focused. Canada-Wide. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="/resources" className="hover:text-gray-300 transition-colors">Buyer Resources</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

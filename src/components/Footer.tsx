import Link from 'next/link'
import { MapPin, Sparkles } from 'lucide-react'
import ContactForm from './ContactForm'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--rust-deep)', color: 'rgba(255,255,255,0.70)' }}>

      {/* Quiz strip */}
      <div style={{ background: 'var(--rust)' }} className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={20} style={{ color: 'var(--gold)', flexShrink: 0 }} />
            <div>
              <p className="font-bold text-white text-sm">Not sure which franchise is right for you?</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>Take the 2-minute Franchise Fit Quiz — free, no email required</p>
            </div>
          </div>
          <Link href="/quiz" className="shrink-0 font-bold px-5 py-2 text-sm transition-colors" style={{ background: 'var(--cream)', color: 'var(--rust-deep)', borderRadius: '9999px' }}>
            Take the Quiz →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 flex items-center justify-center" style={{ borderRadius: '0.75rem', background: 'var(--rust)' }}>
                <span className="text-white font-bold text-sm">🍁</span>
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Franchise<span style={{ color: 'var(--gold)' }}>Ontario</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Ontario-focused. Canada-wide. FranchiseOntario.com is the province's most comprehensive franchise directory — featuring Ontario-based brands alongside Canada's top national franchise concepts. Includes a Franchise Fit Quiz, Ontario city-level market pages, and Arthur Wishart Act buyer guides.
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
              <MapPin size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
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
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.60)' }}>
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
                ["Buyer's Guide", '/resources#guide'],
                ['Due Diligence Checklist', '/resources#checklist'],
                ['Arthur Wishart Act', '/resources#arthur-wishart'],
                ['Financing Sources', '/resources#financing'],
                ['FAQ', '/faq'],
                ['Franchise News', '/news'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.60)' }}>
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
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.60)' }}>
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
        <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Franchise Opportunities by Ontario City</p>
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
                className="text-xs transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.40)' }}
              >
                {name}
              </Link>
            ))}
            <span className="text-xs select-none" style={{ color: 'rgba(255,255,255,0.20)' }}>|</span>
            <Link href="/ontario" className="text-xs font-medium transition-colors hover:text-white" style={{ color: 'var(--gold)' }}>
              All Ontario Cities →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <p>© 2026 FranchiseOntario.com — Ontario-Focused. Canada-Wide. All rights reserved.</p>
          <div className="flex gap-4">
            {[
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
              ['Buyer Resources', '/resources'],
              ['Sitemap', '/sitemap.xml'],
            ].map(([label, href]) => (
              <Link key={label} href={href} className="transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

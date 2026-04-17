import Link from 'next/link'
import { MapPin, Sparkles } from 'lucide-react'
import ContactForm from './ContactForm'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--rust-deep)', color: 'rgba(255,255,255,0.65)' }}>

      {/* Quiz strip */}
      <div style={{ background: 'var(--rust)', borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={18} style={{ color: 'rgba(255,255,255,0.80)', flexShrink: 0 }} />
            <div>
              <p className="font-bold text-white text-sm leading-snug">Not sure which franchise is right for you?</p>
              <p className="text-[13px] mt-0.5" style={{ color: 'rgba(255,255,255,0.70)' }}>Take the 2-minute Franchise Fit Quiz — free, no email required</p>
            </div>
          </div>
          <Link
            href="/quiz"
            className="shrink-0 font-bold px-5 py-2.5 text-[13px] rounded-full transition-all hover:opacity-90"
            style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--rust-deep)' }}
          >
            Take the Quiz →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: 'var(--rust)' }}>
                <span className="text-white text-sm">🍁</span>
              </div>
              <span className="font-bold text-white text-lg tracking-tight" style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                Franchise<span style={{ color: 'var(--gold)' }}>Ontario</span>
              </span>
            </div>
            <p className="text-[13.5px] leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Ontario-focused. Canada-wide. FranchiseOntario.com is the province's most comprehensive franchise directory — featuring Ontario-based brands alongside Canada's top national franchise concepts. Includes a Franchise Fit Quiz, Ontario city-level market pages, and Arthur Wishart Act buyer guides.
            </p>
            <div className="flex items-center gap-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.50)' }}>
              <MapPin size={13} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <span>Ontario, Canada</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4
              className="text-white text-[11px] font-bold uppercase tracking-[0.12em] mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}
            >
              Directory
            </h4>
            <ul className="space-y-2.5 text-[13.5px]">
              {[
                ['Browse All Franchises',  '/directory'],
                ['Top Ranked',             '/directory?sort=rank'],
                ['Compare Franchises',     '/compare'],
                ['Enterprise Brands',      '/directory?tier=enterprise'],
                ['Browse Categories',      '/categories'],
                ['Ontario Cities',         '/ontario'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Buyer Tools */}
          <div>
            <h4
              className="text-white text-[11px] font-bold uppercase tracking-[0.12em] mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}
            >
              Buyer Tools
            </h4>
            <ul className="space-y-2.5 text-[13.5px]">
              {[
                ['Franchise Fit Quiz ✨',    '/quiz'],
                ["Buyer's Guide",            '/resources#guide'],
                ['Due Diligence Checklist',  '/resources#checklist'],
                ['Arthur Wishart Act',       '/resources#arthur-wishart'],
                ['Financing Sources',        '/resources#financing'],
                ['FAQ',                      '/faq'],
                ['Franchise News',           '/news'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Franchisors + Contact */}
          <div>
            <h4
              className="text-white text-[11px] font-bold uppercase tracking-[0.12em] mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}
            >
              For Franchisors
            </h4>
            <ul className="space-y-2.5 text-[13.5px] mb-7">
              {[
                ['List Your Franchise',               '/register'],
                ['Pricing Plans',                     '/pricing'],
                ['Homepage Feature ($14.99/wk)',      '/pricing#featured'],
                ['Premium Listing ($79/mo)',           '/pricing#premium'],
                ['Enterprise Listing ($199/mo)',       '/pricing#enterprise'],
                ['Support',                           '/support'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-[0.12em] text-white mb-2"
                style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}
              >
                Contact Us
              </p>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Ontario Cities */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3"
            style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}
          >
            Franchise Opportunities by Ontario City
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {[
              ['Toronto',           'toronto'],
              ['Ottawa',            'ottawa'],
              ['Mississauga',       'mississauga'],
              ['Brampton',          'brampton'],
              ['Hamilton',          'hamilton'],
              ['London',            'london'],
              ['Kitchener-Waterloo','kitchener'],
              ['Windsor',           'windsor'],
              ['Barrie',            'barrie'],
              ['Oshawa',            'oshawa'],
              ['Greater Sudbury',   'sudbury'],
              ['Thunder Bay',       'thunder-bay'],
            ].map(([name, slug]) => (
              <Link
                key={slug}
                href={`/ontario/${slug}`}
                className="text-[12.5px] transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.38)' }}
              >
                {name}
              </Link>
            ))}
            <Link href="/ontario" className="text-[12.5px] font-semibold transition-colors hover:text-white" style={{ color: 'var(--gold)' }}>
              All Ontario Cities →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.30)' }}>
          <p>© 2026 FranchiseOntario.com — Ontario-Focused. Canada-Wide. All rights reserved.</p>
          <div className="flex gap-5">
            {[
              ['Privacy Policy',   '/privacy'],
              ['Terms of Service', '/terms'],
              ['Buyer Resources',  '/resources'],
              ['Sitemap',          '/sitemap.xml'],
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

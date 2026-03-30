import { notFound } from 'next/navigation'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { MapPin, Globe, Phone, Mail, Star, TrendingUp, Users, Calendar, Crown, ArrowLeft, ChevronRight, Building2, DollarSign, Percent, BadgeCheck, Video, ImageIcon } from 'lucide-react'
import { franchises, getFranchiseById } from '@/data/franchises'
import ClientLogoDisplay from '@/components/ClientLogoDisplay'
import ClientMediaSection from '@/components/ClientMediaSection'

const BASE = 'https://www.franchiseontario.com'

export async function generateStaticParams() {
  return franchises.map((f) => ({ id: f.id }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const f = getFranchiseById(params.id)
  if (!f) return {}
  return {
    title: `${f.name} Franchise — Ontario Profile, Investment & Fees`,
    description: `${f.name} franchise details for Ontario investors: ${f.financials.franchiseFee} franchise fee, ${f.financials.royaltyRate} royalty, ${f.locations}+ Ontario locations. Investment range $${(f.financials.investmentMin/1000).toFixed(0)}K–$${(f.financials.investmentMax/1000).toFixed(0)}K.`,
    keywords: [`${f.name} franchise Ontario`, `${f.name} franchise fee`, `${f.name} investment`, `${f.category} franchise Ontario`, 'franchise opportunity Ontario'],
    alternates: { canonical: `${BASE}/directory/${f.id}` },
    openGraph: {
      title: `${f.name} Franchise — Ontario Investment Profile`,
      description: `${f.name}: ${f.financials.franchiseFee} franchise fee, ${f.financials.royaltyRate} royalty, ${f.locations}+ Ontario locations, avg unit volume ${f.financials.averageUnitVolume}.`,
      url: `${BASE}/directory/${f.id}`,
    },
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-5 h-5 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function FranchiseProfilePage({ params }: { params: { id: string } }) {
  const franchise = getFranchiseById(params.id)
  if (!franchise) notFound()

  const f = franchise

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE}/directory/${f.id}`,
    name: f.name,
    description: f.description,
    url: f.website,
    telephone: f.phone,
    email: f.email,
    image: `${BASE}/og-image.png`,
    foundingDate: String(f.established),
    areaServed: { '@type': 'State', name: 'Ontario', containedInPlace: { '@type': 'Country', name: 'Canada' } },
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 80 },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: f.rating,
      reviewCount: f.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    potentialAction: {
      '@type': 'ReserveAction',
      target: `mailto:${f.email}?subject=Franchise Inquiry — ${f.name}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: `${BASE}/directory` },
      { '@type': 'ListItem', position: 3, name: f.name, item: `${BASE}/directory/${f.id}` },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* Hero banner */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/directory" className="hover:text-red-600 transition-colors">Directory</Link>
            <ChevronRight size={14} />
            <span className="text-gray-700 font-medium">{f.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-7">
            {/* Logo */}
            <ClientLogoDisplay
              id={f.id}
              seedLogoUrl={f.logoUrl}
              logoBg={f.logoBg}
              logoColor={f.logoColor}
              logoInitials={f.logoInitials}
            />

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {f.isVIP && (
                  <span className="vip-badge inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full">
                    <Crown size={10} /> VIP Enterprise
                  </span>
                )}
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  {f.category}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  Est. {f.established}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{f.name}</h1>
              <p className="text-gray-400 text-base italic mb-4">"{f.tagline}"</p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={f.rating} />
                  <span className="text-gray-900 font-semibold text-sm">{f.rating}</span>
                  <span className="text-gray-400 text-sm">({f.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin size={13} className="text-red-500" />
                  {f.locations}+ Ontario Locations
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <Building2 size={13} className="text-gray-400" />
                  {f.parent}
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
              <a href={`mailto:${f.email}`} className="btn-red px-6 py-2.5 rounded-xl font-semibold text-sm text-center">
                Request Franchise Info
              </a>
              <a href={f.website} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm text-center transition-all">
                Visit Website
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column — main content */}
          <div className="lg:col-span-2 space-y-7">

            {/* About */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-red-600 inline-block" />
                About {f.name}
              </h2>
              {f.longDescription.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
              ))}
            </section>

            {/* Media Gallery */}
            <ClientMediaSection
              id={f.id}
              seedImages={f.mediaImages}
              seedVideoUrl={f.videoUrl}
              logoBg={f.logoBg}
            />

            {/* Key Highlights */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-green-500 inline-block" />
                Franchise Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {f.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </span>
                    <span className="text-sm text-gray-700 font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Ideal Candidate */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-blue-500 inline-block" />
                Ideal Franchisee Profile
              </h2>
              <ul className="space-y-3">
                {f.idealCandidate.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-blue-600 font-black text-xs">{i + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Support Offered */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-purple-500 inline-block" />
                Training & Support
              </h2>
              <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl p-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar size={22} className="text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{f.trainingWeeks}-Week Training Program</div>
                  <div className="text-xs text-gray-500">Comprehensive onboarding before your doors open</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {f.supportOffered.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <BadgeCheck size={15} className="text-purple-500 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-orange-500 inline-block" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {f.faqs.map((faq, i) => (
                  <details key={i} className="group border border-gray-200 rounded-xl">
                    <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer font-semibold text-sm text-gray-900 hover:text-red-600 transition-colors">
                      {faq.q}
                      <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg shrink-0 ml-2">▾</span>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-5">

            {/* Investment Summary */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={16} className="text-amber-600" />
                <h3 className="font-black text-gray-900 text-base">Investment Summary</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Initial Franchise Fee</span>
                  <span className="font-bold text-gray-900">{f.financials.franchiseFee}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Total Investment Range</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">${(f.financials.investmentMin / 1000).toFixed(0)}K</span>
                    <span className="text-gray-400 text-xs"> – </span>
                    <span className="font-bold text-gray-900">${(f.financials.investmentMax / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Royalty Fee</span>
                  <span className="font-bold text-gray-900">{f.financials.royaltyRate} of gross sales</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Marketing Fund</span>
                  <span className="font-bold text-gray-900">{f.financials.marketingFee} of gross sales</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Avg. Unit Volume</span>
                  <span className="font-bold text-green-600">{f.financials.averageUnitVolume}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Liquid Capital Required</span>
                  <span className="font-bold text-gray-900">{f.financials.liquidCapitalRequired}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-sm text-gray-500">Net Worth Required</span>
                  <span className="font-bold text-gray-900">{f.financials.netWorthRequired}</span>
                </div>
              </div>

              {f.financials.royaltyNotes && (
                <p className="text-[11px] text-gray-400 mt-3 leading-relaxed border-t border-gray-100 pt-3">
                  * {f.financials.royaltyNotes}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-black text-gray-900 text-base mb-4">Franchise Stats</h3>
              <div className="space-y-3">
                {[
                  { icon: <Building2 size={15} className="text-red-500" />, label: 'Ontario Locations', value: `${f.locations}+` },
                  { icon: <Users size={15} className="text-blue-500" />, label: 'Active Franchisees', value: f.franchiseeCount },
                  { icon: <Calendar size={15} className="text-green-500" />, label: 'Years in Business', value: `${2026 - f.established} years` },
                  { icon: <TrendingUp size={15} className="text-amber-500" />, label: 'Training Duration', value: `${f.trainingWeeks} weeks` },
                  { icon: <MapPin size={15} className="text-purple-500" />, label: 'Territory', value: 'Protected' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {stat.icon}
                      {stat.label}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-5 text-white">
              <h3 className="font-black text-base mb-1">Ready to Learn More?</h3>
              <p className="text-red-100 text-xs mb-4 leading-relaxed">
                Request the official franchise information package directly from {f.name}.
              </p>
              <div className="space-y-2.5 mb-4">
                <a href={`mailto:${f.email}`} className="flex items-center gap-2 text-sm text-red-100 hover:text-white transition-colors">
                  <Mail size={14} /> {f.email}
                </a>
                <a href={`tel:${f.phone}`} className="flex items-center gap-2 text-sm text-red-100 hover:text-white transition-colors">
                  <Phone size={14} /> {f.phone}
                </a>
                <a href={f.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-red-100 hover:text-white transition-colors">
                  <Globe size={14} /> {f.website.replace('https://', '')}
                </a>
              </div>
              <a
                href={`mailto:${f.email}?subject=Franchise Inquiry — ${f.name}&body=Hello, I am interested in learning more about a ${f.name} franchise opportunity in Ontario. Please send me your franchise information package.`}
                className="block text-center bg-white text-red-600 font-bold text-sm py-2.5 rounded-xl hover:bg-red-50 transition-colors"
              >
                Send Inquiry Email
              </a>
            </div>

            {/* Arthur Wishart Act — Ontario Buyer Protection */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-base">⚖️</span>
                <h4 className="font-bold text-amber-900 text-xs">Arthur Wishart Act Protection</h4>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed mb-2">
                As an Ontario franchise buyer, you are protected by the <strong>Arthur Wishart Act (Franchise Disclosure), 2000</strong>. Franchisors must provide a complete Franchise Disclosure Document (FDD) at least <strong>14 days</strong> before signing any agreement or paying any money.
              </p>
              <a href="/resources#arthur-wishart" className="text-[11px] text-amber-700 hover:underline font-medium">
                Learn about your legal rights →
              </a>
            </div>

            {/* Compare CTA */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">Want to compare this brand to others?</p>
              <a
                href={`/compare?ids=${f.id}`}
                className="block text-center border-2 border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-600 font-semibold text-sm py-2 rounded-xl transition-all"
              >
                Compare Franchises →
              </a>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                <strong className="text-gray-500">Disclaimer:</strong> All financial figures are estimates based on publicly available franchise disclosure information and industry averages. Actual results will vary. Always review the Franchise Disclosure Document (FDD) and consult a qualified franchise attorney before investing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

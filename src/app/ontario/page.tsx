import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, TrendingUp, Users, Building2, ArrowRight, ChevronRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Ontario Franchise Opportunities by City — FranchiseOntario.com',
  description:
    "Find franchise opportunities across Ontario's major cities. Toronto, Ottawa, Mississauga, Hamilton, London, Kitchener-Waterloo, Windsor, Barrie, and more. Ontario's largest franchise directory.",
  keywords: [
    'Ontario franchise opportunities',
    'franchise by city Ontario',
    'Toronto franchise',
    'Ottawa franchise',
    'Mississauga franchise opportunity',
    'Ontario franchise directory',
  ],
  alternates: { canonical: 'https://www.franchiseontario.com/ontario' },
  openGraph: {
    title: 'Ontario Franchise Opportunities by City',
    description: "Explore franchise opportunities in every major Ontario market — from Toronto and Ottawa to Hamilton, London, and beyond.",
  },
}

const BASE = 'https://www.franchiseontario.com'

const cities = [
  { slug: 'toronto', name: 'Toronto', region: 'GTA', pop: '2.9M', rank: 1, highlight: "Canada's largest city & #1 franchise market", icon: '🏙️', color: 'from-red-600 to-red-800' },
  { slug: 'ottawa', name: 'Ottawa', region: 'Eastern Ontario', pop: '1.1M', rank: 2, highlight: "National capital — government & tech driven economy", icon: '🏛️', color: 'from-blue-600 to-blue-800' },
  { slug: 'mississauga', name: 'Mississauga', region: 'GTA West', pop: '720K', rank: 3, highlight: "Canada's 6th largest city — booming suburban market", icon: '🌆', color: 'from-purple-600 to-purple-800' },
  { slug: 'brampton', name: 'Brampton', region: 'GTA West', pop: '660K', rank: 4, highlight: "One of Canada's fastest-growing cities by population", icon: '📈', color: 'from-green-600 to-green-800' },
  { slug: 'hamilton', name: 'Hamilton', region: 'Southern Ontario', pop: '580K', rank: 5, highlight: "Steel City reinvented — arts, food & business hub", icon: '⚙️', color: 'from-orange-600 to-orange-800' },
  { slug: 'london', name: 'London', region: 'Southwestern Ontario', pop: '420K', rank: 6, highlight: "University city with strong consumer spending", icon: '🎓', color: 'from-teal-600 to-teal-800' },
  { slug: 'kitchener', name: 'Kitchener-Waterloo', region: 'Southwestern Ontario', pop: '380K', rank: 7, highlight: "Canada's Silicon Valley — tech meets tradition", icon: '💻', color: 'from-indigo-600 to-indigo-800' },
  { slug: 'windsor', name: 'Windsor', region: 'Southwestern Ontario', pop: '230K', rank: 8, highlight: "Border city — auto industry & cross-border traffic", icon: '🚗', color: 'from-gray-600 to-gray-800' },
  { slug: 'barrie', name: 'Barrie', region: 'Central Ontario', pop: '160K', rank: 9, highlight: "Cottage country gateway — year-round seasonal traffic", icon: '⛵', color: 'from-sky-600 to-sky-800' },
  { slug: 'oshawa', name: 'Oshawa', region: 'GTA East', pop: '170K', rank: 10, highlight: "Durham Region's largest city — growing east GTA", icon: '🏭', color: 'from-amber-600 to-amber-800' },
  { slug: 'sudbury', name: 'Greater Sudbury', region: 'Northern Ontario', pop: '165K', rank: 11, highlight: "Northern Ontario's largest city — mining & retail hub", icon: '⛏️', color: 'from-stone-600 to-stone-800' },
  { slug: 'thunder-bay', name: 'Thunder Bay', region: 'Northwestern Ontario', pop: '115K', rank: 12, highlight: "Northwestern gateway — strong local loyalty market", icon: '🌲', color: 'from-emerald-600 to-emerald-800' },
]

const stats = [
  { value: '$120B+', label: 'Annual Franchise Revenue in Canada', icon: '💰' },
  { value: '76,000+', label: 'Franchise Establishments in Ontario', icon: '🏢' },
  { value: '14', label: 'Major Ontario Market Areas', icon: '📍' },
  { value: '#1', label: 'GTA as Top Canadian Franchise Market', icon: '🏆' },
]

export default function OntarioPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Ontario Cities', item: `${BASE}/ontario` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-3"><MapPin size={10} /> Ontario, Canada</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Franchise Opportunities Across Ontario
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mb-8 leading-relaxed">
            Ontario is Canada's largest franchise market. Explore opportunities by city — from the GTA's 6+ million consumers to growing Northern Ontario markets.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* City Grid */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full bg-red-600" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Browse by City</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Find Franchises Near You</h2>
          <p className="text-gray-500 text-sm mb-8">
            Each city page includes market insights, territory availability notes, and active franchise listings for that region.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/ontario/${city.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-transparent transition-all"
              >
                {/* Color strip */}
                <div className={`h-2 bg-gradient-to-r ${city.color}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{city.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{city.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-400">{city.region}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{city.pop}</div>
                      <div className="text-[10px] text-gray-400">population</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">{city.highlight}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-600">View Opportunities</span>
                    <ChevronRight size={14} className="text-red-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Why Ontario */}
      <div className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Why Ontario?</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                Canada's Franchise Capital
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Ontario generates the majority of Canadian franchise revenue, with the GTA alone representing over 40% of the national franchise economy. The province's diverse, growing population provides franchisees with built-in demand across virtually every category.
                </p>
                <p>
                  The <strong>Arthur Wishart Act (Franchise Disclosure), 2000</strong> provides Ontario franchise buyers with some of the strongest legal protections in North America — franchisors must provide a Franchise Disclosure Document (FDD) at least 14 days before signing, giving buyers full transparency on fees, history, and obligations.
                </p>
                <p>
                  From the dense urban markets of the GTA and Ottawa to fast-growing mid-size cities like Kitchener-Waterloo, Barrie, and Oshawa — Ontario offers franchise investors a territory for virtually every budget and lifestyle.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '⚖️', title: 'Arthur Wishart Act', desc: 'Ontario franchisees have mandatory 14-day FDD disclosure protection' },
                { icon: '📊', title: '$120B Economy', desc: "Canadian franchising contributes $120B+ annually — Ontario leads" },
                { icon: '🌍', title: 'Diverse Markets', desc: 'Urban, suburban & rural markets across 12 major Ontario cities' },
                { icon: '🏦', title: 'BDC Financing', desc: 'Business Development Bank programs available for franchise buyers' },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-red-600 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Not Sure Which Market is Right For You?</h2>
          <p className="text-red-100 text-sm mb-6 max-w-xl mx-auto">
            Take our 2-minute Franchise Fit Quiz — we'll match you to the best Ontario franchise based on your budget, lifestyle, and target market.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quiz" className="bg-white text-red-600 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-red-50 transition-colors">
              Take the Franchise Fit Quiz →
            </Link>
            <Link href="/directory" className="bg-white/15 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-colors">
              Browse All Franchises
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

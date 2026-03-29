import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, TrendingUp, Users, ArrowRight, ChevronRight, Building2 } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import { franchises } from '@/data/franchises'

const BASE = 'https://www.franchiseontario.com'

const cityData: Record<string, {
  name: string
  region: string
  pop: string
  icon: string
  description: string
  marketInsights: string[]
  topCategories: string[]
  investmentClimate: string
  arthuriWishart: string
}> = {
  toronto: {
    name: 'Toronto',
    region: 'Greater Toronto Area',
    pop: '2.9M',
    icon: '🏙️',
    description: "Toronto is Canada's largest city and North America's fourth-largest urban market. With a dense, multicultural population and Canada's highest consumer spending per capita, Toronto represents the ultimate franchise proving ground — and the most competitive.",
    marketInsights: [
      'Canada\'s #1 franchise market by revenue and location count',
      'Population of 6.4M in the Greater Toronto Area (GTA)',
      'Highest average household income in Ontario at $105K+',
      'Strong food & beverage demand — over 8,000 restaurants in Toronto proper',
      'Transit-accessible retail corridors in Downtown, Midtown, Etobicoke, Scarborough, and North York',
      'Premium real estate costs — factor $40–$80/sq ft NNN for prime retail',
    ],
    topCategories: ['Food & Beverage', 'Coffee & Café', 'Fitness & Wellness', 'Beauty & Salon', 'Financial Services'],
    investmentClimate: 'High demand, high cost. Budget 20–30% more than smaller markets for real estate and construction. Strong consumer traffic compensates with higher average unit volumes.',
    arthuriWishart: 'Toronto franchise deals are subject to Ontario\'s Arthur Wishart Act — franchisors must provide a Franchise Disclosure Document (FDD) at least 14 days before any agreement is signed.',
  },
  ottawa: {
    name: 'Ottawa',
    region: 'Eastern Ontario',
    pop: '1.1M',
    icon: '🏛️',
    description: "Ottawa is Canada's capital city and one of Ontario's most stable franchise markets. Government employment, a large tech sector, and two major universities drive consistent consumer spending year-round — with less volatility than private-sector-driven markets.",
    marketInsights: [
      'Federal government employment base provides income stability',
      'Large tech sector including Shopify, Nokia, and 1,700+ tech companies',
      'Carleton University and University of Ottawa add 60K+ students',
      'Bilingual market (English + French) — relevant for some franchise brands',
      'Suburban growth corridors in Barrhaven, Kanata, and Orleans',
      'Lower construction costs than GTA with strong suburban retail demand',
    ],
    topCategories: ['Food & Beverage', 'Coffee & Café', 'Home Services', 'Education', 'Fitness & Wellness'],
    investmentClimate: 'Stable, lower-risk market with steady foot traffic. Build-out costs 15–20% lower than GTA. Strong demand for family-oriented concepts.',
    arthuriWishart: 'Ottawa franchise buyers are protected under the Arthur Wishart Act — all Ontario franchisors must provide full FDD disclosure 14 days before signing.',
  },
  mississauga: {
    name: 'Mississauga',
    region: 'GTA West',
    pop: '720K',
    icon: '🌆',
    description: "Mississauga is Canada's sixth-largest city and one of Ontario's fastest-growing suburban franchise markets. Anchored by major corporate headquarters, Pearson International Airport, and dense residential growth, the city offers strong demographics across virtually every franchise category.",
    marketInsights: [
      "Home to 65+ Fortune 500 Canadian HQs including Microsoft, Walmart Canada, and PepsiCo",
      'Pearson Airport proximity drives hospitality and food service demand',
      'High-income suburban demographics with average household income of $115K+',
      'Major retail corridors: Square One, Port Credit, Heartland Town Centre',
      'High-density condo and townhome growth in Port Credit and City Centre',
      'Culturally diverse population with strong multicultural food demand',
    ],
    topCategories: ['Food & Beverage', 'Coffee & Café', 'Retail', 'Financial Services', 'Fitness & Wellness'],
    investmentClimate: 'Strong suburban market. Real estate more affordable than Toronto proper while capturing GTA demographics. Excellent visibility in major power centres.',
    arthuriWishart: 'Mississauga buyers are covered under Ontario\'s Arthur Wishart Act — 14-day minimum FDD disclosure required before signing.',
  },
  brampton: {
    name: 'Brampton',
    region: 'GTA West',
    pop: '660K',
    icon: '📈',
    description: "Brampton is one of Canada's fastest-growing cities by population and is developing rapidly as an independent commercial hub within the GTA. A young, multicultural population and significant new residential development create strong demand for franchise concepts in food, services, and retail.",
    marketInsights: [
      "Canada's 9th largest city — population grew 12% in the last census",
      'Young median age of 36.5 — strong family-oriented franchise demand',
      'South Asian community represents the largest demographic segment',
      'Strong emerging commercial corridors on Hwy 410, Bramalea, and Gore Road',
      'Peel Region the second most populous region in Ontario',
      'Lower real estate costs vs. Mississauga and Toronto with similar demographics',
    ],
    topCategories: ['Food & Beverage', 'Beauty & Salon', 'Pet Services', 'Education', 'Home Services'],
    investmentClimate: 'High growth, value market. Lower lease costs relative to GTA average. Strong demand for culturally diverse food concepts and family services.',
    arthuriWishart: 'Ontario\'s Arthur Wishart Act applies — 14-day FDD disclosure mandatory for all Brampton franchise agreements.',
  },
  hamilton: {
    name: 'Hamilton',
    region: 'Southern Ontario',
    pop: '580K',
    icon: '⚙️',
    description: "Hamilton is one of Ontario's most exciting emerging franchise markets. A dramatic revitalization of the arts, food, and business districts — anchored by McMaster University and a growing tech sector — has created new consumer demand in a market traditionally defined by its manufacturing heritage.",
    marketInsights: [
      'James Street North arts district is one of Ontario\'s most vibrant emerging retail corridors',
      'McMaster University adds 35K+ students and faculty to the consumer base',
      'Hamilton is within 1 hour of 8 million Ontario consumers',
      'Steel industry heritage transitioning to tech, healthcare, and creative economy',
      'Lower real estate costs than GTA — 30–40% below Toronto average',
      'Growing millennial and young professional demographic driving food and fitness demand',
    ],
    topCategories: ['Food & Beverage', 'Coffee & Café', 'Fitness & Wellness', 'Home Services', 'Beauty & Salon'],
    investmentClimate: 'Strong value opportunity. Lower construction and lease costs in a rapidly gentrifying market with strong University-driven foot traffic.',
    arthuriWishart: 'Hamilton franchise deals covered by the Arthur Wishart Act — full FDD disclosure 14 days before signing, enforced across all of Ontario.',
  },
  london: {
    name: 'London',
    region: 'Southwestern Ontario',
    pop: '420K',
    icon: '🎓',
    description: "London, Ontario is Southwestern Ontario's largest city and a major university market, home to Western University and Fanshawe College. Consistent consumer spending is driven by a large student population, a significant healthcare sector, and a stable suburban residential base.",
    marketInsights: [
      'Western University and Fanshawe College — combined 60K+ students and faculty',
      'London Health Sciences Centre is one of Canada\'s largest teaching hospitals',
      'Affordable franchise real estate relative to GTA — often 40–50% lower',
      'Stable consumer economy anchored by education and healthcare employment',
      'Growing tech corridor with 3M, Trojan Technologies, and other major employers',
      'Strong suburban growth in South and East London',
    ],
    topCategories: ['Food & Beverage', 'Coffee & Café', 'Fitness & Wellness', 'Automotive', 'Education'],
    investmentClimate: 'Affordable market with stable University-driven demand. Excellent for value-focused franchise buyers looking to enter at lower cost than GTA.',
    arthuriWishart: 'London franchise buyers protected under Ontario\'s Arthur Wishart Act — mandatory 14-day FDD disclosure window applies.',
  },
  kitchener: {
    name: 'Kitchener-Waterloo',
    region: 'Southwestern Ontario',
    pop: '380K',
    icon: '💻',
    description: "Kitchener-Waterloo is Canada's fastest-growing tech hub outside Toronto — often called Canada's Silicon Valley. Home to the University of Waterloo (globally ranked), Wilfrid Laurier University, and a startup ecosystem that has produced companies like Blackberry, Kik, and Shopify alumni ventures. KW offers strong demographics and growing consumer spending.",
    marketInsights: [
      'University of Waterloo ranked in world\'s top 100 — produces Canada\'s top engineering grads',
      'Google, Shopify, OpenText and 1,000+ tech companies operate in the region',
      'Rapidly growing population — one of Ontario\'s highest growth rates',
      'Young, educated, high-income demographic ideal for premium franchise concepts',
      'Iron Horse Trail and Uptown Waterloo create strong walkable retail districts',
      'LRT (ION transit) connecting Kitchener, Waterloo, and Cambridge drives corridor development',
    ],
    topCategories: ['Coffee & Café', 'Food & Beverage', 'Fitness & Wellness', 'Financial Services', 'Education'],
    investmentClimate: 'Tech economy drives premium consumer spending. Competitive market for quality concepts. Real estate lower than GTA but rising rapidly with population growth.',
    arthuriWishart: 'Arthur Wishart Act applies to all KW-region franchise agreements — 14-day FDD disclosure mandatory.',
  },
  windsor: {
    name: 'Windsor',
    region: 'Southwestern Ontario',
    pop: '230K',
    icon: '🚗',
    description: "Windsor is Canada's automotive capital and shares an international border crossing with Detroit, Michigan — one of the busiest Canada-US crossings. The city is undergoing significant economic transformation with new EV battery plant investments and cross-border commercial activity.",
    marketInsights: [
      'Stellantis and Ford plants anchor the regional manufacturing economy',
      'Massive NextStar LG Energy Solution EV battery plant (2,500+ new jobs by 2025)',
      'Ambassador Bridge is Canada\'s busiest international border crossing',
      'University of Windsor adds 15K students to the consumer base',
      'Lower cost of living and real estate — among Ontario\'s most affordable',
      'Cross-border shoppers add incremental demand for food and service concepts',
    ],
    topCategories: ['Automotive', 'Food & Beverage', 'Home Services', 'Retail', 'Fitness & Wellness'],
    investmentClimate: 'Value market with strong automotive roots and growing EV economy. Lowest franchise real estate costs in Southwestern Ontario. Strong opportunity for first-time buyers.',
    arthuriWishart: 'Windsor franchise agreements governed by the Arthur Wishart Act — FDD required 14 days before signing.',
  },
  barrie: {
    name: 'Barrie',
    region: 'Central Ontario',
    pop: '160K',
    icon: '⛵',
    description: "Barrie sits at the gateway to Ontario's cottage country and serves as a major commuter hub for the GTA. Year-round tourism, a growing permanent population, and proximity to Simcoe County ski hills and waterfront attractions create consistent demand across all seasons.",
    marketInsights: [
      "Gateway to Muskoka, Georgian Bay, and Ontario's cottage country",
      'Population grew 18% in the last decade — one of Ontario\'s fastest-growing cities',
      'Significant GTA commuter base adds purchasing power above local income levels',
      'GO Transit expansion has accelerated residential and commercial development',
      'Strong seasonal spikes in summer (Georgian Bay) and winter (ski hills)',
      'Major retail development on Mapleview Drive corridor',
    ],
    topCategories: ['Food & Beverage', 'Home Services', 'Fitness & Wellness', 'Automotive', 'Retail'],
    investmentClimate: 'Growing market with seasonal upside. Lower costs than GTA with strong commuter demographics. Excellent for family service and food concepts.',
    arthuriWishart: 'Arthur Wishart Act applies in Barrie — 14-day FDD disclosure window required before any franchise agreement.',
  },
  oshawa: {
    name: 'Oshawa',
    region: 'GTA East (Durham Region)',
    pop: '170K',
    icon: '🏭',
    description: "Oshawa is Durham Region's largest city and a significant part of the GTA East growth corridor. Anchored by the University of Ontario Institute of Technology (UOIT) and the major General Motors Canada facility, Oshawa offers a blend of established manufacturing employment and growing University demographics.",
    marketInsights: [
      'Ontario Tech University (formerly UOIT) adds 12K+ students to consumer base',
      'Durham Region is among Ontario\'s fastest-growing regions',
      'GO Transit expansion and Highway 407 extension driving residential growth east',
      'Significant condo and townhome development in Oshawa and Whitby',
      'Lower real estate and construction costs than Toronto — typically 35–40% below',
      'GM Canada HQ and manufacturing operations anchor employment base',
    ],
    topCategories: ['Food & Beverage', 'Automotive', 'Coffee & Café', 'Retail', 'Home Services'],
    investmentClimate: 'Value GTA-East opportunity. Strong growth trajectory as the 407 extension pushes development east. Good entry market for food and service franchises.',
    arthuriWishart: 'Oshawa franchise agreements require full FDD disclosure 14 days before signing under the Arthur Wishart Act.',
  },
  sudbury: {
    name: 'Greater Sudbury',
    region: 'Northern Ontario',
    pop: '165K',
    icon: '⛏️',
    description: "Greater Sudbury is Northern Ontario's largest city and economic hub. Anchored by mining, forestry, and a significant healthcare sector, Sudbury offers franchise buyers a market with strong local loyalty and significantly lower competition density than Southern Ontario markets.",
    marketInsights: [
      'Largest city in Northern Ontario — serves a regional catchment of 300K+',
      'Mining industry (Vale, Glencore) anchors high-wage employment base',
      'Laurentian University and Cambrian College add student demand',
      'Strong community loyalty — local businesses outperform chain averages on repeat visits',
      'Northern Ontario Investment Ready designation offers additional business incentives',
      'Far lower franchise competition density than Southern Ontario',
    ],
    topCategories: ['Food & Beverage', 'Home Services', 'Automotive', 'Retail', 'Fitness & Wellness'],
    investmentClimate: 'Low-competition, high-loyalty market. Significantly lower real estate costs. Requires understanding of the Northern Ontario consumer mindset and seasonal economy.',
    arthuriWishart: 'Arthur Wishart Act applies province-wide — Sudbury franchise buyers receive full 14-day FDD disclosure protection.',
  },
  'thunder-bay': {
    name: 'Thunder Bay',
    region: 'Northwestern Ontario',
    pop: '115K',
    icon: '🌲',
    description: "Thunder Bay is Northwestern Ontario's largest city and the service hub for a vast geographic region. A strong sense of community loyalty, a growing healthcare sector, and Lakehead University provide steady consumer demand in a market with very low franchise competition.",
    marketInsights: [
      "Services a regional population far exceeding city boundaries — Northern Ontario's commercial hub",
      'Lakehead University and Confederation College add 15K+ students',
      'Regional Health Sciences Centre is Northwestern Ontario\'s major health hub',
      'Finnish, Italian, and Indigenous cultural communities create diverse market demand',
      'Thunder Bay Port is a major grain-shipping terminal — agricultural economy anchor',
      'Among Ontario\'s lowest franchise competition levels — first-mover advantage in many categories',
    ],
    topCategories: ['Food & Beverage', 'Home Services', 'Automotive', 'Retail', 'Fitness & Wellness'],
    investmentClimate: 'First-mover opportunity market. Very low competition, strong community loyalty. Requires comfort with geographic isolation and regional supply chains.',
    arthuriWishart: 'All Ontario franchise agreements, including Thunder Bay, are governed by the Arthur Wishart Act — 14-day FDD disclosure window mandatory.',
  },
}

export async function generateStaticParams() {
  return Object.keys(cityData).map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: { city: string } }) {
  const city = cityData[params.city]
  if (!city) return {}
  return {
    title: `${city.name} Franchise Opportunities — Ontario Franchise Directory`,
    description: `Find franchise opportunities in ${city.name}, Ontario. Population ${city.pop}. ${city.description.slice(0, 120)}...`,
    keywords: [
      `${city.name} franchise`,
      `franchise opportunities ${city.name}`,
      `${city.name} Ontario franchise`,
      `buy a franchise ${city.name}`,
      `${city.region} franchise`,
      'Ontario franchise directory',
    ],
    alternates: { canonical: `${BASE}/ontario/${params.city}` },
    openGraph: {
      title: `${city.name} Franchise Opportunities — FranchiseOntario.com`,
      description: `Explore franchise investment opportunities in ${city.name}, ${city.region}. Population ${city.pop}. Full market insights and active listings.`,
    },
  }
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = cityData[params.city]
  if (!city) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Ontario Cities', item: `${BASE}/ontario` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `${BASE}/ontario/${params.city}` },
    ],
  }

  const localListingsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Franchise Opportunities in ${city.name}, Ontario`,
    description: `Active franchise opportunities available in ${city.name}, ${city.region}`,
    url: `${BASE}/ontario/${params.city}`,
    numberOfItems: franchises.length,
    itemListElement: franchises.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.name,
      url: `${BASE}/directory/${f.id}`,
    })),
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={localListingsSchema} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/ontario" className="hover:text-red-600 transition-colors">Ontario Cities</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">{city.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{city.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <MapPin size={12} className="text-red-400" />
                <span className="text-xs text-gray-400">{city.region}, Ontario, Canada</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                {city.name} Franchise Opportunities
              </h1>
            </div>
          </div>
          <p className="text-gray-300 text-sm max-w-2xl mb-6 leading-relaxed">{city.description}</p>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <Users size={14} className="text-red-400" />
              <span className="text-sm text-white font-semibold">{city.pop}</span>
              <span className="text-xs text-gray-400">population</span>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <Building2 size={14} className="text-amber-400" />
              <span className="text-xs text-gray-300">{franchises.length} Active Listings</span>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-xs text-gray-300">Ontario-Wide Brands Expanding</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Market Insights */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-red-600" /> {city.name} Market Insights
              </h2>
              <ul className="space-y-2.5">
                {city.marketInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 shrink-0 font-bold">✓</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Active Listings */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">
                Franchises Available in {city.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {franchises.map((f) => (
                  <Link
                    key={f.id}
                    href={`/directory/${f.id}`}
                    className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-red-200 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                        style={{ background: f.logoBg, color: f.logoColor }}
                      >
                        {f.logoInitials}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors leading-snug">{f.name}</h3>
                        <span className="text-[10px] text-gray-400">{f.category}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-xs font-bold text-gray-900">${(f.financials.investmentMin/1000).toFixed(0)}K–${(f.financials.investmentMax/1000).toFixed(0)}K</div>
                        <div className="text-[10px] text-gray-400">Investment</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="text-xs font-bold text-gray-900">{f.financials.royaltyRate} royalty</div>
                        <div className="text-[10px] text-gray-400">Ongoing Fee</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{f.locations}+ Ontario locations</span>
                      <span className="text-red-600 font-semibold group-hover:underline">View Profile →</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href="/directory" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  View All Ontario Franchises <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Investment Climate */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-green-600" /> Investment Climate
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{city.investmentClimate}</p>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Top Categories in {city.name}</h3>
              <div className="flex flex-wrap gap-2">
                {city.topCategories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/directory?category=${encodeURIComponent(cat)}`}
                    className="bg-red-50 text-red-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Arthur Wishart Act */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                ⚖️ Arthur Wishart Act
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">{city.arthuriWishart}</p>
              <Link href="/resources#arthur-wishart" className="inline-block mt-2 text-xs text-amber-700 hover:underline font-medium">
                Learn more about your legal rights →
              </Link>
            </div>

            {/* Quiz CTA */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-5 text-white">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold text-sm mb-1">Find Your Match in {city.name}</h3>
              <p className="text-red-100 text-xs mb-3 leading-relaxed">
                Answer 5 quick questions and we'll match you to the best franchise for your budget and lifestyle.
              </p>
              <Link href="/quiz" className="block text-center bg-white text-red-600 font-bold text-xs py-2 rounded-lg hover:bg-red-50 transition-colors">
                Take the Franchise Fit Quiz →
              </Link>
            </div>

            {/* Other Cities */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Other Ontario Markets</h3>
              <div className="space-y-1">
                {[
                  { slug: 'toronto', name: 'Toronto / GTA' },
                  { slug: 'ottawa', name: 'Ottawa' },
                  { slug: 'mississauga', name: 'Mississauga' },
                  { slug: 'hamilton', name: 'Hamilton' },
                  { slug: 'london', name: 'London' },
                ].filter(c => c.slug !== params.city).slice(0, 4).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/ontario/${c.slug}`}
                    className="flex items-center justify-between py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors group"
                  >
                    {c.name}
                    <ChevronRight size={12} className="text-gray-300 group-hover:text-red-400" />
                  </Link>
                ))}
                <Link href="/ontario" className="block pt-2 text-xs text-red-600 hover:underline font-medium">
                  View all Ontario cities →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

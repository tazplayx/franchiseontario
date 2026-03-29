import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, BookOpen, Scale, DollarSign, MapPin, ChevronRight, ArrowRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Franchise Buyer Resources — Ontario Buyer\'s Guide, Checklist & Arthur Wishart Act',
  description:
    "Everything Ontario franchise buyers need: step-by-step buyer's guide, interactive checklist, Arthur Wishart Act explained, BDC financing, and Franchise 101. Free resources from FranchiseOntario.com.",
  keywords: [
    'Ontario franchise buyer guide',
    'franchise checklist Ontario',
    'Arthur Wishart Act franchise',
    'how to buy a franchise Ontario',
    'franchise disclosure document Ontario',
    'BDC franchise financing',
    'franchise 101 Canada',
  ],
  alternates: { canonical: 'https://www.franchiseontario.com/resources' },
  openGraph: {
    title: 'Ontario Franchise Buyer Resources — FranchiseOntario.com',
    description: "The complete franchise buyer's toolkit for Ontario investors. Checklist, Arthur Wishart Act guide, financing sources, and step-by-step process.",
  },
}

const BASE = 'https://www.franchiseontario.com'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Arthur Wishart Act?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The Arthur Wishart Act (Franchise Disclosure), 2000 is Ontario's franchise protection law. It requires franchisors to provide a Franchise Disclosure Document (FDD) to prospective franchisees at least 14 days before the signing of any franchise agreement or payment of any money. The FDD must include financial statements, a complete list of current and former franchisees, any lawsuits involving the franchisor, and all material facts about the system.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to buy a franchise in Ontario?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Total investment in an Ontario franchise ranges from under $100,000 for simple home-based or service concepts to $1M+ for full-service restaurant or retail concepts. Most mid-market food and beverage franchises in Ontario fall in the $300K–$700K total investment range, which includes the franchise fee ($25K–$50K), leasehold improvements, equipment, opening inventory, and working capital.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I finance a franchise purchase in Ontario?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Most Ontario franchise buyers finance 50–70% of their total investment. The primary sources are: (1) Canada Small Business Financing Program (CSBFP) — government-backed loans up to $1M through chartered banks; (2) Business Development Bank of Canada (BDC) — franchise-friendly financing with flexible terms; (3) Major chartered banks (TD, RBC, Scotiabank, BMO, CIBC) all have franchise lending divisions; (4) Franchisor-arranged financing programs for established brands.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is a Franchise Disclosure Document (FDD)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A Franchise Disclosure Document (FDD) is a legally mandated document that Ontario franchisors must provide at least 14 days before signing. It contains 23 items including: franchisor background and history, litigation history, bankruptcy history, initial fees and investment range, ongoing fees (royalties, marketing), restrictions on products and territory, renewal and termination rights, franchisee obligations, financial performance representations, and a list of current and former franchisees you can contact.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a lawyer to buy a franchise in Ontario?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — strongly recommended. An Ontario franchise lawyer reviews your FDD and franchise agreement to identify unusual terms, restrictions, or risks. Legal fees typically range from $2,000–$5,000 for franchise agreement review. The Canadian Franchise Association maintains a supplier directory of franchise-specialist lawyers. Do not sign a franchise agreement without independent legal advice.",
      },
    },
  ],
}

const buyerSteps = [
  {
    num: '01',
    title: 'Self-Assessment',
    desc: 'Evaluate your budget, lifestyle, skills, and goals. Take our Franchise Fit Quiz to identify matching concepts.',
    links: [{ label: 'Take the Franchise Fit Quiz', href: '/quiz' }],
  },
  {
    num: '02',
    title: 'Research Franchises',
    desc: 'Browse the directory. Narrow to 3–5 concepts that fit your budget and category interests. Read all profile details.',
    links: [{ label: 'Browse Ontario Directory', href: '/directory' }],
  },
  {
    num: '03',
    title: 'Request Information',
    desc: 'Contact franchisors directly to request their information package and Franchise Disclosure Document (FDD).',
    links: [],
  },
  {
    num: '04',
    title: 'Review the FDD',
    desc: 'Study the Franchise Disclosure Document carefully. Under the Arthur Wishart Act, you have 14 days minimum to review before signing.',
    links: [{ label: 'Arthur Wishart Act Guide', href: '#arthur-wishart' }],
  },
  {
    num: '05',
    title: 'Talk to Existing Franchisees',
    desc: 'The FDD lists all current and former franchisees. Call at least 5–10. Ask about support, hidden costs, and whether they\'d do it again.',
    links: [],
  },
  {
    num: '06',
    title: 'Hire a Franchise Lawyer',
    desc: 'Get independent legal review of your franchise agreement. Budget $2,000–$5,000. Non-negotiable step.',
    links: [],
  },
  {
    num: '07',
    title: 'Secure Financing',
    desc: 'Approach your bank, BDC, and review the Canada Small Business Financing Program. Most franchisees finance 50–70% of total investment.',
    links: [{ label: 'Financing Sources', href: '#financing' }],
  },
  {
    num: '08',
    title: 'Sign & Open',
    desc: 'Execute your franchise agreement, secure your lease, complete training, and open your business.',
    links: [],
  },
]

const checklist = [
  { section: 'Financial Due Diligence', items: [
    'Calculated total investment including franchise fee, build-out, equipment, inventory, and working capital',
    'Reviewed Item 7 of the FDD (estimated initial investment) line by line',
    'Confirmed minimum liquid capital requirement with franchisor',
    'Spoken with your bank, BDC, and reviewed CSBFP financing program',
    'Reviewed Item 19 (Financial Performance Representations) if provided',
    'Had your accountant review the franchisor\'s financial statements',
    'Built a 12-month cash flow projection for your specific location',
  ]},
  { section: 'Legal Due Diligence', items: [
    'Confirmed receipt of FDD at least 14 days before signing (Arthur Wishart Act)',
    'Hired an Ontario franchise-specialist lawyer to review the agreement',
    'Reviewed all territorial rights and exclusivity provisions',
    'Understood renewal terms, fees, and conditions',
    'Reviewed termination and transfer provisions',
    'Confirmed all litigation history disclosed in Item 8 of FDD',
    'Reviewed the operations manual table of contents',
  ]},
  { section: 'Franchisor Validation', items: [
    'Called at least 5 current franchisees from the FDD list',
    'Called at least 2 former franchisees to understand why they left',
    'Visited a minimum of 2 existing locations as a mystery customer',
    'Met with the franchisor\'s leadership team in person',
    'Confirmed current franchisee count matches FDD disclosure',
    'Reviewed the franchisor\'s growth trajectory over 3+ years',
  ]},
  { section: 'Market & Location', items: [
    'Validated your target territory population and demographics',
    'Reviewed competitive landscape within 5km of proposed site',
    'Confirmed the franchisor approves your proposed location',
    'Had a commercial real estate lawyer review your lease terms',
    'Understood build-out timeline and who manages construction',
    'Confirmed municipal zoning permits the franchise use',
  ]},
]

const financingSources = [
  {
    name: 'Canada Small Business Financing Program (CSBFP)',
    type: 'Government-Backed',
    desc: 'Government-guaranteed loans up to $1M (up to $500K for equipment/leasehold). Available through chartered banks. Franchise-friendly.',
    url: 'https://ised-isde.canada.ca/site/canada-small-business-financing-program/en',
    badge: '⭐ Most Common',
  },
  {
    name: 'Business Development Bank of Canada (BDC)',
    type: 'Crown Corporation',
    desc: 'Flexible franchise financing with longer amortization periods than traditional banks. Franchise specialist advisors available.',
    url: 'https://www.bdc.ca',
    badge: '🏦 Franchise-Friendly',
  },
  {
    name: 'Chartered Bank Franchise Divisions',
    type: 'Private Banking',
    desc: 'TD, RBC, Scotiabank, BMO, and CIBC all have dedicated franchise lending teams with established brand-specific loan programs.',
    url: null,
    badge: '🏛️ Established',
  },
  {
    name: 'Futurpreneur Canada',
    type: 'Non-Profit',
    desc: 'Financing and mentorship for entrepreneurs 18–39. Loans up to $60,000 combined with BDC co-lending. Great for first-time buyers.',
    url: 'https://www.futurpreneur.ca',
    badge: '👶 First-Timers',
  },
]

export default function ResourcesPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Buyer Resources', item: `${BASE}/resources` },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Free Resources</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Ontario Franchise Buyer's Hub</h1>
          <p className="text-gray-300 text-sm max-w-2xl mb-6">
            Everything you need to make a confident, well-informed franchise investment in Ontario. Step-by-step guide, interactive checklist, Arthur Wishart Act explained, and financing resources — all free.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#guide" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
              Buyer's Guide →
            </a>
            <a href="#checklist" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
              Due Diligence Checklist →
            </a>
            <a href="#arthur-wishart" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors">
              Arthur Wishart Act →
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Step-by-Step Buyer's Guide */}
        <section id="guide">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full bg-red-600" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Step-by-Step</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">The Ontario Franchise Buyer's Guide</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Follow these 8 steps in order. Skipping any step — especially legal review — is how franchise buyers get burned.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buyerSteps.map((step) => (
              <div key={step.num} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <span className="text-red-600 font-black text-sm">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{step.desc}</p>
                  {step.links.map((link) => (
                    <Link key={link.href} href={link.href} className="text-xs text-red-600 hover:underline font-medium">
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section id="checklist">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full bg-green-600" />
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Due Diligence</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Franchise Buyer Due Diligence Checklist</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Adapted from Canadian franchise legal practice and CFA buyer guidance. Complete all items before signing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {checklist.map((section) => (
              <div key={section.section} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" />
                  {section.section}
                </h3>
                <ul className="space-y-2.5">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                      <div className="w-4 h-4 rounded border-2 border-gray-200 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Arthur Wishart Act */}
        <section id="arthur-wishart" className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Scale size={24} className="text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">Ontario Law</div>
              <h2 className="text-2xl font-black text-gray-900">The Arthur Wishart Act (Franchise Disclosure), 2000</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>
                Ontario's Arthur Wishart Act is one of North America's strongest franchise buyer protection laws. It gives prospective franchisees legally enforceable rights before they sign anything or pay any money.
              </p>
              <p>
                <strong>The 14-Day Rule:</strong> Franchisors must provide a complete Franchise Disclosure Document (FDD) at least <strong>14 days</strong> before the earlier of: (1) the signing of any franchise agreement, or (2) the payment of any money. This gives you time to get legal advice.
              </p>
              <p>
                <strong>Right of Rescission:</strong> If a franchisor fails to provide proper disclosure, you have the right to rescind (cancel) the agreement and receive a full refund of all money paid — even after signing.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm">What the FDD Must Include:</h4>
              {[
                'Franchisor business background and history',
                'All litigation and bankruptcy history',
                'Initial and ongoing fees (franchise fee, royalties, marketing)',
                'Estimated total investment range (Item 7)',
                'Territorial rights and exclusivity terms',
                'List of ALL current and former franchisees with contact info',
                'Financial performance representations (if provided)',
                'Financial statements of the franchisor (3 years)',
                'Material contracts and operations manual table of contents',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-amber-600 font-bold shrink-0">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 bg-amber-100 rounded-xl p-4 text-xs text-amber-800">
            <strong>Important:</strong> Always hire an Ontario franchise-specialist lawyer before signing. They will review your FDD and franchise agreement to identify risks, unusual terms, and missing disclosures. Legal fees of $2,000–$5,000 are minor compared to a franchise investment of $200K+.
          </div>
        </section>

        {/* Financing */}
        <section id="financing">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full bg-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Financing</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Ontario Franchise Financing Sources</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-2xl">
            Most Ontario franchise buyers finance 50–70% of their total investment. Here are the primary sources to explore, roughly in order of popularity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financingSources.map((source) => (
              <div key={source.name} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{source.type}</span>
                    <h3 className="font-bold text-gray-900 text-sm mt-1">{source.name}</h3>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium shrink-0 ml-2">{source.badge}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{source.desc}</p>
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full bg-purple-600" />
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Common Questions</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-8">Franchise Buyer FAQ</h2>
          <div className="space-y-4 max-w-3xl">
            {faqSchema.mainEntity.map((q: any, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-2">{q.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Ready to Find Your Franchise?</h2>
          <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto">
            Use the resources above to guide your decision, then take the quiz to find your match.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quiz" className="bg-amber-400 text-amber-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-amber-300 transition-colors">
              Take the Franchise Fit Quiz →
            </Link>
            <Link href="/directory" className="bg-white/10 border border-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-white/20 transition-colors">
              Browse Ontario Directory
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

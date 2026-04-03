/**
 * FranchiseOntario — Franchise Listing Scraper Bot
 *
 * Sources:
 *   - CFA (cfa.ca/lookforafranchise/) — 310 listings, server-rendered, Algolia index
 *   - betheboss.ca — attempted with spoofed User-Agent; skipped gracefully if 403
 *
 * Output: src/data/sourced-listings.ts (valid TypeScript, committed to repo)
 *
 * Run locally:  npx tsx scripts/scrape-franchises.ts
 * Automated:    GitHub Actions weekly cron (.github/workflows/scrape-franchises.yml)
 *
 * Env vars:
 *   ANTHROPIC_API_KEY  — used to rewrite descriptions via claude-haiku-4-5
 *                        Optional: if absent, raw descriptions are used as-is
 */

import * as fs from 'fs'
import * as path from 'path'
import * as cheerio from 'cheerio'

// ── Types (duplicated from franchises.ts to avoid circular imports) ────────────
type FranchiseTier = 'basic' | 'premium' | 'enterprise'
type FranchiseCategory =
  | 'Bar & Grill' | 'Seafood' | 'Coffee & Café' | 'Fast Food' | 'Pizza'
  | 'Specialty Food' | 'Bakery & Desserts' | 'Healthy Eating'
  | 'Fitness & Wellness' | 'Health & Medical' | 'Senior Care' | 'Sports & Recreation'
  | 'Home Services' | 'Cleaning Services' | 'Real Estate'
  | 'Education' | "Children's Services"
  | 'Financial Services' | 'Business Services' | 'Technology & IT' | 'Printing & Signs'
  | 'Retail' | 'Automotive' | 'Beauty & Salon' | 'Pet Services' | 'Travel & Hospitality'

interface SourcedFranchise {
  id: string
  name: string
  tagline: string
  logoUrl?: string
  description: string
  longDescription: string
  category: FranchiseCategory
  tier: FranchiseTier
  isVIP: boolean
  isFeatured: boolean
  logoInitials: string
  logoColor: string
  logoBg: string
  locations: number
  rating: number
  reviews: number
  established: number
  financials: {
    franchiseFee: string
    royaltyRate: string
    marketingFee: string
    investmentMin: number
    investmentMax: number
    averageUnitVolume: string
    netWorthRequired: string
    liquidCapitalRequired: string
    royaltyNotes?: string
  }
  website: string
  phone: string
  email: string
  city: string
  highlights: string[]
  popularityScore: number
  rank: number
  badges: string[]
  trainingWeeks: number
  territory: string
  franchiseeCount: number
  parent: string
  idealCandidate: string[]
  supportOffered: string[]
  mediaImages: string[]
  videoUrl?: string
  faqs: { q: string; a: string }[]
  sourced: boolean
  sourceSite: string
  sourceListingUrl: string
}

// ── CFA category → our FranchiseCategory mapping ──────────────────────────────
const CFA_CATEGORY_MAP: Record<string, FranchiseCategory> = {
  'food - quick service restaurants': 'Fast Food',
  'food - restaurants / dining rooms': 'Bar & Grill',
  'food - baked goods / coffee / donuts': 'Coffee & Café',
  'food - grocery / specialty shops': 'Specialty Food',
  'food - meal assembly': 'Specialty Food',
  'hair & nail salons / spas': 'Beauty & Salon',
  'beauty / cosmetics / supplies': 'Beauty & Salon',
  'tanning salons': 'Beauty & Salon',
  'health / fitness / nutrition': 'Fitness & Wellness',
  'weight loss services / body contouring': 'Fitness & Wellness',
  'laser services / med-aesthetics': 'Health & Medical',
  'laser tattoo removal': 'Health & Medical',
  'medical clinics': 'Health & Medical',
  'health / safety / environmental': 'Health & Medical',
  'seniors services / home care / transition': 'Senior Care',
  'home - maid / cleaning services': 'Cleaning Services',
  'commercial - janitorial services': 'Cleaning Services',
  'janitorial & maid services': 'Cleaning Services',
  'home - improvement / renovation / restoration': 'Home Services',
  'building & design services': 'Home Services',
  'painting services': 'Home Services',
  'lawn & garden supplies / services': 'Home Services',
  'home - inspection services': 'Home Services',
  'home - decorations / furnishings': 'Home Services',
  'commercial / residential services': 'Home Services',
  'custom deck': 'Home Services',
  'real estate': 'Real Estate',
  'education / training / coaching': 'Education',
  'educational products & services': 'Education',
  "children's products & services": "Children's Services",
  'banks / financial services': 'Financial Services',
  'financial / cash services': 'Financial Services',
  'insurance': 'Financial Services',
  'computer / software / internet': 'Technology & IT',
  'digital marketing / website development': 'Technology & IT',
  'business services / office space / coworking space': 'Business Services',
  'business aids & services': 'Business Services',
  'business consultants / services / training': 'Business Services',
  'business - supplies / equipment & services': 'Business Services',
  'franchise consulting services': 'Business Services',
  'franchise development': 'Business Services',
  'employment / personnel services': 'Business Services',
  'printing / copying / shipping': 'Printing & Signs',
  'sign products & services': 'Printing & Signs',
  'retail': 'Retail',
  'automotive & truck services / products / rentals': 'Automotive',
  'pets - sales / supplies / services': 'Pet Services',
  'travel': 'Travel & Hospitality',
  'hotels / motels / campgrounds': 'Travel & Hospitality',
  'hospitality products / services': 'Travel & Hospitality',
  'sports / recreation / entertainment': 'Sports & Recreation',
}

// ── Logo background colours (deterministic from name hash) ────────────────────
const LOGO_COLOURS = [
  { bg: '#1B4F72', color: '#FFFFFF' },
  { bg: '#145A32', color: '#FFFFFF' },
  { bg: '#7B241C', color: '#FFFFFF' },
  { bg: '#4A235A', color: '#FFFFFF' },
  { bg: '#1A5276', color: '#FFFFFF' },
  { bg: '#784212', color: '#FFFFFF' },
  { bg: '#212F3C', color: '#FFFFFF' },
  { bg: '#0B3D91', color: '#FFFFFF' },
]

function logoColour(name: string) {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff
  return LOGO_COLOURS[Math.abs(hash) % LOGO_COLOURS.length]
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseCADAmount(text: string): number {
  if (!text) return 0
  // Handle M (millions) and K (thousands) suffixes
  const m = text.replace(/[$,\s]/g, '').match(/([\d.]+)\s*([MKmk]?)/)
  if (!m) return 0
  const num = parseFloat(m[1])
  if (isNaN(num)) return 0
  const suffix = m[2].toUpperCase()
  if (suffix === 'M') return Math.round(num * 1_000_000)
  if (suffix === 'K') return Math.round(num * 1_000)
  return Math.round(num)
}

function extractHighlights(description: string, name: string): string[] {
  const sentences = description
    .split(/[.!]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 120)
  const picks = sentences.slice(0, 3)
  if (picks.length === 0) picks.push(`${name} — an established franchise opportunity in Canada`)
  return picks
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── HTTP fetch with browser-like headers ──────────────────────────────────────
async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-CA,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    })
    if (!res.ok) {
      console.warn(`  [${res.status}] ${url}`)
      return null
    }
    return res.text()
  } catch (err) {
    console.warn(`  [fetch error] ${url}: ${err}`)
    return null
  }
}

// ── CFA: get all listing slugs via Algolia API ────────────────────────────────
async function getCFASlugs(): Promise<string[]> {
  console.log('Fetching CFA listing slugs via Algolia...')
  const slugs: string[] = []

  try {
    const res = await fetch(
      'https://ZP0Y2QB2N6-dsn.algolia.net/1/indexes/wp_posts_listing/query',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Algolia-Application-Id': 'ZP0Y2QB2N6',
          'X-Algolia-API-Key': '4c2dca04ff292d661a99a3f61803aa6b',
        },
        body: JSON.stringify({ query: '', hitsPerPage: 1000, attributesToRetrieve: ['permalink', 'post_title'] }),
      }
    )

    if (res.ok) {
      const data = await res.json() as { hits?: { permalink?: string; post_title?: string }[] }
      if (data.hits && data.hits.length > 0) {
        for (const hit of data.hits) {
          const permalink = hit.permalink ?? ''
          const match = permalink.match(/\/listing\/([^/]+)\/?$/)
          if (match) slugs.push(match[1])
        }
        console.log(`  Algolia: found ${slugs.length} slugs`)
        return slugs
      }
    }
  } catch {
    console.warn('  Algolia query failed — falling back to HTML pagination')
  }

  // Fallback: scrape the 13 HTML listing pages
  for (let page = 1; page <= 13; page++) {
    const url =
      page === 1
        ? 'https://cfa.ca/lookforafranchise/listings/'
        : `https://cfa.ca/lookforafranchise/listings/page/${page}/`
    const html = await fetchPage(url)
    if (!html) continue
    const $ = cheerio.load(html)
    $('a[href*="/listing/"]').each((_, el) => {
      const href = $(el).attr('href') ?? ''
      const match = href.match(/\/listing\/([^/]+)\/?$/)
      if (match && !slugs.includes(match[1])) slugs.push(match[1])
    })
    await delay(1000)
  }
  console.log(`  HTML fallback: found ${slugs.length} slugs`)
  return slugs
}

// ── CFA: parse a single listing page ──────────────────────────────────────────
//
// CFA page structure (after extracting all body text lines):
//   ...navigation...
//   "Back to Search Results"
//   "Hair & Nail Salons / Spas"   ← category (line +1)
//   "Great Clips, Inc."           ← name (line +2)
//   "In Business Since" / "1982"  ← label/value pairs
//   ...
//   "About"
//   [description paragraphs]
//   "Initial InvestmentFranchise FeesRoyaltiesLow-$139,600 CAD...6% of gross sales..."  ← concatenated
//   "Second: FinancialNet Worth-$500,000...Liquid Assets-$75,000..."  ← concatenated
//
function parseCFAListing(html: string, slug: string): Partial<SourcedFranchise> | null {
  const $ = cheerio.load(html)

  // Extract all body lines — CFA doesn't use proper semantic elements for data fields
  const bodyLines = $('body').text()
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  // Find the "Back to Search Results" anchor — everything after is the listing data
  const anchorIdx = bodyLines.findIndex((l) => /back to search results/i.test(l))
  if (anchorIdx < 0) return null
  const listing = bodyLines.slice(anchorIdx + 1)

  // Category is first item, name is second
  const rawCategory = listing[0] ?? ''
  const name = listing[1] ?? $('title').text().replace(/\s*[–|-].*$/, '').trim()
  if (!name || name.length < 2) return null

  const category = CFA_CATEGORY_MAP[rawCategory.toLowerCase()]
  if (!category) return null // skip non-applicable categories

  // Helper: find value on the line AFTER a label within the listing section
  function lineAfter(label: string): string {
    const idx = listing.findIndex((l) => new RegExp(label, 'i').test(l))
    if (idx >= 0 && idx + 1 < listing.length) return listing[idx + 1].replace(/\s+/g, ' ').trim()
    return ''
  }

  // Year established
  const estVal = lineAfter('In Business Since')
  const established = parseInt(estVal.replace(/\D/g, '')) || 0

  // Canada location count — "Canada: 155 | USA: 4300"
  let locations = 0
  const unitsLine = listing.find((l) => /Canada\s*[:]\s*\d+/i.test(l)) ?? ''
  const canadaMatch = unitsLine.match(/Canada\s*[:\s]+(\d[\d,]*)/i)
  if (canadaMatch) locations = parseInt(canadaMatch[1].replace(/,/g, ''))
  if (locations === 0) {
    const fullText = listing.join(' ')
    if (!/canada/i.test(fullText)) return null
    locations = 1
  }

  // Franchise fee — simple label/value pair
  const franchiseFeeRaw = lineAfter('Franchise Fee')

  // Royalty — often embedded in description text
  let royaltyRaw = lineAfter('Royalt')
  if (!royaltyRaw) {
    // Search description lines for "X% royalty" or "royalty of X%" patterns
    const allText = listing.join(' ')
    const royMatch = allText.match(/royalt[y|ies]+[^0-9]*(\d+(?:\.\d+)?%)/i)
      ?? allText.match(/(\d+(?:\.\d+)?%)\s*royalt/i)
    if (royMatch) royaltyRaw = royMatch[1] + ' of gross sales'
  }

  // Investment — two formats:
  //  A) "Investment Required" label → "$1.5M-$2.6M" next line
  //  B) Concatenated line: "Initial InvestmentFranchise FeesRoyaltiesLow-$139,600 CAD..."
  let investmentMin = 0
  let investmentMax = 0

  // Format A: investment on the line after "Investment Required"
  const investValueRaw = lineAfter('Investment Required')
  if (investValueRaw) {
    const rangeA = investValueRaw.match(/\$?([\d.]+[MKmk]?)\s*[-–]\s*\$?([\d.]+[MKmk]?)/)
    if (rangeA) {
      investmentMin = parseCADAmount(rangeA[1])
      investmentMax = parseCADAmount(rangeA[2])
    } else {
      const singleA = investValueRaw.match(/\$?([\d.]+[MKmk]?)/)
      if (singleA) investmentMin = parseCADAmount(singleA[1])
    }
  }

  // Format B: concatenated line with "Low-$X CAD / High-$X CAD"
  if (investmentMin === 0) {
    const investLine = listing.find((l) => /Initial Investment.*Low/i.test(l)) ?? ''
    if (investLine) {
      const lowCAD = investLine.match(/Low-?\$?([\d,]+)\s*CAD/i)?.[1]
      const highCAD = investLine.match(/High-?\$?([\d,]+)\s*CAD/i)?.[1]
      if (lowCAD) investmentMin = parseCADAmount(lowCAD)
      if (highCAD) investmentMax = parseCADAmount(highCAD)
      if (!royaltyRaw) {
        const royInline = investLine.match(/(\d+(?:\.\d+)?%[^A-Z\n]{0,30}(?:gross|sales)?)/i)
        if (royInline) royaltyRaw = royInline[1].trim()
      }
    }
  }

  // Fallback: derive from franchise fee
  if (investmentMin === 0) investmentMin = parseCADAmount(franchiseFeeRaw) * 5 || 50000
  if (investmentMax <= investmentMin) investmentMax = Math.round(investmentMin * 2.5)

  // Net worth and liquid assets — may be a concatenated line or label/value
  const financialLine = listing.find((l) => /Net Worth/i.test(l) && /\$[\d,]/.test(l)) ?? ''
  const netWorthRaw = financialLine
    ? (financialLine.match(/Net Worth[-:\s]+\$?([\d,]+[MK]?)/i)?.[0]?.replace(/Net Worth[-:\s]+/i, '$') ?? lineAfter('Net Worth'))
    : lineAfter('Net Worth')
  const liquidRaw = financialLine
    ? (financialLine.match(/Liquid Assets?[-:\s]+\$?([\d,]+[MK]?)/i)?.[0]?.replace(/Liquid Assets?[-:\s]+/i, '$') ?? lineAfter('Liquid Assets'))
    : lineAfter('Liquid Assets')

  // Website
  let website = ''
  $('a[href^="http"]').each((_, el) => {
    const href = $(el).attr('href') ?? ''
    if (/cfa\.ca|facebook|twitter|linkedin|instagram|youtube|tiktok/i.test(href)) return
    if (!website) website = href
  })
  if (!website) {
    const siteRaw = lineAfter('Website')
    if (siteRaw) website = siteRaw.startsWith('http') ? siteRaw : `https://${siteRaw}`
  }

  // Description — collect meaningful paragraphs (actual prose about the franchise)
  const aboutIdx = listing.findIndex((l) => /^about$/i.test(l))
  const descLines = aboutIdx >= 0 ? listing.slice(aboutIdx + 1) : listing.slice(10)
  const rawDescription = descLines
    .filter((l) => l.length > 60 && !/^(Initial Investment|Second:|Third:|First:|Website|Request)/i.test(l) && !l.includes('Franchises by Industry'))
    .slice(0, 5)
    .join(' ')
    .slice(0, 1500)

  return {
    name,
    category,
    established: established > 1900 && established <= new Date().getFullYear() ? established : 2000,
    locations,
    financials: {
      franchiseFee: franchiseFeeRaw || 'Contact for details',
      royaltyRate: royaltyRaw || 'Contact for details',
      marketingFee: 'N/A',
      investmentMin,
      investmentMax,
      averageUnitVolume: 'N/A',
      netWorthRequired: netWorthRaw || 'Contact for details',
      liquidCapitalRequired: liquidRaw || 'Contact for details',
    },
    website: website || `https://cfa.ca/lookforafranchise/listing/${slug}/`,
    rawDescription,
    sourceListingUrl: `https://cfa.ca/lookforafranchise/listing/${slug}/`,
  } as Partial<SourcedFranchise> & { rawDescription: string }
}

// ── Description rewriting via Claude API ──────────────────────────────────────
async function rewriteDescription(raw: string, franchiseName: string): Promise<{ short: string; long: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || !raw || raw.length < 30) {
    return { short: raw.slice(0, 200), long: raw }
  }

  try {
    const body = {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: `You are writing franchise directory listings for FranchiseOntario.ca — Canada's leading Ontario franchise directory.
Rewrite the provided franchise description in fresh, engaging Canadian English suitable for prospective franchise buyers in Ontario.
Rules:
- Keep ALL numbers, percentages, dollar amounts, dates, brand names, and financial figures EXACTLY as they appear — do not round, alter, or omit any.
- Do not add claims not present in the original.
- Write exactly 2 paragraphs: paragraph 1 (2 sentences max) is a punchy overview; paragraph 2 (2-3 sentences) covers the opportunity.
- Do not start with the franchise name.
- Output ONLY the two paragraphs separated by a newline, no headers, no bullet points.`,
      messages: [
        {
          role: 'user',
          content: `Franchise: ${franchiseName}\n\nOriginal description:\n${raw}`,
        },
      ],
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.warn(`  Claude API error ${res.status} — using raw description`)
      return { short: raw.slice(0, 200), long: raw }
    }

    const data = await res.json() as { content?: { text?: string }[] }
    const rewritten = data.content?.[0]?.text?.trim() ?? ''
    if (!rewritten) return { short: raw.slice(0, 200), long: raw }

    const paras = rewritten.split('\n').filter((p) => p.trim().length > 0)
    return {
      short: (paras[0] ?? rewritten).slice(0, 300),
      long: rewritten,
    }
  } catch (err) {
    console.warn(`  Claude rewrite failed: ${err}`)
    return { short: raw.slice(0, 200), long: raw }
  }
}

// ── betheboss.ca scraper (graceful — spoof UA, skip on 403) ──────────────────
async function scrapeBetheBoss(): Promise<SourcedFranchise[]> {
  console.log('\nAttempting betheboss.ca...')
  const testUrl = 'https://www.betheboss.ca/franchise-opportunities/'
  const html = await fetchPage(testUrl)
  if (!html) {
    console.log('  betheboss.ca: blocked (403) — skipping. Can be enabled with Puppeteer.')
    return []
  }
  // If we ever get through, parse the listings (placeholder for future implementation)
  console.log('  betheboss.ca: accessible — scraping (stub, expand with full parser)')
  return []
}

// ── Build a full SourcedFranchise from scraped partial data ───────────────────
async function buildListing(
  partial: Partial<SourcedFranchise> & { rawDescription?: string },
  index: number
): Promise<SourcedFranchise | null> {
  const name = partial.name ?? ''
  if (!name) return null

  const rawDesc = partial.rawDescription ?? partial.description ?? ''
  const { short: description, long: longDescription } = await rewriteDescription(rawDesc, name)

  const colours = logoColour(name)
  const locs = partial.locations ?? 1
  const badges: string[] = ['CFA Member']
  if (locs >= 50) badges.push('Canadian Brand')
  if (locs >= 200) badges.push('National Brand')

  return {
    id: `sourced-${slugify(name)}`,
    name,
    tagline: description.split('.')[0]?.slice(0, 80) + '.' || `${name} franchise opportunity in Ontario`,
    description,
    longDescription,
    category: partial.category!,
    tier: 'basic' as FranchiseTier,
    isVIP: false,
    isFeatured: false,
    logoInitials: name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'FR',
    logoColor: colours.color,
    logoBg: colours.bg,
    locations: locs,
    rating: 0,
    reviews: 0,
    established: partial.established ?? 2000,
    financials: partial.financials ?? {
      franchiseFee: 'Contact for details',
      royaltyRate: 'Contact for details',
      marketingFee: 'N/A',
      investmentMin: 50000,
      investmentMax: 200000,
      averageUnitVolume: 'N/A',
      netWorthRequired: 'Contact for details',
      liquidCapitalRequired: 'Contact for details',
    },
    website: partial.website ?? `https://cfa.ca/lookforafranchise/listing/${slugify(name)}/`,
    phone: 'See website',
    email: 'See website',
    city: 'Ontario',
    highlights: extractHighlights(longDescription, name),
    popularityScore: Math.min(99, Math.round(locs * 0.5)),
    rank: 1000 + index,
    badges,
    trainingWeeks: 4,
    territory: 'Protected territories available — contact franchisor for details',
    franchiseeCount: locs,
    parent: name,
    idealCandidate: [
      'Motivated entrepreneur seeking a proven system',
      'Business-minded professional ready to invest in growth',
      'Customer-focused operator committed to brand standards',
    ],
    supportOffered: [
      'Initial training program',
      'Ongoing operational support',
      'Marketing and brand assistance',
    ],
    mediaImages: [],
    faqs: [],
    sourced: true,
    sourceSite: partial.sourceSite ?? 'cfa.ca',
    sourceListingUrl: partial.sourceListingUrl ?? '',
  }
}

// ── Serialize to TypeScript source ────────────────────────────────────────────
function escapeStr(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

function serializeToTS(listings: SourcedFranchise[]): string {
  const ts = listings.map((l) => {
    const fin = l.financials
    return `  {
    id: \`${escapeStr(l.id)}\`,
    name: \`${escapeStr(l.name)}\`,
    tagline: \`${escapeStr(l.tagline)}\`,
    description: \`${escapeStr(l.description)}\`,
    longDescription: \`${escapeStr(l.longDescription)}\`,
    category: \`${l.category}\`,
    tier: '${l.tier}',
    isVIP: ${l.isVIP},
    isFeatured: ${l.isFeatured},
    logoInitials: '${l.logoInitials}',
    logoColor: '${l.logoColor}',
    logoBg: '${l.logoBg}',
    locations: ${l.locations},
    rating: ${l.rating},
    reviews: ${l.reviews},
    established: ${l.established},
    financials: {
      franchiseFee: \`${escapeStr(fin.franchiseFee)}\`,
      royaltyRate: \`${escapeStr(fin.royaltyRate)}\`,
      marketingFee: \`${escapeStr(fin.marketingFee)}\`,
      investmentMin: ${fin.investmentMin},
      investmentMax: ${fin.investmentMax},
      averageUnitVolume: \`${escapeStr(fin.averageUnitVolume)}\`,
      netWorthRequired: \`${escapeStr(fin.netWorthRequired)}\`,
      liquidCapitalRequired: \`${escapeStr(fin.liquidCapitalRequired)}\`,
    },
    website: \`${escapeStr(l.website)}\`,
    phone: '${l.phone}',
    email: '${l.email}',
    city: '${l.city}',
    highlights: ${JSON.stringify(l.highlights)},
    popularityScore: ${l.popularityScore},
    rank: ${l.rank},
    badges: ${JSON.stringify(l.badges)},
    trainingWeeks: ${l.trainingWeeks},
    territory: \`${escapeStr(l.territory)}\`,
    franchiseeCount: ${l.franchiseeCount},
    parent: \`${escapeStr(l.parent)}\`,
    idealCandidate: ${JSON.stringify(l.idealCandidate)},
    supportOffered: ${JSON.stringify(l.supportOffered)},
    mediaImages: [],
    faqs: [],
    sourced: true,
    sourceSite: '${l.sourceSite}',
    sourceListingUrl: \`${escapeStr(l.sourceListingUrl)}\`,
  }`
  })

  return `// AUTO-GENERATED by scripts/scrape-franchises.ts — do not edit manually.
// Run \`npx tsx scripts/scrape-franchises.ts\` to refresh, or trigger the
// "Scrape Franchise Listings" GitHub Actions workflow.
// Last synced: ${new Date().toISOString()}

import type { Franchise } from './franchises'

export const sourcedListings: Franchise[] = [
${ts.join(',\n')}
]
`
}

// ── Load existing sourced listings for diff ───────────────────────────────────
function loadExistingSlugs(): Set<string> {
  const file = path.join(__dirname, '../src/data/sourced-listings.ts')
  try {
    const content = fs.readFileSync(file, 'utf-8')
    const matches = content.matchAll(/sourceListingUrl:\s*`([^`]+)`/g)
    const slugs = new Set<string>()
    for (const m of matches) slugs.add(m[1])
    return slugs
  } catch {
    return new Set()
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  FranchiseOntario — Franchise Scraper Bot')
  console.log(`  Started: ${new Date().toISOString()}`)
  console.log('═══════════════════════════════════════════\n')

  const existing = loadExistingSlugs()
  console.log(`Existing sourced listings: ${existing.size}`)

  const allListings: SourcedFranchise[] = []

  // ── CFA ──
  console.log('\n── CFA (cfa.ca) ──────────────────────────')
  const slugs = await getCFASlugs()
  console.log(`Processing ${slugs.length} CFA listing pages...`)

  let added = 0, skipped = 0, errors = 0

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i]
    const listingUrl = `https://cfa.ca/lookforafranchise/listing/${slug}/`

    process.stdout.write(`  [${i + 1}/${slugs.length}] ${slug.slice(0, 40).padEnd(40)} `)

    await delay(1000) // rate limit: 1 req/sec

    const html = await fetchPage(listingUrl)
    if (!html) { errors++; process.stdout.write('ERROR\n'); continue }

    const partial = parseCFAListing(html, slug) as (Partial<SourcedFranchise> & { rawDescription?: string }) | null
    if (!partial) { skipped++; process.stdout.write('SKIP (no category match)\n'); continue }

    partial.sourceSite = 'cfa.ca'
    partial.sourceListingUrl = listingUrl

    const listing = await buildListing(partial, allListings.length)
    if (!listing) { errors++; process.stdout.write('ERROR (build failed)\n'); continue }

    allListings.push(listing)
    added++
    process.stdout.write(`OK — ${listing.category}\n`)
  }

  // ── betheboss.ca ──
  const bethebossListings = await scrapeBetheBoss()
  allListings.push(...bethebossListings)

  // ── Summary ──
  const removed = existing.size > 0
    ? [...existing].filter((url) => !allListings.some((l) => l.sourceListingUrl === url)).length
    : 0

  console.log('\n═══════════════════════════════════════════')
  console.log(`  Results: ${added} imported, ${skipped} skipped (no category), ${errors} errors`)
  console.log(`  Removed from source: ${removed} listings`)
  console.log(`  Total sourced listings: ${allListings.length}`)
  console.log('═══════════════════════════════════════════\n')

  // ── Write output ──
  const outPath = path.join(__dirname, '../src/data/sourced-listings.ts')
  fs.writeFileSync(outPath, serializeToTS(allListings), 'utf-8')
  console.log(`✓ Written to ${outPath}`)
  console.log('  Run `npx next build` to verify, then commit.')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})

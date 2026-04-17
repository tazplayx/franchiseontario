import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ---------------------------------------------------------------------------
// Topic library — 24 diverse franchise topics for Ontario/Canada market
// ---------------------------------------------------------------------------

const TOPICS = [
  {
    title: 'Top 10 Food Franchise Opportunities in Ontario Under $300K',
    category: 'Top Lists',
    tags: ['food franchise Ontario', 'restaurant franchise Canada', 'franchise under 300k', 'QSR Ontario', 'food business Ontario'],
    imageQuery: 'restaurant food franchise counter',
    unsplashId: '1504674900247-0877df9cc836',
  },
  {
    title: 'How to Finance Your First Ontario Franchise: BDC, Banks, and SBA Alternatives',
    category: 'Financing',
    tags: ['franchise financing Ontario', 'BDC franchise loan', 'franchise funding Canada', 'small business loan Ontario', 'franchise investment'],
    imageQuery: 'business financing bank loan',
    unsplashId: '1554224155-6726b3ff858f',
  },
  {
    title: 'Ontario Franchise Market 2026: Cities With the Highest Demand',
    category: 'Market Insights',
    tags: ['Ontario franchise market', 'franchise cities Ontario', 'GTA franchise investment', 'franchise demand Canada', 'best cities franchise'],
    imageQuery: 'Toronto city skyline Ontario',
    unsplashId: '1486406146926-c627a92ad1ab',
  },
  {
    title: '7 Questions to Ask Before Signing a Franchise Agreement in Ontario',
    category: 'Legal Guide',
    tags: ['franchise agreement Ontario', 'franchise due diligence', 'Arthur Wishart Act', 'franchise contract review', 'Ontario franchise law'],
    imageQuery: 'legal contract signing documents',
    unsplashId: '1450101499163-c8848c66ca85',
  },
  {
    title: 'Top 5 Coffee and Café Franchises Available in Ontario Right Now',
    category: 'Top Lists',
    tags: ['coffee franchise Ontario', 'café franchise Canada', 'Tim Hortons alternative', 'coffee shop franchise', 'beverage franchise Ontario'],
    imageQuery: 'coffee cafe espresso shop',
    unsplashId: '1554118811-1e0d58224f24',
  },
  {
    title: 'Fitness Franchise vs. Independent Gym: What Ontario Investors Should Know',
    category: 'Buying Tips',
    tags: ['fitness franchise Ontario', 'gym franchise Canada', 'Anytime Fitness Ontario', 'GoodLife competition', 'fitness business Ontario'],
    imageQuery: 'gym fitness franchise studio',
    unsplashId: '1534438327276-14e5300c3a48',
  },
  {
    title: 'Home Services Franchises: Why Ontario\'s Aging Housing Stock Is a Gold Mine',
    category: 'Market Insights',
    tags: ['home services franchise Ontario', 'renovation franchise Canada', 'cleaning franchise Ontario', 'home improvement franchise', 'service franchise'],
    imageQuery: 'home services renovation contractor',
    unsplashId: '1581578731548-c64695cc6952',
  },
  {
    title: 'Education and Tutoring Franchises in Ontario: The $2B Opportunity',
    category: 'Market Insights',
    tags: ['education franchise Ontario', 'tutoring franchise Canada', 'Kumon Ontario', 'learning centre franchise', 'children education franchise'],
    imageQuery: 'education tutoring children learning',
    unsplashId: '1427504494785-3a9ca7044f45',
  },
  {
    title: 'Multi-Unit Franchising in Ontario: How to Go From 1 to 5 Locations',
    category: 'Buying Tips',
    tags: ['multi-unit franchise Ontario', 'franchise expansion Canada', 'area developer franchise', 'scaling franchise business', 'multi-location Ontario'],
    imageQuery: 'business expansion growth multiple locations',
    unsplashId: '1486406146926-c627a92ad1ab',
  },
  {
    title: 'The Arthur Wishart Act: Complete Guide for Ontario Franchise Buyers 2026',
    category: 'Legal Guide',
    tags: ['Arthur Wishart Act Ontario', 'franchise law Ontario', 'FDD Ontario', 'franchise disclosure document', 'Ontario franchise rights'],
    imageQuery: 'legal law Ontario courthouse',
    unsplashId: '1589829545856-d10d557cf95f',
  },
  {
    title: 'Automotive Franchise Opportunities in Ontario: From Oil Changes to Collision Repair',
    category: 'Top Lists',
    tags: ['automotive franchise Ontario', 'car service franchise Canada', 'Midas Ontario', 'auto repair franchise', 'vehicle franchise Ontario'],
    imageQuery: 'automotive car service garage',
    unsplashId: '1503376780353-7e6692767b70',
  },
  {
    title: 'Beauty and Wellness Franchises: Ontario\'s Fastest-Growing Franchise Category',
    category: 'Market Insights',
    tags: ['beauty franchise Ontario', 'wellness franchise Canada', 'salon franchise Ontario', 'spa franchise', 'beauty business Ontario'],
    imageQuery: 'beauty salon wellness spa',
    unsplashId: '1560066984-138dadb4c035',
  },
  {
    title: 'Children\'s Franchises in Ontario: Programs, Sports, and Entertainment',
    category: 'Top Lists',
    tags: ['children franchise Ontario', 'kids programs franchise Canada', 'Sportball Ontario', 'child enrichment franchise', 'family franchise Ontario'],
    imageQuery: 'children activities programs sports',
    unsplashId: '1503454537195-1dcabb73ffb9',
  },
  {
    title: 'Pizza Franchise Opportunities in Ontario: Beyond Domino\'s and Pizza Pizza',
    category: 'Top Lists',
    tags: ['pizza franchise Ontario', 'QSR pizza Canada', 'pizza business Ontario', 'food franchise investment', 'pizza delivery franchise'],
    imageQuery: 'pizza restaurant franchise kitchen',
    unsplashId: '1513104890138-7c749659a591',
  },
  {
    title: 'Retail Franchise Opportunities in Ontario: What\'s Still Working in 2026',
    category: 'Buying Tips',
    tags: ['retail franchise Ontario', 'store franchise Canada', 'retail business franchise', 'franchise shop Ontario', 'brick and mortar franchise'],
    imageQuery: 'retail store shop franchise',
    unsplashId: '1441986300917-64674bd600d8',
  },
  {
    title: 'How to Evaluate a Franchise FDD: 10 Red Flags Ontario Buyers Must Catch',
    category: 'Legal Guide',
    tags: ['FDD red flags Ontario', 'franchise disclosure document review', 'franchise due diligence Canada', 'franchise agreement issues', 'franchise lawyer Ontario'],
    imageQuery: 'business document review analysis',
    unsplashId: '1450101499163-c8848c66ca85',
  },
  {
    title: 'Senior Care and Home Health Franchises: Ontario\'s Demographic Opportunity',
    category: 'Market Insights',
    tags: ['senior care franchise Ontario', 'home health franchise Canada', 'Nurse Next Door Ontario', 'aging population franchise', 'health service franchise'],
    imageQuery: 'senior care home health caregiver',
    unsplashId: '1581578731548-c64695cc6952',
  },
  {
    title: 'Buying a Resale Franchise in Ontario: Pros, Cons, and What to Watch',
    category: 'Buying Tips',
    tags: ['resale franchise Ontario', 'buying existing franchise Canada', 'franchise resale due diligence', 'used franchise Ontario', 'franchise transfer'],
    imageQuery: 'business sale transfer handshake',
    unsplashId: '1486406146926-c627a92ad1ab',
  },
  {
    title: 'Low-Cost Franchises Under $50K in Ontario: 8 Legitimate Options for 2026',
    category: 'Top Lists',
    tags: ['low cost franchise Ontario', 'franchise under 50k Canada', 'affordable franchise Ontario', 'budget franchise investment', 'small franchise Ontario'],
    imageQuery: 'small business affordable startup',
    unsplashId: '1504674900247-0877df9cc836',
  },
  {
    title: 'How Ontario\'s Population Growth Is Driving Franchise Demand in the 905',
    category: 'Market Insights',
    tags: ['905 franchise market', 'Mississauga franchise', 'Brampton franchise opportunity', 'Markham franchise', 'GTA suburbs franchise'],
    imageQuery: 'suburban Ontario growth development',
    unsplashId: '1517935706615-2717063c2225',
  },
  {
    title: 'Franchise vs. Starting From Scratch: What Ontario Entrepreneurs Need to Weigh',
    category: 'Buying Tips',
    tags: ['franchise vs independent business Ontario', 'should I buy a franchise Canada', 'franchise pros cons Ontario', 'starting business Ontario', 'franchise decision'],
    imageQuery: 'entrepreneur decision business choice',
    unsplashId: '1486406146926-c627a92ad1ab',
  },
  {
    title: 'Canadian Franchise Association Awards 2025: Ontario Winners and What They Did Right',
    category: 'Top Lists',
    tags: ['CFA awards 2025', 'best franchise Canada 2025', 'Ontario franchise award', 'top franchise brand Canada', 'franchise excellence'],
    imageQuery: 'business award recognition ceremony',
    unsplashId: '1521737604893-d14cc237f11d',
  },
  {
    title: 'Cleaning and Maintenance Franchises in Ontario: B2B vs. Residential Models',
    category: 'Buying Tips',
    tags: ['cleaning franchise Ontario', 'Jan-Pro Ontario', 'Jani-King Canada', 'residential cleaning franchise', 'commercial cleaning franchise Ontario'],
    imageQuery: 'cleaning service commercial franchise',
    unsplashId: '1581578731548-c64695cc6952',
  },
  {
    title: 'How to Choose a Franchise Lawyer in Ontario: What to Look For and What to Pay',
    category: 'Legal Guide',
    tags: ['franchise lawyer Ontario', 'franchise attorney Canada', 'legal advice franchise Ontario', 'franchise law firm Ontario', 'FDD lawyer cost'],
    imageQuery: 'lawyer legal office consultation',
    unsplashId: '1589829545856-d10d557cf95f',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function pickTopic(existingPosts) {
  const usedTitles = new Set(existingPosts.map((p) => p.title))
  const unused = TOPICS.filter((t) => !usedTitles.has(t.title))
  if (unused.length > 0) {
    return unused[0]
  }
  // Wrap around — pick oldest by position
  return TOPICS[existingPosts.length % TOPICS.length]
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set.')
    process.exit(1)
  }

  const client = new Anthropic({ apiKey })

  // Read existing posts
  const dataPath = join(__dirname, '..', 'src', 'data', 'blog-posts.json')
  let existingPosts = []
  try {
    const raw = readFileSync(dataPath, 'utf-8')
    existingPosts = JSON.parse(raw)
  } catch {
    console.log('No existing blog-posts.json found — starting fresh.')
  }

  const topic = pickTopic(existingPosts)
  console.log(`Generating post: "${topic.title}"`)
  console.log(`Category: ${topic.category}`)

  const prompt = `You are an expert content writer for FranchiseOntario.com, Canada's leading franchise directory for Ontario investors.

Write a 700–900 word SEO-optimized blog post about: "${topic.title}"

Requirements:
- Audience: prospective franchise buyers in Ontario, Canada — often first-timers with a budget of $50K–$500K
- Tone: authoritative, practical, and helpful — not salesy
- Use REAL franchise brand names (Tim Hortons, McDonald's, A&W, Kumon, Jan-Pro, GoodLife Fitness, Snap Fitness, The UPS Store, Nurse Next Door, Jani-King, Schooley Mitchell, etc.)
- Reference REAL Ontario cities (Toronto, Mississauga, Brampton, Markham, Hamilton, Ottawa, London, Barrie, Kitchener-Waterloo, Windsor, Oshawa, Sudbury, Kingston, Peterborough, Thunder Bay)
- Include REAL dollar amounts for investment ranges, franchise fees, royalty rates, and financing amounts
- Reference the Arthur Wishart Act, CFA (Canadian Franchise Association), BDC (Business Development Bank of Canada) where relevant
- Structure with clear h2 and h3 subheadings
- Include 3–5 internal links using anchor tags to these pages: /directory, /quiz, /resources, /compare
- End with a clear next-step call to action pointing to /directory and/or /quiz
- Write in HTML only — use <p>, <h2>, <h3>, <ul>, <li>, <strong>, <a href="..."> tags
- Do NOT include <html>, <body>, <head>, or any outer wrapper tags
- Do NOT include a title heading at the top — start directly with content

Output ONLY the HTML content — nothing else, no markdown, no preamble.`

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    console.error('Unexpected response type from Claude API.')
    process.exit(1)
  }

  const htmlContent = content.text.trim()

  // Build new post object
  const now = new Date().toISOString()
  const id = slugify(topic.title)

  const newPost = {
    id,
    title: topic.title,
    excerpt: htmlContent
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 220)
      .replace(/\s+\S*$/, '') + '…',
    category: topic.category,
    tags: topic.tags,
    imageUrl: `https://images.unsplash.com/photo-${topic.unsplashId}?w=1200&h=630&fit=crop&auto=format`,
    imageAlt: topic.imageQuery,
    publishedAt: now,
    author: 'FranchiseOntario Editorial Team',
    readTime: Math.max(4, Math.round(htmlContent.replace(/<[^>]+>/g, '').split(/\s+/).length / 200)),
    isFeatured: false,
    content: htmlContent,
  }

  // Prepend new post (newest first)
  existingPosts.unshift(newPost)

  writeFileSync(dataPath, JSON.stringify(existingPosts, null, 2), 'utf-8')

  console.log(`\nSuccess! New post written:`)
  console.log(`  Title: ${newPost.title}`)
  console.log(`  ID:    ${newPost.id}`)
  console.log(`  Path:  ${dataPath}`)
  console.log(`  Words: ~${htmlContent.replace(/<[^>]+>/g, '').split(/\s+/).length}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})

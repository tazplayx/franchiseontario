import type { FranchiseCategory } from '@/data/franchises'

// ── Ontario cities (30 total) ─────────────────────────────────────────────
export interface SEOCity {
  name: string
  slug: string
  region: string
  tier: 'major' | 'mid' | 'small'
  population: string
  blurb: string // unique market insight for page copy
}

export const ONTARIO_CITIES: SEOCity[] = [
  // ── GTA
  { name: 'Toronto',        slug: 'toronto',        region: 'Greater Toronto Area',   tier: 'major', population: '2.9M', blurb: "Canada's largest city and most competitive franchise market, with high consumer spending and dense transit-accessible retail corridors." },
  { name: 'Mississauga',    slug: 'mississauga',    region: 'GTA West',               tier: 'major', population: '720K', blurb: "Ontario's second-largest city and a top-performing franchise market, driven by a growing professional population and strong suburban retail demand." },
  { name: 'Brampton',       slug: 'brampton',       region: 'GTA West',               tier: 'major', population: '660K', blurb: "One of Canada's fastest-growing cities by population, with a young, multicultural demographic and rapidly expanding commercial corridors." },
  { name: 'Markham',        slug: 'markham',        region: 'GTA North',              tier: 'mid',   population: '360K', blurb: "Home to Ontario's largest technology cluster outside Toronto, with high household incomes and strong demand for premium service franchises." },
  { name: 'Vaughan',        slug: 'vaughan',        region: 'GTA North',              tier: 'mid',   population: '340K', blurb: "A rapidly growing city with major retail destinations like Vaughan Mills and a commuter-driven population seeking convenient franchise services." },
  { name: 'Richmond Hill',  slug: 'richmond-hill',  region: 'GTA North',              tier: 'mid',   population: '210K', blurb: "An affluent GTA suburb with one of Ontario's highest average household incomes, creating strong demand for fitness, wellness, and education franchises." },
  { name: 'Oakville',       slug: 'oakville',       region: 'GTA West',               tier: 'mid',   population: '215K', blurb: "An upscale lakeside community with above-average household income and consistent demand for premium food, fitness, and home services franchises." },
  { name: 'Burlington',     slug: 'burlington',     region: 'GTA West',               tier: 'mid',   population: '190K', blurb: "A family-oriented city at the western tip of Lake Ontario with stable consumer spending and growing demand for children's services and home services." },
  { name: 'Pickering',      slug: 'pickering',      region: 'GTA East',               tier: 'mid',   population: '100K', blurb: "A fast-growing eastern GTA community with significant residential development and under-served franchise categories creating first-mover opportunities." },
  { name: 'Ajax',           slug: 'ajax',           region: 'GTA East',               tier: 'mid',   population: '125K', blurb: "A growing Durham Region community with a young family demographic and strong demand for food, fitness, and children's franchise concepts." },
  { name: 'Whitby',         slug: 'whitby',         region: 'GTA East',               tier: 'mid',   population: '140K', blurb: "Durham Region's urban centre with a growing professional class and active demand for service and food franchises across its expanding commercial districts." },
  { name: 'Oshawa',         slug: 'oshawa',         region: 'GTA East',               tier: 'mid',   population: '170K', blurb: "Durham Region's largest city, anchored by Ontario Tech University and a revitalized downtown, creating diverse franchise opportunities across multiple categories." },
  // ── Major Cities
  { name: 'Ottawa',         slug: 'ottawa',         region: 'Eastern Ontario',        tier: 'major', population: '1.1M', blurb: "Canada's capital city offers a uniquely stable franchise market, anchored by federal government employment and a large technology sector." },
  { name: 'Hamilton',       slug: 'hamilton',       region: 'Golden Horseshoe',       tier: 'major', population: '580K', blurb: "A revitalized city with a booming restaurant and arts scene, growing healthcare sector, and McMaster University creating year-round consumer demand." },
  { name: 'London',         slug: 'london',         region: 'Southwestern Ontario',   tier: 'major', population: '420K', blurb: "Southwestern Ontario's largest city, home to Western University and a strong healthcare sector, with consistent franchise demand across all categories." },
  { name: 'Kitchener',      slug: 'kitchener',      region: 'Waterloo Region',        tier: 'major', population: '260K', blurb: "Part of Canada's 'Silicon Valley North' tech corridor, with rapid population growth and strong consumer spending from the technology sector." },
  { name: 'Waterloo',       slug: 'waterloo',       region: 'Waterloo Region',        tier: 'mid',   population: '130K', blurb: "Home to the University of Waterloo and Wilfrid Laurier University, creating a large student market alongside a booming tech economy." },
  { name: 'Cambridge',      slug: 'cambridge',      region: 'Waterloo Region',        tier: 'mid',   population: '140K', blurb: "A manufacturing and commercial hub within the Waterloo Region with steady franchise demand and lower competition density than neighbouring Kitchener." },
  { name: 'Windsor',        slug: 'windsor',        region: 'Southwestern Ontario',   tier: 'major', population: '230K', blurb: "Ontario's southernmost city, with cross-border traffic from the US and a revitalized economy driven by the automotive sector and new battery manufacturing." },
  { name: 'Guelph',         slug: 'guelph',         region: 'Southwestern Ontario',   tier: 'mid',   population: '145K', blurb: "A university city with one of Ontario's highest rates of new business formation, strong environmental awareness, and an educated, spending-positive consumer base." },
  { name: 'Kingston',       slug: 'kingston',       region: 'Eastern Ontario',        tier: 'mid',   population: '140K', blurb: "Home to Queen's University and Royal Military College, Kingston offers a stable franchise market with consistent student and government-employee consumer demand." },
  { name: 'St. Catharines', slug: 'st-catharines',  region: 'Niagara Region',         tier: 'mid',   population: '140K', blurb: "The Niagara Region's largest city, with Brock University and growing tourism traffic from Niagara Falls creating diverse franchise opportunities." },
  { name: 'Niagara Falls',  slug: 'niagara-falls',  region: 'Niagara Region',         tier: 'mid',   population: '90K',  blurb: "Canada's premier tourist destination with 14M+ annual visitors, creating extraordinary demand for food, retail, and hospitality franchise concepts." },
  { name: 'Peterborough',   slug: 'peterborough',   region: 'Central Ontario',        tier: 'mid',   population: '85K',  blurb: "A growing Central Ontario city with Trent University, a revitalized downtown, and significant under-served franchise categories creating first-mover potential." },
  { name: 'Brantford',      slug: 'brantford',      region: 'Golden Horseshoe',       tier: 'mid',   population: '100K', blurb: "A mid-sized Ontario city with Wilfrid Laurier's Brantford campus and steady commercial growth across its expanding suburban corridors." },
  { name: 'Barrie',         slug: 'barrie',         region: 'Central Ontario',        tier: 'mid',   population: '155K', blurb: "Central Ontario's largest city and one of Canada's fastest-growing markets, driven by GTA residents relocating north for affordability and lifestyle." },
  { name: 'Sudbury',        slug: 'sudbury',        region: 'Northern Ontario',       tier: 'mid',   population: '170K', blurb: "Northern Ontario's largest city, serving a regional catchment of 300K+, with strong community loyalty and significantly lower franchise competition density." },
  { name: 'Thunder Bay',    slug: 'thunder-bay',    region: 'Northwestern Ontario',   tier: 'mid',   population: '115K', blurb: "Northwestern Ontario's commercial hub with Lakehead University and very low franchise competition, creating genuine first-mover opportunities in most categories." },
  { name: 'Sarnia',         slug: 'sarnia',         region: 'Southwestern Ontario',   tier: 'small', population: '72K',  blurb: "An industrial and petrochemical city with a stable blue-collar employment base and strong demand for value-oriented food and service franchise concepts." },
  { name: 'North Bay',      slug: 'north-bay',      region: 'Northern Ontario',       tier: 'small', population: '52K',  blurb: "A Northern Ontario city serving as the commercial gateway between Northern and Southern Ontario, with a loyal local consumer base and low franchise saturation." },
]

// ── Category slug mapping ─────────────────────────────────────────────────
export const CATEGORY_SLUG_MAP: Record<FranchiseCategory, string> = {
  'Bar & Grill':         'bar-grill',
  'Seafood':             'seafood',
  'Coffee & Café':       'coffee-cafe',
  'Fast Food':           'fast-food',
  'Pizza':               'pizza',
  'Specialty Food':      'specialty-food',
  'Bakery & Desserts':   'bakery-desserts',
  'Healthy Eating':      'healthy-eating',
  'Fitness & Wellness':  'fitness-wellness',
  'Health & Medical':    'health-medical',
  'Senior Care':         'senior-care',
  'Sports & Recreation': 'sports-recreation',
  'Home Services':       'home-services',
  'Cleaning Services':   'cleaning-services',
  'Real Estate':         'real-estate',
  'Education':           'education',
  "Children's Services": 'childrens-services',
  'Financial Services':  'financial-services',
  'Business Services':   'business-services',
  'Technology & IT':     'technology-it',
  'Printing & Signs':    'printing-signs',
  'Retail':              'retail',
  'Automotive':          'automotive',
  'Beauty & Salon':      'beauty-salon',
  'Pet Services':        'pet-services',
  'Travel & Hospitality':'travel-hospitality',
}

export const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_MAP).map(([k, v]) => [v, k as FranchiseCategory])
) as Record<string, FranchiseCategory>

// ── Investment tiers ──────────────────────────────────────────────────────
export interface InvestmentTier {
  label: string
  slug: string
  min: number
  max: number | null
  headline: string
  description: string
  icon: string
  shortDesc: string
}

export const INVESTMENT_TIERS: InvestmentTier[] = [
  {
    slug: 'under-50k',
    label: 'Under $50K',
    min: 0,
    max: 50000,
    headline: 'Low-Investment Franchise Opportunities in Ontario',
    description: 'Franchise opportunities in Ontario with a total investment under $50,000. These home-based, mobile, or service-based concepts let you enter franchising with minimal upfront capital.',
    icon: '💡',
    shortDesc: 'Home-based, mobile & service concepts',
  },
  {
    slug: 'under-100k',
    label: 'Under $100K',
    min: 0,
    max: 100000,
    headline: 'Franchise Opportunities in Ontario Under $100K',
    description: 'Browse Ontario franchises available for a total investment under $100,000 — from service businesses and mobile concepts to boutique retail and tutoring centres.',
    icon: '🌱',
    shortDesc: 'Service, mobile & boutique retail',
  },
  {
    slug: '100k-to-250k',
    label: '$100K – $250K',
    min: 100000,
    max: 250000,
    headline: 'Ontario Franchise Opportunities: $100K to $250K',
    description: 'Mid-range franchise investments between $100,000 and $250,000 — typically covering fitness studios, home services, specialty food, and professional service franchises.',
    icon: '⚡',
    shortDesc: 'Fitness, food & professional services',
  },
  {
    slug: '250k-to-500k',
    label: '$250K – $500K',
    min: 250000,
    max: 500000,
    headline: 'Ontario Franchise Investments: $250K to $500K',
    description: 'Established franchise brands in Ontario requiring an investment between $250,000 and $500,000, including QSR, casual dining, fitness, and multi-service concepts.',
    icon: '🏆',
    shortDesc: 'QSR, casual dining & multi-service',
  },
  {
    slug: 'over-500k',
    label: '$500K+',
    min: 500000,
    max: null,
    headline: 'Premium Ontario Franchise Opportunities — $500K+',
    description: 'Ontario\'s highest-tier franchise investments above $500,000 — covering full-service restaurants, large-format retail, enterprise service brands, and flagship franchise locations.',
    icon: '👑',
    shortDesc: 'Full-service restaurants & enterprise brands',
  },
]

// ── Category display metadata ─────────────────────────────────────────────
export const CATEGORY_META: Partial<Record<FranchiseCategory, { icon: string; description: string }>> = {
  'Bar & Grill':         { icon: '🍺', description: 'Bar, grill, and casual dining franchise opportunities across Ontario.' },
  'Coffee & Café':       { icon: '☕', description: 'Coffee shop and café franchise concepts available in Ontario.' },
  'Fast Food':           { icon: '🍔', description: 'Quick-service restaurant franchise opportunities in Ontario.' },
  'Pizza':               { icon: '🍕', description: 'Pizza franchise opportunities and delivery concepts in Ontario.' },
  'Fitness & Wellness':  { icon: '💪', description: 'Gym, fitness studio, and wellness franchise opportunities in Ontario.' },
  'Health & Medical':    { icon: '🏥', description: 'Healthcare, dental, optical, and medical franchise opportunities in Ontario.' },
  'Senior Care':         { icon: '❤️', description: 'In-home care and senior services franchise opportunities in Ontario.' },
  'Home Services':       { icon: '🏠', description: 'Home repair, renovation, and maintenance franchise opportunities in Ontario.' },
  'Cleaning Services':   { icon: '🧹', description: 'Residential and commercial cleaning franchise opportunities in Ontario.' },
  'Education':           { icon: '📚', description: 'Tutoring, learning centre, and education franchise opportunities in Ontario.' },
  "Children's Services": { icon: '🧸', description: "Children's activity, education, and care franchise opportunities in Ontario." },
  'Automotive':          { icon: '🚗', description: 'Car wash, repair, and automotive service franchise opportunities in Ontario.' },
  'Pet Services':        { icon: '🐾', description: 'Pet grooming, boarding, and veterinary franchise opportunities in Ontario.' },
  'Retail':              { icon: '🛍️', description: 'Specialty retail franchise opportunities and consumer goods concepts in Ontario.' },
  'Financial Services':  { icon: '💼', description: 'Accounting, tax, insurance, and financial services franchise opportunities in Ontario.' },
  'Business Services':   { icon: '📊', description: 'B2B, staffing, printing, and business services franchise opportunities in Ontario.' },
  'Real Estate':         { icon: '🏡', description: 'Real estate brokerage and property management franchise opportunities in Ontario.' },
  'Beauty & Salon':      { icon: '💇', description: 'Hair salon, spa, and beauty franchise opportunities in Ontario.' },
  'Specialty Food':      { icon: '🥗', description: 'Specialty and niche food franchise concepts available in Ontario.' },
  'Technology & IT':     { icon: '💻', description: 'IT services, mobile repair, and technology franchise opportunities in Ontario.' },
}

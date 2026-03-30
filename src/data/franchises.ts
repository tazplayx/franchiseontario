export type FranchiseTier = 'basic' | 'premium' | 'enterprise';

export type FranchiseCategory =
  | 'Bar & Grill'
  | 'Seafood'
  | 'Coffee & Café'
  | 'Fast Food'
  | 'Pizza'
  | 'Fitness & Wellness'
  | 'Retail'
  | 'Home Services'
  | 'Automotive'
  | 'Education'
  | 'Beauty & Salon'
  | 'Pet Services'
  | 'Financial Services'
  | 'Real Estate';

export interface FranchiseFinancials {
  franchiseFee: string;
  royaltyRate: string;
  marketingFee: string;
  investmentMin: number;
  investmentMax: number;
  averageUnitVolume: string;
  netWorthRequired: string;
  liquidCapitalRequired: string;
  royaltyNotes?: string;
}

export interface Franchise {
  id: string;
  name: string;
  tagline: string;
  logoUrl?: string;        // uploaded logo image — used as listing thumbnail when present
  description: string;
  longDescription: string;
  category: FranchiseCategory;
  tier: FranchiseTier;
  isVIP: boolean;
  isFeatured: boolean;
  logoInitials: string;
  logoColor: string;
  logoBg: string;
  locations: number;
  rating: number;
  reviews: number;
  established: number;
  financials: FranchiseFinancials;
  website: string;
  phone: string;
  email: string;
  city: string;
  highlights: string[];
  popularityScore: number;
  rank: number;
  badges: string[];
  trainingWeeks: number;
  territory: string;
  franchiseeCount: number;
  parent: string;
  idealCandidate: string[];
  supportOffered: string[];
  mediaImages: string[];
  videoUrl?: string;
  faqs: { q: string; a: string }[];
}

export const franchises: Franchise[] = [
  {
    id: 'chucks-roadhouse',
    name: "Chuck's Roadhouse Bar and Grill",
    tagline: 'Get Your Hands Dirty',
    description:
      "Chuck's Roadhouse Bar and Grill® is Ontario's bold, no-nonsense bar & grill. Premium aged steaks, Just Wings®, Chucktails®, and real value — every day.",
    longDescription:
      "Chuck's Roadhouse Bar and Grill® is one of Canada's fastest-growing franchise brands, built on a simple promise: premium quality food at prices that don't insult you. Founded in 2015 by Obsidian Group Inc., Chuck's has scaled to 110+ Ontario locations by staying true to its roots — bold flavours, generous portions, and a lively roadhouse atmosphere that keeps guests coming back.\n\nEvery steak is aged a minimum of 28 days and seasoned with Chuck's proprietary spice blend. The Just Wings® program, Chucktails® cocktail line, and Sizzlers™ skillet entrées are all trademarked brand assets that give franchisees a powerful competitive edge. With half-price appetizers after 9PM daily and aggressive daily drink specials, Chuck's drives traffic at every daypart.\n\nFranchisees benefit from a comprehensive support system including site selection, build-out assistance, a proven operating playbook, and ongoing field support. With strong brand recognition across Ontario and a loyal repeat-guest base, Chuck's Roadhouse is one of the most compelling franchise investments in the Canadian food & beverage space.",
    category: 'Bar & Grill',
    tier: 'enterprise',
    isVIP: true,
    isFeatured: true,
    logoInitials: 'CRH',
    logoColor: '#FFFFFF',
    logoBg: '#C8102E',
    locations: 110,
    rating: 4.6,
    reviews: 8240,
    established: 2015,
    financials: {
      franchiseFee: '$40,000',
      royaltyRate: '5%',
      marketingFee: '2%',
      investmentMin: 400000,
      investmentMax: 800000,
      averageUnitVolume: '$1.8M – $2.4M',
      netWorthRequired: '$1,000,000',
      liquidCapitalRequired: '$250,000',
      royaltyNotes: 'Royalty is 5% of gross weekly sales. Marketing fund contribution is 2% of gross weekly sales.',
    },
    website: 'https://chucksroadhouse.com',
    phone: '1-800-CHUCKS',
    email: 'franchise@chucksroadhouse.com',
    city: 'Ontario-Wide',
    highlights: [
      '110+ Ontario locations and growing',
      'Fastest-growing Ontario bar & grill franchise',
      'Proprietary Just Wings® & Chucktails® programs',
      'Award-winning franchise support system',
      '28-day aged steaks with Chuck\'s Spice',
      'Half-price appetizers after 9PM daily',
      'Strong repeat traffic with daily drink specials',
      'Full turnkey build-out & site selection support',
    ],
    popularityScore: 98,
    rank: 1,
    badges: ['VIP', 'Top Ranked', "Editor's Pick", 'Ontario Favourite'],
    trainingWeeks: 8,
    territory: 'Protected territory assigned per location',
    franchiseeCount: 95,
    parent: 'Obsidian Group Inc.',
    idealCandidate: [
      'Hospitality or restaurant industry experience preferred',
      'Hands-on owner-operator commitment',
      'Strong community presence and people skills',
      'Minimum $250K liquid capital available',
      'Passion for food, service, and brand excellence',
    ],
    supportOffered: [
      'Site selection & lease negotiation assistance',
      'Complete build-out design & project management',
      '8-week comprehensive training program',
      'Grand opening support & marketing launch',
      'Ongoing field consultant visits',
      'Proprietary POS & operations technology',
      'National & regional marketing campaigns',
      'Annual franchisee conference',
    ],
    mediaImages: [],
    videoUrl: '',
    faqs: [
      {
        q: 'Do I need prior restaurant experience?',
        a: "While restaurant or hospitality experience is preferred, Chuck's has a comprehensive 8-week training program that covers all aspects of operations. A genuine passion for the brand and people-first attitude matters most.",
      },
      {
        q: 'What is the typical timeline from signing to opening?',
        a: 'From signing your franchise agreement to opening day, the typical timeline is 9–14 months. This includes site selection, permitting, build-out, and training.',
      },
      {
        q: 'Is financing available?',
        a: "Chuck's has relationships with major Canadian chartered banks and the BDC. Many franchisees finance up to 60% of their total investment through these channels.",
      },
      {
        q: 'Are territories protected?',
        a: 'Yes. Each Chuck\'s Roadhouse franchise is granted a protected territory based on population and trade area analysis to prevent franchisee competition.',
      },
    ],
  },
  {
    id: 'crabby-joes',
    name: "Crabby Joe's",
    tagline: 'Casual Dining with a Maritime Soul',
    description:
      "Crabby Joe's has been serving Canadians since 1992, offering a relaxed atmosphere with fresh seafood, classic grill favourites, and ice-cold drinks.",
    longDescription:
      "Crabby Joe's is a beloved Canadian casual dining institution that has been serving up fresh seafood, classic grill favourites, and a whole lot of maritime hospitality since 1992. With over 30 years of proven franchise success, Crabby Joe's has built a fiercely loyal guest base across Ontario who return time and again for the laid-back atmosphere, generous portions, and consistent quality.\n\nThe brand's relaxed, nautical-themed dining rooms create an inviting environment for families, groups, and anyone looking for a satisfying meal without the fuss. The menu is anchored by fresh seafood — signature crab dishes, fish & chips, shrimp platters — complemented by a full lineup of pub-style comfort food, a well-curated beer list, and licensed dining.\n\nCrabby Joe's franchisees benefit from a heritage brand with strong Ontario recognition, a proven supply chain, and a support system built on decades of operational refinement. With a manageable investment range and strong lunch and dinner traffic, Crabby Joe's represents a compelling opportunity for restaurateurs looking to invest in a proven concept.",
    category: 'Seafood',
    tier: 'enterprise',
    isVIP: true,
    isFeatured: true,
    logoInitials: 'CJ',
    logoColor: '#FFFFFF',
    logoBg: '#005A8E',
    locations: 62,
    rating: 4.4,
    reviews: 5610,
    established: 1992,
    financials: {
      franchiseFee: '$35,000',
      royaltyRate: '5%',
      marketingFee: '2%',
      investmentMin: 350000,
      investmentMax: 700000,
      averageUnitVolume: '$1.4M – $2.0M',
      netWorthRequired: '$800,000',
      liquidCapitalRequired: '$200,000',
      royaltyNotes: 'Royalty is 5% of gross monthly sales. Co-op marketing contribution is 2%.',
    },
    website: 'https://crabbyjoes.com',
    phone: '1-888-CRABBY1',
    email: 'franchise@crabbyjoes.com',
    city: 'Ontario-Wide',
    highlights: [
      '62 Ontario locations',
      '30+ years of proven franchise success',
      'Strong brand recognition across Ontario',
      'Fresh seafood & classic Canadian comfort food',
      'Full bar & licensed dining program',
      'Comprehensive training & support',
      'Family-friendly atmosphere with broad appeal',
      'Established supply chain & national purchasing power',
    ],
    popularityScore: 92,
    rank: 2,
    badges: ['VIP', 'Heritage Brand', 'Ontario Classic'],
    trainingWeeks: 6,
    territory: 'Protected territory assigned per market',
    franchiseeCount: 58,
    parent: 'Spectra Hospitality Group',
    idealCandidate: [
      'Restaurant or hospitality management background',
      'Owner-operator with hands-on commitment',
      'Community-minded with strong local ties',
      'Minimum $200K liquid capital',
      'Passion for fresh food and exceptional service',
    ],
    supportOffered: [
      'Site selection & real estate assistance',
      'Interior design & build-out support',
      '6-week training program (classroom + in-restaurant)',
      'Grand opening marketing package',
      'Regional field support team',
      'Seasonal menu development',
      'National marketing fund campaigns',
      'Online ordering & delivery platform integration',
    ],
    mediaImages: [],
    videoUrl: '',
    faqs: [
      {
        q: 'What makes Crabby Joe\'s different from other casual dining franchises?',
        a: "Crabby Joe's unique nautical atmosphere and focus on fresh seafood alongside classic pub comfort food creates a distinct dining niche that's hard to replicate. The 30+ year brand heritage means guests already know and trust the name.",
      },
      {
        q: 'What size location does a Crabby Joe\'s require?',
        a: "Typical Crabby Joe's locations range from 3,500 to 5,500 square feet with seating for 100–160 guests, including a licensed bar area.",
      },
      {
        q: 'Is the full bar program mandatory?',
        a: "The licensed bar program is strongly recommended as it represents 20–30% of revenue for most locations. Franchisees are expected to pursue and maintain a liquor licence.",
      },
      {
        q: 'How long has the current franchise system been in place?',
        a: "The current franchise support structure has been continuously refined since the early 2000s, giving it over 20 years of operational depth and franchisee feedback built into the model.",
      },
    ],
  },
  {
    id: 'coffee-culture',
    name: 'Coffee Culture Café & Eatery',
    tagline: 'Where Every Cup Tells a Story',
    description:
      'Coffee Culture is a proudly Canadian coffee franchise serving specialty coffees, fresh-baked goods, and wholesome meals in a warm, welcoming environment.',
    longDescription:
      "Coffee Culture Café & Eatery is one of Canada's most beloved independent-feeling café franchises — a proudly Canadian brand that has been warming communities across Ontario since 1998. With an emphasis on specialty coffees, fresh-baked goods, wholesome breakfast and lunch options, and a genuinely welcoming atmosphere, Coffee Culture carves out a meaningful space between the big chains and the independent café.\n\nThe brand's warm, neighbourhood aesthetic and community-focused identity create exceptional loyalty. Guests don't just visit Coffee Culture — they make it part of their daily ritual. This translates directly into strong repeat traffic and predictable weekly revenue for franchisees.\n\nWith a lower entry investment than most national café competitors, multiple store format options (traditional café, drive-thru hybrid, and inline), and a menu that balances all-day coffee with a solid food program, Coffee Culture offers flexibility that suits a variety of markets — from urban neighbourhoods to suburban plazas and small-town main streets.\n\nFranchisees are supported by a head office team with deep Canadian market knowledge, a proven operational playbook, and ongoing marketing support including the brand's popular loyalty app.",
    category: 'Coffee & Café',
    tier: 'enterprise',
    isVIP: true,
    isFeatured: true,
    logoInitials: 'CC',
    logoColor: '#FFFFFF',
    logoBg: '#6B3E26',
    locations: 58,
    rating: 4.5,
    reviews: 4890,
    established: 1998,
    financials: {
      franchiseFee: '$25,000',
      royaltyRate: '6%',
      marketingFee: '2%',
      investmentMin: 200000,
      investmentMax: 400000,
      averageUnitVolume: '$700K – $1.1M',
      netWorthRequired: '$500,000',
      liquidCapitalRequired: '$120,000',
      royaltyNotes: 'Royalty is 6% of gross weekly sales. National marketing fund is 2%. Some formats may vary.',
    },
    website: 'https://coffeeculture.ca',
    phone: '1-888-COFFEE1',
    email: 'franchise@coffeeculture.ca',
    city: 'Ontario-Wide',
    highlights: [
      '58 Ontario locations',
      '25+ years of Canadian café excellence',
      'Specialty coffee & fresh-baked menu',
      'Community-focused brand with loyal following',
      'Lower investment than national competitors',
      'Flexible store format options (café, drive-thru, inline)',
      'Popular loyalty rewards app',
      'All-day traffic: coffee, breakfast, lunch',
    ],
    popularityScore: 89,
    rank: 3,
    badges: ['VIP', 'Canadian Favourite', 'Community Brand'],
    trainingWeeks: 5,
    territory: 'Protected territory based on trade area',
    franchiseeCount: 52,
    parent: 'Coffee Culture Inc.',
    idealCandidate: [
      'Community-oriented, people-first personality',
      'Food service or hospitality background an asset',
      'Owner-operator model preferred',
      'Minimum $120K liquid capital',
      'Passion for coffee culture and local community',
    ],
    supportOffered: [
      'Site selection & lease review',
      'Full café design & build-out package',
      '5-week training program',
      'Launch marketing & grand opening support',
      'Ongoing operations & barista training',
      'Loyalty app & digital marketing tools',
      'Seasonal menu & product innovation',
      'Dedicated franchise business coach',
    ],
    mediaImages: [],
    videoUrl: '',
    faqs: [
      {
        q: 'How does Coffee Culture compete with Tim Hortons and Starbucks?',
        a: "Coffee Culture wins on atmosphere, quality, and community connection. Guests who want a genuine café experience — not a fast-food lineup — choose Coffee Culture. The brand occupies a distinct premium-but-approachable position that the large chains can't replicate.",
      },
      {
        q: 'What size location is ideal?',
        a: "Traditional café locations run 1,200–2,000 sq ft. Drive-thru formats can be smaller. The brand works in a variety of retail environments including plazas, street-front, and food courts.",
      },
      {
        q: 'Is barista experience required?',
        a: "No — the 5-week training program covers all coffee preparation, food handling, and operations. What matters most is a passion for hospitality and consistency.",
      },
      {
        q: 'What are the busiest revenue periods?',
        a: "Morning (6AM–11AM) represents roughly 55% of daily revenue, with a solid lunch daypart (11AM–2PM) adding another 25–30%. The brand performs consistently year-round with seasonal drink promotions driving spikes.",
      },
    ],
  },
];

export const getFeaturedFranchises = () => franchises.filter((f) => f.isFeatured);
export const getVIPFranchises = () => franchises.filter((f) => f.isVIP);
export const getTopRanked = (limit = 3) =>
  [...franchises].sort((a, b) => a.rank - b.rank).slice(0, limit);
export const getByCategory = (category: FranchiseCategory) =>
  franchises.filter((f) => f.category === category);
export const getFranchiseById = (id: string) =>
  franchises.find((f) => f.id === id);

export const categories: { name: FranchiseCategory; icon: string; color: string; bg: string }[] = [
  { name: 'Bar & Grill', icon: '🍺', color: '#C8102E', bg: '#FFF0F0' },
  { name: 'Coffee & Café', icon: '☕', color: '#6B3E26', bg: '#FFF8F0' },
  { name: 'Seafood', icon: '🦞', color: '#005A8E', bg: '#F0F8FF' },
  { name: 'Fast Food', icon: '🍔', color: '#E8A000', bg: '#FFFBF0' },
  { name: 'Pizza', icon: '🍕', color: '#D4001A', bg: '#FFF0F0' },
  { name: 'Fitness & Wellness', icon: '💪', color: '#FF6B00', bg: '#FFF5F0' },
  { name: 'Retail', icon: '🛍️', color: '#7B2D8B', bg: '#F8F0FF' },
  { name: 'Home Services', icon: '🏠', color: '#2E7D32', bg: '#F0FFF0' },
  { name: 'Automotive', icon: '🚗', color: '#1565C0', bg: '#F0F4FF' },
  { name: 'Education', icon: '📚', color: '#0064C8', bg: '#F0F8FF' },
  { name: 'Beauty & Salon', icon: '💅', color: '#E91E8C', bg: '#FFF0F8' },
  { name: 'Pet Services', icon: '🐾', color: '#4CAF50', bg: '#F0FFF4' },
  { name: 'Financial Services', icon: '💼', color: '#37474F', bg: '#F5F5F5' },
  { name: 'Real Estate', icon: '🏡', color: '#795548', bg: '#FFF8F5' },
];

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

export interface Franchise {
  id: string;
  name: string;
  tagline: string;
  description: string;
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
  investmentMin: number;
  investmentMax: number;
  website: string;
  phone: string;
  city: string;
  highlights: string[];
  popularityScore: number;
  rank: number;
  badges: string[];
}

export const franchises: Franchise[] = [
  {
    id: 'chucks-roadhouse',
    name: "Chuck's Roadhouse Bar and Grill",
    tagline: 'Get Your Hands Dirty',
    description:
      "Chuck's Roadhouse Bar and Grill® is Ontario's bold, no-nonsense bar & grill experience. Premium aged steaks, Just Wings®, Chucktails®, and real value — every day. With 100+ locations across Ontario and growing, Chuck's is one of Canada's fastest-growing franchise brands.",
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
    investmentMin: 400000,
    investmentMax: 800000,
    website: 'https://chucksroadhouse.com',
    phone: '1-800-CHUCKS',
    city: 'Ontario-Wide',
    highlights: [
      '110+ Ontario locations',
      'Fastest-growing Ontario bar & grill franchise',
      'Proprietary Just Wings® & Chucktails® programs',
      'Award-winning franchise support system',
      '28-day aged steaks with Chuck\'s Spice',
      'Half-price appetizers after 9PM daily',
    ],
    popularityScore: 98,
    rank: 1,
    badges: ['VIP', 'Top Ranked', 'Editor\'s Pick', 'Ontario Favourite'],
  },
  {
    id: 'crabby-joes',
    name: "Crabby Joe's",
    tagline: "Casual Dining with a Maritime Soul",
    description:
      "Crabby Joe's has been serving Canadians since 1992, offering a relaxed atmosphere with fresh seafood, classic grill favourites, and ice-cold drinks. A true Ontario institution with decades of franchise success and passionate local operators.",
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
    investmentMin: 350000,
    investmentMax: 700000,
    website: 'https://crabbyjoes.com',
    phone: '1-888-CRABBY1',
    city: 'Ontario-Wide',
    highlights: [
      '62 Ontario locations',
      '30+ years of proven franchise success',
      'Strong brand recognition across Ontario',
      'Fresh seafood & classic Canadian comfort food',
      'Full bar & licensed dining program',
      'Comprehensive training & support',
    ],
    popularityScore: 92,
    rank: 2,
    badges: ['VIP', 'Heritage Brand', 'Ontario Classic'],
  },
  {
    id: 'coffee-culture',
    name: 'Coffee Culture Café & Eatery',
    tagline: 'Where Every Cup Tells a Story',
    description:
      'Coffee Culture Café & Eatery is a proudly Canadian coffee franchise serving specialty coffees, fresh-baked goods, and wholesome meals in a warm, welcoming environment. With a focus on local sourcing and community, Coffee Culture is a beloved Ontario café brand with strong franchise returns.',
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
    investmentMin: 200000,
    investmentMax: 400000,
    website: 'https://coffeeculture.ca',
    phone: '1-888-COFFEE1',
    city: 'Ontario-Wide',
    highlights: [
      '58 Ontario locations',
      '25+ years of Canadian café excellence',
      'Specialty coffee & fresh-baked menu',
      'Community-focused brand with loyal following',
      'Lower investment than national competitors',
      'Flexible store format options',
    ],
    popularityScore: 89,
    rank: 3,
    badges: ['VIP', 'Canadian Favourite', 'Community Brand'],
  },
  {
    id: 'fit4less',
    name: 'Fit4Less',
    tagline: 'No Judgement. No Excuses.',
    description:
      'Fit4Less is Canada\'s fastest-growing budget fitness franchise, offering 24/7 access gyms at an affordable price point. With a proven low-overhead model and massive member growth, Fit4Less franchisees enjoy strong recurring revenue.',
    category: 'Fitness & Wellness',
    tier: 'premium',
    isVIP: false,
    isFeatured: true,
    logoInitials: 'F4L',
    logoColor: '#FFFFFF',
    logoBg: '#FF6B00',
    locations: 85,
    rating: 4.2,
    reviews: 3120,
    established: 2012,
    investmentMin: 300000,
    investmentMax: 600000,
    website: 'https://fit4less.ca',
    phone: '1-888-FIT4LES',
    city: 'Ontario-Wide',
    highlights: [
      '24/7 access model',
      'Strong recurring monthly revenue',
      'Low staffing overhead',
      'Canada\'s #1 value gym brand',
    ],
    popularityScore: 84,
    rank: 4,
    badges: ['Trending', 'High Growth'],
  },
  {
    id: 'mr-lube',
    name: 'Mr. Lube + Tires',
    tagline: 'Fast. Friendly. Fair.',
    description:
      'Mr. Lube is Canada\'s leading quick-service automotive franchise with no-appointment oil changes, tire services, and preventive maintenance. A recession-resistant business with strong brand trust built over 45 years.',
    category: 'Automotive',
    tier: 'premium',
    isVIP: false,
    isFeatured: false,
    logoInitials: 'ML',
    logoColor: '#FFFFFF',
    logoBg: '#D4001A',
    locations: 95,
    rating: 4.3,
    reviews: 6780,
    established: 1976,
    investmentMin: 450000,
    investmentMax: 850000,
    website: 'https://mrlube.com',
    phone: '1-800-MR-LUBE1',
    city: 'Ontario-Wide',
    highlights: [
      'No appointment needed model',
      '45+ years brand heritage',
      'Recession-resistant automotive services',
      'National marketing & support',
    ],
    popularityScore: 78,
    rank: 5,
    badges: ['Established Brand', 'Recession-Proof'],
  },
  {
    id: 'kumon',
    name: 'Kumon Math & Reading',
    tagline: 'Unlock Every Child\'s Potential',
    description:
      'Kumon is the world\'s largest after-school education program with over 4 million students globally. Ontario franchisees benefit from low overhead, high community impact, and a proven 60-year curriculum. Ideal for education-passionate entrepreneurs.',
    category: 'Education',
    tier: 'premium',
    isVIP: false,
    isFeatured: false,
    logoInitials: 'KM',
    logoColor: '#FFFFFF',
    logoBg: '#0064C8',
    locations: 140,
    rating: 4.4,
    reviews: 2890,
    established: 1958,
    investmentMin: 70000,
    investmentMax: 150000,
    website: 'https://kumon.com',
    phone: '1-800-KUMON-CA',
    city: 'Ontario-Wide',
    highlights: [
      '140+ Ontario centres',
      'Low investment entry point',
      'World\'s largest education franchise',
      'Strong community brand loyalty',
    ],
    popularityScore: 75,
    rank: 6,
    badges: ['Low Investment', 'Global Brand'],
  },
  {
    id: 'molly-maid',
    name: 'Molly Maid',
    tagline: 'Cleaning Made Simple. Lives Made Better.',
    description:
      'Molly Maid is North America\'s most trusted home cleaning franchise with 40+ years of proven systems. Ontario franchisees benefit from a recession-resistant service, strong demand, and flexible scheduling with low overhead costs.',
    category: 'Home Services',
    tier: 'basic',
    isVIP: false,
    isFeatured: false,
    logoInitials: 'MM',
    logoColor: '#FFFFFF',
    logoBg: '#8B1A8B',
    locations: 45,
    rating: 4.1,
    reviews: 1450,
    established: 1979,
    investmentMin: 110000,
    investmentMax: 160000,
    website: 'https://mollymaid.ca',
    phone: '1-888-MOLLY-CA',
    city: 'Ontario-Wide',
    highlights: [
      'Low investment model',
      '40+ years of brand trust',
      'Recurring revenue from loyal clients',
    ],
    popularityScore: 62,
    rank: 7,
    badges: ['Low Investment', 'Home Services'],
  },
  {
    id: 'three-dog-bakery',
    name: 'Three Dog Bakery',
    tagline: 'Because Dogs Deserve Better',
    description:
      'Three Dog Bakery is a premium pet bakery franchise crafting all-natural dog treats in a fun, welcoming shop environment. With the booming pet industry, Three Dog Bakery franchisees tap into a passionate and growing market.',
    category: 'Pet Services',
    tier: 'basic',
    isVIP: false,
    isFeatured: false,
    logoInitials: 'TDB',
    logoColor: '#FFFFFF',
    logoBg: '#4CAF50',
    locations: 12,
    rating: 4.0,
    reviews: 340,
    established: 1989,
    investmentMin: 150000,
    investmentMax: 280000,
    website: 'https://threedogbakery.com',
    phone: '1-888-DOGBAKE',
    city: 'Toronto, ON',
    highlights: [
      'Booming $10B+ Canadian pet market',
      'All-natural, premium product line',
      'High customer retention',
    ],
    popularityScore: 55,
    rank: 8,
    badges: ['Niche Market', 'Growth Industry'],
  },
];

export const getFeaturedFranchises = () =>
  franchises.filter((f) => f.isFeatured);

export const getVIPFranchises = () =>
  franchises.filter((f) => f.isVIP);

export const getTopRanked = (limit = 5) =>
  [...franchises].sort((a, b) => a.rank - b.rank).slice(0, limit);

export const getByCategory = (category: FranchiseCategory) =>
  franchises.filter((f) => f.category === category);

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

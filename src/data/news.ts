export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  source: string;
  publishedAt: string;
  timeAgo: string;
  url: string;
  isFeatured: boolean;
  tags: string[];
  relatedFranchise?: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'chucks-20-new-locations',
    title: "Chuck's Roadhouse Plans 20 New Ontario Locations in 2026 — Franchise Opportunities Now Open",
    excerpt:
      "Chuck's Roadhouse Bar and Grill® has announced an aggressive expansion plan for 2026, targeting 20 new Ontario locations. The Obsidian Group Inc. brand is actively seeking franchise partners across Southern and Eastern Ontario, citing record same-store sales growth in 2025.",
    category: 'Expansion',
    source: 'Franchise Canada',
    publishedAt: '2026-03-24',
    timeAgo: '2 days ago',
    url: '#',
    isFeatured: true,
    tags: ['Expansion', 'Bar & Grill', 'Ontario'],
    relatedFranchise: "chucks-roadhouse",
  },
  {
    id: 'crabby-joes-30-years',
    title: "Crabby Joe's Celebrates 30+ Years of Casual Dining — New Menu Rollout Announced for Ontario Locations",
    excerpt:
      "Crabby Joe's marks over three decades of serving Ontarians with a refreshed menu featuring sustainable seafood options and expanded non-alcoholic beverages. The iconic Canadian chain also teased a redesigned restaurant format for new franchise openings.",
    category: 'Brand News',
    source: 'Canadian Restaurant & Foodservice News',
    publishedAt: '2026-03-22',
    timeAgo: '4 days ago',
    url: '#',
    isFeatured: false,
    tags: ['Seafood', 'Rebranding', 'Ontario'],
    relatedFranchise: 'crabby-joes',
  },
  {
    id: 'coffee-culture-app',
    title: "Coffee Culture Launches New Loyalty App — Early Adopters Report 30% More Monthly Visits",
    excerpt:
      "Coffee Culture Café & Eatery has launched a new loyalty rewards application for iOS and Android, reporting that early beta users are visiting their local café 30% more frequently. The app includes digital punch cards, mobile ordering, and local franchise promotions.",
    category: 'Technology',
    source: 'Ontario Business Report',
    publishedAt: '2026-03-20',
    timeAgo: '6 days ago',
    url: '#',
    isFeatured: false,
    tags: ['Technology', 'Coffee', 'Loyalty'],
    relatedFranchise: 'coffee-culture',
  },
  {
    id: 'ontario-franchise-record-growth',
    title: "Ontario Franchise Market Hits Record $28B in Annual Revenue — Growth Up 12% YoY",
    excerpt:
      "The Canadian Franchise Association's 2025 annual report reveals Ontario franchises generated a record $28 billion in revenue, up 12% from 2024. Food & beverage, fitness, and home services led the way, with Ontario remaining Canada's hottest franchise market.",
    category: 'Industry',
    source: 'Canadian Franchise Association',
    publishedAt: '2026-03-18',
    timeAgo: '8 days ago',
    url: '#',
    isFeatured: true,
    tags: ['Industry Report', 'Growth', 'Ontario'],
  },
  {
    id: 'cfa-investment-outlook',
    title: "Canadian Franchise Association Releases 2026 Investment Outlook — Food & Fitness Lead",
    excerpt:
      "The CFA's 2026 Franchise Investment Outlook projects a 9% increase in new franchise openings across Canada, with Ontario accounting for 38% of all new units. The report highlights food & beverage and fitness categories as top performers for ROI.",
    category: 'Industry',
    source: 'Canadian Franchise Association',
    publishedAt: '2026-03-15',
    timeAgo: '11 days ago',
    url: '#',
    isFeatured: false,
    tags: ['Investment', 'CFA', 'Outlook 2026'],
  },
  {
    id: 'gta-franchise-boom',
    title: "Greater Toronto Area Sees Franchise Surge — 180 New Locations Opened in Q1 2026",
    excerpt:
      "The GTA franchise market continues to outpace national growth with 180 new franchise locations opening in Q1 2026. Suburban markets in Mississauga, Brampton, and Markham saw the highest concentration of new openings, driven by population growth.",
    category: 'Market News',
    source: 'Toronto Star Business',
    publishedAt: '2026-03-12',
    timeAgo: '14 days ago',
    url: '#',
    isFeatured: false,
    tags: ['GTA', 'Expansion', 'Market'],
  },
  {
    id: 'franchise-disclosure-update',
    title: "Ontario Updates Franchise Disclosure Regulations — What Buyers Need to Know in 2026",
    excerpt:
      "Ontario's Ministry of Public and Business Service Delivery has released updated guidelines for franchise disclosure documents under the Arthur Wishart Act. Key changes affect cooling-off periods and financial statement requirements for new franchise agreements.",
    category: 'Legal & Regulatory',
    source: 'Ontario Franchise Law',
    publishedAt: '2026-03-10',
    timeAgo: '16 days ago',
    url: '#',
    isFeatured: false,
    tags: ['Legal', 'Regulation', 'Disclosure'],
  },
  {
    id: 'fitness-franchise-boom',
    title: "Fitness Franchises Booming in Ontario — Post-Pandemic Health Trend Drives 40% Revenue Jump",
    excerpt:
      "Ontario's fitness franchise sector reported a 40% revenue increase in 2025, with budget gym brands and boutique fitness studios leading the way. Industry analysts attribute the growth to sustained post-pandemic health consciousness and affordable membership models.",
    category: 'Industry',
    source: 'Franchise Times Canada',
    publishedAt: '2026-03-08',
    timeAgo: '18 days ago',
    url: '#',
    isFeatured: false,
    tags: ['Fitness', 'Growth', 'Wellness'],
  },
  {
    id: 'franchise-investment-guide-2026',
    title: "Top 10 Franchise Investment Opportunities in Ontario for 2026 — Complete Guide",
    excerpt:
      "Our annual franchise investment guide ranks Ontario's top franchise opportunities based on initial investment, franchisee satisfaction, brand growth, and market potential. Food & beverage brands dominate the top tier, with home services close behind.",
    category: 'Guides',
    source: 'FranchiseOntario.com',
    publishedAt: '2026-03-05',
    timeAgo: '21 days ago',
    url: '#',
    isFeatured: false,
    tags: ['Guide', 'Investment', 'Top 10'],
  },
  {
    id: 'remote-franchise-models',
    title: "Semi-Absentee Franchise Models Growing in Ontario — New Wave of Investor-Operators Emerges",
    excerpt:
      "A new trend of semi-absentee franchise ownership is gaining traction in Ontario, with brands designing models that allow investor-owners to manage remotely. Service-based franchises, gyms, and tutoring centres are leading this structural shift.",
    category: 'Trends',
    source: 'Franchise Business Review',
    publishedAt: '2026-03-02',
    timeAgo: '24 days ago',
    url: '#',
    isFeatured: false,
    tags: ['Trends', 'Ownership Models', 'Investment'],
  },
];

export const newsCategories = ['All', 'Expansion', 'Industry', 'Brand News', 'Technology', 'Legal & Regulatory', 'Market News', 'Guides', 'Trends'];

export const tickerItems = [
  "🔴 BREAKING: Chuck's Roadhouse announces 20 new Ontario locations for 2026",
  "📈 Ontario franchise market hits record $28B in revenue",
  "☕ Coffee Culture loyalty app launches — 30% visit increase reported",
  "🦞 Crabby Joe's celebrates 30+ years with new menu rollout",
  "💪 Fitness franchises see 40% revenue jump in Ontario",
  "📋 CFA releases 2026 franchise investment outlook — food & fitness lead",
  "🏙️ GTA sees 180 new franchise locations in Q1 2026",
  "⚖️ Ontario updates franchise disclosure regulations for 2026",
];

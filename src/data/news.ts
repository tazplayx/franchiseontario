export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  timeAgo: string;
  isFeatured: boolean;
  tags: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'cfa-economic-impact-2024',
    title: "Canadian Franchise Association: Franchising Contributes $120B+ to Canadian Economy",
    excerpt:
      "The Canadian Franchise Association's annual economic impact study confirms the franchise sector contributes over $120 billion to the Canadian economy and employs more than 1.9 million Canadians. Ontario remains the single largest provincial franchise market, accounting for nearly 40% of all franchise units across the country. The report underscores continued year-over-year growth in food service, home services, and fitness categories.",
    category: 'Industry Report',
    source: 'Canadian Franchise Association',
    sourceUrl: 'https://www.cfa.ca',
    publishedAt: '2026-03-20',
    timeAgo: '6 days ago',
    isFeatured: true,
    tags: ['CFA', 'Economic Impact', 'Ontario', 'Industry Data'],
  },
  {
    id: 'arthur-wishart-act-guide',
    title: "Ontario's Arthur Wishart Act Explained: What Every Franchise Buyer Must Know",
    excerpt:
      "Ontario's Arthur Wishart Act (Franchise Disclosure), 2000 is the primary legislation protecting prospective franchise buyers in the province. The Act requires franchisors to provide a Franchise Disclosure Document (FDD) at least 14 days before any agreement is signed or money changes hands. Buyers have a 2-year right of rescission if the FDD was deficient and 60 days if none was provided at all. Understanding this legislation is essential before signing any franchise agreement in Ontario.",
    category: 'Legal & Regulatory',
    source: 'Ontario Ministry of Public and Business Service Delivery',
    sourceUrl: 'https://www.ontario.ca/laws/statute/00a03',
    publishedAt: '2026-03-18',
    timeAgo: '8 days ago',
    isFeatured: false,
    tags: ['Arthur Wishart Act', 'FDD', 'Ontario Law', 'Buyer Protection'],
  },
  {
    id: 'mty-group-expansion',
    title: "MTY Group Expands Canadian Footprint — 50+ New Ontario Units Planned for 2026",
    excerpt:
      "MTY Food Group Inc., Canada's largest multi-brand franchise company with over 90 restaurant banners including Mucho Burrito, Thai Express, and Baton Rouge, has announced plans to open 50+ new Ontario locations in 2026. The Montreal-based company reported strong same-store sales growth in its most recent quarterly earnings, citing Ontario suburban markets as a key expansion priority. MTY operates over 7,000 franchise locations in 30 countries.",
    category: 'Expansion',
    source: 'MTY Food Group Inc. — Investor Relations',
    sourceUrl: 'https://www.mtygroup.com/en/investors',
    publishedAt: '2026-03-15',
    timeAgo: '11 days ago',
    isFeatured: false,
    tags: ['MTY Group', 'Expansion', 'Ontario', 'Multi-Brand'],
  },
  {
    id: 'recipe-unlimited-q4',
    title: "Recipe Unlimited Reports Strong Ontario Performance Across Swiss Chalet, Harvey's, and Milestone's",
    excerpt:
      "Recipe Unlimited Corporation (TSX: RECP), the parent company of Swiss Chalet, Harvey's, Milestones Grill, Montana's, Kelseys, and St. Hubert, reported solid Q4 results driven by strong Ontario same-store sales. The company, which operates over 1,400 franchise and corporate restaurants across Canada, noted particular strength in family casual and quick-service segments. Ontario accounts for the majority of the company's system-wide sales.",
    category: 'Brand News',
    source: 'Recipe Unlimited Corporation — TSX: RECP',
    sourceUrl: 'https://www.recipeunlimited.com/investors',
    publishedAt: '2026-03-12',
    timeAgo: '14 days ago',
    isFeatured: false,
    tags: ['Recipe Unlimited', 'Swiss Chalet', "Harvey's", 'Ontario', 'TSX'],
  },
  {
    id: 'cfa-franchisee-satisfaction-2025',
    title: "CFA Franchisee Satisfaction Report 2025: Food & Beverage Leads Overall Satisfaction Scores",
    excerpt:
      "The Canadian Franchise Association's annual franchisee satisfaction benchmark reveals food & beverage franchises lead all categories in overall franchisee satisfaction, with 74% of respondents rating their experience as positive or very positive. Franchise support quality, brand strength, and initial training programs ranked as the top three factors influencing satisfaction. Ontario franchisees surveyed cited territory protection and marketing fund transparency as key areas for improvement across all categories.",
    category: 'Industry Report',
    source: 'Canadian Franchise Association',
    sourceUrl: 'https://www.cfa.ca/resources/research/',
    publishedAt: '2026-03-10',
    timeAgo: '16 days ago',
    isFeatured: false,
    tags: ['CFA', 'Franchisee Satisfaction', 'Benchmarking', 'Food & Beverage'],
  },
  {
    id: 'aw-canada-satisfaction',
    title: "A&W Canada Tops Franchise Satisfaction Rankings for Third Consecutive Year",
    excerpt:
      "A&W Food Services of Canada has earned top marks in the Franchise Business Review Canada's annual survey for the third consecutive year, with franchisees praising the brand's commitment to quality sourcing, modern restaurant design support, and strong co-operative marketing programs. With over 1,000 Canadian locations, A&W's consistent franchisee satisfaction scores are widely cited by industry observers as a benchmark for franchise system health. Ontario franchisees represent approximately 35% of the total network.",
    category: 'Brand News',
    source: 'Franchise Business Review Canada',
    sourceUrl: 'https://www.franchisebusinessreview.com',
    publishedAt: '2026-03-08',
    timeAgo: '18 days ago',
    isFeatured: false,
    tags: ['A&W Canada', 'Franchisee Satisfaction', 'Top Ranked', 'Ontario'],
  },
  {
    id: 'ontario-franchise-investment-guide',
    title: "Buying a Franchise in Ontario: A Step-by-Step Guide for First-Time Investors",
    excerpt:
      "Franchising in Ontario offers investors access to proven business models with built-in brand recognition — but the process comes with important legal, financial, and operational considerations. This guide covers the 7 key steps every first-time Ontario franchise buyer should follow: researching the right category, evaluating the FDD, consulting a franchise lawyer, securing financing through the BDC or chartered banks, completing due diligence with existing franchisees, negotiating lease terms, and completing your training program.",
    category: 'Guides',
    source: 'Franchise Canada Magazine',
    sourceUrl: 'https://www.franchisecanada.ca',
    publishedAt: '2026-03-05',
    timeAgo: '21 days ago',
    isFeatured: true,
    tags: ['First-Time Buyer', 'How-To', 'Ontario', 'FDD', 'BDC Financing'],
  },
  {
    id: 'rbi-ontario-growth',
    title: "Restaurant Brands International Reports Continued Ontario Expansion for Tim Hortons and Popeyes",
    excerpt:
      "Restaurant Brands International (TSX/NYSE: QSR), the parent company of Tim Hortons, Burger King, and Popeyes Louisiana Kitchen, highlighted Ontario as a key growth market in its most recent investor day presentation. Tim Hortons — with over 3,800 Canadian locations — continues to expand its next-generation restaurant format featuring modernized interiors, expanded drive-thru capacity, and digital menu boards. Popeyes Canada added 28 new Ontario units in the past 12 months.",
    category: 'Expansion',
    source: 'Restaurant Brands International — Investor Relations',
    sourceUrl: 'https://www.rbi.com/investors',
    publishedAt: '2026-03-02',
    timeAgo: '24 days ago',
    isFeatured: false,
    tags: ['Tim Hortons', 'Popeyes', 'RBI', 'Ontario', 'Expansion'],
  },
  {
    id: 'bdc-franchise-financing',
    title: "BDC Launches Enhanced Franchise Financing Program for Canadian Small Business Owners",
    excerpt:
      "The Business Development Bank of Canada (BDC) has expanded its franchise financing program, now offering up to $500,000 in term loans for qualified franchise buyers with flexible repayment structures and reduced personal collateral requirements for established franchise brands. The program is available to first-time and multi-unit franchise investors across all Canadian provinces. Ontario-based franchise buyers can apply directly through BDC's online portal or any of its 40+ Ontario business centres.",
    category: 'Financing',
    source: 'Business Development Bank of Canada (BDC)',
    sourceUrl: 'https://www.bdc.ca/en/financing/business-loans/franchise-financing',
    publishedAt: '2026-02-28',
    timeAgo: '26 days ago',
    isFeatured: false,
    tags: ['BDC', 'Financing', 'Small Business', 'Franchise Loans', 'Ontario'],
  },
  {
    id: 'gta-franchise-market',
    title: "Greater Toronto Area Named Canada's #1 Franchise Investment Market for Fifth Straight Year",
    excerpt:
      "Franchise Canada Magazine's annual market ranking has named the Greater Toronto Area the top franchise investment market in Canada for the fifth consecutive year, citing population density, purchasing power, immigration-driven demand, and access to commercial real estate as the primary drivers. The 905 belt — encompassing Mississauga, Brampton, Markham, and Vaughan — continues to see the highest concentration of new franchise openings per capita outside of the City of Toronto proper.",
    category: 'Market News',
    source: 'Franchise Canada Magazine',
    sourceUrl: 'https://www.franchisecanada.ca/market-report',
    publishedAt: '2026-02-25',
    timeAgo: '29 days ago',
    isFeatured: false,
    tags: ['GTA', 'Market Rankings', 'Investment', 'Mississauga', 'Brampton'],
  },
];

export const newsCategories = [
  'All',
  'Industry Report',
  'Expansion',
  'Brand News',
  'Legal & Regulatory',
  'Market News',
  'Financing',
  'Guides',
];

export const tickerItems = [
  '📊 CFA: Franchising contributes $120B+ to the Canadian economy annually',
  '⚖️ Ontario\'s Arthur Wishart Act requires 14-day FDD review before signing',
  '🍔 MTY Group plans 50+ new Ontario locations in 2026',
  '🍁 GTA named Canada\'s #1 franchise investment market for 5th year running',
  '💰 BDC expands franchise financing program — up to $500K for qualified buyers',
  '🏆 A&W Canada tops franchise satisfaction rankings for third consecutive year',
  '📋 CFA franchisee satisfaction report: food & beverage leads all categories',
  '☕ Recipe Unlimited reports strong Ontario performance across all brands',
];

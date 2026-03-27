import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ontario Franchise News & Industry Updates',
  description:
    'The latest franchise industry news from Ontario and Canada — covering CFA reports, brand expansions, franchise law, BDC financing, and market data. Updated regularly from trusted Canadian sources.',
  keywords: [
    'Ontario franchise news',
    'Canadian franchise industry',
    'CFA Canada news',
    'franchise expansion Ontario',
    'Arthur Wishart Act',
    'franchise investment Canada 2026',
  ],
  alternates: { canonical: 'https://www.franchiseontario.com/news' },
  openGraph: {
    title: 'Ontario Franchise News & Industry Updates — FranchiseOntario.com',
    description: 'Stay current with franchise industry news from Ontario and Canada. Sourced from CFA, Franchise Canada Magazine, BDC, and major Canadian business publications.',
    url: 'https://www.franchiseontario.com/news',
  },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

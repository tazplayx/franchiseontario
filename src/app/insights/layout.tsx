import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Franchise Insights — News, Guides & Blog | FranchiseOntario.com',
  description:
    'Stay ahead with live Ontario franchise industry news, expert buying guides, top-10 lists, legal explainers, and weekly blog posts from the FranchiseOntario editorial team.',
  keywords: [
    'franchise insights Ontario',
    'Ontario franchise news',
    'franchise buying guide Canada',
    'franchise blog Ontario',
    'franchise tips Canada',
    'Arthur Wishart Act guide',
    'franchise investment Ontario 2026',
    'franchise industry news Canada',
  ],
  alternates: { canonical: 'https://www.franchiseontario.com/insights' },
  openGraph: {
    title: 'Franchise Insights — News, Guides & Blog | FranchiseOntario.com',
    description:
      'Live Ontario franchise news + expert buying guides, top-10 lists, and weekly franchise blog posts from the FranchiseOntario editorial team.',
    url: 'https://www.franchiseontario.com/insights',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Franchise Insights — Ontario News & Blog',
    description: 'Live franchise news + expert guides and weekly blog posts from FranchiseOntario.com.',
  },
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Franchise Insights — News, Guides & Blog | FranchiseOntario.com',
  description:
    'Live Ontario franchise industry news plus expert buying guides, top-10 lists, and weekly blog posts. Updated Monday, Wednesday, and Friday.',
  alternates: { canonical: 'https://www.franchiseontario.com/insights' },
  openGraph: {
    title: 'Franchise Insights — FranchiseOntario.com',
    url: 'https://www.franchiseontario.com/insights',
  },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

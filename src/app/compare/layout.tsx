import type { Metadata } from 'next'

const BASE = 'https://www.franchiseontario.com'

export const metadata: Metadata = {
  title: 'Compare Ontario Franchises Side-by-Side — FranchiseOntario.com',
  description:
    'Compare up to 3 Ontario franchise opportunities side by side. See franchise fees, royalties, investment ranges, training, territory, and more in one view.',
  keywords: [
    'compare franchises Ontario',
    'franchise comparison tool',
    'side by side franchise comparison',
    'franchise fees comparison Ontario',
    'best franchise to buy Ontario',
  ],
  alternates: { canonical: `${BASE}/compare` },
  openGraph: {
    title: 'Compare Ontario Franchises Side-by-Side',
    description: 'Compare up to 3 Ontario franchise opportunities side by side. Fees, royalties, investment ranges, training, and territory in one view.',
    url: `${BASE}/compare`,
    type: 'website',
    locale: 'en_CA',
    siteName: 'FranchiseOntario.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Ontario Franchises Side-by-Side',
    description: 'Compare up to 3 Ontario franchise opportunities side by side. Fees, royalties, investment ranges in one view.',
  },
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

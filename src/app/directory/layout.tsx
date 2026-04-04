import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Ontario & Canada Franchise Listings — Franchise Directory',
  description:
    'Search 500+ franchise opportunities in Ontario and across Canada by category, investment level, and listing tier. Compare franchise brands side-by-side. From food & beverage to fitness, home services, and more.',
  keywords: [
    'franchise directory Ontario',
    'franchise listings Ontario',
    'buy a franchise Ontario',
    'franchise opportunities Canada',
    'franchise for sale Ontario',
    'food franchise Ontario',
    'fitness franchise Ontario',
  ],
  alternates: { canonical: 'https://www.franchiseontario.com/directory' },
  openGraph: {
    title: 'Ontario Franchise Directory — Browse 500+ Listings',
    description: 'Search and filter Ontario franchise opportunities by category, investment range, and tier. Find your perfect franchise match.',
    url: 'https://www.franchiseontario.com/directory',
  },
}

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'

const BASE = 'https://www.franchiseontario.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "FranchiseOntario.com — Ontario's #1 Franchise Directory",
    template: '%s | FranchiseOntario.com',
  },
  description:
    "Discover top franchise opportunities in Ontario, Canada. Browse 500+ franchise listings, compare investment levels, read franchise news, and connect with Canada's best brands. Free to list.",
  keywords: [
    'franchise Ontario',
    'buy a franchise Ontario',
    'franchise directory Canada',
    'franchise opportunities Toronto',
    'Canadian franchise investment',
    'Ontario franchise listings',
    'franchise for sale Ontario',
    'best franchises Canada',
    'franchise business Ontario',
    'franchise directory Ontario',
    'food franchise Ontario',
    'restaurant franchise Canada',
    'franchise investment Ontario',
    'franchise opportunities GTA',
  ],
  authors: [{ name: 'FranchiseOntario.com' }],
  creator: 'FranchiseOntario.com',
  publisher: 'FranchiseOntario.com',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE,
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: BASE,
    siteName: 'FranchiseOntario.com',
    title: "FranchiseOntario.com — Ontario's #1 Franchise Directory",
    description:
      "Discover top franchise opportunities in Ontario, Canada. Browse 500+ franchise listings, compare investment levels, and connect with Canada's best brands.",
    images: [
      {
        url: `${BASE}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "FranchiseOntario.com — Ontario's #1 Franchise Directory",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "FranchiseOntario.com — Ontario's #1 Franchise Directory",
    description:
      "Discover top franchise opportunities in Ontario, Canada. Browse 500+ listings and connect with the best Canadian franchise brands.",
    images: [`${BASE}/og-image.png`],
    creator: '@FranchiseON',
  },
  other: {
    'geo.region': 'CA-ON',
    'geo.placename': 'Ontario, Canada',
    'geo.position': '44.0;-79.0',
    'ICBM': '44.0, -79.0',
  },
  verification: {
    // Add your Google Search Console verification token here once you have it
    // google: 'your-google-verification-token',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE}/#organization`,
  name: 'FranchiseOntario.com',
  url: BASE,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE}/logo.png`,
    width: 180,
    height: 60,
  },
  description:
    "Ontario's most comprehensive franchise directory — connecting investors with top franchise brands across all industries in Ontario, Canada.",
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@franchiseontario.com',
    contactType: 'customer service',
    areaServed: 'CA-ON',
    availableLanguage: 'English',
  },
  sameAs: ['https://github.com/tazplayx/franchiseontario'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE}/#website`,
  url: BASE,
  name: 'FranchiseOntario.com',
  description: "Ontario's #1 franchise directory",
  publisher: { '@id': `${BASE}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE}/directory?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-CA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

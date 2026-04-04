import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import { franchises, getFranchiseById } from '@/data/franchises'
import ClientListingBody from '@/components/ClientListingBody'

const BASE = 'https://www.franchiseontario.com'

export async function generateStaticParams() {
  return franchises.map((f) => ({ id: f.id }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const f = getFranchiseById(params.id)
  if (!f) return {}
  return {
    title: `${f.name} Franchise — Ontario Profile, Investment & Fees`,
    description: `${f.name} franchise details for Ontario investors: ${f.financials.franchiseFee} franchise fee, ${f.financials.royaltyRate} royalty, ${f.locations}+ locations. Investment range $${(f.financials.investmentMin/1000).toFixed(0)}K–$${(f.financials.investmentMax/1000).toFixed(0)}K.`,
    keywords: [`${f.name} franchise Ontario`, `${f.name} franchise fee`, `${f.name} investment`, `${f.category} franchise Ontario`, 'franchise opportunity Ontario'],
    alternates: { canonical: `${BASE}/directory/${f.id}` },
    openGraph: {
      title: `${f.name} Franchise — Ontario Investment Profile`,
      description: `${f.name}: ${f.financials.franchiseFee} franchise fee, ${f.financials.royaltyRate} royalty, ${f.locations}+ locations, avg unit volume ${f.financials.averageUnitVolume}.`,
      url: `${BASE}/directory/${f.id}`,
    },
  }
}

export default function FranchiseProfilePage({ params }: { params: { id: string } }) {
  const franchise = getFranchiseById(params.id)
  if (!franchise) notFound()

  const f = franchise

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE}/directory/${f.id}`,
    name: f.name,
    description: f.description,
    url: f.website,
    telephone: f.phone,
    email: f.email,
    image: `${BASE}/og-image.png`,
    foundingDate: String(f.established),
    areaServed: { '@type': 'State', name: 'Ontario', containedInPlace: { '@type': 'Country', name: 'Canada' } },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: f.rating,
      reviewCount: f.reviews,
      bestRating: 5,
      worstRating: 1,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Directory', item: `${BASE}/directory` },
      { '@type': 'ListItem', position: 3, name: f.name, item: `${BASE}/directory/${f.id}` },
    ],
  }

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ClientListingBody seed={f} />
    </>
  )
}

import { MetadataRoute } from 'next'
import { franchises } from '@/data/franchises'

const BASE = 'https://www.franchiseontario.com'

const ontarioCities = [
  'toronto', 'ottawa', 'mississauga', 'brampton', 'hamilton',
  'london', 'kitchener', 'windsor', 'barrie', 'oshawa',
  'sudbury', 'thunder-bay',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE}/directory`, priority: 0.95, changeFrequency: 'daily' as const },
    { url: `${BASE}/quiz`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE}/ontario`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/news`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE}/resources`, priority: 0.85, changeFrequency: 'weekly' as const },
    { url: `${BASE}/categories`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/compare`, priority: 0.75, changeFrequency: 'weekly' as const },
    { url: `${BASE}/pricing`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/faq`, priority: 0.75, changeFrequency: 'weekly' as const },
    { url: `${BASE}/register`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE}/support`, priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  const franchisePages = franchises.map((f) => ({
    url: `${BASE}/directory/${f.id}`,
    priority: f.tier === 'enterprise' ? 0.95 : f.tier === 'premium' ? 0.85 : 0.7,
    changeFrequency: 'weekly' as const,
  }))

  const cityPages = ontarioCities.map((city) => ({
    url: `${BASE}/ontario/${city}`,
    priority: city === 'toronto' || city === 'ottawa' ? 0.85 : 0.75,
    changeFrequency: 'weekly' as const,
  }))

  return [
    ...staticPages.map((p) => ({
      url: p.url,
      lastModified: new Date(),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...franchisePages.map((p) => ({
      url: p.url,
      lastModified: new Date(),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...cityPages.map((p) => ({
      url: p.url,
      lastModified: new Date(),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
  ]
}

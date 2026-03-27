import { MetadataRoute } from 'next'
import { franchises } from '@/data/franchises'

const BASE = 'https://www.franchiseontario.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE}/directory`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE}/news`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE}/categories`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/pricing`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/faq`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${BASE}/support`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE}/register`, priority: 0.7, changeFrequency: 'monthly' as const },
  ]

  const franchisePages = franchises.map((f) => ({
    url: `${BASE}/directory/${f.id}`,
    priority: f.tier === 'enterprise' ? 0.95 : f.tier === 'premium' ? 0.85 : 0.7,
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
  ]
}

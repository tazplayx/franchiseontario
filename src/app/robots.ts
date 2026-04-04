import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Default: allow all public content, block admin + owner portal
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/dashboard/login',
          '/api/',
        ],
      },
      // ── Search engines ─────────────────────────────────────────────────
      { userAgent: 'Googlebot', allow: '/', disallow: ['/admin/', '/dashboard/', '/api/'] },
      { userAgent: 'Bingbot', allow: '/', disallow: ['/admin/', '/dashboard/', '/api/'] },
      { userAgent: 'Slurp', allow: '/' },           // Yahoo
      { userAgent: 'DuckDuckBot', allow: '/' },
      { userAgent: 'Baiduspider', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },
      // ── AI crawlers ────────────────────────────────────────────────────
      { userAgent: 'GPTBot', allow: '/' },          // OpenAI
      { userAgent: 'ChatGPT-User', allow: '/' },    // ChatGPT browsing
      { userAgent: 'OAI-SearchBot', allow: '/' },   // Bing AI / Copilot
      { userAgent: 'ClaudeBot', allow: '/' },       // Anthropic Claude
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },   // Perplexity AI
      { userAgent: 'cohere-ai', allow: '/' },       // Cohere
      { userAgent: 'YouBot', allow: '/' },          // You.com
      { userAgent: 'Diffbot', allow: '/' },         // Diffbot knowledge graph
      { userAgent: 'Meta-ExternalAgent', allow: '/' }, // Meta AI
      { userAgent: 'Applebot', allow: '/' },        // Apple Siri / Spotlight
      { userAgent: 'ia_archiver', allow: '/' },     // Internet Archive / Wayback Machine
    ],
    sitemap: 'https://www.franchiseontario.com/sitemap.xml',
    host: 'https://www.franchiseontario.com',
  }
}

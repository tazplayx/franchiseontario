/**
 * /api/news
 *
 * Server-side RSS aggregator for live franchise news.
 * Fetches from Google News RSS (free, no API key required).
 * Results are cached for 1 hour via Next.js ISR revalidation.
 *
 * Returns: { articles: NewsArticle[], fallback: boolean }
 */

import { NextResponse } from 'next/server'
import type { NewsArticle } from '@/data/news'

export const revalidate = 3600 // re-fetch at most once per hour

// ── RSS feeds ──────────────────────────────────────────────────────────────────
const FEEDS = [
  'https://news.google.com/rss/search?q=franchise+Ontario+Canada&hl=en-CA&gl=CA&ceid=CA:en',
  'https://news.google.com/rss/search?q=Canadian+franchise+business+expansion&hl=en-CA&gl=CA&ceid=CA:en',
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function stripTags(str: string): string {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#\d+;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function timeAgo(pubDate: string): string {
  if (!pubDate) return 'Recently'
  try {
    const diff = Date.now() - new Date(pubDate).getTime()
    const h = Math.floor(diff / 3_600_000)
    const d = Math.floor(h / 24)
    if (h < 1) return 'Just now'
    if (h < 24) return `${h}h ago`
    if (d === 1) return '1 day ago'
    if (d < 7) return `${d} days ago`
    if (d < 30) return `${Math.floor(d / 7)} weeks ago`
    return `${Math.floor(d / 30)} months ago`
  } catch {
    return 'Recently'
  }
}

function categorise(title: string, desc: string): string {
  const t = (title + ' ' + desc).toLowerCase()
  if (/expand|open|new location|new unit|new store|launch/.test(t)) return 'Expansion'
  if (/law|legal|regulat|court|wishart|act|legislation|ruling/.test(t)) return 'Legal & Regulatory'
  if (/report|survey|study|research|data|statistic|index|ranking/.test(t)) return 'Industry Report'
  if (/financ|invest|loan|bdc|bank|fund|capital|grant/.test(t)) return 'Financing'
  if (/guide|how.to|tips|steps|checklist|buyer.guide/.test(t)) return 'Guides'
  if (/market|gta|toronto|ontario|city|region/.test(t)) return 'Market News'
  return 'Brand News'
}

function extractTags(title: string, desc: string): string[] {
  const t = (title + ' ' + desc).toLowerCase()
  const tags: string[] = []
  if (/ontario/.test(t)) tags.push('Ontario')
  if (/toronto|gta/.test(t)) tags.push('GTA')
  if (/canada|canadian/.test(t)) tags.push('Canada')
  if (/food|restaurant|caf[eé]|coffee/.test(t)) tags.push('Food & Beverage')
  if (/fitness|health|wellness/.test(t)) tags.push('Health & Fitness')
  if (/home.service|cleaning|real.estate/.test(t)) tags.push('Home Services')
  if (tags.length === 0) tags.push('Franchise')
  return tags
}

// Google News article titles come as "Headline — Source" — strip the source suffix
function cleanTitle(raw: string): string {
  return raw.replace(/\s[-–—]\s[^-–—]+$/, '').trim()
}

function parseRSS(xml: string, feedIndex: number): NewsArticle[] {
  const items: NewsArticle[] = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  let m: RegExpExecArray | null
  let i = 0

  while ((m = itemRe.exec(xml)) !== null && i < 10) {
    const block = m[1]
    const rawTitle = stripTags(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
    const link =
      stripTags(block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? '') ||
      stripTags(block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1] ?? '')
    // Strip HTML first, then slice — avoids cutting mid-tag and leaving fragments
    const desc = stripTags(block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? '').slice(0, 220)
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? ''
    const source = stripTags(block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? 'Franchise News')

    const title = cleanTitle(rawTitle)
    if (!title || !link) { i++; continue }

    const category = categorise(title, desc)
    items.push({
      id: `live-${feedIndex}-${i}-${Date.now()}`,
      title,
      excerpt: desc || 'Click to read the full article from ' + source + '.',
      category,
      source,
      sourceUrl: link,
      publishedAt: pubDate ? new Date(pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      timeAgo: timeAgo(pubDate),
      isFeatured: feedIndex === 0 && i === 0,
      tags: extractTags(title, desc),
    })
    i++
  }
  return items
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function GET() {
  const all: NewsArticle[] = []

  for (let fi = 0; fi < FEEDS.length; fi++) {
    try {
      const res = await fetch(FEEDS[fi], {
        headers: { 'User-Agent': 'FranchiseOntario-NewsBot/1.0' },
        next: { revalidate: 3600 },
      })
      if (!res.ok) continue
      const xml = await res.text()
      all.push(...parseRSS(xml, fi))
    } catch {
      // skip failed feed silently
    }
  }

  // Deduplicate by title prefix, keep freshest 15
  const seen = new Set<string>()
  const unique = all.filter((a) => {
    const key = a.title.slice(0, 60).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 15)

  // Re-mark the first surviving article as featured
  if (unique.length > 0) {
    unique.forEach((a, idx) => { a.isFeatured = idx === 0 })
  }

  return NextResponse.json({
    articles: unique,
    fallback: unique.length === 0,
    fetchedAt: new Date().toISOString(),
  })
}

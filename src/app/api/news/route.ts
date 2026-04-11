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
    // 1. Unwrap CDATA
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    // 2. Decode HTML entities FIRST so entity-encoded tags become real tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    // 3. Now strip all HTML tags (including ones that were entity-encoded above)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
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

// ── Category fallback thumbnails (Unsplash) ────────────────────────────────────
const CATEGORY_IMAGES: Record<string, string> = {
  'Expansion':          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&auto=format',
  'Brand News':         'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop&auto=format',
  'Market News':        'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=450&fit=crop&auto=format',
  'Financing':          'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=450&fit=crop&auto=format',
  'Legal & Regulatory': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop&auto=format',
  'Industry Report':    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format',
  'Guides':             'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop&auto=format',
}
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop&auto=format'

/** Reject OG images that are just Google's own icons / logos. */
function isValidThumbnail(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return !['google.com', 'googleapis.com', 'gstatic.com', 'googleusercontent.com']
      .some((d) => hostname === d || hostname.endsWith('.' + d))
  } catch {
    return false
  }
}

// ── OG image fetcher ───────────────────────────────────────────────────────────
async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FranchiseOntario-NewsBot/1.0)',
        'Accept': 'text/html',
      },
      redirect: 'follow',
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    // Only read enough HTML to find meta tags (first 20KB avoids streaming entire page)
    const reader = res.body?.getReader()
    if (!reader) return null
    let html = ''
    while (html.length < 20000) {
      const { done, value } = await reader.read()
      if (done) break
      html += new TextDecoder().decode(value)
      // Stop early if we've passed the <head> section
      if (html.includes('</head>') || html.includes('<body')) break
    }
    reader.cancel().catch(() => {})

    // Match og:image (both attribute orderings)
    const ogImage =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i)?.[1]

    return ogImage || null
  } catch {
    return null
  }
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

  // Fetch OG images concurrently (best-effort, 4s timeout each)
  // Falls back to a curated category image so every article always has a thumbnail.
  if (unique.length > 0) {
    const imageResults = await Promise.allSettled(
      unique.map((a) => fetchOgImage(a.sourceUrl))
    )
    imageResults.forEach((result, i) => {
      const ogUrl = result.status === 'fulfilled' ? result.value : null
      if (ogUrl && isValidThumbnail(ogUrl)) {
        unique[i].thumbnailUrl = ogUrl
      } else {
        unique[i].thumbnailUrl = CATEGORY_IMAGES[unique[i].category] ?? DEFAULT_IMAGE
      }
    })
  }

  return NextResponse.json({
    articles: unique,
    fallback: unique.length === 0,
    fetchedAt: new Date().toISOString(),
  })
}

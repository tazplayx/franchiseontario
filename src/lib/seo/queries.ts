import { franchises, categories, type Franchise, type FranchiseCategory } from '@/data/franchises'
import {
  ONTARIO_CITIES,
  INVESTMENT_TIERS,
  SLUG_TO_CATEGORY,
  CATEGORY_SLUG_MAP,
  type SEOCity,
  type InvestmentTier,
} from './data'

// ── Category queries ──────────────────────────────────────────────────────
export function getCategoryBySlug(slug: string): FranchiseCategory | null {
  return SLUG_TO_CATEGORY[slug] ?? null
}

export function getFranchisesByCategory(categorySlug: string): Franchise[] {
  const cat = getCategoryBySlug(categorySlug)
  if (!cat) return []
  return franchises.filter((f) => f.category === cat)
}

export function getCategorySlug(name: FranchiseCategory): string {
  return CATEGORY_SLUG_MAP[name]
}

export function getAllCategoryParams() {
  // Only return categories that have at least one franchise
  return categories
    .filter((cat) => franchises.some((f) => f.category === cat.name))
    .map((cat) => ({ category: CATEGORY_SLUG_MAP[cat.name] }))
}

// ── City queries ──────────────────────────────────────────────────────────
export function getCityBySlug(slug: string): SEOCity | null {
  return ONTARIO_CITIES.find((c) => c.slug === slug) ?? null
}

export function getAllCityParams() {
  return ONTARIO_CITIES.map((c) => ({ city: c.slug }))
}

// ── City × Category queries ────────────────────────────────────────────────
export function getCityCategoryParams() {
  const activeCats = categories.filter((cat) =>
    franchises.some((f) => f.category === cat.name)
  )
  return ONTARIO_CITIES.flatMap((city) =>
    activeCats.map((cat) => ({
      city: city.slug,
      category: CATEGORY_SLUG_MAP[cat.name],
    }))
  )
}

// Franchises for a city×category page are filtered by category only
// (all listings are Ontario-wide; city gives the page its unique SEO context)
export function getFranchisesForCityCategory(
  citySlug: string,
  categorySlug: string
): Franchise[] {
  return getFranchisesByCategory(categorySlug)
}

// ── Investment tier queries ────────────────────────────────────────────────
export function getTierBySlug(slug: string): InvestmentTier | null {
  return INVESTMENT_TIERS.find((t) => t.slug === slug) ?? null
}

export function getFranchisesByInvestment(tierSlug: string): Franchise[] {
  const tier = getTierBySlug(tierSlug)
  if (!tier) return []
  return franchises.filter((f) => {
    const min = f.financials.investmentMin
    if (min < tier.min) return false
    if (tier.max !== null && min > tier.max) return false
    return true
  })
}

// ── Stat helpers ──────────────────────────────────────────────────────────
export function formatInvestment(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`
  return `$${amount.toLocaleString()}`
}

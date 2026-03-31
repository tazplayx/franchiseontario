import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Search, TrendingUp, Award, Zap, Star, ArrowRight, Crown, ChevronRight, Newspaper, BarChart3, MapPin, Users, Sparkles, CheckCircle } from 'lucide-react'
import { franchises, categories, getTopRanked } from '@/data/franchises'
import { tickerItems, newsArticles } from '@/data/news'
import FranchiseCard from '@/components/FranchiseCard'
import JsonLd from '@/components/JsonLd'
import HeroSearch from '@/components/HeroSearch'
import { ClientFeaturedSpotlight, ClientTopRanked } from '@/components/ClientHomepageSections'

const BASE = 'https://www.franchiseontario.com'

export const metadata: Metadata = {
  title: "Ontario's #1 Franchise Directory — Find Your Franchise",
  description:
    'FranchiseOntario.com — browse 500+ franchise opportunities across Ontario, Canada. Compare investment ranges, royalties, and brand details. Free to list. Trusted by top Canadian franchise brands.',
  alternates: { canonical: BASE },
  openGraph: {
    title: "FranchiseOntario.com — Ontario's #1 Franchise Directory",
    description: 'Browse 500+ franchise opportunities in Ontario, Canada. Compare brands, investment ranges, and connect directly with franchisors.',
    url: BASE,
  },
}

/* ── News Ticker ─────────────────────────────────── */
function NewsTicker() {
  const doubled = [...tickerItems, ...tickerItems]
  return (
    <div className="bg-gray-900 py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="shrink-0 flex items-center gap-2 px-4 z-10 bg-gray-900 pr-4 border-r border-gray-700">
          <div className="live-dot" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live</span>
        </div>
        <div className="ticker-wrapper flex-1 ml-4">
          <div className="ticker-inner">
            {doubled.map((item, i) => (
              <span key={i} className="text-[11px] text-gray-400 mx-8 whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Hero Section ────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white border-b border-gray-100">
      <div className="h-1 bg-[#C8102E] w-full" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_580px] gap-12 xl:gap-20 items-center">

          {/* Left: Text & Search */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Ontario's #1 Franchise Directory</span>
            </div>

            {/* Headline — Cormorant Garamond via h1 */}
            <h1 className="text-[52px] sm:text-[64px] xl:text-[76px] font-bold text-[#0D1B2A] mb-6 leading-[1.0]">
              Find Your Next<br />
              <em className="text-[#C8102E] not-italic">Franchise</em><br />
              in Ontario
            </h1>

            <p className="text-[#4A5568] text-lg max-w-lg mb-10 leading-relaxed font-normal">
              Browse 500+ franchise opportunities across Ontario. Compare investment ranges, royalties, and connect directly with top Canadian brands.
            </p>

            {/* Search bar */}
            <div className="mb-7">
              <HeroSearch />
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap gap-2 text-xs mb-12">
              <span className="text-gray-400 self-center font-semibold">Popular:</span>
              {['Bar & Grill', 'Coffee Shop', 'Fitness', 'Home Services', 'Automotive'].map((tag) => (
                <Link
                  key={tag}
                  href={`/directory?category=${encodeURIComponent(tag)}`}
                  className="bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-600 px-3 py-1.5 rounded-full transition-colors border border-gray-200 hover:border-red-200 font-medium"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-6 max-w-lg">
              {[
                { value: '500+', label: 'Listings' },
                { value: '14', label: 'Categories' },
                { value: '10K+', label: 'Monthly Visitors' },
                { value: '$2B+', label: 'Tracked' },
              ].map((stat) => (
                <div key={stat.label} className="border-l-2 border-red-100 pl-3">
                  <div className="text-2xl font-bold text-[#0D1B2A] leading-none" style={{ fontFamily: 'Manrope, sans-serif' }}>{stat.value}</div>
                  <div className="text-[11px] text-gray-400 mt-1 font-semibold leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Lifestyle photo grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4" style={{ height: '580px' }}>
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <div className="photo-card flex-1 min-h-0">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
                  alt="Franchise entrepreneur"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="photo-card" style={{ height: '180px' }}>
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                  alt="Coffee shop interior"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
            {/* Column 2 — offset down */}
            <div className="flex flex-col gap-4 pt-10">
              <div className="photo-card" style={{ height: '180px' }}>
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80"
                  alt="Restaurant franchise"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="photo-card flex-1 min-h-0">
                <img
                  src="https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80"
                  alt="Business success"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ── Featured Spotlight — delegated to client component ── */
// Moved to ClientHomepageSections.tsx so it can read localStorage (applyListingStore)
// and reflect admin removals / approved pending listings without a page reload.

/* ── Category Grid ───────────────────────────────── */
function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full bg-red-600" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Browse by Type</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">Explore Franchise Categories</h2>
          <p className="text-gray-500 text-sm mt-1">Find opportunities in your preferred industry</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories?cat=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-xl p-3 text-center border border-gray-200 hover:border-transparent hover:shadow-lg transition-all card-hover"
              style={{ '--hover-color': cat.color } as React.CSSProperties}
            >
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
                style={{ background: cat.bg }}
              >
                {cat.icon}
              </div>
              <p className="text-[11px] font-semibold text-gray-700 group-hover:text-gray-900 leading-tight">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Quiz CTA ────────────────────────────────────── */
function QuizCTA() {
  const steps = [
    { num: '1', text: 'Answer 5 quick questions about your budget and lifestyle' },
    { num: '2', text: 'Our algorithm scores all Ontario franchises against your profile' },
    { num: '3', text: 'Receive your personalized match list — instantly, no email needed' },
    { num: '4', text: 'Request info directly from matched brands you like' },
  ]
  return (
    <section className="py-16 bg-red-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-5">
              <Sparkles size={12} className="text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Free · No Email Required</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              Not Sure Which Franchise<br />is Right For You?
            </h2>
            <p className="text-red-100 text-sm leading-relaxed mb-7 max-w-sm">
              Answer 5 questions and we'll instantly match you to Ontario franchise opportunities that fit your budget, lifestyle, and goals.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-7 py-3 rounded-xl text-sm transition-all hover:bg-red-50 shadow-lg"
            >
              <Sparkles size={14} />
              Take the Franchise Fit Quiz
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex-1 max-w-sm w-full">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-4">
              <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest">How it works</p>
              {steps.map((step) => (
                <div key={step.num} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {step.num}
                  </div>
                  <p className="text-sm text-red-50 leading-snug">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Ontario Cities Strip ─────────────────────────── */
function OntarioCities() {
  const cities = [
    { name: 'Toronto', slug: 'toronto', icon: '🏙️' },
    { name: 'Ottawa', slug: 'ottawa', icon: '🏛️' },
    { name: 'Mississauga', slug: 'mississauga', icon: '🌆' },
    { name: 'Hamilton', slug: 'hamilton', icon: '⚙️' },
    { name: 'London', slug: 'london', icon: '🎓' },
    { name: 'Kitchener-Waterloo', slug: 'kitchener', icon: '💻' },
    { name: 'Windsor', slug: 'windsor', icon: '🚗' },
    { name: 'Barrie', slug: 'barrie', icon: '⛵' },
  ]
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-label mb-1"><MapPin size={10} /> Browse by City</p>
            <h2 className="text-lg font-bold text-gray-900">Ontario Franchise Markets</h2>
          </div>
          <Link href="/ontario" className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
            All Cities <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/ontario/${city.slug}`}
              className="group bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-200 rounded-xl p-3 text-center transition-all"
            >
              <div className="text-xl mb-1">{city.icon}</div>
              <p className="text-xs font-semibold text-gray-600 group-hover:text-red-600 leading-tight">{city.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Top Ranked — delegated to client component ── */
// Moved to ClientHomepageSections.tsx so it can read localStorage (applyListingStore)
// and reflect admin removals / approved pending listings without a page reload.

/* ── Latest News ─────────────────────────────────── */
function LatestNews() {
  const featured = newsArticles.find((a) => a.isFeatured)!
  const rest = newsArticles.filter((a) => !a.isFeatured).slice(0, 4)

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                <div className="live-dot" /> Live News Feed
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Franchise News in Ontario</h2>
          </div>
          <Link href="/news" className="hidden sm:flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700">
            All News <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          <a
            href={featured.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden card-hover group block"
          >
            {/* Thumbnail */}
            {featured.thumbnailUrl ? (
              <div className="h-52 overflow-hidden relative">
                <img
                  src={featured.thumbnailUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {featured.category}
                </span>
              </div>
            ) : (
              <div className="h-3 bg-gradient-to-r from-red-600 to-amber-500" />
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {!featured.thumbnailUrl && (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {featured.category}
                  </span>
                )}
                <span className="text-xs text-gray-400">{featured.source}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{featured.timeAgo}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-red-600 transition-colors">
                {featured.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {featured.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
                <span className="ml-auto text-xs font-semibold text-red-600 group-hover:underline">Read article →</span>
              </div>
            </div>
          </a>

          {/* Article list */}
          <div className="space-y-3">
            {rest.map((article) => (
              <a
                key={article.id}
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl border border-gray-200 p-4 card-hover group flex gap-3 items-start block"
              >
                {/* Thumbnail */}
                {article.thumbnailUrl && (
                  <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={article.thumbnailUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{article.timeAgo}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 truncate">{article.source}</p>
                </div>
              </a>
            ))}
            <Link href="/news" className="block text-center text-sm font-medium text-red-600 hover:text-red-700 py-2">
              View All News →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Pricing Promo ───────────────────────────────── */
function PricingPromo() {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      period: 'forever',
      color: 'gray',
      icon: '🏷️',
      features: ['Basic franchise profile', 'Category listing', 'Contact information', 'Company description'],
      cta: 'List for Free',
      ctaStyle: 'bg-gray-800 hover:bg-gray-700 text-white',
    },
    {
      name: 'Premium',
      price: '$79',
      period: '/month',
      color: 'blue',
      icon: '⚡',
      features: ['Everything in Basic', 'Priority placement', 'Highlighted listing', 'Photo gallery (5 photos)', 'Detailed highlights', 'Enquiry management'],
      cta: 'Start Premium',
      ctaStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      color: 'gold',
      icon: '👑',
      features: ['Everything in Premium', 'Gold VIP badge', 'Top search placement', 'Unlimited photos', 'News press releases', 'Dedicated account manager', 'Analytics dashboard'],
      cta: 'Go Enterprise',
      ctaStyle: 'btn-gold',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full bg-red-600" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Simple Pricing</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">List Your Franchise Today</h2>
          <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto">
            Start free and upgrade as you grow. All plans include access to Ontario's most active franchise-buyer audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl border-2 p-6 ${
                plan.popular ? 'border-blue-500 shadow-xl shadow-blue-100' : 'border-gray-200'
              } ${plan.color === 'gold' ? 'enterprise-card' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              {plan.color === 'gold' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="vip-badge text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    Best Value
                  </span>
                </div>
              )}
              <div className={plan.color === 'gold' ? 'bg-white rounded-xl p-0.5' : ''}>
                <div className="text-3xl mb-2">{plan.icon}</div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-2.5 rounded-xl font-bold text-sm transition-all ${plan.ctaStyle}`}>
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Featured add-on */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">⭐</span>
              <h3 className="font-black text-lg">Homepage Feature Spotlight</h3>
            </div>
            <p className="text-amber-100 text-sm">
              Get your franchise featured on the FranchiseOntario.com homepage — rotating weekly among all featured brands.
              <span className="font-bold text-white"> Only $14.99/week.</span>
            </p>
          </div>
          <Link href="/pricing#featured" className="shrink-0 bg-white text-orange-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-50 transition-colors">
            Add Feature Spot →
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Editorial Feature Section ───────────────────── */
function EditorialFeature() {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: lifestyle photo */}
          <div className="grid grid-cols-2 gap-4" style={{ height: '500px' }}>
            <div className="photo-card" style={{ height: '100%' }}>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=700&q=80"
                alt="Franchise team"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="photo-card flex-1">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80"
                  alt="Business meeting"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="photo-card" style={{ height: '180px' }}>
                <img
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80"
                  alt="Entrepreneur"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: editorial text */}
          <div>
            <p className="section-label mb-4">Why FranchiseOntario</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0D1B2A] mb-6 leading-tight">
              Ontario's Most<br />
              <em className="text-[#C8102E]">Complete</em> Franchise<br />
              Discovery Platform
            </h2>
            <p className="text-[#4A5568] text-base leading-relaxed mb-8">
              We built FranchiseOntario.com for serious buyers — people ready to invest in a franchise that fits their budget, lifestyle, and market. No noise, no pay-to-rank manipulation. Just transparent data and direct connections.
            </p>
            <div className="space-y-4 mb-10">
              {[
                { title: 'Transparent Rankings', desc: 'Listings ranked by real performance metrics — not by who paid most.' },
                { title: 'Ontario Buyer Protection', desc: 'Every listing is subject to the Arthur Wishart Act. Your FDD rights explained.' },
                { title: 'Free Franchise Fit Quiz', desc: 'Our algorithm matches you to the right opportunity in 5 questions.' },
                { title: 'Direct Connections', desc: 'Contact franchisors directly — no middlemen, no referral fees.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-[#C8102E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0D1B2A] text-sm">{item.title}</div>
                    <div className="text-[#4A5568] text-sm mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/directory" className="btn-red px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                Browse Directory <ArrowRight size={14} />
              </Link>
              <Link href="/quiz" className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500" /> Take the Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── CTA Banner ──────────────────────────────────── */
function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-[#0D1B2A] py-20">
      {/* Lifestyle photo background with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?auto=format&fit=crop&w=1800&q=70"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-20"
          loading="lazy"
        />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="section-label justify-center mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>Start Today</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
          Ready to Find Your<br />
          Next <em className="text-red-400">Franchise?</em>
        </h2>
        <p className="text-gray-400 text-base mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of Ontario entrepreneurs who use FranchiseOntario.com to discover, compare, and connect with the province's top franchise brands.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/directory" className="btn-red px-8 py-3.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2">
            Browse All Franchises <ArrowRight size={14} />
          </Link>
          <Link href="/register" className="bg-white/10 hover:bg-white/15 border border-white/20 text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all">
            List Your Franchise Free
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Page ────────────────────────────────────────── */
export default function HomePage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Ontario Franchise Opportunities',
    description: 'The top-ranked franchise brands available for investment in Ontario, Canada',
    url: `${BASE}/directory`,
    numberOfItems: franchises.length,
    itemListElement: franchises.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.name,
      url: `${BASE}/directory/${f.id}`,
      description: f.description,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
    ],
  }

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
      <NewsTicker />
      <Hero />

      <ClientFeaturedSpotlight />
      <QuizCTA />
      <OntarioCities />
      <CategoryGrid />
      <ClientTopRanked />
      <EditorialFeature />
      <LatestNews />
      <PricingPromo />
      <CTABanner />
    </>
  )
}

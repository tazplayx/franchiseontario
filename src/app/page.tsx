import Link from 'next/link'
import { Search, TrendingUp, Award, Zap, Star, ArrowRight, Crown, ChevronRight, Newspaper, BarChart3, MapPin, Users } from 'lucide-react'
import { franchises, categories, getFeaturedFranchises, getTopRanked } from '@/data/franchises'
import { tickerItems, newsArticles } from '@/data/news'
import FranchiseCard from '@/components/FranchiseCard'

/* ── News Ticker ─────────────────────────────────── */
function NewsTicker() {
  const doubled = [...tickerItems, ...tickerItems]
  return (
    <div className="bg-gray-900 border-b border-gray-800 py-2.5 overflow-hidden">
      <div className="flex items-center">
        {/* Label */}
        <div className="shrink-0 flex items-center gap-2 px-4 z-10 bg-gray-900 pr-3 border-r border-gray-700">
          <div className="live-dot" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">Live</span>
        </div>
        {/* Ticker */}
        <div className="ticker-wrapper flex-1 ml-3">
          <div className="ticker-inner">
            {doubled.map((item, i) => (
              <span key={i} className="text-xs text-gray-300 mx-8 whitespace-nowrap">
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
    <section className="hero-gradient relative overflow-hidden py-20 md:py-28">
      {/* Decorative particles */}
      {[
        { size: 80, top: '15%', left: '8%', delay: '0s', dur: '7s', color: '#CC0000' },
        { size: 50, top: '70%', left: '5%', delay: '1.5s', dur: '5s', color: '#D4A017' },
        { size: 120, top: '20%', right: '6%', delay: '0.8s', dur: '9s', color: '#1a1a2e' },
        { size: 40, top: '60%', right: '10%', delay: '2s', dur: '6s', color: '#CC0000' },
        { size: 200, top: '40%', left: '50%', delay: '0s', dur: '12s', color: '#D4A017' },
      ].map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: (p as any).left,
            right: (p as any).right,
            background: p.color,
            '--delay': p.delay,
            '--duration': p.dur,
          } as React.CSSProperties}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Ontario's #1 Franchise Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[0.95] tracking-tight">
            Find Your Next{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-red-400">
                Franchise
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-full" />
            </span>
            <br />in Ontario
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Browse <span className="text-white font-semibold">500+ franchise opportunities</span> across Ontario. Compare tiers, read reviews, and connect with top brands — all in one place.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center pl-4 text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search franchises, categories, or brands..."
                className="flex-1 px-3 py-4 text-sm text-gray-700 outline-none bg-transparent"
              />
              <Link
                href="/directory"
                className="btn-red m-1.5 px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap"
              >
                Search
              </Link>
            </div>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-gray-400">Popular:</span>
            {['Bar & Grill', 'Coffee Shop', 'Fitness', 'Home Services', 'Automotive'].map((tag) => (
              <Link
                key={tag}
                href={`/directory?category=${encodeURIComponent(tag)}`}
                className="bg-white/10 hover:bg-white/20 text-gray-200 px-3 py-1 rounded-full transition-colors border border-white/10"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
          {[
            { value: '500+', label: 'Franchise Listings', icon: '🏢' },
            { value: '14', label: 'Categories', icon: '📂' },
            { value: '10K+', label: 'Monthly Visitors', icon: '👥' },
            { value: '$2B+', label: 'Investment Tracked', icon: '💰' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur border border-white/15 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Featured Spotlight (paid $14.99/week rotating) ── */
function FeaturedSpotlight() {
  const featured = getFeaturedFranchises()

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full bg-red-600" />
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Featured This Week</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Spotlight Franchises
            </h2>
            <p className="text-sm text-gray-500 mt-1">Rotating weekly features — <Link href="/pricing#featured" className="text-red-600 hover:underline font-medium">add your listing for $14.99/week →</Link></p>
          </div>
          <Link href="/directory" className="hidden sm:flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((franchise) => (
            <div key={franchise.id} className="featured-glow rounded-xl">
              <FranchiseCard franchise={franchise} showRank />
            </div>
          ))}
        </div>

        {/* Add your listing CTA strip */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-white font-black text-lg">⭐</div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Get your franchise featured on the homepage</p>
              <p className="text-xs text-gray-500">Rotating weekly feature spots — only <strong>$14.99/week</strong></p>
            </div>
          </div>
          <Link href="/pricing#featured" className="btn-gold shrink-0 px-5 py-2 rounded-lg text-sm font-bold">
            Get Featured →
          </Link>
        </div>
      </div>
    </section>
  )
}

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

/* ── Top Ranked ──────────────────────────────────── */
function TopRanked() {
  const top = getTopRanked(6)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Rankings</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Ontario's Top Ranked Franchises</h2>
            <p className="text-sm text-gray-500 mt-1">Ranked by popularity, reviews, locations & category performance</p>
          </div>
          <Link href="/directory?sort=rank" className="hidden sm:flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700">
            Full Rankings <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {top.map((franchise) => (
            <FranchiseCard key={franchise.id} franchise={franchise} showRank />
          ))}
        </div>
      </div>
    </section>
  )
}

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
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden card-hover group">
            <div className="h-3 bg-gradient-to-r from-red-600 to-amber-500" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {featured.category}
                </span>
                <span className="text-xs text-gray-400">{featured.source}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{featured.timeAgo}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-red-600 transition-colors">
                {featured.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
              <div className="flex flex-wrap gap-1.5">
                {featured.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Article list */}
          <div className="space-y-3">
            {rest.map((article) => (
              <div key={article.id} className="bg-white rounded-xl border border-gray-200 p-4 card-hover group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-gray-400">{article.timeAgo}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{article.source}</p>
              </div>
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

/* ── CTA Banner ──────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-16 hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="text-4xl mb-4">🍁</div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Ready to Find Your Franchise?
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of Ontario entrepreneurs who use FranchiseOntario.com to discover, compare, and connect with the province's top franchise brands.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/directory" className="btn-red px-8 py-3.5 rounded-xl text-base font-bold">
            Browse All Franchises
          </Link>
          <Link href="/register" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-xl text-base font-bold transition-all">
            List Your Franchise Free
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Page ────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <NewsTicker />
      <Hero />
      <FeaturedSpotlight />
      <CategoryGrid />
      <TopRanked />
      <LatestNews />
      <PricingPromo />
      <CTABanner />
    </>
  )
}

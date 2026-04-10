import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Search, TrendingUp, Award, Zap, Star, ArrowRight, Crown, ChevronRight, Newspaper, BarChart3, MapPin, Users, Sparkles, CheckCircle, Leaf, ShieldCheck, Target } from 'lucide-react'
import { franchises, categories, getTopRanked } from '@/data/franchises'
import { tickerItems, newsArticles } from '@/data/news'
import FranchiseCard from '@/components/FranchiseCard'
import JsonLd from '@/components/JsonLd'
import HeroSearch from '@/components/HeroSearch'
import { ClientFeaturedSpotlight, ClientTopRanked } from '@/components/ClientHomepageSections'

const BASE = 'https://www.franchiseontario.com'

export const metadata: Metadata = {
  title: "Ontario's #1 Franchise Directory — Canadian Franchise Opportunities",
  description:
    'FranchiseOntario.com — Ontario\'s leading franchise discovery platform. Browse 300+ Canadian franchise opportunities. Compare investment ranges, royalties, and brand details. Free to list. Trusted by top Canadian and Ontario franchise brands.',
  alternates: { canonical: BASE },
  openGraph: {
    title: "FranchiseOntario.com — Ontario & Canada's Franchise Directory",
    description: 'Browse 300+ franchise opportunities across Ontario and Canada. Compare brands, investment ranges, and connect directly with franchisors.',
    url: BASE,
  },
}

/* ── News Ticker ─────────────────────────────────── */
function NewsTicker() {
  const doubled = [...tickerItems, ...tickerItems]
  return (
    <div className="py-2 overflow-hidden" style={{ background: 'var(--rust-deep)' }}>
      <div className="flex items-center">
        <div className="shrink-0 flex items-center gap-2 px-4 z-10 pr-4" style={{ background: 'var(--rust-deep)', borderRight: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="live-dot" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live</span>
        </div>
        <div className="ticker-wrapper flex-1 ml-4">
          <div className="ticker-inner">
            {doubled.map((item, i) => (
              <span key={i} className="text-[11px] mx-8 whitespace-nowrap" style={{ color: 'var(--gold)' }}>
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
  const listingCount = franchises.length
  const categoryCount = new Set(franchises.map((f) => f.category)).size
  return (
    <section className="relative overflow-hidden bg-white border-b" style={{ borderColor: 'var(--border)' }}>
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'var(--rust)' }} />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_580px] gap-12 xl:gap-20 items-center">

          {/* Left: Text & Search */}
          <div>
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border" style={{ background: '#fdeee7', borderColor: '#f5c4b0' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--rust)' }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--rust)' }}>Ontario's #1 Franchise Directory · Canada-Wide Brands</span>
            </div>

            <h1 className="text-[52px] sm:text-[64px] xl:text-[76px] font-bold mb-6 leading-[1.0]" style={{ color: 'var(--rust-deep)' }}>
              Find Your Next<br />
              <em className="not-italic" style={{ color: 'var(--rust)' }}>Franchise</em><br />
              in Ontario
            </h1>

            <p className="text-lg max-w-lg mb-10 leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
              Ontario's most comprehensive franchise directory — featuring local Ontario brands and Canada's top national franchise concepts. Compare investment ranges, royalties, and connect directly with franchisors.
            </p>

            <div className="mb-7">
              <HeroSearch />
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap gap-2 text-xs mb-12">
              <span className="self-center font-semibold" style={{ color: 'var(--text-muted)' }}>Popular:</span>
              {['Bar & Grill', 'Coffee Shop', 'Fitness', 'Home Services', 'Automotive'].map((tag) => (
                <Link
                  key={tag}
                  href={`/directory?category=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 rounded-full transition-colors border font-medium bg-[#f9f1e8] text-[#4a3728] border-[#e8ddd5] hover:bg-[#fdeee7] hover:text-[#c7522a] hover:border-[#f5c4b0]"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-6 max-w-lg">
              {[
                { value: `${listingCount}+`, label: 'Listings' },
                { value: String(categoryCount), label: 'Categories' },
                { value: '2,500+', label: 'Monthly Visitors' },
                { value: '$2B+', label: 'In Opportunities' },
              ].map((stat) => (
                <div key={stat.label} className="border-l-2 pl-3" style={{ borderColor: 'var(--gold)' }}>
                  <div className="text-2xl font-bold leading-none" style={{ color: 'var(--rust-deep)', fontFamily: 'DM Sans, sans-serif' }}>{stat.value}</div>
                  <div className="text-[11px] mt-1 font-semibold leading-tight" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Lifestyle photo grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4" style={{ height: '580px' }}>
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

/* ── Value Proposition Grid (lifecare-style) ──────── */
function ValueProps() {
  const props = [
    {
      icon: <Target size={28} />,
      title: 'Ontario-Focused',
      desc: 'Local Ontario brands and national Canadian concepts in one place.',
      color: 'var(--rust)',
      bg: '#fdeee7',
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Buyer Protection',
      desc: 'Arthur Wishart Act compliant. Your FDD rights, explained.',
      color: 'var(--teal)',
      bg: '#e0f2f2',
    },
    {
      icon: <Sparkles size={28} />,
      title: 'Free Fit Quiz',
      desc: 'Answer 5 questions — get matched to the right opportunity instantly.',
      color: 'var(--rust-dark)',
      bg: 'var(--cream)',
    },
    {
      icon: <Users size={28} />,
      title: 'Direct Access',
      desc: 'Connect with franchisors directly — no middlemen or referral fees.',
      color: 'var(--sage)',
      bg: '#e8f2ee',
    },
  ]
  return (
    <section className="py-16" style={{ background: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label justify-center mb-2">Why FranchiseOntario</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--rust-deep)' }}>Built for Serious Franchise Buyers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {props.map((p) => (
            <div key={p.title} className="value-tile text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: p.bg, color: p.color }}>
                {p.icon}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--rust-deep)' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Category Grid ───────────────────────────────── */
function CategoryGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label justify-center mb-2">Browse by Type</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--rust-deep)' }}>Explore Franchise Categories</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Find opportunities in your preferred industry</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories?cat=${encodeURIComponent(cat.name)}`}
              className="group bg-white p-3 text-center border border-[#e8ddd5] transition-all card-hover hover:border-[#c7522a] hover:bg-[#fdeee7]"
              style={{ borderRadius: '1.25rem' }}
            >
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
                style={{ background: cat.bg }}
              >
                {cat.icon}
              </div>
              <p className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--text-secondary)' }}>
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
    <section className="py-16" style={{ background: 'var(--rust)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Sparkles size={12} className="text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Free · No Email Required</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              Not Sure Which Franchise<br />is Right For You?
            </h2>
            <p className="text-sm leading-relaxed mb-7 max-w-sm" style={{ color: 'rgba(255,241,200,0.85)' }}>
              Answer 5 questions and we'll instantly match you to Ontario franchise opportunities that fit your budget, lifestyle, and goals.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 font-bold px-7 py-3 text-sm transition-all shadow-lg"
              style={{ background: 'var(--cream)', color: 'var(--rust-dark)', borderRadius: '9999px' }}
            >
              <Sparkles size={14} />
              Take the Franchise Fit Quiz
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex-1 max-w-sm w-full">
            <div className="rounded-2xl p-6 space-y-4 border" style={{ background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.20)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>How it works</p>
              {steps.map((step) => (
                <div key={step.num} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--cream)', color: 'var(--rust)' }}>
                    {step.num}
                  </div>
                  <p className="text-sm leading-snug" style={{ color: 'rgba(255,241,200,0.90)' }}>{step.text}</p>
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
    <section className="py-10 bg-white border-y" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-label mb-1"><MapPin size={10} /> Browse by City</p>
            <h2 className="text-lg font-bold" style={{ color: 'var(--rust-deep)' }}>Ontario Franchise Markets</h2>
          </div>
          <Link href="/ontario" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--rust)' }}>
            All Cities <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/ontario/${city.slug}`}
              className="group border border-[#e8ddd5] bg-[#fdf8f4] p-3 text-center transition-all hover:bg-[#fdeee7] hover:border-[#c7522a]"
              style={{ borderRadius: '1rem' }}
            >
              <div className="text-xl mb-1">{city.icon}</div>
              <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-secondary)' }}>{city.name}</p>
            </Link>
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
    <section className="py-16" style={{ background: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                <div className="live-dot" /> Live News Feed
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--rust-deep)' }}>Franchise News — Ontario & Canada</h2>
          </div>
          <Link href="/news" className="hidden sm:flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--rust)' }}>
            All News <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          <a
            href={featured.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:col-span-2 bg-white overflow-hidden card-hover group block"
            style={{ borderRadius: '1.5rem', border: '1.5px solid var(--border)' }}
          >
            {featured.thumbnailUrl ? (
              <div className="h-52 overflow-hidden relative">
                <img
                  src={featured.thumbnailUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide" style={{ background: 'var(--rust)' }}>
                  {featured.category}
                </span>
              </div>
            ) : (
              <div className="h-3" style={{ background: `linear-gradient(to right, var(--rust), var(--gold))` }} />
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {!featured.thumbnailUrl && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ background: '#fdeee7', color: 'var(--rust)' }}>
                    {featured.category}
                  </span>
                )}
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{featured.source}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>•</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{featured.timeAgo}</span>
              </div>
              <h3 className="text-xl font-bold leading-snug mb-3 group-hover:transition-colors" style={{ color: 'var(--rust-deep)' }}>
                {featured.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>{featured.excerpt}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {featured.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-soft)', color: 'var(--text-muted)' }}>{tag}</span>
                ))}
                <span className="ml-auto text-xs font-semibold" style={{ color: 'var(--rust)' }}>Read article →</span>
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
                className="bg-white p-4 card-hover group flex gap-3 items-start block"
                style={{ borderRadius: '1.25rem', border: '1.5px solid var(--border)' }}
              >
                {article.thumbnailUrl && (
                  <div className="w-16 h-14 overflow-hidden shrink-0" style={{ borderRadius: '0.75rem', background: 'var(--bg-soft)' }}>
                    <img src={article.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0" style={{ background: 'var(--bg-soft)', color: 'var(--text-secondary)' }}>
                      {article.category}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{article.timeAgo}</span>
                  </div>
                  <h4 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: 'var(--rust-deep)' }}>
                    {article.title}
                  </h4>
                  <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>{article.source}</p>
                </div>
              </a>
            ))}
            <Link href="/news" className="block text-center text-sm font-medium py-2" style={{ color: 'var(--rust)' }}>
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
      icon: '🏷️',
      features: ['Basic franchise profile', 'Category listing', 'Contact information', 'Company description'],
      cta: 'List for Free',
      ctaClass: 'btn-outline',
    },
    {
      name: 'Premium',
      price: '$79',
      period: '/month',
      icon: '⚡',
      features: ['Everything in Basic', 'Priority placement', 'Highlighted listing', 'Photo gallery (5 photos)', 'Detailed highlights', 'Enquiry management'],
      cta: 'Start Premium',
      ctaClass: 'btn-teal',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      icon: '👑',
      features: ['Everything in Premium', 'Gold VIP badge', 'Top search placement', 'Unlimited photos', 'News press releases', 'Dedicated account manager', 'Analytics dashboard'],
      cta: 'Go Enterprise',
      ctaClass: 'btn-gold',
      vip: true,
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label justify-center mb-2">Simple Pricing</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--rust-deep)' }}>List Your Franchise Today</h2>
          <p className="text-sm mt-1 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            Start free and upgrade as you grow. All plans include access to Ontario's most active franchise-buyer audience — plus Canada-wide brand visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative bg-white p-6"
              style={{
                borderRadius: '1.5rem',
                border: plan.popular
                  ? '2px solid var(--teal)'
                  : plan.vip
                  ? '2px solid var(--gold)'
                  : '1.5px solid var(--border)',
                boxShadow: plan.popular
                  ? '0 8px 30px rgba(0,133,133,0.12)'
                  : plan.vip
                  ? '0 8px 30px rgba(229,193,133,0.20)'
                  : 'none',
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider" style={{ background: 'var(--teal)' }}>
                    Most Popular
                  </span>
                </div>
              )}
              {plan.vip && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="vip-badge text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    Best Value
                  </span>
                </div>
              )}
              <div className="text-3xl mb-2">{plan.icon}</div>
              <h3 className="font-black text-lg mb-1" style={{ color: 'var(--rust-deep)' }}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black" style={{ color: 'var(--rust-deep)' }}>{plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`block text-center py-2.5 font-bold text-sm transition-all ${plan.ctaClass}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Featured add-on */}
        <div className="rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4" style={{ background: `linear-gradient(135deg, var(--rust) 0%, var(--rust-dark) 100%)` }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">⭐</span>
              <h3 className="font-black text-lg text-white">Homepage Feature Spotlight</h3>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,241,200,0.85)' }}>
              Get your franchise featured on the FranchiseOntario.com homepage — rotating weekly among all featured brands.
              <span className="font-bold text-white"> Only $14.99/week.</span>
            </p>
          </div>
          <Link href="/pricing#featured" className="shrink-0 font-bold px-6 py-2.5 text-sm transition-colors" style={{ background: 'var(--cream)', color: 'var(--rust-dark)', borderRadius: '9999px' }}>
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
    <section className="py-20 bg-white border-b" style={{ borderColor: 'var(--border)' }}>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: 'var(--rust-deep)' }}>
              Ontario-Focused.<br />
              <em className="not-italic" style={{ color: 'var(--rust)' }}>Canada-Wide</em><br />
              Coverage.
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              We built FranchiseOntario.com for serious buyers — people ready to invest in a franchise that fits their budget, lifestyle, and Ontario market. Whether you're looking for a local Ontario brand or a national Canadian concept, we have it all in one place. No noise, no pay-to-rank manipulation. Just transparent data and direct connections.
            </p>
            <div className="space-y-4 mb-10">
              {[
                { title: 'Ontario & Canada-Wide Brands', desc: 'Local Ontario franchises plus the best national Canadian franchise concepts, all in one directory.' },
                { title: 'Ontario Buyer Protection', desc: 'Every listing is subject to the Arthur Wishart Act. Your FDD rights explained.' },
                { title: 'Free Franchise Fit Quiz', desc: 'Our algorithm matches you to the right Ontario opportunity in 5 questions.' },
                { title: 'Direct Connections', desc: 'Contact franchisors directly — no middlemen, no referral fees.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--rust)' }} />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--rust-deep)' }}>{item.title}</div>
                    <div className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/directory" className="btn-red px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
                Browse Directory <ArrowRight size={14} />
              </Link>
              <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border" style={{ background: 'var(--cream)', color: 'var(--rust-dark)', borderColor: 'var(--gold)', borderRadius: '9999px' }}>
                <Sparkles size={14} style={{ color: 'var(--gold-dark, #c8a06a)' }} /> Take the Quiz
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
    <section className="relative overflow-hidden py-20" style={{ background: 'var(--rust-deep)' }}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?auto=format&fit=crop&w=1800&q=70"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-15"
          loading="lazy"
        />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="section-label justify-center mb-4" style={{ color: 'rgba(229,193,133,0.80)' }}>Start Today</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
          Ready to Find Your<br />
          Next <em className="not-italic" style={{ color: 'var(--gold)' }}>Franchise?</em>
        </h2>
        <p className="text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Join thousands of Ontario and Canadian entrepreneurs who use FranchiseOntario.com to discover, compare, and connect with top franchise brands — from local Ontario concepts to Canada's most iconic national brands.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/directory" className="btn-red px-8 py-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2">
            Browse All Franchises <ArrowRight size={14} />
          </Link>
          <Link href="/register" className="px-8 py-3.5 text-sm font-semibold transition-all border text-white inline-flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.20)', borderRadius: '9999px' }}>
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
      <ValueProps />
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

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  RefreshCw,
  ExternalLink,
  Tag,
  CheckCircle,
  Loader2,
  Rss,
  PenLine,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { newsArticles, newsCategories } from '@/data/news'
import { blogPosts, blogCategories } from '@/data/blog-posts'
import type { NewsArticle } from '@/data/news'
import type { BlogPost } from '@/data/blog-posts'

// ---------------------------------------------------------------------------
// CategoryPill
// ---------------------------------------------------------------------------

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-red-600 text-white'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
      }`}
    >
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// NewsletterWidget
// ---------------------------------------------------------------------------

function NewsletterWidget() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Subscription failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
        <CheckCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <p className="font-semibold text-gray-800 text-sm">You&apos;re subscribed!</p>
        <p className="text-gray-500 text-xs mt-1">Weekly franchise insights in your inbox.</p>
      </div>
    )
  }

  return (
    <div className="bg-red-600 rounded-2xl p-5 text-white">
      <Rss className="w-6 h-6 mb-2 opacity-80" />
      <h3 className="font-bold text-base mb-1">Weekly Franchise Digest</h3>
      <p className="text-red-100 text-xs mb-4">
        Ontario franchise news, new guides, and market updates — every Monday morning.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-3 py-2 rounded-lg text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-white text-red-600 font-semibold text-sm py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Subscribe — It&apos;s Free'
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-200 text-xs mt-2">{errorMsg}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// BlogCard
// ---------------------------------------------------------------------------

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/insights/${post.id}`} className="group block">
        <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-200">
          <img
            src={post.imageUrl}
            alt={post.imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Featured
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-red-300 text-xs font-semibold uppercase tracking-wider mb-1">
              {post.category}
            </p>
            <h2 className="text-white font-bold text-xl leading-snug mb-2 group-hover:text-red-200 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-red-300 text-sm font-semibold group-hover:gap-2.5 transition-all">
              Read Article <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/insights/${post.id}`} className="group block bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all overflow-hidden">
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 text-gray-400 text-xs mb-2">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime} min read
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-3">{post.excerpt}</p>
        <span className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold group-hover:gap-2 transition-all">
          Read Article <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Main InsightsPage
// ---------------------------------------------------------------------------

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<'blog' | 'news'>('blog')
  const [activeBlogCat, setActiveBlogCat] = useState<string>('All')
  const [activeNewsCat, setActiveNewsCat] = useState<string>('All')
  const [articles, setArticles] = useState<NewsArticle[]>(newsArticles)
  const [isLive, setIsLive] = useState(false)
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((data) => {
        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles)
          setIsLive(true)
          setFetchedAt(new Date().toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }))
        }
      })
      .catch(() => {
        // Silently fall back to static data already in state
      })
  }, [])

  // Blog computed values
  const filteredBlog =
    activeBlogCat === 'All'
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeBlogCat)
  const featuredBlog = filteredBlog.find((p) => p.isFeatured) ?? filteredBlog[0]
  const restBlog = filteredBlog.filter((p) => p !== featuredBlog)

  // News computed values
  const filteredNews =
    activeNewsCat === 'All'
      ? articles
      : articles.filter((a) => a.category === activeNewsCat)
  const featuredNews = filteredNews.find((a) => a.isFeatured) ?? filteredNews[0]
  const listNews = filteredNews.filter((a) => a !== featuredNews)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Franchise Insights
              </h1>
              <p className="text-gray-500 mt-2 text-base max-w-xl">
                Expert guides, buying tips, and live Ontario franchise industry news — everything you
                need to invest with confidence.
              </p>
            </div>
            {/* Live status indicator */}
            <div className="flex items-center gap-2 shrink-0">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live news updated
                  {fetchedAt && <span className="opacity-70 ml-0.5">at {fetchedAt}</span>}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full">
                  <RefreshCw className="w-3 h-3" />
                  Loading live news…
                </span>
              )}
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('blog')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'blog'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <PenLine className="w-4 h-4" />
              Blog &amp; Guides
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'news'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Rss className="w-4 h-4" />
              Live News
              {isLive && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {activeTab === 'blog'
              ? blogCategories.map((cat) => (
                  <CategoryPill
                    key={cat}
                    label={cat}
                    active={activeBlogCat === cat}
                    onClick={() => setActiveBlogCat(cat)}
                  />
                ))
              : newsCategories.map((cat) => (
                  <CategoryPill
                    key={cat}
                    label={cat}
                    active={activeNewsCat === cat}
                    onClick={() => setActiveNewsCat(cat)}
                  />
                ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ----------------------------------------------------------------
              LEFT / MAIN COLUMN  (2/3)
          ---------------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'blog' ? (
              <>
                {/* Featured blog post */}
                {featuredBlog && <BlogCard post={featuredBlog} featured />}

                {/* Rest of blog posts — 2 column grid */}
                {restBlog.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {restBlog.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                )}

                {filteredBlog.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                    No posts in this category yet.
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Featured news article */}
                {featuredNews && (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    {featuredNews.thumbnailUrl && (
                      <div className="relative h-56 bg-gray-100 overflow-hidden">
                        <img
                          src={featuredNews.thumbnailUrl}
                          alt={featuredNews.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Featured
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {featuredNews.category}
                        </span>
                        <span className="text-gray-400 text-xs">{featuredNews.timeAgo}</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 leading-snug mb-3">
                        {featuredNews.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {featuredNews.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {featuredNews.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={featuredNews.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-red-600 text-sm font-semibold hover:text-red-700 transition-colors"
                      >
                        Read at {featuredNews.source}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Remaining news articles */}
                <div className="space-y-4">
                  {listNews.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-sm transition-all p-5 flex gap-4"
                    >
                      {article.thumbnailUrl && (
                        <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <img
                            src={article.thumbnailUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-gray-400 text-xs">{article.timeAgo}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-2">
                          {article.excerpt}
                        </p>
                        <a
                          href={article.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold hover:text-red-700 transition-colors"
                        >
                          {article.source} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredNews.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                    No articles in this category.
                  </div>
                )}
              </>
            )}
          </div>

          {/* ----------------------------------------------------------------
              RIGHT SIDEBAR  (1/3)
          ---------------------------------------------------------------- */}
          <aside className="space-y-6">
            {activeTab === 'blog' ? (
              <>
                {/* Topic list with counts */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">Browse by Topic</h3>
                  <ul className="space-y-1.5">
                    {blogCategories.map((cat) => {
                      const count =
                        cat === 'All' ? blogPosts.length : blogPosts.filter((p) => p.category === cat).length
                      return (
                        <li key={cat}>
                          <button
                            onClick={() => setActiveBlogCat(cat)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              activeBlogCat === cat
                                ? 'bg-red-50 text-red-600 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{cat}</span>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                activeBlogCat === cat
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Switch to live news */}
                <button
                  onClick={() => setActiveTab('news')}
                  className="w-full bg-gray-900 text-white rounded-2xl p-5 text-left hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Rss className="w-5 h-5 text-red-400" />
                    <span className="font-bold text-sm">Live Industry News</span>
                    {isLive && (
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-auto" />
                    )}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">
                    Real-time Ontario franchise news from the CFA, Franchise Canada, and major franchise brands.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-red-400 text-xs font-semibold group-hover:gap-2.5 transition-all">
                    Switch to News <ArrowRight className="w-3 h-3" />
                  </span>
                </button>

                {/* Newsletter widget */}
                <NewsletterWidget />
              </>
            ) : (
              <>
                {/* Trending topics */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">Trending Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Ontario Expansion', 'FDD Review', 'GTA Market', 'BDC Financing', 'CFA Reports', 'Food & Beverage', 'Arthur Wishart Act', 'Multi-Unit'].map(
                      (topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-red-50 hover:text-red-600 cursor-default transition-colors"
                        >
                          <Tag className="w-3 h-3" />
                          {topic}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Latest blog posts widget */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">Latest Guides</h3>
                    <button
                      onClick={() => setActiveTab('blog')}
                      className="text-red-600 text-xs font-semibold hover:text-red-700 transition-colors"
                    >
                      View all
                    </button>
                  </div>
                  <ul className="space-y-4">
                    {blogPosts.slice(0, 4).map((post) => (
                      <li key={post.id}>
                        <Link
                          href={`/insights/${post.id}`}
                          className="flex gap-3 group"
                        >
                          <div className="w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            <img
                              src={post.imageUrl}
                              alt={post.imageAlt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                              {post.title}
                            </p>
                            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime} min read
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter widget */}
                <NewsletterWidget />
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

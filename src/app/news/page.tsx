'use client'
import { useState } from 'react'
import Link from 'next/link'
import { RefreshCw, ExternalLink, Tag } from 'lucide-react'
import { newsArticles, newsCategories, tickerItems } from '@/data/news'

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
        active ? 'bg-red-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
      }`}
    >
      {label}
    </button>
  )
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? newsArticles
      : newsArticles.filter((a) => a.category === activeCategory)

  const featured = filtered.find((a) => a.isFeatured) || filtered[0]
  const list = filtered.filter((a) => a.id !== featured?.id)

  const lastUpdated = new Date().toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="live-dot" />
                <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Live Feed</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                Ontario Franchise News
              </h1>
              <p className="text-gray-500 text-sm">
                The latest franchise industry news, expansions, and investment insights from across Ontario and Canada.
              </p>
            </div>
            <div className="text-right text-xs text-gray-400 shrink-0">
              <div className="flex items-center gap-1 justify-end text-green-600 mb-0.5">
                <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '3s' }} />
                <span className="font-medium">Auto-updating</span>
              </div>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-6">
            {newsCategories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main articles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured */}
            {featured && (
              <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden card-hover group shadow-sm">
                <div className="h-2 bg-gradient-to-r from-red-600 to-amber-500" />
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      ⭐ Featured
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {featured.category}
                    </span>
                    <span className="text-xs text-gray-400">{featured.source}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{featured.timeAgo}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-red-600 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {featured.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          <Tag size={8} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href="#" className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700">
                      Read More <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </article>
            )}

            {/* Article list */}
            {list.map((article) => (
              <article key={article.id} className="bg-white rounded-xl border border-gray-200 p-5 card-hover group">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.source}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{article.timeAgo}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href="#" className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700">
                    Read <ExternalLink size={10} />
                  </a>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-3">📰</div>
                <p className="font-semibold text-gray-700">No articles in this category yet</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Trending */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                🔥 Trending Topics
              </h3>
              <div className="space-y-3">
                {['Ontario Franchise Expansion', 'Chuck\'s Roadhouse', 'Coffee Culture', 'Crabby Joe\'s', 'Franchise Investment 2026', 'CFA Report', 'GTA Openings', 'Arthur Wishart Act'].map((topic, i) => (
                  <div key={topic} className="flex items-center gap-3">
                    <span className="text-xs font-black text-gray-300 w-4">#{i + 1}</span>
                    <button className="text-sm text-gray-700 hover:text-red-600 transition-colors text-left font-medium">
                      {topic}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* News sources */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4">📡 News Sources</h3>
              <div className="space-y-2">
                {[
                  'Franchise Canada',
                  'Canadian Franchise Association',
                  'Canadian Restaurant & Foodservice News',
                  'Toronto Star Business',
                  'Ontario Business Report',
                  'Franchise Times Canada',
                  'Franchise Business Review',
                  'Ontario Franchise Law',
                ].map((source) => (
                  <div key={source} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {source}
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-red-600 rounded-xl p-5 text-white">
              <div className="text-2xl mb-2">📬</div>
              <h4 className="font-bold text-sm mb-1">Franchise News Weekly</h4>
              <p className="text-red-100 text-xs mb-3">Get the latest Ontario franchise news every Monday morning.</p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-red-200 text-xs outline-none focus:bg-white/30"
                />
                <button className="w-full bg-white text-red-600 font-bold text-xs py-2 rounded-lg hover:bg-red-50 transition-colors">
                  Subscribe Free
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

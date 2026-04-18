import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ArrowLeft, Tag, ArrowRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import ShareButtons from '@/components/ShareButtons'
import { blogPosts } from '@/data/blog-posts'
import type { Metadata } from 'next'

// ---------------------------------------------------------------------------
// generateStaticParams
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.id }))
}

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = blogPosts.find((p) => p.id === params.slug)

  if (!post) {
    return {
      title: 'Post Not Found | FranchiseOntario.com',
    }
  }

  return {
    title: `${post.title} | FranchiseOntario.com`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `https://www.franchiseontario.com/insights/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.franchiseontario.com/insights/${post.id}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  }
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.id === params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3)

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://www.franchiseontario.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FranchiseOntario.com',
      url: 'https://www.franchiseontario.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.franchiseontario.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.franchiseontario.com/insights/${post.id}`,
    },
  }

  return (
    <>
      <JsonLd data={jsonLdData} />

      <div className="min-h-screen bg-white">
        {/* Hero image — full width */}
        <div className="relative h-72 md:h-96 bg-gray-200 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Article container */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back link */}
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-red-600 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Insights
          </Link>

          {/* Article header */}
          <div className="mb-8">
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm border-t border-b border-gray-100 py-4">
              <span className="font-medium text-gray-700">{post.author}</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            </div>
          </div>

          {/* Share — top (before content) */}
          <ShareButtons url={`/insights/${post.id}`} title={post.title} />

          {/* Article content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share — bottom (after content) */}
          <ShareButtons url={`/insights/${post.id}`} title={post.title} />

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA section */}
          <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Ready to find your franchise?</h3>
            <p className="text-gray-600 text-sm mb-5">
              Browse Ontario franchise opportunities or take our 3-minute quiz to find the right fit for your budget and goals.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/directory"
                className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors"
              >
                Browse Franchise Directory
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-red-300 hover:text-red-600 transition-colors"
              >
                Take the Franchise Quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related posts — full width section */}
        {relatedPosts.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-100 mt-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">More Franchise Guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/insights/${related.id}`}
                    className="group bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="h-36 overflow-hidden bg-gray-100">
                      <img
                        src={related.imageUrl}
                        alt={related.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-red-600 text-xs font-bold uppercase tracking-wide">
                        {related.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mt-1 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                        <Clock className="w-3 h-3" />
                        {related.readTime} min read
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

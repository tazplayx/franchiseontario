import rawPosts from './blog-posts.json'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: 'Top Lists' | 'Legal Guide' | 'Buying Tips' | 'Financing' | 'Market Insights'
  tags: string[]
  imageUrl: string
  imageAlt: string
  publishedAt: string
  author: string
  readTime: number
  isFeatured: boolean
  content: string
}

export const blogPosts: BlogPost[] = rawPosts as BlogPost[]

export const blogCategories = [
  'All',
  'Top Lists',
  'Legal Guide',
  'Buying Tips',
  'Financing',
  'Market Insights',
] as const

export type BlogCategory = (typeof blogCategories)[number]

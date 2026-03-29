import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Franchise Fit Quiz — Find Your Perfect Ontario Franchise',
  description:
    'Answer 5 quick questions and discover which Ontario franchise opportunities match your budget, lifestyle, and goals. Free, instant results. No email required.',
  keywords: [
    'franchise quiz Ontario',
    'find the right franchise',
    'franchise match quiz Canada',
    'best franchise for me Ontario',
    'franchise buyer quiz',
  ],
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

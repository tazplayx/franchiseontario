import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FranchiseOntario.com — Ontario\'s #1 Franchise Directory',
  description:
    'Discover, compare, and connect with top franchise opportunities across Ontario. Browse 500+ franchise listings, read the latest industry news, and find your perfect business.',
  keywords: 'franchise Ontario, buy a franchise Ontario, franchise directory Canada, Ontario franchise opportunities',
  openGraph: {
    title: 'FranchiseOntario.com — Ontario\'s #1 Franchise Directory',
    description: 'Discover, compare, and connect with top franchise opportunities across Ontario.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

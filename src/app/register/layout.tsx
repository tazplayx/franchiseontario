import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'List Your Franchise in Ontario — Free to Start',
  description:
    'Add your franchise to Ontario\'s #1 franchise directory. Free basic listing, Premium at $79/month, Enterprise at $199/month. Get discovered by thousands of active Ontario franchise investors.',
  keywords: [
    'list franchise Ontario',
    'advertise franchise Canada',
    'franchise directory listing',
    'franchise marketing Ontario',
  ],
  alternates: { canonical: 'https://www.franchiseontario.com/register' },
  openGraph: {
    title: 'List Your Franchise on FranchiseOntario.com',
    description: "Get your franchise in front of Ontario's most active investor audience. Free to start.",
    url: 'https://www.franchiseontario.com/register',
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

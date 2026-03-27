import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit a Support Ticket',
  description:
    'Need help with your franchise listing or account? Submit a support ticket and our team will respond within one business day.',
  alternates: { canonical: 'https://www.franchiseontario.com/support' },
  robots: { index: false, follow: true },
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Ontario Franchises Side-by-Side — FranchiseOntario.com',
  description:
    'Compare up to 3 Ontario franchise opportunities side by side. See franchise fees, royalties, investment ranges, training, territory, and more in one view.',
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

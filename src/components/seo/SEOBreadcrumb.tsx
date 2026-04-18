import Link from 'next/link'
import JsonLd from '@/components/JsonLd'

const BASE = 'https://www.franchiseontario.com'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function SEOBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE}${item.href}` } : {}),
    })),
  }

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="opacity-40">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:underline transition-colors" style={{ color: 'var(--text-muted)' }}>
                {item.label}
              </Link>
            ) : (
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}

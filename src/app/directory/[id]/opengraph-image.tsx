import { ImageResponse } from 'next/og'
import { franchises } from '@/data/franchises'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const franchise = franchises.find((f) => f.id === params.id)

  if (!franchise) {
    // Fallback generic image
    return new ImageResponse(
      (
        <div style={{ background: '#0D1B2A', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 48, fontWeight: 900 }}>FranchiseOntario.com</span>
        </div>
      ),
      { ...size }
    )
  }

  const category = franchise.category
  const fee = franchise.financials?.franchiseFee ?? 'Contact for details'
  const inv = franchise.financials
  const investment = inv && inv.investmentMin && inv.investmentMax
    ? `$${(inv.investmentMin / 1000).toFixed(0)}K – $${(inv.investmentMax / 1000).toFixed(0)}K`
    : 'Contact for details'
  const locations = franchise.locations ?? 0

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0D1B2A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top: site brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#C8102E', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff' }}>F</div>
          <span style={{ color: '#6b7280', fontSize: 15, fontWeight: 600 }}>FranchiseOntario.com</span>
        </div>

        {/* Centre: franchise info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center' }}>
          {/* Logo initial */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: franchise.logoBg || '#C8102E',
              color: franchise.logoColor || '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 900,
            }}
          >
            {franchise.logoInitials || franchise.name.charAt(0)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ background: '#1e3a5f', color: '#93c5fd', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                {category}
              </span>
              {franchise.tier === 'enterprise' && (
                <span style={{ background: '#7c3aed', color: '#ddd6fe', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                  Enterprise
                </span>
              )}
            </div>
            <h1 style={{ color: '#fff', fontSize: 56, fontWeight: 900, margin: 0, lineHeight: 1.1 }}>
              {franchise.name}
            </h1>
            {franchise.tagline && (
              <p style={{ color: '#9ca3af', fontSize: 22, margin: 0, lineHeight: 1.4 }}>
                {franchise.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Bottom: key stats */}
        <div style={{ display: 'flex', gap: 40, borderTop: '1px solid #1f2937', paddingTop: 28, width: '100%' }}>
          {[
            { label: 'Franchise Fee', value: fee },
            { label: 'Investment', value: investment },
            { label: 'Ontario Locations', value: locations > 0 ? `${locations}+` : 'Expanding' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              <span style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}

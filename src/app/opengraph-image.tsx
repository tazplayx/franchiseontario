import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "FranchiseOntario.com — Ontario's #1 Franchise Directory"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const dmSans = await fetch(
    new URL('https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHQ.woff2')
  ).then((res) => res.arrayBuffer()).catch(() => null)

  return new ImageResponse(
    (
      <div
        style={{
          background: '#00228e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px 72px',
          fontFamily: dmSans ? 'DM Sans' : 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top: logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: '#ff000d',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 900,
              color: '#fff',
            }}
          >
            F
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
              FranchiseOntario.com
            </span>
            <span style={{ color: '#9ca3af', fontSize: 13, marginTop: 2 }}>
              Ontario&apos;s #1 Franchise Directory
            </span>
          </div>
        </div>

        {/* Centre: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
          <div
            style={{
              background: '#ff000d',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 20,
              width: 'fit-content',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            🍁 Ontario, Canada
          </div>
          <h1
            style={{
              color: '#fff',
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Find Your Next{' '}
            <span style={{ color: '#ff000d' }}>Franchise</span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 24, margin: 0, lineHeight: 1.4 }}>
            Browse 332+ franchise listings · Compare investment levels ·
            Connect with top Canadian brands
          </p>
        </div>

        {/* Bottom: stats */}
        <div style={{ display: 'flex', gap: 48 }}>
          {[
            { value: '332+', label: 'Listings' },
            { value: '21', label: 'Categories' },
            { value: '2,500+', label: 'Monthly Visitors' },
            { value: '$2B+', label: 'In Opportunities' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{stat.value}</span>
              <span style={{ color: '#6b7280', fontSize: 14, marginTop: 2 }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: dmSans
        ? [{ name: 'DM Sans', data: dmSans, style: 'normal', weight: 900 }]
        : [],
    }
  )
}

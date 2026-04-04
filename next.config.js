/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply security + SEO headers to all routes
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — also a Google ranking signal
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Strict referrer for privacy, still sends origin on same-site
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable unused browser features (privacy + trust signal)
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Tell crawlers max snippet length and image preview size
          { key: 'X-Robots-Tag', value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
        ],
      },
      {
        // Long-lived cache for static assets (fonts, images, JS chunks)
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache OG images for 1 hour
        source: '/:path*/opengraph-image',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
}

module.exports = nextConfig

/**
 * GET /api/gsc?type=queries|pages&days=28
 *
 * Proxies Google Search Console Search Analytics API.
 * Requires GOOGLE_SERVICE_ACCOUNT_KEY (JSON string of the service account key)
 * and GOOGLE_GSC_SITE_URL (e.g. sc-domain:franchiseontario.com) in .env.local
 *
 * Setup:
 *  1. Create a service account in Google Cloud Console
 *  2. Enable the "Google Search Console API"
 *  3. Add the service account email as an "Owner" in GSC → Settings → Users
 *  4. Download the JSON key, stringify it, and set as GOOGLE_SERVICE_ACCOUNT_KEY
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSign } from 'crypto'

export const dynamic = 'force-dynamic'

interface ServiceAccountKey {
  client_email: string
  private_key: string
}

function base64url(str: string): string {
  return Buffer.from(str).toString('base64url')
}

async function getAccessToken(sa: ServiceAccountKey): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }))
  const signingInput = `${header}.${payload}`
  const sign = createSign('RSA-SHA256')
  sign.update(signingInput)
  const signature = sign.sign(sa.private_key.replace(/\n/g, '\n'), 'base64url')
  const jwt = `${signingInput}.${signature}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const data = await res.json() as { access_token?: string; error?: string }
  if (!data.access_token) throw new Error(`GSC auth failed: ${data.error ?? 'unknown'}`)
  return data.access_token
}

export async function GET(req: NextRequest) {
  const saKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  const siteUrl = process.env.GOOGLE_GSC_SITE_URL

  if (!saKeyRaw || !siteUrl) {
    return NextResponse.json({ configured: false, message: 'GSC not configured — see /admin/seo for setup instructions.' })
  }

  try {
    const sa = JSON.parse(saKeyRaw) as ServiceAccountKey
    const token = await getAccessToken(sa)

    const { searchParams } = req.nextUrl
    const type = searchParams.get('type') ?? 'queries'   // 'queries' | 'pages'
    const days = parseInt(searchParams.get('days') ?? '28', 10)

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const fmt = (d: Date) => d.toISOString().split('T')[0]

    const body = {
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      dimensions: [type === 'pages' ? 'page' : 'query'],
      rowLimit: 25,
      startRow: 0,
    }

    const gscRes = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    if (!gscRes.ok) {
      const err = await gscRes.text()
      return NextResponse.json({ configured: true, error: `GSC API error: ${err}` }, { status: 502 })
    }

    const data = await gscRes.json()
    return NextResponse.json({ configured: true, data })
  } catch (err) {
    console.error('[GSC]', err)
    return NextResponse.json({ configured: true, error: String(err) }, { status: 500 })
  }
}

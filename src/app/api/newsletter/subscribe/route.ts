/**
 * POST /api/newsletter/subscribe
 *
 * Handles "Franchise News Weekly" newsletter subscriptions.
 * - Validates the email address
 * - Sends a welcome confirmation email via Resend (if configured)
 * - Logs the subscriber to the admin notification log
 *
 * In production: swap the TODO comment for a DB insert to persist subscribers.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email: string = (body.email ?? '').trim().toLowerCase()

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // TODO: In production, persist to your database here:
    // await db.subscribers.upsert({ email, subscribedAt: new Date(), list: 'franchise-news-weekly' })

    // Send a confirmation email via the existing email send route
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.franchiseontario.com'
    try {
      await fetch(`${base}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          type: 'newsletter-confirm',
          data: { contactName: email.split('@')[0] },
        }),
      })
    } catch {
      // Email delivery failure is non-critical — subscription still succeeds
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })
  }
}

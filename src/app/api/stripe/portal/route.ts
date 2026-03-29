import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

// Creates a Stripe Billing Portal session so customers can self-manage:
// upgrade, downgrade, cancel, update payment method, download invoices

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json()

    if (!customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.franchiseontario.com'

    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/admin/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[Portal] Error:', err)
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
  }
}

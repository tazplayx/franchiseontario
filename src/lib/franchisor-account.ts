import { NextRequest } from 'next/server'
import { FRANCHISOR_COOKIE, verifyFranchisorToken } from '@/lib/franchisor-session'
import { sbSelect } from '@/lib/supabase-server'

export interface FranchisorAccountRow {
  id: string
  franchise_id: string
  franchise_name: string
  name: string
  email: string
  tier: string
}

/** The signed-in franchisor's account, or null. Used by every /api/franchisor route. */
export async function getFranchisorAccount(req: NextRequest): Promise<FranchisorAccountRow | null> {
  const email = await verifyFranchisorToken(req.cookies.get(FRANCHISOR_COOKIE)?.value)
  if (!email) return null
  const rows = await sbSelect<FranchisorAccountRow>('accounts', `email=eq.${encodeURIComponent(email)}&select=*`)
  return rows[0] ?? null
}

/** Premium and Enterprise memberships include unlimited lead access. */
export function includesLeadAccess(tier: string): boolean {
  return tier === 'premium' || tier === 'enterprise'
}

export const LEAD_PRICE_CENTS = Number(process.env.LEAD_PRICE_CENTS ?? 7500) // default $75 CAD per lead

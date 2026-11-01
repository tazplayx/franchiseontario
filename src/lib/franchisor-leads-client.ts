'use client'
/** Browser helpers for the franchisor leads API (pay-per-lead + membership). */

export interface ApiOk<T> { ok: true; status: number; data: T }
export interface ApiErr { ok: false; status: number; error: string }
export type LeadApiResult<T> = ApiOk<T> | ApiErr

export interface FranchisorLeadView {
  id: string
  franchiseId: string
  franchiseName: string
  submittedAt: string
  city: string
  investmentBudget: string
  status: string
  read: boolean
  unlocked: boolean
  name: string
  email: string
  phone: string
  message: string
}

async function call<T>(url: string, init?: RequestInit): Promise<LeadApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      cache: 'no-store',
    })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (res.ok) return { ok: true, status: res.status, data: data as T }
    return { ok: false, status: res.status, error: (data.error as string) ?? 'Something went wrong. Please try again.' }
  } catch {
    return { ok: false, status: 0, error: 'Network error. Please check your connection and try again.' }
  }
}

export function fetchFranchisorLeads() {
  return call<{ leads: FranchisorLeadView[]; tier: string; leadPriceCents: number }>('/api/franchisor/leads')
}

export function patchLead(id: string, patch: { status?: string; read?: boolean }) {
  return call<{ ok: boolean }>(`/api/franchisor/leads/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

/** Returns a Stripe Checkout url to pay for one lead, or { unlocked: true } for members. */
export function unlockLead(id: string) {
  return call<{ url?: string; unlocked?: boolean }>(`/api/franchisor/leads/${encodeURIComponent(id)}/unlock`, { method: 'POST' })
}

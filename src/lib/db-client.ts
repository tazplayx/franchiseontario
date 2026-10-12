'use client'
/**
 * Browser-side helpers for the database-backed API routes.
 * Every call returns a result object instead of throwing, so pages can show
 * a clear message and keep their existing UI states.
 */
import type { FranchisorSession } from './leads'
import type { PendingListing, ListingClaim, StoredTicket } from './store'

interface ApiOk<T> { ok: true; status: number; data: T }
interface ApiErr { ok: false; status: number; error: string }
export type ApiResult<T> = ApiOk<T> | ApiErr

async function call<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
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

export interface RegisterPayload {
  franchiseName: string
  category?: string
  contactName: string
  title?: string
  email: string
  phone?: string
  password: string
  website?: string
  established?: number
  locations?: number
  description?: string
  logoUrl?: string
  mediaImages?: string[]
  videoUrl?: string
  plan?: string
}

/** Creates the franchisor account and the pending listing in one step. 409 = account already exists. */
export function dbRegister(payload: RegisterPayload) {
  return call<{ session: FranchisorSession }>('/api/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((r) => {
    if (!r.ok) return r
    const d = r.data as unknown as { franchiseId: string; email: string; franchiseName: string; name: string; tier: string }
    return { ...r, data: { session: { franchiseId: d.franchiseId, franchiseName: d.franchiseName, email: d.email, name: d.name, tier: d.tier as FranchisorSession['tier'] } } }
  })
}

/** Verifies email + password against the database and returns the session. */
export function dbLogin(email: string, password: string) {
  return call<{ session: FranchisorSession }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }).then((r) => (r.ok ? { ok: true as const, status: r.status, data: { session: (r.data as unknown as { session: FranchisorSession }).session } } : r))
}

/** Admin: approve or reject a franchisor listing (approved listings go live for everyone). */
export function dbSetListingStatus(id: string, status: 'approved' | 'rejected') {
  return call<{ ok: boolean }>(`/api/admin/listings?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

/** Admin: fetch franchisor submissions, mapped to the PendingListing shape the admin pages use. */
export async function dbFetchPendingListings(): Promise<PendingListing[]> {
  const r = await call<Record<string, unknown>[]>('/api/admin/listings?status=pending')
  if (!r.ok) return []
  return (r.data as unknown as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    category: (row.category as string) ?? '',
    plan: (row.plan as string) ?? 'Basic',
    email: (row.email as string) ?? '',
    contactName: (row.contact_name as string) ?? '',
    phone: (row.phone as string) ?? '',
    website: (row.website as string) ?? '',
    city: (row.city as string) ?? '',
    description: (row.description as string) ?? '',
    locations: (row.locations as number) ?? 0,
    established: (row.established as number) ?? new Date().getFullYear(),
    logoUrl: (row.logo_url as string) ?? '',
    mediaImages: (row.media_images as string[]) ?? [],
    videoUrl: (row.video_url as string) ?? '',
    submittedAt: (row.submitted_at as string) ?? new Date().toISOString(),
    status: ((row.status as string) ?? 'pending') as PendingListing['status'],
  }))
}

/** Franchisor claims a listing (sourced or otherwise). */
export function dbSubmitClaim(payload: {
  franchiseId: string; franchiseName: string; claimantName: string; claimantEmail: string
  claimantTitle?: string; message?: string; domainMatch?: boolean; sourceListingUrl?: string; sourceSite?: string
}) {
  return call<{ ok: boolean }>('/api/claims', { method: 'POST', body: JSON.stringify(payload) })
}

/** Support ticket from the public support page or the franchisor dashboard. */
export function dbSubmitTicket(payload: { name: string; email: string; category?: string; subject: string; message?: string }) {
  return call<{ ok: boolean }>('/api/tickets', { method: 'POST', body: JSON.stringify(payload) })
}

/** Admin: all claims (newest first), mapped to the ListingClaim shape used by the admin page. */
export async function dbFetchClaims(): Promise<ListingClaim[]> {
  const r = await call<Record<string, unknown>[]>('/api/claims')
  if (!r.ok) return []
  return (r.data as unknown as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    franchiseId: row.franchise_id as string,
    franchiseName: row.franchise_name as string,
    claimantName: row.claimant_name as string,
    claimantEmail: row.claimant_email as string,
    claimantTitle: (row.claimant_title as string) ?? '',
    message: (row.message as string) ?? '',
    submittedAt: row.submitted_at as string,
    status: row.status as ListingClaim['status'],
    domainMatch: !!row.domain_match,
    sourceListingUrl: (row.source_listing_url as string) || undefined,
    sourceSite: (row.source_site as string) || undefined,
  }))
}

export function dbSetClaimStatus(id: string, status: 'approved' | 'rejected') {
  return call<{ ok: boolean }>(`/api/claims?id=${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

/** Admin: all support tickets (newest first), mapped to the StoredTicket shape. */
export async function dbFetchTickets(): Promise<StoredTicket[]> {
  const r = await call<Record<string, unknown>[]>('/api/tickets')
  if (!r.ok) return []
  return (r.data as unknown as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    category: (row.category as string) ?? 'General Enquiry',
    subject: row.subject as string,
    message: (row.message as string) ?? '',
    status: (row.status as StoredTicket['status']) ?? 'Open',
    submittedAt: ((row.submitted_at as string) ?? '').split('T')[0],
  }))
}

export function dbSetTicketStatus(id: string, status: 'Open' | 'Resolved') {
  return call<{ ok: boolean }>(`/api/tickets?id=${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

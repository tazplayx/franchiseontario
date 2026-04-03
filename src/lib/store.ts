/**
 * localStorage persistence layer for FranchiseOntario.
 *
 * Uses a lightweight override-map pattern:
 *  - Franchise edits   → stored as a delta on top of the seed data
 *  - Franchise removes → stored as a set of IDs
 *  - Ticket statuses   → stored as Record<id, status>
 *  - Pending statuses  → stored as Record<id, status>
 *  - User-submitted tickets → full objects appended to a list
 *  - User franchise    → delta + removed flag
 *
 * All functions are safe to call on the server (they guard with typeof window).
 */

import type { Franchise } from '@/data/franchises'

// ── Storage keys ──────────────────────────────────────────────────────────────
const LISTING_OVERRIDES_KEY   = 'fo_listing_overrides_v1'
const LISTING_REMOVED_KEY     = 'fo_listing_removed_v1'
const APPROVED_LISTINGS_KEY   = 'fo_approved_listings_v1'
const TICKET_STATUSES_KEY     = 'fo_ticket_statuses_v1'
const USER_TICKETS_KEY        = 'fo_user_tickets_v1'
const PENDING_STATUSES_KEY    = 'fo_pending_statuses_v1'
const USER_FRANCHISE_KEY      = 'fo_user_franchise_v1'
const USER_FRANCHISE_REMOVED  = 'fo_user_franchise_removed_v1'

// ── Helpers ───────────────────────────────────────────────────────────────────
function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage quota exceeded — silently ignore
  }
}

// ── Active listings (admin) ────────────────────────────────────────────────────

/** Returns the stored field-level overrides for each listing id. */
export function getListingOverrides(): Record<string, Partial<Franchise>> {
  return read<Record<string, Partial<Franchise>>>(LISTING_OVERRIDES_KEY, {})
}

/** Persist an edit for a single listing (merges with any prior overrides). */
export function saveListing(id: string, fields: Partial<Franchise>): void {
  const overrides = getListingOverrides()
  overrides[id] = { ...(overrides[id] ?? {}), ...fields }
  write(LISTING_OVERRIDES_KEY, overrides)
}

/** Returns the set of listing IDs that have been removed by admin. */
export function getRemovedIds(): string[] {
  return read<string[]>(LISTING_REMOVED_KEY, [])
}

/** Mark a listing as removed. */
export function removeListing(id: string): void {
  const ids = getRemovedIds()
  if (!ids.includes(id)) {
    write(LISTING_REMOVED_KEY, [...ids, id])
  }
  // also clean up any overrides for the removed listing
  const overrides = getListingOverrides()
  delete overrides[id]
  write(LISTING_OVERRIDES_KEY, overrides)
}

/** Check if a listing has been removed. */
export function isListingRemoved(id: string): boolean {
  return getRemovedIds().includes(id)
}

/** Returns all admin-approved pending listings (stored as full Franchise objects). */
export function getApprovedListings(): Franchise[] {
  return read<Franchise[]>(APPROVED_LISTINGS_KEY, [])
}

/** Save/update an approved listing. Replaces any existing entry with the same id. */
export function saveApprovedListing(franchise: Franchise): void {
  const existing = getApprovedListings()
  const others = existing.filter((f) => f.id !== franchise.id)
  write(APPROVED_LISTINGS_KEY, [...others, franchise])
}

/** Remove an approved listing (e.g. when admin rejects after prior approval). */
export function removeApprovedListing(id: string): void {
  const existing = getApprovedListings()
  write(APPROVED_LISTINGS_KEY, existing.filter((f) => f.id !== id))
}

/**
 * Apply stored overrides + removals + approved pending listings to a base array.
 * Returns a new array with edits merged, removed entries excluded, and approved
 * pending listings appended (unless they have since been removed).
 */
export function applyListingStore(base: Franchise[]): Franchise[] {
  const overrides = getListingOverrides()
  const removed   = new Set(getRemovedIds())
  const approved  = getApprovedListings()

  const baseMerged = base
    .filter((f) => !removed.has(f.id))
    .map((f) => overrides[f.id] ? { ...f, ...overrides[f.id] } : f)

  // Append approved pending listings that aren't in the seed base and haven't been removed
  const baseIds = new Set(base.map((f) => f.id))
  const newApproved = approved.filter((f) => !baseIds.has(f.id) && !removed.has(f.id))

  return [...baseMerged, ...newApproved]
}

// ── Support tickets (admin) ────────────────────────────────────────────────────

export type TicketStatus = 'Open' | 'Resolved'

export interface StoredTicket {
  id: string
  name: string
  email: string
  category: string
  subject: string
  message: string
  status: TicketStatus
  submittedAt: string
}

/** Returns persisted status overrides for the seed tickets. */
export function getTicketStatuses(): Record<string, TicketStatus> {
  return read<Record<string, TicketStatus>>(TICKET_STATUSES_KEY, {})
}

/** Persist a status change for a ticket. */
export function saveTicketStatus(id: string, status: TicketStatus): void {
  const statuses = getTicketStatuses()
  statuses[id] = status
  write(TICKET_STATUSES_KEY, statuses)
}

/** Returns tickets submitted by users via the dashboard. */
export function getUserSubmittedTickets(): StoredTicket[] {
  return read<StoredTicket[]>(USER_TICKETS_KEY, [])
}

/** Append a user-submitted support ticket (from dashboard → admin). */
export function addUserTicket(ticket: StoredTicket): void {
  const tickets = getUserSubmittedTickets()
  write(USER_TICKETS_KEY, [...tickets, ticket])
}

/**
 * Apply stored statuses + user-submitted tickets to the seed ticket array.
 * Returns the merged list with status overrides applied.
 */
export function applyTicketStore(seedTickets: StoredTicket[]): StoredTicket[] {
  const statuses   = getTicketStatuses()
  const userTickets = getUserSubmittedTickets()

  const merged = [...seedTickets, ...userTickets]
  return merged.map((t) =>
    statuses[t.id] ? { ...t, status: statuses[t.id] } : t
  )
}

// ── Pending listings (admin) ───────────────────────────────────────────────────

export type PendingStatus = 'pending' | 'approved' | 'rejected'

/** Returns stored approve/reject decisions for pending listings. */
export function getPendingStatuses(): Record<string, PendingStatus> {
  return read<Record<string, PendingStatus>>(PENDING_STATUSES_KEY, {})
}

/** Persist an approve or reject decision for a pending listing. */
export function savePendingStatus(id: string, status: PendingStatus): void {
  const statuses = getPendingStatuses()
  statuses[id] = status
  write(PENDING_STATUSES_KEY, statuses)
}

// ── User franchise (franchisor dashboard) ─────────────────────────────────────

/** Returns any stored field overrides for the logged-in user's franchise. */
export function getUserFranchiseOverrides(): Record<string, unknown> {
  return read<Record<string, unknown>>(USER_FRANCHISE_KEY, {})
}

/** Persist field-level edits to the user's own franchise. */
export function saveUserFranchise(fields: Record<string, unknown>): void {
  const current = getUserFranchiseOverrides()
  write(USER_FRANCHISE_KEY, { ...current, ...fields })
}

/** Mark the user's own franchise listing as removed. */
export function removeUserFranchise(): void {
  write(USER_FRANCHISE_REMOVED, 'true')
}

/** Check whether the user has removed their own franchise. */
export function isUserFranchiseRemoved(): boolean {
  return read<string>(USER_FRANCHISE_REMOVED, '') === 'true'
}

/** Clear the user franchise removed flag (e.g. after re-listing). */
export function restoreUserFranchise(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_FRANCHISE_REMOVED)
    localStorage.removeItem(USER_FRANCHISE_KEY)
  }
}

// ── Email notification log (admin inbox) ──────────────────────────────────────

const NOTIFICATION_LOG_KEY = 'fo_notification_log_v1'
const MAX_NOTIFICATIONS = 100

export interface NotificationEntry {
  id: string          // unique — timestamp + random suffix
  type: string        // EmailType value
  to: string          // recipient email address
  franchiseName: string
  subject: string     // subject line from the email template
  sentAt: string      // ISO 8601 timestamp
}

/** Prepend a new notification entry to the log (capped at MAX_NOTIFICATIONS). */
export function saveNotification(entry: NotificationEntry): void {
  const existing = getNotifications()
  write(NOTIFICATION_LOG_KEY, [entry, ...existing].slice(0, MAX_NOTIFICATIONS))
}

/** Return all stored notification log entries, newest first. */
export function getNotifications(): NotificationEntry[] {
  return read<NotificationEntry[]>(NOTIFICATION_LOG_KEY, [])
}

/** Clear the notification log (admin use). */
export function clearNotifications(): void {
  write(NOTIFICATION_LOG_KEY, [])
}

// ── Listing claims ─────────────────────────────────────────────────────────────

const LISTING_CLAIMS_KEY = 'fo_listing_claims_v1'

export interface ListingClaim {
  id: string
  franchiseId: string
  franchiseName: string
  claimantName: string
  claimantEmail: string
  claimantTitle: string
  message: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  domainMatch?: boolean
  sourceListingUrl?: string
  sourceSite?: string
}

export function getClaims(): ListingClaim[] {
  return read<ListingClaim[]>(LISTING_CLAIMS_KEY, [])
}

export function saveClaim(claim: ListingClaim): void {
  const existing = getClaims()
  // Replace if same franchiseId + email already exists, otherwise append
  const idx = existing.findIndex(
    (c) => c.franchiseId === claim.franchiseId && c.claimantEmail === claim.claimantEmail
  )
  if (idx >= 0) {
    existing[idx] = claim
    write(LISTING_CLAIMS_KEY, existing)
  } else {
    write(LISTING_CLAIMS_KEY, [...existing, claim])
  }
}

export function updateClaimStatus(id: string, status: 'approved' | 'rejected'): void {
  const existing = getClaims()
  write(LISTING_CLAIMS_KEY, existing.map((c) => (c.id === id ? { ...c, status } : c)))
}

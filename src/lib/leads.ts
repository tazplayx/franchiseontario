/**
 * Lead management — localStorage persistence layer.
 * Leads are stored per franchise. Franchise owners access them via /dashboard.
 */

export interface FranchiseLead {
  id: string
  franchiseId: string
  franchiseName: string
  submittedAt: string
  // Prospect info
  name: string
  email: string
  phone: string
  city: string
  investmentBudget: string
  message: string
  read: boolean
}

export interface FranchisorAccount {
  id: string
  franchiseId: string
  franchiseName: string
  name: string
  email: string
  title: string
  passwordHash: string // btoa encoded (demo only)
  tier: 'basic' | 'premium' | 'enterprise'
  registeredAt: string
}

export interface FranchisorSession {
  franchiseId: string
  franchiseName: string
  email: string
  name: string
  tier: 'basic' | 'premium' | 'enterprise'
}

// ── Storage keys ───────────────────────────────────────────────────────────────
const LEADS_PREFIX = 'fo_leads_'
const LEAD_COUNT_PREFIX = 'fo_lead_count_'
const ACCOUNTS_KEY = 'fo_franchisor_accounts_v1'
const SESSION_KEY = 'fo_franchisor_session_v1'

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
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota */ }
}

// ── Leads ──────────────────────────────────────────────────────────────────────

export function getLeads(franchiseId: string): FranchiseLead[] {
  return read<FranchiseLead[]>(`${LEADS_PREFIX}${franchiseId}`, [])
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

export function addLead(lead: FranchiseLead): void {
  const existing = read<FranchiseLead[]>(`${LEADS_PREFIX}${lead.franchiseId}`, [])
  write(`${LEADS_PREFIX}${lead.franchiseId}`, [lead, ...existing])
  // Increment public counter
  const count = read<number>(`${LEAD_COUNT_PREFIX}${lead.franchiseId}`, 0)
  write(`${LEAD_COUNT_PREFIX}${lead.franchiseId}`, count + 1)
}

export function getLeadCount(franchiseId: string): number {
  return read<number>(`${LEAD_COUNT_PREFIX}${franchiseId}`, 0)
}

export function markLeadRead(franchiseId: string, leadId: string): void {
  const leads = read<FranchiseLead[]>(`${LEADS_PREFIX}${franchiseId}`, [])
  write(`${LEADS_PREFIX}${franchiseId}`, leads.map((l) => l.id === leadId ? { ...l, read: true } : l))
}

// ── Franchisor accounts ────────────────────────────────────────────────────────

function hashPassword(pw: string): string {
  return btoa(encodeURIComponent(pw))
}

export function getAccounts(): FranchisorAccount[] {
  return read<FranchisorAccount[]>(ACCOUNTS_KEY, [])
}

export function getAccountByFranchiseId(franchiseId: string): FranchisorAccount | null {
  return getAccounts().find((a) => a.franchiseId === franchiseId) ?? null
}

export function getAccountByEmail(email: string): FranchisorAccount | null {
  return getAccounts().find((a) => a.email.toLowerCase() === email.toLowerCase()) ?? null
}

export function registerAccount(data: Omit<FranchisorAccount, 'id' | 'passwordHash' | 'registeredAt'> & { password: string }): FranchisorAccount {
  const { password, ...rest } = data
  const account: FranchisorAccount = {
    ...rest,
    id: `fa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    passwordHash: hashPassword(password),
    registeredAt: new Date().toISOString(),
  }
  const existing = getAccounts().filter((a) => a.franchiseId !== account.franchiseId)
  write(ACCOUNTS_KEY, [...existing, account])
  return account
}

export function verifyPassword(account: FranchisorAccount, password: string): boolean {
  return account.passwordHash === hashPassword(password)
}

export function updateAccountTier(franchiseId: string, tier: FranchisorAccount['tier']): void {
  const accounts = getAccounts()
  write(ACCOUNTS_KEY, accounts.map((a) => a.franchiseId === franchiseId ? { ...a, tier } : a))
}

export function updateAccount(id: string, fields: Partial<Omit<FranchisorAccount, 'id' | 'passwordHash' | 'registeredAt'>>): void {
  const accounts = getAccounts()
  write(ACCOUNTS_KEY, accounts.map((a) => a.id === id ? { ...a, ...fields } : a))
}

export function resetAccountPassword(id: string, newPassword: string): void {
  const accounts = getAccounts()
  write(ACCOUNTS_KEY, accounts.map((a) => a.id === id ? { ...a, passwordHash: hashPassword(newPassword) } : a))
}

export function deleteAccount(id: string): void {
  const accounts = getAccounts()
  write(ACCOUNTS_KEY, accounts.filter((a) => a.id !== id))
}

// ── Session ────────────────────────────────────────────────────────────────────

export function setSession(session: FranchisorSession): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getSession(): FranchisorSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}

export const FREE_LEAD_LIMIT = 5

'use client'
const KEY = 'fo_recently_viewed_v1'
const MAX = 8

export function recordView(franchiseId: string) {
  if (typeof window === 'undefined') return
  try {
    const list: string[] = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    const filtered = list.filter((id) => id !== franchiseId)
    const next = [franchiseId, ...filtered].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch { /* ignore */ }
}

export function getRecentIds(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

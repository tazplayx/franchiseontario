'use client'
const KEY = 'fo_wishlist_v1'

function read(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}
function write(ids: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(ids))
}

export function getWishlist(): string[] { return read() }
export function isWishlisted(id: string): boolean { return read().includes(id) }
export function toggleWishlist(id: string): boolean {
  const list = read()
  const idx = list.indexOf(id)
  if (idx >= 0) { list.splice(idx, 1); write(list); return false }
  list.push(id); write(list); return true
}
export function getWishlistCount(): number { return read().length }

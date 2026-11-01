/**
 * Franchisor session tokens: "<base64url(email)>.<expiresAtMs>.<hmacHex>", signed with FRANCHISOR_SESSION_SECRET.
 * Web Crypto, so it runs in Edge middleware and Node route handlers.
 */
export const FRANCHISOR_COOKIE = 'fo_franchisor'
export const FRANCHISOR_SESSION_MS = 30 * 24 * 60 * 60 * 1000

const enc = new TextEncoder()
const dec = new TextDecoder()

async function hmacKey(): Promise<CryptoKey | null> {
  const secret = process.env.FRANCHISOR_SESSION_SECRET
  if (!secret || secret.length < 32) return null
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function b64url(s: string): string {
  return btoa(Array.from(enc.encode(s), (c) => String.fromCharCode(c)).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(s: string): string {
  const b = s.replace(/-/g, '+').replace(/_/g, '/')
  return dec.decode(Uint8Array.from(atob(b + '='.repeat((4 - (b.length % 4)) % 4)), (c) => c.charCodeAt(0)))
}

async function sign(payload: string, key: CryptoKey): Promise<string> {
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(payload)))
}

export async function createFranchisorToken(email: string): Promise<string | null> {
  const key = await hmacKey()
  if (!key) return null
  const body = `${b64url(email.toLowerCase())}.${Date.now() + FRANCHISOR_SESSION_MS}`
  return `${body}.${await sign(body, key)}`
}

/** Returns the account email from a valid, unexpired token, or null. */
export async function verifyFranchisorToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [emailPart, exp, sig] = parts
  if (Number(exp) < Date.now()) return null
  const key = await hmacKey()
  if (!key) return null
  const expected = await sign(`${emailPart}.${exp}`, key)
  if (expected.length !== sig.length) return null
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  if (diff !== 0) return null
  try { return fromB64url(emailPart) } catch { return null }
}

/**
 * Admin session tokens: "<expiresAtMs>.<hmacHex>", signed with ADMIN_SESSION_SECRET.
 * Uses Web Crypto so it runs in both Edge middleware and Node route handlers.
 */
export const ADMIN_COOKIE = 'fo_admin_session'
export const ADMIN_SESSION_MS = 12 * 60 * 60 * 1000

const enc = new TextEncoder()

async function hmacKey(): Promise<CryptoKey | null> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) return null // fail closed if not configured
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function createAdminToken(): Promise<string | null> {
  const key = await hmacKey()
  if (!key) return null
  const exp = String(Date.now() + ADMIN_SESSION_MS)
  const sig = toHex(await crypto.subtle.sign('HMAC', key, enc.encode(exp)))
  return `${exp}.${sig}`
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  const key = await hmacKey()
  if (!key) return false
  const expected = toHex(await crypto.subtle.sign('HMAC', key, enc.encode(exp)))
  if (expected.length !== sig.length) return false
  // constant-time comparison
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  return diff === 0
}

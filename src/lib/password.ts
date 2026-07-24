import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

/**
 * Proper password hashing using Node's built-in scrypt — no external deps.
 * Format stored in the DB: "scrypt:<saltHex>:<hashHex>".
 * Replaces the old reversible btoa() encoding.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `scrypt:${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split(':')
    if (parts.length !== 3 || parts[0] !== 'scrypt') return false
    const salt = Buffer.from(parts[1], 'hex')
    const expected = Buffer.from(parts[2], 'hex')
    const actual = scryptSync(password, salt, expected.length)
    return timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

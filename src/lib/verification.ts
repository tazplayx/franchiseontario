/**
 * Stateless HMAC-SHA256 email verification tokens.
 * No database required — the HMAC secret is the only dependency.
 *
 * Setup: add HMAC_SECRET=<any 32+ char random string> to .env.local
 *
 * Token format (base64url-encoded): email.issuedAt.hmac
 * Valid for 24 hours.
 */

import crypto from 'crypto'

const SECRET = process.env.HMAC_SECRET || 'change-me-to-a-random-32-char-string'
const EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

function hmacHex(data: string): string {
  return crypto.createHmac('sha256', SECRET).update(data).digest('hex')
}

/**
 * Generate a 24-hour verification token for the given email address.
 * Call this server-side only (e.g. in an API route).
 */
export function generateVerificationToken(email: string): string {
  const issuedAt = Date.now().toString()
  const payload = `${email}.${issuedAt}`
  const sig = hmacHex(payload)
  return Buffer.from(`${payload}.${sig}`).toString('base64url')
}

/**
 * Validate a verification token.
 * Returns { valid: true, email } on success or { valid: false } on any failure.
 */
export function verifyToken(token: string): { valid: boolean; email?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')

    // format: email.issuedAt.sig
    // Split from the right — sig is the last segment, issuedAt the second-to-last,
    // everything before is the email (which may contain dots).
    const lastDot = decoded.lastIndexOf('.')
    if (lastDot === -1) return { valid: false }

    const sig = decoded.slice(lastDot + 1)
    const payload = decoded.slice(0, lastDot) // "email.issuedAt"

    const secondLastDot = payload.lastIndexOf('.')
    if (secondLastDot === -1) return { valid: false }

    const email = payload.slice(0, secondLastDot)
    const issuedAt = payload.slice(secondLastDot + 1)

    // Constant-time HMAC comparison to prevent timing attacks
    const expectedSig = hmacHex(payload)
    const sigBuf = Buffer.from(sig, 'hex')
    const expectedBuf = Buffer.from(expectedSig, 'hex')
    if (
      sigBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return { valid: false }
    }

    // Check expiry
    const issued = parseInt(issuedAt, 10)
    if (isNaN(issued) || Date.now() - issued > EXPIRY_MS) {
      return { valid: false }
    }

    return { valid: true, email }
  } catch {
    return { valid: false }
  }
}

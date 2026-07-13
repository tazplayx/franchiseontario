/**
 * Franchise development contact emails — server-side lookup for lead notifications.
 *
 * Most sourced (CFA-aggregated) listings have `email: 'See website'`, so the lead
 * API can't notify the franchisor. As you collect real franchise-development
 * emails, add them here keyed by franchise ID (the slug in /directory/{id}).
 * Once deployed, every new lead for that franchise triggers a
 * "new lead — claim your listing" email to this address automatically.
 *
 * Example:
 *   'osmows-shawarma': 'franchising@osmows.com',
 */
export const FRANCHISE_DEV_EMAILS: Record<string, string> = {
  // franchiseId: 'development-email@brand.com',
}

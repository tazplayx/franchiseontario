/**
 * Server-side Supabase REST helper.
 * Uses the service-role key (bypasses RLS) and is ONLY imported by API
 * routes — never by client components. All calls go through PostgREST.
 */

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY

export function supabaseConfigured(): boolean {
  return !!url() && !!key()
}

function baseHeaders() {
  const k = key()!
  return {
    apikey: k,
    Authorization: `Bearer ${k}`,
    'Content-Type': 'application/json',
  }
}

/** SELECT rows. `query` is a PostgREST query string, e.g. "status=eq.approved&order=submitted_at.desc". */
export async function sbSelect<T = Record<string, unknown>>(
  table: string,
  query = '',
): Promise<T[]> {
  if (!supabaseConfigured()) throw new Error('supabase-not-configured')
  const res = await fetch(`${url()}/rest/v1/${table}?${query}`, {
    headers: baseHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`supabase select ${table}: ${res.status} ${await res.text()}`)
  return res.json() as Promise<T[]>
}

/** INSERT (or upsert). Set `upsert` true to merge on the primary key. */
export async function sbInsert<T = Record<string, unknown>>(
  table: string,
  row: Record<string, unknown>,
  upsert = false,
): Promise<T[]> {
  if (!supabaseConfigured()) throw new Error('supabase-not-configured')
  const res = await fetch(`${url()}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      ...baseHeaders(),
      Prefer: upsert ? 'resolution=merge-duplicates,return=representation' : 'return=representation',
    },
    body: JSON.stringify(row),
  })
  if (!res.ok) throw new Error(`supabase insert ${table}: ${res.status} ${await res.text()}`)
  return res.json() as Promise<T[]>
}

/** PATCH rows matching `query`. */
export async function sbUpdate(
  table: string,
  query: string,
  patch: Record<string, unknown>,
): Promise<void> {
  if (!supabaseConfigured()) throw new Error('supabase-not-configured')
  const res = await fetch(`${url()}/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: { ...baseHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error(`supabase update ${table}: ${res.status} ${await res.text()}`)
}

/** DELETE rows matching `query`. */
export async function sbDelete(table: string, query: string): Promise<void> {
  if (!supabaseConfigured()) throw new Error('supabase-not-configured')
  const res = await fetch(`${url()}/rest/v1/${table}?${query}`, {
    method: 'DELETE',
    headers: { ...baseHeaders(), Prefer: 'return=minimal' },
  })
  if (!res.ok) throw new Error(`supabase delete ${table}: ${res.status} ${await res.text()}`)
}

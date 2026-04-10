import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

/**
 * GET /api/cron/scrape
 *
 * Triggered by Vercel Cron (weekly) or GitHub Actions.
 * Runs the franchise scraper script and commits the updated sourced-listings.ts.
 *
 * Protected by CRON_SECRET env var — Vercel passes this automatically when
 * configured in vercel.json cron settings.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const projectRoot = path.join(process.cwd())
    const { stdout, stderr } = await execAsync(
      'npx tsx scripts/scrape-franchises.ts',
      {
        cwd: projectRoot,
        env: {
          ...process.env,
          PATH: process.env.PATH,
        },
        timeout: 300_000, // 5 minutes
      }
    )

    console.log('[cron/scrape] stdout:', stdout)
    if (stderr) console.warn('[cron/scrape] stderr:', stderr)

    return NextResponse.json({ ok: true, output: stdout.slice(-2000) })
  } catch (err: unknown) {
    const error = err as { message?: string; stdout?: string; stderr?: string }
    console.error('[cron/scrape] Error:', error)
    return NextResponse.json(
      { error: error.message, stderr: error.stderr },
      { status: 500 }
    )
  }
}

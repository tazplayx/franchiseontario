'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, BarChart3 } from 'lucide-react'
import { franchises, type Franchise } from '@/data/franchises'

const COMPARE_KEY = 'fo_compare_v1'

export function getCompareIds(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(COMPARE_KEY) ?? '[]') } catch { return [] }
}

export function toggleCompare(id: string): boolean {
  const list = getCompareIds()
  const idx = list.indexOf(id)
  if (idx >= 0) { list.splice(idx, 1); localStorage.setItem(COMPARE_KEY, JSON.stringify(list)); return false }
  if (list.length >= 3) return false // max 3
  list.push(id); localStorage.setItem(COMPARE_KEY, JSON.stringify(list)); return true
}

export function clearCompare() {
  if (typeof window !== 'undefined') localStorage.setItem(COMPARE_KEY, '[]')
}

export default function CompareBar() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    const sync = () => setIds(getCompareIds())
    sync()
    window.addEventListener('fo_compare_change', sync)
    return () => window.removeEventListener('fo_compare_change', sync)
  }, [])

  if (ids.length === 0) return null

  const selected: Franchise[] = ids.map((id) => franchises.find((f) => f.id === id)).filter(Boolean) as Franchise[]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3 shadow-2xl border-t"
      style={{ background: 'var(--rust-deep)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-3 overflow-x-auto flex-1 min-w-0">
        <BarChart3 size={16} className="text-white/70 shrink-0" />
        <span className="text-xs font-bold text-white/70 shrink-0">Compare:</span>
        {selected.map((f) => (
          <div key={f.id} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs text-white font-semibold shrink-0">
            {f.name}
            <button
              onClick={() => {
                toggleCompare(f.id)
                window.dispatchEvent(new Event('fo_compare_change'))
              }}
              className="ml-0.5 text-white/50 hover:text-white"
            >
              <X size={11} />
            </button>
          </div>
        ))}
        {ids.length < 3 && (
          <span className="text-xs text-white/40 shrink-0">+ add {3 - ids.length} more</span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => { clearCompare(); window.dispatchEvent(new Event('fo_compare_change')) }}
          className="text-xs text-white/50 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          Clear
        </button>
        {ids.length >= 2 && (
          <Link
            href={`/compare?ids=${ids.join(',')}`}
            className="text-xs font-bold px-4 py-2 rounded-full transition-opacity hover:opacity-90"
            style={{ background: 'var(--gold)', color: 'var(--rust-deep)' }}
          >
            Compare {ids.length} →
          </Link>
        )}
      </div>
    </div>
  )
}

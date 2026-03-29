'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowLeft, CheckCircle2, XCircle, Star, Crown, Zap } from 'lucide-react'
import { franchises, getFranchiseById } from '@/data/franchises'
import type { Franchise } from '@/data/franchises'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const rows: { label: string; key: (f: Franchise) => string | number | React.ReactNode; highlight?: boolean }[] = [
  { label: 'Category', key: (f) => f.category },
  { label: 'Established', key: (f) => f.established },
  { label: 'Ontario Locations', key: (f) => `${f.locations}+`, highlight: true },
  { label: 'Rating', key: (f) => <><StarRating rating={f.rating} /><span className="text-xs text-gray-600 ml-1">{f.rating}/5 ({f.reviews.toLocaleString()})</span></> },
  { label: 'Franchise Fee', key: (f) => f.financials.franchiseFee, highlight: true },
  { label: 'Total Investment', key: (f) => `$${(f.financials.investmentMin/1000).toFixed(0)}K – $${(f.financials.investmentMax/1000).toFixed(0)}K`, highlight: true },
  { label: 'Royalty Rate', key: (f) => f.financials.royaltyRate },
  { label: 'Marketing Fee', key: (f) => f.financials.marketingFee },
  { label: 'Avg Unit Volume', key: (f) => f.financials.averageUnitVolume, highlight: true },
  { label: 'Liquid Capital Req.', key: (f) => f.financials.liquidCapitalRequired },
  { label: 'Net Worth Req.', key: (f) => f.financials.netWorthRequired },
  { label: 'Training Duration', key: (f) => `${f.trainingWeeks} weeks` },
  { label: 'Territory', key: (f) => f.territory },
  { label: 'Active Franchisees', key: (f) => f.franchiseeCount },
  { label: 'Parent Company', key: (f) => f.parent },
]

function CompareTable({ franchiseList }: { franchiseList: Franchise[] }) {
  const cols = franchiseList.length

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Header row */}
        <thead>
          <tr>
            <th className="text-left py-3 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-widest w-40 bg-gray-50 rounded-tl-xl pl-4">Criteria</th>
            {franchiseList.map((f) => (
              <th key={f.id} className="text-center py-4 px-4 bg-white border border-gray-200 first:border-l-0">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-black shadow"
                    style={{ background: f.logoBg, color: f.logoColor }}
                  >
                    {f.logoInitials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm leading-snug">{f.name}</div>
                    <div className="text-[10px] text-gray-400">{f.category}</div>
                  </div>
                  {f.tier === 'enterprise' && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <Crown size={8} /> ENTERPRISE
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row.label} className={ri % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className={`py-3 pl-4 pr-4 text-xs font-semibold text-gray-500 ${row.highlight ? 'text-gray-700' : ''}`}>
                {row.label}
              </td>
              {franchiseList.map((f) => {
                const value = row.key(f)
                return (
                  <td
                    key={f.id}
                    className={`py-3 px-4 text-center text-sm border-l border-gray-100 ${row.highlight ? 'font-bold text-gray-900' : 'text-gray-600'}`}
                  >
                    {typeof value === 'object' && value !== null ? value as React.ReactNode : String(value)}
                  </td>
                )
              })}
            </tr>
          ))}

          {/* Highlights section */}
          <tr className="bg-red-50">
            <td className="py-3 pl-4 pr-4 text-xs font-semibold text-red-700">Key Highlights</td>
            {franchiseList.map((f) => (
              <td key={f.id} className="py-3 px-4 border-l border-red-100 align-top">
                <ul className="space-y-1">
                  {f.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                      <CheckCircle2 size={11} className="text-green-500 shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>

          {/* CTA row */}
          <tr className="bg-gray-900">
            <td className="py-4 pl-4 pr-4 text-xs font-semibold text-gray-400">Actions</td>
            {franchiseList.map((f) => (
              <td key={f.id} className="py-4 px-4 border-l border-gray-700 text-center">
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/directory/${f.id}`}
                    className="block bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                  >
                    View Profile
                  </Link>
                  <a
                    href={`mailto:${f.email}?subject=Franchise Inquiry — ${f.name}`}
                    className="block border border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 text-xs font-semibold py-2 rounded-lg transition-colors"
                  >
                    Request Info
                  </a>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function CompareContent() {
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',').slice(0, 3) ?? []
  const franchiseList = ids.map((id) => getFranchiseById(id)).filter(Boolean) as Franchise[]

  if (franchiseList.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-5xl mb-4">📊</div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Compare Franchises</h1>
          <p className="text-gray-500 text-sm mb-6">
            Select 2 or 3 franchises from the directory to compare them side by side on key financial metrics and terms.
          </p>
          <Link href="/directory" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold inline-block">
            Go to Directory →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/directory" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Directory
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
            Franchise Comparison
          </h1>
          <p className="text-gray-400 text-sm">
            Comparing {franchiseList.length} Ontario franchise opportunities side by side
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <CompareTable franchiseList={franchiseList} />
        </div>

        {/* Arthur Wishart Note */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          <strong>⚖️ Ontario Buyer Protection:</strong> All franchises listed are subject to Ontario's Arthur Wishart Act (Franchise Disclosure), 2000. Franchisors must provide a Franchise Disclosure Document (FDD) at least 14 days before signing. Always engage an Ontario franchise lawyer before signing any agreement.{' '}
          <Link href="/resources#arthur-wishart" className="underline font-medium">Learn more →</Link>
        </div>

        {/* Back CTA */}
        <div className="mt-6 text-center">
          <Link href="/directory" className="text-sm text-red-600 hover:underline font-medium">
            ← Add or change franchises to compare
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">📊</div>
          <p className="text-gray-500">Loading comparison...</p>
        </div>
      </div>
    }>
      <CompareContent />
    </Suspense>
  )
}

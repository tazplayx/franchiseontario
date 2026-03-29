import type { Metadata } from 'next'
import Link from 'next/link'
import { XCircle, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Payment Cancelled — FranchiseOntario.com',
  robots: { index: false, follow: false },
}

export default function RegisterCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-10 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <XCircle size={32} className="text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          No charge was made. Your listing has not been submitted yet. You can return to the
          registration form and try again whenever you&apos;re ready.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/register"
            className="btn-red py-3 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} /> Return to Registration
          </Link>
          <Link
            href="/pricing"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Review Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  )
}

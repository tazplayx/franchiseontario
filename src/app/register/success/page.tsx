'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight, Clock, Mail, LayoutDashboard } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') ?? 'paid'
  const isFree = plan === 'basic'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">

        {/* Success card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10 text-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {isFree ? 'Account Created!' : 'Payment Confirmed!'}
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            {isFree
              ? 'Your account has been created and your email verified. Your free listing has been submitted for review and will go live within 24 hours.'
              : 'Your franchise listing has been submitted and your subscription is now active. Our team will review and publish your listing within 4–24 hours.'}
          </p>

          {/* What happens next */}
          <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">What happens next</p>

            {[
              {
                icon: <Mail size={16} className="text-red-500" />,
                title: 'Confirmation email sent',
                desc: isFree
                  ? 'Check your inbox — your listing details are on the way.'
                  : 'Check your inbox — your receipt and listing details are on the way.',
              },
              {
                icon: <Clock size={16} className="text-amber-500" />,
                title: 'Listing under review',
                desc: 'Our team reviews every listing for accuracy and quality before publishing.',
              },
              {
                icon: <CheckCircle size={16} className="text-green-500" />,
                title: isFree ? 'Goes live within 24 hours' : 'Goes live within 4–24 hours',
                desc: isFree
                  ? 'Basic listings are reviewed during business hours.'
                  : 'Premium & Enterprise listings are expedited — typically live in under 4 hours.',
              },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{step.icon}</div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{step.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Ontario legal note */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left mb-8">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>📋 Important:</strong> As a franchisor listed in Ontario, you are required to provide a
              Franchise Disclosure Document (FDD) to all prospective buyers at least 14 days before
              signing any agreement — per the <em>Arthur Wishart Act (Franchise Disclosure), 2000</em>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="btn-red flex-1 py-3 rounded-xl text-sm font-semibold text-center inline-flex items-center justify-center gap-2"
            >
              <LayoutDashboard size={15} /> Go to Your Dashboard
            </Link>
            <Link
              href="/directory"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold text-center transition-colors inline-flex items-center justify-center gap-2"
            >
              View Directory <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Tax receipt note — only for paid */}
        {!isFree && (
          <p className="text-center text-xs text-gray-400 leading-relaxed">
            A payment receipt including applicable HST/GST has been emailed to you from Stripe.
            You can manage your subscription, download invoices, or update your payment method at any time
            from your account dashboard.
          </p>
        )}
      </div>
    </div>
  )
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

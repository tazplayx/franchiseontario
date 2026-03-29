import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Clock, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Registration Complete — FranchiseOntario.com',
  description: 'Your franchise listing has been submitted and payment confirmed.',
  robots: { index: false, follow: false },
}

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">

        {/* Success card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10 text-center mb-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Confirmed!
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            Your franchise listing has been submitted and your subscription is now active.
            Our team will review and publish your listing within <strong>4–24 hours</strong>.
          </p>

          {/* What happens next */}
          <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">What happens next</p>

            {[
              {
                icon: <Mail size={16} className="text-red-500" />,
                title: 'Confirmation email sent',
                desc: 'Check your inbox — your receipt and listing details are on the way.',
              },
              {
                icon: <Clock size={16} className="text-amber-500" />,
                title: 'Listing under review',
                desc: 'Our team reviews every listing for accuracy and quality before publishing.',
              },
              {
                icon: <CheckCircle size={16} className="text-green-500" />,
                title: 'Goes live within 24 hours',
                desc: 'Premium & Enterprise listings are expedited — typically live in under 4 hours.',
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
              href="/directory"
              className="btn-red flex-1 py-3 rounded-xl text-sm font-semibold text-center inline-flex items-center justify-center gap-2"
            >
              View the Directory <ArrowRight size={14} />
            </Link>
            <Link
              href="/"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold text-center transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
        </div>

        {/* Tax receipt note */}
        <p className="text-center text-xs text-gray-400 leading-relaxed">
          A payment receipt including applicable HST/GST has been emailed to you from Stripe.
          You can manage your subscription, download invoices, or update your payment method at any time
          from your account dashboard.
        </p>
      </div>
    </div>
  )
}

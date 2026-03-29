'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

const categories = [
  'Listing Issue',
  'Billing & Payments',
  'Account Access',
  'Inaccurate Information',
  'Technical Problem',
  'Upgrade / Downgrade Plan',
  'Homepage Feature Request',
  'General Enquiry',
]

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Build mailto to admin — email not exposed in UI
    const body = `Support Ticket\n\nName: ${form.name}\nEmail: ${form.email}\nCategory: ${form.category}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`
    const mailto = `mailto:cdeneire@proton.me?subject=[FranchiseOntario Support] ${encodeURIComponent(form.category + ': ' + form.subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-12 max-w-md w-full text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Ticket Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Your support request has been received. Our team will follow up with you at <strong>{form.email}</strong> within one business day.
          </p>
          <div className="space-y-3">
            <Link href="/" className="btn-red block text-center py-3 rounded-xl font-bold text-sm">
              Back to Homepage
            </Link>
            <Link href="/faq" className="block text-center text-sm text-gray-500 hover:text-red-600 transition-colors">
              Browse our FAQ →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 text-center">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-4xl mb-3">🎫</div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Submit a Support Ticket</h1>
          <p className="text-gray-500 text-sm">
            We respond to all tickets within one business day. Before submitting, you may find a quick answer in our{' '}
            <Link href="/faq" className="text-red-600 hover:text-red-700 underline">FAQ page</Link>.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name *</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ticket Category *</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject *</label>
            <input
              required
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Brief summary of your issue"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Please describe your issue or question in detail..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 transition-colors resize-none"
            />
          </div>

          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <span className="text-blue-500 mt-0.5 shrink-0">ℹ️</span>
            <p className="text-xs text-blue-700 leading-relaxed">
              Your ticket will be reviewed by our team and you'll receive a reply to your email within one business day. For urgent account issues, please indicate this in your message.
            </p>
          </div>

          <button type="submit" className="btn-red w-full py-3.5 rounded-xl font-bold text-sm">
            Submit Ticket →
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Looking for quick answers?{' '}
            <Link href="/faq" className="text-red-600 hover:underline">Visit our FAQ page →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

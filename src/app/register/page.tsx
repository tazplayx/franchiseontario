'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Check, Crown, Zap, ArrowRight } from 'lucide-react'

type Step = 'plan' | 'details' | 'confirm'

const planOptions = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    icon: '🏷️',
    features: ['Basic listing', 'Category included', 'Contact info'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$79/mo',
    icon: '⚡',
    features: ['Priority placement', 'Photo gallery', 'Analytics'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199/mo',
    icon: '👑',
    features: ['VIP gold badge', 'Top placement', 'Account manager'],
  },
]

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('plan')
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [addFeature, setAddFeature] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">You're Registered!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your franchise listing has been submitted for review. We'll have it live within 24 hours and will email you a confirmation.
          </p>
          <Link href="/" className="btn-red block text-center py-3 rounded-xl font-bold text-sm">
            Back to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 py-12 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
            List Your Franchise on FranchiseOntario.com
          </h1>
          <p className="text-gray-400 text-sm">
            Get discovered by thousands of active franchise investors in Ontario
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {(['plan', 'details', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s
                    ? 'bg-red-600 text-white'
                    : i < ['plan', 'details', 'confirm'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i < ['plan', 'details', 'confirm'].indexOf(step) ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
              {i < 2 && <div className="w-8 h-px bg-gray-200 hidden sm:block" />}
            </div>
          ))}
        </div>

        {/* Step 1: Plan */}
        {step === 'plan' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 text-center mb-2">Choose Your Plan</h2>
            <p className="text-sm text-gray-500 text-center mb-6">You can always upgrade later</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {planOptions.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                    selectedPlan === plan.id
                      ? 'border-red-600 bg-red-50 shadow-lg shadow-red-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 right-4">
                      <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">POPULAR</span>
                    </div>
                  )}
                  {selectedPlan === plan.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                  <div className="text-2xl mb-2">{plan.icon}</div>
                  <div className="font-black text-gray-900 mb-0.5">{plan.name}</div>
                  <div className="text-lg font-black text-red-600 mb-3">{plan.price}</div>
                  <ul className="space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <span className="text-green-500">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {/* Featured add-on */}
            <div
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all mb-8 ${
                addFeature ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-300'
              }`}
              onClick={() => setAddFeature(!addFeature)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${addFeature ? 'bg-amber-400 border-amber-400' : 'border-gray-300'}`}>
                    {addFeature && <Check size={12} className="text-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">⭐ Homepage Feature Spotlight</span>
                      <span className="vip-badge text-[9px] px-1.5 py-0.5 rounded-full">ADD-ON</span>
                    </div>
                    <p className="text-xs text-gray-500">Rotating weekly homepage feature — maximum visibility</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-gray-900">$14.99</div>
                  <div className="text-xs text-gray-400">/week</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('details')}
              className="btn-red w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              Continue to Details <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Franchise Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Franchise Name *</label>
                <input type="text" placeholder="e.g. My Franchise Brand" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400">
                  <option value="">Select a category</option>
                  {['Bar & Grill', 'Coffee & Café', 'Fast Food', 'Pizza', 'Fitness & Wellness', 'Retail', 'Home Services', 'Automotive', 'Education', 'Beauty & Salon', 'Pet Services'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contact Name *</label>
                <input type="text" placeholder="Your full name" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Business Email *</label>
                <input type="email" placeholder="you@franchise.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Website</label>
                <input type="url" placeholder="https://yourfranchise.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year Established</label>
                <input type="number" placeholder="e.g. 2010" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ontario Locations</label>
                <input type="number" placeholder="e.g. 12" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Franchise Description *</label>
              <textarea rows={4} placeholder="Describe your franchise opportunity, brand story, and what makes you unique..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('plan')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-all">
                ← Back
              </button>
              <button onClick={() => setStep('confirm')} className="flex-[2] btn-red py-3 rounded-xl font-bold text-sm">
                Review & Submit →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-2">Review Your Order</h2>
            <p className="text-sm text-gray-500 mb-6">Confirm your listing details before going live</p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Listing Plan</span>
                <span className="font-semibold capitalize text-gray-900">{selectedPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Fee</span>
                <span className="font-semibold text-gray-900">
                  {selectedPlan === 'basic' ? 'Free' : selectedPlan === 'premium' ? '$79.00/mo' : '$199.00/mo'}
                </span>
              </div>
              {addFeature && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Homepage Feature Spotlight</span>
                  <span className="font-semibold text-gray-900">$14.99/wk</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>Total Today</span>
                <span className="text-red-600">
                  {selectedPlan === 'basic' && !addFeature
                    ? 'Free'
                    : `$${(selectedPlan === 'premium' ? 79 : selectedPlan === 'enterprise' ? 199 : 0) + (addFeature ? 14.99 : 0)}/mo${addFeature ? ' + $14.99/wk' : ''}`}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 mb-6 p-3 bg-green-50 rounded-xl border border-green-100">
              <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
              <p className="text-xs text-green-700">
                Your listing will be reviewed and live within <strong>24 hours</strong>. You'll receive a confirmation email with next steps.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('details')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm">
                ← Back
              </button>
              <button
                onClick={() => setSubmitted(true)}
                className="flex-[2] btn-red py-3 rounded-xl font-bold text-sm"
              >
                Submit Listing →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

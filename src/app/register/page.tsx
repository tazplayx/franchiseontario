'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Check, ArrowRight, Loader2, Upload, X, ImagePlus, Video, Image as ImageIcon, Mail, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { sendEmail } from '@/lib/email'
import { registerAccount, getAccountByEmail, setSession } from '@/lib/leads'
import { savePendingListing } from '@/lib/store'

type Step = 'plan' | 'details' | 'verify' | 'confirm'

interface FormData {
  franchiseName: string
  contactName: string
  title: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  website: string
  category: string
  established: string
  locations: string
  description: string
  videoUrl: string
  logoPreview: string        // base64 data URL
  logoFile: File | null
  galleryPreviews: string[]  // base64 data URLs
  galleryFiles: File[]
}

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

const MAX_GALLERY = 6

// ── Email Verification Step ────────────────────────────────────────────────────
function VerifyStep({
  email,
  isVerified,
  verifySent,
  verifyLoading,
  devVerifyUrl,
  onResend,
  onVerified,
  onBack,
}: {
  email: string
  isVerified: boolean
  verifySent: boolean
  verifyLoading: boolean
  devVerifyUrl?: string | null
  onResend: () => void
  onVerified: () => void
  onBack: () => void
}) {
  // Poll localStorage every 2s — auto-advance once user clicks link in another tab
  useEffect(() => {
    if (isVerified) { onVerified(); return }
    const interval = setInterval(() => {
      const verified = typeof window !== 'undefined'
        ? localStorage.getItem(`fo_email_verified_${email}`) === 'true'
        : false
      if (verified) { clearInterval(interval); onVerified() }
    }, 2000)
    return () => clearInterval(interval)
  }, [email, isVerified, onVerified])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Mail size={28} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-black text-gray-900 mb-2">Check Your Inbox</h2>
      <p className="text-sm text-gray-500 mb-1">
        We&apos;ve sent a verification link to
      </p>
      <p className="text-sm font-bold text-gray-800 mb-6">{email}</p>
      <p className="text-xs text-gray-400 mb-8 max-w-xs mx-auto">
        Click the link in the email to verify your address, then this page will automatically advance to checkout.
      </p>

      {/* Spinner while waiting */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-8">
        <Loader2 size={14} className="animate-spin" />
        Waiting for verification…
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-all"
        >
          ← Back
        </button>
        <button
          disabled={verifyLoading}
          onClick={onResend}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
        >
          {verifyLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          {verifySent ? 'Resend Email' : 'Send Again'}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-5">
        Can&apos;t find it? Check your spam folder. Link expires in 24 hours.
      </p>

      {/* Dev/fallback: when email service isn't configured, show direct verify link */}
      {devVerifyUrl && (
        <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
          <p className="text-xs font-bold text-amber-800 mb-1">Email delivery not configured</p>
          <p className="text-xs text-amber-700 mb-2">Click the link below to verify your email address manually:</p>
          <a
            href={devVerifyUrl}
            className="text-xs text-red-600 underline break-all font-medium"
          >
            Verify my email →
          </a>
        </div>
      )}
    </div>
  )
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('plan')
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [addFeature, setAddFeature] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifySent, setVerifySent] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [duplicateEmailError, setDuplicateEmailError] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    franchiseName: '', contactName: '', title: '', email: '', phone: '',
    password: '', confirmPassword: '',
    website: '', category: '', established: '', locations: '',
    description: '', videoUrl: '', logoPreview: '', logoFile: null,
    galleryPreviews: [], galleryFiles: [],
  })

  const logoInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Check if email is already verified in localStorage whenever email changes
  useEffect(() => {
    if (!formData.email) { setIsEmailVerified(false); return }
    const verified = typeof window !== 'undefined'
      ? localStorage.getItem(`fo_email_verified_${formData.email}`) === 'true'
      : false
    setIsEmailVerified(verified)
    setDuplicateEmailError(false)
  }, [formData.email])

  const [devVerifyUrl, setDevVerifyUrl] = useState<string | null>(null)

  const sendVerificationEmail = async () => {
    if (!formData.email) return
    setVerifyLoading(true)
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.email,
          type: 'verify-email',
          data: { contactName: formData.contactName, franchiseName: formData.franchiseName },
        }),
      })
      const json = await res.json()
      // Dev mode: Resend not configured — show a direct verify link in the UI
      if (json.devMode && json.verifyUrl) {
        setDevVerifyUrl(json.verifyUrl)
      }
      setVerifySent(true)
    } finally {
      setVerifyLoading(false)
    }
  }

  // ── File handlers ──────────────────────────────────────────────────────────
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: reader.result as string,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const remaining = MAX_GALLERY - formData.galleryPreviews.length
    const toAdd = files.slice(0, remaining)
    toAdd.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          galleryFiles: [...prev.galleryFiles, file],
          galleryPreviews: [...prev.galleryPreviews, reader.result as string],
        }))
      }
      reader.readAsDataURL(file)
    })
    // reset so the same file can be re-added if removed
    e.target.value = ''
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryFiles: prev.galleryFiles.filter((_, i) => i !== index),
      galleryPreviews: prev.galleryPreviews.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
            List Your Franchise on FranchiseOntario.com
          </h1>
          <p className="text-gray-500 text-sm">
            Get discovered by thousands of active franchise investors across Ontario and Canada
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Step indicator */}
        {(() => {
          const steps: Step[] = ['plan', 'details', 'verify', 'confirm']
          const stepLabels: Record<Step, string> = { plan: 'Plan', details: 'Details', verify: 'Verify', confirm: 'Confirm' }
          const currentIdx = steps.indexOf(step)
          return (
            <div className="flex items-center justify-center gap-2 mb-10">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step === s
                        ? 'bg-red-600 text-white'
                        : i < currentIdx
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {i < currentIdx ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>
                    {stepLabels[s]}
                  </span>
                  {i < steps.length - 1 && <div className="w-8 h-px bg-gray-200 hidden sm:block" />}
                </div>
              ))}
            </div>
          )
        })()}

        {/* ── Step 1: Plan ─────────────────────────────────────────────────── */}
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

        {/* ── Step 2: Details ───────────────────────────────────────────────── */}
        {step === 'details' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
            <h2 className="text-xl font-black text-gray-900">Franchise Details</h2>

            {/* Basic info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Franchise Name *</label>
                <input type="text" required value={formData.franchiseName} onChange={(e) => setFormData({ ...formData, franchiseName: e.target.value })} placeholder="e.g. My Franchise Brand" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category *</label>
                <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 bg-white">
                  <option value="">Select a category</option>
                  {['Bar & Grill', 'Coffee & Café', 'Fast Food', 'Pizza', 'Fitness & Wellness', 'Retail', 'Home Services', 'Automotive', 'Education', 'Beauty & Salon', 'Pet Services'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contact Name *</label>
                <input type="text" required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} placeholder="Your full name" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Title / Role</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Franchise Owner, VP Franchise Development" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Business Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@franchise.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Create a password" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm outline-none focus:border-red-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Repeat your password" className={`w-full border rounded-xl px-3 py-2.5 pr-10 text-sm outline-none focus:border-red-400 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Website</label>
                <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://yourfranchise.com" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year Established</label>
                <input type="number" value={formData.established} onChange={(e) => setFormData({ ...formData, established: e.target.value })} placeholder="e.g. 2010" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ontario Locations</label>
                <input type="number" value={formData.locations} onChange={(e) => setFormData({ ...formData, locations: e.target.value })} placeholder="e.g. 12" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Franchise Description *</label>
              <textarea rows={4} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your franchise opportunity, brand story, and what makes you unique..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none" />
            </div>

            {/* ── Logo Upload ─────────────────────────────────────────────── */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Franchise Logo <span className="text-gray-400 font-normal">(PNG or JPG — used as your listing thumbnail)</span>
              </label>
              <div className="flex items-center gap-4">
                {/* Preview circle */}
                <div
                  className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 bg-gray-50 cursor-pointer hover:border-red-300 transition-colors"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {formData.logoPreview ? (
                    <img src={formData.logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-300">
                      <ImageIcon size={22} />
                      <span className="text-[9px] font-semibold">LOGO</span>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={14} />
                    {formData.logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  {formData.logoPreview && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoPreview: '', logoFile: null })}
                      className="ml-2 text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1.5">Square image recommended · Max 5MB · PNG or JPG</p>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
            </div>

            {/* ── Photo Gallery ────────────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600">
                  Photo Gallery <span className="text-gray-400 font-normal">(up to {MAX_GALLERY} photos — shown on your listing page)</span>
                </label>
                <span className="text-xs text-gray-400">{formData.galleryPreviews.length}/{MAX_GALLERY}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {formData.galleryPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
                {formData.galleryPreviews.length < MAX_GALLERY && (
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-red-300 hover:text-red-300 transition-colors"
                  >
                    <ImagePlus size={18} />
                    <span className="text-[9px] font-semibold">ADD</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Upload interior/exterior photos, food, signage, or team shots · PNG or JPG · Max 5MB each
              </p>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
                onChange={handleGalleryChange}
              />
            </div>

            {/* ── Video URL ────────────────────────────────────────────────── */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <Video size={13} className="text-gray-400" />
                Video URL <span className="text-gray-400 font-normal">(optional — YouTube or Vimeo)</span>
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Add a franchise overview or promo video — embedded on your listing page
              </p>
            </div>

            {/* Duplicate email error */}
            {duplicateEmailError && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-900 mb-1">An account already exists with this email</p>
                <p className="text-xs text-amber-700 mb-2">
                  Try a different email address, or{' '}
                  <Link href="/dashboard" className="underline font-semibold text-red-600 hover:text-red-700">
                    sign in to your existing account →
                  </Link>
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep('plan')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-all">
                ← Back
              </button>
              <button
                onClick={() => {
                  if (!formData.franchiseName || !formData.email || !formData.contactName) {
                    alert('Please fill in Franchise Name, Contact Name, and Business Email.')
                    return
                  }
                  if (!formData.password) {
                    alert('Please create a password for your account.')
                    return
                  }
                  if (formData.password !== formData.confirmPassword) {
                    alert('Passwords do not match.')
                    return
                  }
                  // Always check for duplicate email — regardless of verification status
                  const existing = getAccountByEmail(formData.email)
                  if (existing) {
                    setDuplicateEmailError(true)
                    return
                  }
                  setDuplicateEmailError(false)
                  if (isEmailVerified) {
                    setStep('confirm')
                  } else {
                    // Save draft so verify-email page can create the account after verification
                    const franchiseId = formData.franchiseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    const draftPlan = selectedPlan as 'basic' | 'premium' | 'enterprise'
                    localStorage.setItem('fo_reg_draft', JSON.stringify({
                      franchiseId,
                      franchiseName: formData.franchiseName,
                      name: formData.contactName,
                      email: formData.email,
                      title: formData.title || 'Franchise Owner',
                      tier: draftPlan,
                      password: formData.password,
                      // Extra form data for rich pending listing
                      category: formData.category,
                      phone: formData.phone,
                      website: formData.website,
                      description: formData.description,
                      locations: formData.locations,
                      established: formData.established,
                      logoPreview: formData.logoPreview,
                      galleryPreviews: formData.galleryPreviews,
                      videoUrl: formData.videoUrl,
                    }))
                    sendVerificationEmail()
                    setStep('verify')
                  }
                }}
                className="flex-[2] btn-red py-3 rounded-xl font-bold text-sm"
              >
                Review & Pay →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Verify Email ───────────────────────────────────────────── */}
        {step === 'verify' && (
          <VerifyStep
            email={formData.email}
            isVerified={isEmailVerified}
            verifySent={verifySent}
            verifyLoading={verifyLoading}
            devVerifyUrl={devVerifyUrl}
            onResend={sendVerificationEmail}
            onVerified={() => setStep('confirm')}
            onBack={() => setStep('details')}
          />
        )}

        {/* ── Step 3: Confirm & Pay ─────────────────────────────────────────── */}
        {step === 'confirm' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-2">Review & Complete Payment</h2>
            <p className="text-sm text-gray-500 mb-6">You'll be redirected to Stripe's secure checkout to complete your payment.</p>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Franchise</span>
                <span className="font-semibold text-gray-900">{formData.franchiseName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Listing Plan</span>
                <span className="font-semibold capitalize text-gray-900">{selectedPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan Fee</span>
                <span className="font-semibold text-gray-900">
                  {selectedPlan === 'basic' ? 'Free' : selectedPlan === 'premium' ? '$79.00 CAD/mo' : '$199.00 CAD/mo'}
                </span>
              </div>
              {addFeature && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Homepage Feature Spotlight</span>
                  <span className="font-semibold text-gray-900">$14.99 CAD/wk</span>
                </div>
              )}
              {formData.logoPreview && (
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-500">Logo</span>
                  <div className="flex items-center gap-2">
                    <img src={formData.logoPreview} className="w-6 h-6 rounded object-cover" alt="Logo" />
                    <span className="text-xs text-green-600 font-semibold">✓ Uploaded</span>
                  </div>
                </div>
              )}
              {formData.galleryPreviews.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Gallery Photos</span>
                  <span className="text-xs text-green-600 font-semibold">✓ {formData.galleryPreviews.length} photo{formData.galleryPreviews.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              {formData.videoUrl && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Video</span>
                  <span className="text-xs text-green-600 font-semibold">✓ Added</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                <span>Plan Total</span>
                <span className="text-red-600">
                  {selectedPlan === 'basic' && !addFeature
                    ? 'Free'
                    : `$${(selectedPlan === 'premium' ? 79 : selectedPlan === 'enterprise' ? 199 : 0) + (addFeature ? 14.99 : 0)} CAD`}
                </span>
              </div>
            </div>

            {/* Tax note */}
            <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700">
              <span className="shrink-0 mt-0.5">🧾</span>
              <p>
                Applicable HST/GST will be calculated and shown at checkout based on your billing address.
                Your tax receipt will be emailed automatically by Stripe.
              </p>
            </div>

            {/* Basic plan (free) note */}
            {selectedPlan === 'basic' && !addFeature && (
              <div className="flex items-start gap-2 mb-5 p-3 bg-green-50 rounded-xl border border-green-100">
                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                <p className="text-xs text-green-700">
                  Basic listings are free — no credit card required. Your listing will be submitted for review and go live within <strong>24 hours</strong>.
                </p>
              </div>
            )}

            {/* Stripe security badge */}
            {selectedPlan !== 'basic' && (
              <div className="flex items-center gap-2 mb-5 text-xs text-gray-400">
                <svg viewBox="0 0 60 25" fill="none" className="h-5 opacity-50" xmlns="http://www.w3.org/2000/svg" aria-label="Stripe">
                  <path d="M5.45 10.22c0-.96.79-1.33 2.09-1.33 1.87 0 4.23.57 6.1 1.58V5.26C11.67 4.48 9.74 4 7.54 4 3.14 4 0 6.26 0 10.45c0 6.6 9.09 5.55 9.09 8.4 0 1.14-.99 1.5-2.37 1.5C4.81 20.35 2.2 19.6 0 18.4v5.28C2.37 24.59 4.77 25 7.19 25c4.51 0 7.61-2.23 7.61-6.47-.03-7.13-9.35-5.87-9.35-8.31zm16.63-8.47L17.9 2.72 14.22 3.5v3.22l3.68-.79V22.5h4.18V1.75zm8.18 5.82c-1.14 0-1.87.5-2.34 1.33l-.15-1.18h-3.72V24h4.3v-9.17c.54-.73 1.45-1.18 2.53-1.18.38 0 .73.05 1.07.12V7.72c-.38-.1-.92-.15-1.69-.15zm8.55-.2c-4.55 0-7.22 3.4-7.22 7.47 0 4.93 2.79 7.46 7.46 7.46 2.14 0 3.77-.46 5.04-1.25v-3.8a8.38 8.38 0 01-4.5 1.31c-1.79 0-3.37-.62-3.58-2.78h9.03c.02-.26.05-.65.05-1 0-4.04-2.14-7.41-6.28-7.41zm-2.77 6c.15-1.87 1.27-2.67 2.75-2.67 1.42 0 2.47.84 2.55 2.67h-5.3zm18.1-5.8c-1.65 0-2.71.76-3.3 1.29l-.22-1.09h-3.71V30h4.3v-7.4c.59.44 1.45.84 2.6.84 2.64 0 5.04-2.1 5.04-6.98 0-4.47-2.42-6.49-4.71-6.49zm-.83 10.07c-.71 0-1.32-.25-1.68-.59V12.2c.4-.37.99-.62 1.68-.62 1.3 0 2.19 1.45 2.19 3.63s-.89 3.43-2.19 3.43z" fill="currentColor"/>
                </svg>
                <span>Payments processed securely by Stripe. PCI-DSS Level 1 certified. Your card is never stored on our servers.</span>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep('details')} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition-all">
                ← Back
              </button>

              {/* Free basic plan — submit directly */}
              {selectedPlan === 'basic' && !addFeature ? (
                <button
                  onClick={async () => {
                    const franchiseId = formData.franchiseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    // Create account if it doesn't already exist (may have been created at verify step)
                    let account = getAccountByEmail(formData.email)
                    if (!account) {
                      try {
                        account = registerAccount({
                          franchiseId,
                          franchiseName: formData.franchiseName,
                          name: formData.contactName,
                          email: formData.email,
                          title: formData.title || 'Franchise Owner',
                          tier: 'basic',
                          password: formData.password,
                        })
                      } catch { /* account may already exist */ }
                      account = getAccountByEmail(formData.email)
                    }
                    // Set session so header shows logged-in state
                    if (account) {
                      setSession({
                        franchiseId: account.franchiseId,
                        franchiseName: account.franchiseName,
                        email: account.email,
                        name: account.name,
                        tier: account.tier,
                      })
                      // Save to admin pending queue with full form data
                      savePendingListing({
                        id: account.franchiseId,
                        name: formData.franchiseName,
                        category: formData.category,
                        plan: 'Basic',
                        email: formData.email,
                        contactName: formData.contactName,
                        phone: formData.phone,
                        website: formData.website,
                        city: '',
                        description: formData.description,
                        locations: Number(formData.locations) || 0,
                        established: Number(formData.established) || new Date().getFullYear(),
                        logoUrl: formData.logoPreview,
                        mediaImages: formData.galleryPreviews,
                        videoUrl: formData.videoUrl,
                        submittedAt: new Date().toISOString(),
                        status: 'pending',
                      })
                    }
                    // Notify admin
                    await fetch('/api/email/send', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        to: 'info@franchiseontario.com',
                        type: 'welcome',
                        data: { franchiseName: formData.franchiseName, contactName: formData.contactName, plan: 'Basic (Free)' },
                      }),
                    }).catch(() => {})
                    window.location.href = '/register/success?plan=basic'
                  }}
                  className="flex-[2] btn-red py-3 rounded-xl font-bold text-sm"
                >
                  Submit Free Listing →
                </button>
              ) : (
                /* Paid plans — redirect to Stripe Checkout */
                <button
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true)
                    try {
                      const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          plan: selectedPlan,
                          addFeatureSpotlight: addFeature,
                          franchiseName: formData.franchiseName,
                          contactName: formData.contactName,
                          email: formData.email,
                        }),
                      })
                      const data = await res.json()
                      if (data.url) {
                        window.location.href = data.url
                      } else {
                        alert('Could not start checkout. Please try again.')
                        setLoading(false)
                      }
                    } catch {
                      alert('Network error. Please try again.')
                      setLoading(false)
                    }
                  }}
                  className="flex-[2] btn-red py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 size={15} className="animate-spin" /> Redirecting to Stripe…</>
                  ) : (
                    <>Proceed to Secure Checkout →</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

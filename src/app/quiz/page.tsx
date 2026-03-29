'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, ChevronRight, ChevronLeft, RotateCcw, Crown, Zap, Star } from 'lucide-react'
import { franchises } from '@/data/franchises'
import type { Franchise } from '@/data/franchises'

type Answers = {
  budget: string
  category: string
  involvement: string
  experience: string
  market: string
}

const steps = [
  {
    id: 'budget' as keyof Answers,
    question: "What's your total available investment budget?",
    subtitle: 'This includes franchise fee, build-out, working capital, and startup costs combined',
    options: [
      { value: 'under150', label: 'Under $150K', sub: 'Lower-investment & home-based concepts', icon: '🌱' },
      { value: '150to350', label: '$150K – $350K', sub: 'Growing mid-market opportunities', icon: '📈' },
      { value: '350to600', label: '$350K – $600K', sub: 'Established full-service brands', icon: '🏢' },
      { value: 'over600', label: '$600K+', sub: 'Premium flagship & multi-unit concepts', icon: '👑' },
    ],
  },
  {
    id: 'category' as keyof Answers,
    question: 'Which industry excites you most?',
    subtitle: 'Pick the sector that aligns with your passion, skills, and market knowledge',
    options: [
      { value: 'food', label: 'Food & Beverage', sub: 'Restaurants, cafés, bars, QSR', icon: '🍽️' },
      { value: 'services', label: 'Home & Business Services', sub: 'Cleaning, landscaping, repair', icon: '🔧' },
      { value: 'health', label: 'Health, Fitness & Wellness', sub: 'Gyms, clinics, beauty', icon: '💪' },
      { value: 'retail', label: 'Retail & Specialty', sub: 'Brick-and-mortar stores', icon: '🛍️' },
      { value: 'any', label: 'Open to Anything', sub: 'Show me all the best options', icon: '🌟' },
    ],
  },
  {
    id: 'involvement' as keyof Answers,
    question: 'How hands-on do you want to be?',
    subtitle: 'Your involvement level shapes which franchise models work best for you',
    options: [
      { value: 'active', label: 'Full-Time Owner-Operator', sub: 'On-site daily, running the business myself', icon: '🙋' },
      { value: 'semi', label: 'Semi-Active Owner', sub: 'Manager on-site — I oversee and check in', icon: '👔' },
      { value: 'passive', label: 'Investment-Focused', sub: 'Minimal day-to-day involvement', icon: '📊' },
    ],
  },
  {
    id: 'experience' as keyof Answers,
    question: "What's your business background?",
    subtitle: 'Franchisors look for different experience levels — be honest for the best match',
    options: [
      { value: 'first', label: 'First-Time Business Owner', sub: 'New to owning a business', icon: '🌱' },
      { value: 'some', label: 'Some Experience', sub: 'Managed teams or ran a small business', icon: '📋' },
      { value: 'veteran', label: 'Seasoned Operator', sub: '5+ years in business or franchising', icon: '🎖️' },
    ],
  },
  {
    id: 'market' as keyof Answers,
    question: 'Which Ontario market are you targeting?',
    subtitle: 'Territory availability and consumer demand vary significantly by region',
    options: [
      { value: 'gta', label: 'Toronto / GTA', sub: 'Toronto, Mississauga, Brampton, Markham, Oshawa', icon: '🏙️' },
      { value: 'ottawa', label: 'Ottawa / Eastern Ontario', sub: 'Ottawa, Kingston, Cornwall, Belleville', icon: '🏛️' },
      { value: 'southwest', label: 'Southwestern Ontario', sub: 'London, Windsor, Kitchener-Waterloo, Hamilton', icon: '🌾' },
      { value: 'central', label: 'Central & Northern Ontario', sub: 'Barrie, Sudbury, Thunder Bay, Sault Ste. Marie', icon: '🌲' },
      { value: 'any', label: 'Open to Any Region', sub: "I'll go where the best opportunity is", icon: '🗺️' },
    ],
  },
]

function scoreFranchises(answers: Answers): { franchise: Franchise; score: number; budgetMatch: boolean }[] {
  return franchises.map((f) => {
    let score = 0
    let budgetMatch = false

    // Budget scoring
    const min = f.financials.investmentMin
    const max = f.financials.investmentMax
    if (answers.budget === 'under150' && min < 150000) { score += 4; budgetMatch = true }
    else if (answers.budget === '150to350' && min >= 100000 && min <= 350000) { score += 4; budgetMatch = true }
    else if (answers.budget === '350to600' && min >= 250000 && max <= 700000) { score += 4; budgetMatch = true }
    else if (answers.budget === 'over600' && max >= 600000) { score += 4; budgetMatch = true }
    else if (answers.budget === '150to350' && min <= 400000) { score += 2; budgetMatch = true }
    else if (answers.budget === '350to600' && min <= 500000) { score += 2; budgetMatch = true }
    else { budgetMatch = min <= 800000 }

    // Category scoring
    const cat = f.category.toLowerCase()
    if (answers.category === 'food' && (cat.includes('bar') || cat.includes('coffee') || cat.includes('seafood') || cat.includes('food') || cat.includes('pizza'))) score += 3
    else if (answers.category === 'health' && (cat.includes('fitness') || cat.includes('beauty') || cat.includes('wellness'))) score += 3
    else if (answers.category === 'services' && (cat.includes('home') || cat.includes('auto') || cat.includes('pet') || cat.includes('financial'))) score += 3
    else if (answers.category === 'retail' && (cat.includes('retail') || cat.includes('real estate'))) score += 3
    else if (answers.category === 'any') score += 2

    // Involvement scoring (food franchises need active owners)
    if (answers.involvement === 'active') {
      if (cat.includes('bar') || cat.includes('seafood') || cat.includes('coffee')) score += 2
    }
    if (answers.involvement === 'semi') score += 1

    // Experience scoring
    if (answers.experience === 'veteran') score += 1
    if (answers.experience === 'some' && f.trainingWeeks >= 6) score += 1
    if (answers.experience === 'first' && f.trainingWeeks >= 8) score += 2

    // Market scoring (all 3 are Ontario-wide, so always add base score)
    score += 1

    // VIP/Enterprise bonus
    if (f.tier === 'enterprise') score += 1

    return { franchise: f, score, budgetMatch }
  }).sort((a, b) => b.score - a.score)
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500"
        style={{ width: `${((current + 1) / total) * 100}%` }}
      />
    </div>
  )
}

function ResultCard({ franchise, score, rank }: { franchise: Franchise; score: number; rank: number }) {
  const isTop = rank === 0
  const matchPct = Math.min(99, 70 + score * 3)

  return (
    <div className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${isTop ? 'border-amber-400 shadow-amber-100 shadow-lg' : 'border-gray-200'}`}>
      {isTop && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
      )}
      {isTop && (
        <div className="absolute top-3 right-3">
          <span className="bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            ⭐ Best Match
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-black shrink-0 shadow"
            style={{ background: franchise.logoBg, color: franchise.logoColor }}
          >
            {franchise.logoInitials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-snug mb-0.5">{franchise.name}</h3>
            <p className="text-xs text-gray-500 italic mb-1">{franchise.tagline}</p>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className={`w-3 h-3 ${i <= Math.round(franchise.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">{franchise.rating} ({franchise.reviews.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>

        {/* Match score bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-600">Fit Score</span>
            <span className={`text-xs font-black ${isTop ? 'text-amber-600' : 'text-green-600'}`}>{matchPct}% Match</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isTop ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-green-400 to-green-600'}`}
              style={{ width: `${matchPct}%` }}
            />
          </div>
        </div>

        {/* Key financials */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs font-bold text-gray-900">{franchise.financials.franchiseFee}</div>
            <div className="text-[10px] text-gray-400">Franchise Fee</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs font-bold text-gray-900">
              ${(franchise.financials.investmentMin/1000).toFixed(0)}K–${(franchise.financials.investmentMax/1000).toFixed(0)}K
            </div>
            <div className="text-[10px] text-gray-400">Total Investment</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs font-bold text-gray-900">{franchise.financials.royaltyRate}</div>
            <div className="text-[10px] text-gray-400">Royalty</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/directory/${franchise.id}`}
            className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-sm font-bold transition-colors"
          >
            View Full Profile
          </Link>
          <a
            href={`mailto:${franchise.email}?subject=Franchise Inquiry from FranchiseOntario.com Quiz — ${franchise.name}`}
            className="px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-red-300 text-sm font-semibold text-gray-600 hover:text-red-600 transition-all"
          >
            Request Info
          </a>
        </div>
      </div>
    </div>
  )
}

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const currentStep = steps[step]
  const results = done ? scoreFranchises(answers as Answers) : []

  function handleSelect(value: string) {
    setSelected(value)
  }

  function handleNext() {
    if (!selected) return
    const newAnswers = { ...answers, [currentStep.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)

    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1)
      setSelected(answers[steps[step - 1].id] ?? null)
    }
  }

  function handleReset() {
    setStep(0)
    setAnswers({})
    setSelected(null)
    setDone(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Results header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-4">
              <CheckCircle2 size={14} className="text-green-600" />
              <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Quiz Complete</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Your Franchise Matches
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Based on your answers, here are the Ontario franchise opportunities that best fit your profile. Results are ranked by compatibility.
            </p>
          </div>

          {/* Answer summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center shadow-sm">
            {steps.map((s) => {
              const ans = answers[s.id]
              const opt = s.options.find(o => o.value === ans)
              return (
                <div key={s.id} className="text-center">
                  <div className="text-xl mb-0.5">{opt?.icon}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">{s.id}</div>
                  <div className="text-xs font-semibold text-gray-800 truncate">{opt?.label}</div>
                </div>
              )
            })}
          </div>

          {/* Results */}
          <div className="space-y-4 mb-8">
            {results.map((r, i) => (
              <ResultCard key={r.franchise.id} franchise={r.franchise} score={r.score} rank={i} />
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <RotateCcw size={14} /> Retake Quiz
            </button>
            <Link
              href="/directory"
              className="flex items-center justify-center gap-2 btn-red px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Browse Full Directory <ChevronRight size={14} />
            </Link>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            Results shown are Ontario franchise opportunities listed on FranchiseOntario.com.{' '}
            <Link href="/resources" className="text-red-600 hover:underline">Read our buyer's guide →</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-4">
            <Star size={12} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Free — No Email Required</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Franchise Fit Quiz
          </h1>
          <p className="text-gray-500 text-sm">
            Step {step + 1} of {steps.length} — Answer honestly for the most accurate match
          </p>
        </div>

        {/* Progress bar */}
        <ProgressBar current={step} total={steps.length} />

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-1">{currentStep.question}</h2>
          <p className="text-sm text-gray-500 mb-6">{currentStep.subtitle}</p>

          <div className="space-y-3">
            {currentStep.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  selected === option.value
                    ? 'border-red-500 bg-red-50 shadow-sm'
                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl shrink-0">{option.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.sub}</div>
                </div>
                {selected === option.value && (
                  <CheckCircle2 size={20} className="text-red-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium disabled:opacity-30 hover:border-gray-300 transition-all shadow-sm"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selected}
            className="flex items-center gap-2 btn-red disabled:opacity-40 disabled:cursor-not-allowed px-8 py-2.5 rounded-xl text-sm font-semibold shadow-md"
          >
            {step === steps.length - 1 ? 'See My Matches' : 'Next'}
            <ChevronRight size={16} />
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Already know what you want?{' '}
          <Link href="/directory" className="text-red-600 hover:underline">Browse the full directory →</Link>
        </p>
      </div>
    </div>
  )
}

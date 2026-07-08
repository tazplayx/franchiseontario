'use client'
import { useEffect, useState } from 'react'
import { X, Download, CheckCircle } from 'lucide-react'

const SUPPRESS_KEY = 'fo_exit_intent_v1'
const SUPPRESS_DAYS = 7

export default function ExitIntentCapture() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  useEffect(() => {
    const suppressed = localStorage.getItem(SUPPRESS_KEY)
    if (suppressed && Date.now() - Number(suppressed) < SUPPRESS_DAYS * 86400000) return

    let timer: ReturnType<typeof setTimeout>
    // Fire after 45s idle
    const timeoutTrigger = () => { timer = setTimeout(() => setShow(true), 45000) }
    // Fire on exit intent (mouse leaves top of viewport)
    const exitTrigger = (e: MouseEvent) => {
      if (e.clientY <= 4) { clearTimeout(timer); setShow(true) }
    }

    timeoutTrigger()
    document.addEventListener('mouseleave', exitTrigger)
    return () => { clearTimeout(timer); document.removeEventListener('mouseleave', exitTrigger) }
  }, [])

  function dismiss() {
    setShow(false)
    localStorage.setItem(SUPPRESS_KEY, String(Date.now()))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'exit-intent' }),
    }).catch(() => {})
    setStatus('done')
    localStorage.setItem(SUPPRESS_KEY, String(Date.now()))
    setTimeout(dismiss, 3000)
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#fff' }}
      >
        {/* Top banner */}
        <div className="px-8 pt-8 pb-6 text-center" style={{ background: 'var(--rust-deep)' }}>
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-xl font-black text-white mb-1" style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif' }}>
            Free: Ontario Franchise Buyer's Checklist
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>
            20 must-ask questions before signing any franchise agreement in Ontario — covers the Arthur Wishart Act, FDD review, and territory rights.
          </p>
        </div>

        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="px-8 py-6">
          {status === 'done' ? (
            <div className="text-center py-4">
              <CheckCircle className="mx-auto mb-3 text-green-500" size={36} />
              <p className="font-bold text-gray-900">You're on the list!</p>
              <p className="text-sm text-gray-500 mt-1">We'll send your checklist + our weekly Ontario franchise newsletter.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 bg-gray-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
                style={{ background: 'var(--rust)' }}
              >
                <Download size={15} />
                {status === 'loading' ? 'Sending…' : 'Send me the checklist'}
              </button>
              <p className="text-center text-[11px] text-gray-400">
                No spam. Unsubscribe anytime. Also sends our free weekly Ontario franchise digest.
              </p>
            </form>
          )}
        </div>

        <div className="px-8 pb-6 flex flex-wrap justify-center gap-4 text-[11px] text-gray-400 border-t border-gray-100 pt-4">
          <span>✓ Arthur Wishart Act overview</span>
          <span>✓ FDD checklist</span>
          <span>✓ Territory rights guide</span>
        </div>
      </div>
    </div>
  )
}

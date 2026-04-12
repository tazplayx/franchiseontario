'use client'
import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-2 py-5 text-center">
        <CheckCircle size={28} className="text-green-400" />
        <p className="text-white font-semibold text-sm">Message sent!</p>
        <p className="text-gray-400 text-xs">We'll get back to you within 1–2 business days.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs text-red-400 hover:text-red-300 underline mt-1"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-3">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Your name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="bg-white border border-white/30 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-400 transition-colors"
        />
        <input
          type="email"
          placeholder="Email address *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="bg-white border border-white/30 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-400 transition-colors"
        />
      </div>
      <input
        type="text"
        placeholder="Subject (optional)"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        className="w-full bg-white border border-white/30 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-400 transition-colors"
      />
      <textarea
        rows={3}
        placeholder="Your message… *"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
        className="w-full bg-white border border-white/30 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-400 transition-colors resize-none"
      />
      {status === 'error' && (
        <div className="flex items-center gap-1.5 text-red-400 text-xs">
          <AlertCircle size={12} />
          Something went wrong — please try again.
        </div>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-xs transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? (
          <><Loader2 size={12} className="animate-spin" /> Sending…</>
        ) : (
          <><Send size={12} /> Send Message</>
        )}
      </button>
    </form>
  )
}

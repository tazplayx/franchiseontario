import type { Metadata } from 'next'
import Link from 'next/link'
import { AD_SLOTS, formatCad, monthlyVisitors } from '@/lib/ad-slots'

export const metadata: Metadata = {
  title: 'Advertise on FranchiseOntario.com',
  description: 'Reach Ontario franchise buyers. Book billboard placements on the homepage, directory, franchise profiles and insight articles.',
  alternates: { canonical: 'https://www.franchiseontario.com/advertise' },
}

export default function AdvertisePage() {
  const visitors = monthlyVisitors().toLocaleString('en-CA')
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">Advertise</p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4" style={{ fontFamily: 'Bricolage Grotesque, system-ui, sans-serif' }}>
            Reach people who are ready to buy a franchise
          </h1>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            FranchiseOntario.com is Ontario's franchise directory. Our visitors are researching, comparing and choosing
            franchises right now, which makes them among the most motivated buyers you can reach.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-2xl">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-2xl font-black text-gray-900">{visitors}+</p>
              <p className="text-xs text-gray-500 mt-1">visitors every month</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-2xl font-black text-gray-900">{AD_SLOTS.length}</p>
              <p className="text-xs text-gray-500 mt-1">billboard locations</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-2xl font-black text-gray-900">1–12 wks</p>
              <p className="text-xs text-gray-500 mt-1">flexible durations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-black text-gray-900 mb-6">Billboard locations</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {AD_SLOTS.map((slot) => (
            <div key={slot.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">{slot.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{slot.where}.</p>
                </div>
                <p className="text-right shrink-0">
                  <span className="block text-xl font-black text-gray-900">{formatCad(slot.weeklyCents)}</span>
                  <span className="text-[11px] text-gray-400">per week</span>
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{slot.description}</p>
              <p className="text-xs text-gray-500 mt-3">Shared by up to {slot.capacity} advertisers, rotating on every page view.</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gray-900 rounded-2xl p-7 text-white">
          <h3 className="font-bold text-lg mb-2">How it works</h3>
          <ol className="text-sm text-gray-300 space-y-2 list-decimal pl-5">
            <li>Create a free franchisor account (you can also use your existing listing account).</li>
            <li>Choose a location, duration and write your advertisement.</li>
            <li>Pay securely by card through Stripe. Taxes are calculated at checkout.</li>
            <li>Your advertisement goes live straight away and runs for the period you booked.</li>
          </ol>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/dashboard/login" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Sign in to book</Link>
            <Link href="/register" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Create an account</Link>
          </div>
          <p className="text-[11px] text-gray-400 mt-5">Advertising bookings are paid in full at checkout. Creative must comply with our advertising policy and Canadian advertising law.</p>
        </div>
      </section>
    </div>
  )
}

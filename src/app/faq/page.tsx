import Link from 'next/link'

const faqs = [
  {
    section: 'Getting Listed',
    items: [
      {
        q: 'How do I add my franchise to the directory?',
        a: 'Click "List Your Franchise" in the top navigation or visit the Pricing page. You can start with a free Basic listing — just fill out the registration form with your franchise details and submit for review. Basic listings are live within 24 hours of approval.',
      },
      {
        q: 'How long does it take for my listing to be approved?',
        a: 'Basic listings are reviewed and approved within 24 hours. Premium and Enterprise listings are prioritized and typically go live within 4 business hours. You\'ll receive an email confirmation at the address you registered with once your listing is approved.',
      },
      {
        q: 'What information do I need to submit a listing?',
        a: 'You\'ll need your franchise name, category, a business description, contact information, website, year established, and Ontario location count. Premium and Enterprise listings also include investment details, photo gallery, highlights, and franchise financials.',
      },
      {
        q: 'Can I update my listing after it goes live?',
        a: 'Yes. Paid (Premium and Enterprise) listings include access to a listing management dashboard where you can update text, photos, videos, financial details, and contact information at any time. Basic listings can be updated by submitting a support ticket.',
      },
    ],
  },
  {
    section: 'Plans & Pricing',
    items: [
      {
        q: 'What is the difference between Basic, Premium, and Enterprise?',
        a: 'Basic is free and includes a simple profile with contact info and category placement. Premium ($79/month) adds priority placement, a photo gallery, highlighted listing border, enquiry management, and analytics. Enterprise ($199/month) adds a gold VIP badge, top-of-directory placement, unlimited media, press release distribution, and a dedicated account manager.',
      },
      {
        q: 'What is the Homepage Feature Spotlight?',
        a: 'The Homepage Feature Spotlight ($14.99/week) places your franchise in the rotating "Featured This Week" section on the FranchiseOntario.com homepage — the highest-visibility position on the site. Spots rotate weekly among all active featured brands. This is available as an add-on to any plan.',
      },
      {
        q: 'Can I upgrade or cancel my plan at any time?',
        a: 'Yes. You can upgrade, downgrade, or cancel at any time from your account dashboard. Changes to your plan take effect at the next billing cycle. There are no cancellation fees or long-term contracts.',
      },
      {
        q: 'Are there any setup or hidden fees?',
        a: 'No. The prices listed on our Pricing page are all-inclusive. Basic is completely free. Paid plans are billed at the listed rate with no setup fees, no hidden costs, and no contracts.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All billing is processed securely through Stripe and is in Canadian dollars (CAD).',
      },
    ],
  },
  {
    section: 'For Franchise Investors',
    items: [
      {
        q: 'Are the financial figures on franchise profiles verified?',
        a: 'Financial figures shown on franchise profiles (investment ranges, royalty rates, average unit volumes) are provided by the franchise brands themselves or sourced from publicly available franchise disclosure documents. FranchiseOntario.com does not independently verify these figures. Always request and review the official Franchise Disclosure Document (FDD) and consult a qualified franchise lawyer before making any investment decision.',
      },
      {
        q: 'What is a Franchise Disclosure Document (FDD)?',
        a: 'A Franchise Disclosure Document (FDD) is a legally required document that franchisors in Ontario must provide to prospective buyers under the Arthur Wishart Act (Franchise Disclosure), 2000. It includes 23 items covering the franchisor\'s history, financial statements, fees, territory, training, and existing franchisee contacts. You must receive the FDD at least 14 days before signing any agreement or paying any money.',
      },
      {
        q: 'How do I contact a franchise listed in the directory?',
        a: 'Each franchise listing includes a contact section with a direct inquiry form, phone number, and website link. Enterprise and Premium listings include a dedicated franchise inquiry email. Clicking "Request Franchise Info" will open a pre-populated email inquiry to the franchise\'s franchising team.',
      },
      {
        q: 'Can I leave a review for a franchise?',
        a: 'Review functionality is coming soon. In the meantime, ratings shown on listings are sourced from aggregated third-party review platforms. Verified franchisee review submissions will be introduced in a future update.',
      },
    ],
  },
  {
    section: 'Technical & Account',
    items: [
      {
        q: 'How do I reset my account password?',
        a: 'On the Sign In page, click "Forgot Password" and enter your registered email address. You\'ll receive a password reset link within a few minutes. If you don\'t see the email, check your spam or junk folder.',
      },
      {
        q: 'I submitted my franchise listing but haven\'t heard back. What should I do?',
        a: 'If you haven\'t received a confirmation email within 24 hours of submitting, please check your spam folder first. If still no response, submit a support ticket through our Support page and our team will follow up within one business day.',
      },
      {
        q: 'How do I report inaccurate information on a listing?',
        a: 'Use the Support page to submit a report. Include the franchise name and what information appears to be inaccurate. Our team reviews all reports within 2 business days.',
      },
      {
        q: 'Is my personal and payment information secure?',
        a: 'Yes. All payments are processed through Stripe, a PCI-DSS Level 1 certified payment processor. We never store your credit card details on our servers. Account data is encrypted in transit and at rest.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 py-14 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-4xl mb-4">❓</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-sm">
            Everything you need to know about listing your franchise and using FranchiseOntario.com.
            Can't find your answer?{' '}
            <Link href="/support" className="text-red-400 hover:text-red-300 underline">
              Submit a support ticket
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Quick jump */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 flex flex-wrap gap-2 justify-center">
          {faqs.map((section) => (
            <a
              key={section.section}
              href={`#${section.section.replace(/\s+/g, '-').toLowerCase()}`}
              className="px-4 py-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-700 text-gray-600 text-sm font-medium rounded-full transition-all"
            >
              {section.section}
            </a>
          ))}
        </div>

        {/* FAQ sections */}
        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.section} id={section.section.replace(/\s+/g, '-').toLowerCase()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-7 rounded-full bg-red-600" />
                <h2 className="text-xl font-black text-gray-900">{section.section}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details key={item.q} className="group bg-white rounded-xl border border-gray-200 shadow-sm">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-sm text-gray-900 hover:text-red-600 transition-colors list-none">
                      <span>{item.q}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200 text-lg ml-4 shrink-0">▾</span>
                    </summary>
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-12 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-8 text-center text-white">
          <div className="text-3xl mb-3">💬</div>
          <h2 className="text-xl font-black mb-2">Still have a question?</h2>
          <p className="text-red-100 text-sm mb-5 max-w-md mx-auto">
            Our support team is here to help. Submit a ticket and we'll get back to you within one business day.
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors"
          >
            Submit a Support Ticket →
          </Link>
        </div>
      </div>
    </div>
  )
}

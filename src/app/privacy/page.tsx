import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — FranchiseOntario',
  description: 'Privacy Policy for FranchiseOntario.com — how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Legal</p>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Effective date: January 1, 2026 · Last updated: March 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. Introduction</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            FranchiseOntario.com ("we," "us," or "our") is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website at <strong>www.franchiseontario.com</strong> or use any of our services.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            By using our website, you consent to the practices described in this policy. If you do not agree with any part of this policy, please discontinue use of our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. Information We Collect</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">We may collect the following types of information:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Contact information</strong> — name, email address, and phone number when you use our contact form, register a listing, or subscribe to our newsletter.</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Business information</strong> — franchise name, location, category, and other details you provide when listing your franchise.</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Payment information</strong> — billing details processed securely by Stripe. We do not store credit card numbers on our servers.</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Usage data</strong> — IP address, browser type, pages visited, and time spent on pages, collected automatically via analytics tools.</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Session data</strong> — authentication state stored in your browser's session storage to keep you logged in during a visit.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">We use the information we collect to:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Publish and manage your franchise listing on our directory</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Process payments and manage your subscription via Stripe</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Respond to contact form submissions and support requests</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Send transactional emails related to your account or listing</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Send our newsletter if you have subscribed (you may unsubscribe at any time)</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Analyze usage patterns to improve the website and user experience</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Comply with applicable Canadian laws and regulations</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. Disclosure of Your Information</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following limited circumstances:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Service providers</strong> — trusted third parties who assist in operating our website (e.g., Stripe for payment processing, Resend for email delivery, Vercel for hosting). These parties are contractually bound to protect your information.</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Legal requirements</strong> — if required by law, court order, or governmental authority in Canada.</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Business transfers</strong> — in connection with a merger, acquisition, or sale of all or part of our assets, subject to confidentiality obligations.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. Cookies and Tracking</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We use browser session storage (not persistent cookies) to maintain your login session during a visit. We may also use analytics tools that set first-party cookies to understand site traffic. You can disable cookies in your browser settings, though some features of the site may not function correctly as a result.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. Data Security</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. Our website is served over HTTPS. Payment card data is handled entirely by Stripe, which maintains PCI DSS compliance. However, no transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. Data Retention</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We retain your personal information for as long as your account or listing is active, or as needed to provide services and comply with legal obligations. Contact form submissions are retained for up to 2 years. You may request deletion of your information at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. Your Rights (PIPEDA)</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Under Canada's <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable provincial privacy laws, you have the right to:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Access the personal information we hold about you</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Request correction of inaccurate or incomplete information</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Withdraw consent to the collection or use of your information (subject to legal or contractual restrictions)</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Request deletion of your personal information</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Lodge a complaint with the Office of the Privacy Commissioner of Canada</span></li>
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            To exercise any of these rights, please contact us at the address below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">9. Third-Party Links</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our website contains links to third-party websites, including franchise brand websites and news sources. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">10. Children's Privacy</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our website is not directed at children under the age of 18. We do not knowingly collect personal information from minors. If we become aware that we have inadvertently collected information from a child under 18, we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">11. Changes to This Policy</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of the website after any changes constitutes your acceptance of the revised policy. We encourage you to review this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">12. Contact Us</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            If you have questions or concerns about this Privacy Policy, or to exercise your privacy rights, please contact us:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-700 space-y-1">
            <p className="font-bold text-gray-900">FranchiseOntario.com</p>
            <p>Ontario, Canada</p>
            <p>Email: <a href="mailto:cdeneire@proton.me" className="text-red-600 hover:underline">cdeneire@proton.me</a></p>
            <p>Website: <a href="https://www.franchiseontario.com" className="text-red-600 hover:underline">www.franchiseontario.com</a></p>
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6 flex gap-4 text-sm">
          <Link href="/terms" className="text-red-600 hover:underline font-medium">Terms of Service →</Link>
          <Link href="/" className="text-gray-500 hover:text-gray-700">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — FranchiseOntario',
  description: 'Terms of Service for FranchiseOntario.com — the rules and conditions governing use of our franchise directory.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Legal</p>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Terms of Service</h1>
          <p className="text-sm text-gray-500">Effective date: January 1, 2026 · Last updated: March 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            By accessing or using <strong>FranchiseOntario.com</strong> ("the Site," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our website. These Terms apply to all visitors, users, franchisors, and other parties who access or use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. Description of Service</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            FranchiseOntario.com is an online franchise directory serving Ontario and Canada. We provide franchise listings, buyer resources, news, and related tools to connect franchise investors with franchise opportunities. We offer tiered listing plans (Basic, Premium, Enterprise) for franchisors who wish to advertise their brands on our platform.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            We are a directory service only. We are not a franchise broker, investment advisor, or party to any franchise agreement. All franchise decisions are made independently by buyers and franchisors.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. User Accounts and Registration</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">When registering a franchise listing, you agree to:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Provide accurate, current, and complete information about your franchise</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Maintain the accuracy of your listing and update information as needed</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Keep your login credentials confidential and not share them with third parties</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Notify us immediately of any unauthorized use of your account</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Be responsible for all activity that occurs under your account</span></li>
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            We reserve the right to suspend or terminate any account that violates these Terms or provides false information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. Listing Content and Franchisor Responsibilities</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">By submitting a franchise listing, you represent and warrant that:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>All information provided is truthful, accurate, and not misleading</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>You have the legal right to offer the franchise opportunity described</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Your listing complies with Ontario's <em>Arthur Wishart Act (Franchise Disclosure), 2000</em> and all applicable Canadian franchise laws</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Images, logos, and other media you upload are owned by you or you have proper rights/licenses to use them</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Your content does not infringe any third-party intellectual property rights</span></li>
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            We reserve the right to review, modify, reject, or remove any listing at our sole discretion, including listings that are inaccurate, misleading, offensive, or in violation of applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. Payments, Subscriptions, and Refunds</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Paid listing plans (Premium at $79/mo CAD, Enterprise at $199/mo CAD) are billed on a recurring monthly basis via Stripe. By subscribing to a paid plan, you authorize us to charge your payment method on a monthly basis until you cancel.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Cancellation:</strong> You may cancel your subscription at any time through the Stripe billing portal in your dashboard. Cancellation takes effect at the end of the current billing period.</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Refunds:</strong> Subscription fees are generally non-refundable. We may issue pro-rated refunds at our discretion in cases of technical failure or billing errors.</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Price changes:</strong> We reserve the right to change subscription prices with 30 days' notice to active subscribers.</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span><strong>Taxes:</strong> Applicable Canadian sales taxes (GST/HST) may be applied to your subscription based on your province of residence.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. Prohibited Uses</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">You agree not to use the Site to:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Post false, misleading, defamatory, or fraudulent content</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Violate any applicable federal, provincial, or local laws or regulations</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Infringe the intellectual property rights of any third party</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Transmit spam, unsolicited advertising, or any form of automated scraping</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Attempt to gain unauthorized access to any part of the Site or its systems</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Interfere with or disrupt the integrity or performance of the Site</span></li>
            <li className="flex gap-2"><span className="text-red-500 shrink-0 mt-0.5">•</span><span>Use the Site for any purpose that competes with our services without our prior written consent</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            All content on FranchiseOntario.com — including text, design, graphics, logos, icons, and code — is the property of FranchiseOntario.com or its content suppliers and is protected by Canadian and international copyright laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            By uploading content to your listing (logos, images, descriptions), you grant us a non-exclusive, royalty-free, worldwide licence to display, reproduce, and distribute that content solely for the purpose of operating and promoting the directory.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The Site and all content are provided on an "as is" and "as available" basis without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses. We do not verify or endorse any franchise listed on the Site and make no representations about the accuracy of franchise information, financial projections, or investment outcomes.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-3 font-medium text-gray-700">
            Nothing on this Site constitutes investment, financial, legal, or franchise advice. Always consult a qualified franchise lawyer and financial advisor before making any franchise investment decision.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To the fullest extent permitted by applicable law, FranchiseOntario.com and its owners, operators, and employees shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, loss of data, or business interruption — arising from your use of or inability to use the Site, even if we have been advised of the possibility of such damages.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            Our total liability to you for any claim arising from these Terms or use of the Site shall not exceed the amount you paid us in subscription fees in the three (3) months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">10. Governing Law and Jurisdiction</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. You agree to submit to the exclusive jurisdiction of the courts of Ontario, Canada, for any disputes arising from these Terms or use of the Site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">11. Changes to These Terms</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We may update these Terms from time to time. Updated Terms will be posted on this page with a revised effective date. Continued use of the Site after changes are posted constitutes your acceptance of the revised Terms. We will notify active subscribers of material changes by email.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">12. Contact Us</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            For questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-700 space-y-1">
            <p className="font-bold text-gray-900">FranchiseOntario.com</p>
            <p>Ontario, Canada</p>
            <p>Email: <a href="mailto:cdeneire@proton.me" className="text-red-600 hover:underline">cdeneire@proton.me</a></p>
            <p>Website: <a href="https://www.franchiseontario.com" className="text-red-600 hover:underline">www.franchiseontario.com</a></p>
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6 flex gap-4 text-sm">
          <Link href="/privacy" className="text-red-600 hover:underline font-medium">Privacy Policy →</Link>
          <Link href="/" className="text-gray-500 hover:text-gray-700">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

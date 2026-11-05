import Link from 'next/link';
import SafetyNotice from '@/components/SafetyNotice';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="amazon-link text-sm">← Back to Home</Link>
      <div className="panel p-6 md:p-8 mt-4">
        <div className="text-xs uppercase tracking-widest text-amazon-orange font-bold mb-2">Your choices, plainly stated</div>
        <h1 className="text-3xl md:text-4xl font-extrabold">Privacy Notice</h1>
        <p className="text-sm text-amazon-textMuted mt-2">Last updated: January 1, 2026 · We explain what we collect, why we use it, and how to control it.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {[
          ['What we collect', 'Account, order, device, and support information you choose to share.'],
          ['Why we use it', 'To fulfill orders, secure accounts, prevent fraud, and improve the store.'],
          ['Your controls', 'Review account data, manage ad preferences, or ask support a question.'],
        ].map(([title, body]) => (
          <div key={title} className="panel p-4">
            <h2 className="font-bold mb-1">{title}</h2>
            <p className="text-sm text-amazon-textMuted">{body}</p>
          </div>
        ))}
      </div>
      <div className="panel p-6 mt-4 space-y-5 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-2">Information we collect</h2>
          <p>We collect information you provide when you sign in, place an order, save an address or payment method, write a review, or contact customer service. We also receive basic device and activity information needed to keep the service reliable and secure.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">How we use information</h2>
          <p>We use information to process and deliver orders, show relevant products, prevent fraud and abuse, respond to support requests, and improve accessibility and performance. We do not ask sellers to collect your payment credentials.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Your choices</h2>
          <p>You can review or update account details, manage interest-based ad preferences, and contact support about access or deletion requests. Some information must be retained for security, legal, or order-record purposes.</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <Link href="/interest-based-ads" className="amazon-btn-dark !text-xs">Manage ad preferences</Link>
            <Link href="/help#contact" className="amazon-btn-primary !text-xs">Ask a privacy question</Link>
          </div>
        </section>
      </div>
      <div className="mt-4">
        <SafetyNotice title="Protect your privacy while shopping" href="/security" linkLabel="Open Security Center">
          halozon support will never ask for your password, one-time code, or full payment details by email or phone.
        </SafetyNotice>
      </div>
    </div>
  );
}

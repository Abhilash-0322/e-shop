import Link from 'next/link';
import SafetyNotice from '@/components/SafetyNotice';

export default function ConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="amazon-link text-sm">← Back to Home</Link>
      <div className="panel p-6 md:p-8 mt-4">
        <div className="text-xs uppercase tracking-widest text-amazon-orange font-bold mb-2">Clear expectations</div>
        <h1 className="text-3xl font-bold">Conditions of Use</h1>
        <p className="text-sm text-amazon-textMuted mt-2">Last updated: January 1, 2026</p>
      </div>
      <div className="panel p-6 mt-4 space-y-5 text-sm leading-relaxed">
        <p>Welcome to halozon.com. By using our site, you agree to these conditions, including our Privacy Notice and any other policies posted on this site.</p>
        <section><h2 className="text-xl font-bold mb-2">1. Eligibility</h2><p>You must be at least 18 years old to use this site and must provide accurate information for your account and orders.</p></section>
        <section><h2 className="text-xl font-bold mb-2">2. Account safety</h2><p>You are responsible for maintaining the confidentiality of your account and password. Notify us promptly if you suspect unauthorized access.</p></section>
        <section><h2 className="text-xl font-bold mb-2">3. Purchases and sellers</h2><p>All purchases are subject to availability, the stated delivery estimate, and our return policy. Sellers must follow marketplace rules; customers should keep payments and messages on halozon.</p></section>
        <section><h2 className="text-xl font-bold mb-2">4. Reviews and community content</h2><p>Reviews, questions, and answers should be accurate, relevant, and respectful. We may remove content that violates our guidelines or creates a safety risk.</p></section>
        <div className="flex flex-wrap gap-3"><Link href="/privacy" className="amazon-btn-dark !text-xs">Read Privacy Notice</Link><Link href="/help#report" className="amazon-btn-primary !text-xs">Report a concern</Link></div>
      </div>
      <div className="mt-4"><SafetyNotice title="Need help understanding a purchase?" href="/help#contact" linkLabel="Contact support">We can explain delivery, returns, payment, and account options before you take action.</SafetyNotice></div>
    </div>
  );
}

import Link from 'next/link';

export default function InterestBasedAds() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="amazon-link text-sm">← Back to Home</Link>
      <div className="panel p-6 md:p-8 mt-4">
        <div className="text-xs uppercase tracking-widest text-amazon-orange font-bold mb-2">Your controls</div>
        <h1 className="text-3xl font-bold">Interest-Based Ads</h1>
        <p className="text-sm text-amazon-textMuted mt-2">Last updated: January 1, 2026</p>
      </div>
      <div className="panel p-6 mt-4 space-y-5 text-sm leading-relaxed">
        <p>halozon displays interest-based advertising using information you make available to us when you interact with our sites and services. These signals can help us make recommendations and show ads that are more relevant to you.</p>
        <section>
          <h2 className="text-xl font-bold mb-2">What you can control</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use browser privacy controls to limit cookies and similar technologies.</li>
            <li>Sign in to keep account preferences consistent across your devices.</li>
            <li>Contact support if you have questions about access, correction, or deletion.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">What this does not change</h2>
          <p>Turning off interest-based ads does not remove necessary service messages, order updates, fraud prevention, or security alerts.</p>
        </section>
        <div className="flex flex-wrap gap-3">
          <Link href="/privacy" className="amazon-btn-dark !text-xs">Read Privacy Notice</Link>
          <Link href="/help#contact" className="amazon-btn-primary !text-xs">Contact privacy support</Link>
        </div>
      </div>
    </div>
  );
}

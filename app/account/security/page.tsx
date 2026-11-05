import {CheckCircle2, Lock, ShieldCheck} from '@/lib/icons';

export default function Security() {
  return (
    <div>
      <p className="eyebrow">Protection</p>
      <h1 className="page-title mt-2">Login & security</h1>
      <p className="mt-3 muted">Keep your identity, sessions, and shopping history protected.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <section className="surface p-7" aria-labelledby="password-hygiene">
          <Lock className="h-7 w-7 text-indigo-700" aria-hidden="true" />
          <h2 id="password-hygiene" className="mt-5 text-xl font-black">Password hygiene</h2>
          <p className="mt-2 leading-relaxed muted">Use a unique password and never share account credentials with another person.</p>
          <a href="/forgot-password" className="btn btn-soft mt-5">Change password</a>
        </section>
        <section className="surface p-7" aria-labelledby="session-protection">
          <ShieldCheck className="h-7 w-7 text-emerald-700" aria-hidden="true" />
          <h2 id="session-protection" className="mt-5 text-xl font-black">Session protection</h2>
          <p className="mt-2 leading-relaxed muted">Your authenticated session uses an HTTP-only cookie and expires automatically.</p>
          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Protected by default</div>
        </section>
      </div>
    </div>
  );
}

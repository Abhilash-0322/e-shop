import {CheckCircle2, Lock, ShieldCheck} from '@/lib/icons';
import {PageHeader} from '@/components/ui';

export default function Security() {
  return (
    <div>
      <PageHeader eyebrow="Protection" title="Login & security" description="Keep your identity, sessions, and shopping history protected." />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="surface p-7"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Lock className="h-6 w-6" /></div><h2 className="mt-5 text-xl font-black">Password hygiene</h2><p className="muted mt-2 leading-relaxed">Use a unique password and never share account credentials with another person.</p><button className="btn btn-soft mt-5">Change password</button></div>
        <div className="surface p-7"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><ShieldCheck className="h-6 w-6" /></div><h2 className="mt-5 text-xl font-black">Session protection</h2><p className="muted mt-2 leading-relaxed">Your authenticated session uses an HTTP-only cookie and expires automatically.</p><div className="mt-5 flex items-center gap-2 text-sm font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Protected by default</div></div>
      </div>
    </div>
  );
}

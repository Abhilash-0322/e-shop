import Link from 'next/link';
import {Compass} from 'lucide-react';

export default function NotFound() {
  return <div className="shell flex min-h-[55vh] items-center justify-center py-20 text-center"><div className="max-w-lg"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Compass className="h-7 w-7" /></div><p className="eyebrow mt-6">404</p><h1 className="page-title mt-3">That page wandered off.</h1><p className="muted mt-3">Let&apos;s get you back to something useful.</p><Link href="/" className="btn btn-primary mt-7">Return home</Link></div></div>;
}

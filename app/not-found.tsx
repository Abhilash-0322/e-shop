import Link from 'next/link';
import { ArrowLeft, Search } from '@/lib/icons';

export default function NotFound() {
  return (
    <div className="shell py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff0e9] text-[#bd4532]"><Search className="h-7 w-7" /></div>
        <p className="eyebrow mt-6">Product unavailable</p>
        <h1 className="page-title mt-3">That page wandered off.</h1>
        <p className="muted mx-auto mt-4 max-w-md leading-relaxed">The link may be old, the product may have sold out, or the page may have moved. There are still plenty of good places to look.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/search" className="btn btn-primary"><Search className="h-4 w-4" /> Browse products</Link>
          <Link href="/" className="btn btn-soft"><ArrowLeft className="h-4 w-4" /> Return home</Link>
          <Link href="/help" className="btn btn-dark">Ask support</Link>
        </div>
      </div>
    </div>
  );
}

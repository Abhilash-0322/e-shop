import Link from 'next/link';
import { ArrowRight, MessageCircle, Package, Search, ShieldCheck } from '@/lib/icons';

export default function Help() {
  const cards = [[Package, 'Orders', 'Track, review, and resolve delivery questions.', '/account/orders'], [ShieldCheck, 'Account & payments', 'Keep your account secure and your details current.', '/account/security'], [MessageCircle, 'Seller support', 'Get help building and running your storefront.', '/seller/apply']] as const;
  return (
    <div className="shell py-8 md:py-10">
      <div className="command-board p-7 md:p-12"><p className="eyebrow !text-[#9af3e4]">Support command</p><h1 className="mt-4 max-w-2xl text-4xl font-black tracking-[-.055em] md:text-5xl">Let&apos;s get things moving.</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">Find a clear next step for your order, account, return, or seller journey.</p><div className="mt-7 flex max-w-lg items-center gap-3 rounded-lg border border-white/10 bg-white/[.08] px-4 py-3 text-xs text-slate-400"><Search className="h-4 w-4 text-[#9af3e4]" /> Search support topics with ⌘ K</div></div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">{cards.map(([Icon, title, detail, href]) => <Link href={href} className="card group p-6" key={href}><Icon className="h-7 w-7 text-indigo-600" /><h2 className="mt-5 text-lg font-black group-hover:text-indigo-700">{title}</h2><p className="muted mt-2 text-sm leading-relaxed">{detail}</p><span className="mt-6 block text-xs font-extrabold text-indigo-600">Open guide <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></span></Link>)}</div>
      <div className="surface mt-6 p-6"><p className="eyebrow">Before contacting us</p><h2 className="mt-2 text-xl font-black">Have your order number ready.</h2><p className="muted mt-3 text-sm">It helps the support team quickly find the right delivery, payment, or return context.</p></div>
    </div>
  );
}

import Link from 'next/link';
import {ArrowLeft} from '@/lib/icons';

type WorkspaceLink = {href: string; label: string; icon?: React.ReactNode};

export default function WorkspaceShell({children, links, title, backLabel = 'Storefront', backHref = '/', identity, intro}: {
  children: React.ReactNode;
  links: WorkspaceLink[];
  title: string;
  backLabel?: string;
  backHref?: string;
  identity?: string;
  intro?: string;
}) {
  return (
    <div className="min-h-[65vh]">
      <div className="bg-slate-950 text-white">
        <div className="shell flex min-h-16 items-center justify-between gap-4">
          <Link href={backHref} className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>
          <div className="text-right">
            <b className="block text-sm">{title}</b>
            {identity && <span className="hidden text-xs text-slate-400 sm:block">{identity}</span>}
          </div>
        </div>
      </div>
      <div className="shell py-7 md:py-10">
        {intro && <p className="muted mb-5 text-sm">{intro}</p>}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {links.map(link => (
            <Link href={link.href} key={link.href} className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              {link.icon}{link.label}
            </Link>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="surface hidden h-fit p-3 lg:block">
            <nav className="space-y-1" aria-label={`${title} navigation`}>
              {links.map(link => (
                <Link href={link.href} key={link.href} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700">
                  {link.icon}{link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

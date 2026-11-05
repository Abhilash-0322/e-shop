'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowRight,
  Boxes,
  Command as CommandIcon,
  GitCompare,
  HelpCircle,
  LayoutDashboard,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  User,
  Zap,
} from '@/lib/icons';

type CommandItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tag?: string;
};

const COMMANDS: CommandItem[] = [
  { id: 'discover', label: 'Discover products', description: 'Search the full marketplace catalog', href: '/search', icon: Search, tag: 'Browse' },
  { id: 'deals', label: 'Open today’s deals', description: 'See the latest drops and offers', href: '/deals', icon: Zap, tag: 'Browse' },
  { id: 'orders', label: 'Track an order', description: 'Open your order timeline', href: '/account/orders', icon: Package, tag: 'Account' },
  { id: 'account', label: 'Open account center', description: 'Addresses, payments, security, and more', href: '/account', icon: User, tag: 'Account' },
  { id: 'wishlist', label: 'View wishlist', description: 'Return to products you saved', href: '/account/wishlist', icon: Sparkles, tag: 'Account' },
  { id: 'compare', label: 'Compare products', description: 'Review your selected products side by side', href: '/compare', icon: GitCompare, tag: 'Tools' },
  { id: 'help', label: 'Get support', description: 'Find a clear next step for any issue', href: '/help', icon: HelpCircle, tag: 'Support' },
  { id: 'sell', label: 'Start selling', description: 'Set up a Halozon seller workspace', href: '/seller/apply', icon: Store, tag: 'Grow' },
  { id: 'seller', label: 'Seller command center', description: 'Manage catalog, orders, and store', href: '/seller/dashboard', icon: LayoutDashboard, tag: 'Seller' },
  { id: 'admin', label: 'Open operations console', description: 'Monitor marketplace health and moderation', href: '/admin', icon: Activity, tag: 'Admin' },
  { id: 'stores', label: 'Explore stores', description: 'Find products from independent sellers', href: '/search', icon: Boxes, tag: 'Browse' },
];

export default function CommandPalette({ userRole }: { userRole?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const commands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return COMMANDS.filter((command) => {
      if (command.id === 'seller' && userRole !== 'seller' && userRole !== 'admin') return false;
      if (command.id === 'admin' && userRole !== 'admin') return false;
      if (!normalized) return true;
      return `${command.label} ${command.description} ${command.tag}`.toLowerCase().includes(normalized);
    });
  }, [query, userRole]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (!isTyping && event.key === '/') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open) window.requestAnimationFrame(() => inputRef.current?.focus());
    else {
      setQuery('');
      setSelected(0);
    }
  }, [open]);

  useEffect(() => {
    setSelected((current) => Math.min(current, Math.max(commands.length - 1, 0)));
  }, [commands.length]);

  function run(command?: CommandItem) {
    const next = command || commands[selected];
    setOpen(false);
    if (next) router.push(next.href);
    else if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <button type="button" className="command-launcher" onClick={() => setOpen(true)} aria-label="Open command launcher">
        <CommandIcon className="h-4 w-4 text-[#8df5e7]" />
        <span className="truncate">Search or jump to a command...</span>
        <kbd>⌘ K</kbd>
      </button>
      {open && (
        <div className="command-menu" onClick={() => setOpen(false)}>
          <div className="command-dialog" role="dialog" aria-modal="true" aria-label="Command launcher" onClick={(event) => event.stopPropagation()}>
            <div className="command-dialog-search">
              <Search className="h-5 w-5 text-[#635bff]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setSelected((current) => Math.min(current + 1, Math.max(commands.length - 1, 0)));
                  }
                  if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setSelected((current) => Math.max(current - 1, 0));
                  }
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    run();
                  }
                }}
                placeholder="Search products, orders, or actions..."
                aria-label="Search commands"
              />
              <button type="button" onClick={() => setOpen(false)} className="text-xs font-bold text-slate-400">ESC</button>
            </div>
            <div className="max-h-[25rem] overflow-y-auto p-2">
              <p className="px-3 pb-2 pt-1 text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">
                {query ? 'Matching commands' : 'Quick navigation'}
              </p>
              {commands.length > 0 ? commands.map((command, index) => {
                const Icon = command.icon;
                return (
                  <button
                    type="button"
                    key={command.id}
                    className="command-result"
                    data-selected={index === selected}
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => run(command)}
                  >
                    <span className="command-result-icon"><Icon className="h-4 w-4" /></span>
                    <span>
                      <span className="block text-sm font-bold">{command.label}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">{command.description}</span>
                    </span>
                    <span className="command-result-meta">{command.tag}</span>
                    {index === selected && <ArrowRight className="h-4 w-4 text-[#635bff]" />}
                  </button>
                );
              }) : (
                <button type="button" className="command-result" onClick={() => run()}>
                  <span className="command-result-icon"><Search className="h-4 w-4" /></span>
                  <span>
                    <span className="block text-sm font-bold">Search for “{query}”</span>
                    <span className="mt-0.5 block text-xs text-slate-500">Open marketplace results</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 text-[#635bff]" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-semibold text-slate-400">
              <span>↑↓ to navigate · Enter to open</span>
              <span className="flex items-center gap-1"><CommandIcon className="h-3 w-3" />K to toggle</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

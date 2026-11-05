'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  Ban,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit,
  Eye,
  Filter,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Store,
  Trash2,
  UserRound,
  X,
} from '@/lib/icons';

type Item = Record<string, any>;
type Resource = 'users' | 'products' | 'reviews' | 'sellers';

type PendingAction = {
  item: Item;
  action: 'suspend' | 'approve' | 'delete';
};

const resourceCopy: Record<Resource, { title: string; eyebrow: string; description: string }> = {
  users: {
    title: 'User controls',
    eyebrow: 'People & access',
    description: 'Review accounts, manage access, and keep customer support moving.',
  },
  products: {
    title: 'Catalog workspace',
    eyebrow: 'Merchandising',
    description: 'Keep the marketplace catalog accurate, healthy, and easy to trust.',
  },
  reviews: {
    title: 'Moderation queue',
    eyebrow: 'Trust & safety',
    description: 'Review customer feedback and remove content that does not meet policy.',
  },
  sellers: {
    title: 'Seller approvals',
    eyebrow: 'Marketplace',
    description: 'Verify new storefronts before they start selling on Halozon.',
  },
};

function date(value?: string) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed);
}

function money(value?: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));
}

function initials(value?: string) {
  return (value || 'H')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name, tone = 'indigo' }: { name?: string; tone?: 'indigo' | 'amber' | 'rose' }) {
  return <span className={`admin-avatar admin-avatar-${tone}`}>{initials(name)}</span>;
}

function Status({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`admin-status admin-status-${tone}`}>{children}</span>;
}

function EmptyState({ resource, filtered }: { resource: Resource; filtered: boolean }) {
  const Icon = resource === 'users' ? UserRound : resource === 'sellers' ? Store : resource === 'reviews' ? Star : Package;
  return (
    <div className="admin-empty">
      <span className="admin-empty-icon"><Icon className="h-6 w-6" /></span>
      <b>{filtered ? 'No matching records' : `No ${resource} to review`}</b>
      <p>{filtered ? 'Try a different search or filter.' : 'New records will appear here automatically.'}</p>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="admin-detail-field">
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  );
}

export default function AdminTable({ resource, endpoint }: { resource: Resource; endpoint: string }) {
  const copy = resourceCopy[resource];
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Item | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [busyId, setBusyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = submittedQuery ? `?q=${encodeURIComponent(submittedQuery)}` : '';
      const response = await fetch(`${endpoint}${params}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load records.');
      setItems(data.items || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load records.');
    } finally {
      setLoading(false);
    }
  }, [endpoint, submittedQuery]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (submittedQuery) {
        const searchable = [
          item.name,
          item.email,
          item.title,
          item.productTitle,
          item.productId,
          item.userName,
          item.sellerName,
          item.sellerProfile?.storeName,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(submittedQuery.toLowerCase())) return false;
      }
      if (filter === 'suspended') return resource === 'users' && item.banned;
      if (filter === 'active') return resource === 'users' && !item.banned;
      if (filter === 'seller-accounts') return resource === 'users' && item.role === 'seller';
      if (filter === 'low-stock') return resource === 'products' && Number(item.stock) <= 5;
      if (filter === 'out-of-stock') return resource === 'products' && Number(item.stock) <= 0;
      if (filter === 'pending') return resource === 'sellers' && !item.sellerProfile?.approved;
      if (filter === 'approved') return resource === 'sellers' && item.sellerProfile?.approved;
      if (filter === 'low-rating') return resource === 'reviews' && Number(item.rating) <= 2;
      return true;
    });
  }, [filter, items, resource]);

  const filterOptions = {
    users: [
      ['all', 'All users'],
      ['active', 'Active'],
      ['suspended', 'Suspended'],
      ['seller-accounts', 'Seller accounts'],
    ],
    products: [['all', 'All products'], ['low-stock', 'Low stock'], ['out-of-stock', 'Out of stock']],
    reviews: [['all', 'All reviews'], ['low-rating', 'Low rating']],
    sellers: [['all', 'All applications'], ['pending', 'Needs review'], ['approved', 'Approved']],
  }[resource];

  function requestAction(item: Item, action: PendingAction['action']) {
    setPending({ item, action });
  }

  async function performAction() {
    if (!pending) return;
    const id = String(pending.item._id || pending.item.reviewId);
    setBusyId(id);
    try {
      const isUser = resource === 'users';
      const isSeller = resource === 'sellers';
      const method = isUser || isSeller ? 'PATCH' : 'DELETE';
      const body = isUser
        ? { userId: pending.item._id, banned: !pending.item.banned }
        : isSeller
          ? { userId: pending.item._id, approved: !pending.item.sellerProfile?.approved }
          : resource === 'reviews'
            ? { productId: pending.item.productId, reviewId: pending.item.reviewId }
            : { productId: pending.item._id };
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Action could not be completed.');
      if (isUser) {
        setItems((current) =>
          current.map((item) => item._id === pending.item._id ? { ...item, banned: !item.banned } : item),
        );
      } else if (isSeller) {
        setItems((current) =>
          current.map((item) =>
            item._id === pending.item._id
              ? { ...item, sellerProfile: { ...item.sellerProfile, approved: !item.sellerProfile?.approved } }
              : item,
          ),
        );
      } else {
        setItems((current) =>
          current.filter((item) => String(item._id || item.reviewId) !== id),
        );
      }
      setSelected(null);
      setPending(null);
      toast.success(isUser ? 'Access status updated' : isSeller ? 'Seller status updated' : 'Record removed');
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Action could not be completed.');
    } finally {
      setBusyId('');
    }
  }

  async function updateRole(item: Item, role: string) {
    setBusyId(String(item._id));
    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: item._id, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Role could not be updated.');
      setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, role } : entry));
      if (selected?._id === item._id) setSelected({ ...selected, role });
      toast.success('Role updated');
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Role could not be updated.');
    } finally {
      setBusyId('');
    }
  }

  const hasFilters = Boolean(submittedQuery || filter !== 'all');
  const actionLabel = pending?.action === 'delete'
    ? resource === 'reviews' ? 'Remove review' : 'Delete product'
    : pending?.action === 'approve'
      ? 'Approve seller'
      : 'Suspend access';

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">{copy.eyebrow}</p>
          <h1 className="admin-title">{copy.title}</h1>
          <p className="admin-subtitle">{copy.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="admin-count">{loading ? '…' : `${filteredItems.length} shown`}</span>
          <button type="button" className="admin-button admin-button-quiet" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        <form
          className="admin-search"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmittedQuery(query.trim());
          }}
        >
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={resource === 'users' ? 'Search name or email' : resource === 'reviews' ? 'Search reviews' : 'Search records'}
            aria-label={`Search ${resource}`}
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setSubmittedQuery(''); }} aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
        <div className="admin-filter">
          <Filter className="h-4 w-4" />
          <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter records">
            {filterOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </div>
        <span className="admin-toolbar-note"><ShieldCheck className="h-3.5 w-3.5" /> Admin-only workspace</span>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div><b>Couldn&apos;t load this queue</b><p>{error}</p></div>
          <button type="button" onClick={() => void load()} className="admin-button admin-button-quiet ml-auto">Retry</button>
        </div>
      )}

      <div className="admin-table-card">
        {loading ? (
          <div className="admin-loading-table">
            {[1, 2, 3, 4, 5].map((row) => <div className="admin-skeleton-row" key={row} />)}
          </div>
        ) : !filteredItems.length ? (
          <EmptyState resource={resource} filtered={hasFilters} />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{resource === 'reviews' ? 'Review' : resource === 'products' ? 'Product' : resource === 'sellers' ? 'Applicant' : 'Account'}</th>
                  <th>{resource === 'reviews' ? 'Product' : resource === 'products' ? 'Inventory' : resource === 'sellers' ? 'Application' : 'Access'}</th>
                  <th>{resource === 'reviews' ? 'Rating' : resource === 'products' ? 'Price' : resource === 'sellers' ? 'Status' : 'Role'}</th>
                  <th>{resource === 'reviews' ? 'Submitted' : resource === 'products' ? 'Updated' : resource === 'sellers' ? 'Country' : 'Joined'}</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const id = String(item._id || item.reviewId);
                  const sellerName = item.sellerProfile?.storeName || item.name;
                  return (
                    <tr key={id} onClick={() => setSelected(item)} className="cursor-pointer">
                      <td>
                        <div className="flex min-w-[220px] items-center gap-3">
                          {resource === 'products' ? (
                            <span className="admin-product-mark"><Package className="h-4 w-4" /></span>
                          ) : resource === 'reviews' ? (
                            <span className="admin-product-mark admin-product-mark-rose"><Star className="h-4 w-4" /></span>
                          ) : (
                            <Avatar name={sellerName} tone={resource === 'sellers' ? 'amber' : 'indigo'} />
                          )}
                          <div className="min-w-0">
                            <p className="admin-row-title admin-truncate">
                              {resource === 'reviews' ? (item.title || 'Untitled review') : resource === 'products' ? item.title : resource === 'sellers' ? sellerName : item.name}
                            </p>
                            <p className="admin-row-meta admin-truncate">
                              {resource === 'reviews' ? `${item.userName || 'Customer'} · ${item.body || 'No written comment'}` : resource === 'products' ? (item.brand || item.sellerName || item.seller || 'Halozon direct') : item.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        {resource === 'reviews' ? <span className="admin-row-title">{item.productTitle}</span> : resource === 'products' ? (
                          <span className={`admin-status ${Number(item.stock) <= 0 ? 'admin-status-danger' : Number(item.stock) <= 5 ? 'admin-status-warning' : 'admin-status-success'}`}>
                            {Number(item.stock) <= 0 ? 'Out of stock' : `${item.stock} in stock`}
                          </span>
                        ) : resource === 'sellers' ? (
                          <span className="admin-row-meta">{date(item.sellerProfile?.appliedAt)}</span>
                        ) : (
                          <Status tone={item.banned ? 'danger' : 'success'}>{item.banned ? 'Suspended' : 'Active'}</Status>
                        )}
                      </td>
                      <td>
                        {resource === 'reviews' ? (
                          <span className="admin-rating"><Star className="h-3.5 w-3.5 fill-current" /> {item.rating?.toFixed?.(1) || item.rating}</span>
                        ) : resource === 'products' ? (
                          <span className="admin-row-title">{money(item.price)}</span>
                        ) : resource === 'sellers' ? (
                          <Status tone={item.sellerProfile?.approved ? 'success' : 'info'}>{item.sellerProfile?.approved ? 'Approved' : 'Pending'}</Status>
                        ) : (
                          <select
                            value={item.role || 'user'}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => void updateRole(item, event.target.value)}
                            disabled={busyId === id}
                            className="admin-role-select"
                            aria-label={`Change role for ${item.name}`}
                          >
                            <option value="user">Customer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td>
                        <span className="admin-row-meta">{date(resource === 'sellers' ? item.sellerProfile?.appliedAt : item.createdAt || item.updatedAt)}</span>
                      </td>
                      <td>
                        <div className="flex justify-end gap-1">
                          <button type="button" className="admin-icon-button" onClick={(event) => { event.stopPropagation(); setSelected(item); }} aria-label="Open details">
                            <Eye className="h-4 w-4" />
                          </button>
                          {resource === 'users' && (
                            <button type="button" className={`admin-icon-button ${item.banned ? 'admin-icon-success' : 'admin-icon-danger'}`} onClick={(event) => { event.stopPropagation(); requestAction(item, 'suspend'); }} aria-label={item.banned ? 'Restore access' : 'Suspend access'}>
                              {item.banned ? <Check className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                            </button>
                          )}
                          {resource === 'sellers' && (
                            <button type="button" className="admin-icon-button admin-icon-success" onClick={(event) => { event.stopPropagation(); requestAction(item, 'approve'); }} aria-label={item.sellerProfile?.approved ? 'Revoke approval' : 'Approve seller'}>
                              {item.sellerProfile?.approved ? <Edit className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </button>
                          )}
                          {(resource === 'products' || resource === 'reviews') && (
                            <button type="button" className="admin-icon-button admin-icon-danger" onClick={(event) => { event.stopPropagation(); requestAction(item, 'delete'); }} aria-label={resource === 'reviews' ? 'Remove review' : 'Delete product'}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredItems.length > 0 && (
          <div className="admin-table-footer">
            <span>Showing {filteredItems.length} of {items.length} records</span>
            <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> Updated just now</span>
          </div>
        )}
      </div>

      {selected && (
        <div className="admin-drawer-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <aside className="admin-drawer" role="dialog" aria-modal="true" aria-label="Record details" onClick={(event) => event.stopPropagation()}>
            <div className="admin-drawer-header">
              <div>
                <p className="admin-eyebrow">Audit detail</p>
                <h2>{resource === 'products' ? selected.title : resource === 'reviews' ? selected.title || 'Customer review' : resource === 'sellers' ? selected.sellerProfile?.storeName || 'Seller application' : selected.name}</h2>
              </div>
              <button type="button" className="admin-icon-button" onClick={() => setSelected(null)} aria-label="Close details"><X className="h-4 w-4" /></button>
            </div>
            <div className="admin-drawer-body">
              <div className="admin-detail-identity">
                {resource === 'products' ? <span className="admin-product-mark"><Package className="h-5 w-5" /></span> : <Avatar name={resource === 'sellers' ? selected.sellerProfile?.storeName : resource === 'reviews' ? selected.userName : selected.name} tone={resource === 'sellers' ? 'amber' : 'indigo'} />}
                <div>
                  <b>{resource === 'reviews' ? selected.userName || 'Customer' : resource === 'products' ? selected.brand || 'Catalog listing' : selected.email}</b>
                  <p>{resource === 'reviews' ? selected.productTitle : resource === 'products' ? selected.sellerName || selected.seller || 'Halozon direct' : resource === 'sellers' ? selected.email : selected.role}</p>
                </div>
              </div>
              {resource === 'users' && <dl className="admin-detail-grid"><DetailField label="Account status" value={<Status tone={selected.banned ? 'danger' : 'success'}>{selected.banned ? 'Suspended' : 'Active'}</Status>} /><DetailField label="Role" value={selected.role} /><DetailField label="Joined" value={date(selected.createdAt)} /><DetailField label="Email" value={selected.email} /></dl>}
              {resource === 'products' && <dl className="admin-detail-grid"><DetailField label="Price" value={money(selected.price)} /><DetailField label="Inventory" value={<Status tone={Number(selected.stock) <= 0 ? 'danger' : Number(selected.stock) <= 5 ? 'warning' : 'success'}>{selected.stock} units</Status>} /><DetailField label="Rating" value={selected.rating ? `${selected.rating.toFixed?.(1) || selected.rating} / 5` : '—'} /><DetailField label="Last updated" value={date(selected.updatedAt || selected.createdAt)} /></dl>}
              {resource === 'sellers' && <dl className="admin-detail-grid"><DetailField label="Review status" value={<Status tone={selected.sellerProfile?.approved ? 'success' : 'info'}>{selected.sellerProfile?.approved ? 'Approved' : 'Pending review'}</Status>} /><DetailField label="Country" value={selected.sellerProfile?.country} /><DetailField label="Applied" value={date(selected.sellerProfile?.appliedAt)} /><DetailField label="Store slug" value={selected.sellerProfile?.slug} /></dl>}
              {resource === 'reviews' && <dl className="admin-detail-grid"><DetailField label="Rating" value={<span className="admin-rating"><Star className="h-3.5 w-3.5 fill-current" /> {selected.rating} / 5</span>} /><DetailField label="Verified buyer" value={selected.verifiedBuyer ? 'Yes' : 'No'} /><DetailField label="Submitted" value={date(selected.createdAt)} /><DetailField label="Review ID" value={selected.reviewId} /></dl>}
              {resource === 'reviews' && <div className="admin-review-body"><p className="admin-kicker">Customer comment</p><p>{selected.body || 'This customer did not leave a written comment.'}</p></div>}
              <div className="admin-audit-note"><ShieldCheck className="h-4 w-4" /><span>Actions are logged against your admin session.</span></div>
            </div>
            <div className="admin-drawer-footer">
              <Link href={resource === 'products' ? `/product/${selected._id}` : resource === 'sellers' ? '/admin/sellers' : '#'} className="admin-button admin-button-quiet" onClick={() => resource !== 'products' && setSelected(null)}>
                {resource === 'products' ? 'View listing' : 'Open queue'}
              </Link>
              {resource === 'users' && <button type="button" className={`admin-button ${selected.banned ? 'admin-button-success' : 'admin-button-danger'}`} onClick={() => requestAction(selected, 'suspend')}>{selected.banned ? <Check className="h-4 w-4" /> : <Ban className="h-4 w-4" />}{selected.banned ? 'Restore access' : 'Suspend access'}</button>}
              {resource === 'sellers' && <button type="button" className="admin-button admin-button-primary" onClick={() => requestAction(selected, 'approve')}><Check className="h-4 w-4" />{selected.sellerProfile?.approved ? 'Revoke approval' : 'Approve seller'}</button>}
              {(resource === 'products' || resource === 'reviews') && <button type="button" className="admin-button admin-button-danger" onClick={() => requestAction(selected, 'delete')}><Trash2 className="h-4 w-4" />{resource === 'reviews' ? 'Remove review' : 'Delete product'}</button>}
            </div>
          </aside>
        </div>
      )}

      {pending && (
        <div className="admin-modal-backdrop" role="presentation">
          <div className="admin-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
            <span className={`admin-confirm-icon ${pending.action === 'delete' || pending.action === 'suspend' ? 'admin-confirm-danger' : 'admin-confirm-success'}`}>
              {pending.action === 'delete' || pending.action === 'suspend' ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </span>
            <h2 id="confirm-title">{actionLabel}?</h2>
            <p>
              {pending.action === 'delete'
                ? 'This cannot be undone. The record will be removed from the marketplace.'
                : pending.action === 'suspend'
                  ? `Are you sure you want to ${pending.item.banned ? 'restore' : 'suspend'} access for ${pending.item.name || 'this account'}?`
                  : `Confirm that ${pending.item.sellerProfile?.storeName || pending.item.name || 'this seller'} has passed your review.`}
            </p>
            <div className="admin-confirm-actions">
              <button type="button" className="admin-button admin-button-quiet" onClick={() => setPending(null)} disabled={Boolean(busyId)}>Cancel</button>
              <button type="button" className={`admin-button ${pending.action === 'approve' ? 'admin-button-primary' : 'admin-button-danger'}`} onClick={() => void performAction()} disabled={Boolean(busyId)}>
                {busyId ? <RefreshCw className="h-4 w-4 animate-spin" /> : pending.action === 'approve' ? <Check className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                {busyId ? 'Working…' : actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

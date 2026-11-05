'use client';
import { useEffect, useState } from 'react';
import { Search, Ban, CheckCircle2, Shield } from 'lucide-react';
import AdminLayout from '../AdminLayout';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const r = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
    const d = await r.json();
    setItems(d.items || []);
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  async function toggleBan(u: any) {
    const r = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: u._id, banned: !u.banned }),
    });
    if (r.ok) {
      toast.success(u.banned ? 'User unbanned' : 'User banned');
      refresh();
    } else toast.error('Failed');
  }

  async function setRole(u: any, role: string) {
    const r = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: u._id, role }),
    });
    if (r.ok) {
      toast.success(`Role set to ${role}`);
      refresh();
    } else toast.error('Failed');
  }

  return (
    <AdminLayout>
      <div className="ops-page !px-0 !py-0">
      <div className="mb-6"><div className="ops-kicker">Customer operations</div><h1 className="ops-page-title mt-1">Users</h1><p className="mt-1 text-sm text-amazon-textMuted">Manage access, roles, and account status.</p></div>
      <div className="relative mb-3 max-w-md">
        <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-amazon-textMuted" />
        <input
          className="amazon-input pl-8"
          placeholder="Search by name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && refresh()}
        />
      </div>
      <button onClick={refresh} className="amazon-btn-dark !text-xs mb-4">Search</button>

      <div className="ops-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="p-6 text-center text-sm text-amazon-textMuted">Loading…</td></tr>}
            {!loading && items.map((u) => (
              <tr key={u._id} className="border-t border-amazon-border">
                <td className="p-3">{u.name}</td>
                <td className="p-3 text-amazon-textMuted">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => setRole(u, e.target.value)}
                    className="amazon-input !text-xs !py-1 !w-auto"
                  >
                    <option value="user">user</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  {u.banned ? (
                    <span className="chip !bg-amazon-deal/15 !text-amazon-deal">banned</span>
                  ) : (
                    <span className="chip !bg-amazon-greenDark/10 !text-amazon-greenDark">active</span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleBan(u)}
                    className={`text-xs flex items-center gap-1 ${u.banned ? 'text-amazon-greenDark hover:underline' : 'text-amazon-deal hover:underline'}`}
                  >
                    {u.banned ? <><CheckCircle2 className="w-3 h-3" /> Unban</> : <><Ban className="w-3 h-3" /> Ban</>}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-sm text-amazon-textMuted">No users match this search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </AdminLayout>
  );
}

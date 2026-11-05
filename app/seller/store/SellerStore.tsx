'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Store, CheckCircle2, MapPin, CreditCard, Star, ArrowUpRight } from 'lucide-react';
import SellerLayout from '../SellerLayout';
import toast from 'react-hot-toast';

export default function SellerStore({ user }: { user: any }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch('/api/seller/apply')
      .then((r) => r.json())
      .then((d) => setProfile(d.profile));
  }, []);

  if (!profile) {
    return (
      <SellerLayout user={user}>
        <div className="shimmer-bg h-40 rounded-md" />
      </SellerLayout>
    );
  }

  return (
    <SellerLayout user={user}>
      <div className="ops-page">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="ops-kicker">Brand workspace</div>
          <h1 className="ops-page-title mt-1">Store profile</h1>
          <p className="mt-1 text-sm text-amazon-textMuted">Your public identity, payout details, and store health in one place.</p>
        </div>
        <Link href={`/store/${profile.slug}`} className="amazon-btn-dark !text-xs"><ExternalLink className="mr-1 inline h-3.5 w-3.5" /> Preview store</Link>
      </div>

      {profile.approved ? (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-amazon-greenDark/20 bg-amazon-green/10 p-4">
          <CheckCircle2 className="w-5 h-5 text-amazon-greenDark" />
          <span className="text-sm">
            Your store is <b>live</b> and visible to customers at{' '}
            <Link href={`/store/${profile.slug}`} className="text-amazon-link hover:underline">
              /store/{profile.slug}
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </Link>
          </span>
        </div>
      ) : (
        <div className="mb-5 rounded-2xl border border-amazon-yellow/40 bg-amazon-yellow/20 p-4 text-sm">
          ⏳ Your application is <b>pending review</b>. Once an admin approves, your store will be visible to customers.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="panel p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="ops-kicker">Store details</div>
                <h2 className="mt-1 text-xl font-bold">{profile.storeName}</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amazon-orange/10 text-amazon-orange"><Store className="h-5 w-5" /></div>
            </div>
            <div className="text-sm text-amazon-textMuted space-y-1">
              <div className="flex items-center gap-2"><Store className="h-4 w-4" /> <b>/{profile.slug}</b></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {profile.country}</div>
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> {profile.payoutMethod} · {profile.payoutEmail}</div>
              <div className="pt-2 text-xs">Applied {new Date(profile.appliedAt).toLocaleDateString()}{profile.approvedAt ? ` · Approved ${new Date(profile.approvedAt).toLocaleDateString()}` : ''}</div>
            </div>
          </div>
          <div className="panel p-5">
            <h3 className="mb-2 font-bold">About your store</h3>
            <p className="text-sm text-amazon-text">{profile.description || '(no description)'}</p>
          </div>
          <div className="panel p-5">
            <div className="mb-3 flex items-center justify-between"><h3 className="font-bold">Store checklist</h3><span className="text-xs font-semibold text-amazon-greenDark">2 of 3 complete</span></div>
            <div className="space-y-3 text-sm">
              <Checklist done label="Store application approved" />
              <Checklist done={Boolean(profile.description)} label="Add a store description" />
              <Checklist done={false} label="Publish your first product" href="/seller/products/new" />
            </div>
          </div>
        </div>
        <div className="panel h-fit bg-amazon-bg/30 p-5">
          <Store className="w-12 h-12 text-amazon-orange mx-auto mb-2" />
          <h3 className="mb-2 text-center font-bold">{profile.storeName}</h3>
          <div className="text-center text-sm">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold"><Star className="h-5 w-5 fill-amazon-star text-amazon-star" /> {(profile.rating || 0).toFixed(1)}</div>
            <div className="text-xs text-amazon-textMuted">{profile.ratingCount || 0} ratings</div>
          </div>
          <Link href={`/store/${profile.slug}`} className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-amazon-link">See customer view <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
      </div>
    </SellerLayout>
  );
}

function Checklist({ done, label, href }: { done: boolean; label: string; href?: string }) {
  const content = <div className={`flex items-center gap-2 ${done ? 'text-amazon-greenDark' : 'text-amazon-textMuted'}`}><CheckCircle2 className="h-4 w-4" /> <span className={done ? '' : 'text-amazon-text'}>{label}</span>{!done && href && <ArrowUpRight className="ml-auto h-3.5 w-3.5" />}</div>;
  return href && !done ? <Link href={href} className="block hover:opacity-75">{content}</Link> : content;
}

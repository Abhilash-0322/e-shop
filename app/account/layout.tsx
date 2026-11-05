import {redirect} from 'next/navigation';
import {getCurrentUser} from '@/lib/auth';
import WorkspaceShell from '@/components/WorkspaceShell';

const links = [
  {href: '/account', label: 'Overview'},
  {href: '/account/orders', label: 'Orders'},
  {href: '/account/addresses', label: 'Addresses'},
  {href: '/account/payment', label: 'Payment'},
  {href: '/account/wishlist', label: 'Wishlist'},
  {href: '/account/returns', label: 'Returns'},
  {href: '/account/subscriptions', label: 'Subscriptions'},
  {href: '/account/security', label: 'Security'},
  {href: '/prime', label: 'Halozon Plus'},
];

export default async function AccountLayout({children}: {children: React.ReactNode}) {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account');
  return (
    <WorkspaceShell
      title="Your account"
      identity={`${user.name} · ${user.email}`}
      links={links}
      intro="Manage your orders, saved products, delivery details, and account preferences."
    >
      {children}
    </WorkspaceShell>
  );
}

import AccountLayout from './AccountLayout';
import { Skeleton } from '@/components/AccountPrimitives';

export default function AccountLoading() {
  return (
    <AccountLayout user={{ name: 'Your account', email: 'Loading your details…' }}>
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-12 w-64 mb-2" />
      <Skeleton className="h-5 w-96 max-w-full mb-6" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-36" />)}
      </div>
      <Skeleton className="h-72 mb-4" />
      <Skeleton className="h-56" />
    </AccountLayout>
  );
}

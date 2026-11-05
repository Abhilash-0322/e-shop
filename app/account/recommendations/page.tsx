import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AccountLayout from '../AccountLayout';
import RecommendationsView from './RecommendationsView';

export default async function RecommendationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/recommendations');
  return (
    <AccountLayout user={user}>
      <RecommendationsView />
    </AccountLayout>
  );
}

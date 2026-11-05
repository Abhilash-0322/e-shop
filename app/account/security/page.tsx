import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import AccountLayout from '../AccountLayout';
import SecurityView from './SecurityView';

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/signin?redirect=/account/security');
  await connectDB();
  const profile = (await User.findById(user.id).select('phone').lean()) as { phone?: string } | null;
  return (
    <AccountLayout user={user}>
      <SecurityView initial={{ name: user.name, email: user.email, phone: profile?.phone }} />
    </AccountLayout>
  );
}

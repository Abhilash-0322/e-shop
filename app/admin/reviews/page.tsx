import AdminTable from '@/components/AdminTable';

export default function Reviews() {
  return <AdminTable resource="reviews" endpoint="/api/admin/reviews" />;
}

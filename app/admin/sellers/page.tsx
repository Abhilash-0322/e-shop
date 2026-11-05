import AdminTable from '@/components/AdminTable';

export default function Sellers() {
  return <AdminTable resource="sellers" endpoint="/api/admin/sellers" />;
}

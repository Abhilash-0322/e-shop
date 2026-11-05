import AdminTable from '@/components/AdminTable';

export default function Users() {
  return <AdminTable resource="users" endpoint="/api/admin/users" />;
}

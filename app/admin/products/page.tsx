import AdminTable from '@/components/AdminTable';

export default function Products() {
  return <AdminTable resource="products" endpoint="/api/admin/products" />;
}

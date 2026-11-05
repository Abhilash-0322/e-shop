import SellerLayout from '../../SellerLayout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../ProductForm';
import { ensureSellerOrAdmin } from '@/lib/requireSellerPage';

export default async function NewProductPage() {
  const user = await ensureSellerOrAdmin();
  return (
    <SellerLayout user={user}>
      <div className="ops-page">
      <Link href="/seller/products" className="mb-3 flex items-center gap-1 text-sm text-amazon-link">
        <ArrowLeft className="w-3 h-3" /> Back to products
      </Link>
      <div className="mb-5">
        <div className="ops-kicker">Catalog workspace</div>
        <h1 className="ops-page-title mt-1">Add a new product</h1>
        <p className="mt-1 text-sm text-amazon-textMuted">Create a clear, compelling listing your customers can trust.</p>
      </div>
      <ProductForm user={user} mode="create" />
      </div>
    </SellerLayout>
  );
}

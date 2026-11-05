import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import SellerLayout from '../../SellerLayout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../ProductForm';
import { serialize } from '@/lib/serialize';
import { ensureSellerOrAdmin } from '@/lib/requireSellerPage';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const user = await ensureSellerOrAdmin();
  await connectDB();
  const product = (await Product.findOne({ _id: params.id, sellerId: user.id }).lean()) as any;
  if (!product) notFound();
  return (
    <SellerLayout user={user}>
      <div className="ops-page">
      <Link href="/seller/products" className="mb-3 flex items-center gap-1 text-sm text-amazon-link">
        <ArrowLeft className="w-3 h-3" /> Back to products
      </Link>
      <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
        <div>
          <div className="ops-kicker">Catalog workspace</div>
          <h1 className="ops-page-title mt-1">Edit product</h1>
        </div>
        <Link href={`/product/${product._id}`} className="text-sm text-amazon-link hover:underline">
          View live →
        </Link>
      </div>
      <ProductForm user={user} initial={serialize(product)} mode="edit" />
      </div>
    </SellerLayout>
  );
}

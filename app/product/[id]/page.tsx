import { notFound } from 'next/navigation';
import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductView from '@/components/ProductView';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
  if (!Types.ObjectId.isValid(params.id)) notFound();
  await connectDB();
  const product = await Product.findById(params.id).select('-reviews').lean();
  if (!product) notFound();
  return <ProductView product={JSON.parse(JSON.stringify(product))} />;
}

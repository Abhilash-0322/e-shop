import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { serialize } from '@/lib/serialize';
import TrustBadge from '@/components/TrustBadge';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || '').trim();
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (q) filter.$text = { $search: q };
  const products = q
    ? serialize(await Product.find(filter).select('-reviews -description').limit(120).lean()) as any[]
    : [];
  // Suggest categories if nothing
  const categories = q
    ? serialize(await (await import('@/models/Category')).default.find({
        name: { $regex: q, $options: 'i' },
      }).lean()) as any[]
    : [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      <div className="text-xs text-amazon-textMuted mb-3">
        <Link href="/" className="amazon-link">Home</Link>
        <span className="mx-1">›</span>
        <span>Search results for &ldquo;{q}&rdquo;</span>
      </div>

      {q ? (
        <div className="panel p-4 mb-3">
          <div className="text-sm">{products.length.toLocaleString()} results for <span className="font-bold">&ldquo;{q}&rdquo;</span></div>
          <div className="flex flex-wrap gap-2 mt-3">
            <TrustBadge kind="verified" compact />
            <TrustBadge kind="delivery" compact />
            <TrustBadge kind="returns" compact />
          </div>
        </div>
      ) : (
        <div className="panel p-6 text-center text-amazon-textMuted">Type in the search bar to find products.</div>
      )}

      {categories.length > 0 && (
        <div className="panel p-4 mb-3">
          <h3 className="font-bold mb-2">Suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={String(c._id)} href={`/category/${c.slug}`} className="amazon-link text-sm border border-amazon-border rounded-full px-3 py-1 hover:border-amazon-orange">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {products.map((p: any) => (
            <ProductCard key={String(p._id)} product={p} />
          ))}
        </div>
      )}
      {q && products.length === 0 && (
        <div className="panel p-8 text-center">
          <h2 className="text-xl font-bold mb-2">No exact matches yet</h2>
          <p className="text-sm text-amazon-textMuted mb-4">Try a shorter search, browse a suggested category, or ask support for help finding a safe alternative.</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Link href="/" className="amazon-btn-yellow !text-xs">Browse all products</Link>
            <Link href="/help#contact" className="amazon-btn-dark !text-xs">Contact support</Link>
          </div>
        </div>
      )}
    </div>
  );
}

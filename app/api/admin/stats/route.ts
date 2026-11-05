import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  await connectDB();
  const [users, products, orders, pendingSellers, lowStockItems] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
    User.countDocuments({ 'sellerProfile.approved': false, 'sellerProfile.appliedAt': { $exists: true } }),
    Product.find({ stock: { $lte: 5 } })
      .select('title stock lowStockThreshold price seller sellerName images updatedAt')
      .sort({ stock: 1, updatedAt: -1 })
      .limit(8)
      .lean(),
  ]);
  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  const lowStock = await Product.countDocuments({ stock: { $lte: 5 } });
  return NextResponse.json({
    users,
    products,
    orders,
    pendingSellers,
    revenue: totalRevenue[0]?.total || 0,
    lowStock,
    lowStockItems: JSON.parse(JSON.stringify(lowStockItems)),
  });
}

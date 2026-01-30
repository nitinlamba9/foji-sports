import { NextResponse } from 'next/server';
import User from '@/models/User';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { withAdminAuth } from '@/lib/admin-auth';
import { connectDB } from '@/lib/db';

export async function GET(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    await connectDB();
    
    // Get real stats from MongoDB
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('id total status createdAt');
    
    // Format stats
    const stats = {
      totalUsers,
      totalOrders,
      totalProducts,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }))
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stats' 
    }, { status: 500 });
  }
}

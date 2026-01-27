import { NextResponse } from 'next/server';
import { debugUsers, type User } from '@/lib/user-store';
import { ordersStore, type Order } from '@/lib/orders-store';
import { withAdminAuth } from '@/lib/admin-auth';

// Mock products data
const mockProducts = [
  { id: 'product-1', status: 'active' },
  { id: 'product-2', status: 'active' },
  { id: 'product-3', status: 'active' }
];

export async function GET(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    // Get real data from stores
    const users = debugUsers();
    const orders = ordersStore.getOrders();
    
    // Calculate stats
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const totalProducts = mockProducts.length;

    // Calculate recent stats (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = users.filter((user: User) => 
      new Date(user.createdAt) > sevenDaysAgo
    ).length;

    const recentOrders = orders.filter((order: Order) => 
      new Date(order.createdAt) > sevenDaysAgo
    ).length;

    const recentRevenue = orders
      .filter((order: Order) => new Date(order.createdAt) > sevenDaysAgo)
      .reduce((sum: number, order: Order) => sum + order.total, 0);

    // Order status breakdown
    const orderStatusBreakdown = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // User role breakdown
    const userRoleBreakdown = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue,
        totalProducts,
        recentUsers,
        recentOrders,
        recentRevenue
      },
      breakdowns: {
        orderStatusBreakdown,
        userRoleBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stats' 
    }, { status: 500 });
  }
}

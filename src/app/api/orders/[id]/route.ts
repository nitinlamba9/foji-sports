import { NextRequest, NextResponse } from 'next/server';
import { ordersStore, type Order, type OrderItem } from '@/lib/orders-store';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth-middleware';

export type { Order, OrderItem };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    try {
      const { id: orderId } = await params;

      // Find the specific order
      const order = ordersStore.getOrderById(orderId);

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Check if user has permission to view this order
      if (order.userId !== req.user!.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      return NextResponse.json({ order });
    } catch (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
  })(request);
}

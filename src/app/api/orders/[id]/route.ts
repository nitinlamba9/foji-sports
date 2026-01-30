import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth-middleware';
import { connectDB } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      const { id: orderId } = await params;

      // Find the specific order in MongoDB
      const order = await Order.findById(orderId);

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Check if user has permission to view this order
      if (order.userId.toString() !== req.user!.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      return NextResponse.json({ order });
    } catch (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
  })(request);
}

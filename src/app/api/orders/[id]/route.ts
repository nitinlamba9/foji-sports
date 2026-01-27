import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ordersStore, type Order, type OrderItem } from '@/lib/orders-store';

export type { Order, OrderItem };

// In-memory order storage (same as the main orders API)
// const orders: Order[] = []; // Removed - using shared store instead

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    // Get auth token from cookies
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Simple token verification (same as main orders API)
    const token = authCookie.value;
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (!payload.userId) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    // Find the specific order
    const order = ordersStore.getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user has permission to view this order
    // In this simple system, we don't have admin roles, so users can only view their own orders
    if (order.userId !== payload.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

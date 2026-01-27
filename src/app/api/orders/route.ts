import { NextRequest, NextResponse } from 'next/server';
import { ordersStore, type Order, type OrderItem } from '@/lib/orders-store';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth-middleware';

export type { Order, OrderItem };

export async function POST(request: NextRequest) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    try {
      const orderData = await request.json();
      const {
        items,
        total,
        shipping,
        platformFee,
        shippingAddress,
        paymentMethod
      } = orderData;

      // Validate required fields
      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { error: 'Order items are required' },
          { status: 400 }
        );
      }

      if (!shippingAddress || !shippingAddress.email || !shippingAddress.firstName || !shippingAddress.lastName) {
        return NextResponse.json(
          { error: 'Complete shipping address is required' },
          { status: 400 }
        );
      }

      // Create order
      const order: Order = {
        id: 'order-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        userId: req.user!.id,
        items: items,
        total: total,
        shipping: shipping,
        platformFee: platformFee,
        status: 'pending',
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod || 'cod',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store order
      ordersStore.addOrder(order);
      
      console.log('Order created:', { 
        id: order.id, 
        userId: order.userId, 
        total: order.total,
        itemsCount: order.items.length 
      });

      return NextResponse.json({
        message: 'Order placed successfully',
        order: {
          id: order.id,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt
        }
      }, { status: 201 });

    } catch (error) {
      console.error('Order creation error:', error);
      return NextResponse.json(
        { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      );
    }
  })(request);
}

export async function GET(request: NextRequest) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    try {
      // Get user's orders
      const userOrders = ordersStore.getOrdersByUserId(req.user!.id);
      
      return NextResponse.json({
        orders: userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      });

    } catch (error) {
      console.error('Get orders error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  })(request);
}

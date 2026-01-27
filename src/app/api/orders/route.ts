import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ordersStore, type Order, type OrderItem } from '@/lib/orders-store';

export type { Order, OrderItem };

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Simple token verification (in production, use proper JWT verification)
    const token = authCookie.value;
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (!payload.userId) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

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
      userId: payload.userId,
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
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Simple token verification
    const token = authCookie.value;
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (!payload.userId) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user's orders
    const userOrders = ordersStore.getOrdersByUserId(payload.userId);
    
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
}

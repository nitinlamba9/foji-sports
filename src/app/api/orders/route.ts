import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth-middleware';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      
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

      // Create order with MongoDB
      const order = await Order.create({
        userId: req.user!.id,
        items: items,
        total: total,
        shipping: shipping,
        platformFee: platformFee,
        status: 'pending',
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod || 'cod',
      });
      
      console.log('Order created:', { 
        id: order._id, 
        userId: order.userId, 
        total: order.total,
        itemsCount: order.items.length 
      });

      return NextResponse.json({
        message: 'Order placed successfully',
        order: {
          id: order._id,
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
      await connectDB();
      
      // Get user's orders
      const userOrders = await Order.find({ userId: req.user!.id }).sort({ createdAt: -1 });
      
      return NextResponse.json({
        orders: userOrders
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

import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import Order from '@/models/Order';
import User from '@/models/User';
import { connectDB } from '@/lib/db';

export async function DELETE(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    await connectDB();
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ 
        error: 'Order ID is required' 
      }, { status: 400 });
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Order deleted successfully',
      orderId
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ 
      error: 'Failed to delete order' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    await connectDB();
    
    // Get all orders from MongoDB
    const allOrders = await Order.find().sort({ createdAt: -1 });
    
    // Enrich orders with user information
    const enrichedOrders = await Promise.all(
      allOrders.map(async (order) => {
        const user = await User.findById(order.userId);
        return {
          id: order._id,
          userId: order.userId,
          userName: user?.name || 'Unknown User',
          userEmail: user?.email || 'unknown@example.com',
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.items.length,
          products: order.items,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          shipping: order.shipping,
          platformFee: order.platformFee
        };
      })
    );

    return NextResponse.json({ 
      orders: enrichedOrders,
      totalOrders: enrichedOrders.length 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch orders' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    await connectDB();
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ 
        error: 'Order ID and status are required' 
      }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      { status }, 
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Order status updated successfully',
      orderId,
      status
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ 
      error: 'Failed to update order status' 
    }, { status: 500 });
  }
}

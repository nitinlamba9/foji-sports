import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import { ordersStore } from '@/lib/orders-store';
import { UserStore } from '@/lib/user-store';

export async function DELETE(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ 
        error: 'Order ID is required' 
      }, { status: 400 });
    }

    // Get all orders and remove the specified one
    const allOrders = ordersStore.getOrders();
    const filteredOrders = allOrders.filter(order => order.id !== orderId);
    
    // Update the orders store
    ordersStore.clearOrders();
    filteredOrders.forEach(order => ordersStore.addOrder(order));

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
    // Get all orders from the real orders store
    const allOrders = ordersStore.getOrders();
    
    // Enrich orders with user information
    const enrichedOrders = await Promise.all(
      allOrders.map(async (order) => {
        const user = await UserStore.findById(order.userId);
        return {
          id: order.id,
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
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ 
        error: 'Order ID and status are required' 
      }, { status: 400 });
    }

    // Update order status in the real orders store
    const updated = ordersStore.updateOrderStatus(orderId, status);

    if (updated) {
      return NextResponse.json({ 
        message: 'Order status updated successfully',
        orderId,
        status
      });
    } else {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ 
      error: 'Failed to update order status' 
    }, { status: 500 });
  }
}

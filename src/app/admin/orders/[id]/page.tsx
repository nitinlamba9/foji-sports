'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Printer, Package, User, MapPin, CreditCard, Calendar, DollarSign } from 'lucide-react';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  items: number;
  products: OrderItem[];
  shippingAddress: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: 'cod' | 'card' | 'upi';
  shipping: number;
  platformFee: number;
}

export default function AdminOrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const getOrderId = async () => {
      const resolvedParams = await params;
      const orderId = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
      if (orderId) {
        fetchOrder(orderId);
      }
    };
    
    getOrderId();
  }, [params]);

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders`);
      if (response.ok) {
        const data = await response.json();
        const foundOrder = data.orders.find((o: Order) => o.id === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found');
        }
      } else {
        setError('Failed to fetch order');
      }
    } catch (error) {
      setError('Error fetching order details');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: Order['status']) => {
    if (!order) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: order.id, status: newStatus }),
      });

      if (response.ok) {
        setOrder({ ...order, status: newStatus });
      } else {
        setError('Failed to update order status');
      }
    } catch (error) {
      setError('Error updating order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error || 'Order not found'}</div>
      </div>
    );
  }

  return (
    <>
      {/* Print-only content - hidden on screen, visible when printing */}
      <div className="hidden print:block">
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 0.2in;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            body {
              font-size: 12px;
              line-height: 1.4;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
            }
            
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            /* Hide all browser headers and footers */
            header, footer, nav, .header, .footer, .navigation {
              display: none !important;
              visibility: hidden !important;
            }
            
            /* Hide any potential header/footer elements */
            body > *:first-child,
            body > *:last-child {
              display: none !important;
            }
            
            /* Hide scrollbars */
            html, body {
              overflow: visible !important;
            }
            
            /* Hide any fixed or sticky elements */
            [style*="position: fixed"],
            [style*="position: sticky"] {
              display: none !important;
            }
            
            /* Hide any elements with common header/footer classes */
            [class*="header"], 
            [class*="footer"], 
            [class*="nav"],
            [class*="menu"] {
              display: none !important;
            }
            
            /* Ensure print content is visible */
            .hidden.print\\:block {
              display: block !important;
              visibility: visible !important;
            }
            
            /* Hide screen-only content */
            .print\\:hidden {
              display: none !important;
              visibility: hidden !important;
            }
          }
        `}</style>
        <div className="max-w-4xl mx-auto p-4">
          {/* Customer Information */}
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2">Customer Information</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Name:</span> {order.userName}
              </div>
              <div>
                <span className="text-gray-600">Phone:</span> {order.shippingAddress.phone}
              </div>
              <div>
                <span className="text-gray-600">Email:</span> {order.userEmail}
              </div>
              <div>
                <span className="text-gray-600">Order ID:</span> {order.id}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2">Shipping Address</h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2">Order Items</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Product ID</th>
                  <th className="text-center py-1">Qty</th>
                  <th className="text-right py-1">Price</th>
                  <th className="text-right py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-1">{item.productId}</td>
                    <td className="text-center py-1">{item.quantity}</td>
                    <td className="text-right py-1">{formatPrice(item.price)}</td>
                    <td className="text-right py-1">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Information */}
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2">Payment Information</h2>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.total - order.shipping - order.platformFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span>{formatPrice(order.platformFee)}</span>
                </div>
                <div className="border-t pt-1 mt-1">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen content - hidden when printing */}
      <div className="print:hidden">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Orders</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Printer className="w-4 h-4" />
                <span>Print Order</span>
              </button>
            </div>

            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h1>
                  <p className="text-gray-600">Order ID: {order.id}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">Updated: {formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Details */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{order.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{order.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{order.shippingAddress.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </h2>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="text-sm text-gray-500">{order.shippingAddress.email}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Items ({order.items})
                  </h2>
                  <div className="space-y-4">
                    {order.products.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-medium">Product ID: {item.productId}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.price)}</p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Order Status */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(e.target.value as Order['status'])}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {isUpdating && (
                    <p className="text-sm text-blue-600 mt-2">Updating status...</p>
                  )}
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method</span>
                      <span className="font-medium capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{formatPrice(order.total - order.shipping - order.platformFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>{formatPrice(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Platform Fee</span>
                      <span>{formatPrice(order.platformFee)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-bold text-blue-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Invoice</span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/orders')}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Back to Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

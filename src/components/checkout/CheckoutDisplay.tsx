'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  rating: number;
  reviews: number;
  colors?: { name: string; value: string }[];
  sizes?: string[];
}

export default function CheckoutDisplay() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    // Load products from API
    const loadProducts = async () => {
      try {
        console.log('CheckoutDisplay: Fetching products from API...');
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          console.log('CheckoutDisplay: Loaded', data.products.length, 'products from API');
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    // Load cart from localStorage
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        console.log('Raw cart from localStorage:', cart);
        
        // Merge duplicate items by productId, size, and color and sum quantities
        const mergedCart = cart.reduce((acc: CartItem[], item: CartItem) => {
          const existingItem = acc.find(i => 
            i.productId === item.productId && 
            i.size === item.size && 
            i.color === item.color
          );
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            acc.push({ ...item });
          }
          return acc;
        }, []);
        
        console.log('Merged cart:', mergedCart);
        setCartItems(mergedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
    loadCart();
  }, []);

  const getCartProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    console.log('Looking for product with ID:', productId, 'Found:', product, 'Available products:', products.map(p => p.id));
    return product;
  };

  const getColorName = (colorValue: string, productId: string) => {
    // First check if it's already a color name (not a hex code)
    if (!colorValue.startsWith('#')) {
      return colorValue;
    }
    
    // If it's a hex code, find the corresponding color name from the product
    const product = getCartProduct(productId);
    if (product && product.colors) {
      const colorOption = product.colors.find(c => c.value === colorValue);
      return colorOption?.name || colorValue;
    }
    
    return colorValue;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getCartProduct(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 999 ? 0 : 69;
  };

  const getRemainingForFreeShipping = () => {
    const subtotal = calculateSubtotal();
    return Math.max(0, 1000 - subtotal);
  };

  const calculatePlatformFee = () => {
    return 10; // Fixed platform fee of ₹10
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculatePlatformFee();
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Update order summary in sidebar - REMOVED since we now use OrderSummary component
  // useEffect(() => {
  //   const orderSummaryElement = document.getElementById('order-summary');
  //   if (orderSummaryElement) {
  //     console.log('Updating order summary:', { cartItems, products, isLoading });
  //     
  //     // Use innerHTML for simple HTML injection
  //     const summaryHTML = `
  //       <div class="space-y-4">
  //         ${cartItems.length === 0 ? `
  //           <div class="text-center py-8">
  //             <div class="w-12 h-12 text-gray-400 mx-auto mb-4">🛒</div>
  //             <p class="text-gray-600 mb-4">Your cart is empty</p>
  //             <a href="/shop" class="text-blue-600 hover:text-blue-700 font-medium">Continue Shopping</a>
  //           </div>
  //         ` : cartItems.map((item, index) => {
  //           const product = getCartProduct(item.productId);
  //           console.log('Product for item:', item.productId, product);
  //           if (!product) return '';
  //           
  //           const colorName = item.color ? getColorName(item.color, item.productId) : '';
  //           
  //           return `
  //             <div class="flex items-center space-x-3 pb-4 border-b">
  //               <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded" />
  //               <div class="flex-1 min-w-0">
  //                 <h4 class="text-sm font-medium text-gray-900 truncate">${product.name}</h4>
  //                 <div class="flex items-center space-x-2 text-xs text-gray-600">
  //                   ${item.size ? `<span>Size: ${item.size}</span>` : ''}
  //                   ${colorName ? `<span>Color: ${colorName}</span>` : ''}
  //                   <span>Qty: ${item.quantity}</span>
  //                 </div>
  //                 <p class="text-sm font-medium text-gray-900">${formatPrice(product.price * item.quantity)}</p>
  //               </div>
  //             </div>
  //           `;
  //         }).join('')}
  //         <div class="space-y-2 pt-4">
  //           <div class="flex justify-between text-sm">
  //             <span class="text-gray-600">Subtotal</span>
  //             <span class="font-medium">${formatPrice(calculateSubtotal())}</span>
  //           </div>
  //           <div class="flex justify-between text-sm">
  //             <span class="text-gray-600">Shipping</span>
  //             <span class="font-medium">
  //               ${calculateShipping() === 0 ? 
  //                 '<span class="text-green-600 font-semibold">🎉 Free Shipping! Your order qualifies for free delivery!</span>' : 
  //                 formatPrice(calculateShipping())
  //               }
  //             </span>
  //           </div>
  //           <div class="flex justify-between text-sm">
  //             <span class="text-gray-600">Platform Fee</span>
  //             <span class="font-medium">${formatPrice(calculatePlatformFee())}</span>
  //           </div>
  //           <div class="flex justify-between text-lg font-semibold pt-2 border-t">
  //             <span>Total</span>
  //             <span class="text-blue-600">${formatPrice(calculateTotal())}</span>
  //           </div>
  //         </div>
  //       </div>
  //     `;
  //     
  //     console.log('Setting innerHTML:', summaryHTML);
  //     orderSummaryElement.innerHTML = summaryHTML;
  //   }
  // }, [cartItems, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order data
      const orderData = {
        items: cartItems,
        total: calculateTotal(),
        shipping: calculateShipping(),
        platformFee: calculatePlatformFee(),
        shippingAddress: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country || 'India',
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      };

      // Submit order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || 'Failed to place order');
        return;
      }

      const data = await response.json();
      console.log('Order placed successfully:', data);

      // Clear cart and redirect to thank you page
      localStorage.setItem('cart', JSON.stringify([]));
      window.location.href = '/thank-you';
      
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add items to your cart to proceed with checkout</p>
          <Link
            href="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Checkout Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled
                />
                <span className="text-gray-400 line-through">Credit/Debit Card (Coming Soon)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled
                />
                <span className="text-gray-400 line-through">UPI Payment (Coming Soon)</span>
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : `Place Order • ${formatPrice(calculateTotal())}`}
            </button>
          </div>
        </form>
      </div>

      {/* Order Summary - This will be rendered in the sidebar */}
      <div id="order-summary-mobile" className="lg:hidden bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-4">
          {cartItems.map((item, index) => {
            const product = getCartProduct(item.productId);
            if (!product) return null;

            const colorName = item.color ? getColorName(item.color, item.productId) : '';
            
            return (
              <div key={`checkout-item-${item.productId}-${item.size || 'default'}-${item.color || 'default'}-${index}`} className="flex items-center space-x-3 pb-4 border-b">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    {item.size && <span>Size: {item.size}</span>}
                    {colorName && <span>Color: {colorName}</span>}
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(product.price * item.quantity)}</p>
                </div>
              </div>
            );
          })}

          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {calculateShipping() === 0 ? (
                  <span className="text-green-600 font-semibold">🎉 Free Shipping! Your order qualifies for free delivery!</span>
                ) : (
                  <div className="text-right">
                    <div className="text-orange-600 font-semibold">
                      Add {formatPrice(getRemainingForFreeShipping())} more for free delivery!
                    </div>
                    <div className="text-gray-600">{formatPrice(calculateShipping())}</div>
                  </div>
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-medium">{formatPrice(calculatePlatformFee())}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

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

interface OrderSummaryProps {
  className?: string;
}

export default function OrderSummary({ className = "" }: OrderSummaryProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load products from API
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          console.log('OrderSummary - Products loaded from API:', data.products);
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('OrderSummary - Error loading products:', error);
      }
    };

    // Load cart from localStorage
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        console.log('OrderSummary - Raw cart from localStorage:', cart);
        
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
        
        console.log('OrderSummary - Merged cart:', mergedCart);
        setCartItems(mergedCart);
      } catch (error) {
        console.error('OrderSummary - Error loading cart:', error);
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
    console.log('OrderSummary - Looking for product with ID:', productId, 'Found:', product, 'Available products:', products.map(p => p.id));
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

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      <div className="space-y-4">
        {cartItems.map((item, index) => {
          const product = getCartProduct(item.productId);
          if (!product) {
            console.log('OrderSummary - Product not found for item:', item);
            return null;
          }

          const colorName = item.color ? getColorName(item.color, item.productId) : '';
          
          return (
            <div key={`order-summary-item-${item.productId}-${item.size || 'default'}-${item.color || 'default'}-${index}`} className="flex items-center space-x-3 pb-4 border-b">
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
  );
}

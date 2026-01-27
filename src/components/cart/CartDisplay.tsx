'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

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

export default function CartDisplay() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Load products from API
    const loadProducts = async () => {
      try {
        console.log('CartDisplay: Fetching products from API...');
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          console.log('CartDisplay: Loaded', data.products.length, 'products from API');
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

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCart();
      }
    };

    // Listen for cart update messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CART_UPDATED') {
        loadCart();
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  const getCartProduct = (productId: string) => {
    return products.find(p => p.id === productId);
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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getCartProduct(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
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
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Add items to your cart to see them here.</p>
        <a href="/shop" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div>
      {showNotification && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
          <span>Product added to cart!</span>
        </div>
      )}
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Cart Items ({cartItems.length})
        </h2>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {cartItems.map((item, index) => {
          const product = getCartProduct(item.productId);
          if (!product) return null;

          return (
            <div key={`cart-item-${item.productId}-${item.size || 'default'}-${item.color || 'default'}-${index}`} className="flex items-center space-x-4 p-4 border rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                  {item.size && (
                    <span>Size: <span className="font-medium text-gray-900">{item.size}</span></span>
                  )}
                  {item.color && (
                    <span>Color: <span className="font-medium text-gray-900">{getColorName(item.color, item.productId)}</span></span>
                  )}
                </div>
                <p className="text-gray-600">{formatPrice(product.price)}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="font-semibold">{formatPrice(product.price * item.quantity)}</p>
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(calculateTotal())}</span>
        </div>
        <Link 
          href="/checkout"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

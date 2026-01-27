'use client';

import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  rating: number;
  reviews: number;
}

export default function WishlistDisplay() {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load products from API
    const loadProducts = async () => {
      try {
        console.log('WishlistDisplay: Fetching products from API...');
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          console.log('WishlistDisplay: Loaded', data.products.length, 'products from API');
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    // Load wishlist from API
    const loadWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const productIds = data.wishlist.map((item: any) => item.productId);
          setWishlistItems(productIds);
          console.log('WishlistDisplay: Loaded', productIds.length, 'wishlist items from API');
        } else {
          console.error('Failed to load wishlist:', response.status);
          setWishlistItems([]);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlistItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
    loadWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setWishlistItems(prev => prev.filter(id => id !== productId));
        console.log('Removed from wishlist:', productId);
      } else {
        console.error('Failed to remove from wishlist:', response.status);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const clearWishlist = async () => {
    // Remove all items one by one (since there's no bulk delete endpoint)
    const promises = wishlistItems.map(productId => removeFromWishlist(productId));
    await Promise.all(promises);
  };

  const addToCart = (productId: string) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const existingItem = cart.find((item: any) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          productId,
          quantity: 1,
          price: product.price
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };

  const getWishlistProduct = (productId: string) => {
    return products.find(p => p.id === productId);
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

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-6">Start adding items to your wishlist to see them here.</p>
        <a href="/shop" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Wishlist Items ({wishlistItems.length})
        </h2>
        <button
          onClick={clearWishlist}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {wishlistItems.map((productId, index) => {
          const product = getWishlistProduct(productId);
          if (!product) return null;

          return (
            <div key={`wishlist-item-${productId}-${index}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button
                  onClick={() => removeFromWishlist(productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
                {product.originalPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.reviews})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(productId)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

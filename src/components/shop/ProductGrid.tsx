'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import Button from '../ui/Button';
import { formatPrice } from '@/lib/utils';
import { useFilterContext } from '@/contexts/FilterContext';

export default function ProductGrid() {
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const { filteredProducts, hasActiveFilters } = useFilterContext();

  const addToCart = (productId: string) => {
    setCartItems([...cartItems, productId]);
    // In a real app, this would update the cart state and localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Get the product from filtered products
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      // Check if item already exists in cart
      const existingItem = cart.find((item: any) => item.productId === productId);
      if (existingItem) {
        // Update quantity if item exists
        existingItem.quantity += 1;
      } else {
        // Add new item if it doesn't exist
        cart.push({
          productId,
          quantity: 1,
          price: product.price
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };

  const toggleWishlist = async (productId: string) => {
    const isInWishlist = wishlistItems.includes(productId);
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setWishlistItems(wishlistItems.filter(id => id !== productId));
          console.log('Removed from wishlist:', productId);
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setWishlistItems([...wishlistItems, productId]);
          console.log('Added to wishlist:', productId);
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Load wishlist from API on component mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const productIds = data.wishlist.map((item: any) => item.productId);
          setWishlistItems(productIds);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };

    loadWishlist();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {hasActiveFilters ? 'Filtered Products' : 'All Products'}
        </h1>
        <div className="text-sm text-gray-600">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          {hasActiveFilters && ' (filtered)'}
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No products found matching your filters</p>
          <p className="text-gray-400">Try adjusting your filters or browse all products</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="relative">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative h-64 overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>
                </Link>
                
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      wishlistItems.includes(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-600 hover:text-red-500'
                    }`} 
                  />
                </button>
              </div>
              
              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.reviews})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
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
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={() => addToCart(product.id)}
                    disabled={cartItems.includes(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {cartItems.includes(product.id) ? 'Added' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

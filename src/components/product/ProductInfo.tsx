'use client';

import { useState } from 'react';
import { Star, ShoppingCart, Heart, Truck, Shield, RefreshCw, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  sizes: string[];
  colors: { name: string; value: string }[];
  inStock: boolean;
  category: string;
}

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.value || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const addToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert('Please select a size');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const colorName = product.colors.find(c => c.value === selectedColor)?.name || selectedColor;
    const existingItem = cart.find((item: any) => 
      item.productId === product.id && 
      item.size === selectedSize && 
      item.color === colorName
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        quantity,
        price: product.price,
        size: selectedSize,
        color: colorName
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
    
    // Trigger cart update notification
    window.postMessage({ type: 'CART_UPDATED', timestamp: Date.now() }, '*');
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInWishlist = wishlist.includes(product.id);

    if (isInWishlist) {
      const updatedWishlist = wishlist.filter((id: string) => id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
    } else {
      wishlist.push(product.id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600">{product.rating}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">{product.reviews} reviews</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Color: {product.colors.find(c => c.value === selectedColor)?.name}</h3>
          <div className="flex space-x-2">
            {product.colors.map((color) => (
              <button
                key={`${color.name}-${color.value}`}
                onClick={() => setSelectedColor(color.value)}
                className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.value
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {selectedColor === color.value && (
                  <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Size: {selectedSize && <span className="text-blue-600">{selectedSize}</span>}
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-4 border rounded-md text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center border border-gray-300 rounded-md py-2"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={addToCart}
          disabled={!product.inStock}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center ${
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
        <button
          onClick={toggleWishlist}
          className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Features */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Truck className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Free Delivery</p>
              <p className="text-sm text-gray-600">On orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Secure Payment</p>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Easy Returns</p>
              <p className="text-sm text-gray-600">7-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Offers</h3>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Get 10% off on your first order</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Free shipping on orders above ₹999</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Cash on delivery available</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Buy 2 get 5% extra discount</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

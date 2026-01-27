'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';

// Client component for real-time updates
export default function ProductPageClient({ product, relatedProducts }: { 
  product: any; 
  relatedProducts: any[] 
}) {
  const [currentProduct, setCurrentProduct] = useState(product);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Listen for product updates from admin dashboard
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PRODUCTS_UPDATED') {
        console.log('Products updated, checking if this product was affected...');
        setUpdating(true);
        // Re-fetch the specific product
        fetch(`/api/products`).then(res => res.json()).then(data => {
          const updatedProduct = data.products.find((p: any) => p.id === currentProduct.id);
          if (updatedProduct) {
            setCurrentProduct(updatedProduct);
          }
          setUpdating(false);
        });
      }
    };
    
    // Listen for localStorage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'PRODUCTS_UPDATED') {
        console.log('Products updated via localStorage, checking product...');
        setUpdating(true);
        fetch(`/api/products`).then(res => res.json()).then(data => {
          const updatedProduct = data.products.find((p: any) => p.id === currentProduct.id);
          if (updatedProduct) {
            setCurrentProduct(updatedProduct);
          }
          setUpdating(false);
        });
      }
    };
    
    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentProduct.id]);

  // Create proper color values for each color name
  const getColorValue = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Blue': '#3B82F6',
      'Red': '#EF4444',
      'Green': '#10B981',
      'Yellow': '#F59E0B',
      'Purple': '#8B5CF6',
      'Pink': '#EC4899',
      'Orange': '#F97316',
      'Brown': '#92400E',
      'Gray': '#6B7280',
      'Navy': '#1E3A8A',
      'Maroon': '#991B1B',
      'Teal': '#14B8A6',
      'Gold': '#F59E0B',
      'Silver': '#9CA3AF'
    };
    return colorMap[colorName] || '#6B7280'; // Default to gray if color not found
  };

  // Transform the current product data
  const transformedProduct = {
    id: currentProduct.id,
    name: currentProduct.name,
    slug: currentProduct.slug,
    price: currentProduct.price,
    originalPrice: currentProduct.originalPrice,
    rating: currentProduct.rating,
    reviews: currentProduct.reviews,
    description: currentProduct.description,
    specifications: {
      'Brand': currentProduct.brand,
      'SKU': currentProduct.sku,
      'Weight': currentProduct.weight,
      'Dimensions': currentProduct.dimensions,
      'Material': currentProduct.material,
      'Available Sizes': currentProduct.sizes.join(', '),
      'Color Options': currentProduct.colors.join(', '),
      'Stock': currentProduct.stock > 0 ? 'In Stock' : 'Out of Stock',
      'Category': currentProduct.category
    },
    features: currentProduct.tags,
    images: currentProduct.images.length > 0 ? currentProduct.images : [currentProduct.image],
    sizes: currentProduct.sizes,
    colors: currentProduct.colors.map((color: string) => ({ 
      name: color, 
      value: getColorValue(color) 
    })),
    inStock: currentProduct.stock > 0,
    category: currentProduct.category.toLowerCase()
  };

  const transformedRelatedProducts = relatedProducts.map(relatedProduct => ({
    id: relatedProduct.id,
    name: relatedProduct.name,
    slug: relatedProduct.slug,
    price: relatedProduct.price,
    originalPrice: relatedProduct.originalPrice,
    rating: relatedProduct.rating,
    reviews: relatedProduct.reviews,
    description: relatedProduct.description,
    images: relatedProduct.images.length > 0 ? relatedProduct.images : [relatedProduct.image],
    category: relatedProduct.category.toLowerCase()
  }));

  return (
    <main className="min-h-screen bg-gray-50">
      {updating && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
          <span>Product updated from admin dashboard!</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:text-gray-700">Shop</Link></li>
            <li>/</li>
            <li className="text-gray-900">{currentProduct.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery images={transformedProduct.images} name={transformedProduct.name} />
          <ProductInfo product={transformedProduct} />
        </div>

        {/* Product Information Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                Description
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Specifications
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Reviews
              </button>
            </nav>
          </div>

          <div className="py-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {transformedProduct.description}
              </p>

              <h4 className="text-md font-semibold mb-3">Key Features</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                {transformedProduct.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h3 className="text-lg font-semibold mb-6">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(transformedProduct.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">{key}</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {transformedRelatedProducts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedRelatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.slug}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group">
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {relatedProduct.originalPrice && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                          -{Math.round(((relatedProduct.originalPrice - relatedProduct.price) / relatedProduct.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(relatedProduct.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          ({relatedProduct.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            ₹{relatedProduct.price.toLocaleString('en-IN')}
                          </span>
                          {relatedProduct.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ₹{relatedProduct.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

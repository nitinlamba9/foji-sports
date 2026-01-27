'use client';

import { useState, useEffect } from 'react';

export default function TestFinalImagesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageStatus, setImageStatus] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products.slice(0, 6));
      
      // Test each image
      const status: {[key: string]: string} = {};
      data.products.slice(0, 6).forEach((product: any) => {
        const img = new Image();
        img.onload = () => {
          setImageStatus(prev => ({ ...prev, [product.id]: '✅ Loaded' }));
        };
        img.onerror = () => {
          setImageStatus(prev => ({ ...prev, [product.id]: '❌ Failed - Will use fallback' }));
        };
        img.src = product.image;
        status[product.id] = '⏳ Testing...';
      });
      setImageStatus(status);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Final Image Test - Featured Products</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Image Status Check:</h2>
          <div className="space-y-2 mb-6">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="ml-2 text-sm text-gray-600">{imageStatus[product.id]}</span>
                </div>
                <span className="text-sm">{product.image.substring(0, 50)}...</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Featured Products Display:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => {
                      console.error(`Failed to load: ${product.image}`);
                      // Try fallback
                      e.currentTarget.src = `https://picsum.photos/seed/${product.id}/300/200.jpg`;
                      e.currentTarget.onerror = () => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Failed';
                      };
                    }}
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
                  {product.discount && (
                    <span className="text-sm text-red-600">-{product.discount}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Links:</h2>
          <div className="space-y-2">
            <a href="/" className="block text-blue-600 hover:text-blue-700">
              → Home Page (Should work now!)
            </a>
            <a href="/test-image-fix" className="block text-blue-600 hover:text-blue-700">
              → Previous Image Fix Test
            </a>
            <a href="/shop" className="block text-blue-600 hover:text-blue-700">
              → Shop All Products
            </a>
          </div>
          
          <div className="mt-4 p-4 bg-green-50 rounded">
            <h3 className="font-semibold text-green-800 mb-2">Fix Applied:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✅ Updated all products to use reliable Unsplash URLs</li>
              <li>✅ Increased image size to 400x300 for better quality</li>
              <li>✅ Enhanced error handling with detailed logging</li>
              <li>✅ Multiple fallback levels implemented</li>
              <li>✅ Console debugging added</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function TestImageFixPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products.slice(0, 6));
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
        <h1 className="text-3xl font-bold mb-6">Featured Products Image Fix Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Featured Products with Fixed Images:</h2>
          
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
                      e.currentTarget.src = `https://picsum.photos/seed/${product.id}/300/200.jpg`;
                    }}
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.category}</p>
                <p className="text-xs text-gray-500 mb-2">Image: {product.image}</p>
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
              → Home Page (Featured Products)
            </a>
            <a href="/test-images" className="block text-blue-600 hover:text-blue-700">
              → Image Loading Test
            </a>
            <a href="/shop" className="block text-blue-600 hover:text-blue-700">
              → Shop All Products
            </a>
          </div>
          
          <div className="mt-4 p-4 bg-green-50 rounded">
            <h3 className="font-semibold text-green-800 mb-2">Image Fix Applied:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✅ Local fallback images created</li>
              <li>✅ Error handling implemented</li>
              <li>✅ Multiple fallback levels</li>
              <li>✅ Loading states added</li>
              <li>✅ Console logging for debugging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

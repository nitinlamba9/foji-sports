'use client';

import { useState, useEffect } from 'react';

export default function TestFeaturedProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      setProducts(data.products);
      
      // Filter featured products
      const featured = data.products.filter((product: any) => product.featured);
      setFeaturedProducts(featured);
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
        <h1 className="text-3xl font-bold mb-6">Featured Products System Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* All Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">All Products ({products.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <span className="ml-2 text-sm text-gray-600">{product.category}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.featured 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.featured ? 'Featured' : 'Regular'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Products ({featuredProducts.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {featuredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 border rounded bg-green-50">
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <span className="ml-2 text-sm text-gray-600">{product.category}</span>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    Featured
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Products Display */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Featured Products Display (Home Page)</h2>
          {featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No featured products found. Mark products as featured in the admin panel to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
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
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
                    {product.discount && (
                      <span className="text-sm text-red-600">-{product.discount}%</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      ⭐ Featured Product
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Links:</h2>
          <div className="space-y-2">
            <a href="/" className="block text-blue-600 hover:text-blue-700">
              → Home Page (Should show only featured products)
            </a>
            <a href="/shop" className="block text-blue-600 hover:text-blue-700">
              → Shop Page (Shows all products)
            </a>
            <a href="/admin" className="block text-blue-600 hover:text-blue-700">
              → Admin Panel (Mark products as featured)
            </a>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">Featured Products System:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Added `featured` boolean field to Product interface</li>
              <li>✅ Home page now filters products by `featured: true`</li>
              <li>✅ Shop page shows all products (featured and regular)</li>
              <li>✅ Admin panel can mark products as featured</li>
              <li>✅ Only featured products appear in home page section</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

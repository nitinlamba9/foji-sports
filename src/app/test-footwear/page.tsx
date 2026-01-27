'use client';

import { useState, useEffect } from 'react';

export default function TestFootwearPage() {
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
      
      // Filter for footwear products
      const footwearProducts = data.products.filter((product: any) => 
        product.category.toLowerCase() === 'footwear'
      );
      
      setProducts(footwearProducts);
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
        <h1 className="text-3xl font-bold mb-6">Footwear Category Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Found {products.length} Footwear Products:</h2>
          
          {products.length === 0 ? (
            <p className="text-red-600">No footwear products found!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.category}</p>
                  <p className="text-2xl font-bold text-blue-600">₹{product.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Links:</h2>
          <div className="space-y-2">
            <a href="/shop?category=footwear" className="block text-blue-600 hover:text-blue-700">
              → Shop Footwear Category
            </a>
            <a href="/shop" className="block text-blue-600 hover:text-blue-700">
              → Shop All Products
            </a>
            <a href="/" className="block text-blue-600 hover:text-blue-700">
              → Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

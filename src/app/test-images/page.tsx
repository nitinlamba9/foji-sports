'use client';

import { useState, useEffect } from 'react';

export default function TestImagesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageTests, setImageTests] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products);
      
      // Test each image
      const tests = data.products.slice(0, 6).map((product: any) => ({
        id: product.id,
        name: product.name,
        imageUrl: product.image,
        status: 'testing'
      }));
      
      setImageTests(tests);
      
      // Test image loading
      tests.forEach((test: any) => {
        const img = new Image();
        img.onload = () => {
          setImageTests(prev => 
            prev.map(t => t.id === test.id ? {...t, status: 'loaded'} : t)
          );
        };
        img.onerror = () => {
          setImageTests(prev => 
            prev.map(t => t.id === test.id ? {...t, status: 'error'} : t)
          );
        };
        img.src = test.imageUrl;
      });
      
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
        <h1 className="text-3xl font-bold mb-6">Image Loading Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Image Status:</h2>
          <div className="space-y-2">
            {imageTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{test.name}</span>
                  <span className="ml-2 text-sm text-gray-600">{test.imageUrl}</span>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  test.status === 'loaded' ? 'bg-green-100 text-green-800' :
                  test.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {test.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Image Display Test:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => {
                      console.error(`Failed to load image: ${product.image}`);
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-xs text-gray-500 break-all">{product.image}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Fallback Images Test:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Placeholder 1:</h4>
              <img src="https://via.placeholder.com/300x200?text=Product+1" alt="Test" className="w-full rounded" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Placeholder 2:</h4>
              <img src="https://picsum.photos/seed/product1/300/200.jpg" alt="Test" className="w-full rounded" />
            </div>
            <div>
              <h4 className="font-medium mb-2">Local Test:</h4>
              <img src="/athlete-image.jpg" alt="Test" className="w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

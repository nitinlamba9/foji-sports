'use client';

import { useState } from 'react';

export default function TestCategoriesPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testCategoryFilter = async (category: string) => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch(`/shop?category=${category}`);
      const text = await response.text();
      setResult(`Category: ${category}\nStatus: ${response.status}\n\nPage content preview:\n${text.substring(0, 500)}...`);
    } catch (error) {
      setResult('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Category Filter Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => testCategoryFilter('footwear')}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test Footwear
            </button>
            <button
              onClick={() => testCategoryFilter('apparel')}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Test Apparel
            </button>
            <button
              onClick={() => testCategoryFilter('equipment')}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Test Equipment
            </button>
            <button
              onClick={() => testCategoryFilter('accessories')}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Test Accessories
            </button>
          </div>
          
          {loading && <p className="text-gray-600">Loading...</p>}
          
          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {result}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Test Instructions:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Click the category buttons to test category filtering</li>
            <li>Each button tests a different category URL parameter</li>
            <li>Check if the shop page loads with the correct category filter applied</li>
            <li>Manual testing: Visit the shop page directly with category parameters</li>
          </ul>
          
          <div className="mt-4 space-y-2">
            <a href="/shop?category=footwear" className="block text-blue-600 hover:text-blue-700">
              → /shop?category=footwear
            </a>
            <a href="/shop?category=apparel" className="block text-blue-600 hover:text-blue-700">
              → /shop?category=apparel
            </a>
            <a href="/shop?category=equipment" className="block text-blue-600 hover:text-blue-700">
              → /shop?category=equipment
            </a>
            <a href="/shop?category=accessories" className="block text-blue-600 hover:text-blue-700">
              → /shop?category=accessories
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Suspense, useState, useEffect } from 'react';
import ProductGrid from '@/components/shop/ProductGrid';
import FilterSidebar from '@/components/shop/FilterSidebar';
import { FilterProvider, useFilterContext } from '@/contexts/FilterContext';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  category: string;
  status: string;
  description: string;
  image: string;
  images: string[];
  videos: string[];
  sku: string;
  brand: string;
  sizes: string[];
  colors: string[];
  weight: string;
  dimensions: string;
  material: string;
  tags: string[];
  rating: number;
  reviews: number;
  slug: string;
}

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const applyCachedProducts = () => {
      const cached = localStorage.getItem('PRODUCTS_CACHE');
      if (cached) {
        try {
          setProducts(JSON.parse(cached));
          setLoading(false);
        } catch (error) {
          console.error('Failed to parse product cache:', error);
        }
      }
    };

    applyCachedProducts();

    // Only fetch if no cache available
    if (!localStorage.getItem('PRODUCTS_CACHE')) {
      fetchProducts();
    }
    
    // Listen for product updates from admin dashboard
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PRODUCTS_UPDATED') {
        console.log('Products updated via message, refreshing shop page...');
        setUpdating(true);
        applyCachedProducts();
        fetchProducts({ silent: true });
      }
    };
    
    // Listen for localStorage changes (cross-tab communication)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'PRODUCTS_UPDATED') {
        console.log('Products updated via localStorage, refreshing shop page...');
        setUpdating(true);
        applyCachedProducts();
        fetchProducts({ silent: true });
      }
      if (event.key === 'PRODUCTS_CACHE' && event.newValue) {
        try {
          setProducts(JSON.parse(event.newValue));
        } catch (error) {
          console.error('Failed to parse product cache:', error);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorageChange);

    const channel = 'BroadcastChannel' in window ? new BroadcastChannel('products') : null;
    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.type === 'PRODUCTS_UPDATED') {
          console.log('Products updated via BroadcastChannel, refreshing shop page...');
          setUpdating(true);
          applyCachedProducts();
          fetchProducts({ silent: true });
        }
      };
    }
    
    // Also check for updates periodically as fallback
    const interval = setInterval(() => {
      applyCachedProducts();
    }, 3000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.close();
      }
      clearInterval(interval);
    };
  }, []);

  const fetchProducts = async ({ silent }: { silent?: boolean } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const response = await fetch(`/api/products?ts=${Date.now()}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      if (!silent) {
        setLoading(false);
      }
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg mb-4">Error loading products</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => fetchProducts()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <FilterProvider initialProducts={products} searchQuery={searchParams.get('search') || ''}>
      <ShopContentWithFilters
        searchParams={searchParams}
        updating={updating}
        fetchProducts={fetchProducts}
        products={products}
      />
    </FilterProvider>
  );
}

function ShopContentWithFilters({ searchParams, updating, fetchProducts, products }: { 
  searchParams: any; 
  updating: boolean; 
  fetchProducts: () => void; 
  products: Product[];
}) {
  const { updateFilters, filteredProducts, setProducts } = useFilterContext();

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  // Apply category filter from URL
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      updateFilters({ categories: [category] });
    }
  }, [searchParams, updateFilters]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
        <button
          onClick={() => fetchProducts()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Products
        </button>
      </div>
      
      {updating && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
          <span>Products updated from admin dashboard!</span>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:w-64">
          <FilterSidebar />
        </div>
        
        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}

function ShopPageWrapper() {
  return <ShopContent />;
}

function ShopPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPageWrapper />
    </Suspense>
  );
}

export default function ShopPage() {
  return (
    <main className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopPageWithSuspense />
      </div>
    </main>
  );
}

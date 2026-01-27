'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface Filters {
  categories: string[];
  priceRange: { min: number; max: number } | null;
  brands: string[];
  rating: number | null;
  search: string;
}

interface FilterContextType {
  filters: Filters;
  filteredProducts: Product[];
  updateFilters: (newFilters: Partial<Filters>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  setProducts: (products: Product[]) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children, initialProducts, searchQuery }: { children: ReactNode; initialProducts?: Product[]; searchQuery?: string }) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: null,
    brands: [],
    rating: null,
    search: searchQuery || ''
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Initialize products if provided
  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  // Update search filter when searchQuery changes
  useEffect(() => {
    if (searchQuery !== undefined) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
  }, [searchQuery]);

  useEffect(() => {
    let filtered = products;

    // Filter by categories (case-insensitive)
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.some(category => 
          product.category.toLowerCase() === category.toLowerCase()
        )
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange!.min && 
        product.price <= filters.priceRange!.max
      );
    }

    // Filter by brands (if products had brand property)
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && filters.brands.includes(product.brand)
      );
    }

    // Filter by rating
    if (filters.rating !== null) {
      filtered = filtered.filter(product => product.rating >= filters.rating!);
    }

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: null,
      brands: [],
      rating: null,
      search: ''
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.priceRange !== null || 
    filters.brands.length > 0 || 
    filters.rating !== null || 
    filters.search !== '';

  return (
    <FilterContext.Provider value={{
      filters,
      filteredProducts,
      updateFilters,
      clearFilters,
      hasActiveFilters,
      setProducts
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}

'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  slug: string;
  category: string;
  brand?: string;
}

interface Filters {
  categories: string[];
  priceRange: { min: number; max: number } | null;
  brands: string[];
  rating: number | null;
  search: string;
}

export function useFilters(initialProducts: Product[]) {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: null,
    brands: [],
    rating: null,
    search: ''
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    let filtered = initialProducts;

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
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
  }, [filters, initialProducts]);

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

  return {
    filters,
    filteredProducts,
    updateFilters,
    clearFilters,
    hasActiveFilters
  };
}

'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter, Search } from 'lucide-react';
import { useFilterContext } from '@/contexts/FilterContext';

const categories = [
  { name: 'Sports Shoes', count: 24, value: 'shoes' },
  { name: 'Sports Apparel', count: 18, value: 'apparel' },
  { name: 'Sports Equipment', count: 32, value: 'equipment' },
  { name: 'Accessories', count: 15, value: 'accessories' }
];

const priceRanges = [
  { name: 'Under ₹500', min: 0, max: 500 },
  { name: '₹500 - ₹1000', min: 500, max: 1000 },
  { name: '₹1000 - ₹3000', min: 1000, max: 3000 },
  { name: '₹3000 - ₹5000', min: 3000, max: 5000 },
  { name: 'Over ₹5000', min: 5000, max: Infinity }
];

const brands = [
  { name: 'Nike', count: 28 },
  { name: 'Adidas', count: 22 },
  { name: 'Puma', count: 18 },
  { name: 'Reebok', count: 15 },
  { name: 'Under Armour', count: 12 }
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function FilterSidebar() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { filters, updateFilters, clearFilters, hasActiveFilters, setProducts, filteredProducts } = useFilterContext();
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Initialize products when component mounts (only if not already initialized)
  useEffect(() => {
    if (filteredProducts.length === 0) {
      const initialProducts = [
        {
          id: 1,
          name: 'Professional Running Shoes',
          price: 2999,
          originalPrice: 3999,
          rating: 4.5,
          reviews: 128,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
          slug: 'professional-running-shoes',
          category: 'shoes'
        },
        {
          id: 2,
          name: 'Sports Performance T-Shirt',
          price: 599,
          originalPrice: 799,
          rating: 4.3,
          reviews: 89,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
          slug: 'sports-performance-tshirt',
          category: 'apparel'
        },
        {
          id: 3,
          name: 'Cricket Bat Professional',
          price: 4999,
          originalPrice: 6999,
          rating: 4.7,
          reviews: 67,
          image: 'https://images.unsplash.com/photo-1517465788289-56d7e2b1c1f6?w=300&h=300&fit=crop',
          slug: 'cricket-bat-professional',
          category: 'equipment'
        },
        {
          id: 4,
          name: 'Yoga Mat Premium',
          price: 1299,
          originalPrice: 1799,
          rating: 4.4,
          reviews: 156,
          image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&h=300&fit=crop',
          slug: 'yoga-mat-premium',
          category: 'accessories'
        },
        {
          id: 5,
          name: 'Basketball Shoes Pro',
          price: 3499,
          originalPrice: 4499,
          rating: 4.6,
          reviews: 92,
          image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
          slug: 'basketball-shoes-pro',
          category: 'shoes'
        },
        {
          id: 6,
          name: 'Sports Shorts',
          price: 799,
          originalPrice: 999,
          rating: 4.2,
          reviews: 73,
          image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop',
          slug: 'sports-shorts',
          category: 'apparel'
        }
      ];
      setProducts(initialProducts);
    }
  }, [filteredProducts.length, setProducts]);

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    updateFilters({ categories: newCategories });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    updateFilters({ brands: newBrands });
  };

  const setPriceRangeFilter = (min: number, max: number) => {
    updateFilters({ priceRange: { min, max } });
  };

  const handleCustomPriceRange = () => {
    const min = parseInt(priceRange.min) || 0;
    const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
    setPriceRangeFilter(min, max);
  };

  const setRatingFilter = (rating: number) => {
    updateFilters({ rating: filters.rating === rating ? null : rating });
  };

  const filterContent = (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <FilterSection title="Categories">
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category.value)}
                onChange={() => toggleCategory(category.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category.name}</span>
              <span className="ml-auto text-xs text-gray-500">({category.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label key={index} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                onChange={() => setPriceRangeFilter(range.min, range.max)}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{range.name}</span>
            </label>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
            />
          </div>
          <button
            onClick={handleCustomPriceRange}
            className="mt-2 w-full text-xs bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </FilterSection>

      <FilterSection title="Brands">
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand.name} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.name)}
                onChange={() => toggleBrand(brand.name)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{brand.name}</span>
              <span className="ml-auto text-xs text-gray-500">({brand.count})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => setRatingFilter(rating)}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${
                      i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-700">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar - Always Visible */}
      <div className="hidden lg:block lg:w-64">
        {filterContent}
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {filterContent}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

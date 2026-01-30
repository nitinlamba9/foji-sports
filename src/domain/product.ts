// CANONICAL PRODUCT DOMAIN MODEL
// This is the single source of truth for all Product-related types
// No component, API, or service should define its own Product shape

export type ProductStatus = 'active' | 'inactive' | 'draft';

export interface ProductDimensions {
  length: string;
  width: string;
  height: string;
}

export interface ProductVariant {
  size?: string;
  color?: string;
  stock: number;
  price?: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// === CANONICAL PRODUCT TYPE ===
// This is the ONLY Product type in the entire system
export interface Product {
  // Core identifiers
  id: string;
  slug: string;
  sku: string;
  
  // Basic info
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand: string;
  
  // Pricing
  price: number;
  originalPrice?: number;
  discount?: number;
  
  // Inventory
  stock: number;
  status: ProductStatus;
  featured: boolean;
  
  // Physical properties
  weight?: string;
  dimensions?: ProductDimensions;
  material?: string;
  
  // Variants
  sizes: string[];
  colors: string[];
  
  // Media
  images: ProductImage[];
  videos: string[];
  
  // Social proof
  rating: number;
  numReviews: number;
  reviews: ProductReview[];
  
  // Metadata
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// === INPUT TYPES ===
// For API endpoints and forms

export interface CreateProductInput {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: ProductStatus;
  featured?: boolean;
  weight?: string;
  dimensions?: ProductDimensions;
  material?: string;
  sizes: string[];
  colors: string[];
  images: ProductImage[];
  videos?: string[];
  tags: string[];
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  stock?: number;
  status?: ProductStatus;
  featured?: boolean;
  weight?: string;
  dimensions?: ProductDimensions;
  material?: string;
  sizes?: string[];
  colors?: string[];
  images?: ProductImage[];
  videos?: string[];
  tags?: string[];
}

// === VIEW MODELS ===
// For UI components that need partial data

export type ProductListItem = Pick<
  Product,
  'id' | 'slug' | 'name' | 'price' | 'originalPrice' | 'rating' | 
  'numReviews' | 'category' | 'brand' | 'featured' | 'images'
>;

export type ProductCard = Pick<
  Product,
  'id' | 'slug' | 'name' | 'price' | 'originalPrice' | 'rating' | 
  'numReviews' | 'images' | 'category' | 'brand'
>;

export type ProductDetail = Product; // Full product for detail page

export type ProductAdmin = Product; // Full product for admin

// === FILTER TYPES ===

export interface ProductFilter {
  search?: string;
  category?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  status?: ProductStatus;
  featured?: boolean;
  tags?: string[];
}

// === VALIDATION HELPERS ===

export function isValidProductStatus(status: string): status is ProductStatus {
  return ['active', 'inactive', 'draft'].includes(status);
}

export function isValidProduct(product: unknown): product is Product {
  const p = product as any;
  return (
    typeof p.id === 'string' &&
    typeof p.slug === 'string' &&
    typeof p.name === 'string' &&
    typeof p.price === 'number' &&
    typeof p.stock === 'number' &&
    isValidProductStatus(p.status)
  );
}

// === TRANSFORM HELPERS ===

export function toProductListItem(product: Product): ProductListItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating,
    numReviews: product.numReviews,
    category: product.category,
    brand: product.brand,
    featured: product.featured,
    images: product.images
  };
}

export function toProductCard(product: Product): ProductCard {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating,
    numReviews: product.numReviews,
    images: product.images,
    category: product.category,
    brand: product.brand
  };
}

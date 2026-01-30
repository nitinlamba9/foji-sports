// MIGRATION ADAPTER - LEGACY ADMIN DASHBOARD
// 
// PURPOSE: Temporary bridge between canonical Product domain and legacy AdminDashboard
// STATUS: TECHNICAL DEBT - TO BE DELETED AFTER ADMIN DASHBOARD REWRITE
// 
// This adapter exists because AdminDashboard was built with UI-driven assumptions
// about Product structure. Instead of rewriting AdminDashboard now (scope explosion),
// we create an explicit adapter that isolates the mess.
//
// RULES:
// - AdminDashboard ONLY knows about LegacyAdminProduct
// - Rest of app ONLY knows about canonical Product
// - All conversions are explicit, no silent casting
// - This file is frozen once working - no new features here

import { Product, ProductStatus, ProductImage, ProductDimensions } from '@/domain/product';

// === LEGACY ADMIN PRODUCT TYPE ===
// This is the ugly, UI-driven structure AdminDashboard expects
// DO NOT extend this. DO NOT reuse this elsewhere.
export interface LegacyAdminProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number; // AdminDashboard still uses this
  stock: number;
  category: string;
  status: 'active' | 'inactive' | string; // AdminDashboard allows string
  featured: boolean;
  description?: string;
  image?: string; // AdminDashboard expects single image
  images?: string[]; // Sometimes expects array
  videos?: string[];
  sku?: string;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  weight?: string;
  dimensions?: string; // AdminDashboard expects string
  material?: string;
  tags?: string[];
  rating?: number;
  reviews?: number;
  reviewText?: string; // AdminDashboard-specific field
  slug?: string;
}

// === ADAPTER FUNCTIONS ===
// Explicit conversions - no silent casting, no "as any"

export function toCanonicalProduct(legacy: LegacyAdminProduct): Product {
  // Convert dimensions from string to object if needed
  let dimensions: ProductDimensions | undefined;
  if (legacy.dimensions) {
    // Try to parse "30cm x 20cm x 10cm" format
    const parts = legacy.dimensions.split('x').map(p => p.trim());
    if (parts.length === 3) {
      dimensions = {
        length: parts[0],
        width: parts[1],
        height: parts[2]
      };
    }
  }

  // Convert images to ProductImage array
  const images: ProductImage[] = [];
  if (legacy.image) {
    images.push({
      url: legacy.image,
      alt: legacy.name || 'Product image',
      isPrimary: true
    });
  }
  if (legacy.images && Array.isArray(legacy.images)) {
    legacy.images.forEach((imgUrl, index) => {
      if (imgUrl && !images.find(img => img.url === imgUrl)) {
        images.push({
          url: imgUrl,
          alt: legacy.name || `Product image ${index + 1}`,
          isPrimary: images.length === 0
        });
      }
    });
  }

  // Validate status
  let status: ProductStatus = 'active';
  if (legacy.status === 'active' || legacy.status === 'inactive' || legacy.status === 'draft') {
    status = legacy.status;
  } else {
    console.warn(`Invalid product status: ${legacy.status}, defaulting to 'active'`);
  }

  return {
    // Core identifiers
    id: legacy.id,
    slug: legacy.slug || generateSlugFromName(legacy.name),
    sku: legacy.sku || `SKU-${legacy.id}`,
    
    // Basic info
    name: legacy.name,
    description: legacy.description || '',
    category: legacy.category,
    subcategory: undefined, // AdminDashboard doesn't have this
    brand: legacy.brand || '',
    
    // Pricing
    price: legacy.price,
    originalPrice: legacy.originalPrice,
    discount: legacy.discount,
    
    // Inventory
    stock: legacy.stock,
    status: status,
    featured: legacy.featured || false,
    
    // Physical properties
    weight: legacy.weight,
    dimensions: dimensions,
    material: legacy.material,
    
    // Variants
    sizes: legacy.sizes || [],
    colors: legacy.colors || [],
    
    // Media
    images: images,
    videos: legacy.videos || [],
    
    // Social proof
    rating: legacy.rating || 0,
    numReviews: legacy.reviews || 0,
    reviews: [], // AdminDashboard doesn't have detailed reviews
    
    // Metadata
    tags: legacy.tags || [],
    createdAt: new Date(), // AdminDashboard doesn't track this
    updatedAt: new Date()
  };
}

export function toLegacyAdminProduct(product: Product): LegacyAdminProduct {
  // Convert dimensions back to string
  let dimensions: string | undefined;
  if (product.dimensions) {
    dimensions = `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height}`;
  }

  // Convert ProductImage array to single image + array
  let image: string | undefined;
  const images: string[] = [];
  
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
    image = primaryImage.url;
    images.push(...product.images.map(img => img.url));
  }

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    stock: product.stock,
    category: product.category,
    status: product.status,
    featured: product.featured,
    description: product.description,
    image: image,
    images: images,
    videos: product.videos,
    sku: product.sku,
    brand: product.brand,
    sizes: product.sizes,
    colors: product.colors,
    weight: product.weight,
    dimensions: dimensions,
    material: product.material,
    tags: product.tags,
    rating: product.rating,
    reviews: product.numReviews,
    reviewText: '', // AdminDashboard-specific, not in canonical
    slug: product.slug
  };
}

// === VALIDATION HELPERS ===

export function isValidLegacyAdminProduct(obj: any): obj is LegacyAdminProduct {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.stock === 'number' &&
    typeof obj.category === 'string'
  );
}

// === UTILITIES ===

function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// === MIGRATION CHECKLIST ===
// When rewriting AdminDashboard, ensure these are addressed:
// 
// [ ] Remove discount field (use originalPrice instead)
// [ ] Remove reviewText field (use proper reviews array)
// [ ] Fix dimensions to use ProductDimensions object
// [ ] Fix images to use ProductImage array
// [ ] Remove status: string allowance
// [ ] Add proper subcategory support
// [ ] Add proper createdAt/updatedAt tracking
// [ ] Remove sku generation fallback
// [ ] Add proper validation
// [ ] Remove this adapter file

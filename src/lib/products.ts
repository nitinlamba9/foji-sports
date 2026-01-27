// Shared product data between admin and shop
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  featured: boolean;
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

// Initial mock products data
const initialMockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Professional Running Shoes',
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    stock: 50,
    category: 'Footwear',
    status: 'active',
    featured: true,
    description: 'Professional running shoes designed for serious athletes and fitness enthusiasts. Features advanced cushioning technology and breathable mesh upper.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'],
    videos: [],
    sku: 'SHOES-001',
    brand: 'Nike',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Blue', 'Red'],
    weight: '280g',
    dimensions: '30x20x10 cm',
    material: 'Synthetic Mesh, Rubber',
    tags: ['running', 'sports', 'fitness', 'athletic'],
    rating: 4.5,
    reviews: 128,
    slug: 'professional-running-shoes'
  },
  {
    id: 'product-2',
    name: 'Premium Sports T-Shirt',
    price: 499,
    originalPrice: 799,
    discount: 38,
    stock: 100,
    category: 'Apparel',
    status: 'active',
    featured: true,
    description: 'Comfortable and breathable sports t-shirt made from moisture-wicking fabric. Perfect for workouts, running, and casual wear.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'],
    videos: [],
    sku: 'SHIRT-001',
    brand: 'Adidas',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Red', 'Black', 'White', 'Gray'],
    weight: '180g',
    dimensions: '70x50x2 cm',
    material: '100% Cotton',
    tags: ['sports', 'casual', 'workout', 'breathable'],
    rating: 4.3,
    reviews: 89,
    slug: 'premium-sports-tshirt'
  },
  {
    id: 'product-3',
    name: 'Professional Yoga Mat',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    stock: 25,
    category: 'Equipment',
    status: 'active',
    featured: true,
    description: 'Non-slip yoga mat with extra cushioning for comfort during practice. Features alignment lines and carrying strap.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop'],
    videos: [],
    sku: 'YOGA-001',
    brand: 'Reebok',
    sizes: ['Standard'],
    colors: ['Purple', 'Blue', 'Pink', 'Green'],
    weight: '1.2kg',
    dimensions: '183x61x0.6 cm',
    material: 'TPE Foam',
    tags: ['yoga', 'fitness', 'exercise', 'meditation'],
    rating: 4.4,
    reviews: 156,
    slug: 'professional-yoga-mat'
  },
  {
    id: 'product-6',
    name: 'Basketball Shoes',
    price: 3299,
    originalPrice: 4999,
    discount: 34,
    stock: 30,
    category: 'Footwear',
    status: 'active',
    featured: false,
    description: 'High-performance basketball shoes with excellent ankle support and grip. Designed for indoor and outdoor basketball courts.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'],
    videos: [],
    sku: 'BASKETBALL-001',
    brand: 'Nike',
    sizes: ['8', '9', '10', '11', '12'],
    colors: ['Black/Red', 'White/Blue', 'Black/White'],
    weight: '350g',
    dimensions: '32x22x12 cm',
    material: 'Synthetic Leather, Rubber',
    tags: ['basketball', 'sports', 'athletic', 'court'],
    rating: 4.6,
    reviews: 92,
    slug: 'basketball-shoes'
  },
  {
    id: 'product-7',
    name: 'Training Sneakers',
    price: 1899,
    originalPrice: 2799,
    discount: 32,
    stock: 60,
    category: 'Footwear',
    status: 'active',
    featured: false,
    description: 'Versatile training sneakers perfect for gym workouts, cross-training, and casual wear. Features breathable mesh and cushioned sole.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop'],
    videos: [],
    sku: 'SNEAKERS-001',
    brand: 'Puma',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'White', 'Gray', 'Blue'],
    weight: '300g',
    dimensions: '30x20x10 cm',
    material: 'Mesh, Synthetic, Rubber',
    tags: ['training', 'gym', 'fitness', 'casual'],
    rating: 4.4,
    reviews: 156,
    slug: 'training-sneakers'
  },
  {
    id: 'product-8',
    name: 'Sports Jacket',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    stock: 40,
    category: 'Apparel',
    status: 'active',
    featured: false,
    description: 'Lightweight sports jacket with water-resistant fabric. Perfect for outdoor activities and layering during workouts.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop'],
    videos: [],
    sku: 'JACKET-001',
    brand: 'Adidas',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Blue', 'Red', 'Gray'],
    weight: '450g',
    dimensions: '60x45x5 cm',
    material: 'Polyester, Nylon',
    tags: ['jacket', 'outerwear', 'sports', 'outdoor'],
    rating: 4.5,
    reviews: 78,
    slug: 'sports-jacket'
  },
  {
    id: 'product-9',
    name: 'Dumbbells Set',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    stock: 15,
    category: 'Equipment',
    status: 'active',
    featured: false,
    description: 'Adjustable dumbbells set with weights ranging from 2.5kg to 20kg. Perfect for home workouts and strength training.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'],
    videos: [],
    sku: 'DUMBBELLS-001',
    brand: 'Reebok',
    sizes: ['2.5kg-20kg'],
    colors: ['Black', 'Gray'],
    weight: '20kg',
    dimensions: '40x20x20 cm',
    material: 'Cast Iron, Rubber',
    tags: ['weights', 'strength', 'fitness', 'home-gym'],
    rating: 4.7,
    reviews: 112,
    slug: 'dumbbells-set'
  },
  {
    id: 'product-10',
    name: 'Sports Backpack',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    stock: 35,
    category: 'Accessories',
    status: 'active',
    featured: false,
    description: 'Spacious sports backpack with multiple compartments for gym essentials, laptop sleeve, and water bottle holder.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'],
    videos: [],
    sku: 'BACKPACK-001',
    brand: 'Nike',
    sizes: ['One Size'],
    colors: ['Black', 'Blue', 'Gray', 'Red'],
    weight: '600g',
    dimensions: '50x30x20 cm',
    material: 'Polyester, Nylon',
    tags: ['backpack', 'gym', 'sports', 'travel'],
    rating: 4.3,
    reviews: 89,
    slug: 'sports-backpack'
  },
  {
    id: 'product-4',
    name: 'Insulated Sports Water Bottle',
    price: 249,
    originalPrice: 399,
    discount: 38,
    stock: 8,
    category: 'Accessories',
    status: 'active',
    featured: true,
    description: 'Insulated sports water bottle that keeps drinks cold for hours. Features leak-proof design and easy-to-clean construction.',
    image: 'https://images.unsplash.com/photo-1602143403490-42c643fdadc1?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1602143403490-42c643fdadc1?w=400&h=300&fit=crop'],
    videos: [],
    sku: 'BOTTLE-001',
    brand: 'Puma',
    sizes: ['750ml', '1L'],
    colors: ['Black', 'Blue', 'Red', 'Green'],
    weight: '250g',
    dimensions: '7.5x7.5x27 cm',
    material: 'Stainless Steel, BPA-Free Plastic',
    tags: ['hydration', 'sports', 'outdoor', 'fitness'],
    rating: 4.2,
    reviews: 73,
    slug: 'insulated-sports-water-bottle'
  },
  {
    id: 'product-5',
    name: 'Training Shorts',
    price: 799,
    originalPrice: 999,
    discount: 20,
    stock: 45,
    category: 'Apparel',
    status: 'active',
    featured: false,
    description: 'Comfortable training shorts made from stretchable fabric. Perfect for workouts, running, and casual wear.',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=300&fit=crop'],
    videos: [],
    sku: 'SHORTS-001',
    brand: 'Under Armour',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Gray', 'Red'],
    weight: '220g',
    dimensions: '50x35x2 cm',
    material: 'Polyester-Spandex Blend',
    tags: ['shorts', 'training', 'fitness', 'athletic'],
    rating: 4.1,
    reviews: 64,
    slug: 'training-shorts'
  },
  {
    id: 'product-11',
    name: 'Digital Sports Watch',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    stock: 25,
    category: 'Accessories',
    status: 'active',
    featured: false,
    description: 'Advanced digital sports watch with heart rate monitoring, GPS tracking, and water resistance.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'],
    videos: [],
    sku: 'WATCH-001',
    brand: 'Garmin',
    sizes: ['One Size'],
    colors: ['Black', 'Silver', 'Blue'],
    weight: '52g',
    dimensions: '4.7x4.7x1.3 cm',
    material: 'Stainless Steel, Silicone',
    tags: ['fitness', 'tracking', 'smartwatch', 'outdoor'],
    rating: 4.6,
    reviews: 92,
    slug: 'digital-sports-watch'
  }
];

// Use globalThis to persist products across API requests
declare global {
  var __mockProducts: Product[] | undefined;
}

// Initialize global products if not already done
if (!globalThis.__mockProducts) {
  globalThis.__mockProducts = [...initialMockProducts];
}

// Export functions to access the persistent products
export function getMockProducts(): Product[] {
  return globalThis.__mockProducts || [];
}

export function setMockProducts(products: Product[]): void {
  globalThis.__mockProducts = products;
}

// Legacy export for compatibility
export const mockProducts = getMockProducts();

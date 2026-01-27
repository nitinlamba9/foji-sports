export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  brand: string;
  images: string[];
  sizes: Size[];
  colors: Color[];
  stock: number;
  rating: number;
  numReviews: number;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Size {
  name: string;
  stock: number;
}

export interface Color {
  name: string;
  code: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

export interface Review {
  _id: string;
  user: User;
  product: Product;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position: 'hero' | 'category' | 'offer';
  isActive: boolean;
  order: number;
  createdAt: Date;
}

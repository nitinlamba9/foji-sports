import mongoose, { Schema } from 'mongoose';
import { Product, ProductStatus, ProductImage, ProductDimensions } from '../domain/product';

const productImageSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

const productDimensionsSchema = new Schema({
  length: { type: String, required: true },
  width: { type: String, required: true },
  height: { type: String, required: true }
}, { _id: false });

const productSchema = new Schema<Product>({
  // Core identifiers
  id: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  sku: { type: String, required: true, unique: true },
  
  // Basic info
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['shoes', 'apparel', 'equipment', 'accessories']
  },
  subcategory: {
    type: String,
    required: false
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  
  // Inventory
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // Physical properties
  weight: { type: String },
  dimensions: { type: productDimensionsSchema },
  material: { type: String },
  
  // Variants
  sizes: [{ type: String }],
  colors: [{ type: String }],
  
  // Media
  images: [productImageSchema],
  videos: [{ type: String }],
  
  // Social proof
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0,
    min: [0, 'Number of reviews cannot be negative']
  },
  reviews: [{
    id: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Metadata
  tags: [{ type: String, trim: true }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      // Use object destructuring to exclude _id and __v
      const { _id, __v, ...result } = ret;
      return result;
    }
  }
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ featured: -1 });
productSchema.index({ status: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ createdAt: -1 });

const ProductModel = mongoose.models.Product || mongoose.model<Product>('Product', productSchema);

export default ProductModel;

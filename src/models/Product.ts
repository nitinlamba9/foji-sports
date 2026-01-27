import mongoose, { Schema } from 'mongoose';
import { Product as IProduct } from '../types';

const sizeSchema = new Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 }
}, { _id: false });

const colorSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 }
}, { _id: false });

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['shoes', 'apparel', 'equipment', 'accessories']
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  sizes: [sizeSchema],
  colors: [colorSchema],
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
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
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ featured: -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;

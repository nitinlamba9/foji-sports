import mongoose, { Schema } from 'mongoose';
import { Banner as IBanner } from '../types';

const bannerSchema = new Schema<IBanner>({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  image: {
    type: String,
    required: [true, 'Banner image is required']
  },
  link: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    enum: ['hero', 'category', 'offer'],
    required: [true, 'Banner position is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

bannerSchema.index({ position: 1, order: 1 });
bannerSchema.index({ isActive: 1 });

const Banner = mongoose.models.Banner || mongoose.model<IBanner>('Banner', bannerSchema);

export default Banner;

import { NextRequest, NextResponse } from 'next/server';
import Wishlist from '@/models/Wishlist';
import { requireAuth, type AuthenticatedRequest } from '@/lib/auth-middleware';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  console.log('Wishlist GET API called');
  return requireAuth(async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      console.log('User authenticated:', req.user!.id);

      // Get user's wishlist items from MongoDB
      const userWishlistItems = await Wishlist.find({ userId: req.user!.id })
        .populate('productId')
        .sort({ addedAt: -1 });
      
      console.log('Found wishlist items:', userWishlistItems.length);
      
      return NextResponse.json({
        wishlist: userWishlistItems,
        count: userWishlistItems.length
      });

    } catch (error) {
      console.error('Get wishlist error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  })(request);
}

export async function POST(request: NextRequest) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      
      const { productId } = await request.json();

      if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
      }

      // Check if item already exists
      const existingItem = await Wishlist.findOne({ 
        userId: req.user!.id, 
        productId 
      });
      
      if (existingItem) {
        return NextResponse.json({ error: 'Item already in wishlist' }, { status: 409 });
      }

      // Add new item
      const newItem = await Wishlist.create({
        userId: req.user!.id,
        productId,
      });

      // Populate product details
      await newItem.populate('productId');

      return NextResponse.json({
        message: 'Item added to wishlist',
        item: newItem
      }, { status: 201 });

    } catch (error) {
      console.error('Add to wishlist error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  })(request);
}

export async function DELETE(request: NextRequest) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    try {
      await connectDB();
      
      const { productId } = await request.json();

      if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
      }

      // Remove item
      const deletedItem = await Wishlist.findOneAndDelete({
        userId: req.user!.id,
        productId
      });
      
      if (!deletedItem) {
        return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Item removed from wishlist'
      });

    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  })(request);
}

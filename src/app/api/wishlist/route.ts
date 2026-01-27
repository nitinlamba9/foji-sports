import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const WISHLIST_FILE = path.join(process.cwd(), 'data', 'wishlist.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(WISHLIST_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read wishlist from file
const readWishlist = (): { userId: string; productId: string; addedAt: string }[] => {
  ensureDataDir();
  if (!fs.existsSync(WISHLIST_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(WISHLIST_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading wishlist file:', error);
    return [];
  }
};

// Write wishlist to file
const writeWishlist = (wishlist: { userId: string; productId: string; addedAt: string }[]): void => {
  ensureDataDir();
  try {
    fs.writeFileSync(WISHLIST_FILE, JSON.stringify(wishlist, null, 2));
  } catch (error) {
    console.error('Error writing wishlist file:', error);
  }
};

export async function GET(request: NextRequest) {
  console.log('Wishlist GET API called');
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    console.log('Auth cookie found:', !!authCookie);
    
    if (!authCookie) {
      console.log('No auth cookie found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Simple token verification
    const token = authCookie.value;
    console.log('Token found, verifying...');
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (!payload.userId) {
      console.log('Invalid token - no userId');
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    console.log('User authenticated:', payload.userId);

    // Get user's wishlist items
    const allWishlistItems = readWishlist();
    const userWishlistItems = allWishlistItems.filter(item => item.userId === payload.userId);
    
    console.log('Found wishlist items:', userWishlistItems.length);
    
    return NextResponse.json({
      wishlist: userWishlistItems,
      count: userWishlistItems.length
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Simple token verification
    const token = authCookie.value;
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (!payload.userId) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get current wishlist
    const wishlist = readWishlist();
    
    // Check if item already exists
    const existingItem = wishlist.find(item => 
      item.userId === payload.userId && item.productId === productId
    );
    
    if (existingItem) {
      return NextResponse.json({ error: 'Item already in wishlist' }, { status: 409 });
    }

    // Add new item
    const newItem = {
      userId: payload.userId,
      productId,
      addedAt: new Date().toISOString()
    };
    
    wishlist.push(newItem);
    writeWishlist(wishlist);

    return NextResponse.json({
      message: 'Item added to wishlist',
      item: newItem
    }, { status: 201 });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Simple token verification
    const token = authCookie.value;
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (!payload.userId) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get current wishlist
    const wishlist = readWishlist();
    
    // Remove item
    const initialLength = wishlist.length;
    const filteredWishlist = wishlist.filter(item => 
      !(item.userId === payload.userId && item.productId === productId)
    );
    
    if (filteredWishlist.length === initialLength) {
      return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 });
    }
    
    writeWishlist(filteredWishlist);

    return NextResponse.json({
      message: 'Item removed from wishlist'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

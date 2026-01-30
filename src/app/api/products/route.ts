import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // Get active products from MongoDB
    const activeProducts = await Product.find({ status: 'active' }).sort({ createdAt: -1 });
    
    const response = NextResponse.json({ 
      products: activeProducts,
      totalProducts: activeProducts.length 
    });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

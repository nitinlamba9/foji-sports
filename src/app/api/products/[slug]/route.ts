import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    console.log('Product API: Looking for slug:', slug);
    
    await connectDB();
    
    // Find product by slug - case-insensitive for robustness
    const product = await Product.findOne({ 
      slug: { $regex: new RegExp(`^${slug}$`, 'i') }
    });
    
    if (!product) {
      console.log('Product API: Product not found for slug:', slug);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Only return active products for public API
    if (product.status !== 'active') {
      console.log('Product API: Product not active for slug:', slug, 'status:', product.status);
      return NextResponse.json(
        { error: 'Product not available' },
        { status: 404 }
      );
    }
    
    console.log('Product API: Found product for slug:', slug);
    
    const response = NextResponse.json({ product });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Product fetch error for slug:', params, error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

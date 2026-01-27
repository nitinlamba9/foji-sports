import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const filePath = path.join(process.cwd(), 'data/products.json');

export async function GET() {
  try {
    // Read products from file
    const data = await fs.readFile(filePath, 'utf-8');
    const allProducts = JSON.parse(data);
    const activeProducts = allProducts.filter((product: any) => product.status === 'active');
    
    const response = NextResponse.json({ 
      products: activeProducts,
      totalProducts: activeProducts.length 
    });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data/products.json');

export async function GET(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    return NextResponse.json({ 
      products,
      totalProducts: products.length 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const productData = await request.json();
    
    const newProduct = {
      id: 'product-' + Date.now(),
      ...productData,
      createdAt: new Date().toISOString()
    };
    
    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    products.push(newProduct);
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json({ 
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create product' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { productId, ...updateData } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    const productIndex = products.findIndex((p: any) => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }

    products[productIndex] = { ...products[productIndex], ...updateData };
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json({ 
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to update product' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    const productIndex = products.findIndex((p: any) => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }

    products.splice(productIndex, 1);
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json({ 
      message: 'Product deleted successfully',
      deletedProductId: productId
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to delete product' 
    }, { status: 500 });
  }
}

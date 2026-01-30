import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import { connectDB } from '@/lib/db';
import { withAdminAuth } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
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
    
    await connectDB();
    const newProduct = await Product.create(productData);
    
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

    await connectDB();
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Product updated successfully',
      product: updatedProduct
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

    await connectDB();
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to delete product' 
    }, { status: 500 });
  }
}

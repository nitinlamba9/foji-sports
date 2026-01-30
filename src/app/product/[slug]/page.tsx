import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/product/ProductPageClient';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  console.log('ProductPage: Looking for slug:', slug);
  
  // Fetch product by slug directly - efficient database query
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/products/${slug}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    console.error('ProductPage: Failed to fetch product for slug:', slug, 'status:', response.status);
    notFound();
  }
  
  const data = await response.json();
  const product = data.product;

  if (!product) {
    console.error('ProductPage: Product not found for slug:', slug);
    notFound();
  }

  // Fetch related products (still need all products for this, but it's acceptable)
  const relatedResponse = await fetch(`${baseUrl}/api/products`, {
    cache: 'no-store',
  });
  
  let relatedProducts = [];
  if (relatedResponse.ok) {
    const relatedData = await relatedResponse.json();
    relatedProducts = relatedData.products
      .filter((p: any) => p.id !== product.id && p.category === product.category)
      .slice(0, 3);
  }

  console.log('ProductPage: Found product:', product.name, 'Related products:', relatedProducts.length);

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}

import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/product/ProductPageClient';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  console.log('ProductPage: Looking for slug:', slug);
  
  // Fetch products dynamically to get latest data
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    console.error('ProductPage: Failed to fetch products');
    notFound();
  }
  
  const data = await response.json();
  console.log('ProductPage: Available products:', data.products.map((p: any) => p.slug));
  const product = data.products.find((p: any) => p.slug === slug);

  if (!product) {
    console.error('ProductPage: Product not found for slug:', slug);
    notFound();
  }

  const relatedProducts = data.products
    .filter((p: any) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}

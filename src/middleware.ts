import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/shop',
    '/product',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/login',
    '/signup',
    '/api/login',
    '/api/auth/signup',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/signup',
    '/api/me',
    '/api/test',
    '/api/debug',
    '/api/products',
    '/api/banners',
    '/_next',
    '/favicon.ico',
    '/images',
    '/athlete-image.jpg',
    '/category-footwear.jpg',
    '/category-apparel.jpg',
    '/category-equipment.jpg',
    '/category-accessories.jpg',
    '/test-auth-status',
    '/test-cookies'
  ];

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for auth cookie (server-side authentication)
  const authCookie = request.cookies.get('auth');
  
  if (!authCookie) {
    console.log('No auth cookie found, redirecting to login for:', pathname);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('Auth cookie found, allowing access to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

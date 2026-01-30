import { NextRequest, NextResponse } from 'next/server';

// Import canonical auth domain - THE LAW
import { 
  SessionValidation,
  validateSessionToken,
  hasValidSession,
  sessionCanAccessAdmin
} from '@/domain/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('Middleware: Checking access for:', pathname);

  // ROUTE CLASSIFICATION - Explicit route categories
  const publicPaths = [
    '/',           // Landing page
    '/shop',       // Product browsing
    '/product',    // Product details
    '/about',      // About page
    '/contact',    // Contact page
    '/faq',        // FAQ
    '/privacy',    // Privacy policy
    '/terms',      // Terms of service
    '/login',      // Login page
    '/signup',     // Signup page
    '/thank-you',  // Thank you page
    '/unauthorized', // Unauthorized page
    '/api/login',  // Legacy login API
    '/api/auth/signup', // Signup API
    '/api/auth/login',  // Login API
    '/api/auth/logout', // Logout API
    '/api/signup',     // Legacy signup API
    '/api/me',         // Current user info
    '/api/products',   // Public products API
    '/api/banners',    // Public banners API
    '/_next',          // Next.js internals
    '/favicon.ico',    // Favicon
    '/images',         // Static images
    '/athlete-image.jpg', // Static assets
    '/category-footwear.jpg',
    '/category-apparel.jpg',
    '/category-equipment.jpg',
    '/category-accessories.jpg'
  ];

  const authenticatedPaths = [
    '/profile',     // User profile
    '/orders',      // User orders
    '/cart',        // Shopping cart
    '/checkout',    // Checkout
    '/wishlist',    // Wishlist
    '/api/orders',  // Orders API
    '/api/orders/[id]', // Order details API
    '/api/wishlist', // Wishlist API
    '/api/cart',     // Cart API
    '/api/checkout'  // Checkout API
  ];

  const adminPaths = [
    '/admin',       // Admin dashboard
    '/api/admin',   // Admin APIs
  ];

  // PUBLIC ROUTES - No session required
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  if (isPublicPath) {
    console.log('Middleware: Public path, allowing access:', pathname);
    return NextResponse.next();
  }

  // SESSION EXTRACTION - Extract token from cookie
  const authCookie = request.cookies.get('auth');
  
  if (!authCookie) {
    console.log('Middleware: No auth cookie found, redirecting to login for:', pathname);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // DOMAIN SESSION VALIDATION - Same validation as /api/me
  const sessionValidation: SessionValidation = validateSessionToken(authCookie.value);
  
  if (!hasValidSession(sessionValidation)) {
    console.log('Middleware: Invalid session, redirecting to login for:', pathname, { 
      error: sessionValidation.error 
    });
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // AUTHENTICATED ROUTES - Valid session required
  const isAuthenticatedPath = authenticatedPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  if (isAuthenticatedPath) {
    console.log('Middleware: Authenticated path, valid session, allowing access:', pathname);
    return NextResponse.next();
  }

  // ADMIN ROUTES - Valid session + admin role required
  const isAdminPath = adminPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  if (isAdminPath) {
    // DOMAIN ROLE CHECK - Use canonical role validation
    if (!sessionCanAccessAdmin(sessionValidation)) {
      console.log('Middleware: Admin path but insufficient privileges, redirecting to login for:', pathname);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('Middleware: Admin path, valid admin session, allowing access:', pathname);
    return NextResponse.next();
  }

  // DEFAULT DENY - If path doesn't match any category, deny access
  console.log('Middleware: Unclassified path, denying access:', pathname);
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

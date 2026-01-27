import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authenticate(request: NextRequest): Promise<AuthenticatedRequest | NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: Authentication required' },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = decoded;
    return authenticatedRequest;
  } catch (err) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }
}

export function requireAuth(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<Response>) {
  return async (request: NextRequest, ...args: any[]) => {
    const authResult = await authenticate(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // This is an error response
    }
    
    // authResult is now an AuthenticatedRequest
    return handler(authResult as AuthenticatedRequest, ...args);
  };
}

export function requireAdmin(handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<Response>) {
  return async (request: NextRequest, ...args: any[]) => {
    const authResult = await authenticate(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // This is an error response
    }
    
    const authenticatedRequest = authResult as AuthenticatedRequest;
    
    if (authenticatedRequest.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    return handler(authenticatedRequest, ...args);
  };
}

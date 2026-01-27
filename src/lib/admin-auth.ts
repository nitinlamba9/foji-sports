import { NextRequest, NextResponse } from 'next/server';
import { TokenUtils } from '@/lib/token-utils';
import { UserStore } from '@/lib/user-store';

export async function withAdminAuth(request: NextRequest) {
  try {
    // Get auth token from cookie
    const authCookie = request.cookies.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const payload = TokenUtils.verifyToken(authCookie.value);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Fetch user from database
    const user = await UserStore.findById(payload.userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    return { user };
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { TokenUtils } from '@/lib/token-utils';
import { UserStore } from '@/lib/user-store';

export async function GET() {
  console.log('/api/me endpoint called');
  
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;
  
  console.log('Auth cookie (token):', token ? 'exists' : 'missing');

  if (!token) {
    console.log('No auth cookie found, returning 401');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Verify token and extract user ID
  const payload = TokenUtils.verifyToken(token);
  
  if (!payload) {
    console.log('Invalid or expired token, returning 401');
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  console.log('Token verified, user ID:', payload.userId);

  // Fetch user from database
  const user = await UserStore.findById(payload.userId);
  
  if (!user) {
    console.log('User not found in database, token may be stale. Returning 401.');
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }

  console.log('User found:', { id: user.id, email: user.email, name: user.name });

  // Return user data without password
  const { password: _, ...userResponse } = user;
  
  return NextResponse.json({ user: userResponse });
}

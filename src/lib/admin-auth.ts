import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/models/User';
import { connectDB } from '@/lib/db';

export async function withAdminAuth(request: NextRequest) {
  try {
    await connectDB();
    
    // Get auth token from cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify JWT token
    const decoded = jwt.verify(authCookie.value, process.env.JWT_SECRET!) as any;
    
    // Fetch user from MongoDB
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    return user; // Return user object for use in route
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

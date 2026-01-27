import { NextResponse } from 'next/server';
import { debugUsers } from '@/lib/user-store';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    // Find user by email
    const user = debugUsers.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Update user role to admin
    user.role = 'admin';
    
    return NextResponse.json({ 
      message: 'User role updated to admin successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to update user role' 
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { debugUsers } from '@/lib/user-store';

export async function GET() {
  try {
    // Return list of all users (for debugging only)
    const users = debugUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
      // Note: we're not returning the password
    }));
    
    return NextResponse.json({ 
      users: users,
      totalUsers: users.length 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to list users' 
    }, { status: 500 });
  }
}

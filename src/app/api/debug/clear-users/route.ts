import { NextResponse } from 'next/server';
import { debugUsers } from '@/lib/user-store';

export async function POST() {
  try {
    // Clear all users (for testing only)
    const userCount = debugUsers.length;
    debugUsers.length = 0; // Clear the array
    
    return NextResponse.json({ 
      message: 'User store cleared successfully',
      clearedUsers: userCount 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to clear user store' 
    }, { status: 500 });
  }
}

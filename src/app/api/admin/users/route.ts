import { NextResponse } from 'next/server';
import { debugUsers, writeUsers } from '@/lib/user-store';
import { withAdminAuth } from '@/lib/admin-auth';

export async function GET(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    // Return all users for admin
    const users = debugUsers().map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      phone: user.phone
    }));
    
    return NextResponse.json({ 
      users: users,
      totalUsers: users.length 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch users' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === auth.user.id) {
      return NextResponse.json({ 
        error: 'Cannot delete your own account' 
      }, { status: 400 });
    }

    // Get current users
    const users = debugUsers();
    
    // Find user index
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Remove user by creating new array without the deleted user
    const updatedUsers = users.filter((u: any) => u.id !== userId);
    
    // Update the users file by clearing and re-adding
    const { writeUsers } = await import('@/lib/user-store');
    writeUsers(updatedUsers);
    
    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedUserId: userId
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to delete user' 
    }, { status: 500 });
  }
}

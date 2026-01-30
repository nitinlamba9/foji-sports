import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { withAdminAuth } from '@/lib/admin-auth';

export async function GET(request: Request) {
  // Check admin authentication
  const auth = await withAdminAuth(request as any);
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    await connectDB();
    
    // Return all users for admin from MongoDB
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      users,
      totalUsers: users.length 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
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
    await connectDB();
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === auth.id) {
      return NextResponse.json({ 
        error: 'Cannot delete your own account' 
      }, { status: 400 });
    }

    // Delete user from MongoDB
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedUserId: userId
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ 
      error: 'Failed to delete user' 
    }, { status: 500 });
  }
}

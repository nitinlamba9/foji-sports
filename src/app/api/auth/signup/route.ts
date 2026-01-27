import { NextRequest, NextResponse } from 'next/server';
import { UserStore } from '@/lib/user-store';
import { TokenUtils } from '@/lib/token-utils';

export async function POST(request: NextRequest) {
  console.log('Signup API called - real implementation');
  
  try {
    const { name, email, password, phone } = await request.json();
    console.log('Received data:', { name, email, phone: phone || 'not provided' });

    // Validation
    if (!name || !email || !password) {
      console.log('Validation error: Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('Validation error: Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      console.log('Validation error: Invalid email');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserStore.findByEmail(email);
    if (existingUser) {
      console.log('Validation error: User already exists');
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user (in production, hash password with bcrypt)
    console.log('About to create user with data:', { name: name.trim(), email: email.toLowerCase().trim(), phone: phone?.trim() || undefined, role: 'user' });
    const userData = await UserStore.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // In production, hash this!
      phone: phone?.trim() || undefined,
      role: 'user'
    });
    
    console.log('User created successfully:', { id: userData.id, email: userData.email });

    // Generate token
    const token = TokenUtils.generateToken({
      id: userData.id,
      email: userData.email,
      role: userData.role
    });

    // Return user data without password
    const { password: _, ...userResponse } = userData;
    
    const response = NextResponse.json(
      {
        message: 'Signup successful',
        token: token,
        user: userResponse
      },
      { status: 201 }
    );

    // Set HttpOnly auth cookie with real token
    response.cookies.set('auth', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === 'production'
    });

    console.log('Signup completed successfully with real user data');
    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

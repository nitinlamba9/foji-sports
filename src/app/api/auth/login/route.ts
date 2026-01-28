import { NextRequest, NextResponse } from 'next/server';
import { UserStore } from '@/lib/user-store';
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  console.log('Login API called - real implementation');
  
  try {
    const { email, password } = await request.json();
    console.log('Received login data:', { email, password: '***' });

    if (!email || !password) {
      console.log('Validation error: Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate credentials against user store
    const user = await UserStore.validateCredentials(email, password);
    
    if (!user) {
      console.log('Validation error: Invalid email or password');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate real JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name, // 🔥 Add name to JWT payload
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    
    console.log('User authenticated successfully:', { id: user.id, email: user.email });

    // Return user data without password
    const { password: _, ...userResponse } = user;
    
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userResponse
      },
      { status: 200 }
    );

    // Set auth cookie with real JWT token
    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    console.log('Login completed successfully with real auth token');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

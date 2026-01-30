import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import jwt from "jsonwebtoken";
import { connectDB } from '@/lib/db';
import { cookies } from "next/headers";

// Import canonical auth domain - THE LAW
import { 
  canLogin, 
  hasValidEmailFormat, 
  hasValidNameFormat,
  CreateUserInput,
  UserPublic,
  createSessionConfig,
  createJWTPayload,
  SessionValidation,
  validateSessionToken,
  toUserPublic
} from '@/domain/auth';

export async function POST(request: NextRequest) {
  console.log('Login API called - canonical domain implementation');
  
  try {
    const { email, password } = await request.json();
    console.log('Received login data:', { email, password: '***' });

    // DOMAIN VALIDATION - Check invariants before any database work
    if (!email || !password) {
      console.log('Validation error: Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use domain validation for email format
    if (!hasValidEmailFormat(email)) {
      console.log('Validation error: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user for domain validation
    const user = await User.findOne({ email }).select('+password');
    
    // DOMAIN INVARIANT CHECK: Can this user login?
    if (!canLogin(user, password)) {
      console.log('Validation error: User cannot login (invalid credentials or non-existent user)');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // At this point, domain invariants are satisfied
    // User exists and password format is valid
    console.log('Domain validation passed for user:', { id: user._id, email: user.email });

    // Verify actual password (this is implementation, not domain)
    if (!(await user.comparePassword(password))) {
      console.log('Validation error: Password verification failed');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // DOMAIN SESSION CREATION - Use canonical session creation
    const sessionConfig = createSessionConfig();
    const jwtPayload = createJWTPayload({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    });

    // Generate JWT token using domain config
    const token = jwt.sign(
      jwtPayload,
      sessionConfig.jwt.secret,
      { 
        algorithm: sessionConfig.jwt.algorithm,
        expiresIn: sessionConfig.jwt.expiresIn
      }
    );
    
    console.log('JWT created with domain payload:', { 
      id: jwtPayload.id, 
      email: jwtPayload.email,
      role: jwtPayload.role,
      expiresAt: new Date(jwtPayload.exp * 1000).toISOString()
    });

    // DOMAIN SERIALIZATION - Use canonical user serialization
    const userPublic: UserPublic = toUserPublic({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      addresses: user.addresses || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
    
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userPublic
      },
      { status: 200 }
    );

    // DOMAIN COOKIE SETTING - Use canonical session config
    response.cookies.set(sessionConfig.cookie.name, token, {
      httpOnly: sessionConfig.cookie.httpOnly,
      secure: sessionConfig.cookie.secure,
      sameSite: sessionConfig.cookie.sameSite,
      maxAge: sessionConfig.cookie.maxAge,
      path: sessionConfig.cookie.path,
    });

    console.log('Login completed successfully with canonical domain session');
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import jwt from "jsonwebtoken";
import { connectDB } from '@/lib/db';
import { cookies } from "next/headers";

// Import canonical auth domain - THE LAW
import { 
  canCreateUser,
  validateCreateUserInput,
  CreateUserInput,
  UserPublic,
  UserRole,
  createSessionConfig,
  createJWTPayload,
  toUserPublic
} from '@/domain/auth';

export async function POST(request: NextRequest) {
  console.log('Signup API called - canonical domain implementation');
  
  try {
    const { name, email, password, phone } = await request.json();
    console.log('Received data:', { name, email, phone: phone || 'not provided' });

    // DOMAIN INPUT VALIDATION - Create canonical input
    const createUserInput: CreateUserInput = {
      name: name?.trim() || '',
      email: email?.trim() || '',
      password: password || '',
      phone: phone?.trim() || undefined
    };

    // DOMAIN INVARIANT CHECK: Can this user be created?
    if (!canCreateUser(createUserInput)) {
      const validation = validateCreateUserInput(createUserInput);
      console.log('Domain validation error:', validation.errors);
      return NextResponse.json(
        { error: Object.values(validation.errors).join('. ') },
        { status: 400 }
      );
    }

    console.log('Domain validation passed for user creation:', { 
      email: createUserInput.email, 
      name: createUserInput.name 
    });

    // Connect to database
    await connectDB();

    // DOMAIN UNIQUENESS CHECK: Case-insensitive email uniqueness
    const existingUser = await User.findOne({ 
      email: createUserInput.email.toLowerCase() 
    });
    
    if (existingUser) {
      console.log('Domain invariant violation: Email already exists', { email: createUserInput.email });
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // DOMAIN IDENTITY CREATION: User becomes real only after successful persistence
    // Role assignment is explicit and boring - always 'user' for signup
    const userCreationData = {
      name: createUserInput.name,
      email: createUserInput.email.toLowerCase(), // Domain handles case normalization
      password: createUserInput.password, // Domain validated, will be hashed by model hook
      phone: createUserInput.phone,
      role: 'user' as UserRole // EXPLICIT: No role inference, no admin creation via signup
    };

    console.log('Creating user with domain-approved data:', { 
      name: userCreationData.name, 
      email: userCreationData.email,
      role: userCreationData.role 
    });

    // PERSISTENCE - This is where identity becomes real
    const userData = await User.create(userCreationData);
    
    console.log('User identity created successfully:', { 
      id: userData._id, 
      email: userData.email,
      role: userData.role 
    });

    // DOMAIN SESSION CREATION - Same path as login, no special casing
    const sessionConfig = createSessionConfig();
    const jwtPayload = createJWTPayload({
      id: userData._id.toString(),
      email: userData.email,
      role: userData.role,
      name: userData.name
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

    console.log('JWT created for new user:', { 
      id: jwtPayload.id, 
      email: jwtPayload.email,
      role: jwtPayload.role,
      expiresAt: new Date(jwtPayload.exp * 1000).toISOString()
    });

    // DOMAIN SERIALIZATION - Use canonical user serialization
    const userPublic: UserPublic = toUserPublic({
      id: userData._id.toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      phone: userData.phone,
      addresses: userData.addresses || [],
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    });
    
    const response = NextResponse.json(
      {
        message: 'Signup successful',
        user: userPublic
      },
      { status: 201 }
    );

    // DOMAIN COOKIE SETTING - Same config as login, no special casing
    response.cookies.set(sessionConfig.cookie.name, token, {
      httpOnly: sessionConfig.cookie.httpOnly,
      secure: sessionConfig.cookie.secure,
      sameSite: sessionConfig.cookie.sameSite,
      maxAge: sessionConfig.cookie.maxAge,
      path: sessionConfig.cookie.path,
    });

    console.log('Signup completed successfully with canonical domain session');
    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

// Import canonical auth domain - THE LAW
import { createSessionConfig } from '@/domain/auth';

export async function POST() {
  console.log('Logout API called - canonical domain implementation');
  
  const response = NextResponse.json(
    { message: 'Logout successful' },
    { status: 200 }
  );

  // DOMAIN COOKIE CLEARING - Use canonical session config
  const sessionConfig = createSessionConfig();
  
  // Clear the auth cookie using exact same settings as creation
  response.cookies.set(sessionConfig.cookie.name, '', {
    httpOnly: sessionConfig.cookie.httpOnly,
    secure: sessionConfig.cookie.secure,
    sameSite: sessionConfig.cookie.sameSite,
    path: sessionConfig.cookie.path,
    maxAge: 0, // Immediately expires
    expires: new Date(0) // Set to past date for extra safety
  });

  console.log('Logout successful, auth cookie cleared with canonical config');
  return response;
}

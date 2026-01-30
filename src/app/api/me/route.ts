import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Import canonical auth domain - THE LAW
import { 
  SessionValidation,
  validateSessionToken,
  hasValidSession,
  getSessionGuarantee,
  UserPublic,
  toUserPublic
} from '@/domain/auth';

export async function GET() {
  console.log('/api/me called - session interpretation');
  
  // SESSION EXTRACTION - Extract token from cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) {
    console.log('Session interpretation: No token found');
    return NextResponse.json(
      { error: "Unauthorized: token missing" },
      { status: 401 }
    );
  }

  // DOMAIN SESSION VALIDATION - Let domain interpret the session
  const sessionValidation: SessionValidation = validateSessionToken(token);
  
  if (!hasValidSession(sessionValidation)) {
    console.log('Session interpretation: Invalid session', { 
      error: sessionValidation.error 
    });
    return NextResponse.json(
      { error: `Unauthorized: ${sessionValidation.error}` },
      { status: 401 }
    );
  }

  // At this point, we have a valid session with guaranteed payload
  const payload = sessionValidation.payload!;
  console.log('Session interpretation: Valid session', { 
    userId: payload.id, 
    email: payload.email, 
    role: payload.role 
  });

  // SESSION GUARANTEE EXTRACTION - What does this session guarantee?
  const sessionGuarantee = getSessionGuarantee(payload);
  console.log('Session guarantee established:', {
    identityExistedAt: sessionGuarantee.issuedAt.toISOString(),
    expiresAt: sessionGuarantee.expiresAt.toISOString(),
    notGuaranteed: sessionGuarantee.notGuaranteed
  });

  // DOMAIN SERIALIZATION - Return canonical user representation
  // Note: We create UserPublic from session payload (no DB lookup)
  // This respects stateless design - session guarantee is sufficient
  const userPublic: UserPublic = toUserPublic({
    id: payload.id,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    phone: undefined, // Session doesn't guarantee phone
    addresses: [], // Session doesn't guarantee addresses
    createdAt: new Date(payload.iat * 1000), // Use session creation time
    updatedAt: new Date(payload.iat * 1000) // Use session creation time
  });
  
  console.log('Session interpretation complete - returning user identity');
  return NextResponse.json({ 
    user: userPublic,
    sessionGuarantee: {
      identityExistedAt: sessionGuarantee.issuedAt,
      expiresAt: sessionGuarantee.expiresAt,
      notGuaranteed: sessionGuarantee.notGuaranteed
    }
  }, { status: 200 });
}

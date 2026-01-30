// CANONICAL SESSION DOMAIN
// Single source of truth for Session entity and JWT handling

import { UserRole } from './user';

// JWT Payload contract - what must be in every valid token
export interface JWTPayload {
  // Required claims
  id: string; // MongoDB user _id
  email: string;
  role: UserRole;
  name: string;
  
  // JWT standard claims
  iat: number; // Issued at
  exp: number; // Expires at
  
  // Optional custom claims (add later as needed)
  // sessionId?: string; // For session tracking if needed
  // permissions?: string[]; // Pre-computed permissions
}

// Session configuration
export interface SessionConfig {
  jwt: {
    secret: string; // From environment
    algorithm: 'HS256'; // HMAC with SHA-256
    expiresIn: '7d'; // POLICY DEBT: Consider shorter for security
    issuer?: string; // Optional: your app name
    audience?: string; // Optional: your app domain
  };
  cookie: {
    name: string; // 'auth'
    httpOnly: true; // Prevent XSS
    secure: boolean; // HTTPS only in production
    sameSite: 'lax'; // CSRF protection
    maxAge: number; // 7 days in seconds
    path: string; // Entire site
  };
}

// Session validation results
export interface SessionValidation {
  isValid: boolean;
  payload?: JWTPayload;
  error?: SessionError;
}

export type SessionError = 
  | 'NO_TOKEN'
  | 'INVALID_TOKEN'
  | 'EXPIRED_TOKEN'
  | 'MALFORMED_TOKEN'
  | 'MISSING_CLAIMS'
  | 'INVALID_CLAIMS'
  | 'INVALID_PAYLOAD'
  | 'TOKEN_NOT_YET_VALID'
  | 'VALIDATION_ERROR';

// Session creation result
export interface SessionCreation {
  token: string;
  payload: JWTPayload;
  expiresAt: Date;
}

// Session invariants
export interface SessionInvariants {
  // JWT invariants
  jwt: {
    // Token must be cryptographically valid
    mustBeValidSignature: true;
    
    // Token must not be expired
    mustNotBeExpired: true;
    
    // Token must contain required claims
    mustContainRequiredClaims: ['id', 'email', 'role', 'name'];
    
    // Claims must be valid format
    mustHaveValidClaims: {
      id: 'string';
      email: 'email';
      role: 'user|admin';
      name: 'non-empty-string';
    };
  };
  
  // Cookie invariants
  cookie: {
    // Must be HTTP-only (prevent XSS)
    mustBeHttpOnly: true;
    
    // Must be secure in production
    mustBeSecureInProduction: true;
    
    // Must have proper same-site policy
    mustHaveSameSiteLax: true;
    
    // Must have proper path
    mustHavePathSlash: true;
  };
  
  // Session lifecycle invariants
  lifecycle: {
    // Session is stateless (no server-side storage)
    isStateless: true;
    
    // Session expires when JWT expires
    expiresWithJWT: true;
    
    // Role changes require new login (policy, not technical)
    roleChangeRequiresNewLogin: true;
    
    // Logout invalidates immediately (cookie deletion)
    logoutInvalidatesImmediately: true;
  };
}

// Validation helpers
export function isValidJWTPayload(payload: any): payload is JWTPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }
  
  // Check required claims
  const requiredClaims = ['id', 'email', 'role', 'name', 'iat', 'exp'];
  for (const claim of requiredClaims) {
    if (!(claim in payload)) {
      return false;
    }
  }
  
  // Validate claim types
  if (typeof payload.id !== 'string') return false;
  if (typeof payload.email !== 'string') return false;
  if (typeof payload.name !== 'string') return false;
  if (typeof payload.iat !== 'number') return false;
  if (typeof payload.exp !== 'number') return false;
  
  // Validate role
  if (payload.role !== 'user' && payload.role !== 'admin') {
    return false;
  }
  
  // Validate email format (basic check)
  const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailPattern.test(payload.email.toLowerCase())) {
    return false;
  }
  
  // Validate name not empty
  if (payload.name.trim().length === 0) {
    return false;
  }
  
  return true;
}

export function isTokenExpired(payload: JWTPayload): boolean {
  return Date.now() >= payload.exp * 1000;
}

export function getTokenExpiryDate(expiresIn: string): Date {
  // Parse '7d' format
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }
  
  const [, amount, unit] = match;
  const now = new Date();
  
  switch (unit) {
    case 's':
      return new Date(now.getTime() + parseInt(amount) * 1000);
    case 'm':
      return new Date(now.getTime() + parseInt(amount) * 60 * 1000);
    case 'h':
      return new Date(now.getTime() + parseInt(amount) * 60 * 60 * 1000);
    case 'd':
      return new Date(now.getTime() + parseInt(amount) * 24 * 60 * 60 * 1000);
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }
}

export function createSessionConfig(): SessionConfig {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  
  return {
    jwt: {
      secret,
      algorithm: 'HS256',
      expiresIn: '7d', // POLICY DEBT: Consider shorter for security
      issuer: 'foji-sports', // Optional: your app name
      audience: 'foji-sports.com', // Optional: your app domain
    },
    cookie: {
      name: 'auth',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    },
  };
}

// Session creation helpers
export function createJWTPayload(user: { id: string; email: string; role: UserRole; name: string }): JWTPayload {
  const now = Math.floor(Date.now() / 1000);
  const config = createSessionConfig();
  const expiresAt = getTokenExpiryDate(config.jwt.expiresIn);
  
  return {
    id: user.id,
    email: user.email.toLowerCase(),
    role: user.role,
    name: user.name.trim(),
    iat: now,
    exp: Math.floor(expiresAt.getTime() / 1000),
  };
}

// Session validation helpers
export function validateSessionToken(token: string): SessionValidation {
  try {
    const config = createSessionConfig();
    
    // Import jsonwebtoken here to avoid circular dependencies
    // This is the actual JWT validation implementation
    const jwt = require('jsonwebtoken');
    
    const payload = jwt.verify(token, config.jwt.secret, {
      algorithms: [config.jwt.algorithm],
      issuer: config.jwt.issuer,
      audience: config.jwt.audience
    }) as JWTPayload;
    
    // Validate the payload structure
    if (!isValidJWTPayload(payload)) {
      return {
        isValid: false,
        error: 'INVALID_PAYLOAD'
      };
    }
    
    // Check if token is expired
    if (isTokenExpired(payload)) {
      return {
        isValid: false,
        error: 'EXPIRED_TOKEN'
      };
    }
    
    return {
      isValid: true,
      payload
    };
  } catch (error) {
    // Handle different JWT errors
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return { isValid: false, error: 'EXPIRED_TOKEN' };
      }
      if (error.name === 'JsonWebTokenError') {
        return { isValid: false, error: 'INVALID_TOKEN' };
      }
      if (error.name === 'NotBeforeError') {
        return { isValid: false, error: 'TOKEN_NOT_YET_VALID' };
      }
    }
    
    return {
      isValid: false,
      error: 'VALIDATION_ERROR'
    };
  }
}

// Session utility helpers
export function getSessionDuration(config: SessionConfig): number {
  return config.cookie.maxAge; // in seconds
}

export function isSessionActive(payload: JWTPayload): boolean {
  return !isTokenExpired(payload);
}

export function canRefreshSession(payload: JWTPayload): boolean {
  // Policy: Allow refresh if token expires within 24 hours
  const twentyFourHours = 24 * 60 * 60;
  return (payload.exp * 1000 - Date.now()) <= twentyFourHours * 1000;
}

// =============================================================================
// SESSION GUARANTEE CONTRACT
// =============================================================================

/**
 * WHAT DOES THIS SESSION GUARANTEE?
 * 
 * A valid session guarantees that:
 * "At the time of issuance, a user with this ID, email, role, and name existed in the database,
 * and this token was cryptographically signed by our system."
 * 
 * It does NOT guarantee:
 * - The user still exists in the database (stateless limitation)
 * - The user's role hasn't changed (policy limitation)
 * - The user hasn't been deleted (stateless limitation)
 * 
 * Critical operations must verify current state against the database.
 */
export interface SessionGuarantee {
  // What is guaranteed by the JWT signature
  identityExistedAtIssuance: {
    userId: string;
    email: string;
    role: UserRole;
    name: string;
  };
  
  // When it was guaranteed
  issuedAt: Date;
  expiresAt: Date;
  
  // What is NOT guaranteed (stateless limitations)
  notGuaranteed: {
    userStillExists: boolean; // Must verify for critical operations
    roleUnchanged: boolean; // Policy: role changes require new login
    accountNotDeleted: boolean; // Must verify for critical operations
  };
}

/**
 * Extract the session guarantee from a valid JWT payload
 */
export function getSessionGuarantee(payload: JWTPayload): SessionGuarantee {
  return {
    identityExistedAtIssuance: {
      userId: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    },
    issuedAt: new Date(payload.iat * 1000),
    expiresAt: new Date(payload.exp * 1000),
    notGuaranteed: {
      userStillExists: false, // Stateless limitation
      roleUnchanged: false, // Policy limitation
      accountNotDeleted: false, // Stateless limitation
    },
  };
}

/**
 * Check if a session covers a specific time period
 */
export function sessionCoversTime(payload: JWTPayload, timestamp: Date): boolean {
  const issued = new Date(payload.iat * 1000);
  const expires = new Date(payload.exp * 1000);
  return timestamp >= issued && timestamp <= expires;
}

/**
 * Check if a session is still valid for non-critical operations
 * (Uses JWT validation only, no database check)
 */
export function isValidForNonCriticalOperations(sessionValidation: SessionValidation): boolean {
  return sessionValidation.isValid && sessionValidation.payload !== undefined && !isTokenExpired(sessionValidation.payload);
}

/**
 * Check if a session requires database verification for critical operations
 * (Always returns true for stateless sessions - policy decision)
 */
export function requiresDatabaseVerification(sessionValidation: SessionValidation): boolean {
  // In stateless auth, ALL critical operations require DB verification
  return sessionValidation.isValid && sessionValidation.payload !== undefined;
}

/**
 * Helper to check if session validation is valid and has payload
 */
export function hasValidSession(sessionValidation: SessionValidation): boolean {
  return sessionValidation.isValid && sessionValidation.payload !== undefined;
}

// Role-based session helpers
export function hasAdminRole(payload: JWTPayload): boolean {
  return payload.role === 'admin';
}

export function hasUserRole(payload: JWTPayload): boolean {
  return payload.role === 'user' || payload.role === 'admin';
}

// AUTH INVARIANTS - Pure functions for auth guarantees
// No side effects, no database calls, no external dependencies

import { User, UserRole, CreateUserInput, validateCreateUserInput } from './user';
import { JWTPayload, SessionValidation, validateSessionToken } from './session';

// =============================================================================
// IDENTITY INVARIANTS
// =============================================================================

/**
 * A user can login if they exist and have valid credentials
 * This is a pure check - no database calls
 */
export function canLogin(user: User | null, password: string): boolean {
  if (!user) return false;
  if (!password || typeof password !== 'string') return false;
  if (password.length === 0) return false;
  
  // Note: Actual password comparison happens in auth service
  // This is just the invariant check
  return true;
}

/**
 * A user can be created if input meets all constraints
 */
export function canCreateUser(input: CreateUserInput): boolean {
  const validation = validateCreateUserInput(input);
  return validation.isValid;
}

/**
 * A user can access admin features if they have admin role
 */
export function canAccessAdmin(role: UserRole): boolean {
  return role === 'admin';
}

/**
 * A user can access their own data if they are the owner or admin
 */
export function canAccessUserData(requesterRole: UserRole, requesterId: string, targetUserId: string): boolean {
  return requesterRole === 'admin' || requesterId === targetUserId;
}

/**
 * A user can update their profile if they are the owner or admin
 */
export function canUpdateProfile(requesterRole: UserRole, requesterId: string, targetUserId: string): boolean {
  return canAccessUserData(requesterRole, requesterId, targetUserId);
}

/**
 * A user can delete another user only if they are admin
 */
export function canDeleteUser(requesterRole: UserRole, requesterId: string, targetUserId: string): boolean {
  return requesterRole === 'admin' && requesterId !== targetUserId; // Admin can't delete themselves
}

// =============================================================================
// SESSION INVARIANTS
// =============================================================================

/**
 * A session is valid if the token is cryptographically valid and not expired
 */
export function hasValidSession(sessionValidation: SessionValidation): boolean {
  return sessionValidation.isValid && sessionValidation.payload !== undefined;
}

/**
 * A session belongs to the expected user
 */
export function sessionBelongsToUser(sessionValidation: SessionValidation, expectedUserId: string): boolean {
  if (!hasValidSession(sessionValidation)) return false;
  return sessionValidation.payload!.id === expectedUserId;
}

/**
 * A session has the required role for an operation
 */
export function sessionHasRole(sessionValidation: SessionValidation, requiredRole: UserRole): boolean {
  if (!hasValidSession(sessionValidation)) return false;
  return sessionValidation.payload!.role === requiredRole;
}

/**
 * A session can perform admin operations
 */
export function sessionCanAccessAdmin(sessionValidation: SessionValidation): boolean {
  return sessionHasRole(sessionValidation, 'admin');
}

/**
 * A session can access user data (own or admin)
 */
export function sessionCanAccessUserData(sessionValidation: SessionValidation, targetUserId: string): boolean {
  if (!hasValidSession(sessionValidation)) return false;
  const payload = sessionValidation.payload!;
  
  return payload.role === 'admin' || payload.id === targetUserId;
}

// =============================================================================
// AUTHORIZATION MATRIX
// =============================================================================

export type Resource = 'user:profile' | 'user:admin' | 'orders:own' | 'orders:all' | 'products:all';
export type Action = 'read' | 'create' | 'update' | 'delete';

export interface Permission {
  resource: Resource;
  action: Action;
  condition?: 'own' | 'all';
}

/**
 * Check if a session has permission for a specific action on a resource
 */
export function hasPermission(
  sessionValidation: SessionValidation,
  permission: Permission,
  resourceOwnerId?: string
): boolean {
  if (!hasValidSession(sessionValidation)) return false;
  
  const payload = sessionValidation.payload!;
  const role = payload.role;
  
  // Admin can do everything
  if (role === 'admin') {
    return true;
  }
  
  // User permissions
  if (role === 'user') {
    switch (permission.resource) {
      case 'user:profile':
        if (permission.action === 'read' || permission.action === 'update') {
          return !resourceOwnerId || payload.id === resourceOwnerId;
        }
        return false;
        
      case 'orders:own':
        if (permission.action === 'read' || permission.action === 'create') {
          return true;
        }
        return false;
        
      default:
        return false;
    }
  }
  
  return false;
}

// =============================================================================
// SECURITY INVARIANTS
// =============================================================================

/**
 * Password meets minimum security requirements
 * POLICY DEBT: These are weak, should be strengthened
 */
export function meetsPasswordRequirements(password: string): boolean {
  if (!password) return false;
  if (password.length < 6) return false; // POLICY DEBT: Should be 8+
  if (password.length > 128) return false;
  
  // POLICY DEBT: Should require complexity (uppercase, numbers, symbols)
  return true;
}

/**
 * Email format is valid
 */
export function hasValidEmailFormat(email: string): boolean {
  if (!email) return false;
  const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailPattern.test(email.toLowerCase());
}

/**
 * Phone number is valid (India format)
 */
export function hasValidPhoneFormat(phone: string): boolean {
  if (!phone) return false;
  const phonePattern = /^[6789]\d{9}$/;
  return phonePattern.test(phone);
}

/**
 * User name is valid
 */
export function hasValidNameFormat(name: string): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 50;
}

// =============================================================================
// BUSINESS RULE INVARIANTS
// =============================================================================

/**
 * User email uniqueness (must be checked at database level)
 * This invariant defines the rule, not the enforcement
 */
export function emailMustBeUnique(email: string): boolean {
  return hasValidEmailFormat(email);
}

/**
 * Admin role escalation requires explicit action
 * This invariant prevents automatic role changes
 */
export function roleChangeRequiresExplicitAction(currentRole: UserRole, newRole: UserRole): boolean {
  return currentRole !== newRole;
}

/**
 * Session timeout policy
 * POLICY DEBT: 7 days is too long for sensitive operations
 */
export function getSessionTimeoutHours(): number {
  return 24 * 7; // 7 days in hours
}

/**
 * Maximum failed login attempts (policy)
 * This is the invariant, actual counting happens in auth service
 */
export function getMaxFailedLoginAttempts(): number {
  return 5; // POLICY DEBT: Should implement account lockout
}

/**
 * Account lockout duration (policy)
 */
export function getAccountLockoutMinutes(): number {
  return 15; // POLICY DEBT: Should implement account lockout
}

// =============================================================================
// INVARIANT VALIDATION HELPERS
// =============================================================================

/**
 * Validate all user creation invariants
 */
export function validateUserCreationInvariants(input: CreateUserInput): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  if (!meetsPasswordRequirements(input.password)) {
    violations.push('Password does not meet security requirements');
  }
  
  if (!hasValidEmailFormat(input.email)) {
    violations.push('Email format is invalid');
  }
  
  if (input.phone && !hasValidPhoneFormat(input.phone)) {
    violations.push('Phone format is invalid');
  }
  
  if (!hasValidNameFormat(input.name)) {
    violations.push('Name format is invalid');
  }
  
  return {
    isValid: violations.length === 0,
    violations
  };
}

/**
 * Validate session invariants
 */
export function validateSessionInvariants(sessionValidation: SessionValidation): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  if (!sessionValidation.isValid) {
    violations.push(`Session invalid: ${sessionValidation.error}`);
  }
  
  if (sessionValidation.payload) {
    if (!hasValidEmailFormat(sessionValidation.payload.email)) {
      violations.push('Session payload has invalid email');
    }
    
    if (!hasValidNameFormat(sessionValidation.payload.name)) {
      violations.push('Session payload has invalid name');
    }
  }
  
  return {
    isValid: violations.length === 0,
    violations
  };
}

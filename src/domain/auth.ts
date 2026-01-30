// CANONICAL AUTH DOMAIN - Unified Exports
// Single entry point for all auth-related domain types and invariants

// User domain - Types
export type {
  User,
  UserRole,
  Address,
  CreateUserInput,
  UpdateUserInput,
  UserPublic,
  UserAdmin,
  UserProfile,
  UserCreationConstraints,
  UserSerializationRules,
  UserPermissions,
} from './user';

// User domain - Functions
export {
  isValidUserRole,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidUserName,
  validateCreateUserInput,
  toUserPublic,
  toUserProfile,
  toUserAdmin,
  canAccessAdmin as canAccessAdminUser,
  canAccessOwnData,
} from './user';

// Session domain - Types
export type {
  JWTPayload,
  SessionConfig,
  SessionValidation,
  SessionError,
  SessionCreation,
  SessionInvariants,
  SessionGuarantee,
} from './session';

// Session domain - Functions
export {
  isValidJWTPayload,
  isTokenExpired,
  getTokenExpiryDate,
  createSessionConfig,
  createJWTPayload,
  validateSessionToken,
  getSessionDuration,
  isSessionActive,
  canRefreshSession,
  sessionCoversTime,
  isValidForNonCriticalOperations,
  requiresDatabaseVerification,
  getSessionGuarantee,
  hasValidSession,
  hasAdminRole,
  hasUserRole,
} from './session';

// Auth invariants - Functions
export {
  canLogin,
  canCreateUser,
  canAccessAdmin,
  canAccessUserData,
  canUpdateProfile,
  canDeleteUser,
  hasValidSession as hasValidSessionInvariant,
  sessionBelongsToUser,
  sessionHasRole,
  sessionCanAccessAdmin,
  sessionCanAccessUserData,
  hasPermission,
  meetsPasswordRequirements,
  hasValidEmailFormat,
  hasValidPhoneFormat,
  hasValidNameFormat,
  emailMustBeUnique,
  roleChangeRequiresExplicitAction,
  getSessionTimeoutHours,
  getMaxFailedLoginAttempts,
  getAccountLockoutMinutes,
  validateUserCreationInvariants,
  validateSessionInvariants,
} from './auth.invariants';

// =============================================================================
// AUTH DOMAIN SUMMARY
// =============================================================================

/**
 * WHAT THIS DOMAIN DEFINES:
 * 
 * 1. USER ENTITY:
 *    - Canonical User type with all required fields
 *    - Role-based access control (user/admin)
 *    - Input/output types for API boundaries
 *    - Creation constraints and validation
 *    - Serialization rules (what can leave server)
 * 
 * 2. SESSION ENTITY:
 *    - JWT payload contract with required claims
 *    - Session configuration (JWT + cookies)
 *    - Session validation and error types
 *    - Session guarantee contract (what is/isn't guaranteed)
 * 
 * 3. AUTH INVARIANTS:
 *    - Pure functions for all auth rules
 *    - Authorization matrix (resource/action permissions)
 *    - Security invariants (password/email/phone validation)
 *    - Business rule invariants (uniqueness, role changes, timeouts)
 * 
 * 4. KEY SEPARATIONS:
 *    - User ≠ Session (identity vs authentication)
 *    - Domain ≠ Implementation (pure functions vs side effects)
 *    - Validation ≠ Business Logic (rules vs operations)
 *    - Critical vs Non-critical operations (DB verification requirements)
 * 
 * 5. SESSION GUARANTEE:
 *    "At the time of issuance, a user with this ID, email, role, and name 
 *    existed in the database, and this token was cryptographically signed 
 *    by our system."
 *    
 *    Does NOT guarantee current database state (stateless limitation).
 *    Critical operations must verify against database.
 * 
 * USAGE RULES:
 * - Import types from this file, not individual domain files
 * - Use invariant functions for validation, not inline logic
 * - Respect the session guarantee limitations
 * - Never bypass the domain types in API routes
 * - Mark policy debt explicitly, don't hide it
 */

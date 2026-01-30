// CANONICAL USER DOMAIN
// Single source of truth for User entity and related types

export type UserRole = 'user' | 'admin';

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  // Core identifiers
  id: string; // MongoDB _id
  email: string; // Unique, case-insensitive
  
  // Profile
  name: string;
  phone?: string; // Optional, validated format
  role: UserRole;
  
  // Location data
  addresses: Address[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Input types for API boundaries
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  addresses?: Address[];
}

// View models for different contexts
export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAdmin extends UserPublic {
  // Admin can see everything in UserPublic
  // No additional fields needed for now
}

export interface UserProfile extends UserPublic {
  // User can see their own profile
  // Same as public for now
}

// Creation constraints and validation
export type UserCreationConstraints = {
  name: {
    required: true;
    minLength: 1;
    maxLength: 50;
    trim: true;
  };
  email: {
    required: true;
    unique: true;
    lowercase: true;
    pattern: RegExp;
  };
  password: {
    required: true;
    minLength: 6; // POLICY DEBT: Weak, should be 8+
    maxLength: 128;
  };
  phone: {
    required: false;
    pattern: RegExp;
  };
  role: {
    required: true;
    default: UserRole;
    enum: UserRole[];
  };
};

// Serialization rules - what can leave the server
export interface UserSerializationRules {
  // NEVER expose these fields in JSON responses
  neverExpose: [
    'password' // Password hash never leaves server
  ];
  
  // Always expose these in user responses
  alwaysExpose: [
    'id', 'email', 'name', 'role', 'createdAt', 'updatedAt'
  ];
  
  // Expose conditionally
  conditionalExpose: {
    phone: 'selfOrAdmin'; // Only user themselves or admin can see
    addresses: 'selfOrAdmin'; // Only user themselves or admin can see
  };
}

// Role-based access control
export type UserPermissions = {
  user: readonly [
    'read:own:profile',
    'update:own:profile',
    'create:orders',
    'read:own:orders'
  ];
  admin: readonly [
    'read:own:profile',
    'update:own:profile',
    'create:orders',
    'read:own:orders',
    'read:all:users',
    'update:all:users',
    'delete:all:users',
    'read:all:orders',
    'update:all:orders',
    'delete:all:orders',
    'create:products',
    'update:all:products',
    'delete:all:products'
  ];
};

// Validation helpers
export function isValidUserRole(role: string): role is UserRole {
  return role === 'user' || role === 'admin';
}

export function isValidEmail(email: string): boolean {
  const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailPattern.test(email.toLowerCase());
}

export function isValidPhone(phone: string): boolean {
  const phonePattern = /^[6789]\d{9}$/;
  return phonePattern.test(phone);
}

export function isValidPassword(password: string): boolean {
  // POLICY DEBT: Weak validation, should be stronger
  return password.length >= 6 && password.length <= 128;
}

export function isValidUserName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 50;
}

// Creation validation
export function validateCreateUserInput(input: CreateUserInput): {
  isValid: boolean;
  errors: Partial<Record<keyof CreateUserInput, string>>;
} {
  const errors: Partial<Record<keyof CreateUserInput, string>> = {};
  
  if (!isValidUserName(input.name)) {
    errors.name = 'Name must be between 1 and 50 characters';
  }
  
  if (!isValidEmail(input.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!isValidPassword(input.password)) {
    errors.password = 'Password must be between 6 and 128 characters';
  }
  
  if (input.phone && !isValidPhone(input.phone)) {
    errors.phone = 'Phone must be a valid 10-digit number starting with 6, 7, 8, or 9';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Serialization helpers
export function toUserPublic(user: User): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    addresses: user.addresses,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function toUserProfile(user: User): UserProfile {
  return toUserPublic(user); // Same for now
}

export function toUserAdmin(user: User): UserAdmin {
  return toUserPublic(user); // Same for now
}

// Role checking helpers
export function canAccessAdmin(role: UserRole): boolean {
  return role === 'admin';
}

export function canAccessOwnData(userRole: UserRole, targetUserId: string, sessionUserId: string): boolean {
  return userRole === 'admin' || targetUserId === sessionUserId;
}

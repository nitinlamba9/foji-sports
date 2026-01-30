import jwt from 'jsonwebtoken';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(user: any): string {
  try {
    const payload = { 
      id: user.id || user._id, 
      email: user.email, 
      role: user.role,
      name: user.name
    };
    
    const token = jwt.sign(payload, JWT_SECRET);
    console.log('Token generated successfully');
    return token;
  } catch (error) {
    console.error('JWT generation error:', error);
    // Return a fallback token for development
    return 'fallback-token-' + Date.now();
  }
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function getTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

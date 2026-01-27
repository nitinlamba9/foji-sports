// Simple JWT-like token utilities for demo
// In production, use a real JWT library like jsonwebtoken or jose

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export class TokenUtils {
  // Simple token encoding (base64) - NOT SECURE FOR PRODUCTION
  static generateToken(user: { id: string; email: string; role: string }): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    
    // In production, use real JWT signing
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check expiration
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      
      return payload;
    } catch (error) {
      return null;
    }
  }
}

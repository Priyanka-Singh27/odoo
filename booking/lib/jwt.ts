import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!; // must be in .env.local

export type JwtPayload = {
  userId: string;
  email: string;
  role: 'customer' | 'organiser' | 'admin';
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

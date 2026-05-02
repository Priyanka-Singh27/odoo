import { jwtVerify, SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!); // must be in .env.local

export type JwtPayload = {
  userId: string;
  email: string;
  role: 'customer' | 'organiser' | 'admin';
};

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const verified = await jwtVerify(token, SECRET);
    const payload = verified.payload as JwtPayload;
    console.log('[JWT] Token verified successfully:', { userId: payload.userId, role: payload.role });
    return payload;
  } catch (err) {
    console.error('[JWT] Token verification failed:', {
      error: (err as Error).message,
      secret: SECRET ? `***set` : 'NOT SET',
      token: token ? `${token.slice(0, 20)}...` : 'NOT PROVIDED'
    });
    return null;
  }
}

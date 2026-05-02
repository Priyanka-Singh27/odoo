import { NextRequest, NextResponse } from 'next/server';
import { otpSchema } from '@/lib/validators/auth';
import { signToken } from '@/lib/jwt';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const email = req.cookies.get('pending_email')?.value;
    if (!email) {
      return NextResponse.json({ error: 'Session expired' }, { status: 400 });
    }

    const body = await req.json();
    const purpose = body.purpose || 'verify';

    const result = otpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { otp } = result.data;

    // Find user
    const user = db.prepare('SELECT id, otp_code, otp_expires_at, otp_purpose, role FROM users WHERE email = ?').get(email) as any;
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);

    if (user.otp_code !== otp || user.otp_expires_at < now || user.otp_purpose !== purpose) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Clear OTP
    db.prepare('UPDATE users SET otp_code = NULL, otp_expires_at = NULL, otp_purpose = NULL WHERE id = ?').run(user.id);

    if (purpose === 'verify') {
      db.prepare('UPDATE users SET is_verified = 1 WHERE id = ?').run(user.id);
      
      const token = await signToken({ userId: user.id, email, role: user.role });
      const response = NextResponse.json({ role: user.role }, { status: 200 });

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      // Optionally clear pending_email
      response.cookies.delete('pending_email');
      
      return response;
    }

    if (purpose === 'reset') {
      // Generate a short-lived token to allow the user to reset their password
      const resetSessionToken = crypto.randomUUID();
      const response = NextResponse.json({ token: resetSessionToken }, { status: 200 });
      
      response.cookies.set('reset_session', resetSessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15, // 15 mins
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid purpose' }, { status: 400 });

  } catch (error) {
    console.error('Verify OTP error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

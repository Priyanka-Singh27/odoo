import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators/auth';
import { verifyPassword } from '@/lib/hash';
import { signToken } from '@/lib/jwt';
import { generateOtp, otpExpiresAt } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid Email or Password' }, { status: 401 });
    }

    const { email, password } = result.data;

    // Find user
    const user = db.prepare('SELECT id, password_hash, role, is_active, is_verified FROM users WHERE email = ?').get(email) as any;
    
    if (!user || user.is_active === 0) {
      return NextResponse.json({ error: 'Invalid Email or Password' }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid Email or Password' }, { status: 401 });
    }

    if (user.is_verified === 0) {
      // Resend OTP
      const otpCode = generateOtp();
      const otpExpires = otpExpiresAt();
      
      db.prepare(`UPDATE users SET otp_code = ?, otp_expires_at = ?, otp_purpose = 'verify' WHERE id = ?`).run(otpCode, otpExpires, user.id);
      
      try {
        await sendOtpEmail(email, otpCode, 'verify');
      } catch (err) {}

      const response = NextResponse.json({ error: 'Please verify your email first', redirect: '/verify-otp?purpose=verify' }, { status: 403 });
      
      response.cookies.set('pending_email', email, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15,
        path: '/',
      });

      return response;
    }

    // Success
    const token = signToken({ userId: user.id, email, role: user.role });
    const response = NextResponse.json({ role: user.role }, { status: 200 });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

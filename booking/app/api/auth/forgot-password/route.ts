import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, otpExpiresAt } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;

    if (user) {
      const otpCode = generateOtp();
      const otpExpires = otpExpiresAt();

      db.prepare('UPDATE users SET otp_code = ?, otp_expires_at = ?, otp_purpose = ? WHERE id = ?').run(otpCode, otpExpires, 'reset', user.id);

      try {
        await sendOtpEmail(email, otpCode, 'reset');
      } catch (err) {}
    }

    // Always return 200
    const response = NextResponse.json({ message: 'If that email exists, a code was sent' }, { status: 200 });

    if (user) {
      response.cookies.set('pending_email', email, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15,
        path: '/',
      });
    }

    return response;

  } catch (error) {
    console.error('Forgot password error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

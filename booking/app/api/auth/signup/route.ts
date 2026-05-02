import { NextRequest, NextResponse } from 'next/server';
import { signupSchema } from '@/lib/validators/auth';
import { hashPassword } from '@/lib/hash';
import { generateOtp, otpExpiresAt } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { fullName, email, password } = result.data;

    // Check if email exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();
    const otpCode = generateOtp();
    const otpExpires = otpExpiresAt();
    const now = Math.floor(Date.now() / 1000);

    // Insert user
    db.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, is_verified, otp_code, otp_expires_at, otp_purpose, created_at, updated_at)
      VALUES (?, ?, ?, ?, 0, ?, ?, 'verify', ?, ?)
    `).run(id, fullName, email, passwordHash, otpCode, otpExpires, now, now);

    // Send OTP
    try {
      await sendOtpEmail(email, otpCode, 'verify');
    } catch (err) {
      console.error('Failed to send OTP email', err);
      // Even if email fails (like dummy credentials), we proceed so the UI flow can be tested.
    }

    const response = NextResponse.json({ email }, { status: 200 });
    
    // Set pending_email cookie
    response.cookies.set('pending_email', email, {
      httpOnly: false, // UI needs to read it
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 mins
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Signup error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

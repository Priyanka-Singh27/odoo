import { NextRequest, NextResponse } from 'next/server';
import { generateOtp, otpExpiresAt } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/email';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const email = req.cookies.get('pending_email')?.value;
    if (!email) {
      return NextResponse.json({ error: 'Session expired' }, { status: 400 });
    }

    const body = await req.json();
    const purpose = body.purpose || 'verify';

    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const otpCode = generateOtp();
    const otpExpires = otpExpiresAt();

    db.prepare('UPDATE users SET otp_code = ?, otp_expires_at = ?, otp_purpose = ? WHERE id = ?').run(otpCode, otpExpires, purpose, user.id);

    try {
      await sendOtpEmail(email, otpCode, purpose);
    } catch (err) {}

    return NextResponse.json({ message: 'OTP sent' }, { status: 200 });

  } catch (error) {
    console.error('Resend OTP error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

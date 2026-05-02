import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/validators/auth';
import { hashPassword } from '@/lib/hash';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const resetSessionToken = req.cookies.get('reset_session')?.value;
    const email = req.cookies.get('pending_email')?.value;

    if (!resetSessionToken || !email) {
      return NextResponse.json({ error: 'Session expired' }, { status: 400 });
    }

    const body = await req.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { password } = result.data;
    const passwordHash = await hashPassword(password);

    db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(passwordHash, email);

    const response = NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    
    response.cookies.delete('reset_session');
    response.cookies.delete('pending_email');

    return response;

  } catch (error) {
    console.error('Reset password error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

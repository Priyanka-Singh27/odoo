import crypto from 'crypto';

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function otpExpiresAt(): number {
  return Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
}

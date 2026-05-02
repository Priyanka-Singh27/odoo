export function generateOtp(): string {
  return '123456';
}

export function otpExpiresAt(): number {
  return Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
}

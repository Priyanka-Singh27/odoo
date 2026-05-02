import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to: string, otp: string, purpose: 'verify' | 'reset') {
  const subject = purpose === 'verify'
    ? 'Verify your Appointment App account'
    : 'Reset your Appointment App password';

  const html = purpose === 'verify'
    ? `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
    : `<p>Your password reset code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`;

  try {
    const result = await resend.emails.send({
      from: 'noreply@resend.dev',
      to,
      subject,
      html,
    });
    console.log('OTP email sent successfully:', result);
  } catch (error) {
    // Log but don't throw - allow signup/login to proceed even if email fails
    console.error('Failed to send OTP email via Resend:', error);
  }
}

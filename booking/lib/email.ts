import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to: string, otp: string, purpose: 'verify' | 'reset') {
  const subject = purpose === 'verify'
    ? 'Verify your Appointment App account'
    : 'Reset your Appointment App password';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
      <h1 style="color: #1e293b; font-size: 24px; font-weight: bold; margin-bottom: 16px;">${subject}</h1>
      <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
        ${purpose === 'verify' ? 'Thank you for signing up. Please use the following code to verify your account:' : 'We received a request to reset your password. Please use the following code to complete the process:'}
      </p>
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #3b82f6;">${otp}</span>
      </div>
      <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.SMTP_FROM || 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    // Don't throw, just log. In a real app we might want to handle this better.
  }
}

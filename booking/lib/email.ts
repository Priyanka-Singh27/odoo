import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string, purpose: 'verify' | 'reset') {
  const subject = purpose === 'verify'
    ? 'Verify your Appointment App account'
    : 'Reset your Appointment App password';

  const text = purpose === 'verify'
    ? `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`
    : `Your password reset code is: ${otp}\n\nThis code expires in 10 minutes.`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
  });
}

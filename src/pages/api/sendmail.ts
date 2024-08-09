import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const post: APIRoute = async ({ request }) => {
  const { to, subject, message } = await request.json();

  const transporter = nodemailer.createTransport({
    host: import.meta.env.PUBLIC_MAIL_HOST,
    port: parseInt(import.meta.env.PUBLIC_MAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: import.meta.env.PUBLIC_MAIL_USERNAME,
      pass: import.meta.env.PUBLIC_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: import.meta.env.PUBLIC_MAIL_FROM_ADDRESS,
    to,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), { status: 500 });
  }
};

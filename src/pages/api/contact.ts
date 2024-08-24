// File: src/pages/api/send-email.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const post: APIRoute = async ({ request }) => {
  const data = await request.json();
  const { name, phoneNumber, email, message } = data;

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: import.meta.env.PUBLIC_MAIL_USERNAME,
        pass: import.meta.env.PUBLIC_MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: import.meta.env.PUBLIC_MAIL_FROM_ADDRESS,
      to: "erieputranto@gmail.com",
      subject: "Pesan dari website",
      text: `Nama: ${name}\nNomor WhatsApp: ${phoneNumber}\nEmail: ${email}\n\nPesan: ${message}`,
      html: `<p><strong>Nama:</strong> ${name}</p>
             <p><strong>Nomor WhatsApp:</strong> ${phoneNumber}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Pesan:</strong> ${message}</p>`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error saat mengirim email:", error);
    return new Response(JSON.stringify({ success: false, error: 'Gagal mengirim email' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Transporter mit SMTP-Konfiguration

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true für port 465, false für andere Ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// E-Mail-Senden-Funktion
export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Pixel Wars" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-Mail gesendet: %s', info.messageId);
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail: %s', error.message);
    throw new Error('E-Mail konnte nicht gesendet werden');
  }
};
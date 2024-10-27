import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Transporter mit SMTP-Konfiguration

const transporter = nodemailer.createTransport({
  /**
   * @description Erstellt einen Nodemailer-Transporter für den E-Mail-Dienst, der die Konfiguration aus den Umgebungsvariablen verwendet.
   * Host und Port werden von den Umgebungsvariablen EMAIL_HOST und EMAIL_PORT abgerufen.
   */
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true für port 465, false für andere Ports
  /**
   * @description Authentifizierungsdaten für den E-Mail-Server werden aus Umgebungsvariablen abgerufen.
   */
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// E-Mail-Senden-Funktion
export const sendEmail = async (to, subject, text) => {
  /**
   * @description Die E-Mail-Optionen werden definiert, einschließlich des Absenders und der Empfänger.
   */
  const mailOptions = {
    from: `"Pixel Wars" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    /**
     * @description Versendet die E-Mail und loggt den Absender der Nachricht bei Erfolg.
     */
    const info = await transporter.sendMail(mailOptions);
    console.log("E-Mail gesendet: %s", info.messageId);
  } catch (error) {
    /**
     * @description Behandelt und meldet einen Fehler bei der E-Mail-Sendung.
     */
    console.error("Fehler beim Senden der E-Mail: %s", error.message);
    throw new Error("E-Mail konnte nicht gesendet werden");
  }
};

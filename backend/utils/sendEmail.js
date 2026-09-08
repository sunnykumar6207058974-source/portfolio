import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const user = process.env.EMAIL_USER || process.env.SMTP_USER || "sunnykumar6207058974@gmail.com";
    const pass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || "").replace(/\s+/g, "");

    if (!pass) {
      console.warn("⚠️ SMTP password not configured in environment. Skipping email alert.");
      return { success: false, error: "SMTP not configured" };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
      connectionTimeout: 4000,
      greetingTimeout: 4000,
      socketTimeout: 4000,
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "PixelForge Portfolio"}" <${user}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Nodemailer Email successfully sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`❌ Nodemailer Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export { sendWelcomeEmailToClient } from "../src/services/emailService.js";

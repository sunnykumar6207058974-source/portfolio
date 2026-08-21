import nodemailer from "nodemailer";

export const sendEmailNotification = async ({ to, subject, html, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || process.env.SMTP_USER || "sunnykumar6207058974@gmail.com",
        pass: process.env.EMAIL_PASS || process.env.SMTP_PASS || "demo_app_password",
      },
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "PixelForge Portfolio"}" <${process.env.EMAIL_USER || "sunnykumar6207058974@gmail.com"}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Nodemailer Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`ℹ️ Nodemailer Notice: ${error.message} (Logged email alert locally).`);
    return { success: false, error: error.message };
  }
};

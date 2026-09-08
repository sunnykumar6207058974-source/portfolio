import nodemailer from "nodemailer";

export const sendEmailNotification = async ({ to, subject, html, text }) => {
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

export const sendWelcomeEmailToClient = async ({ name, email, subject, message }) => {
  try {
    const user = process.env.EMAIL_USER || process.env.SMTP_USER || "sunnykumar6207058974@gmail.com";
    const pass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || "").replace(/\s+/g, "");

    if (!pass) {
      console.warn("⚠️ SMTP password not configured in environment. Skipping client welcome email.");
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

    const safeName = name || "there";
    const safeSubject = subject || "Project Inquiry";
    const safeMessage = message || "Thank you for reaching out!";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Sunny Kumar</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 36px 30px; text-align: center; border-bottom: 3px solid #38bdf8;">
              <h1 style="color: #ffffff; margin: 0 0 8px; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                ⚡ Sunny Kumar
              </h1>
              <p style="color: #38bdf8; margin: 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                Full-Stack Developer & Software Engineer
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px 24px;">
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 600; margin: 0 0 16px;">
                Hi ${safeName}, 👋
              </h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
                Thank you for reaching out through my portfolio! I have received your message regarding <strong>"${safeSubject}"</strong> and appreciate your interest in working with me.
              </p>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                I am currently reviewing your requirements and will get back to you shortly (usually within <strong>12–24 hours</strong>).
              </p>

              <!-- Message Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-left: 4px solid #38bdf8; border-radius: 6px; margin: 0 0 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
                      Your Message Summary:
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5; font-style: italic;">
                      "${safeMessage}"
                    </p>
                  </td>
                </tr>
              </table>

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">

              <!-- Signoff -->
              <p style="margin: 0 0 4px; font-size: 15px; color: #0f172a; font-weight: 600;">
                Warm regards,
              </p>
              <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                <strong>Sunny Kumar</strong><br>
                Full-Stack MERN Developer<br>
                Email: <a href="mailto:${user}" style="color: #0284c7; text-decoration: none;">${user}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 18px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                This is an automated confirmation that your message was safely delivered to Sunny Kumar.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Sunny Kumar"}" <${user}>`,
      to: email,
      subject: `Thank you for reaching out, ${safeName}! | Sunny Kumar`,
      text: `Hi ${safeName},\n\nThank you for reaching out through my portfolio! I have received your message regarding "${safeSubject}".\n\nI will review your requirements and get back to you shortly (usually within 12–24 hours).\n\nYour message:\n"${safeMessage}"\n\nWarm regards,\nSunny Kumar\nFull-Stack Developer\n${user}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Welcoming auto-reply sent to client (${email}): ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`❌ Welcoming auto-reply notice: ${error.message}`);
    return { success: false, error: error.message };
  }
};

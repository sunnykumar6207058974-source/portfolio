import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  const user = process.env.EMAIL_USER || "sunnykumar6207058974@gmail.com";
  const pass = (process.env.EMAIL_PASS || "bcibwpuyobqxptot").replace(/\s+/g, "");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    // 1. Send Email Alert to Sunny
    await transporter.sendMail({
      from: `"PixelForge Portfolio" <${user}>`,
      to: user,
      subject: `[PixelForge Contact] ${subject} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <h2>📩 New Contact Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #06b6d4;">${message}</blockquote>
      `,
    });

    // 2. Send Confirmation Email to Client
    await transporter.sendMail({
      from: `"Sunny Kumar" <${user}>`,
      to: email,
      subject: `Thank you for reaching out, ${name}! | Sunny Kumar`,
      text: `Hi ${name},\n\nThank you for reaching out through my portfolio! I have received your message regarding "${subject}".\n\nI will review your requirements and get back to you shortly (usually within 12–24 hours).\n\nYour message:\n"${message}"\n\nWarm regards,\nSunny Kumar\nFull-Stack Developer\n${user}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; background-color: #f8fafc; color: #334155; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">Hi ${name}, 👋</h2>
          <p>Thank you for reaching out through my portfolio! I have received your message regarding <strong>"${subject}"</strong>.</p>
          <p>I will review your requirements and get back to you shortly (usually within 12–24 hours).</p>
          <div style="background: #ffffff; padding: 16px; border-left: 4px solid #0284c7; border-radius: 4px; margin: 16px 0;">
            <p style="margin: 0; font-style: italic; color: #475569;">"${message}"</p>
          </div>
          <p style="margin-top: 24px; color: #0f172a;">Warm regards,<br><strong>Sunny Kumar</strong><br>Full-Stack Developer</p>
        </div>
      `,
    });

    // 3. Forward to Render Backend to persist in database
    fetch("https://portfolio-r0ji.onrender.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent successfully to Sunny. He will get back to you shortly.",
    });
  } catch (error) {
    console.error("Vercel Email Handler Error:", error);
    return res.status(500).json({
      success: false,
      error: "Email delivery error: " + error.message,
    });
  }
}

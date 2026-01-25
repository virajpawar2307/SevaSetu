import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // MUST be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Test connection
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Mail server connection failed:", err);
  } else {
    console.log("✅ Mail server is ready to send emails");
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"SevaSetu Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

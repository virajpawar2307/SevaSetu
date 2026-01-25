import { Resend } from "resend";

const resend = new Resend(re_GvRhfY8x_28pkQes4pHV7huVQ1Ft7hkLE);

export const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "SevaSetu <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Email sending failed:", error);
      return;
    }

    console.log("✅ Email sent successfully. ID:", data.id);
  } catch (err) {
    console.error("❌ Email sending crashed:", err);
  }
};

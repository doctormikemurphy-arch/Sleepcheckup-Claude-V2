import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const FROM_EMAIL = "SleepCheckup.com <noreply@sleepcheckup.com>";
const ADMIN_EMAIL = "doctormikemurphy@gmail.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Resend not configured" });
  }

  const { name, email, message } = (req.body ?? {}) as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  const html = `
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;font-family:sans-serif;">
      <tr>
        <td style="background:#0F172A;padding:28px 36px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">New Contact Form Message</p>
          <p style="margin:6px 0 0;color:#93C5FD;font-size:14px;">SleepCheckup.com</p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:28px;">
            <tr>
              <td style="padding:10px 16px;background:#F9FAFB;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Name</td>
              <td style="padding:10px 16px;background:#F9FAFB;border-bottom:1px solid #E5E7EB;color:#0F172A;font-size:15px;font-weight:600;">${name.trim()}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;background:#F9FAFB;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Email</td>
              <td style="padding:10px 16px;background:#F9FAFB;border-bottom:1px solid #E5E7EB;color:#2563EB;font-size:15px;">${email.trim()}</td>
            </tr>
          </table>
          <p style="margin:0 0 10px;color:#374151;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
          <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;">
            <p style="margin:0;color:#0F172A;font-size:15px;line-height:1.7;white-space:pre-wrap;">${message.trim()}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background:#F8FAFC;border-top:1px solid #E5E7EB;padding:16px 36px;text-align:center;">
          <p style="margin:0;color:#9CA3AF;font-size:12px;">Reply directly to this email to respond to ${name.trim()}.</p>
        </td>
      </tr>
    </table>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: email.trim(),
      subject: `New contact form message from ${name.trim()}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send message" });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: err.message ?? "Failed to send message" });
  }
}

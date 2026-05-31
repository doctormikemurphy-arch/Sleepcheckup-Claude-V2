import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const FROM_EMAIL = "SleepCheckup.com <noreply@sleepcheckup.com>";
const ADMIN_EMAIL = "doctormikemurphy@gmail.com";

function getRiskColor(risk: string) {
  if (risk === "high") return "#DC2626";
  if (risk === "intermediate") return "#D97706";
  return "#16A34A";
}

function getRiskLabel(risk: string) {
  if (risk === "high") return "High Risk";
  if (risk === "intermediate") return "Intermediate Risk";
  return "Low Risk";
}

const ZONE_LABELS: Record<string, string> = {
  nose: "Nasal Zone",
  palate: "Palate & Tonsils",
  tongue: "Tongue Base",
  throat: "Lower Throat",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Resend not configured" });
  }

  const { email, stopBangScore, osaRisk, flaggedZones = [] } = (req.body ?? {}) as {
    email?: string;
    stopBangScore?: number;
    osaRisk?: string;
    flaggedZones?: string[];
  };

  if (!email || typeof stopBangScore !== "number" || !osaRisk) {
    return res.status(400).json({ error: "email, stopBangScore, and osaRisk are required" });
  }

  const riskColor = getRiskColor(osaRisk);
  const riskLabel = getRiskLabel(osaRisk);
  const zonesHtml =
    flaggedZones.length > 0
      ? flaggedZones.map((z) => `<li style="margin:4px 0;color:#374151;">${ZONE_LABELS[z] ?? z}</li>`).join("")
      : `<li style="color:#374151;">No specific zones flagged</li>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:40px 20px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="background:#0F172A;padding:32px;text-align:center;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">MURPHY METHOD™</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">SleepCheckup.com</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 36px;">
            <h2 style="margin:0 0 8px;color:#0F172A;font-size:24px;font-weight:700;">Your Free Screening Results</h2>
            <p style="margin:0 0 32px;color:#6B7280;font-size:15px;">Here's a summary of what your responses indicate.</p>
            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">STOP-BANG Score</p>
              <div style="display:flex;align-items:center;gap:12px;margin-top:8px;">
                <span style="font-size:40px;font-weight:700;color:#0F172A;">${stopBangScore}<span style="font-size:22px;color:#9CA3AF;">/8</span></span>
                <span style="background:${riskColor}20;color:${riskColor};font-size:13px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid ${riskColor}40;">${riskLabel}</span>
              </div>
              <p style="margin:12px 0 0;color:#4B5563;font-size:14px;line-height:1.6;">
                ${
                  osaRisk === "high"
                    ? "Your score suggests a high likelihood of obstructive sleep apnea. A full assessment will help clarify your specific pathway and next steps."
                    : osaRisk === "intermediate"
                    ? "Your score suggests a moderate likelihood of sleep-disordered breathing. The full assessment will identify exactly what type and what to do."
                    : "Your score suggests lower immediate risk, but symptoms and airway anatomy also matter. The full assessment provides a complete picture."
                }
              </p>
            </div>
            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:24px;margin-bottom:32px;">
              <p style="margin:0 0 12px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">AIRWAY ZONES FLAGGED</p>
              <ul style="margin:0;padding-left:20px;">${zonesHtml}</ul>
              <p style="margin:12px 0 0;color:#4B5563;font-size:13px;">${flaggedZones.length} of 4 airway zones show potential involvement based on your responses.</p>
            </div>
            <div style="background:#0F172A;border-radius:10px;padding:28px;margin-bottom:24px;text-align:center;">
              <p style="margin:0 0 8px;color:#60A5FA;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">READY TO GO DEEPER?</p>
              <h3 style="margin:0 0 12px;color:#ffffff;font-size:18px;font-weight:700;">Get Your Full Personalized Report</h3>
              <p style="margin:0 0 20px;color:#9CA3AF;font-size:14px;line-height:1.6;">The full Murphy Method™ assessment identifies exactly which of 8 pathways applies to you — and gives you a complete report to bring to your doctor.</p>
              <a href="https://sleepcheckup.com/assessment/info" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;">Get My Full Report — $79</a>
              <p style="margin:12px 0 0;color:#6B7280;font-size:12px;">One-time payment. No subscription. Delivered instantly.</p>
            </div>
            <p style="margin:0;color:#9CA3AF;font-size:12px;text-align:center;line-height:1.6;">This is an educational screening tool and does not constitute a medical diagnosis.<br>A service of Sleep Check Up, Inc. | Clinical content by Michael Murphy, MD, MPH — Stanford Medicine.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:20px 36px;text-align:center;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;">© 2026 SleepCheckup.com · <a href="https://sleepcheckup.com/privacy" style="color:#9CA3AF;">Privacy Policy</a> · <a href="https://sleepcheckup.com/terms" style="color:#9CA3AF;">Terms of Use</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      bcc: [ADMIN_EMAIL],
      subject: `Your Sleep Apnea Screening Results — ${riskLabel}`,
      html,
    });

    if (error) {
      console.error("Resend error (screener):", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error("Screener submit error:", err);
    return res.status(500).json({ error: err.message ?? "Failed to send email" });
  }
}

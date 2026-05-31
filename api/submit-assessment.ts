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

interface Zone { label: string; score: number; max: number; isPositive: boolean; answers: string[]; }
interface Palm { letter: string; name: string; score: number; isPositive: boolean; questions: string[]; }

const scoreRow = (label: string, value: string, color: string) =>
  `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6;color:#374151;font-size:14px;">${label}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #F3F4F6;text-align:right;">
      <span style="color:${color};font-size:14px;font-weight:700;">${value}</span>
    </td>
  </tr>`;

const bullet = (text: string) =>
  `<tr>
    <td style="vertical-align:top;width:20px;padding:5px 0;">
      <div style="width:6px;height:6px;border-radius:50%;background:#2563EB;margin-top:5px;"></div>
    </td>
    <td style="padding:5px 0 5px 10px;color:#4B5563;font-size:14px;line-height:1.6;">${text}</td>
  </tr>`;

const numberedStep = (n: number, text: string) =>
  `<tr>
    <td style="vertical-align:top;width:28px;padding:6px 0;">
      <div style="background:#2563EB;color:#fff;font-size:11px;font-weight:700;width:22px;height:22px;border-radius:50%;text-align:center;line-height:22px;">${n}</div>
    </td>
    <td style="padding:6px 0 6px 10px;color:#4B5563;font-size:14px;line-height:1.6;">${text}</td>
  </tr>`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Resend not configured" });
  }

  const body = (req.body ?? {}) as Record<string, any>;

  const {
    email,
    firstName,
    pathwayName,
    pathwayLetter,
    pathwayDescription,
    stopBangScore = 0,
    osaRisk = "low",
    isiScore = 0,
    insomniaSeverity = "none",
    bmiValue,
    bmiLabel = "N/A",
    assessmentDate,
    anatomyTotal = 0,
    anatomyZones = [] as Zone[],
    palmResults = [] as Palm[],
    medicalHistoryScore = 0,
    medicalHistoryConditions = [] as string[],
    platoTotal = 0,
    whatResultsSuggest = [] as string[],
    whyItMattersPts = [] as string[],
    whatWorksBestOpts = [] as string[],
    nextStepsSteps = [] as string[],
  } = body;

  if (!email || !pathwayName) {
    return res.status(400).json({ error: "email and pathwayName are required" });
  }

  const riskLabel = getRiskLabel(osaRisk);
  const riskColor = getRiskColor(osaRisk);
  const displayName = firstName || "there";

  const isiLabel =
    insomniaSeverity === "severe" ? "Severe Insomnia" :
    insomniaSeverity === "moderate" ? "Moderate Insomnia" :
    insomniaSeverity === "subthreshold" ? "Subthreshold Insomnia" : "None / Mild";
  const isiColor =
    insomniaSeverity === "severe" ? "#DC2626" :
    insomniaSeverity === "moderate" ? "#D97706" :
    insomniaSeverity === "subthreshold" ? "#2563EB" : "#16A34A";
  const bmiColor = !bmiValue ? "#6B7280" : bmiValue < 25 ? "#16A34A" : bmiValue < 30 ? "#D97706" : "#DC2626";

  const zoneRow = (z: Zone) => {
    const statusColor = z.isPositive ? "#D97706" : "#16A34A";
    const statusBg = z.isPositive ? "#FEF3C7" : "#DCFCE7";
    return `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;color:#374151;font-size:14px;font-weight:500;">${z.label}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;color:#6B7280;font-size:13px;text-align:center;">${z.score}/${z.max}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;text-align:center;">
        <span style="background:${statusBg};color:${statusColor};font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;">${z.isPositive ? "Flagged" : "Normal"}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;color:#6B7280;font-size:12px;">${z.answers.length > 0 ? z.answers.join(", ") : "No findings"}</td>
    </tr>`;
  };

  const palmRow = (p: Palm) => {
    const statusColor = p.isPositive ? "#DC2626" : "#6B7280";
    const statusBg = p.isPositive ? "#FEE2E2" : "#F3F4F6";
    return `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;text-align:center;">
        <span style="background:#DC2626;color:#fff;font-size:11px;font-weight:700;width:20px;height:20px;border-radius:50%;display:inline-block;line-height:20px;text-align:center;">${p.letter}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;color:#374151;font-size:14px;font-weight:500;">${p.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;text-align:center;">
        <span style="background:${statusBg};color:${statusColor};font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;">${p.isPositive ? "Positive" : "Negative"}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;color:#6B7280;font-size:12px;">${p.questions.length > 0 ? p.questions.join("; ") : "No positive findings"}</td>
    </tr>`;
  };

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;">
  <tr>
    <td style="background:#0F172A;padding:36px 36px 28px;text-align:center;">
      <p style="margin:0 0 4px;color:#94A3B8;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">MURPHY METHOD™ · SLEEPCHECKUP.COM</p>
      <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.02em;">Your Assessment Report</h1>
      <p style="margin:0;color:#60A5FA;font-size:14px;">Clinical content by Michael Murphy, MD, MPH — Stanford Medicine</p>
      ${assessmentDate ? `<p style="margin:8px 0 0;color:#64748B;font-size:12px;">Completed ${assessmentDate}</p>` : ""}
    </td>
  </tr>
  <tr>
    <td style="padding:28px 36px 0;">
      <div style="background:#EFF6FF;border:2px solid #2563EB;border-radius:10px;padding:24px;text-align:center;">
        <p style="margin:0 0 4px;color:#2563EB;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;">YOUR MURPHY METHOD ASSIGNED PATHWAY${pathwayLetter ? ` — PATHWAY ${pathwayLetter}` : ""}</p>
        <h2 style="margin:8px 0 10px;color:#0F172A;font-size:22px;font-weight:800;line-height:1.2;">${pathwayName}</h2>
        <p style="margin:0;color:#1D4ED8;font-size:14px;line-height:1.6;font-style:italic;">${pathwayDescription}</p>
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding:28px 36px 0;">
      <h3 style="margin:0 0 10px;color:#0F172A;font-size:18px;font-weight:700;">Hi ${displayName},</h3>
      <p style="margin:0;color:#4B5563;font-size:15px;line-height:1.7;">Your Murphy Method™ full assessment report is below. Save this email so you always have a record of your findings.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">YOUR KEY SCORES</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
        ${scoreRow("STOP-BANG Score", `${stopBangScore}/8 — ${riskLabel} OSA Risk`, riskColor)}
        ${scoreRow("Insomnia Severity Index (ISI)", `${isiScore}/28 — ${isiLabel}`, isiColor)}
        ${scoreRow("Body Mass Index (BMI)", bmiValue ? `${Number(bmiValue).toFixed(1)} kg/m² — ${bmiLabel}` : "Not calculated", bmiColor)}
        ${scoreRow("PLATO-11 Total", `${platoTotal}/44`, "#374151")}
        ${scoreRow("Airway Anatomy Findings", `${anatomyTotal} finding${anatomyTotal !== 1 ? "s" : ""} across 4 zones`, anatomyTotal > 0 ? "#D97706" : "#16A34A")}
        ${scoreRow("Medical History Conditions", medicalHistoryScore > 0 ? medicalHistoryConditions.join(", ") : "None reported", medicalHistoryScore > 0 ? "#D97706" : "#16A34A")}
      </table>
    </td>
  </tr>
  ${whatResultsSuggest.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">WHAT YOUR RESULTS SUGGEST</p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%">${whatResultsSuggest.map(bullet).join("")}</table>
      </div>
    </td>
  </tr>` : ""}
  ${anatomyZones.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">YOUR AIRWAY ANATOMY — 4 ZONES</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
        <tr style="background:#F9FAFB;">
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;">Zone</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;text-align:center;">Score</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;text-align:center;">Status</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;">Findings</td>
        </tr>
        ${anatomyZones.map(zoneRow).join("")}
      </table>
    </td>
  </tr>` : ""}
  ${palmResults.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 4px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">PALM CLASSIFICATION</p>
      <p style="margin:0 0 12px;color:#9CA3AF;font-size:12px;font-style:italic;">Underlying factors that may contribute to your sleep apnea</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
        <tr style="background:#F9FAFB;">
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;text-align:center;width:32px;"></td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;">Factor</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;text-align:center;">Result</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;">Positive Findings</td>
        </tr>
        ${palmResults.map(palmRow).join("")}
      </table>
    </td>
  </tr>` : ""}
  ${whyItMattersPts.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">WHY THIS MATTERS FOR YOUR PATHWAY</p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%">${whyItMattersPts.map(bullet).join("")}</table>
      </div>
    </td>
  </tr>` : ""}
  ${whatWorksBestOpts.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">TREATMENT OPTIONS FOR YOUR PATHWAY</p>
      <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%">${whatWorksBestOpts.map(bullet).join("")}</table>
      </div>
    </td>
  </tr>` : ""}
  ${nextStepsSteps.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">YOUR RECOMMENDED ACTION PLAN</p>
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%">${nextStepsSteps.map((t, i) => numberedStep(i + 1, t)).join("")}</table>
      </div>
    </td>
  </tr>` : ""}
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#0F172A;font-size:16px;font-weight:700;">Using this report at your doctor's appointment:</p>
      <table cellpadding="0" cellspacing="0" width="100%">
        ${numberedStep(1, "Share your assigned pathway with your doctor — it will orient the conversation immediately.")}
        ${numberedStep(2, "Review the treatment options section before your appointment so you can ask informed questions.")}
        ${numberedStep(3, "Print or save this email as a PDF (File → Print → Save as PDF) and bring it with you.")}
        ${numberedStep(4, "Request a sleep study if your STOP-BANG score is 3 or higher.")}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:28px 36px 16px;">
      <div style="border-top:1px solid #E5E7EB;padding-top:20px;">
        <p style="margin:0;color:#9CA3AF;font-size:12px;text-align:center;line-height:1.7;">This report is for educational purposes only and does not constitute a medical diagnosis or treatment recommendation.<br>A service of Sleep Check Up, Inc. | Clinical content by Michael Murphy, MD, MPH — Stanford Medicine.</p>
      </div>
    </td>
  </tr>
  <tr>
    <td style="background:#F8FAFC;border-top:1px solid #E5E7EB;padding:16px 36px;text-align:center;">
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
      subject: `Your Murphy Method™ Report — ${pathwayName}`,
      html,
    });

    if (error) {
      console.error("Resend error (assessment):", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error("Assessment submit error:", err);
    return res.status(500).json({ error: err.message ?? "Failed to send report email" });
  }
}

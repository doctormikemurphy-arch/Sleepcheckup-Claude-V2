import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "SleepCheckup.com <noreply@sleepcheckup.com>";
const ADMIN_EMAIL = "doctormikemurphy@gmail.com";

function getRiskColor(risk: string): string {
  if (risk === "high") return "#DC2626";
  if (risk === "intermediate") return "#D97706";
  return "#16A34A";
}

function getRiskLabel(risk: string): string {
  if (risk === "high") return "High Risk";
  if (risk === "intermediate") return "Intermediate Risk";
  return "Low Risk";
}

function getZoneLabel(zone: string): string {
  const labels: Record<string, string> = {
    nose: "Nasal Zone",
    palate: "Palate & Tonsils",
    tongue: "Tongue Base",
    throat: "Lower Throat",
  };
  return labels[zone] || zone;
}

export async function sendFreeResultsEmail(params: {
  email: string;
  stopBangScore: number;
  osaRisk: string;
  flaggedZones: string[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { email, stopBangScore, osaRisk, flaggedZones } = params;
    const riskColor = getRiskColor(osaRisk);
    const riskLabel = getRiskLabel(osaRisk);
    const zonesHtml = flaggedZones.length > 0
      ? flaggedZones.map(z => `<li style="margin:4px 0;color:#374151;">${getZoneLabel(z)}</li>`).join("")
      : `<li style="color:#374151;">No specific zones flagged</li>`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:40px 20px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
        <!-- Header -->
        <tr>
          <td style="background:#0F172A;padding:32px;text-align:center;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">MURPHY METHOD™</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">SleepCheckup.com</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 36px;">
            <h2 style="margin:0 0 8px;color:#0F172A;font-size:24px;font-weight:700;">Your Free Screening Results</h2>
            <p style="margin:0 0 32px;color:#6B7280;font-size:15px;">Here's a summary of what your responses indicate.</p>

            <!-- Risk Score -->
            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">STOP-BANG Score</p>
              <div style="display:flex;align-items:center;gap:12px;margin-top:8px;">
                <span style="font-size:40px;font-weight:700;color:#0F172A;">${stopBangScore}<span style="font-size:22px;color:#9CA3AF;">/8</span></span>
                <span style="background:${riskColor}20;color:${riskColor};font-size:13px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid ${riskColor}40;">${riskLabel}</span>
              </div>
              <p style="margin:12px 0 0;color:#4B5563;font-size:14px;line-height:1.6;">
                ${osaRisk === "high"
                  ? "Your score suggests a high likelihood of obstructive sleep apnea. A full assessment will help clarify your specific pathway and next steps."
                  : osaRisk === "intermediate"
                  ? "Your score suggests a moderate likelihood of sleep-disordered breathing. The full assessment will identify exactly what type and what to do."
                  : "Your score suggests lower immediate risk, but symptoms and airway anatomy also matter. The full assessment provides a complete picture."}
              </p>
            </div>

            <!-- Flagged Zones -->
            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:24px;margin-bottom:32px;">
              <p style="margin:0 0 12px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">AIRWAY ZONES FLAGGED</p>
              <ul style="margin:0;padding-left:20px;">
                ${zonesHtml}
              </ul>
              <p style="margin:12px 0 0;color:#4B5563;font-size:13px;">${flaggedZones.length} of 4 airway zones show potential involvement based on your responses.</p>
            </div>

            <!-- Upgrade CTA -->
            <div style="background:#0F172A;border-radius:10px;padding:28px;margin-bottom:24px;text-align:center;">
              <p style="margin:0 0 8px;color:#60A5FA;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">READY TO GO DEEPER?</p>
              <h3 style="margin:0 0 12px;color:#ffffff;font-size:18px;font-weight:700;">Get Your Full Personalized Report</h3>
              <p style="margin:0 0 20px;color:#9CA3AF;font-size:14px;line-height:1.6;">The full Murphy Method™ assessment identifies exactly which of 8 pathways applies to you — and gives you a professional PDF report to bring to your doctor.</p>
              <a href="https://sleepcheckup.com/screener" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;">Get My Full Report — $1</a>
              <p style="margin:12px 0 0;color:#6B7280;font-size:12px;">Introductory price. One-time payment. No subscription. Delivered instantly.</p>
            </div>

            <p style="margin:0;color:#9CA3AF;font-size:12px;text-align:center;line-height:1.6;">This is an educational screening tool and does not constitute a medical diagnosis.<br>A service of Sleep Check Up, Inc. | Clinical content by Michael Murphy, MD, MPH — Stanford Medicine.</p>
          </td>
        </tr>
        <!-- Footer -->
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

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      bcc: [ADMIN_EMAIL],
      subject: `Your Sleep Apnea Screening Results — ${riskLabel}`,
      html,
    });

    if (error) {
      console.error("Resend error (free results):", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Email send error (free results):", err);
    return { success: false, error: err.message };
  }
}

interface ReportEmailZone { label: string; score: number; max: number; isPositive: boolean; answers: string[]; }
interface ReportEmailPalm { letter: string; name: string; score: number; isPositive: boolean; questions: string[]; }

export async function sendReportEmail(params: {
  email: string;
  firstName?: string;
  pathwayName: string;
  pathwayLetter?: string;
  pathwayDescription: string;
  stopBangScore: number;
  osaRisk: string;
  isiScore?: number;
  insomniaSeverity?: string;
  bmiValue?: number | null;
  bmiLabel?: string;
  assessmentDate?: string;
  anatomyTotal?: number;
  anatomyZones?: ReportEmailZone[];
  palmResults?: ReportEmailPalm[];
  medicalHistoryScore?: number;
  medicalHistoryConditions?: string[];
  platoTotal?: number;
  whatResultsSuggest?: string[];
  whyItMattersPts?: string[];
  whatWorksBestOpts?: string[];
  nextStepsSteps?: string[];
  reportToken?: string;
  [key: string]: any;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      email, firstName, pathwayName, pathwayLetter, pathwayDescription,
      stopBangScore, osaRisk,
      isiScore = 0, insomniaSeverity = "none",
      bmiValue, bmiLabel = "N/A",
      assessmentDate,
      anatomyTotal = 0, anatomyZones = [],
      palmResults = [],
      medicalHistoryScore = 0, medicalHistoryConditions = [],
      platoTotal = 0,
      whatResultsSuggest = [], whyItMattersPts = [],
      whatWorksBestOpts = [], nextStepsSteps = [],
    } = params;

    const riskLabel = getRiskLabel(osaRisk);
    const riskColor = getRiskColor(osaRisk);
    const displayName = firstName || "there";

    const isiLabel = insomniaSeverity === "severe" ? "Severe Insomnia" : insomniaSeverity === "moderate" ? "Moderate Insomnia" : insomniaSeverity === "subthreshold" ? "Subthreshold Insomnia" : "None / Mild";
    const isiColor = insomniaSeverity === "severe" ? "#DC2626" : insomniaSeverity === "moderate" ? "#D97706" : insomniaSeverity === "subthreshold" ? "#2563EB" : "#16A34A";
    const bmiColor = !bmiValue ? "#6B7280" : bmiValue < 25 ? "#16A34A" : bmiValue < 30 ? "#D97706" : "#DC2626";

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

    const zoneRow = (z: ReportEmailZone) => {
      const statusColor = z.isPositive ? "#D97706" : "#16A34A";
      const statusBg = z.isPositive ? "#FEF3C7" : "#DCFCE7";
      const statusLabel = z.isPositive ? "Flagged" : "Normal";
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;color:#374151;font-size:14px;font-weight:500;">${z.label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;color:#6B7280;font-size:13px;text-align:center;">${z.score}/${z.max}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;text-align:center;">
          <span style="background:${statusBg};color:${statusColor};font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;">${statusLabel}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;color:#6B7280;font-size:12px;">${z.answers.length > 0 ? z.answers.join(", ") : "No findings"}</td>
      </tr>`;
    };

    const palmRow = (p: ReportEmailPalm) => {
      const statusColor = p.isPositive ? "#DC2626" : "#6B7280";
      const statusBg = p.isPositive ? "#FEE2E2" : "#F3F4F6";
      const statusLabel = p.isPositive ? "Positive" : "Negative";
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;text-align:center;">
          <span style="background:#DC2626;color:#fff;font-size:11px;font-weight:700;width:20px;height:20px;border-radius:50%;display:inline-block;line-height:20px;text-align:center;">${p.letter}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;color:#374151;font-size:14px;font-weight:500;">${p.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #F3F4F6;text-align:center;">
          <span style="background:${statusBg};color:${statusColor};font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;">${statusLabel}</span>
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

  <!-- HEADER -->
  <tr>
    <td style="background:#0F172A;padding:36px 36px 28px;text-align:center;">
      <p style="margin:0 0 4px;color:#94A3B8;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">MURPHY METHOD™ · SLEEPCHECKUP.COM</p>
      <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.02em;">Your Assessment Report</h1>
      <p style="margin:0;color:#60A5FA;font-size:14px;">Clinical content by Michael Murphy, MD, MPH — Stanford Medicine</p>
      ${assessmentDate ? `<p style="margin:8px 0 0;color:#64748B;font-size:12px;">Completed ${assessmentDate}</p>` : ""}
    </td>
  </tr>

  <!-- PATHWAY BANNER -->
  <tr>
    <td style="padding:28px 36px 0;">
      <div style="background:#EFF6FF;border:2px solid #2563EB;border-radius:10px;padding:24px;text-align:center;">
        <p style="margin:0 0 4px;color:#2563EB;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;">YOUR ASSIGNED PATHWAY${pathwayLetter ? ` — PATHWAY ${pathwayLetter}` : ""}</p>
        <h2 style="margin:8px 0 10px;color:#0F172A;font-size:22px;font-weight:800;line-height:1.2;">${pathwayName}</h2>
        <p style="margin:0;color:#1D4ED8;font-size:14px;line-height:1.6;font-style:italic;">${pathwayDescription}</p>
      </div>
    </td>
  </tr>

  <!-- GREETING -->
  <tr>
    <td style="padding:28px 36px 0;">
      <h3 style="margin:0 0 10px;color:#0F172A;font-size:18px;font-weight:700;">Hi ${displayName},</h3>
      <p style="margin:0;color:#4B5563;font-size:15px;line-height:1.7;">Your Murphy Method™ full assessment report is below. This email contains your complete results — save it so you always have a record of your findings.</p>
    </td>
  </tr>

  <!-- SECTION: KEY SCORES -->
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">YOUR KEY SCORES</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
        ${scoreRow("STOP-BANG Score", `${stopBangScore}/8 — ${riskLabel} OSA Risk`, riskColor)}
        ${scoreRow("Insomnia Severity Index (ISI)", `${isiScore}/28 — ${isiLabel}`, isiColor)}
        ${scoreRow("Body Mass Index (BMI)", bmiValue ? `${bmiValue.toFixed(1)} kg/m² — ${bmiLabel}` : `Not calculated`, bmiColor)}
        ${scoreRow("PLATO-11 Total", `${platoTotal}/44`, "#374151")}
        ${scoreRow("Airway Anatomy Findings", `${anatomyTotal} finding${anatomyTotal !== 1 ? "s" : ""} across 4 zones`, anatomyTotal > 0 ? "#D97706" : "#16A34A")}
        ${scoreRow("Medical History Conditions", medicalHistoryScore > 0 ? medicalHistoryConditions.join(", ") : "None reported", medicalHistoryScore > 0 ? "#D97706" : "#16A34A")}
      </table>
    </td>
  </tr>

  <!-- SECTION: WHAT YOUR RESULTS SUGGEST -->
  ${whatResultsSuggest.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">WHAT YOUR RESULTS SUGGEST</p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          ${whatResultsSuggest.map(t => bullet(t)).join("")}
        </table>
      </div>
    </td>
  </tr>` : ""}

  <!-- SECTION: AIRWAY ANATOMY -->
  ${anatomyZones.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">YOUR AIRWAY ANATOMY — 4 ZONES</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
        <tr style="background:#F9FAFB;">
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Zone</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;text-align:center;">Score</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;text-align:center;">Status</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Findings</td>
        </tr>
        ${anatomyZones.map(zoneRow).join("")}
      </table>
    </td>
  </tr>` : ""}

  <!-- SECTION: PALM CLASSIFICATION -->
  ${palmResults.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 4px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">PALM CLASSIFICATION</p>
      <p style="margin:0 0 12px;color:#9CA3AF;font-size:12px;font-style:italic;">Underlying factors that may contribute to your sleep apnea</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
        <tr style="background:#F9FAFB;">
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;text-align:center;width:32px;"></td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Factor</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;text-align:center;">Result</td>
          <td style="padding:8px 12px;color:#6B7280;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Positive Findings</td>
        </tr>
        ${palmResults.map(palmRow).join("")}
      </table>
    </td>
  </tr>` : ""}

  <!-- SECTION: WHY THIS MATTERS -->
  ${whyItMattersPts.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">WHY THIS MATTERS FOR YOUR PATHWAY</p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          ${whyItMattersPts.map(t => bullet(t)).join("")}
        </table>
      </div>
    </td>
  </tr>` : ""}

  <!-- SECTION: WHAT WORKS BEST -->
  ${whatWorksBestOpts.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">TREATMENT OPTIONS FOR YOUR PATHWAY</p>
      <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          ${whatWorksBestOpts.map(t => bullet(t)).join("")}
        </table>
      </div>
    </td>
  </tr>` : ""}

  <!-- SECTION: ACTION PLAN -->
  ${nextStepsSteps.length > 0 ? `
  <tr>
    <td style="padding:28px 36px 0;">
      <p style="margin:0 0 12px;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">YOUR RECOMMENDED ACTION PLAN</p>
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:20px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          ${nextStepsSteps.map((t, i) => numberedStep(i + 1, t)).join("")}
        </table>
      </div>
    </td>
  </tr>` : ""}

  <!-- PORTAL CTA -->
  <tr>
    <td style="padding:28px 36px 0;">
      <div style="background:#0F172A;border-radius:10px;padding:28px;text-align:center;">
        <p style="margin:0 0 6px;color:#60A5FA;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">SAVE YOUR RESULTS PERMANENTLY</p>
        <h3 style="margin:0 0 10px;color:#ffffff;font-size:18px;font-weight:700;">Set Up My Portal — Free</h3>
        <p style="margin:0 0 20px;color:#94A3B8;font-size:14px;line-height:1.6;">Your full interactive report — with all scores, airway findings, and pathway details — is accessible from any device when you create a free portal account. Without an account, results are only stored in your original browser.</p>
        <a href="https://sleepcheckup.com/portal" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;">Access My Portal</a>
      </div>
    </td>
  </tr>

  <!-- WHAT TO DO WITH THIS REPORT -->
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

  <!-- DIVIDER + DISCLAIMER -->
  <tr>
    <td style="padding:28px 36px 16px;">
      <div style="border-top:1px solid #E5E7EB;padding-top:20px;">
        <p style="margin:0;color:#9CA3AF;font-size:12px;text-align:center;line-height:1.7;">This report is for educational purposes only and does not constitute a medical diagnosis or treatment recommendation.<br>A service of Sleep Check Up, Inc. | Clinical content by Michael Murphy, MD, MPH — Stanford Medicine.<br>Questions? Reply to this email or contact us at <a href="mailto:info@sleepcheckup.com" style="color:#9CA3AF;">info@sleepcheckup.com</a></p>
      </div>
    </td>
  </tr>

  <!-- FOOTER -->
  <!-- Recovery Link CTA -->
  ${params.reportToken ? `<tr>
    <td style="padding:0 36px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;">
        <tr><td style="padding:24px 28px;">
          <p style="margin:0 0 6px;color:#1D4ED8;font-size:16px;font-weight:700;">Access Your Report Anytime</p>
          <p style="margin:0 0 18px;color:#374151;font-size:14px;line-height:1.6;">Your personalized report is saved at this link — no account or login required. Bookmark it or come back to this email anytime.</p>
          <a href="https://sleepcheckup.com/report/${params.reportToken}"
             style="display:inline-block;background:#2563EB;color:#ffffff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:6px;text-decoration:none;">
            View My Report
          </a>
          <p style="margin:14px 0 0;color:#6B7280;font-size:12px;">Or copy this link: https://sleepcheckup.com/report/${params.reportToken}</p>
        </td></tr>
      </table>
    </td>
  </tr>` : ""}

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

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      bcc: [ADMIN_EMAIL],
      subject: `Your Murphy Method™ Report — ${pathwayName}`,
      html,
    });

    if (error) {
      console.error("Resend error (report):", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Email send error (report):", err);
    return { success: false, error: err.message };
  }
}

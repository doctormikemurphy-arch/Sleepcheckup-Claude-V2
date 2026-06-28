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

function getStopBangMeaning(risk: string) {
  if (risk === "high") return "A score of 5–8 indicates a high probability of moderate-to-severe obstructive sleep apnea. Clinical evaluation is strongly recommended.";
  if (risk === "intermediate") return "A score of 3–4 indicates a meaningful probability of obstructive sleep apnea and warrants further clinical evaluation.";
  return "A score of 0–2 indicates a lower probability of obstructive sleep apnea based on the standard STOP-BANG clinical screening tool.";
}

function getUrgencyColors(risk: string) {
  if (risk === "high") return { border: "#FCA5A5", bg: "#FEF2F2", text: "#B91C1C" };
  if (risk === "intermediate") return { border: "#FCD34D", bg: "#FFFBEB", text: "#B45309" };
  return { border: "#86EFAC", bg: "#F0FDF4", text: "#15803D" };
}

interface ZoneResponses { answeredYes?: string[]; }

interface AnatomyData {
  noseScore?: number;       noseIsPositive?: boolean;    noseResponses?: ZoneResponses;
  palateScore?: number;     palateIsPositive?: boolean;  palateResponses?: ZoneResponses;
  mandibleScore?: number;   mandibleIsPositive?: boolean; mandibleResponses?: ZoneResponses;
  neckScore?: number;       neckIsPositive?: boolean;    neckResponses?: ZoneResponses;
}

const ZONE_CONFIG = [
  { label: "Nose & Nasal Airway",  scoreKey: "noseScore"     as const, positiveKey: "noseIsPositive"     as const, responsesKey: "noseResponses"     as const, maxScore: 5 },
  { label: "Palate & Tonsils",     scoreKey: "palateScore"   as const, positiveKey: "palateIsPositive"   as const, responsesKey: "palateResponses"   as const, maxScore: 3 },
  { label: "Jaw & Tongue",         scoreKey: "mandibleScore" as const, positiveKey: "mandibleIsPositive" as const, responsesKey: "mandibleResponses" as const, maxScore: 3 },
  { label: "Neck",                  scoreKey: "neckScore"     as const, positiveKey: "neckIsPositive"     as const, responsesKey: "neckResponses"     as const, maxScore: 3 },
];

const SPECIALISTS = [
  { name: "American Academy of Sleep Medicine – Find a Sleep Center", href: "https://sleepeducation.org/sleep-center", url: "sleepeducation.org/sleep-center", description: "Locate an accredited sleep center near you staffed with sleep medicine specialists who can evaluate both insomnia and sleep apnea." },
  { name: "American Academy of Otolaryngology – Find an ENT", href: "https://www.enthealth.org/find-ent", url: "enthealth.org/find-ent", description: "Locate an Ear, Nose & Throat surgeon who specializes in diagnosing and treating nasal obstruction and airway issues." },
  { name: "American Academy of Dental Sleep Medicine", href: "https://www.aadsm.org/find_an_aadsm_qualilfied_denti.php", url: "aadsm.org", description: "Find a dentist specializing in oral appliance therapy for the treatment of snoring and obstructive sleep apnea." },
  { name: "Society of Behavioral Sleep Medicine – Find a Provider", href: "https://www.behavioralsleep.org", url: "behavioralsleep.org", description: "Find a behavioral sleep medicine specialist trained in CBT-I for insomnia treatment." },
  { name: "American Association of Clinical Endocrinology – Find an Endocrinologist", href: "https://www.aace.com/find-an-endo", url: "aace.com/find-an-endo", description: "Find a clinical endocrinologist who specializes in metabolic conditions including obesity, a major contributor to obstructive sleep apnea." },
];

function sectionHeading(label: string, color: string) {
  return `<div style="border-bottom:2px solid ${color};padding-bottom:8px;margin:32px 0 16px;">
    <p style="margin:0;font-size:16px;font-weight:700;color:#0F172A;font-family:sans-serif;">${label}</p>
  </div>`;
}

function zoneRow(zone: typeof ZONE_CONFIG[0], anatomy: AnatomyData) {
  const score = anatomy[zone.scoreKey] ?? 0;
  const isPositive = anatomy[zone.positiveKey] ?? false;
  const answeredYes = anatomy[zone.responsesKey]?.answeredYes ?? [];
  const badgeBg = isPositive ? "#FEF9C3" : "#DCFCE7";
  const badgeText = isPositive ? "#713F12" : "#14532D";
  const rowBg = isPositive ? "#FFFBEB" : "#F8FAFC";
  const dotColor = isPositive ? "#EAB308" : "#22C55E";

  const answeredHtml = isPositive && answeredYes.length > 0
    ? `<ul style="margin:6px 0 0;padding-left:20px;">
        ${answeredYes.map((q) => `<li style="font-size:13px;color:#6B7280;margin:3px 0;">${q}</li>`).join("")}
       </ul>`
    : "";

  return `<tr>
    <td style="padding:10px 12px;background:${rowBg};border-bottom:1px solid #E5E7EB;vertical-align:top;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:${answeredHtml ? "4px" : "0"};">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${dotColor};flex-shrink:0;margin-top:1px;"></span>
        <span style="font-size:14px;font-weight:600;color:#0F172A;font-family:sans-serif;">${zone.label}</span>
        <span style="margin-left:auto;font-size:12px;color:#6B7280;font-family:sans-serif;white-space:nowrap;">${score}/${zone.maxScore}</span>
        <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;background:${badgeBg};color:${badgeText};font-family:sans-serif;white-space:nowrap;">${isPositive ? "Flagged" : "Clear"}</span>
      </div>
      ${answeredHtml}
    </td>
  </tr>`;
}

function numberedStep(n: number, title: string, body: string) {
  return `<tr>
    <td style="padding:10px 12px;background:#F8FAFC;border-radius:8px;margin-bottom:8px;border-bottom:4px solid #fff;">
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="width:26px;height:26px;border-radius:50%;background:#DBEAFE;display:flex;align-items:center;justify-content:center;flex-shrink:0;text-align:center;line-height:26px;">
          <span style="font-size:12px;font-weight:700;color:#1D4ED8;">${n}</span>
        </div>
        <div>
          <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#0F172A;font-family:sans-serif;">${title}</p>
          <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;font-family:sans-serif;">${body}</p>
        </div>
      </div>
    </td>
  </tr>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Resend not configured" });
  }

  const {
    email,
    stopBangScore,
    osaRisk,
    flaggedZones = [],
    urgencyHeadline,
    urgencyMessage,
    anatomy,
    hasHighRisk = false,
    hasMedRisk = false,
  } = (req.body ?? {}) as {
    email?: string;
    stopBangScore?: number;
    osaRisk?: string;
    flaggedZones?: string[];
    urgencyHeadline?: string;
    urgencyMessage?: string;
    anatomy?: AnatomyData;
    hasHighRisk?: boolean;
    hasMedRisk?: boolean;
  };

  if (!email || typeof stopBangScore !== "number" || !osaRisk) {
    return res.status(400).json({ error: "email, stopBangScore, and osaRisk are required" });
  }

  const riskColor = getRiskColor(osaRisk);
  const riskLabel = getRiskLabel(osaRisk);
  const urgencyColors = getUrgencyColors(osaRisk);

  const step2Body = hasHighRisk
    ? "Your STOP-BANG score indicates high risk — a sleep study is strongly recommended. This may be an in-lab polysomnography or a home sleep apnea test (HSAT)."
    : hasMedRisk
    ? "Your STOP-BANG score indicates moderate risk. A sleep study is a reasonable next step to confirm or rule out OSA and determine its severity."
    : "Even with a lower STOP-BANG score, if you have symptoms such as snoring, witnessed apneas, or daytime sleepiness, discuss a sleep study with your doctor.";

  const zonesHtml = anatomy
    ? ZONE_CONFIG.map((z) => zoneRow(z, anatomy)).join("")
    : (flaggedZones.length > 0
        ? flaggedZones.map((z) => `<li style="margin:4px 0;color:#374151;font-family:sans-serif;">${z}</li>`).join("")
        : `<li style="color:#374151;font-family:sans-serif;">No specific zones flagged</li>`);

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
            <p style="margin:0;color:#9CA3AF;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;font-family:sans-serif;">MURPHY METHOD™</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;font-family:sans-serif;">SleepCheckup.com</h1>
          </td>
        </tr>

        <!-- Main content -->
        <tr>
          <td style="padding:40px 36px;">
            <h2 style="margin:0 0 8px;color:#0F172A;font-size:24px;font-weight:700;font-family:sans-serif;">Your Free Screening Results</h2>
            <p style="margin:0 0 28px;color:#6B7280;font-size:15px;font-family:sans-serif;">Here's a summary of what your responses indicate.</p>

            <!-- Urgency Signal -->
            ${urgencyHeadline ? `
            <div style="border:2px solid ${urgencyColors.border};background:${urgencyColors.bg};border-radius:10px;padding:18px 20px;margin-bottom:28px;">
              <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#0F172A;font-family:sans-serif;">${urgencyHeadline}</p>
              ${urgencyMessage ? `<p style="margin:0;font-size:14px;color:#475569;line-height:1.65;font-family:sans-serif;">${urgencyMessage}</p>` : ""}
            </div>` : ""}

            <!-- STEP 1: STOP-BANG -->
            ${sectionHeading("Step 1: How is the Breathing at Night? — STOP-BANG Score", "#1D4ED8")}
            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:24px;margin-bottom:8px;">
              <div style="margin-bottom:12px;">
                <span style="font-size:40px;font-weight:700;color:#0F172A;font-family:sans-serif;">${stopBangScore}<span style="font-size:22px;color:#9CA3AF;">/8</span></span>
                <span style="margin-left:12px;background:${riskColor}20;color:${riskColor};font-size:13px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid ${riskColor}40;font-family:sans-serif;">${riskLabel}</span>
              </div>
              <p style="margin:0;color:#4B5563;font-size:14px;line-height:1.65;font-family:sans-serif;">${getStopBangMeaning(osaRisk)}</p>
            </div>

            <!-- STEP 2: AIRWAY ZONES -->
            ${sectionHeading("Step 2: Where Can the Airway Narrow? — Airway Zone Assessment", "#16A34A")}
            <p style="margin:0 0 12px;color:#475569;font-size:14px;line-height:1.65;font-family:sans-serif;">The Murphy Method™ evaluates four anatomical zones from top to bottom. Each zone that responds positively is <strong>flagged</strong> — meaning your responses suggest that area may be contributing to sleep-disordered breathing.</p>
            ${anatomy ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;margin-bottom:8px;">
              ${zonesHtml}
            </table>` : `
            <ul style="margin:0 0 8px;padding-left:20px;">${zonesHtml}</ul>`}

            <!-- STEP 3: WHAT CAN HELP -->
            ${sectionHeading("Step 3: What Can Help?", "#DC2626")}
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
              <tr>
                <td width="48%" style="vertical-align:top;padding-right:8px;">
                  <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:16px;">
                    <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1E40AF;font-family:sans-serif;">Non-Surgery Options</p>
                    ${["CPAP", "Oral appliance", "Other treatments"].map((item) => `<p style="margin:0 0 6px;font-size:14px;color:#0F172A;font-family:sans-serif;">› ${item}</p>`).join("")}
                  </div>
                </td>
                <td width="4%"></td>
                <td width="48%" style="vertical-align:top;padding-left:8px;">
                  <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:16px;">
                    <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#991B1B;font-family:sans-serif;">Procedure Options</p>
                    ${["Nose procedures", "Palate / tonsil procedures", "Jaw / tongue procedures"].map((item) => `<p style="margin:0 0 6px;font-size:14px;color:#0F172A;font-family:sans-serif;">› ${item}</p>`).join("")}
                  </div>
                </td>
              </tr>
            </table>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 16px;margin-bottom:8px;">
              <p style="margin:0;font-size:14px;color:#0F172A;line-height:1.6;font-family:sans-serif;"><strong style="color:#1E40AF;">Simple idea:</strong> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.</p>
            </div>

            <!-- KEY CONCEPT -->
            <div style="background:#EFF6FF;border:2px solid #BFDBFE;border-radius:10px;padding:20px 24px;margin:28px 0;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#1D4ED8;font-family:sans-serif;">Key Concept</p>
              <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#0F172A;line-height:1.4;font-family:sans-serif;">A low-risk STOP-BANG score does NOT mean you do not have OSA.</p>
              <p style="margin:0;font-size:14px;color:#475569;line-height:1.65;font-family:sans-serif;">The STOP-BANG is a screening tool — not a diagnosis. Anyone with snoring, witnessed pauses in breathing, or excessive daytime sleepiness should discuss these symptoms with a doctor regardless of their score.</p>
            </div>

            <!-- YOUR NEXT STEP -->
            ${sectionHeading("Your Next Step — What to Do With These Results", "#0F172A")}
            <p style="margin:0 0 12px;color:#475569;font-size:14px;line-height:1.65;font-family:sans-serif;">The next step is to <strong style="color:#0F172A;">see a doctor to discuss the results of this screening tool</strong> and see if you have snoring or OSA. This will probably include a sleep study to measure your breathing while you sleep.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 6px;margin-bottom:8px;">
              ${numberedStep(1, "See Your Primary Care Provider", "Share these results and discuss your symptoms. They can order a sleep study or refer you to the right specialist based on your anatomy and risk profile.")}
              ${numberedStep(2, "Get a Sleep Study if Recommended", step2Body)}
              ${numberedStep(3, "See the Right Specialist for Your Anatomy", "The Find a Specialist section below lists the medical providers best suited to evaluate and treat sleep-disordered breathing based on your results.")}
            </table>

            <!-- FIND A SPECIALIST -->
            ${sectionHeading("Find a Specialist", "#0F172A")}
            <p style="margin:0 0 12px;color:#475569;font-size:14px;font-family:sans-serif;">Connect with a qualified specialist who can evaluate and treat your sleep breathing concerns.</p>
            ${SPECIALISTS.map((s) => `
            <div style="border:1px solid #E2E8F0;border-radius:8px;padding:14px 16px;margin-bottom:8px;background:#fff;">
              <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#0F172A;font-family:sans-serif;">${s.name}</p>
              <a href="${s.href}" style="font-size:13px;color:#1D4ED8;font-family:sans-serif;">${s.url}</a>
              <p style="margin:4px 0 0;font-size:13px;color:#6B7280;line-height:1.6;font-family:sans-serif;">${s.description}</p>
            </div>`).join("")}

            <!-- $79 UPSELL -->
            <div style="background:#0F172A;border-radius:10px;padding:28px;margin-top:32px;margin-bottom:24px;text-align:center;">
              <p style="margin:0 0 8px;color:#60A5FA;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;font-family:sans-serif;">READY TO GO DEEPER?</p>
              <h3 style="margin:0 0 12px;color:#ffffff;font-size:18px;font-weight:700;font-family:sans-serif;">Get Your Full Personalized Report</h3>
              <p style="margin:0 0 20px;color:#9CA3AF;font-size:14px;line-height:1.6;font-family:sans-serif;">The full Murphy Method™ assessment identifies exactly which of 8 pathways applies to you — and gives you a complete report to bring to your doctor.</p>
              <a href="https://sleepcheckup.com/assessment/info" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;font-family:sans-serif;">Get My Full Report — $79</a>
              <p style="margin:12px 0 0;color:#6B7280;font-size:12px;font-family:sans-serif;">One-time payment. No subscription. Delivered instantly.</p>
            </div>

            <p style="margin:0;color:#9CA3AF;font-size:12px;text-align:center;line-height:1.6;font-family:sans-serif;">This is an educational screening tool and does not constitute a medical diagnosis.<br>A service of Sleep Check Up, Inc. | Clinical content by Michael Murphy, MD, MPH — Stanford Medicine.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:20px 36px;text-align:center;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;font-family:sans-serif;">© 2026 SleepCheckup.com · <a href="https://sleepcheckup.com/privacy" style="color:#9CA3AF;">Privacy Policy</a> · <a href="https://sleepcheckup.com/terms" style="color:#9CA3AF;">Terms of Use</a></p>
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

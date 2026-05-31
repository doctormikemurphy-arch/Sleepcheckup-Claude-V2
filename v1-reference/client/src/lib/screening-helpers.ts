import type { ScreeningProfile } from "./screening-types";

export type UrgencyLevel = "urgent" | "soon" | "routine";

export interface UrgencyInfo {
  level: UrgencyLevel;
  headline: string;
  message: string;
  colorClasses: string;
  borderClass: string;
}

export function getUrgencyInfo(profile: ScreeningProfile): UrgencyInfo {
  const { osaRisk, stopBangScore } = profile;
  const flaggedZones = [
    profile.anatomy.noseIsPositive,
    profile.anatomy.palateIsPositive,
    profile.anatomy.mandibleIsPositive,
    profile.anatomy.neckIsPositive,
  ].filter(Boolean).length;

  // High risk: STOP-BANG score 5–8
  if (osaRisk === "high") {
    return {
      level: "urgent",
      headline: "High Risk for Sleep Apnea — See a doctor soon",
      message: `Your STOP-BANG score of ${stopBangScore}/8 indicates High Risk for obstructive sleep apnea (OSA). A score of 5 or above is associated with a high probability of moderate-to-severe OSA. Please schedule an appointment with your primary care doctor or a sleep specialist as soon as possible — ideally within the next 2–4 weeks.`,
      colorClasses: "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200",
      borderClass: "border-red-300 dark:border-red-700",
    };
  }

  // Moderate risk: STOP-BANG score 3–4, especially with flagged anatomy zones
  if (osaRisk === "intermediate") {
    const anatomyNote = flaggedZones >= 2
      ? ` Your responses also flagged ${flaggedZones} airway zones, which increases the clinical concern. Evaluation is recommended sooner rather than later.`
      : "";
    return {
      level: flaggedZones >= 2 ? "urgent" : "soon",
      headline: "Moderate Risk for Sleep Apnea — Schedule a doctor visit",
      message: `Your STOP-BANG score of ${stopBangScore}/8 indicates Moderate Risk for obstructive sleep apnea (OSA). A score of 3–4 suggests a meaningful probability of OSA that warrants clinical evaluation.${anatomyNote} Bring these results to your doctor at your next appointment or book one within the next 1–2 months.`,
      colorClasses: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200",
      borderClass: "border-yellow-300 dark:border-yellow-700",
    };
  }

  // Low risk: STOP-BANG score 0–2
  return {
    level: "routine",
    headline: "Low Risk for Sleep Apnea — Discuss at your next appointment",
    message: `Your STOP-BANG score of ${stopBangScore}/8 indicates Low Risk for obstructive sleep apnea (OSA). A score of 0–2 is associated with a lower probability of OSA. Even so, snoring and sleep symptoms are worth discussing with your doctor — especially if a bed partner has noticed pauses in your breathing or you feel tired during the day.`,
    colorClasses: "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200",
    borderClass: "border-green-300 dark:border-green-700",
  };
}

export function getDoctorQuestions(profile: ScreeningProfile): string[] {
  const questions: string[] = [];
  const { stopBangScore, osaRisk, anatomy } = profile;

  // Risk-based questions
  if (osaRisk === "high") {
    questions.push(`My STOP-BANG score is ${stopBangScore} out of 8. Does that mean I should have a sleep study?`);
    questions.push("Would a home sleep test work for me, or do I need an in-lab sleep study?");
    questions.push("Should I see you first, or go straight to a sleep specialist?");
  } else if (osaRisk === "intermediate") {
    questions.push(`My STOP-BANG score is ${stopBangScore} out of 8. Is that concerning enough to have a sleep study?`);
    questions.push("Can I start with a home sleep test, or do you want to evaluate me first?");
  } else {
    questions.push(`My STOP-BANG score is ${stopBangScore} out of 8. Even at low risk, could I still have sleep apnea?`);
    questions.push("I snore but scored low — should I still be evaluated?");
  }

  // Zone-based question (consolidated)
  const anyZoneFlagged = anatomy.noseIsPositive || anatomy.palateIsPositive || anatomy.mandibleIsPositive || anatomy.neckIsPositive;
  if (anyZoneFlagged) {
    questions.push("First see your doctor to discuss your Airway responses. If possible, see an Ear, Nose & Throat doctor to follow up on your responses and confirm the problem.");
  }

  // Universal questions
  questions.push("If I do have sleep apnea, what are my treatment options beyond CPAP?");
  questions.push("Is there anything I can do right now — like changing my sleep position or losing weight — that might help?");
  questions.push("Should my bed partner be here for any of these conversations?");

  return questions;
}

export function generateResultsEmailBody(profile: ScreeningProfile, url: string): string {
  const { stopBangScore, osaRisk, anatomy } = profile;
  const riskLabel = osaRisk === "high" ? "High Risk" : osaRisk === "intermediate" ? "Intermediate Risk" : "Low Risk";

  const flaggedZones = [
    anatomy.noseIsPositive ? "Nose" : null,
    anatomy.palateIsPositive ? "Palate & Tonsils" : null,
    anatomy.mandibleIsPositive ? "Mandible & Tongue" : null,
    anatomy.neckIsPositive ? "Neck" : null,
  ].filter(Boolean);

  const zonesText = flaggedZones.length > 0
    ? flaggedZones.join(", ")
    : "No areas flagged";

  return `MY MURPHY METHOD™ SLEEP BREATHING SCREENING RESULTS
=====================================================

STEP 1 — HOW IS THE BREATHING AT NIGHT?
Sleep Apnea Risk: ${riskLabel}
STOP-BANG Score: ${stopBangScore}/8

STEP 2 — WHERE CAN THE AIRWAY NARROW?
Airway areas flagged: ${zonesText}

STEP 3 — WHAT CAN HELP?
Based on these results, please discuss treatment options with your doctor.

-----------------------------------------------------
This screening is for educational purposes only and does not constitute a medical diagnosis. Please share these results with your healthcare provider.

Take the free screening: ${url}
Learn more at Murphy Method Sleep — murphymethodsleep.com`;
}

export function generateGoogleCalendarLink(daysFromNow: number, title: string, description: string): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dateStr}/${dateStr}&details=${encodeURIComponent(description)}&trp=false`;
}

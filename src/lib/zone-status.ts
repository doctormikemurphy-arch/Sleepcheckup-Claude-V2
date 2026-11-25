// Anatomy zone status for the "Where Can the Airway Narrow?" section, shared by the assessment
// results page, the PDF report and the free screener results page. The two emails
// (api/submit-assessment.ts and api/screener-submit.ts) keep their own copies because api/
// functions don't import from src/, so change all three together.
//   0 yes answers = Clear, 1 = Noted, 2 or more = Flagged (the same 2+ threshold the pathways use).

export type ZoneStatus = "clear" | "noted" | "flagged";

export function getZoneStatus(score: number): ZoneStatus {
  if (score >= 2) return "flagged";
  if (score === 1) return "noted";
  return "clear";
}

export const ZONE_STATUS_LABEL: Record<ZoneStatus, string> = {
  clear: "Clear",
  noted: "Noted",
  flagged: "Flagged",
};

/** The line under each zone name, matching its label. */
export const ZONE_STATUS_DESCRIPTION: Record<ZoneStatus, string> = {
  flagged: "This area is likely part of your sleep apnea.",
  noted: "One possible sign. Share it with your doctor.",
  clear: "This area is probably not part of the problem.",
};

/**
 * Flagged is orange (the whole card tinted), Noted a pale amber, Clear green. Every badge has a
 * visible border so the three still read apart when printed.
 */
export const ZONE_STATUS_STYLE: Record<ZoneStatus, { rowBorder: string; rowBg: string; dot: string; badgeBg: string; badgeText: string; badgeBorder: string }> = {
  flagged: { rowBorder: "#FDBA74", rowBg: "#FFF7ED", dot: "#EA580C", badgeBg: "#FFEDD5", badgeText: "#9A3412", badgeBorder: "#FDBA74" },
  noted:   { rowBorder: "#FEF3C7", rowBg: "#FFFDF7", dot: "#FCD34D", badgeBg: "#FFFBEB", badgeText: "#92400E", badgeBorder: "#FCD34D" },
  clear:   { rowBorder: "transparent", rowBg: "#F8FAFC", dot: "#22C55E", badgeBg: "#DCFCE7", badgeText: "#14532D", badgeBorder: "#DCFCE7" },
};

export const ZONE_STATUS_EXPLANATION =
  "Flagged means 2 or more yes answers, so this area is likely part of your sleep apnea. Noted means 1 yes answer: share it with your doctor. Clear means no yes answers.";

/** PALM keeps its existing 2 or more rule (no Noted level); worded to match the zone explanation. */
export const PALM_STATUS_EXPLANATION =
  "Flagged means 2 or more yes answers in a group, so this factor may be part of your sleep apnea. Clear means fewer than 2 yes answers.";

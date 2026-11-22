import type { CSSProperties } from "react";
import { CircleAlert } from "lucide-react";

export const PATHWAY_GUIDE_TITLE = "Your pathway is a guide, not a diagnosis";

export const PATHWAY_GUIDE_BODY =
  "Your pathway puts you in a group of people with similar sleep problems, so your doctor knows where to start. Many people have parts of more than one pathway. Following one pathway too strictly could miss something. Your doctor needs to fully check you and decide your treatment, using this pathway as a guide.";

/**
 * Amber "guide, not a diagnosis" box. Shown on the results page, the PDF report and the
 * /pathways pages. The full amber border and icon stroke keep it clear when printed with
 * background graphics off.
 */
export function PathwayGuideBox({ style }: { style?: CSSProperties }) {
  return (
    <div
      className="flex items-start gap-3"
      style={{
        borderRadius: "12px",
        backgroundColor: "#FFFBEB",
        border: "1px solid #FCD34D",
        borderLeft: "5px solid #D97706",
        padding: "16px 18px",
        textAlign: "left",
        breakInside: "avoid",
        ...style,
      }}
    >
      <CircleAlert className="flex-shrink-0" style={{ width: "28px", height: "28px", color: "#B45309", marginTop: "1px" }} aria-hidden="true" />
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px", color: "var(--text-ink)", lineHeight: 1.4, margin: "0 0 4px" }}>
          {PATHWAY_GUIDE_TITLE}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)", lineHeight: 1.65, margin: 0 }}>
          {PATHWAY_GUIDE_BODY}
        </p>
      </div>
    </div>
  );
}

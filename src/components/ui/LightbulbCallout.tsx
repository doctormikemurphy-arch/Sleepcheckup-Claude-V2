import type { CSSProperties, ReactNode } from "react";
import { Lightbulb } from "lucide-react";

/**
 * Light blue tip box with a lightbulb icon. Used on the results page and PDF report.
 * The border and blue icon stroke keep it readable when printed with background graphics off.
 */
export function LightbulbCallout({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="flex items-start gap-3"
      style={{
        borderRadius: "12px",
        backgroundColor: "#EFF6FF",
        border: "1px solid #93C5FD",
        padding: "16px",
        textAlign: "left",
        breakInside: "avoid",
        ...style,
      }}
    >
      <Lightbulb className="flex-shrink-0" style={{ width: "20px", height: "20px", color: "var(--blue)", marginTop: "2px" }} aria-hidden="true" />
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)", lineHeight: 1.65, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

export const SHARE_REPORT_TIP =
  "Send this report to your doctor or dentist before your visit, using their patient portal if they have one, or bring it with you. This helps make your visit more focused, efficient, and successful. You will be a partner in your care, not just along for the ride.";

export function AlwaysRememberTip({ style }: { style?: CSSProperties }) {
  return (
    <LightbulbCallout style={style}>
      <strong>Always remember:</strong> Treating your sleep problem is a journey. Your needs and treatments may change over time. You know yourself best. Trust yourself and speak up for what you need.
    </LightbulbCallout>
  );
}

export function SimpleIdeaTip({ style }: { style?: CSSProperties }) {
  return (
    <LightbulbCallout style={style}>
      <strong>Simple idea:</strong> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.
    </LightbulbCallout>
  );
}

export const PALM_INTRO =
  "Sleep apnea is not just a blocked airway. Three other things can play a part: 1) how easily you wake up, 2) how steady your breathing is, and 3) how well your airway muscles keep working during sleep. The PALM Classification checks all four.";

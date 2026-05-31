import { AlertTriangle } from "lucide-react";
import { Link } from "wouter";

interface Step1WelcomeProps {
  onBegin: () => void;
}

const methodSteps = [
  {
    num: "1",
    title: "How Is the Breathing at Night?",
    description: "A quick screening questionnaire to assess your risk for sleep apnea.",
  },
  {
    num: "2",
    title: "Where Can the Airway Narrow?",
    description: "Identify areas of your airway that might affect your breathing during sleep.",
  },
  {
    num: "3",
    title: "What Can Help?",
    description: "Understand the big picture of how snoring and sleep apnea treatment options are organized.",
  },
];

export function Step1Welcome({ onBegin }: Step1WelcomeProps) {
  return (
    <div
      className="mx-auto px-4"
      style={{ maxWidth: "720px", paddingTop: "64px", paddingBottom: "96px" }}
      id="main-content"
    >
      <div className="eyebrow mb-4">FREE SCREENING</div>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "clamp(28px, 4vw, 48px)",
          lineHeight: 1.05,
          color: "var(--text-ink)",
          marginBottom: "24px",
        }}
      >
        Before we begin, here's what <em>we'll cover</em>
      </h1>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "18px", color: "var(--text-ink-soft)", lineHeight: 1.65, marginBottom: "32px" }}>
        This free screening follows the same proven framework I use with every snoring and sleep apnea patient I see in my office. In just a few minutes, you will get a snapshot of your risk of having sleep apnea and which areas of your airway may be involved.
      </p>

      {/* What to expect card */}
      <div className="card-tinted" style={{ borderRadius: "20px", padding: "32px", marginBottom: "48px" }}>
        <div className="eyebrow mb-4">WHAT TO EXPECT</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(() => {
            const stepColors = ["#1D4ED8", "#15803D", "#B91C1C"];
            return methodSteps.map((s, i) => (
              <div key={s.num} className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold"
                  style={{
                    width: "28px",
                    height: "28px",
                    backgroundColor: stepColors[i] ?? "var(--blue)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    marginTop: "1px",
                    flexShrink: 0,
                  }}
                >
                  {s.num}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "16px", color: stepColors[i] ?? "var(--text-ink)", marginBottom: "4px" }}>
                    {s.title}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.55 }}>
                    {s.description}
                  </p>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="flex gap-3 mb-10"
        style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "12px", padding: "16px" }}
      >
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#B45309" }} />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#92400E", lineHeight: 1.6 }}>
          <strong>Medical Disclaimer:</strong> This screening tool is for educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding any medical conditions.
        </p>
      </div>

      {/* Begin CTA */}
      <button onClick={onBegin} className="btn-primary w-full" style={{ fontSize: "18px" }}>
        Begin →
      </button>

      <p className="text-center mt-5" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>
        Want a comprehensive evaluation?{" "}
        <Link href="/assessment/info" className="no-underline" style={{ color: "var(--blue)" }}>
          See the Full Assessment →
        </Link>
      </p>
    </div>
  );
}

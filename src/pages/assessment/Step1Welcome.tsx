import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";

interface Step1WelcomeProps {
  onStart: () => void;
  onSkip: () => void;
}

const methodSteps = [
  { title: "How Is the Breathing at Night?", description: "Medical history, BMI, STOP-BANG, ISI, and PLATO-11 questionnaires." },
  { title: "Where Can the Airway Narrow?", description: "Identify areas of your airway that may affect breathing during sleep." },
  { title: "What Can Help?", description: "PALM classification and a full overview of treatment options." },
  { title: "Your Results", description: "Personalized pathway assignment with curated resources, printable for your doctor." },
];

export function Step1Welcome({ onStart, onSkip }: Step1WelcomeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="mx-auto px-4"
      style={{ maxWidth: "720px", paddingTop: "64px", paddingBottom: "96px" }}
      id="main-content"
    >
      <div className="eyebrow mb-4">FULL ASSESSMENT</div>
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
        You're <em>in</em>. Let's begin.
      </h1>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-ink-soft)", lineHeight: 1.65, marginBottom: "24px" }}>
        A comprehensive educational evaluation of your sleep breathing — personalized to your unique situation. Takes approximately 10–15 minutes.
      </p>

      {/* Disclaimer */}
      <div
        className="flex gap-3 mb-8"
        style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "12px", padding: "16px" }}
      >
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#B45309" }} />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#92400E", lineHeight: 1.6 }}>
          <strong>Medical Disclaimer:</strong> This assessment is for educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.
        </p>
      </div>

      {/* Primary CTA */}
      <button onClick={onStart} className="btn-primary w-full mb-3" style={{ fontSize: "18px" }}>
        I'm ready, start now →
      </button>

      {/* Show overview toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-2 border-0 bg-transparent cursor-pointer mb-6"
        style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", minHeight: "44px" }}
      >
        {expanded ? "Hide overview" : "Show me the method overview first"}
        <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>

      {/* Expandable overview */}
      {expanded && (
        <div className="mb-6">
          <div className="card-tinted" style={{ borderRadius: "20px", padding: "32px", marginBottom: "16px" }}>
            <div className="eyebrow mb-4">WHAT TO EXPECT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {(() => {
                const stepColors = ["#1D4ED8", "#15803D", "#B91C1C"];
                return methodSteps.map((s, i) => (
                  <div key={s.title} className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold"
                      style={{ width: "28px", height: "28px", backgroundColor: stepColors[i] ?? "var(--blue)", fontFamily: "var(--font-sans)", fontSize: "13px", flexShrink: 0, marginTop: "1px" }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "16px", color: stepColors[i] ?? "var(--text-ink)", marginBottom: "4px" }}>{s.title}</p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.55 }}>{s.description}</p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
          <button onClick={onSkip} className="btn-primary w-full" style={{ fontSize: "17px" }}>
            Start Assessment →
          </button>
        </div>
      )}
    </div>
  );
}

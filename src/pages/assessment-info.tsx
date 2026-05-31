import { Link } from "wouter";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";

const assessmentSections = [
  { title: "How Is the Breathing at Night?", description: "Medical history, BMI, STOP-BANG, ISI, and PLATO-11 questionnaires." },
  { title: "Where Can the Airway Narrow?", description: "Identify areas of your airway that may affect breathing during sleep." },
  { title: "What Can Help?", description: "PALM classification and a full overview of treatment options." },
  { title: "Your Results", description: "Personalized pathway assignment with curated resources, printable for your doctor." },
];

const included = [
  "Medical history screening (8 conditions)",
  "STOP-BANG sleep apnea risk score",
  "Insomnia Severity Index (ISI)",
  "PLATO-11 treatment readiness profile",
  "Top-Down Anatomy self-check (4 zones)",
  "Personalized pathway assignment",
  "Pathway-specific curated resources",
  "Exact questions to ask your doctor",
  "Specialist referral guide matched to your pathway",
  "Printable results for your doctor",
];

export default function AssessmentInfoPage() {
  return (
    <>
      {/* Hero */}
      <section className="section" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div className="eyebrow mb-4">FULL ASSESSMENT</div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(28px, 4vw, 56px)",
              lineHeight: 1.05,
              color: "var(--text-ink)",
              marginBottom: "24px",
            }}
          >
            What you get for <em>$79</em>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "20px",
              color: "var(--text-ink-soft)",
              lineHeight: 1.6,
              maxWidth: "640px",
              margin: "0 auto",
            }}
          >
            A comprehensive educational evaluation of your sleep breathing — personalized to your unique situation.
          </p>
        </div>
      </section>

      {/* Two columns */}
      <section className="section-tinted">
        <div className="section-inner px-6">
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            {/* Left: 4 sections */}
            <div className="card" style={{ padding: "40px" }}>
              <div className="eyebrow mb-6">THE 4 SECTIONS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {assessmentSections.map((s, i) => {
                  const stepColors = ["#1D4ED8", "#15803D", "#B91C1C", "#0F172A"];
                  const color = stepColors[i] ?? "#1D4ED8";
                  return (
                  <div key={s.title} className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold"
                      style={{ width: "28px", height: "28px", backgroundColor: color, fontFamily: "var(--font-sans)", fontSize: "13px", flexShrink: 0, marginTop: "1px" }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "16px", color: "var(--text-ink)", marginBottom: "4px" }}>{s.title}</p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.55 }}>{s.description}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Right: What's included */}
            <div className="card" style={{ padding: "40px" }}>
              <div className="eyebrow mb-6">WHAT YOU RECEIVE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{ width: "20px", height: "20px", backgroundColor: "var(--blue-soft)", marginTop: "2px" }}
                    >
                      <Check className="w-3 h-3" style={{ color: "var(--blue)" }} strokeWidth={3} />
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink-soft)" }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="card" style={{ padding: "24px" }}>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {["7-day refund policy", "No subscription", "Emailed instantly"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: "20px", height: "20px", backgroundColor: "var(--blue-soft)" }}
                  >
                    <Check className="w-3 h-3" style={{ color: "var(--blue)" }} strokeWidth={3} />
                  </div>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink-soft)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div style={{ maxWidth: "540px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <Link href="/assessment/checkout" className="no-underline block mb-4">
            <button className="btn-primary w-full" style={{ fontSize: "18px", gap: "8px" }}>
              Continue to checkout (prototype) →
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <div
            className="flex gap-3 mt-6"
            style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "12px", padding: "16px", textAlign: "left" }}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#B45309" }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#92400E", lineHeight: 1.6 }}>
              <strong>Medical Disclaimer:</strong> This assessment is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Results should be discussed with a qualified healthcare provider before making any medical decisions.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

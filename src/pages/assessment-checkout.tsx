import { Link, useLocation } from "wouter";
import { setMockPaid } from "@/lib/storage";
import { Check, ArrowRight } from "lucide-react";

export default function AssessmentCheckoutPage() {
  const [, navigate] = useLocation();

  const handleSimulate = () => {
    setMockPaid();
    navigate("/assessment?from=screener");
  };

  return (
    <section className="section" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto", padding: "0 24px" }}>
        <div className="eyebrow mb-4">CHECKOUT · PROTOTYPE MODE</div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(24px, 3vw, 36px)",
            lineHeight: 1.05,
            color: "var(--text-ink)",
            marginBottom: "24px",
          }}
        >
          This prototype does not process <em>real payments</em>
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-ink-soft)", lineHeight: 1.65, marginBottom: "48px" }}>
          Click below to continue to the assessment as if payment was successful.
        </p>

        {/* Product card */}
        <div className="card" style={{ padding: "32px", marginBottom: "32px" }}>
          <div className="flex items-start justify-between mb-4">
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "17px", color: "var(--text-ink)" }}>
              Murphy Method™ Full Assessment Report
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "24px",
                color: "var(--text-ink)",
                flexShrink: 0,
                marginLeft: "16px",
              }}
            >
              $79
            </p>
          </div>
          <hr style={{ borderTop: "1px solid var(--border-soft)", margin: "16px 0" }} />
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "17px", color: "var(--text-ink)" }}>Total</span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "20px", color: "var(--text-ink)" }}>$79</span>
          </div>
        </div>

        <button onClick={handleSimulate} className="btn-primary w-full" style={{ fontSize: "18px", gap: "8px", marginBottom: "16px" }}>
          Simulate Payment &amp; Continue →
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center">
          <Link href="/assessment/info" className="no-underline" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
            ← Back
          </Link>
        </p>
      </div>
    </section>
  );
}

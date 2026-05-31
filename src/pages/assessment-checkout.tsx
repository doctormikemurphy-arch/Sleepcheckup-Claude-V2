import { useState } from "react";
import { Link } from "wouter";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { getScreenerEmail } from "@/lib/storage";

const FEATURES = [
  "Complete pathway assignment (1 of 8 Murphy Method™ pathways)",
  "Full personalized PDF report emailed instantly",
  "Medical history & comorbidity analysis",
  "PLATO-11 treatment readiness",
  "Specialist match for your pathway",
  "7-day satisfaction guarantee",
];

export default function AssessmentCheckoutPage() {
  const [email, setEmail] = useState(() => getScreenerEmail());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() || undefined }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 24px" }}>
        <div className="eyebrow mb-4">SECURE CHECKOUT</div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(24px, 3vw, 36px)",
            lineHeight: 1.05,
            color: "var(--text-ink)",
            marginBottom: "8px",
          }}
        >
          Get Your Full <em>Report</em>
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-ink-soft)", lineHeight: 1.65, marginBottom: "40px" }}>
          One-time payment. No subscription. Your personalized PDF report is emailed instantly when you finish the assessment.
        </p>

        {/* Product card */}
        <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
          <div className="flex items-start justify-between mb-4">
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "17px", color: "var(--text-ink)" }}>
              Murphy Method™ Full Assessment Report
            </p>
            <p style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "24px", color: "var(--text-ink)", flexShrink: 0, marginLeft: "16px" }}>
              $1
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{ width: "18px", height: "18px", backgroundColor: "var(--blue-soft)", marginTop: "2px" }}
                >
                  <Check className="w-2.5 h-2.5" style={{ color: "var(--blue)" }} strokeWidth={3} />
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-ink-soft)" }}>{f}</p>
              </div>
            ))}
          </div>
          <hr style={{ borderTop: "1px solid var(--border-soft)", margin: "16px 0" }} />
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "17px", color: "var(--text-ink)" }}>Total</span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "20px", color: "var(--text-ink)" }}>$1</span>
          </div>
        </div>

        <form onSubmit={handleCheckout}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="checkout-email"
              style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--text-ink)", marginBottom: "8px" }}
            >
              Email address <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(your report will be sent here)</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                border: "1.5px solid var(--border-soft)",
                borderRadius: "var(--radius-input)",
                padding: "14px 16px",
                fontSize: "16px",
                fontFamily: "var(--font-sans)",
                color: "var(--text-ink)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--danger)", marginBottom: "12px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
            style={{ fontSize: "17px", marginBottom: "16px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting to Stripe…
              </>
            ) : (
              <>
                Continue to Secure Payment
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)", textAlign: "center", marginBottom: "16px", lineHeight: 1.5 }}>
          Payments processed securely by Stripe. We never store your card details.
        </p>

        <p className="text-center">
          <Link href="/assessment/info" className="no-underline" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
            ← Back
          </Link>
        </p>
      </div>
    </section>
  );
}

import { Link } from "wouter";
import { Check } from "lucide-react";
import { HOME } from "@/lib/content";

const { pricing } = HOME;

export default function PricingPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: "120px", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow mb-4">PRICING</div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.05,
              color: "var(--text-ink)",
              marginBottom: "16px",
            }}
          >
            {pricing.headline}
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.65 }}>
            {pricing.subheadline}
          </p>
        </div>
      </section>

      <section className="section-tinted">
        <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 24px" }}>
          <div className="card" style={{ padding: "40px", border: "2px solid var(--blue)", position: "relative" }}>
            <span
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "var(--blue)",
                color: "white",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                borderRadius: "9999px",
                padding: "4px 14px",
              }}
            >
              {pricing.paid.badge}
            </span>
            <div className="eyebrow mb-3">{pricing.paid.label}</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  fontSize: "52px",
                  lineHeight: 1,
                  color: "var(--text-ink)",
                }}
              >
                {pricing.paid.price}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)", marginBottom: "28px" }}>
              {pricing.paid.duration}
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", padding: 0, listStyle: "none" }}>
              {pricing.paid.features.map((f) => (
                <li key={f} className="flex items-start gap-3" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)" }}>
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--blue)" }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/assessment/info" className="no-underline">
              <button className="btn-primary w-full">{pricing.paid.ctaButton}</button>
            </Link>
          </div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              textAlign: "center",
              marginTop: "24px",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            No account required · No subscription · If you complete the assessment and are not satisfied with your report, contact us within 7 days for a full refund.
          </p>
        </div>
      </section>
    </>
  );
}

import { Link } from "wouter";
import { Lock, FileText, RefreshCw, BookOpen } from "lucide-react";

const FEATURES = [
  { icon: FileText, title: "Saved Reports", body: "Access your past assessment reports from any device, any time." },
  { icon: RefreshCw, title: "Retake Tracking", body: "Compare results across multiple assessments to track changes over time." },
  { icon: BookOpen, title: "Live Pathway Resources", body: "Curated articles and tools that update as guidelines evolve — matched to your assigned pathway." },
];

export default function PortalPage() {
  return (
    <>
      {/* Demo banner */}
      <div style={{ backgroundColor: "var(--blue-soft)", padding: "12px", textAlign: "center", paddingTop: "92px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-ink)" }}>Demo Mode · Sample data shown</p>
      </div>

      <section className="section">
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div
            className="flex items-center justify-center mx-auto mb-5"
            style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "var(--blue-soft)" }}
          >
            <Lock className="w-7 h-7" style={{ color: "var(--blue)" }} />
          </div>

          <div className="eyebrow mb-4">YOUR PORTAL</div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.05,
              color: "var(--text-ink)",
              marginBottom: "16px",
            }}
          >
            Welcome back, <em>Patient User</em>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", marginBottom: "48px", lineHeight: 1.65 }}>
            The portal lets you save results, retake the assessment, and access live pathway resources. It's included free with every full assessment.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left", marginBottom: "40px" }}>
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card flex items-start gap-4" style={{ padding: "24px" }}>
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "var(--blue-soft)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "var(--blue)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "15px", color: "var(--text-ink)", marginBottom: "4px" }}>{title}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/screener" className="no-underline">
            <button className="btn-primary w-full">Start Free Screener →</button>
          </Link>
        </div>
      </section>
    </>
  );
}

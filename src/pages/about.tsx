import { ABOUT, DR_MURPHY } from "@/lib/content";
import drMurphyPhoto from "@/assets/images/Murphy-14_1765142967232.jpg";

export default function AboutPage() {
  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section
        className="section-dark"
        style={{ padding: "120px 24px 120px" }}
        aria-label="Dr. Murphy"
      >
        <div className="section-inner px-6">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            {/* Portrait */}
            <div className="flex-shrink-0 flex justify-center">
              <div
                style={{
                  width: "clamp(240px, 28vw, 380px)",
                  height: "clamp(240px, 28vw, 380px)",
                  borderRadius: "50%",
                  border: "2px solid var(--blue)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img src={drMurphyPhoto} alt="Dr. Michael Murphy" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1" style={{ maxWidth: "580px" }}>
              <div className="eyebrow mb-4" style={{ color: "rgba(239,246,255,0.8)" }}>ABOUT THE CREATOR</div>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  fontSize: "clamp(32px, 4vw, 56px)",
                  lineHeight: 1.05,
                  color: "white",
                  marginBottom: "12px",
                }}
              >
                Michael <em>Murphy</em>, MD, MPH
              </h1>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "#93C5FD", marginBottom: "32px" }}>
                {DR_MURPHY.tagline}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "18px", color: "rgba(255,255,255,0.90)", lineHeight: 1.65 }}>
                {DR_MURPHY.longBio1}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CREDENTIALS GRID ──────────────────────────────────────────── */}
      <section className="section" aria-label="Credentials">
        <div className="section-inner px-6">
          <div className="text-center mb-12">
            <div className="eyebrow mb-4">CREDENTIALS</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.1,
                color: "var(--text-ink)",
              }}
            >
              Training &amp; <em>Practice</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DR_MURPHY.credentials.map((cred, i) => (
              <div key={i} className="card" style={{ padding: "28px" }}>
                <div
                  className="eyebrow mb-3"
                  style={{ fontSize: "11px" }}
                >
                  {cred.label}
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 600, color: "var(--text-ink)", lineHeight: 1.4 }}>
                  {cred.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PULL QUOTE ─────────────────────────────────────────────────── */}
      <section className="section-tinted" aria-label="Quote">
        <div
          style={{
            maxWidth: "880px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "80px",
              fontWeight: 400,
              color: "var(--blue)",
              lineHeight: 1,
              marginBottom: "-8px",
            }}
          >
            "
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(20px, 3vw, 32px)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--text-ink)",
              lineHeight: 1.4,
              marginBottom: "32px",
            }}
          >
            {DR_MURPHY.quote}
          </p>
          <div className="flex flex-col items-center gap-3">
            <div style={{ width: "40px", height: "2px", backgroundColor: "var(--blue)" }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 600, color: "var(--text-muted)" }}>
              Michael Murphy, MD, MPH
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. WHY I BUILT THIS ───────────────────────────────────────────── */}
      <section className="section" aria-label="Origin story">
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow mb-4">ORIGIN STORY</div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(26px, 4vw, 48px)",
              lineHeight: 1.05,
              color: "var(--text-ink)",
              marginBottom: "32px",
            }}
          >
            Why I <em>Built</em> This
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {ABOUT.originStory.paragraphs.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "18px",
                  color: "var(--text-ink-soft)",
                  lineHeight: 1.7,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

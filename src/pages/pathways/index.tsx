import { Link } from "wouter";
import { MURPHY_PATHWAYS } from "@/lib/pathways";

export default function PathwaysPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="section-dark" style={{ padding: "120px 24px 96px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <div className="eyebrow mb-4" style={{ color: "#93C5FD" }}>MURPHY METHOD™</div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(28px, 4vw, 56px)",
              lineHeight: 1.05,
              color: "white",
              marginBottom: "20px",
            }}
          >
            8 Pathways. One That's <em>Yours</em>.
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "19px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65 }}>
            Sleep apnea and snoring aren't one-size-fits-all. The Murphy Method™ identifies the specific clinical picture that matches your situation — and assigns the pathway most relevant to your anatomy, risk factors, and symptoms.
          </p>
        </div>
      </section>

      {/* ── PATHWAY CARDS ── */}
      <section className="section">
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px" }}>
          <div className="grid sm:grid-cols-2 gap-5">
            {MURPHY_PATHWAYS.map((pathway) => {
              const letter = pathway.id.split("_")[0];
              return (
                <Link key={pathway.id} href={`/pathways/${letter.toLowerCase()}`} className="no-underline">
                  <div className="card flex items-start gap-4 cursor-pointer" style={{ padding: "24px" }}>
                    <div
                      className="flex-shrink-0 flex items-center justify-center text-white"
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        backgroundColor: "var(--blue)",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 700,
                        fontSize: "18px",
                      }}
                    >
                      {letter}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "var(--text-ink)",
                          marginBottom: "6px",
                        }}
                      >
                        {pathway.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "14px",
                          color: "var(--text-muted)",
                          lineHeight: 1.6,
                          marginBottom: "10px",
                        }}
                      >
                        {pathway.shortDescription}
                      </p>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 500,
                          fontSize: "13px",
                          color: "var(--blue)",
                        }}
                      >
                        View pathway →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-tinted">
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(22px, 3vw, 36px)",
              lineHeight: 1.05,
              color: "var(--text-ink)",
              marginBottom: "16px",
            }}
          >
            Not sure which pathway is <em>yours</em>?
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "32px" }}>
            The full assessment assigns your pathway based on your symptoms, anatomy, and risk factors — no guesswork.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/screener" className="no-underline">
              <button className="btn-secondary">Start Free Screener →</button>
            </Link>
            <Link href="/assessment/info" className="no-underline">
              <button className="btn-primary">Get My Full Report — $79 →</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

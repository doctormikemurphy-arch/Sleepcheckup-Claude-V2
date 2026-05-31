import { Link, useParams, useSearch } from "wouter";
import { Check, ArrowLeft } from "lucide-react";
import { PATHWAY_CONTENT } from "@/lib/pathway-content";

const LETTER_TO_KEY: Record<string, string> = {
  a: "A_insomnia",
  b: "B_obesity",
  c: "C_nasal",
  d: "D_mandible",
  e: "E_multilevel",
  f: "F_physiology",
  g: "G_low_risk",
  h: "H_complex",
};

const ITALIC_KEYWORDS: Record<string, string> = {
  a: "Insomnia",
  b: "Obesity",
  c: "Obstruction",
  d: "Obstruction",
  e: "Obstruction",
  f: "Physiology",
  g: "Snoring",
  h: "OSA",
};

export default function PathwayDetailPage() {
  const params = useParams<{ letter: string }>();
  const search = useSearch();
  const fromResults = new URLSearchParams(search).get("from") === "results";
  const letter = (params.letter ?? "").toLowerCase();
  const key = LETTER_TO_KEY[letter];
  const content = key ? PATHWAY_CONTENT[key] : null;
  const italicWord = ITALIC_KEYWORDS[letter] ?? "";

  if (!content) {
    return (
      <main className="flex items-center justify-center" style={{ minHeight: "60vh", backgroundColor: "var(--bg-page)" }}>
        <div className="text-center px-4">
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "24px", color: "var(--text-ink)", marginBottom: "12px" }}>
            Pathway not found
          </h1>
          <Link href="/pathways" className="no-underline" style={{ color: "var(--blue)", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
            ← All Pathways
          </Link>
        </div>
      </main>
    );
  }

  const titleParts = italicWord
    ? content.title.split(italicWord)
    : null;

  return (
    <>
      {/* ── 1. HERO ── */}
      <section
        className="section-dark"
        style={{ padding: "96px 24px" }}
        aria-label={`Pathway ${content.pathwayLetter}`}
      >
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <div className="flex items-center justify-between mb-12">
            <Link href={fromResults ? "/assessment/results" : "/pathways"} className="no-underline">
              <div className="flex items-center gap-1 cursor-pointer" style={{ color: "rgba(255,255,255,0.70)", fontSize: "14px", fontFamily: "var(--font-sans)" }}>
                <ArrowLeft className="w-4 h-4" />
                {fromResults ? "Back to Your Results" : "All Pathways"}
              </div>
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-cream"
              style={{ fontSize: "14px", padding: "10px 20px", minHeight: "40px" }}
            >
              Print
            </button>
          </div>

          <div className="text-center">
            <div
              className="flex-shrink-0 flex items-center justify-center text-white mx-auto mb-6"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "white",
                borderRadius: "20px",
                fontFamily: "var(--font-sans)",
                fontSize: "40px",
                fontWeight: 600,
                color: "var(--bg-dark)",
              }}
            >
              {content.pathwayLetter}
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 56px)",
                lineHeight: 1.1,
                color: "white",
                maxWidth: "720px",
                margin: "0 auto 16px",
              }}
            >
              {titleParts && titleParts.length === 2 ? (
                <>
                  {titleParts[0]}<em>{italicWord}</em>{titleParts[1]}
                </>
              ) : (
                content.title
              )}
            </h1>

            <p style={{ fontFamily: "var(--font-sans)", fontSize: "19px", color: "#93C5FD", maxWidth: "640px", margin: "0 auto", lineHeight: 1.5 }}>
              {content.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. INTRO CALLOUT ── */}
      <section className="section">
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div
            className="card-tinted"
            style={{ borderRadius: "20px", padding: "32px", paddingLeft: "64px", position: "relative", marginBottom: "0" }}
          >
            <div
              style={{
                position: "absolute",
                left: "20px",
                top: "20px",
                fontSize: "24px",
              }}
            >
              💡
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-ink-soft)", lineHeight: 1.7 }}>
              The Murphy Method pathways represent common clinical situations and are designed to give you the most efficient path forward with your doctor. Your pathway assignment is based on your specific assessment answers — it is the starting point for a productive conversation with your sleep specialist.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. WHAT YOUR RESULTS SUGGEST ── */}
      <section className="section">
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow mb-4">WHAT YOUR RESULTS SUGGEST</div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.1,
              color: "var(--text-ink)",
              marginBottom: "32px",
            }}
          >
            What Your Results <em>Suggest</em>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {content.whatResultsSuggest.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{ width: "20px", height: "20px", backgroundColor: "var(--blue-soft)", marginTop: "3px" }}
                >
                  <Check className="w-3 h-3" style={{ color: "var(--blue)" }} strokeWidth={3} />
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-ink-soft)", lineHeight: 1.7 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY IT MATTERS ── */}
      <section className="section-tinted">
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow mb-4">WHY THIS MATTERS</div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.1,
              color: "var(--text-ink)",
              marginBottom: "24px",
            }}
          >
            Why This Matters for Your Health
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-ink-soft)", lineHeight: 1.7, marginBottom: "24px" }}>
            {content.whyItMatters.intro}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {content.whyItMatters.points.map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--blue)", marginTop: "8px", flexShrink: 0 }}
                />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-ink-soft)", lineHeight: 1.65 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. WHAT USUALLY WORKS BEST ── */}
      <section className="section">
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow mb-4">TREATMENT OPTIONS</div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.1,
              color: "var(--text-ink)",
              marginBottom: "24px",
            }}
          >
            What Usually Works Best
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-ink-soft)", lineHeight: 1.7, marginBottom: "24px" }}>
            {content.whatWorksBest.intro}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {content.whatWorksBest.options.map((opt, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{ width: "20px", height: "20px", backgroundColor: "var(--blue-soft)", marginTop: "3px" }}
                >
                  <Check className="w-3 h-3" style={{ color: "var(--blue)" }} strokeWidth={3} />
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-ink-soft)", lineHeight: 1.65 }}>{opt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. NEXT STEPS ── */}
      <section className="section-tinted">
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow mb-4">NEXT STEPS</div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(22px, 3vw, 32px)",
              lineHeight: 1.1,
              color: "var(--text-ink)",
              marginBottom: "24px",
            }}
          >
            Recommended Next Steps
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-ink-soft)", lineHeight: 1.7, marginBottom: "32px" }}>
            {content.nextSteps.intro}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {content.nextSteps.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold"
                  style={{ width: "28px", height: "28px", backgroundColor: "var(--blue)", fontFamily: "var(--font-sans)", fontSize: "13px", flexShrink: 0, marginTop: "1px" }}
                >
                  {i + 1}
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-ink-soft)", lineHeight: 1.65 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-dark" style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(22px, 3vw, 36px)",
              lineHeight: 1.05,
              color: "white",
              marginBottom: "16px",
            }}
          >
            {content.cta.text}
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, marginBottom: "32px" }}>
            {content.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/screener" className="no-underline">
              <button className="btn-secondary" style={{ color: "white", borderColor: "rgba(255,255,255,0.5)" }}>
                Start Free Screener
              </button>
            </Link>
            <Link href="/assessment/info" className="no-underline">
              <button className="btn-cream">
                Get My Full Report — $79
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

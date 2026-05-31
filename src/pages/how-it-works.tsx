import { useState } from "react";
import { Link } from "wouter";
import { Check, X, CheckCircle2 } from "lucide-react";
import { HOW_IT_WORKS, HOME } from "@/lib/content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const { hero, freePaid, pathwaysSection, reportSection, faqs } = HOW_IT_WORKS;
const { steps, philosophicalStatement } = HOME;

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<string | undefined>(undefined);

  const pathwayNames = [
    "Sleep Apnea with Insomnia",
    "Sleep Apnea with Obesity",
    "Nasal Obstruction",
    "Jaw & Tongue Obstruction",
    "Multi-Level Obstruction",
    "Sleep Physiology Problem",
    "Low Risk / Simple Snoring",
    "Complex / Multi-Factor OSA",
  ];

  const pathwayLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <>
      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section
        className="section"
        style={{ paddingTop: "120px", paddingBottom: "96px" }}
        aria-label="Hero"
      >
        <div className="section-inner px-6 text-center">
          <div className="eyebrow mb-6">THE PROCESS</div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(36px, 6vw, 72px)",
              lineHeight: 1.05,
              color: "var(--text-ink)",
              maxWidth: "880px",
              margin: "0 auto 32px",
            }}
          >
            How the Murphy <em>Method™</em> Works
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "20px",
              color: "var(--text-muted)",
              maxWidth: "640px",
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            A simple way to understand snoring, sleep apnea, where the airway may be narrowing, and what kinds of treatment may help.
          </p>
        </div>
      </section>

      {/* ── 2. THE MURPHY METHOD (3 steps) ──────────────────────────────── */}
      <section className="section" aria-label="The Murphy Method">
        <div className="section-inner px-6">

          {/* Step A — Breathing at night */}
          <div className="mb-20">
            {/* Header */}
            <div className="mb-8">
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "clamp(20px, 2.5vw, 26px)",
                  color: "var(--blue)",
                  marginBottom: "8px",
                }}
              >
                Step 1 — How is the breathing at night?
              </h3>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Breathing can move from normal, to snoring, to sleep apnea.
              </p>
            </div>

            {/* Pills row */}
            <div className="flex items-center gap-3 flex-wrap justify-center mb-8">
              {[
                { label: "Normal", bg: "#EAF3DE", color: "#15803D" },
                { label: "Snoring", bg: "#FAEEDA", color: "#B45309" },
                { label: "Sleep Apnea", bg: "#FCEBEB", color: "#B91C1C" },
              ].map((stage, i, arr) => (
                <div key={stage.label} className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: stage.bg,
                      color: stage.color,
                      fontFamily: "var(--font-sans)",
                      fontSize: "16px",
                      fontWeight: 600,
                      padding: "12px 24px",
                      borderRadius: "9999px",
                    }}
                  >
                    {stage.label}
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ color: "var(--blue)", fontSize: "18px", fontWeight: 600 }}>→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Detail cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Normal",
                  color: "#15803D",
                  items: ["Air moves easily", "Quiet breathing", "Healthy sleep"],
                },
                {
                  label: "Snoring",
                  color: "#B45309",
                  items: ["Air becomes noisy", "Airflow gets rough", "Snoring may happen"],
                },
                {
                  label: "Sleep Apnea",
                  color: "#B91C1C",
                  items: ["Airflow gets blocked", "Breathing can pause", "This is more serious"],
                },
              ].map((stage) => (
                <div key={stage.label} className="card" style={{ padding: "28px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: "17px",
                      color: stage.color,
                      marginBottom: "16px",
                    }}
                  >
                    {stage.label}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {stage.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "15px",
                          color: "var(--text-muted)",
                          lineHeight: 1.6,
                          marginBottom: "6px",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Step B — Airway zones */}
          <div className="flex flex-col md:flex-row gap-16 items-center mb-20">
            {/* Zone stack */}
            <div style={{ flex: "0 0 55%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {[
                { label: "Nose", color: "#15803D" },
                { label: "Palate & Tonsils", color: "#B91C1C" },
                { label: "Mandible & Tongue", color: "#1D4ED8" },
                { label: "Neck", color: "#B45309" },
              ].map((zone, i, arr) => (
                <div key={zone.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                  <div
                    className="card"
                    style={{
                      padding: "18px 32px",
                      textAlign: "center",
                      width: "100%",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "17px",
                      color: zone.color,
                      backgroundColor: "var(--bg-card)",
                    }}
                  >
                    {zone.label}
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ color: "#15803D", fontSize: "20px", lineHeight: 1, padding: "6px 0" }}>↓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Header */}
            <div style={{ flex: "0 0 45%" }}>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "clamp(20px, 2.5vw, 26px)",
                  color: "#15803D",
                  marginBottom: "8px",
                }}
              >
                Step 2 — Where can the airway narrow?
              </h3>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                The Murphy Method looks from top to bottom through the airway.
              </p>
            </div>
          </div>

          {/* Step C — Treatment */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-16 items-start mb-8">
              {/* Left: heading + subtext */}
              <div style={{ flex: "0 0 35%" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: "clamp(20px, 2.5vw, 26px)",
                    color: "#B91C1C",
                    marginBottom: "8px",
                  }}
                >
                  Step 3 — What can help?
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  Treatment depends on where the blockage is and how serious the problem is.
                </p>
              </div>

              {/* Right: two cards side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ flex: "1" }}>
                {/* Non-Surgery */}
                <div className="card" style={{ padding: "28px", backgroundColor: "#FCEBEB" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px", color: "#B91C1C", marginBottom: "16px" }}>
                    Non-Surgery Options
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {["CPAP", "Oral appliance", "Other treatments"].map((item) => (
                      <li key={item} className="flex items-center gap-2 mb-2">
                        <span style={{ color: "#B91C1C", fontSize: "16px" }}>•</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-ink-soft)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Procedure */}
                <div className="card" style={{ padding: "28px", backgroundColor: "#FCEBEB" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px", color: "#B91C1C", marginBottom: "16px" }}>
                    Procedure Options
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {["Nose procedures", "Palate / tonsil procedures", "Jaw / tongue procedures"].map((item) => (
                      <li key={item} className="flex items-center gap-2 mb-2">
                        <span style={{ color: "#B91C1C", fontSize: "16px" }}>•</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-ink-soft)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Callout */}
            <div
              className="card-tinted"
              style={{ padding: "24px", borderRadius: "16px" }}
            >
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-ink-soft)", lineHeight: 1.65, textAlign: "center" }}>
                <strong style={{ color: "var(--text-ink)" }}>Simple idea:</strong> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. TWO WAYS TO START ─────────────────────────────────────────── */}
      <section className="section-tinted" aria-label="Two ways to start">
        <div className="section-inner px-6">
          <div className="text-center mb-16">
            <div className="eyebrow mb-4">GET STARTED</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(26px, 4vw, 48px)",
                lineHeight: 1.05,
                color: "var(--text-ink)",
                maxWidth: "720px",
                margin: "0 auto",
              }}
            >
              {freePaid.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: "900px", margin: "0 auto" }}>
            {/* Free card */}
            <div className="card" style={{ padding: "40px", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  backgroundColor: "var(--bg-page)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "9999px",
                  padding: "4px 14px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: "20px",
                }}
              >
                {freePaid.free.badge}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  fontSize: "28px",
                  color: "var(--text-ink)",
                  marginBottom: "16px",
                }}
              >
                {freePaid.free.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                  marginBottom: "24px",
                }}
              >
                {freePaid.free.body}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto 0" }}>
                {freePaid.free.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 mb-3">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--blue)", marginTop: "2px" }} />
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-ink-soft)" }}>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/screener" className="no-underline">
                <button className="btn-secondary w-full" style={{ marginTop: "24px" }}>Begin Free Screener →</button>
              </Link>
            </div>

            {/* Paid card */}
            <div className="card" style={{ padding: "40px", border: "2px solid var(--blue)", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  backgroundColor: "var(--blue-soft)",
                  border: "1px solid rgba(29,78,216,0.2)",
                  borderRadius: "9999px",
                  padding: "4px 14px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--blue)",
                  marginBottom: "20px",
                }}
              >
                {freePaid.paid.badge}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  fontSize: "28px",
                  color: "var(--text-ink)",
                  marginBottom: "16px",
                }}
              >
                {freePaid.paid.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                  marginBottom: "24px",
                }}
              >
                {freePaid.paid.body}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto 0" }}>
                {freePaid.paid.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 mb-3">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--blue)", marginTop: "2px" }} />
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-ink-soft)" }}>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/assessment/info" className="no-underline">
                <button className="btn-primary w-full" style={{ marginTop: "24px" }}>Get My Full Report — $79 →</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. COMPARISON ────────────────────────────────────────────────── */}
      <section className="section-tinted" aria-label="Comparison">
        <div className="section-inner px-6">
          <div className="text-center mb-16">
            <div className="eyebrow mb-4">WHY THE MURPHY METHOD</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(26px, 4vw, 48px)",
                lineHeight: 1.05,
                color: "var(--text-ink)",
                maxWidth: "880px",
                margin: "0 auto 24px",
              }}
            >
              Different From Every Sleep Tool <em>Online</em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "18px",
                color: "var(--text-ink-soft)",
                maxWidth: "720px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              {philosophicalStatement}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard quiz */}
            <div className="card" style={{ padding: "40px", opacity: 0.85 }}>
              <div
                className="flex items-center justify-center rounded-full mb-4"
                style={{ width: "48px", height: "48px", backgroundColor: "#F1F5F9", color: "#94A3B8" }}
              >
                <X className="w-6 h-6" />
              </div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 600, color: "var(--text-ink)", marginBottom: "32px" }}>
                Standard Sleep Quiz (STOP-BANG, Ubie, etc.)
              </h3>
              {[
                ["Output", "A risk score from 0 to 8"],
                ["Next step", '"See a doctor"'],
                ["Depth", "4–8 generic questions"],
                ["Anatomy", "Not assessed"],
                ["Physiology", "Not assessed"],
                ["Specialist match", "None — you figure it out"],
                ["What it explains", "Nothing about why or how"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 mb-3">
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", fontWeight: 500, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-ink-soft)", textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Murphy Method */}
            <div className="card" style={{ padding: "40px", border: "2px solid var(--blue)" }}>
              <div
                className="flex items-center justify-center rounded-full mb-4"
                style={{ width: "48px", height: "48px", backgroundColor: "var(--blue-soft)" }}
              >
                <CheckCircle2 className="w-6 h-6" style={{ color: "var(--blue)" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 600, color: "var(--text-ink)", marginBottom: "32px" }}>
                SleepCheckup — Murphy Method™
              </h3>
              {[
                ["Output", "Named clinical pathway — your mechanism, not just a score"],
                ["Next step", "Which specialist to see, what to ask, and why"],
                ["Depth", "64 validated clinical questions"],
                ["Anatomy", "4-zone airway map (Nose → Palate → Jaw → Neck)"],
                ["Physiology", "PALM phenotyping — the first patient-facing tool of its kind"],
                ["Specialist match", "Filtered to the right type for your pathway"],
                ["What it explains", "The mechanism, the anatomy, and what works for both"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 mb-3">
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--blue)", flexShrink: 0 }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-ink-soft)", textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. 8 PATHWAYS ─────────────────────────────────────────────────── */}
      <section className="section" aria-label="8 pathways">
        <div className="section-inner px-6">
          <div className="text-center mb-16">
            <div className="eyebrow mb-4">CLINICAL PATHWAYS</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(26px, 4vw, 48px)",
                lineHeight: 1.05,
                color: "var(--text-ink)",
                marginBottom: "24px",
              }}
            >
              8 Pathways. One That's <em>Yours</em>.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "18px",
                color: "var(--text-muted)",
                maxWidth: "640px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              {pathwaysSection.body}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pathwayLetters.map((letter, i) => (
              <Link key={letter} href={`/pathways/${letter.toLowerCase()}`} className="no-underline block">
                <div
                  className="card"
                  style={{ padding: "28px", minHeight: "140px", cursor: "pointer" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: "var(--blue-soft)",
                        color: "var(--blue)",
                        borderRadius: "12px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "24px",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {letter}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "17px",
                        fontWeight: 500,
                        color: "var(--text-ink)",
                        lineHeight: 1.3,
                        minWidth: 0,
                      }}
                    >
                      {pathwayNames[i]}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/assessment/info" className="no-underline">
              <button className="btn-primary">Discover My Pathway — $79</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. INSIDE THE REPORT ─────────────────────────────────────────── */}
      <section className="section-tinted" aria-label="Inside the report">
        <div className="section-inner px-6">
          <div className="text-center mb-16">
            <div className="eyebrow mb-4">THE DELIVERABLE</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(26px, 4vw, 48px)",
                lineHeight: 1.05,
                color: "var(--text-ink)",
                marginBottom: "24px",
              }}
            >
              Inside the <em>Report</em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "18px",
                color: "var(--text-ink-soft)",
                maxWidth: "720px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              {reportSection.subheadline}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reportSection.rows.map((row, i) => (
              <div key={row.title} className="card" style={{ padding: "32px" }}>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "var(--bg-dark)",
                      color: "white",
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {i + 1}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "22px",
                      fontWeight: 500,
                      color: "var(--text-ink)",
                    }}
                  >
                    {row.title}
                  </h3>
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.55, whiteSpace: "pre-line" }}>
                  {row.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ────────────────────────────────────────────────────────── */}
      <section className="section" aria-label="FAQ">
        <div className="section-inner px-6">
          <div className="eyebrow mb-4 text-center">QUESTIONS</div>
          <h2
            className="text-center"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(26px, 4vw, 48px)",
              lineHeight: 1.05,
              color: "var(--text-ink)",
              marginBottom: "64px",
            }}
          >
            Frequently Asked <em>Questions</em>
          </h2>

          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <Accordion
              type="single"
              collapsible
              value={openFaq}
              onValueChange={setOpenFaq}
            >
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="card mb-3"
                  style={{ padding: "0", border: "1px solid var(--border-soft)", borderRadius: "16px" }}
                >
                  <AccordionTrigger
                    className="px-8 py-6"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "var(--text-ink)",
                      textAlign: "left",
                    }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent
                    className="px-8 pb-6"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "16px",
                      color: "var(--text-ink-soft)",
                      lineHeight: 1.65,
                    }}
                  >
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}

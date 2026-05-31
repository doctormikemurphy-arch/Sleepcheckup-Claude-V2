import { useState, useEffect, useRef } from "react";
import { Link, useSearch } from "wouter";
import { Check, Moon, Activity, Heart, Smartphone, Star } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { HOME, DR_MURPHY } from "@/lib/content";
import drMurphyPhoto from "@/assets/images/Murphy-14_1765142967232.jpg";

const { hero, stats, problem, steps, pricing, testimonials, faqs } = HOME;

// ── Report mockup ──────────────────────────────────────────────────────────────
function ReportMockup() {
  return (
    <div
      style={{
        maxWidth: "460px",
        transform: "rotate(-2deg)",
        borderRadius: "20px",
        overflow: "hidden",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-soft)",
        boxShadow: "0 16px 48px rgba(15,23,42,0.14)",
      }}
    >
      {/* Header band */}
      <div
        className="px-6 py-3.5 flex items-center justify-between"
        style={{ backgroundColor: "var(--bg-dark)" }}
      >
        <p style={{ color: "white", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", letterSpacing: "0.06em" }}>
          Murphy Method™ Assessment Report
        </p>
        <p style={{ color: "#64748B", fontSize: "11px", fontFamily: "var(--font-sans)" }}>sleepcheckup.com</p>
      </div>

      <div className="p-6" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Pathway assignment */}
        <div style={{ backgroundColor: "var(--blue-soft)", borderRadius: "12px", padding: "16px", border: "1px solid #BFDBFE" }}>
          <p style={{ color: "var(--blue)", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
            Your Murphy Method Assigned Pathway
          </p>
          <div style={{ height: "14px", borderRadius: "6px", backgroundColor: "#BFDBFE", width: "78%", marginBottom: "8px" }} />
          <div style={{ height: "11px", borderRadius: "6px", backgroundColor: "#DBEAFE", width: "55%" }} />
        </div>

        {/* Results grid — Step 1 */}
        <div>
          <p style={{ color: "var(--text-ink)", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
            Your Results
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "8px" }}>
            {["Sleep Apnea Risk", "Insomnia Severity", "Sleep Quality"].map((label) => (
              <div key={label} style={{ border: "1px solid var(--border-soft)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#DBEAFE", margin: "0 auto 6px" }} />
                <p style={{ color: "var(--blue)", fontSize: "9px", fontWeight: 600, fontFamily: "var(--font-sans)" }}>{label}</p>
              </div>
            ))}
          </div>
          {/* Step 2 & 3 bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "8px" }}>
            <div style={{ height: "10px", borderRadius: "5px", backgroundColor: "#DCFCE7", width: "90%" }} />
            <div style={{ height: "10px", borderRadius: "5px", backgroundColor: "#FEE2E2", width: "75%" }} />
          </div>
        </div>

        {/* Personalized Guide */}
        <div>
          <p style={{ color: "var(--text-ink)", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
            Your Personalized Guide
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ height: "11px", borderRadius: "6px", backgroundColor: "#DCFCE7", width: "95%" }} />
            <div style={{ height: "11px", borderRadius: "6px", backgroundColor: "#DCFCE7", width: "80%" }} />
            <div style={{ height: "11px", borderRadius: "6px", backgroundColor: "#DCFCE7", width: "65%" }} />
          </div>
        </div>

        {/* Patient info */}
        <div style={{ paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#94A3B8", fontSize: "11px", fontFamily: "var(--font-sans)" }}>Prepared for:</span>
            <div style={{ height: "10px", borderRadius: "4px", flex: 1, maxWidth: "100px", backgroundColor: "#F1F5F9" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const src = params.get("src");

  const [openFaq, setOpenFaq] = useState<string | undefined>(undefined);

  let headline = hero.headline;
  let subheadline = hero.subheadline;
  if (src === "watch") {
    headline = hero.variants.watch.headline;
    subheadline = hero.variants.watch.subheadline;
  } else if (src === "snoring") {
    headline = hero.variants.snoring.headline;
    subheadline = hero.variants.snoring.subheadline;
  }

  const whoCards = [
    {
      icon: <Moon className="w-5 h-5" />,
      heading: '"I just snore — it\'s probably nothing."',
      body: "Snoring is the single most common symptom of sleep apnea. Many people who think they \"just snore\" have had undiagnosed OSA for years. The screener takes 3 minutes to tell you if it's worth looking into.",
      featured: false,
    },
    {
      icon: <Activity className="w-5 h-5" />,
      heading: '"I\'m always tired no matter how much I sleep."',
      body: "Unexplained fatigue, morning headaches, difficulty concentrating, and irritability are all classic signs — even without obvious snoring. Not every sleep apnea patient snores loudly or stops breathing noticeably.",
      featured: false,
    },
    {
      icon: <Heart className="w-5 h-5" />,
      heading: '"Someone told me I stop breathing at night."',
      body: "You already know something is wrong. The question is: what kind, how serious, and what type of doctor can actually help you? The Murphy Method™ answers all three — so your first appointment isn't wasted.",
      featured: true,
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      heading: '"My watch or wearable device has alerted me to possible sleep apnea."',
      body: "Apple Watch and Samsung Galaxy can now detect irregular breathing events during sleep. But a notification is not a diagnosis — and it does not tell you what type, how serious, or which doctor to see. The Murphy Method™ turns that alert into a clear next step.",
      featured: false,
    },
  ];

  const pricingFeatures = [
    "Complete pathway assignment (1 of 8 Murphy Method™ pathways)",
    "Full personalized PDF report",
    "Medical history & comorbidity analysis",
    "PLATO-11 treatment readiness",
    "Doctor visit prep sheet",
    "Specialist match for your pathway",
    "7-day refund policy",
  ];

  // ── Video rotation ────────────────────────────────────────────────────────
  const HERO_VIDEOS = [
    "/videos/hero-1.mp4",
    "/videos/hero-2.mp4",
    "/videos/hero-3.mp4",
    "/videos/hero-4.mp4",
    "/videos/hero-5.mp4",
    "/videos/hero-6.mp4",
  ];
  const DISPLAY_MS = 4000;
  const FADE_MS = 600;

  const [activeSlot, setActiveSlot] = useState(0);
  const activeSlotRef = useRef(0);
  const videoIdxRef = useRef(0);
  const slot0Ref = useRef<HTMLVideoElement>(null);
  const slot1Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Preload slot 1 with the second video
    if (slot1Ref.current) {
      slot1Ref.current.src = HERO_VIDEOS[1];
      slot1Ref.current.load();
      slot1Ref.current.play().catch(() => {});
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      const currentIdx = videoIdxRef.current;
      const nextIdx = (currentIdx + 1) % HERO_VIDEOS.length;
      const afterNextIdx = (currentIdx + 2) % HERO_VIDEOS.length;
      const currentSlot = activeSlotRef.current;
      const hiddenSlot = currentSlot === 0 ? 1 : 0;

      // Crossfade: make the preloaded hidden slot visible
      activeSlotRef.current = hiddenSlot;
      setActiveSlot(hiddenSlot);
      videoIdxRef.current = nextIdx;

      // After the fade completes, load next-next into the now-hidden slot
      setTimeout(() => {
        const hiddenVid = currentSlot === 0 ? slot0Ref.current : slot1Ref.current;
        if (hiddenVid) {
          hiddenVid.src = HERO_VIDEOS[afterNextIdx];
          hiddenVid.load();
          hiddenVid.play().catch(() => {});
        }
      }, FADE_MS);
    }, DISPLAY_MS);

    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col justify-end"
        style={{
          minHeight: "88vh",
          minWidth: "100%",
          paddingTop: "120px",
          paddingBottom: "clamp(56px, 7vh, 80px)",
        }}
        aria-label="Hero"
      >
        {/* ── Video background: two slots for no-black-flash crossfade ── */}
        <div className="absolute inset-0 z-0">
          <video
            ref={slot0Ref}
            src="/videos/hero-1.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            poster="/videos/hero-1-poster.jpg"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", display: "block",
              opacity: activeSlot === 0 ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          />
          <video
            ref={slot1Ref}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", display: "block",
              opacity: activeSlot === 1 ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          />
          {/* Desktop: horizontal gradient — darker on left where text sits */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{ background: "linear-gradient(90deg, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.4) 50%, rgba(15,23,42,0.1) 100%)" }}
          />
          {/* Mobile: vertical gradient — strong bottom fade */}
          <div
            className="absolute inset-0 block md:hidden"
            style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.75) 100%)" }}
          />
        </div>

        {/* ── Hero content — two-column bottom row ── */}
        <div
          className="relative z-10 w-full flex items-end justify-between"
          style={{
            paddingLeft: "clamp(24px, 6vw, 80px)",
            paddingRight: "clamp(24px, 6vw, 80px)",
            gap: "40px",
          }}
        >
          {/* Left: narrative */}
          <div style={{ maxWidth: "580px" }}>
            <p className="eyebrow mb-6" style={{ color: "rgba(255,255,255,0.80)" }}>
              BY DR. MICHAEL MURPHY · STANFORD MEDICINE
            </p>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(36px, 5vw, 48px)",
                lineHeight: 1.05,
                color: "white",
                marginBottom: "24px",
                hyphens: "none",
                wordBreak: "keep-all",
              }}
            >
              Snoring and Sleep Apnea is not <em style={{ whiteSpace: "nowrap" }}>One-Size-Fits-All</em>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "clamp(17px, 2vw, 20px)",
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.92)",
                maxWidth: "540px",
                marginBottom: "16px",
              }}
            >
              {hero.subtitle}
            </p>

            <p style={{ marginBottom: "32px", color: "rgba(255,255,255,0.60)", fontSize: "13px", fontFamily: "var(--font-sans)" }}>
              {hero.trustLine}
            </p>

            <Link href="/screener" className="no-underline">
              <button className="btn-primary">
                {hero.ctaButton}
              </button>
            </Link>

            <div style={{ marginTop: "12px" }}>
              <Link
                href="/assessment/info"
                className="no-underline"
                style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", fontFamily: "var(--font-sans)" }}
              >
                or see what's in the full assessment →
              </Link>
            </div>
          </div>

          {/* Right: proof stats — desktop only */}
          <div
            className="hidden md:flex items-end flex-shrink-0"
            style={{ gap: "32px", paddingBottom: "4px" }}
          >
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "36px", lineHeight: 1, color: "white", marginBottom: "4px" }}>4.9/5</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(255,255,255,0.70)", maxWidth: "180px", lineHeight: 1.35 }}>Patient Rating (303 Reviews)</p>
            </div>
            <div style={{ width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.20)", flexShrink: 0, alignSelf: "center" }} />
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "36px", lineHeight: 1, color: "white", marginBottom: "4px" }}>20+</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(255,255,255,0.70)", maxWidth: "180px", lineHeight: 1.35 }}>Years Treating Sleep Disorders</p>
            </div>
            <div style={{ width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.20)", flexShrink: 0, alignSelf: "center" }} />
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "36px", lineHeight: 1, color: "white", marginBottom: "4px" }}>2x</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "rgba(255,255,255,0.70)", maxWidth: "180px", lineHeight: 1.35 }}>Board Certified Specialties</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. DR. MURPHY ─────────────────────────────────────────────────── */}
      <section className="section-dark" style={{ padding: "120px 24px" }} aria-label="About Dr. Murphy">
        <div className="section-inner px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            {/* Portrait */}
            <div className="flex-shrink-0 flex justify-center md:justify-start" style={{ width: "100%", maxWidth: "380px" }}>
              <div
                style={{
                  width: "clamp(240px, 30vw, 380px)",
                  height: "clamp(240px, 30vw, 380px)",
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
              <div className="eyebrow mb-4" style={{ color: "rgba(239,246,255,0.8)" }}>CREATED BY</div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  fontSize: "clamp(32px, 4vw, 48px)",
                  lineHeight: 1.05,
                  color: "white",
                  marginBottom: "8px",
                }}
              >
                Michael <em>Murphy</em>, MD, MPH
              </h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "#93C5FD", marginBottom: "32px" }}>
                {DR_MURPHY.tagline}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "18px", color: "rgba(255,255,255,0.90)", lineHeight: 1.6, marginBottom: "40px" }}>
                {DR_MURPHY.shortBio}
              </p>
              <blockquote style={{ borderLeft: "3px solid var(--blue)", paddingLeft: "16px", marginBottom: "16px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "22px",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.5,
                  }}
                >
                  "{DR_MURPHY.quote}"
                </p>
              </blockquote>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#93C5FD" }}>
                {DR_MURPHY.quoteAttribution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. WHO THIS IS FOR ─────────────────────────────────────────────── */}
      <section className="section" aria-label="Who this is for">
        <div className="section-inner px-6">
          <div className="text-center mb-12">
            <div className="eyebrow mb-4">WHO IT'S FOR</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.1,
                color: "var(--text-ink)",
                maxWidth: "720px",
                margin: "0 auto 24px",
              }}
            >
              Who This Assessment <em>Is For</em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "18px",
                color: "var(--text-ink-soft)",
                maxWidth: "640px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Sleep apnea does not always look the way you imagine. Most people who have it do not know they have it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whoCards.map(({ icon, heading, body, featured }) => (
              <div
                key={heading}
                className="card"
                style={{
                  padding: "32px",
                  border: featured ? "2px solid var(--blue)" : "1px solid var(--border-soft)",
                }}
              >
                <div
                  className="flex items-center justify-center mb-4 flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "var(--blue-soft)",
                    color: "var(--blue)",
                  }}
                >
                  {icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "var(--text-ink)",
                    lineHeight: 1.3,
                    marginBottom: "12px",
                  }}
                >
                  {heading}
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW THE MURPHY METHOD WORKS ───────────────────────────────── */}
      <section className="section-tinted" aria-label="How it works">
        <div className="section-inner px-6">
          <div className="text-center mb-16">
            <div className="eyebrow mb-4">THE PROCESS</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 56px)",
                lineHeight: 1.05,
                color: "var(--text-ink)",
                margin: "0 auto 24px",
              }}
            >
              Three Steps to <em>Clarity</em>
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
              From a 3-minute screener to a personalized pathway report — designed by a Stanford physician.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.items.map((step, i) => (
              <div
                key={step.num}
                className="card"
                style={{ padding: "40px", minHeight: "420px", display: "flex", flexDirection: "column" }}
              >
                <div className="eyebrow mb-4">STEP {String(i + 1).padStart(2, "0")}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 400,
                    fontSize: "28px",
                    lineHeight: 1.2,
                    color: "var(--text-ink)",
                    marginBottom: "12px",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
                  {step.sub}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-ink-soft)", lineHeight: 1.6 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/screener" className="no-underline">
              <button className="btn-primary">{hero.ctaButton}</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. INSIDE THE REPORT ─────────────────────────────────────────── */}
      <section className="section" aria-label="Inside the report">
        <div className="section-inner px-6">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            {/* Text left */}
            <div style={{ flex: "0 0 45%" }}>
              <div className="eyebrow mb-4">THE DELIVERABLE</div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  fontSize: "clamp(28px, 4vw, 48px)",
                  lineHeight: 1.05,
                  color: "var(--text-ink)",
                  marginBottom: "24px",
                }}
              >
                What Your <em>Report</em> Looks Like
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "18px",
                  color: "var(--text-ink-soft)",
                  lineHeight: 1.6,
                  maxWidth: "480px",
                  marginBottom: "32px",
                }}
              >
                Your $79 report is a personalized, professionally designed PDF that translates your full assessment into something you can read, understand, and hand to any doctor.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
                {[
                  "Cover Page · Your Murphy Method Assigned Pathway",
                  "Your Results · 3-Step Murphy Method Analysis",
                  "Your Personalized Guide · What Works Best & Why It Matters",
                  "Your Murphy Method Next Steps · Pathway-specific Specialist Directory",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{ width: "20px", height: "20px", backgroundColor: "var(--blue-soft)", marginTop: "2px" }}
                    >
                      <Check className="w-3 h-3" style={{ color: "var(--blue)" }} strokeWidth={3} />
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-ink-soft)" }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <Link href="/how-it-works" className="no-underline">
                <button className="btn-secondary">See full details →</button>
              </Link>
            </div>

            {/* Report mockup right */}
            <div style={{ flex: "0 0 55%", display: "flex", justifyContent: "center" }}>
              <ReportMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="section-tinted" aria-label="Testimonials">
        <div className="section-inner px-6">
          <div className="text-center mb-16">
            <div className="eyebrow mb-4">PATIENT EXPERIENCES</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.05,
                color: "var(--text-ink)",
                marginBottom: "24px",
              }}
            >
              What People <em>Are Saying</em>
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "18px", color: "var(--text-muted)" }}>
              Real experiences from people who have used the Murphy Method™
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: "36px" }}>
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "19px",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--text-ink)",
                    lineHeight: 1.5,
                    marginBottom: "24px",
                  }}
                >
                  "{t.quote}"
                </p>
                <hr style={{ borderTop: "1px solid var(--border-soft)", margin: "0 0 16px" }} />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
                  Murphy Method™ User · {t.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. PRICING + FAQ ─────────────────────────────────────────────── */}
      <section className="section" aria-label="Pricing and FAQ">
        <div className="section-inner px-6">
          {/* Pricing */}
          <div className="text-center mb-16">
            <div className="eyebrow mb-4">GET STARTED</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.05,
                color: "var(--text-ink)",
                marginBottom: "24px",
              }}
            >
              Simple, Transparent <em>Pricing</em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "18px",
                color: "var(--text-muted)",
                maxWidth: "560px",
                margin: "0 auto",
              }}
            >
              {pricing.subheadline}
            </p>
          </div>

          {/* Single pricing card */}
          <div style={{ maxWidth: "580px", margin: "0 auto" }}>
            <div
              className="card"
              style={{ padding: "48px", border: "2px solid var(--blue)" }}
            >
              {/* RECOMMENDED badge */}
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "var(--blue)",
                  color: "white",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  marginBottom: "16px",
                }}
              >
                RECOMMENDED
              </div>

              <div className="eyebrow mb-3">FULL ASSESSMENT</div>

              <div className="flex items-baseline gap-2 mb-2">
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 400,
                    fontSize: "64px",
                    lineHeight: 1,
                    color: "var(--text-ink)",
                  }}
                >
                  $79
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "18px", color: "var(--text-muted)" }}>
                  /one-time
                </span>
              </div>

              <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", marginBottom: "32px" }}>
                No subscription · Emailed instantly
              </p>

              <hr style={{ borderTop: "1px solid var(--border-soft)", marginBottom: "32px" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
                {pricingFeatures.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{ width: "20px", height: "20px", backgroundColor: "var(--blue-soft)", marginTop: "2px" }}
                    >
                      <Check className="w-3 h-3" style={{ color: "var(--blue)" }} strokeWidth={3} />
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-ink-soft)" }}>
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <Link href="/assessment/info" className="no-underline block">
                <button className="btn-primary w-full">Get My Full Report — $79</button>
              </Link>

              <p className="text-center mt-4">
                <Link
                  href="/screener"
                  className="no-underline"
                  style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--blue)" }}
                >
                  Not ready? Take the free 3-minute screener first →
                </Link>
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <div className="eyebrow mb-4 text-center">QUESTIONS</div>
            <h2
              className="text-center"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.05,
                color: "var(--text-ink)",
                marginBottom: "48px",
              }}
            >
              Common <em>Questions</em>
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
        </div>
      </section>
    </>
  );
}

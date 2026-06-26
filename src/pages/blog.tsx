import { Link } from "wouter";
import { BLOG } from "@/lib/content";

// STUB_ARTICLES — kept for future use when real blog posts are built
// const STUB_ARTICLES = [
//   { slug: "stop-bang-explained", category: "Screening", title: "The STOP-BANG Questionnaire: What It Measures and Why It Matters", excerpt: "STOP-BANG is the most widely used screening tool for obstructive sleep apnea in clinical practice. Here's how to interpret your score.", readTime: "5 min read" },
//   { slug: "osa-comorbidities", category: "Sleep Apnea", title: "Sleep Apnea and Heart Disease: Understanding the Connection", excerpt: "Untreated sleep apnea significantly increases the risk of hypertension, atrial fibrillation, and heart failure. Here's what the evidence says.", readTime: "6 min read" },
//   { slug: "cpap-alternatives", category: "Treatment", title: "Beyond CPAP: Treatment Options for Sleep Apnea in 2024", excerpt: "CPAP remains the gold standard, but oral appliances, surgery, and emerging therapies offer effective alternatives for many patients.", readTime: "7 min read" },
//   { slug: "airway-anatomy", category: "Anatomy", title: "The Four Zones of Airway Obstruction — And Why Location Matters", excerpt: "Where your airway narrows during sleep determines which treatments are most likely to succeed. The Murphy Method™ maps all four zones.", readTime: "5 min read" },
//   { slug: "insomnia-sleep-apnea", category: "COMISA", title: "When Insomnia and Sleep Apnea Occur Together: COMISA Explained", excerpt: "Roughly 30–40% of sleep apnea patients also have insomnia. Treating one without the other leads to poor outcomes in most cases.", readTime: "6 min read" },
//   { slug: "wearable-sleep-warnings", category: "Wearables", title: "My Apple Watch Flagged Sleep Apnea. What Should I Do?", excerpt: "Consumer wearables are generating millions of sleep apnea alerts. A Stanford sleep physician explains what comes next.", readTime: "4 min read" },
// ];


export default function BlogPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="section" style={{ paddingTop: "120px", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow mb-4">{BLOG.hero.label}</div>
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
            {BLOG.hero.headline}
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.65 }}>
            {BLOG.hero.subheadline}
          </p>
        </div>
      </section>

      {/* ── COMING SOON ── */}
      <section className="section-tinted">
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.7 }}>
            More articles coming soon.
          </p>
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
            {BLOG.ctaBanner.headline}
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, marginBottom: "32px" }}>
            {BLOG.ctaBanner.subheadline}
          </p>
          <Link href="/screener" className="no-underline">
            <button className="btn-cream">{BLOG.ctaBanner.ctaButton}</button>
          </Link>
        </div>
      </section>
    </>
  );
}

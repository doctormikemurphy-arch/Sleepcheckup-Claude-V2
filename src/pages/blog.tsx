import { Link } from "wouter";
import { BLOG } from "@/lib/content";

const STUB_ARTICLES = [
  {
    slug: "stop-bang-explained",
    category: "Screening",
    title: "The STOP-BANG Questionnaire: What It Measures and Why It Matters",
    excerpt: "STOP-BANG is the most widely used screening tool for obstructive sleep apnea in clinical practice. Here's how to interpret your score.",
    readTime: "5 min read",
  },
  {
    slug: "osa-comorbidities",
    category: "Sleep Apnea",
    title: "Sleep Apnea and Heart Disease: Understanding the Connection",
    excerpt: "Untreated sleep apnea significantly increases the risk of hypertension, atrial fibrillation, and heart failure. Here's what the evidence says.",
    readTime: "6 min read",
  },
  {
    slug: "cpap-alternatives",
    category: "Treatment",
    title: "Beyond CPAP: Treatment Options for Sleep Apnea in 2024",
    excerpt: "CPAP remains the gold standard, but oral appliances, surgery, and emerging therapies offer effective alternatives for many patients.",
    readTime: "7 min read",
  },
  {
    slug: "airway-anatomy",
    category: "Anatomy",
    title: "The Four Zones of Airway Obstruction — And Why Location Matters",
    excerpt: "Where your airway narrows during sleep determines which treatments are most likely to succeed. The Murphy Method™ maps all four zones.",
    readTime: "5 min read",
  },
  {
    slug: "insomnia-sleep-apnea",
    category: "COMISA",
    title: "When Insomnia and Sleep Apnea Occur Together: COMISA Explained",
    excerpt: "Roughly 30–40% of sleep apnea patients also have insomnia. Treating one without the other leads to poor outcomes in most cases.",
    readTime: "6 min read",
  },
  {
    slug: "wearable-sleep-warnings",
    category: "Wearables",
    title: "My Apple Watch Flagged Sleep Apnea. What Should I Do?",
    excerpt: "Consumer wearables are generating millions of sleep apnea alerts. A Stanford sleep physician explains what comes next.",
    readTime: "4 min read",
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Screening:     { bg: "#EFF6FF", text: "#1D4ED8" },
  "Sleep Apnea": { bg: "#FEF2F2", text: "#DC2626" },
  Treatment:     { bg: "#F0FDF4", text: "#16A34A" },
  Anatomy:       { bg: "#FFF7ED", text: "#B45309" },
  COMISA:        { bg: "#F5F3FF", text: "#7C3AED" },
  Wearables:     { bg: "#F0F9FF", text: "#0E7490" },
};

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

      {/* ── ARTICLES GRID ── */}
      <section className="section-tinted">
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px" }}>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {STUB_ARTICLES.map((article) => {
              const colors = CATEGORY_COLORS[article.category] ?? { bg: "#F1F5F9", text: "#475569" };
              return (
                <div
                  key={article.slug}
                  className="card flex flex-col overflow-hidden"
                  style={{ padding: 0 }}
                >
                  <div style={{ height: "4px", backgroundColor: colors.text }} />
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="rounded-full px-2.5 py-0.5"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          fontSize: "11px",
                          fontFamily: "var(--font-sans)",
                          fontWeight: 600,
                        }}
                      >
                        {article.category}
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", color: "var(--text-muted)", fontSize: "12px" }}>
                        {article.readTime}
                      </span>
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "16px",
                        lineHeight: 1.4,
                        color: "var(--text-ink)",
                        marginBottom: "8px",
                      }}
                    >
                      {article.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                        flex: 1,
                        marginBottom: "16px",
                      }}
                    >
                      {article.excerpt}
                    </p>
                    <Link href={`/blog/${article.slug}`}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 500,
                          color: "var(--blue)",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        Read article →
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
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

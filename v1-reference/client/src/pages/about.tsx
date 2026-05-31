import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ExternalLink } from "lucide-react";
import drMurphyPhoto from "@assets/Murphy-14_1765142967232.jpg";
import { ABOUT, DR_MURPHY } from "@/content";

const credentials = DR_MURPHY.credentials;
const credentialPills = DR_MURPHY.credentialPills;

export default function AboutPage() {
  return (
    <Layout>
      {/* ── HERO ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-start mx-auto" style={{ maxWidth: "960px" }}>
            {/* Photo */}
            <div className="flex-shrink-0">
              <img
                src={drMurphyPhoto}
                alt="Dr. Michael Murphy"
                className="object-cover"
                style={{
                  width: "320px",
                  maxWidth: "100%",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                }}
                data-testid="img-dr-murphy"
              />
            </div>

            {/* Text */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-gray-300" style={{ width: "40px" }} />
                <span
                  className="text-[12px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: "#0F172A" }}
                >
                  About the Creator
                </span>
              </div>

              <h1 className="font-bold mb-2" style={{ color: "#0F172A", fontSize: "40px", lineHeight: 1.1 }} data-testid="text-about-title">
                {DR_MURPHY.name}
              </h1>
              <p className="text-[16px] mb-5" style={{ color: "#2563EB" }}>
                {DR_MURPHY.tagline}
              </p>

              <p className="mb-5" style={{ color: "#4B5563", fontSize: "17px", lineHeight: 1.7 }}>
                {DR_MURPHY.longBio1}
              </p>
              <p className="mb-6" style={{ color: "#4B5563", fontSize: "17px", lineHeight: 1.7 }}>
                {DR_MURPHY.longBio2}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {credentialPills.map((c) => (
                  <span
                    key={c}
                    className="text-[12px] px-3 py-1.5 rounded-full"
                    style={{
                      border: "1px solid #E5E7EB",
                      color: "#374151",
                      backgroundColor: "white",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>

              <a
                href={DR_MURPHY.stanfordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[14px] no-underline font-medium"
                style={{ color: "#2563EB" }}
                data-testid="link-stanford-profile"
              >
                {DR_MURPHY.stanfordLinkText}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORIGIN STORY ── */}
      <section className="bg-white" style={{ padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto" style={{ maxWidth: "720px" }}>
            <h2 className="font-bold mb-6" style={{ color: "#0F172A", fontSize: "32px" }} data-testid="text-section-story">
              {ABOUT.originStory.headline}
            </h2>

            <div className="space-y-5" style={{ color: "#4B5563", fontSize: "17px", lineHeight: 1.75 }}>
              {ABOUT.originStory.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div
              className="mt-8 rounded-lg"
              style={{
                borderLeft: "4px solid #2563EB",
                paddingLeft: "24px",
                paddingTop: "4px",
                paddingBottom: "4px",
              }}
            >
              <p className="italic font-medium" style={{ color: "#0F172A", fontSize: "18px", lineHeight: 1.6 }}>
                {DR_MURPHY.reportQuote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CREDENTIALS DETAIL ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto" style={{ maxWidth: "720px" }}>
            <h2 className="font-bold mb-8" style={{ color: "#0F172A", fontSize: "28px" }}>
              Education & Credentials
            </h2>
            <div className="divide-y" style={{ borderColor: "#E5E7EB" }}>
              {credentials.map(({ label, value }) => (
                <div key={value} className="flex gap-6 py-4">
                  <span className="text-[13px] font-semibold uppercase tracking-wide w-36 flex-shrink-0 mt-0.5" style={{ color: "#6B7280" }}>
                    {label}
                  </span>
                  <span style={{ color: "#374151", fontSize: "15px" }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <a
                href={DR_MURPHY.stanfordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[14px] no-underline font-medium"
                style={{ color: "#2563EB" }}
              >
                {DR_MURPHY.stanfordLinkText} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT THE MURPHY METHOD ── */}
      <section className="bg-white" style={{ padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto" style={{ maxWidth: "720px" }}>
            <h2 className="font-bold mb-6" style={{ color: "#0F172A", fontSize: "28px" }}>
              {ABOUT.methodSection.headline}
            </h2>
            <div className="space-y-4" style={{ color: "#4B5563", fontSize: "16px", lineHeight: 1.75 }}>
              {ABOUT.methodSection.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: "#0F172A", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mx-auto" style={{ maxWidth: "560px" }}>
            <h3 className="font-bold text-white mb-4" style={{ fontSize: "32px" }}>
              {ABOUT.cta.headline}
            </h3>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.7)", fontSize: "17px" }}>
              {ABOUT.cta.subheadline}
            </p>
            <Link href="/screener">
              <button
                className="text-white font-semibold cursor-pointer border-0"
                style={{
                  backgroundColor: "#2563EB",
                  fontSize: "16px",
                  padding: "14px 36px",
                  borderRadius: "8px",
                }}
                data-testid="button-start-screening-about"
              >
                {ABOUT.cta.ctaButton}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

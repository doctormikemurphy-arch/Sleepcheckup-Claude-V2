import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Layout } from "@/components/layout/Layout";
import {
  ClipboardList,
  Activity,
  Shield,
  Moon,
  BarChart2,
  Wind,
  Lock,
} from "lucide-react";
import { HOW_IT_WORKS } from "@/content";

const { faqs, hero, freePaid, pathwaysSection, reportSection, finalCta } = HOW_IT_WORKS;

const assessmentSections = HOW_IT_WORKS.assessmentSections.items.map((item, i) => ({
  ...item,
  Icon: [ClipboardList, BarChart2, Shield, Moon, Activity, Wind][i],
}));

const reportRows = reportSection.rows;
const pathways = pathwaysSection.pathways;

export default function HowItWorksPage() {
  return (
    <Layout>
      {/* ── SECTION 1: PAGE HERO ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "80px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mx-auto" style={{ maxWidth: "640px" }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px bg-gray-300" style={{ width: "40px" }} />
              <span
                className="text-[12px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "#0F172A" }}
              >
                The Process
              </span>
              <div className="h-px bg-gray-300" style={{ width: "40px" }} />
            </div>
            <h1 className="font-bold mb-4" style={{ color: "#0F172A", fontSize: "44px", lineHeight: 1.1 }}>
              {hero.headline}
            </h1>
            <p style={{ color: "#6B7280", fontSize: "18px", lineHeight: 1.6 }}>
              {hero.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: FREE vs PAID ── */}
      <section className="bg-white" style={{ padding: "60px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-center font-bold mb-10" style={{ color: "#0F172A", fontSize: "28px" }}>
            {freePaid.headline}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mx-auto" style={{ maxWidth: "880px" }}>
            {/* Free */}
            <div
              className="rounded-lg p-8"
              style={{ border: "1px solid #E5E7EB", borderRadius: "12px" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[11px] font-bold uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}
                >
                  Free · 3 minutes
                </span>
              </div>
              <h3 className="font-bold mb-3" style={{ color: "#0F172A", fontSize: "22px" }}>
                {freePaid.free.title}
              </h3>
              <p className="mb-4" style={{ color: "#4B5563", fontSize: "15px", lineHeight: 1.7 }}>
                {freePaid.free.body}
              </p>
              <ul className="space-y-2 mb-6" style={{ color: "#6B7280", fontSize: "14px" }}>
                {freePaid.free.features.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: "#16A34A" }}>✓</span> {i}
                  </li>
                ))}
              </ul>
              <Link href="/screener">
                <button
                  className="w-full py-3 font-semibold text-[15px] cursor-pointer transition-colors"
                  style={{
                    border: "1px solid #0F172A",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    color: "#0F172A",
                  }}
                  data-testid="button-start-screening-hiw-free"
                >
                  {freePaid.free.ctaButton}
                </button>
              </Link>
            </div>

            {/* Paid */}
            <div
              className="rounded-lg p-8"
              style={{ border: "2px solid #2563EB", borderRadius: "12px", backgroundColor: "#F0F7FF" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[11px] font-bold uppercase px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#DBEAFE", color: "#1D4ED8", border: "1px solid #BFDBFE" }}
                >
                  $1 one-time · 15–20 min
                </span>
              </div>
              <h3 className="font-bold mb-3" style={{ color: "#0F172A", fontSize: "22px" }}>
                {freePaid.paid.title}
              </h3>
              <p className="mb-4" style={{ color: "#4B5563", fontSize: "15px", lineHeight: 1.7 }}>
                {freePaid.paid.body}
              </p>
              <ul className="space-y-2 mb-6" style={{ color: "#6B7280", fontSize: "14px" }}>
                {freePaid.paid.features.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: "#2563EB" }}>✓</span> {i}
                  </li>
                ))}
              </ul>
              <Link href="/screener">
                <button
                  className="w-full py-3 font-semibold text-[15px] text-white cursor-pointer transition-colors"
                  style={{ backgroundColor: "#2563EB", borderRadius: "8px", border: "none" }}
                  data-testid="button-start-screening-hiw-paid"
                >
                  {freePaid.paid.ctaButton}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: ASSESSMENT SECTIONS ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "60px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-center font-bold mb-10" style={{ color: "#0F172A", fontSize: "28px" }}>
            {HOW_IT_WORKS.assessmentSections.headline}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mx-auto" style={{ maxWidth: "960px" }}>
            {assessmentSections.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-white rounded-lg p-6"
                style={{ border: "1px solid #E5E7EB", borderRadius: "10px" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#EFF6FF" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#2563EB" }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "#0F172A", fontSize: "16px" }}>
                  {title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.6 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THE 8 PATHWAYS ── */}
      <section className="bg-white" style={{ padding: "60px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mx-auto" style={{ maxWidth: "680px" }}>
            <h2 className="font-bold mb-4" style={{ color: "#0F172A", fontSize: "28px" }}>
              {pathwaysSection.headline}
            </h2>
            <p className="mb-8" style={{ color: "#4B5563", fontSize: "16px", lineHeight: 1.7 }}>
              {pathwaysSection.body}
            </p>

            <div className="flex flex-wrap justify-center gap-2.5 mb-8">
              {pathways.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 text-[13px] px-3 py-2 rounded-full"
                  style={{
                    border: "1px solid #E5E7EB",
                    color: "#374151",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Lock className="w-3 h-3" style={{ color: "#9CA3AF" }} />
                  {p}
                </span>
              ))}
            </div>

            <p className="mb-6" style={{ color: "#6B7280", fontSize: "15px" }}>
              {pathwaysSection.footerText}
            </p>

            <Link href="/screener">
              <button
                className="text-white font-semibold cursor-pointer border-0"
                style={{
                  backgroundColor: "#2563EB",
                  fontSize: "15px",
                  padding: "12px 28px",
                  borderRadius: "8px",
                }}
              >
                {pathwaysSection.ctaButton}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: REPORT PREVIEW (expanded) ── */}
      <section style={{ backgroundColor: "#F9FAFB", padding: "60px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto" style={{ maxWidth: "760px" }}>
            <h2 className="font-bold mb-4" style={{ color: "#0F172A", fontSize: "28px" }}>
              {reportSection.headline}
            </h2>
            <p className="mb-10" style={{ color: "#6B7280", fontSize: "16px", lineHeight: 1.6 }}>
              {reportSection.subheadline}
            </p>

            <div className="space-y-0 divide-y" style={{ borderColor: "#E5E7EB" }}>
              {reportRows.map(({ title, body }, i) => (
                <div key={title} className="flex gap-6 py-6">
                  <div
                    className="flex-shrink-0 flex items-center justify-center font-bold text-white rounded-lg"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: i === 5 ? "#2563EB" : "#0F172A",
                      fontSize: "15px",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "#0F172A", fontSize: "17px" }}>
                      {title}
                    </h3>
                    <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FAQ ── */}
      <section className="bg-white" style={{ padding: "60px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto" style={{ maxWidth: "680px" }}>
            <h2 className="text-center font-bold mb-10" style={{ color: "#0F172A", fontSize: "28px" }}>
              Common Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-0">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <AccordionTrigger
                    className="text-left py-5 hover:no-underline font-medium"
                    style={{ color: "#0F172A", fontSize: "16px" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent
                    className="pb-5"
                    style={{ color: "#4B5563", fontSize: "15px", lineHeight: 1.7 }}
                  >
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CTA ── */}
      <section style={{ backgroundColor: "#0F172A", padding: "100px 0" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mx-auto" style={{ maxWidth: "600px" }}>
            <h2 className="font-bold text-white mb-4" style={{ fontSize: "40px", lineHeight: 1.15 }}>
              {finalCta.headline}
            </h2>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.7)", fontSize: "17px" }}>
              {finalCta.subheadline}
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
                data-testid="button-start-screening-hiw"
              >
                {finalCta.ctaButton}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

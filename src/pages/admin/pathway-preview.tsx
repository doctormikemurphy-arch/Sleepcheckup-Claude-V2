// Admin Pathway Preview: shows the real results page and PDF report for any pathway A–H,
// filled with sample answers. Dev builds only (the route is registered in App.tsx behind
// import.meta.env.DEV). No Stripe, no assessment, no email, no logging, no browser storage.
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Lock } from "lucide-react";
import AssessmentResultsPage from "@/pages/assessment-results";
import AssessmentReportPage from "@/pages/assessment-report";
import { getPathwayDefinition } from "@/lib/pathways";
import { PREVIEW_PATHWAYS, SAMPLE_ANSWERS, findSampleMismatches } from "@/lib/admin-sample-answers";
import { useAdminAuth } from "@/lib/use-admin-auth";
import type { MurphyPathwayId } from "@/lib/types";

type PreviewTab = "results" | "report";

const mismatches = findSampleMismatches();

export default function PathwayPreviewPage() {
  const authState = useAdminAuth();
  const [pathway, setPathway] = useState<MurphyPathwayId>("A_insomnia");
  const [tab, setTab] = useState<PreviewTab>("results");

  if (authState !== "authed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center" style={{ fontFamily: "var(--font-sans)" }}>
        <Lock className="w-8 h-8 mb-4" style={{ color: "var(--text-muted)" }} />
        <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-ink)" }}>
          {authState === "loading" ? "Checking access…" : "Admin access required"}
        </p>
      </div>
    );
  }

  const switchTo = (next: PreviewTab) => { setTab(next); window.scrollTo(0, 0); };
  const sample = PREVIEW_PATHWAYS.find((p) => p.id === pathway)!;
  const state = SAMPLE_ANSWERS[pathway];

  const pill = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, padding: "6px 12px", borderRadius: "8px", cursor: "pointer",
    border: active ? "1px solid var(--blue)" : "1px solid var(--border-soft)",
    backgroundColor: active ? "var(--blue)" : "var(--bg-card)",
    color: active ? "#fff" : "var(--text-ink)",
  });

  return (
    // Same wrapper the customer routes get from <Layout hideHeader hideFooter>, minus the
    // cookie banner and sticky CTA (the cookie banner reads/writes browser storage).
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>
      {/* Preview controls: hidden when printing so the PDF matches what a customer gets */}
      <div className="print:hidden" style={{ backgroundColor: "#FFFBEB", borderBottom: "2px solid #F59E0B", padding: "12px 24px" }}>
        <div className="mx-auto flex flex-col gap-3" style={{ maxWidth: "960px", fontFamily: "var(--font-sans)" }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p style={{ fontSize: "14px", fontWeight: 800, color: "#92400E", letterSpacing: "0.04em" }}>
              PREVIEW - sample answers
              <span style={{ fontWeight: 500, letterSpacing: 0 }}> · Not a real customer. No email is sent and nothing is saved or logged.</span>
            </p>
            <Link href="/admin" className="no-underline flex items-center gap-1.5" style={{ fontSize: "13px", fontWeight: 600, color: "#92400E" }}>
              <ArrowLeft className="w-4 h-4" /> Admin
            </Link>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Pathway">
            {PREVIEW_PATHWAYS.map(({ id, letter }) => (
              <button key={id} type="button" onClick={() => setPathway(id)} style={pill(pathway === id)} title={getPathwayDefinition(id).title} aria-pressed={pathway === id}>
                {letter}
              </button>
            ))}
            <span style={{ width: "12px" }} />
            <button type="button" onClick={() => switchTo("results")} style={pill(tab === "results")} aria-pressed={tab === "results"}>Results page</button>
            <button type="button" onClick={() => switchTo("report")} style={pill(tab === "report")} aria-pressed={tab === "report"}>PDF report</button>
          </div>

          <p style={{ fontSize: "13px", color: "#92400E" }}>
            <strong>{sample.letter}: {getPathwayDefinition(pathway).title}</strong> — sample answers: {sample.summary}
          </p>

          {mismatches.length > 0 && (
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#B91C1C" }}>
              Sample check failed: {mismatches.map((m) => `${m.expected} lands on ${m.actual}`).join("; ")}. The pathway rules changed; update src/lib/admin-sample-answers.ts.
            </p>
          )}
        </div>
      </div>

      <main className="flex-1">
        {/* key forces a fresh page per pathway/tab, the same as a customer opening it */}
        {tab === "results" ? (
          <AssessmentResultsPage key={`results-${pathway}`} preview={{ state, onOpenReport: () => switchTo("report") }} />
        ) : (
          <AssessmentReportPage key={`report-${pathway}`} preview={{ state, onOpenResults: () => switchTo("results") }} />
        )}
      </main>
    </div>
  );
}

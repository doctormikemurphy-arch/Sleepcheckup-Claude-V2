import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Printer, FileText, Download, RotateCcw, ArrowLeft, Target,
  Lightbulb, Footprints, Activity, AlertCircle, Stethoscope, ChevronRight,
} from "lucide-react";
import { loadState, clearState, getPaidSession, KEYS } from "@/lib/storage";
import { PATHWAY_CONTENT } from "@/lib/pathway-content";
import type { AssessmentState } from "@/lib/assessment-types";
import type { PatientProfile, MurphyPathwayId, PathwayDefinition } from "@/lib/types";
import {
  scoreStopBang, scoreIsi, scorePlato, scorePalm,
  scoreZones, scoreMedicalHistory, scoreAnatomy,
  getOsaRiskLabel, getInsomniaSeverityLabel, getZoneInterpretation,
} from "@/lib/scoring";
import { assignMurphyPathway, getPathwayDefinition } from "@/lib/pathways";

const PATHWAY_LETTERS: Record<string, string> = {
  A_insomnia: "A", B_obesity: "B", C_nasal: "C", D_mandible: "D",
  E_multilevel: "E", F_physiology: "F", G_low_risk: "G", H_complex: "H",
};

const anatomyZones = [
  { key: "nose" as const, label: "Nose & Nasal Airway", scoreKey: "noseScore" as const, positiveKey: "noseIsPositive" as const, responsesKey: "noseResponses" as const, maxScore: 5 },
  { key: "palate" as const, label: "Palate & Tonsils", scoreKey: "palateScore" as const, positiveKey: "palateIsPositive" as const, responsesKey: "palateResponses" as const, maxScore: 3 },
  { key: "mandible" as const, label: "Jaw & Tongue", scoreKey: "mandibleScore" as const, positiveKey: "mandibleIsPositive" as const, responsesKey: "mandibleResponses" as const, maxScore: 3 },
  { key: "neck" as const, label: "Neck & Body", scoreKey: "neckScore" as const, positiveKey: "neckIsPositive" as const, responsesKey: "neckResponses" as const, maxScore: 3 },
];

const palmLetters = [
  { key: "pcrit" as const, letter: "P", name: "Airway Narrowing (Pcrit)" },
  { key: "arousal" as const, letter: "A", name: "Arousal Threshold" },
  { key: "loopGain" as const, letter: "L", name: "Loop Gain" },
  { key: "muscle" as const, letter: "M", name: "Muscle Responsiveness" },
];

const stopBangMeaning = {
  low: "A score of 0–2 indicates a lower probability of obstructive sleep apnea based on the standard STOP-BANG clinical screening tool.",
  intermediate: "A score of 3–4 indicates a meaningful probability of obstructive sleep apnea and warrants further clinical evaluation.",
  high: "A score of 5–8 indicates a high probability of moderate-to-severe obstructive sleep apnea. Clinical evaluation is strongly recommended.",
};

const riskBgColors = {
  low: { bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" },
  intermediate: { bg: "#FFFBEB", text: "#B45309", border: "#FCD34D" },
  high: { bg: "#FEF2F2", text: "#B91C1C", border: "#FCA5A5" },
};

function getBmiCategory(bmi: number | null): { label: string; color: string } {
  if (!bmi) return { label: "N/A", color: "#64748B" };
  if (bmi < 18.5) return { label: "Underweight", color: "#1D4ED8" };
  if (bmi < 25)   return { label: "Normal weight", color: "#16A34A" };
  if (bmi < 30)   return { label: "Overweight", color: "#B45309" };
  return { label: "Obesity", color: "#DC2626" };
}

interface ResultsData {
  profile: PatientProfile;
  pathway: MurphyPathwayId;
  pathwayDef: PathwayDefinition;
  assessmentDate: string;
  bmiValue: number | null;
}

function loadResultsData(): ResultsData | null {
  try {
    const saved = loadState<AssessmentState>(KEYS.assessment);
    if (!saved) return null;
    const { score: stopBangScore, risk: osaRisk } = scoreStopBang(saved.stopBang ?? (saved as any).stopBangAnswers ?? {});
    const { score: isiScore, severity: insomniaSeverity } = scoreIsi(saved.isi ?? (saved as any).isiAnswers ?? {});
    const plato = scorePlato(saved.plato ?? (saved as any).platoAnswers ?? {});
    const palm = scorePalm(saved.palm ?? (saved as any).palmAnswers ?? {});
    const zones = scoreZones(saved.zoneAnswers ?? {});
    const medicalHistory = scoreMedicalHistory(saved.medicalHistory ?? (saved as any).medicalHistoryAnswers ?? {});
    const anatomy = scoreAnatomy(saved.zoneAnswers ?? {});
    const bmiValue = saved.bmi?.calculatedBmi ?? (saved as any).bmiData?.calculatedBmi ?? null;

    const profile: PatientProfile = {
      stopBangScore, osaRisk, isiScore, insomniaSeverity,
      plato, palm, zones, medicalHistory, anatomy, bmiValue,
      comorbidities: medicalHistory.answeredYes,
    };
    const pathway = assignMurphyPathway(profile);
    const pathwayDef = getPathwayDefinition(pathway);
    const assessmentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    return { profile, pathway, pathwayDef, assessmentDate, bmiValue };
  } catch {
    return null;
  }
}

function PathwaySummarySection({ pathwayDef }: { pathwayDef: PathwayDefinition }) {
  const raw = pathwayDef.educationalSummary || "";
  const paragraphs = raw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const keyConceptPara = paragraphs.find((p) => p.startsWith("Key Concept:"));
  const nextStepPara = paragraphs.find((p) => p.startsWith("Your Next Step:"));
  const mainParagraphs = paragraphs.filter((p) => !p.startsWith("Key Concept:") && !p.startsWith("Your Next Step:"));
  const stripPrefix = (text: string, prefix: string) =>
    text.startsWith(prefix) ? text.slice(prefix.length).trim() : text;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {mainParagraphs.map((para, i) => (
        <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink-soft)", lineHeight: 1.75 }}>{para}</p>
      ))}
      {keyConceptPara && (
        <div className="flex items-start gap-3" style={{ borderRadius: "12px", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", padding: "16px" }}>
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#DBEAFE", marginTop: "2px" }}>
            <Lightbulb className="w-4 h-4" style={{ color: "var(--blue)" }} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Key Concept</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)", lineHeight: 1.65 }}>{stripPrefix(keyConceptPara, "Key Concept:")}</p>
          </div>
        </div>
      )}
      {nextStepPara && (
        <div className="flex items-start gap-3" style={{ borderRadius: "12px", backgroundColor: "#F0FDF4", border: "1px solid #86EFAC", padding: "16px" }}>
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#DCFCE7", marginTop: "2px" }}>
            <Footprints className="w-4 h-4" style={{ color: "#15803D" }} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", color: "#15803D", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Your Next Step</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)", lineHeight: 1.65 }}>{stripPrefix(nextStepPara, "Your Next Step:")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AssessmentResultsPage() {
  const [, navigate] = useLocation();
  const [data, setData] = useState<ResultsData | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const result = loadResultsData();
    if (!result) { setMissing(true); return; }
    setData(result);

    // Send report email once per session (guard against double-send on re-render/refresh)
    const sentKey = "report_email_sent_v2";
    const paidSession = getPaidSession();
    if (paidSession?.email && !sessionStorage.getItem(sentKey)) {
      sessionStorage.setItem(sentKey, "1");
      const { profile: p, pathway: pw, pathwayDef: pd, assessmentDate: ad, bmiValue: bv } = result;
      const pc = PATHWAY_CONTENT[pw];
      fetch("/api/submit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: paidSession.email,
          pathwayName: pd.title,
          pathwayLetter: PATHWAY_LETTERS[pw] ?? "",
          pathwayDescription: pd.shortDescription,
          stopBangScore: p.stopBangScore,
          osaRisk: p.osaRisk,
          isiScore: p.isiScore,
          insomniaSeverity: p.insomniaSeverity,
          bmiValue: bv,
          bmiLabel: bv ? (bv < 18.5 ? "Underweight" : bv < 25 ? "Normal weight" : bv < 30 ? "Overweight" : "Obesity") : "N/A",
          assessmentDate: ad,
          anatomyTotal: p.anatomy?.totalScore ?? 0,
          anatomyZones: anatomyZones.map((z) => ({
            label: z.label,
            score: p.anatomy[z.scoreKey] ?? 0,
            max: z.maxScore,
            isPositive: p.anatomy[z.positiveKey] ?? false,
            answers: p.anatomy[z.responsesKey]?.answeredYes ?? [],
          })),
          palmResults: palmLetters.map((r) => ({
            letter: r.letter,
            name: r.name,
            score: p.palm[r.key]?.score ?? 0,
            isPositive: p.palm[r.key]?.isPositive ?? false,
            questions: p.palm[r.key]?.positiveQuestions ?? [],
          })),
          medicalHistoryScore: p.medicalHistory?.totalScore ?? 0,
          medicalHistoryConditions: p.medicalHistory?.answeredYes ?? [],
          platoTotal: p.plato?.totalScore ?? 0,
          whatResultsSuggest: pc?.whatResultsSuggest ?? [],
          whyItMattersPts: pc?.whyItMatters?.points ?? [],
          whatWorksBestOpts: pc?.whatWorksBest?.options ?? [],
          nextStepsSteps: pc?.nextSteps?.steps ?? [],
        }),
      }).catch(() => {/* non-fatal */});
    }
  }, []);

  if (missing || !data) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh", padding: "40px 20px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "20px", color: "var(--text-ink)", marginBottom: "8px" }}>No assessment data found</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", marginBottom: "24px" }}>Please complete the full assessment before viewing your results.</p>
        <Link href="/assessment"><button className="btn-primary">Go to Assessment</button></Link>
      </div>
    );
  }

  const { profile, pathway, pathwayDef, assessmentDate, bmiValue } = data;
  const letter = PATHWAY_LETTERS[pathway] ?? "?";
  const pathwaySlug = letter.toLowerCase();
  const riskColors = riskBgColors[profile.osaRisk];
  const bmiCat = getBmiCategory(bmiValue);

  const isiColor = profile.insomniaSeverity === "severe" ? "#DC2626"
    : profile.insomniaSeverity === "moderate" ? "#D97706"
    : profile.insomniaSeverity === "subthreshold" ? "#1D4ED8"
    : "#16A34A";

  const handleExportJSON = () => {
    const exportData = {
      pathway, pathwayTitle: pathwayDef.title, assessmentDate,
      scores: { stopBangScore: profile.stopBangScore, osaRisk: profile.osaRisk, isiScore: profile.isiScore, insomniaSeverity: profile.insomniaSeverity, bmiValue },
      anatomy: profile.anatomy, palm: profile.palm,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `murphy-method-results-${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const rows = [
      ["Field", "Value"],
      ["Pathway", pathwayDef.title], ["Assessment Date", assessmentDate],
      ["STOP-BANG Score", String(profile.stopBangScore)], ["OSA Risk", profile.osaRisk],
      ["ISI Score", String(profile.isiScore)], ["Insomnia Severity", profile.insomniaSeverity],
      ["BMI", bmiValue ? bmiValue.toFixed(1) : "N/A"],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `murphy-method-results-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-page)", minHeight: "100vh" }}>

      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 border-b flex items-center justify-between gap-4 px-6 py-3" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-soft)" }}>
        <button onClick={() => navigate("/assessment?from=results")} className="flex items-center gap-2" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Assessment
        </button>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2" style={{ minHeight: "40px", fontSize: "14px", padding: "0 16px" }}>
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      <div className="mx-auto" style={{ maxWidth: "760px", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ paddingTop: "48px", paddingBottom: "32px", textAlign: "center" }}>
          <div className="eyebrow mb-4">YOUR RESULTS</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.05, color: "var(--text-ink)", marginBottom: "12px" }}>
            Review your personalized <em>Murphy Method™</em> pathway
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>{assessmentDate}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <button onClick={() => navigate("/assessment/report")} className="btn-primary flex items-center justify-center gap-2 flex-1" style={{ fontSize: "16px", minHeight: "52px" }}>
            <FileText className="w-4 h-4" />
            View Full Report
          </button>
          <button onClick={() => window.print()} className="btn-secondary flex items-center justify-center gap-2 flex-1" style={{ fontSize: "16px", minHeight: "52px" }}>
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>

        {/* Disclaimer */}
        <div style={{ borderRadius: "10px", border: "1px solid #FDE68A", backgroundColor: "#FFFBEB", padding: "12px 16px", marginBottom: "40px" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#92400E", lineHeight: 1.6, textAlign: "center" }}>
            For educational purposes only — not a medical diagnosis. Share these results with your healthcare provider.
          </p>
        </div>

        {/* ── STEP 1: How Is the Breathing at Night? ── */}
        <section className="mb-8">
          <div className="flex items-center gap-3 pb-3 mb-4" style={{ borderBottom: "2px solid #1D4ED8" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#1D4ED8" }}>
              <span className="text-white font-bold" style={{ fontSize: "13px" }}>1</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Step 1: How Is the Breathing at Night?</p>
              <p className="text-ink-muted" style={{ fontSize: "14px" }}>STOP-BANG, Insomnia Severity Index, BMI & PLATO-11</p>
            </div>
            <Activity className="w-5 h-5 flex-shrink-0" style={{ color: "#1D4ED8" }} />
          </div>

          {/* STOP-BANG */}
          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="font-bold mb-3" style={{ fontSize: "15px", color: "#1E40AF" }}>STOP-BANG Obstructive Sleep Apnea Risk</p>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <p className="font-black text-ink" style={{ fontSize: "40px", lineHeight: 1 }}>
                  {profile.stopBangScore}<span className="font-medium text-ink-muted" style={{ fontSize: "20px" }}>/8</span>
                </p>
                <p className="text-ink-muted" style={{ fontSize: "14px" }}>STOP-BANG Score</p>
              </div>
              <div className="rounded-full px-4 py-2 font-bold" style={{ backgroundColor: riskColors.bg, color: riskColors.text, fontSize: "14px" }}>
                {getOsaRiskLabel(profile.osaRisk)}
              </div>
            </div>
            <div className="mb-3">
              <div className="flex h-3 rounded-full overflow-hidden mb-1.5">
                <div style={{ width: "37.5%", backgroundColor: "#4ADE80" }} />
                <div style={{ width: "25%", backgroundColor: "#FACC15" }} />
                <div style={{ width: "37.5%", backgroundColor: "#F87171" }} />
              </div>
              <div className="flex justify-between" style={{ fontSize: "12px", color: "#64748B" }}>
                <span>Low (0–2)</span><span>Moderate (3–4)</span><span>High (5–8)</span>
              </div>
              <div className="relative" style={{ height: "12px", marginTop: "4px" }}>
                <div className="absolute rounded-full border-2 border-white" style={{ width: "14px", height: "14px", backgroundColor: "#0F172A", left: `${(profile.stopBangScore / 8) * 100}%`, transform: "translateX(-50%)", top: "-1px", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
              </div>
            </div>
            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.65 }}>{stopBangMeaning[profile.osaRisk]}</p>
          </div>

          {/* ISI + BMI row */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
              <p className="font-bold mb-2" style={{ fontSize: "14px", color: "#1E40AF" }}>Insomnia Severity Index (ISI)</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-black text-ink" style={{ fontSize: "32px", lineHeight: 1 }}>{profile.isiScore}</span>
                <span className="text-ink-muted" style={{ fontSize: "16px" }}>/28</span>
              </div>
              <span className="rounded-full px-3 py-1 font-semibold inline-block" style={{ fontSize: "13px", backgroundColor: `${isiColor}18`, color: isiColor }}>
                {getInsomniaSeverityLabel(profile.insomniaSeverity)}
              </span>
            </div>
            <div className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
              <p className="font-bold mb-2" style={{ fontSize: "14px", color: "#1E40AF" }}>Body Mass Index (BMI)</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-black text-ink" style={{ fontSize: "32px", lineHeight: 1 }}>
                  {bmiValue ? bmiValue.toFixed(1) : "—"}
                </span>
                <span className="text-ink-muted" style={{ fontSize: "14px" }}>kg/m²</span>
              </div>
              <span className="rounded-full px-3 py-1 font-semibold inline-block" style={{ fontSize: "13px", backgroundColor: `${bmiCat.color}18`, color: bmiCat.color }}>
                {bmiCat.label}
              </span>
            </div>
          </div>

          {/* PLATO */}
          <div className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="font-bold mb-1" style={{ fontSize: "14px", color: "#1E40AF" }}>PLATO-11 — Sleep Quality & Daytime Impact</p>
            <p className="text-ink-muted mb-3" style={{ fontSize: "13px", fontStyle: "italic" }}>Describes your symptoms and sleep quality. Does not change your pathway assignment.</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Total Score", value: profile.plato?.totalScore ?? 0, max: 44 },
                { label: "Sleep Quality", value: profile.plato?.sleepQualityRaw ?? 0, max: 10 },
                { label: "Section A", value: profile.plato?.sectionAScore ?? 0, max: 32 },
                { label: "Section B", value: profile.plato?.sectionBScore ?? 0, max: 8 },
                { label: "Section C", value: profile.plato?.sectionCScore ?? 0, max: 4 },
              ].map(({ label, value, max }) => (
                <div key={label} className="flex flex-col items-center text-center" style={{ borderRadius: "10px", padding: "10px 14px", backgroundColor: "var(--bg-page)", minWidth: "80px" }}>
                  <span className="font-bold text-ink" style={{ fontSize: "20px" }}>{value}</span>
                  <span className="text-ink-muted" style={{ fontSize: "11px" }}>/ {max}</span>
                  <span className="text-ink-muted" style={{ fontSize: "11px", lineHeight: 1.3 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STEP 2: Where Can the Airway Narrow? ── */}
        <section className="mb-8">
          <div className="flex items-center gap-3 pb-3 mb-4" style={{ borderBottom: "2px solid #15803D" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#15803D" }}>
              <span className="text-white font-bold" style={{ fontSize: "13px" }}>2</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Step 2: Where Can the Airway Narrow?</p>
              <p className="text-ink-muted" style={{ fontSize: "14px" }}>Top-Down Anatomy Self-Check — 4 zones evaluated</p>
            </div>
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#15803D" }} />
          </div>

          <div className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="text-ink-muted mb-4" style={{ fontSize: "15px", lineHeight: 1.65 }}>
              The Murphy Method™ evaluates four anatomical zones from top to bottom. Each zone that responds positively is <strong className="text-ink">flagged</strong> — meaning your responses suggest that area may be contributing to sleep-disordered breathing.
            </p>
            <div className="space-y-3">
              {anatomyZones.map((zone) => {
                const score = profile.anatomy[zone.scoreKey];
                const isPositive = profile.anatomy[zone.positiveKey];
                const answeredYes = profile.anatomy[zone.responsesKey]?.answeredYes ?? [];
                return (
                  <div key={zone.key} className="rounded-lg border" style={{ borderColor: isPositive ? "#FDE68A" : "transparent", backgroundColor: isPositive ? "#FFFBEB" : "#F8FAFC" }}>
                    <div className="flex items-center gap-3 p-3">
                      <div className="rounded-full flex-shrink-0" style={{ width: "8px", height: "8px", backgroundColor: isPositive ? "#EAB308" : "#22C55E" }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink" style={{ fontSize: "15px" }}>{zone.label}</p>
                        <p className="text-ink-muted" style={{ fontSize: "13px" }}>{getZoneInterpretation(score)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-ink-muted" style={{ fontSize: "13px" }}>{score}/{zone.maxScore}</span>
                        <span className="rounded-full font-semibold px-2 py-0.5" style={{ fontSize: "12px", backgroundColor: isPositive ? "#FEF9C3" : "#DCFCE7", color: isPositive ? "#713F12" : "#14532D" }}>
                          {isPositive ? "Flagged" : "Clear"}
                        </span>
                      </div>
                    </div>
                    {isPositive && answeredYes.length > 0 && (
                      <ul className="px-4 pb-3 space-y-1">
                        {answeredYes.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-ink-muted" style={{ fontSize: "13px" }}>
                            <span className="rounded-full flex-shrink-0 mt-1.5" style={{ width: "6px", height: "6px", backgroundColor: "#EAB308" }} />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── STEP 3: What Can Help? ── */}
        <section className="mb-8">
          <div className="flex items-center gap-3 pb-3 mb-4" style={{ borderBottom: "2px solid #B91C1C" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#B91C1C" }}>
              <span className="text-white font-bold" style={{ fontSize: "13px" }}>3</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Step 3: What Can Help?</p>
              <p className="text-ink-muted" style={{ fontSize: "14px" }}>PALM Classification & Treatment Options</p>
            </div>
            <Stethoscope className="w-5 h-5 flex-shrink-0" style={{ color: "#B91C1C" }} />
          </div>

          {/* PALM results */}
          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="font-bold mb-3" style={{ fontSize: "15px", color: "#991B1B" }}>PALM Classification Screening</p>
            <p className="text-ink-muted mb-4" style={{ fontSize: "14px", lineHeight: 1.65 }}>
              A section is flagged positive if you answered "Yes" to 2 or more questions. Flagged sections indicate physiological factors that may influence your treatment options.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {palmLetters.map((p) => {
                const section = profile.palm?.[p.key];
                const isPositive = section?.isPositive ?? false;
                return (
                  <div key={p.key} className="rounded-lg border p-3" style={{ borderColor: isPositive ? "#FDE68A" : "#E2E8F0", backgroundColor: isPositive ? "#FFFBEB" : "#F8FAFC" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center justify-center flex-shrink-0 font-bold rounded-md" style={{ width: "28px", height: "28px", backgroundColor: isPositive ? "#EAB308" : "#94A3B8", color: "#fff", fontSize: "13px" }}>
                        {p.letter}
                      </div>
                      <p className="font-semibold text-ink" style={{ fontSize: "14px" }}>{p.name}</p>
                      <span className="ml-auto rounded-full font-semibold px-2 py-0.5 flex-shrink-0" style={{ fontSize: "11px", backgroundColor: isPositive ? "#FEF9C3" : "#DCFCE7", color: isPositive ? "#713F12" : "#14532D" }}>
                        {isPositive ? "Flagged" : "Clear"}
                      </span>
                    </div>
                    {isPositive && section?.positiveQuestions?.length > 0 && (
                      <ul className="pl-2 mt-1 space-y-0.5">
                        {section.positiveQuestions.map((q: string, i: number) => (
                          <li key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-muted)" }}>• {q}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Treatment options grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl border p-5" style={{ borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" }}>
              <p className="font-bold mb-4" style={{ fontSize: "15px", color: "#1E40AF" }}>Non-Surgery Options</p>
              <ul className="space-y-2">
                {["CPAP", "Oral appliance", "Other treatments"].map((item) => (
                  <li key={item} className="flex items-start gap-2" style={{ fontSize: "15px", color: "#0F172A" }}>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border p-5" style={{ borderColor: "#FECACA", backgroundColor: "#FEF2F2" }}>
              <p className="font-bold mb-4" style={{ fontSize: "15px", color: "#991B1B" }}>Procedure Options</p>
              <ul className="space-y-2">
                {["Nose procedures", "Palate / tonsil procedures", "Jaw / tongue procedures"].map((item) => (
                  <li key={item} className="flex items-start gap-2" style={{ fontSize: "15px", color: "#0F172A" }}>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#B91C1C" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border p-4 text-center" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
            <p style={{ fontSize: "15px", color: "#0F172A", lineHeight: 1.6 }}>
              <strong style={{ color: "#1E40AF" }}>Simple idea:</strong> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.
            </p>
          </div>
        </section>

        {/* ── STEP 4: YOUR PATHWAY ── */}
        <div className="flex items-center gap-3 pb-3 mb-6" style={{ borderBottom: "2px solid #0F172A" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#0F172A" }}>
            <span className="text-white font-bold" style={{ fontSize: "13px" }}>4</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Step 4: Your Results</p>
            <p className="text-ink-muted" style={{ fontSize: "14px" }}>Your assigned Murphy Method™ pathway</p>
          </div>
          <Target className="w-5 h-5 flex-shrink-0" style={{ color: "#0F172A" }} />
        </div>

        {/* Pathway card */}
        <div className="card mb-6" style={{ padding: "32px" }}>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#DBEAFE", border: "2px solid #BFDBFE" }}>
              <Target className="w-6 h-6" style={{ color: "var(--blue)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
                Your Assigned Pathway
              </div>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(18px, 2.5vw, 26px)", color: "var(--text-ink)", lineHeight: 1.2, marginBottom: "8px" }}>
                {pathwayDef.title}
              </h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "#1E40AF", lineHeight: 1.55, fontStyle: "italic" }}>
                "{pathwayDef.shortDescription}"
              </p>
            </div>
          </div>
        </div>

        {/* Pathway educational summary */}
        <div className="card mb-4" style={{ padding: "32px" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            About Your Pathway
          </div>
          <PathwaySummarySection pathwayDef={pathwayDef} />
          <div style={{ marginTop: "24px" }}>
            <Link href={`/pathways/${pathwaySlug}?from=results`} className="no-underline" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "15px", color: "var(--blue)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Learn more about your pathway →
            </Link>
          </div>
        </div>

        {/* Export */}
        <div className="card mb-6" style={{ padding: "32px" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
            Export Your Results
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: 1.55 }}>
            Save a copy of your results to bring to your doctor.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate("/assessment/report")} className="flex items-center justify-center gap-2 font-semibold rounded-xl flex-1"
              style={{ fontFamily: "var(--font-sans)", fontSize: "15px", backgroundColor: "var(--bg-dark)", color: "#fff", border: "none", minHeight: "48px", padding: "0 20px", cursor: "pointer" }}>
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button onClick={handleExportJSON} className="btn-secondary flex items-center justify-center gap-2 flex-1" style={{ fontSize: "15px", minHeight: "48px" }}>
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button onClick={handleExportCSV} className="btn-secondary flex items-center justify-center gap-2 flex-1" style={{ fontSize: "15px", minHeight: "48px" }}>
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", marginTop: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
            Email delivery is part of the full product — not available in this prototype.
          </p>
        </div>

        {/* Start Over */}
        <div style={{ textAlign: "center" }}>
          <button onClick={() => { clearState(KEYS.assessment); navigate("/assessment"); }} className="flex items-center justify-center gap-2 mx-auto"
            style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
            <RotateCcw className="w-4 h-4" />
            Start Over
          </button>
        </div>

      </div>
    </div>
  );
}

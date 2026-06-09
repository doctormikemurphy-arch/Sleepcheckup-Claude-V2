import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Printer, ArrowLeft, RotateCcw, Activity, AlertCircle, Stethoscope, ChevronRight, Lightbulb } from "lucide-react";
import { loadState } from "@/lib/storage";
import { KEYS } from "@/lib/storage";
import type { AssessmentState } from "@/lib/assessment-types";
import type { PatientProfile, MurphyPathwayId, PathwayDefinition } from "@/lib/types";
import {
  scoreStopBang, scoreIsi, scorePlato, scorePalm,
  scoreZones, scoreMedicalHistory, scoreAnatomy,
  getOsaRiskLabel, getInsomniaSeverityLabel, getZoneInterpretation,
} from "@/lib/scoring";
import { assignMurphyPathway, getPathwayDefinition } from "@/lib/pathways";
import { PATHWAY_CONTENT } from "@/lib/pathway-content";
import { PALM_QUESTIONS } from "@/lib/questionnaires";

const PATHWAY_LETTERS: Record<string, string> = {
  A_insomnia: "A", B_obesity: "B", C_nasal: "C", D_mandible: "D",
  E_multilevel: "E", F_physiology: "F", G_low_risk: "G", H_complex: "H",
};

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
  if (bmi < 35)   return { label: "Obesity I", color: "#DC2626" };
  if (bmi < 40)   return { label: "Obesity II", color: "#DC2626" };
  return { label: "Obesity III", color: "#DC2626" };
}

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

const SPECIALIST_RESOURCES = {
  sleep: {
    title: "Sleep Medicine Specialist",
    description: "American Academy of Sleep Medicine",
    url: "https://sleepeducation.org/sleep-center/",
    logoUrl: "https://sleepeducation.org/wp-content/uploads/2023/10/AASM_logo_h_RT_rgb-300x89.png",
    abbr: "AASM",
  },
  behavioral: {
    title: "Society of Behavioral Sleep Medicine – Find a Provider",
    description: "Find a behavioral sleep medicine specialist trained in CBT-I for insomnia treatment.",
    url: "https://www.behavioralsleep.org",
    logoUrl: "https://www.behavioralsleep.org/images/2021/graphics/SBSMlogo70H.png",
    abbr: "SBSM",
  },
  ent: {
    title: "Ear, Nose & Throat (ENT) Specialist",
    description: "American Academy of Otolaryngology - Head & Neck Surgery",
    url: "https://www.enthealth.org/find-ent/",
    logoUrl: "https://www.entnet.org/wp-content/uploads/2020/07/AAO-HNS_logo.png",
    abbr: "AAO",
  },
  dental: {
    title: "Dental Sleep Medicine Specialist",
    description: "American Academy of Dental Sleep Medicine",
    url: "https://aadsm.org/find_an_aadsm_qualilfied_denti.php",
    logoUrl: "https://aadsm.org/images/main-logo.png",
    abbr: "AADSM",
  },
  allergy: {
    title: "Find an Allergy Specialist",
    description: "American Academy of Allergy, Asthma & Immunology",
    url: "https://allergist.aaaai.org/find/",
    logoUrl: "/images/aaaai-thumbnail.png",
    abbr: "AAAAI",
  },
  endocrinology: {
    title: "Endocrinology Specialist",
    description: "American Association of Clinical Endocrinology",
    url: "https://www.aace.com/find-an-endo",
    logoUrl: "https://www.aace.com/images/wwwaacecom.jpg",
    abbr: "AACE",
  },
  bariatric: {
    title: "Bariatric Surgery Specialist",
    description: "American Society for Metabolism & Bariatric Surgery",
    url: "https://asmbs.org/patients/find-a-provider/",
    logoUrl: "https://asmbs.org/wp-content/uploads/2023/06/asmbs_logo.svg",
    abbr: "ASMBS",
  },
} as const;

type SpecialistKey = keyof typeof SPECIALIST_RESOURCES;

const PATHWAY_SPECIALISTS: Record<string, SpecialistKey[]> = {
  A_insomnia:   ["sleep", "behavioral", "ent", "dental", "allergy"],
  B_obesity:    ["sleep", "endocrinology", "bariatric", "ent", "allergy", "dental"],
  C_nasal:      ["ent", "allergy", "sleep"],
  D_mandible:   ["ent", "dental", "allergy", "sleep"],
  E_multilevel: ["ent", "dental", "allergy", "sleep"],
  F_physiology: ["sleep", "allergy"],
  G_low_risk:   ["ent", "dental", "allergy"],
  H_complex:    ["sleep", "ent", "allergy"],
};

interface ReportData {
  profile: PatientProfile;
  pathway: MurphyPathwayId;
  assessmentDate: string;
}

function loadReportData(): ReportData | null {
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
    const assessmentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    return { profile, pathway, assessmentDate };
  } catch {
    return null;
  }
}

function PathwaySummarySection({ pathwayDef }: { pathwayDef: PathwayDefinition }) {
  const raw = pathwayDef.educationalSummary || "";
  const paragraphs = raw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const keyConceptPara = paragraphs.find((p) => p.startsWith("Key Concept:"));
  const mainParagraphs = paragraphs.filter((p) => !p.startsWith("Key Concept:") && !p.startsWith("Your Next Step:"));
  const stripPrefix = (text: string, prefix: string) =>
    text.startsWith(prefix) ? text.slice(prefix.length).trim() : text;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
      {mainParagraphs.map((para, i) => (
        <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink-soft)", lineHeight: 1.75 }}>{para}</p>
      ))}
    </div>
  );
}

export default function AssessmentReportPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const result = loadReportData();
    if (!result) { setMissing(true); return; }
    setData(result);
  }, []);

  if (missing || !data) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh", padding: "40px 20px", backgroundColor: "var(--bg-page)" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "20px", color: "var(--text-ink)", marginBottom: "8px" }}>
          No assessment data found
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", marginBottom: "24px" }}>
          Please complete the full assessment before viewing your report.
        </p>
        <Link href="/assessment">
          <button className="btn-primary">Go to Assessment</button>
        </Link>
      </div>
    );
  }

  const { profile, pathway, assessmentDate } = data;
  const pathwayDef = getPathwayDefinition(pathway);
  const pc = PATHWAY_CONTENT[pathway] ?? PATHWAY_CONTENT.H_complex;
  const bmiCat = getBmiCategory(profile.bmiValue);
  const riskColors = riskBgColors[profile.osaRisk];
  const letter = PATHWAY_LETTERS[pathway] ?? "?";
  const pathwaySlug = letter.toLowerCase();

  const osaColor = profile.osaRisk === "high" ? "#DC2626" : profile.osaRisk === "intermediate" ? "#D97706" : "#16A34A";
  const isiColor = profile.insomniaSeverity === "severe" ? "#DC2626" : profile.insomniaSeverity === "moderate" ? "#D97706" : profile.insomniaSeverity === "subthreshold" ? "#1D4ED8" : "#16A34A";

  return (
    <div style={{ backgroundColor: "var(--bg-page)", minHeight: "100vh" }} className="print:bg-white">

      {/* Sticky print bar */}
      <div
        className="print:hidden sticky top-0 z-40 border-b flex items-center justify-between gap-4 px-6 py-3"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-soft)" }}
      >
        <Link
          href="/assessment/results"
          className="no-underline flex items-center gap-2"
          style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Your Results
        </Link>
        <div className="flex items-center gap-3">
          <p style={{ fontFamily: "var(--font-sans)", color: "var(--text-muted)", fontSize: "13px" }} className="hidden sm:block">
            For best results: Save as PDF, then print the PDF.
          </p>
          <button
            onClick={() => window.print()}
            className="btn-primary flex items-center gap-2"
            style={{ minHeight: "40px", fontSize: "14px", padding: "0 16px" }}
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="mx-auto" style={{ maxWidth: "960px" }}>

        {/* ── COVER ── */}
        <div
          className="print:break-after-page"
          style={{ backgroundColor: "var(--bg-card)", padding: "80px clamp(16px,5vw,48px) 64px", marginBottom: "12px" }}
        >
          <div className="flex flex-col items-center text-center">
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 40px)",
                lineHeight: 1.1,
                color: "var(--text-ink)",
                marginBottom: "32px",
              }}
            >
              Murphy Method™ Assessment <em>Report</em>
            </h1>

            {/* Pathway box */}
            <div
              className="w-full"
              style={{
                borderRadius: "var(--radius-card)",
                border: "1px solid #BFDBFE",
                backgroundColor: "#DBEAFE",
                padding: "24px 32px",
                maxWidth: "480px",
                marginBottom: "32px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "11px",
                  color: "var(--blue)",
                  marginBottom: "12px",
                }}
              >
                Your Assigned Pathway
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "26px", lineHeight: 1.2, color: "var(--text-ink)", marginBottom: "8px" }}>
                {pathwayDef.title}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "15px", color: "#1E40AF", lineHeight: 1.5 }}>
                {pathwayDef.shortDescription}
              </p>
            </div>

            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "17px", color: "var(--text-ink)", marginBottom: "4px" }}>
              Assessment Participant
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>
              Assessment Date: <span style={{ fontWeight: 600, color: "var(--text-ink)" }}>{assessmentDate}</span>
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "15px", color: "var(--blue)", marginTop: "24px" }}>
              sleepcheckup.com
            </p>
          </div>
        </div>

        {/* ── YOUR RESULTS (3-Step Structure) ── */}
        <div className="print:break-after-page" style={{ backgroundColor: "var(--bg-card)", padding: "40px clamp(16px,5vw,48px)", marginBottom: "12px" }}>

          {/* Section header */}
          <div style={{ borderRadius: "var(--radius-card)", padding: "24px 28px", marginBottom: "32px", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "clamp(18px, 2.5vw, 26px)", color: "var(--text-ink)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "6px" }}>
              Your Results
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>
              Based on your Murphy Method™ assessment answers
            </p>
          </div>

          {/* ── STEP 1: How Is the Breathing at Night? ── */}
          <div className="flex items-center gap-3 pb-3 mb-5" style={{ borderBottom: "2px solid #1D4ED8" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#1D4ED8" }}>
              <span className="text-white font-bold" style={{ fontSize: "13px" }}>1</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Step 1: How Is the Breathing at Night?</p>
              <p className="text-ink-muted" style={{ fontSize: "14px" }}>Medical History, BMI, Sleep Apnea Risk, Insomnia Severity & Sleep Quality</p>
            </div>
            <Activity className="w-5 h-5 flex-shrink-0" style={{ color: "#1D4ED8" }} />
          </div>

          {/* Medical History */}
          <div style={{ borderRadius: "12px", border: "1px solid #BFDBFE", padding: "16px", marginBottom: "16px" }}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "11px", color: "var(--blue)", marginBottom: "4px" }}>
                  Medical History
                </p>
                <div className="flex items-baseline gap-2">
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 900, fontSize: "26px", color: profile.medicalHistory?.totalScore > 0 ? "#D97706" : "#16A34A" }}>
                    {profile.medicalHistory?.totalScore ?? 0}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>/ 8</span>
                  <span style={{ fontFamily: "var(--font-sans)", borderRadius: "4px", padding: "2px 8px", fontWeight: 600, fontSize: "12px", backgroundColor: profile.medicalHistory?.totalScore > 0 ? "#FEF3C7" : "#DCFCE7", color: profile.medicalHistory?.totalScore > 0 ? "#D97706" : "#16A34A" }}>
                    {profile.medicalHistory?.totalScore > 0
                      ? `${profile.medicalHistory.totalScore} condition${profile.medicalHistory.totalScore > 1 ? "s" : ""} reported`
                      : "No conditions reported"}
                  </span>
                </div>
              </div>
              {profile.medicalHistory?.answeredYes?.length > 0 && (
                <ul className="list-disc list-inside space-y-0.5" style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)" }}>
                  {profile.medicalHistory.answeredYes.map((c) => <li key={c}>{c}</li>)}
                </ul>
              )}
            </div>
          </div>

          {/* BMI */}
          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="font-bold mb-2" style={{ fontSize: "14px", color: "#1E40AF" }}>BMI</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-black text-ink" style={{ fontSize: "32px", lineHeight: 1 }}>
                {profile.bmiValue ? profile.bmiValue.toFixed(1) : "—"}
              </span>
              <span className="text-ink-muted" style={{ fontSize: "14px" }}>kg/m²</span>
            </div>
            <span className="rounded-full px-3 py-1 font-semibold inline-block" style={{ fontSize: "13px", backgroundColor: `${bmiCat.color}18`, color: bmiCat.color }}>
              {bmiCat.label}
            </span>
          </div>

          {/* Sleep Apnea Risk */}
          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="font-bold mb-3" style={{ fontSize: "15px", color: "#1E40AF" }}>Sleep Apnea Risk</p>
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

          {/* Insomnia Severity */}
          <div className="rounded-xl border p-5 mb-4" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="font-bold mb-2" style={{ fontSize: "14px", color: "#1E40AF" }}>Insomnia Severity</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-black text-ink" style={{ fontSize: "32px", lineHeight: 1 }}>{profile.isiScore}</span>
              <span className="text-ink-muted" style={{ fontSize: "16px" }}>/28</span>
            </div>
            <p className="text-ink-muted mb-2" style={{ fontSize: "14px" }}>Insomnia Severity Index (ISI)</p>
            <span className="rounded-full px-3 py-1 font-semibold inline-block" style={{ fontSize: "13px", backgroundColor: `${isiColor}18`, color: isiColor }}>
              {getInsomniaSeverityLabel(profile.insomniaSeverity)}
            </span>
          </div>

          {/* PLATO */}
          <div className="rounded-xl border p-5 mb-10" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="font-bold mb-1" style={{ fontSize: "14px", color: "#1E40AF" }}>Sleep Quality & Daytime Impact</p>
            <p className="text-ink-muted mb-1" style={{ fontSize: "14px" }}>PLATO-11</p>
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

          {/* ── STEP 2: Where Can the Airway Narrow? ── */}
          <div className="flex items-center gap-3 pb-3 mb-5" style={{ borderBottom: "2px solid #15803D" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#15803D" }}>
              <span className="text-white font-bold" style={{ fontSize: "13px" }}>2</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Step 2: Where Can the Airway Narrow?</p>
              <p className="text-ink-muted" style={{ fontSize: "14px" }}>Top-Down Anatomy Self-Check — 4 zones evaluated</p>
            </div>
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#15803D" }} />
          </div>

          <div className="rounded-xl border p-5 mb-10" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
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

          {/* ── STEP 3: What Can Help? ── */}
          <div className="flex items-center gap-3 pb-3 mb-5" style={{ borderBottom: "2px solid #B91C1C" }}>
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
        </div>

        {/* ── YOUR MURPHY METHOD ASSIGNED PATHWAY ── */}
        <div className="print:break-after-page" style={{ backgroundColor: "var(--bg-card)", padding: "40px clamp(16px,5vw,48px)", marginBottom: "12px" }}>
          {/* Header box */}
          <div
            style={{
              borderRadius: "var(--radius-card)",
              padding: "24px 28px",
              marginBottom: "32px",
              backgroundColor: "#EFF6FF",
              border: "1px solid #BFDBFE",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 800,
                fontSize: "clamp(18px, 2.5vw, 26px)",
                color: "var(--text-ink)",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                marginBottom: "6px",
              }}
            >
              Your Murphy Method™ Assigned Pathway
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>
              Your personalized treatment pathway based on your assessment
            </p>
          </div>

          {/* Pathway title + short description */}
          <h3
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "clamp(20px, 2.5vw, 28px)",
              color: "var(--text-ink)",
              marginBottom: "10px",
            }}
          >
            {pathwayDef.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "16px",
              color: "var(--text-ink)",
              lineHeight: 1.55,
              marginBottom: "24px",
            }}
          >
            {pathwayDef.shortDescription}
          </p>

          {/* Educational summary with Key Concept / Your Next Step callouts */}
          <PathwaySummarySection pathwayDef={pathwayDef} />
        </div>

        {/* ── YOUR PERSONALIZED GUIDE ── */}
        <div className="print:break-after-page" style={{ backgroundColor: "var(--bg-card)", padding: "40px clamp(16px,5vw,48px)", marginBottom: "12px" }}>
          <div style={{ borderRadius: "var(--radius-card)", padding: "24px 28px", marginBottom: "24px", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "clamp(18px, 2.5vw, 26px)", color: "var(--text-ink)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "6px" }}>
              Your Personalized Guide
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>
              Pathway-specific recommendations and treatment options
            </p>
          </div>

          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--text-ink)", marginBottom: "12px" }}>
            What your results suggest
          </h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            {pc.whatResultsSuggest.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)", lineHeight: 1.65 }}>
                <span
                  className="flex-shrink-0"
                  style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--blue)", marginTop: "8px" }}
                />
                {s}
              </li>
            ))}
          </ul>

          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--text-ink)", marginBottom: "8px" }}>
            Why it matters
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "12px" }}>
            {pc.whyItMatters.intro}
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            {pc.whyItMatters.points.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.65 }}>
                <span
                  className="flex-shrink-0"
                  style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#475569", marginTop: "8px" }}
                />
                {p}
              </li>
            ))}
          </ul>

          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--text-ink)", marginBottom: "8px" }}>
            What usually works best
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "12px" }}>
            {pc.whatWorksBest.intro}
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {pc.whatWorksBest.options.map((o, i) => (
              <li key={i} className="flex items-start gap-2.5" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)", lineHeight: 1.65 }}>
                <span
                  className="flex-shrink-0"
                  style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#16A34A", marginTop: "8px" }}
                />
                {o}
              </li>
            ))}
          </ul>
        </div>

        {/* ── YOUR MURPHY METHOD NEXT STEPS ── */}
        <div style={{ backgroundColor: "var(--bg-card)", padding: "40px clamp(16px,5vw,48px)", marginBottom: "12px" }}>
          <div style={{ borderRadius: "var(--radius-card)", padding: "24px 28px", marginBottom: "24px", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "clamp(18px, 2.5vw, 26px)", color: "var(--text-ink)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "6px" }}>
              Your Murphy Method™ Next Steps
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>
              Actionable steps based on your assigned pathway
            </p>
          </div>

          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "24px" }}>
            {pc.nextSteps.intro}
          </p>

          {/* Pathway-specific next steps list */}
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "15px", color: "var(--text-ink)", marginBottom: "12px" }}>
            Recommended Next Steps — {pathwayDef.title}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
            {pc.nextSteps.steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-4"
                style={{ borderRadius: "12px", padding: "16px", backgroundColor: "var(--bg-page)" }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#DBEAFE" }}
                >
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "13px", color: "var(--blue)" }}>
                    {i + 1}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)", lineHeight: 1.65 }}>{step}</p>
              </div>
            ))}
          </div>

          {/* Find a Specialist */}
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "20px", color: "var(--text-ink)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "16px" }}>
              Find a Specialist
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {(PATHWAY_SPECIALISTS[pathway] ?? ["sleep"]).map((key) => {
                const s = SPECIALIST_RESOURCES[key];
                return (
                  <div
                    key={key}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid var(--border-soft)",
                      backgroundColor: "#fff",
                      padding: "16px",
                      display: "flex",
                      gap: "16px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "52px",
                        flexShrink: 0,
                        borderRadius: "8px",
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={s.logoUrl}
                        alt={s.abbr}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.style.display = "none";
                          const span = document.createElement("span");
                          span.textContent = s.abbr;
                          span.style.cssText = "font-family:var(--font-sans);font-weight:700;font-size:10px;color:#475569;text-align:center;line-height:1.3";
                          img.parentElement?.appendChild(span);
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px", color: "var(--text-ink)", marginBottom: "4px", lineHeight: 1.4 }}>
                        {s.title}
                      </p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "6px" }}>
                        {s.description}
                      </p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--blue)", wordBreak: "break-all" }}>
                        {s.url}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── BACK COVER: About + Disclaimer ── */}
        <div
          className="print:break-before-page"
          style={{ backgroundColor: "var(--bg-card)", padding: "40px clamp(16px,5vw,48px)", marginBottom: "12px" }}
        >
          {/* About The Murphy Method */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
              About The Murphy Method™
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)", lineHeight: 1.65 }}>
              The Murphy Method™ is a clinical system for understanding and treating snoring and obstructive sleep apnea, developed by Michael Murphy, MD, MPH. The Murphy Method is a simple, organized approach to understand both snoring and sleep apnea. Doctor Murphy uses this same method with every snoring and sleep apnea patient he sees in his office.
            </p>
          </div>

          {/* About Michael Murphy */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
              About Michael Murphy, MD, MPH
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-ink)", lineHeight: 1.65 }}>
              Dr. Murphy is a dual board-certified ENT surgeon and Sleep Medicine physician with over 20 years of experience treating snoring and sleep apnea. His rare combination of surgical and non-surgical expertise allows him to see the full picture of sleep-disordered breathing — not just one treatment option.
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "20px", marginBottom: "24px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "var(--text-ink)" }}>
              Take the assessment at <span style={{ color: "var(--blue)" }}>SleepCheckup.com</span>
            </p>
          </div>

          {/* Important Notice */}
          <div style={{ borderRadius: "var(--radius-card)", border: "1px solid #FED7AA", backgroundColor: "#FFF7ED", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", color: "#92400E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
              Important Notice
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#92400E", lineHeight: 1.6, margin: 0 }}>
              This report is generated from a self-administered questionnaire and is intended for educational purposes only. It does not constitute a medical diagnosis, clinical assessment, or treatment recommendation. The information in this report should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>

          {/* Copyright */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>© 2026 Murphy Method™. All rights reserved.</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>A service of Sleep Check Up, Inc.</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Murphy Method™ is a trademark of Sleep Check Up, Inc.</p>
          </div>
        </div>

        {/* Section 6: Print (screen only) */}
        <div
          className="print:hidden"
          style={{ backgroundColor: "var(--bg-card)", padding: "32px clamp(16px,5vw,48px)", marginBottom: "48px" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--text-ink)" }}>
                Print / Download
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>
                Save a PDF copy to bring to your doctor.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print Results
              </button>
              <Link href="/assessment/results" className="no-underline btn-secondary flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Results
              </Link>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", marginTop: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
            Email delivery is part of the full product — not available in this prototype.
          </p>
        </div>

      </div>
    </div>
  );
}

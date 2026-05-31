import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, ExternalLink, KeyRound } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { assignMurphyPathway, getPathwayDefinition } from "@/lib/pathways";
import { scoreStopBang, scoreIsi, scorePlato, scorePalm, scoreZones, scoreMedicalHistory, scoreAnatomy } from "@/lib/scoring";
import type { PatientProfile, MurphyPathwayId, AssessmentState, ZoneAnswers, PalmAnswers } from "@/lib/types";
import murphyPhoto from "@assets/Murphy-14_1765142967232.jpg";
import { PATHWAY_CONTENT } from "@/lib/pathway-content";
import { PALM_QUESTIONS } from "@/lib/questionnaires";

function getBmiLabel(bmi: number | null): string {
  if (!bmi) return "N/A";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obesity I";
  if (bmi < 40) return "Obesity II";
  return "Obesity III";
}

const STORAGE_KEY = "murphy_method_assessment";

function loadProfile(): { profile: PatientProfile; pathway: MurphyPathwayId; zoneAnswers: ZoneAnswers | null; palmAnswers: PalmAnswers | null; assessmentDate: string } | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const state = JSON.parse(saved) as AssessmentState;
    const { score: stopBangScore, risk: osaRisk } = scoreStopBang(state.stopBangAnswers);
    const { score: isiScore, severity: insomniaSeverity } = scoreIsi(state.isiAnswers);
    const plato = scorePlato(state.platoAnswers);
    const palm = scorePalm(state.palmAnswers);
    const zones = scoreZones(state.zoneAnswers);
    const medicalHistory = scoreMedicalHistory(state.medicalHistoryAnswers);
    const anatomy = scoreAnatomy(state.zoneAnswers);
    const profile: PatientProfile = {
      stopBangScore, osaRisk, isiScore, insomniaSeverity,
      plato, palm, zones, medicalHistory, anatomy,
      bmiValue: state.bmiData?.calculatedBmi ?? null,
      comorbidities: state.comorbidities || [],
      mainComplaint: state.mainComplaint || "",
    };
    const pathway = assignMurphyPathway(profile);
    const assessmentDate = state.assessmentDate
      ? new Date(state.assessmentDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    return { profile, pathway, zoneAnswers: state.zoneAnswers ?? null, palmAnswers: state.palmAnswers ?? null, assessmentDate };
  } catch {
    return null;
  }
}

// Build a flat list of { sectionName, text } for every positively-answered PALM question
function getPositivePalmItems(palmAnswers: PalmAnswers | null): { sectionName: string; text: string }[] {
  if (!palmAnswers) return [];
  const result: { sectionName: string; text: string }[] = [];
  for (const section of PALM_QUESTIONS) {
    const answers = (palmAnswers as Record<string, Record<string, boolean | string>>)[section.section];
    if (!answers) continue;
    for (const q of section.questions) {
      const ans = answers[q.fieldKey];
      if (ans === true || ans === "yes") {
        result.push({ sectionName: section.sectionName, text: q.text });
      }
    }
  }
  return result;
}


function ScoreCircle({ score, maxScore, label, color }: { score: number; maxScore: number; label: string; color: string }) {
  const pct = Math.round((score / maxScore) * 100);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#E5E7EB" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0F172A">{score}</text>
      </svg>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}

interface PathwayContentItem {
  id: string;
  pathwayId: string;
  contentType: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  displayOrder: number;
  label: string | null;
}

function renderInline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={i}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("__") && token.endsWith("__")) {
      return <u key={i}>{token.slice(2, -2)}</u>;
    }
    return token;
  });
}

export default function AssessmentReportPage() {
  const [data, setData] = useState<{ profile: PatientProfile; pathway: MurphyPathwayId; zoneAnswers: ZoneAnswers | null; palmAnswers: PalmAnswers | null; assessmentDate: string } | null>(null);
  const [error, setError] = useState(false);
  const [reportEmailSent, setReportEmailSent] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const result = loadProfile();
    if (!result) { setError(true); return; }
    setData(result);
  }, []);

  // Send report email once when report first loads (if email + data are available)
  useEffect(() => {
    if (!data || reportEmailSent) return;
    const email = localStorage.getItem("mm_screener_email");
    if (!email) return;
    const pDef = getPathwayDefinition(data.pathway);
    const pc = PATHWAY_CONTENT[data.pathway] || PATHWAY_CONTENT.H_complex;
    const prof = data.profile;
    const anat = prof.anatomy;
    setReportEmailSent(true);
    fetch("/api/assessments/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        pathwayName: pDef.title,
        pathwayLetter: pc.pathwayLetter,
        pathwayDescription: pDef.shortDescription,
        stopBangScore: prof.stopBangScore ?? 0,
        osaRisk: prof.osaRisk ?? "low",
        isiScore: prof.isiScore ?? 0,
        insomniaSeverity: prof.insomniaSeverity ?? "none",
        bmiValue: prof.bmiValue ?? null,
        bmiLabel: getBmiLabel(prof.bmiValue ?? null),
        assessmentDate: data.assessmentDate,
        anatomyTotal: anat?.totalScore ?? 0,
        anatomyZones: [
          { label: "Nose", score: anat?.noseScore ?? 0, max: 5, isPositive: anat?.noseIsPositive ?? false, answers: anat?.noseResponses?.answeredYes ?? [] },
          { label: "Palate & Tonsils", score: anat?.palateScore ?? 0, max: 3, isPositive: anat?.palateIsPositive ?? false, answers: anat?.palateResponses?.answeredYes ?? [] },
          { label: "Mandible & Tongue", score: anat?.mandibleScore ?? 0, max: 3, isPositive: anat?.mandibleIsPositive ?? false, answers: anat?.mandibleResponses?.answeredYes ?? [] },
          { label: "Neck", score: anat?.neckScore ?? 0, max: 3, isPositive: anat?.neckIsPositive ?? false, answers: anat?.neckResponses?.answeredYes ?? [] },
        ],
        palmResults: [
          { letter: "P", name: "Airway Narrowing", score: prof.palm?.pcrit?.score ?? 0, isPositive: prof.palm?.pcrit?.isPositive ?? false, questions: prof.palm?.pcrit?.positiveQuestions ?? [] },
          { letter: "A", name: "Arousal Threshold", score: prof.palm?.arousal?.score ?? 0, isPositive: prof.palm?.arousal?.isPositive ?? false, questions: prof.palm?.arousal?.positiveQuestions ?? [] },
          { letter: "L", name: "Loop Gain", score: prof.palm?.loopGain?.score ?? 0, isPositive: prof.palm?.loopGain?.isPositive ?? false, questions: prof.palm?.loopGain?.positiveQuestions ?? [] },
          { letter: "M", name: "Muscle Responsiveness", score: prof.palm?.muscle?.score ?? 0, isPositive: prof.palm?.muscle?.isPositive ?? false, questions: prof.palm?.muscle?.positiveQuestions ?? [] },
        ],
        medicalHistoryScore: prof.medicalHistory?.totalScore ?? 0,
        medicalHistoryConditions: prof.medicalHistory?.answeredYes ?? [],
        platoTotal: prof.plato?.totalScore ?? 0,
        platoSleepQuality: prof.plato?.sleepQualityRaw ?? 0,
        platoSectionA: prof.plato?.sectionAScore ?? 0,
        platoSectionB: prof.plato?.sectionBScore ?? 0,
        platoSectionC: prof.plato?.sectionCScore ?? 0,
        educationalSummary: pDef.educationalSummary,
        whatResultsSuggest: pc.whatResultsSuggest,
        whyItMattersIntro: pc.whyItMatters.intro,
        whyItMattersPts: pc.whyItMatters.points,
        whatWorksBestIntro: pc.whatWorksBest.intro,
        whatWorksBestOpts: pc.whatWorksBest.options,
        nextStepsIntro: pc.nextSteps.intro,
        nextStepsSteps: pc.nextSteps.steps,
      }),
    }).catch((err) => console.error("Report email error:", err));
  }, [data, reportEmailSent]);

  const { data: pathwayContentData } = useQuery<PathwayContentItem[]>({
    queryKey: ['/api/pathway-content', data?.pathway],
    enabled: !!data?.pathway,
  });

  const specialists = pathwayContentData?.filter(item => item.contentType === "specialist") ?? [];

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <p className="text-xl font-bold text-[#0F172A] mb-2">No assessment data found</p>
          <p className="text-gray-500 mb-6">Please complete the full assessment before viewing your report.</p>
          <Link href="/assessment">
            <Button style={{ backgroundColor: "#2563EB", color: "white" }}>Go to Assessment</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { profile, pathway, zoneAnswers, palmAnswers, assessmentDate } = data;
  const pathwayDef = getPathwayDefinition(pathway);
  const pathwayContent = PATHWAY_CONTENT[pathway] || PATHWAY_CONTENT.H_complex;

  const osaRiskLabel = profile.osaRisk === "high" ? "High" : profile.osaRisk === "intermediate" ? "Moderate" : "Low";
  const osaRiskColor = profile.osaRisk === "high" ? "#DC2626" : profile.osaRisk === "intermediate" ? "#D97706" : "#16A34A";

  const isiLabel = profile.insomniaSeverity === "severe" ? "Severe" : profile.insomniaSeverity === "moderate" ? "Moderate" : profile.insomniaSeverity === "subthreshold" ? "Subthreshold" : "None / Mild";
  const isiColor = profile.insomniaSeverity === "severe" ? "#DC2626" : profile.insomniaSeverity === "moderate" ? "#D97706" : profile.insomniaSeverity === "subthreshold" ? "#2563EB" : "#16A34A";

  const bmi = profile.bmiValue;
  const bmiLabel = !bmi ? "N/A" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : bmi < 35 ? "Obesity I" : bmi < 40 ? "Obesity II" : "Obesity III";
  const bmiColor = !bmi ? "#6B7280" : bmi < 25 ? "#16A34A" : bmi < 30 ? "#D97706" : "#DC2626";

  const anatomy = profile.anatomy;

  // Extract educational summary sections
  const summaryLines = pathwayDef.educationalSummary.split(/\n\n+/).filter(Boolean);
  const nextStepIdx = summaryLines.findIndex(l => l.includes("Your Next Step:"));
  const summaryBody = nextStepIdx >= 0 ? summaryLines.slice(0, nextStepIdx) : summaryLines;

  // Extract Key Concept
  const keyConceptIdx = summaryBody.findIndex(l => l.startsWith("Key Concept:"));
  const bodyParas = keyConceptIdx >= 0 ? summaryBody.filter((_, i) => i !== keyConceptIdx) : summaryBody;
  const keyConcept = keyConceptIdx >= 0 ? summaryBody[keyConceptIdx] : null;


  // Patient display name
  const patientName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Assessment Participant"
    : "Assessment Participant";

  // PALM scores
  const palmArousal = profile.palm?.arousal?.score ?? 0;
  const palmLoopGain = profile.palm?.loopGain?.score ?? 0;
  const palmMuscle = profile.palm?.muscle?.score ?? 0;

  // Positive answered questions for the PALM section
  const positivePalmItems = getPositivePalmItems(palmAnswers);

  return (
    <div className="print:m-0 print:p-0 bg-gray-100 min-h-screen">
      {/* Print controls */}
      <div className="print:hidden sticky top-16 z-40 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/assessment">
          <button type="button" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">For best results: save as PDF first, then print the PDF.</p>
          <Button
            onClick={() => window.print()}
            style={{ backgroundColor: "#2563EB", color: "white" }}
            className="gap-2"
            data-testid="button-print-report"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      <div className="max-w-[794px] mx-auto print:max-w-none">

        {/* ========== PAGE 1: COVER ========== */}
        <div
          className="report-page relative flex flex-col"
          style={{ backgroundColor: "#FFFFFF", pageBreakAfter: "always", breakAfter: "page" }}
          data-testid="report-page-cover"
        >
          {/* Primary focus: report title + pathway + patient info */}
          <div className="flex flex-col items-center px-12 pt-20 pb-16 text-center">
            {/* Report title */}
            <h1 className="text-[#0F172A] text-5xl font-extrabold leading-tight tracking-tight mb-7">
              Murphy Method™ Assessment Report
            </h1>

            {/* Pathway assignment */}
            <div className="w-full max-w-md mb-7">
              <div className="border border-blue-200 rounded-lg px-8 py-6" style={{ backgroundColor: "#DBEAFE" }}>
                <p className="text-[#1D4ED8] text-xs uppercase tracking-[0.15em] font-semibold mb-3">Your Assigned Pathway</p>
                <p className="text-[#0F172A] text-3xl font-bold leading-tight mb-1">{pathwayDef.title}</p>
                <p className="text-[#2563EB] text-sm font-medium leading-snug mt-2">{pathwayDef.shortDescription}</p>
              </div>
            </div>

            {/* Patient + date */}
            <div className="space-y-2">
              <p className="text-[#0F172A] text-xl font-semibold">{patientName}</p>
              <p className="text-gray-500 text-sm">Assessment Date: <span className="text-[#0F172A] font-medium">{assessmentDate}</span></p>
            </div>

            {/* Website CTA */}
            <div className="mt-7">
              <p className="text-[#2563EB] text-base font-semibold tracking-wide">sleepcheckup.com</p>
            </div>
          </div>

        </div>

        {/* ========== PAGE 2: YOUR RESULTS — 3 MURPHY METHOD STEPS ========== */}
        <div
          className="report-page bg-white min-h-[11in] flex flex-col"
          style={{ pageBreakAfter: "always", breakAfter: "page" }}
          data-testid="report-page-results"
        >
          <div className="flex-1 px-12 py-10">
            {/* Header */}
            <div className="bg-blue-50 border border-blue-200 text-[#0F172A] px-8 py-6 rounded mb-8">
              <h2 className="font-bold text-2xl tracking-wide uppercase">Your Results</h2>
              <p className="text-blue-600 text-base mt-1">Based on your Murphy Method™ assessment answers</p>
            </div>

            {/* ── STEP 1: HOW IS THE BREATHING AT NIGHT? ── */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base">How Is the Breathing at Night?</h3>
                  <p className="text-xs text-gray-500">Medical history, BMI, OSA risk, insomnia severity, and sleep quality scores</p>
                </div>
              </div>

              {/* Medical History — full width */}
              <div className="border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide mb-1">Medical History</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold" style={{ color: profile.medicalHistory?.totalScore > 0 ? "#D97706" : "#16A34A" }}>
                        {profile.medicalHistory?.totalScore ?? 0}
                      </span>
                      <span className="text-sm text-gray-400">/ 8</span>
                      <span className="ml-1 px-2 py-0.5 rounded text-xs font-semibold" style={{
                        backgroundColor: profile.medicalHistory?.totalScore > 0 ? "#FEF3C7" : "#DCFCE7",
                        color: profile.medicalHistory?.totalScore > 0 ? "#D97706" : "#16A34A",
                      }}>
                        {profile.medicalHistory?.totalScore > 0 ? `${profile.medicalHistory.totalScore} condition${profile.medicalHistory.totalScore > 1 ? "s" : ""} reported` : "No conditions reported"}
                      </span>
                    </div>
                  </div>
                  {profile.medicalHistory?.answeredYes?.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                      {profile.medicalHistory.answeredYes.map((condition) => (
                        <li key={condition}>{condition}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* BMI · STOP-BANG · ISI — 3-column grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* BMI */}
                <div className="border border-blue-200 rounded-lg p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center" style={{ backgroundColor: bmiColor + "20" }}>
                    <span className="text-xl font-bold" style={{ color: bmiColor }}>{bmi ? bmi.toFixed(1) : "—"}</span>
                  </div>
                  <p className="text-xs text-gray-500">kg/m²</p>
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide">Body Mass Index</p>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: bmiColor + "20", color: bmiColor }}>
                    {bmiLabel}
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {!bmi ? "BMI not calculated." : bmi >= 30 ? "BMI ≥30 is a significant OSA risk factor." : bmi >= 25 ? "Overweight BMI carries moderate elevated risk." : "BMI in normal range."}
                  </p>
                </div>

                {/* STOP-BANG */}
                <div className="border border-blue-200 rounded-lg p-4 flex flex-col items-center text-center gap-2">
                  <ScoreCircle score={profile.stopBangScore} maxScore={8} label="of 8" color={osaRiskColor} />
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide">STOP-BANG</p>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: osaRiskColor + "20", color: osaRiskColor }}>
                    {osaRiskLabel} OSA Risk
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {profile.osaRisk === "high" ? "Score ≥5 — sleep study strongly recommended." : profile.osaRisk === "intermediate" ? "Score 3–4 — clinical evaluation recommended." : "Score 0–2 — lower risk; evaluation still advisable."}
                  </p>
                </div>

                {/* ISI */}
                <div className="border border-blue-200 rounded-lg p-4 flex flex-col items-center text-center gap-2">
                  <ScoreCircle score={profile.isiScore} maxScore={28} label="of 28" color={isiColor} />
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide">Insomnia Index (ISI)</p>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: isiColor + "20", color: isiColor }}>
                    {isiLabel} Insomnia
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {profile.insomniaSeverity === "severe" ? "Score ≥22 — significant insomnia requiring treatment." : profile.insomniaSeverity === "moderate" ? "Score 15–21 — moderate insomnia; intervention recommended." : profile.insomniaSeverity === "subthreshold" ? "Score 8–14 — subthreshold insomnia; monitor and address." : "Score <8 — no clinically significant insomnia."}
                  </p>
                </div>
              </div>

              {/* PLATO-11 — full width */}
              <div className="border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide mb-1">PLATO-11 — Sleep Quality &amp; Daytime Impact</p>
                <p className="text-xs text-gray-500 italic mb-3">This Section describes your symptoms and sleep quality. It does not change your Murphy Method Pathway assignment.</p>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: "Total Score", value: profile.plato?.totalScore ?? 0, max: 44 },
                    { label: "Sleep Quality", value: profile.plato?.sleepQualityRaw ?? 0, max: 10 },
                    { label: "Section A", value: profile.plato?.sectionAScore ?? 0, max: 32 },
                    { label: "Section B", value: profile.plato?.sectionBScore ?? 0, max: 8 },
                    { label: "Section C", value: profile.plato?.sectionCScore ?? 0, max: 4 },
                  ].map(({ label, value, max }) => (
                    <div key={label} className="flex flex-col items-center text-center gap-1 bg-gray-50 rounded-lg p-3">
                      <span className="text-lg font-bold text-[#0F172A]">{value}</span>
                      <span className="text-xs text-gray-400">/ {max}</span>
                      <span className="text-xs text-gray-500 leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── STEP 2: WHERE CAN THE AIRWAY NARROW? ── */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#16A34A" }}>2</div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base">Where Can the Airway Narrow?</h3>
                  <p className="text-xs text-gray-500">Your four airway levels — evaluated from nose to neck</p>
                </div>
              </div>

              {/* Overall anatomy score */}
              <div className="border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-baseline gap-2">
                  <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide mr-2">Overall Score</p>
                  <span className="text-2xl font-bold" style={{ color: (anatomy?.totalScore ?? 0) > 0 ? "#C2410C" : "#16A34A" }}>
                    {anatomy?.totalScore ?? 0}
                  </span>
                  <span className="text-sm text-gray-400">/ 14</span>
                  <span className="ml-1 px-2 py-0.5 rounded text-xs font-semibold" style={{
                    backgroundColor: (anatomy?.totalScore ?? 0) > 0 ? "#FED7AA" : "#DCFCE7",
                    color: (anatomy?.totalScore ?? 0) > 0 ? "#C2410C" : "#16A34A",
                  }}>
                    {(anatomy?.totalScore ?? 0) > 0 ? `${anatomy.totalScore} finding${anatomy.totalScore > 1 ? "s" : ""}` : "No findings"}
                  </span>
                </div>
              </div>

              {/* Per-zone cards */}
              <div className="space-y-3 mb-4">
                {[
                  { label: "Nose", max: 5, score: anatomy?.noseScore ?? 0, isPositive: anatomy?.noseIsPositive, answers: anatomy?.noseResponses?.answeredYes ?? [] },
                  { label: "Palate & Tonsils", max: 3, score: anatomy?.palateScore ?? 0, isPositive: anatomy?.palateIsPositive, answers: anatomy?.palateResponses?.answeredYes ?? [] },
                  { label: "Mandible & Tongue", max: 3, score: anatomy?.mandibleScore ?? 0, isPositive: anatomy?.mandibleIsPositive, answers: anatomy?.mandibleResponses?.answeredYes ?? [] },
                  { label: "Neck", max: 3, score: anatomy?.neckScore ?? 0, isPositive: anatomy?.neckIsPositive, answers: anatomy?.neckResponses?.answeredYes ?? [] },
                ].map(({ label, max, score, isPositive, answers }) => (
                  <div
                    key={label}
                    className={`border rounded-lg p-4 ${isPositive ? "border-green-300 bg-green-50" : "border-green-200"}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide flex-1">{label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold" style={{ color: isPositive ? "#C2410C" : "#16A34A" }}>{score}</span>
                        <span className="text-xs text-gray-400">/ {max}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isPositive ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                        {isPositive ? "Flagged" : "Normal"}
                      </span>
                    </div>
                    {answers.length > 0 ? (
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                        {answers.map((a) => <li key={a}>{a}</li>)}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No findings reported.</p>
                    )}
                  </div>
                ))}
              </div>

            </div>

            {/* ── STEP 3: WHAT CAN HELP? ── */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#DC2626" }}>3</div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base">Understand the Overall Approach and how the PALM Classification helps.</h3>
                  <p className="text-xs text-gray-500">Your Murphy Method pathway assignment</p>
                </div>
              </div>

              {/* Treatment overview — context before PALM */}
              <p className="text-sm text-gray-600 mb-3">Treatment depends on where the blockage is and how serious the problem is.</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Non-Surgery Options */}
                <div className="rounded-lg p-4" style={{ backgroundColor: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                  <p className="text-sm font-bold mb-2" style={{ color: "#2563EB" }}>Non-Surgery Options</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• CPAP</li>
                    <li>• Oral appliance</li>
                    <li>• Other treatments</li>
                  </ul>
                </div>
                {/* Procedure Options */}
                <div className="rounded-lg p-4" style={{ backgroundColor: "#FFF1F2", border: "1px solid #FECDD3" }}>
                  <p className="text-sm font-bold mb-2" style={{ color: "#DC2626" }}>Procedure Options</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Nose procedures</li>
                    <li>• Palate / tonsil procedures</li>
                    <li>• Jaw / tongue procedures</li>
                  </ul>
                </div>
              </div>
              {/* Simple idea callout */}
              <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-bold">Simple idea:</span> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.
                </p>
              </div>

              {/* PALM Classification */}
              <div className="border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-[#DC2626] uppercase tracking-wide mb-1">PALM Classification</p>
                <p className="text-xs text-gray-500 italic mb-4">Understand underlying factors that may contribute to your sleep apnea</p>
                <div className="space-y-3">
                  {[
                    {
                      letter: "P",
                      name: "Airway Narrowing",
                      section: profile.palm?.pcrit,
                    },
                    {
                      letter: "A",
                      name: "Arousal Threshold",
                      section: profile.palm?.arousal,
                    },
                    {
                      letter: "L",
                      name: "Loop Gain",
                      section: profile.palm?.loopGain,
                    },
                    {
                      letter: "M",
                      name: "Muscle Responsiveness",
                      section: profile.palm?.muscle,
                    },
                  ].map(({ letter, name, section }) => {
                    const score = section?.score ?? 0;
                    const isPositive = section?.isPositive ?? false;
                    const questions = section?.positiveQuestions ?? [];
                    return (
                      <div key={letter} className={`border rounded-lg p-3 ${isPositive ? "border-red-200 bg-red-50" : "border-red-100"}`}>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="w-6 h-6 rounded-full bg-[#DC2626] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{letter}</span>
                          <p className="text-xs font-semibold text-[#DC2626] flex-1">{name}</p>
                          <span className="text-xs font-semibold text-gray-600">{score} Yes</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isPositive ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                            {isPositive ? "Positive" : "Negative"}
                          </span>
                        </div>
                        {questions.length > 0 ? (
                          <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5 ml-9">
                            {questions.map((q) => <li key={q}>{q}</li>)}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-400 italic ml-9">No positive findings.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
          <div className="px-12 pb-4 flex justify-between items-center">
            <p className="text-gray-300 text-xs">sleepcheckup.com</p>
            <p className="text-gray-300 text-xs">Page 2</p>
          </div>
        </div>

        {/* ========== PAGE 3: PATHWAY EDUCATIONAL SUMMARY ========== */}
        <div
          className="report-page bg-white min-h-[11in] flex flex-col"
          style={{ pageBreakAfter: "always", breakAfter: "page" }}
          data-testid="report-page-pathway-summary"
        >
          <div className="flex-1 px-12 py-10">
            {/* Universal pathway section header */}
            <div className="bg-blue-50 border border-blue-200 text-[#0F172A] px-8 py-6 rounded mb-8">
              <h2 className="font-bold text-2xl tracking-wide uppercase">Your Murphy Method Assigned Pathway</h2>
              <p className="text-gray-500 text-base mt-1">Your personalized treatment pathway based on your assessment</p>
            </div>

            {/* Pathway title header */}
            <div className="mb-6">
              <h2 className="font-bold text-[#0F172A] text-2xl leading-tight">{pathwayDef.title}</h2>
              <p className="text-gray-700 text-base font-semibold mt-2 leading-relaxed">{pathwayDef.shortDescription}</p>
            </div>

            {/* Key Concept box */}
            {keyConcept && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8">
                <div className="flex items-center gap-1.5 mb-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#2563EB]" />
                  <p className="text-[#2563EB] text-xs uppercase tracking-widest font-semibold">Key Concept</p>
                </div>
                <p className="text-sm leading-relaxed text-[#0F172A]">{keyConcept.replace("Key Concept:", "").trim()}</p>
              </div>
            )}

            {/* Educational body paragraphs */}
            <div className="space-y-4">
              {bodyParas.map((para, i) => {
                // Handle bullet lists in Pathway G
                if (para.includes("\n•")) {
                  const [intro, ...bullets] = para.split("\n•");
                  return (
                    <div key={i}>
                      {intro && <p className="text-gray-700 text-sm leading-relaxed mb-2">{intro.trim()}</p>}
                      <ul className="space-y-1.5 ml-2">
                        {bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{b.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return <p key={i} className="text-gray-700 text-sm leading-relaxed">{renderInline(para)}</p>;
              })}
            </div>
          </div>
          <div className="px-12 pb-4 flex justify-between items-center">
            <p className="text-gray-300 text-xs">sleepcheckup.com</p>
            <p className="text-gray-300 text-xs">Page 3</p>
          </div>
        </div>

        {/* ========== PAGE 4: PATHWAY SPECIFIC CONTENT ========== */}
        <div
          className="report-page bg-white min-h-[11in] flex flex-col"
          style={{ pageBreakAfter: "always", breakAfter: "page" }}
          data-testid="report-page-pathway-content"
        >
          <div className="flex-1 px-12 py-10 space-y-8">
            {/* Header */}
            <div className="bg-blue-50 border border-blue-200 text-[#0F172A] px-8 py-6 rounded">
              <h2 className="font-bold text-2xl tracking-wide uppercase">Your Personalized Guide</h2>
            </div>

            {/* 1. What Your Results Suggest */}
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wide mb-3">
                What Your Results Suggest
              </h3>
              <div className="space-y-2">
                {pathwayContent.whatResultsSuggest.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#475569] mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Why This Matters */}
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wide mb-3">
                Why This Matters for Your Health
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{pathwayContent.whyItMatters.intro}</p>
              <div className="space-y-2">
                {pathwayContent.whyItMatters.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className="w-2 h-2 rounded-full bg-[#475569] mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. What Usually Works Best */}
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wide mb-3">
                What Usually Works Best for People in This Pathway
              </h3>
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <p className="text-[#334155] text-sm leading-relaxed mb-3">{pathwayContent.whatWorksBest.intro}</p>
                <div className="space-y-2">
                  {pathwayContent.whatWorksBest.options.map((item, i) => (
                    <div key={i} className="flex items-start gap-2" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                      <div className="w-2 h-2 rounded-full bg-[#475569] mt-1.5 flex-shrink-0" />
                      <p className="text-sm text-[#334155]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="px-12 pb-4 flex justify-between items-center">
            <p className="text-gray-300 text-xs">sleepcheckup.com</p>
            <p className="text-gray-300 text-xs">Page 4</p>
          </div>
        </div>

        {/* ========== PAGE 5: NEXT STEPS + RESOURCES ========== */}
        <div
          className="report-page bg-white min-h-[11in] flex flex-col"
          style={{ pageBreakAfter: "always", breakAfter: "page" }}
          data-testid="report-page-next-steps"
        >
          <div className="flex-1 px-12 py-10 space-y-8">
            {/* 4. Your Murphy Method Next Steps */}
            <div className="rounded-lg overflow-hidden border border-blue-300">
              {/* Section header bar */}
              <div className="bg-[#2563EB] px-6 py-4">
                <p className="text-blue-200 text-xs uppercase tracking-widest font-semibold mb-0.5">Action Plan</p>
                <h3 className="font-bold text-white text-lg leading-tight">
                  Your Murphy Method™ Next Steps
                </h3>
              </div>
              {/* Content */}
              <div className="bg-blue-50 px-6 py-5">
                <p className="text-blue-900 text-sm leading-relaxed mb-4 font-medium">{pathwayContent.nextSteps.intro}</p>
                <div className="space-y-3">
                  {pathwayContent.nextSteps.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                      <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-[#0F172A] leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Find a Specialist */}
            {specialists.length > 0 && (
              <div>
                <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-wide mb-3">
                  Find a Specialist
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {specialists.map((s) => (
                    <div key={s.id} className="border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          alt={s.title}
                          className="w-10 h-10 object-contain flex-shrink-0 rounded"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                          <ExternalLink className="w-4 h-4 text-[#2563EB]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0F172A] text-xs leading-snug mb-0.5">{s.title}</p>
                        <p className="text-gray-500 text-xs leading-relaxed mb-1">{s.description}</p>
                        <p className="text-[#2563EB] text-xs font-medium truncate">{s.url}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
          <div className="px-12 pb-4 flex justify-between items-center">
            <p className="text-gray-300 text-xs">sleepcheckup.com</p>
            <p className="text-gray-300 text-xs">Page 5</p>
          </div>
        </div>

        {/* ========== BACK COVER ========== */}
        <div
          className="report-page relative min-h-[11in] flex flex-col bg-white"
          data-testid="report-page-backcover"
        >
          <div className="flex-1 px-12 py-12 space-y-10">
            <div>
              <h3 className="text-[#2563EB] text-xs uppercase tracking-widest font-semibold mb-3">About the Murphy Method™</h3>
              <p className="text-[#0F172A] text-sm leading-relaxed">
                The Murphy Method™ is a clinical system for understanding and treating snoring and obstructive sleep apnea, developed by Michael Murphy, MD, MPH. The Murphy Method is a simple, organized approach to understand both snoring and sleep apnea. Doctor Murphy uses this same method with every snoring and sleep apnea patient he sees in his office.              </p>
            </div>

            <div>
              <h3 className="text-[#2563EB] text-xs uppercase tracking-widest font-semibold mb-3">About Michael Murphy, MD, MPH</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <img src={murphyPhoto} alt="Michael Murphy, MD, MPH" className="w-full h-full object-cover object-top" />
                </div>
                <p className="text-[#0F172A] text-sm leading-relaxed">
                  Dr. Murphy is a dual board-certified ENT surgeon and Sleep Medicine physician with over 20 years of experience treating snoring and sleep apnea. His rare combination of surgical and non-surgical expertise allows him to see the full picture of sleep-disordered breathing — not just one treatment option.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-[#0F172A] text-sm font-semibold">Take the assessment at <span className="text-[#2563EB]">SleepCheckup.com</span></p>
            </div>

          </div>

          <div className="px-12 pb-10 space-y-6">
            <div className="border border-orange-200 rounded-lg p-4" style={{ backgroundColor: "#FFF7ED" }}>
              <p className="text-orange-700 text-xs font-semibold uppercase tracking-wide mb-1">Important Notice</p>
              <p className="text-orange-700 text-xs leading-relaxed">
                This report is generated from a self-administered questionnaire and is intended for educational purposes only. It does not constitute a medical diagnosis, clinical assessment, or treatment recommendation. The information in this report should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </div>
            <div className="text-gray-400 text-xs space-y-0.5">
              <p>© 2026 Murphy Method™. All rights reserved.</p>
              <p>A service of Sleep Check Up, Inc.</p>
              <p>Murphy Method™ is a trademark of Sleep Check Up, Inc.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .print\\:hidden { display: none !important; }
          .report-page { page-break-after: always; break-after: page; }
          .report-page:last-child { page-break-after: avoid; break-after: avoid; }
        }
        @page {
          size: letter;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

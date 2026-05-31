import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, Mail } from "lucide-react";
import { Link } from "wouter";

function ScoreCircle({ score, maxScore, label, color }: { score: number; maxScore: number; label: string; color: string }) {
  const pct = Math.round((score / maxScore) * 100);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#E5E7EB" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 36 36)" />
        <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0F172A">{score}</text>
      </svg>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}

function renderInline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**")) return <strong key={i}>{token.slice(2, -2)}</strong>;
    if (token.startsWith("__") && token.endsWith("__")) return <u key={i}>{token.slice(2, -2)}</u>;
    return token;
  });
}

function parseEducationalSummary(raw: string): { keyConcept: string | null; bodyParas: string[] } {
  const lines = raw.split(/\n\n+/).filter(Boolean);
  const nextStepIdx = lines.findIndex(l => l.includes("Your Next Step:"));
  const summaryBody = nextStepIdx >= 0 ? lines.slice(0, nextStepIdx) : lines;
  const keyConceptIdx = summaryBody.findIndex(l => l.startsWith("Key Concept:"));
  const bodyParas = keyConceptIdx >= 0 ? summaryBody.filter((_, i) => i !== keyConceptIdx) : summaryBody;
  const keyConcept = keyConceptIdx >= 0 ? summaryBody[keyConceptIdx].replace("Key Concept:", "").trim() : null;
  return { keyConcept, bodyParas };
}

interface Zone { label: string; score: number; max: number; isPositive: boolean; answers: string[]; }
interface PalmItem { letter: string; name: string; score: number; isPositive: boolean; questions: string[]; }

interface ReportData {
  pathwayName: string;
  pathwayDescription: string;
  stopBangScore: number;
  osaRisk: string;
  isiScore?: number;
  insomniaSeverity?: string;
  bmiValue?: number | null;
  bmiLabel?: string;
  assessmentDate?: string;
  medicalHistoryScore?: number;
  medicalHistoryConditions?: string[];
  platoTotal?: number;
  platoSleepQuality?: number;
  platoSectionA?: number;
  platoSectionB?: number;
  platoSectionC?: number;
  anatomyTotal?: number;
  anatomyZones?: Zone[];
  palmResults?: PalmItem[];
  educationalSummary?: string;
  whatResultsSuggest?: string[];
  whyItMattersIntro?: string;
  whyItMattersPts?: string[];
  whatWorksBestIntro?: string;
  whatWorksBestOpts?: string[];
  nextStepsIntro?: string;
  nextStepsSteps?: string[];
}

export default function ReportTokenPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const { data: apiResult, isLoading, isError } = useQuery<{ reportData: ReportData; pathwayName: string; createdAt: string }>({
    queryKey: ["/api/report", token],
    queryFn: async () => {
      const res = await fetch(`/api/report/${token}`);
      if (!res.ok) throw new Error("Report not found");
      return res.json();
    },
    enabled: !!token,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (isError || !apiResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <p className="text-xl font-bold text-[#0F172A] mb-2">Report not found</p>
          <p className="text-gray-500 mb-6">This link may be invalid or the report may no longer exist.</p>
          <Link href="/">
            <Button style={{ backgroundColor: "#2563EB", color: "white" }}>Go to SleepCheckup.com</Button>
          </Link>
        </div>
      </div>
    );
  }

  const p = apiResult.reportData;
  const osaRiskLabel = p.osaRisk === "high" ? "High" : p.osaRisk === "intermediate" ? "Moderate" : "Low";
  const osaRiskColor = p.osaRisk === "high" ? "#DC2626" : p.osaRisk === "intermediate" ? "#D97706" : "#16A34A";
  const isiScore = p.isiScore ?? 0;
  const isiLabel = p.insomniaSeverity === "severe" ? "Severe" : p.insomniaSeverity === "moderate" ? "Moderate" : p.insomniaSeverity === "subthreshold" ? "Subthreshold" : "None / Mild";
  const isiColor = p.insomniaSeverity === "severe" ? "#DC2626" : p.insomniaSeverity === "moderate" ? "#D97706" : p.insomniaSeverity === "subthreshold" ? "#2563EB" : "#16A34A";
  const bmi = p.bmiValue ?? null;
  const bmiLabel = p.bmiLabel ?? (bmi == null ? "N/A" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : bmi < 35 ? "Obesity I" : bmi < 40 ? "Obesity II" : "Obesity III");
  const bmiColor = bmi == null ? "#6B7280" : bmi < 25 ? "#16A34A" : bmi < 30 ? "#D97706" : "#DC2626";
  const medScore = p.medicalHistoryScore ?? 0;
  const medColor = medScore > 0 ? "#D97706" : "#16A34A";
  const anatomy = p.anatomyTotal ?? 0;
  const anatomyColor = anatomy > 0 ? "#C2410C" : "#16A34A";
  const zones: Zone[] = p.anatomyZones ?? [];
  const palm: PalmItem[] = p.palmResults ?? [];
  const { keyConcept, bodyParas } = parseEducationalSummary(p.educationalSummary ?? "");

  return (
    <div className="print:m-0 print:p-0 bg-gray-100 min-h-screen">
      {/* Toolbar */}
      <div className="print:hidden sticky top-16 z-40 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/">
          <button type="button" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            SleepCheckup.com
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500 hidden sm:block">This link is permanent — bookmark it to return anytime.</p>
          <Button
            onClick={() => window.print()}
            style={{ backgroundColor: "#2563EB", color: "white" }}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      <div className="max-w-[794px] mx-auto print:max-w-none">

        {/* PAGE 1: COVER */}
        <div className="report-page relative flex flex-col bg-white" style={{ pageBreakAfter: "always", breakAfter: "page" }}>
          <div className="flex flex-col items-center px-12 pt-20 pb-16 text-center">
            <h1 className="text-[#0F172A] text-5xl font-extrabold leading-tight tracking-tight mb-7">
              Murphy Method™ Assessment Report
            </h1>
            <div className="w-full max-w-md mb-7">
              <div className="border border-blue-200 rounded-lg px-8 py-6" style={{ backgroundColor: "#DBEAFE" }}>
                <p className="text-[#1D4ED8] text-xs uppercase tracking-[0.15em] font-semibold mb-3">Your Assigned Pathway</p>
                <p className="text-[#0F172A] text-3xl font-bold leading-tight mb-1">{p.pathwayName}</p>
                <p className="text-[#2563EB] text-sm font-medium leading-snug mt-2">{p.pathwayDescription}</p>
              </div>
            </div>
            <div className="space-y-2 mb-7">
              <p className="text-[#0F172A] text-xl font-semibold">Assessment Participant</p>
              <p className="text-gray-500 text-sm">Assessment Date: <span className="text-[#0F172A] font-medium">{p.assessmentDate ?? "—"}</span></p>
            </div>
            <p className="text-[#2563EB] text-base font-semibold tracking-wide">sleepcheckup.com</p>
          </div>

          {/* No account notice */}
          <div className="print:hidden mx-12 mb-10 border border-blue-200 rounded-lg p-4 bg-blue-50 flex items-start gap-3">
            <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>This link is permanent.</strong> Your report is saved here — no account required. Bookmark this page or return to this email link anytime.
            </p>
          </div>
        </div>

        {/* PAGE 2: YOUR RESULTS */}
        <div className="report-page bg-white min-h-[11in] flex flex-col" style={{ pageBreakAfter: "always", breakAfter: "page" }}>
          <div className="flex-1 px-12 py-10">
            <div className="bg-blue-50 border border-blue-200 text-[#0F172A] px-8 py-6 rounded mb-8">
              <h2 className="font-bold text-2xl tracking-wide uppercase">Your Results</h2>
              <p className="text-blue-600 text-base mt-1">Based on your Murphy Method™ assessment answers</p>
            </div>

            {/* STEP 1 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base">How Is the Breathing at Night?</h3>
                  <p className="text-xs text-gray-500">Medical history, BMI, OSA risk, insomnia severity, and sleep quality scores</p>
                </div>
              </div>

              {/* Medical History */}
              <div className="border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide mb-1">Medical History</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold" style={{ color: medColor }}>{medScore}</span>
                      <span className="text-sm text-gray-400">/ 8</span>
                      <span className="ml-1 px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: medScore > 0 ? "#FEF3C7" : "#DCFCE7", color: medColor }}>
                        {medScore > 0 ? `${medScore} condition${medScore > 1 ? "s" : ""} reported` : "No conditions reported"}
                      </span>
                    </div>
                  </div>
                  {(p.medicalHistoryConditions ?? []).length > 0 && (
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                      {(p.medicalHistoryConditions ?? []).map(c => <li key={c}>{c}</li>)}
                    </ul>
                  )}
                </div>
              </div>

              {/* BMI · STOP-BANG · ISI */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="border border-blue-200 rounded-lg p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center" style={{ backgroundColor: bmiColor + "20" }}>
                    <span className="text-xl font-bold" style={{ color: bmiColor }}>{bmi ? bmi.toFixed(1) : "—"}</span>
                  </div>
                  <p className="text-xs text-gray-500">kg/m²</p>
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide">Body Mass Index</p>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: bmiColor + "20", color: bmiColor }}>{bmiLabel}</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {!bmi ? "BMI not calculated." : bmi >= 30 ? "BMI ≥30 is a significant OSA risk factor." : bmi >= 25 ? "Overweight BMI carries moderate elevated risk." : "BMI in normal range."}
                  </p>
                </div>
                <div className="border border-blue-200 rounded-lg p-4 flex flex-col items-center text-center gap-2">
                  <ScoreCircle score={p.stopBangScore} maxScore={8} label="of 8" color={osaRiskColor} />
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide">STOP-BANG</p>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: osaRiskColor + "20", color: osaRiskColor }}>{osaRiskLabel} OSA Risk</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {p.osaRisk === "high" ? "Score ≥5 — sleep study strongly recommended." : p.osaRisk === "intermediate" ? "Score 3–4 — clinical evaluation recommended." : "Score 0–2 — lower risk; evaluation still advisable."}
                  </p>
                </div>
                <div className="border border-blue-200 rounded-lg p-4 flex flex-col items-center text-center gap-2">
                  <ScoreCircle score={isiScore} maxScore={28} label="of 28" color={isiColor} />
                  <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide">Insomnia Index (ISI)</p>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: isiColor + "20", color: isiColor }}>{isiLabel} Insomnia</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {p.insomniaSeverity === "severe" ? "Score ≥22 — significant insomnia requiring treatment." : p.insomniaSeverity === "moderate" ? "Score 15–21 — moderate insomnia; intervention recommended." : p.insomniaSeverity === "subthreshold" ? "Score 8–14 — subthreshold insomnia; monitor and address." : "Score <8 — no clinically significant insomnia."}
                  </p>
                </div>
              </div>

              {/* PLATO-11 */}
              <div className="border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide mb-1">PLATO-11 — Sleep Quality &amp; Daytime Impact</p>
                <p className="text-xs text-gray-500 italic mb-3">This section describes your symptoms and sleep quality. It does not change your Murphy Method Pathway assignment.</p>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: "Total Score", value: p.platoTotal ?? 0, max: 44 },
                    { label: "Sleep Quality", value: p.platoSleepQuality ?? 0, max: 10 },
                    { label: "Section A", value: p.platoSectionA ?? 0, max: 32 },
                    { label: "Section B", value: p.platoSectionB ?? 0, max: 8 },
                    { label: "Section C", value: p.platoSectionC ?? 0, max: 4 },
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

            {/* STEP 2 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#16A34A" }}>2</div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base">Where Can the Airway Narrow?</h3>
                  <p className="text-xs text-gray-500">Your four airway levels — evaluated from nose to neck</p>
                </div>
              </div>
              <div className="border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-baseline gap-2">
                  <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide mr-2">Overall Score</p>
                  <span className="text-2xl font-bold" style={{ color: anatomyColor }}>{anatomy}</span>
                  <span className="text-sm text-gray-400">/ 14</span>
                  <span className="ml-1 px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: anatomy > 0 ? "#FED7AA" : "#DCFCE7", color: anatomyColor }}>
                    {anatomy > 0 ? `${anatomy} finding${anatomy > 1 ? "s" : ""}` : "No findings"}
                  </span>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {zones.map(z => (
                  <div key={z.label} className={`border rounded-lg p-4 ${z.isPositive ? "border-green-300 bg-green-50" : "border-green-200"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide flex-1">{z.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold" style={{ color: z.isPositive ? "#C2410C" : "#16A34A" }}>{z.score}</span>
                        <span className="text-xs text-gray-400">/ {z.max}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${z.isPositive ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                        {z.isPositive ? "Flagged" : "Normal"}
                      </span>
                    </div>
                    {z.answers.length > 0
                      ? <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">{z.answers.map(a => <li key={a}>{a}</li>)}</ul>
                      : <p className="text-xs text-gray-400 italic">No findings reported.</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 3 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#DC2626" }}>3</div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base">Understand the Overall Approach and how the PALM Classification helps.</h3>
                  <p className="text-xs text-gray-500">Your Murphy Method pathway assignment</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">Treatment depends on where the blockage is and how serious the problem is.</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg p-4" style={{ backgroundColor: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                  <p className="text-sm font-bold mb-2" style={{ color: "#2563EB" }}>Non-Surgery Options</p>
                  <ul className="text-sm text-gray-700 space-y-1"><li>• CPAP</li><li>• Oral appliance</li><li>• Other treatments</li></ul>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: "#FFF1F2", border: "1px solid #FECDD3" }}>
                  <p className="text-sm font-bold mb-2" style={{ color: "#DC2626" }}>Procedure Options</p>
                  <ul className="text-sm text-gray-700 space-y-1"><li>• Nose procedures</li><li>• Palate / tonsil procedures</li><li>• Jaw / tongue procedures</li></ul>
                </div>
              </div>
              <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-bold">Simple idea:</span> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.
                </p>
              </div>
              <div className="border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-[#DC2626] uppercase tracking-wide mb-1">PALM Classification</p>
                <p className="text-xs text-gray-500 italic mb-4">Understand underlying factors that may contribute to your sleep apnea</p>
                <div className="space-y-3">
                  {palm.map(item => (
                    <div key={item.letter} className={`border rounded-lg p-3 ${item.isPositive ? "border-red-200 bg-red-50" : "border-red-100"}`}>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="w-6 h-6 rounded-full bg-[#DC2626] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.letter}</span>
                        <p className="text-xs font-semibold text-[#DC2626] flex-1">{item.name}</p>
                        <span className="text-xs font-semibold text-gray-600">{item.score} Yes</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.isPositive ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                          {item.isPositive ? "Positive" : "Negative"}
                        </span>
                      </div>
                      {item.questions.length > 0
                        ? <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5 ml-9">{item.questions.map(q => <li key={q}>{q}</li>)}</ul>
                        : <p className="text-xs text-gray-400 italic ml-9">No positive findings.</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="px-12 pb-4 flex justify-between items-center">
            <p className="text-gray-300 text-xs">sleepcheckup.com</p>
            <p className="text-gray-300 text-xs">Page 2</p>
          </div>
        </div>

        {/* PAGE 3: PATHWAY SUMMARY */}
        <div className="report-page bg-white min-h-[11in] flex flex-col" style={{ pageBreakAfter: "always", breakAfter: "page" }}>
          <div className="flex-1 px-12 py-10">
            <div className="bg-blue-50 border border-blue-200 text-[#0F172A] px-8 py-6 rounded mb-8">
              <h2 className="font-bold text-2xl tracking-wide uppercase">Your Murphy Method Assigned Pathway</h2>
              <p className="text-gray-500 text-base mt-1">Your personalized treatment pathway based on your assessment</p>
            </div>
            <div className="mb-6">
              <h2 className="font-bold text-[#0F172A] text-2xl leading-tight">{p.pathwayName}</h2>
              <p className="text-gray-700 text-base font-semibold mt-2 leading-relaxed">{p.pathwayDescription}</p>
            </div>
            {keyConcept && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8">
                <p className="text-[#2563EB] text-xs uppercase tracking-widest font-semibold mb-2">Key Concept</p>
                <p className="text-sm leading-relaxed text-[#0F172A]">{keyConcept}</p>
              </div>
            )}
            <div className="space-y-4">
              {bodyParas.map((para, i) => {
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

        {/* PAGE 4: PERSONALIZED GUIDE */}
        <div className="report-page bg-white min-h-[11in] flex flex-col" style={{ pageBreakAfter: "always", breakAfter: "page" }}>
          <div className="flex-1 px-12 py-10 space-y-8">
            <div className="bg-blue-50 border border-blue-200 text-[#0F172A] px-8 py-6 rounded">
              <h2 className="font-bold text-2xl tracking-wide uppercase">Your Personalized Guide</h2>
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wide mb-3">What Your Results Suggest</h3>
              <div className="space-y-2">
                {(p.whatResultsSuggest ?? []).map((pt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#475569] mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{pt}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wide mb-3">Why This Matters for Your Health</h3>
              {p.whyItMattersIntro && <p className="text-gray-600 text-sm leading-relaxed mb-3">{p.whyItMattersIntro}</p>}
              <div className="space-y-2">
                {(p.whyItMattersPts ?? []).map((pt, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className="w-2 h-2 rounded-full bg-[#475569] mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{pt}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wide mb-3">What Usually Works Best for People in This Pathway</h3>
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                {p.whatWorksBestIntro && <p className="text-[#334155] text-sm leading-relaxed mb-3">{p.whatWorksBestIntro}</p>}
                <div className="space-y-2">
                  {(p.whatWorksBestOpts ?? []).map((item, i) => (
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

        {/* PAGE 5: NEXT STEPS */}
        <div className="report-page bg-white min-h-[11in] flex flex-col" style={{ pageBreakAfter: "always", breakAfter: "page" }}>
          <div className="flex-1 px-12 py-10 space-y-8">
            <div className="rounded-lg overflow-hidden border border-blue-300">
              <div className="bg-[#2563EB] px-6 py-4">
                <p className="text-blue-200 text-xs uppercase tracking-widest font-semibold mb-0.5">Action Plan</p>
                <h3 className="font-bold text-white text-lg leading-tight">Your Murphy Method™ Next Steps</h3>
              </div>
              <div className="bg-blue-50 px-6 py-5">
                {p.nextStepsIntro && <p className="text-blue-900 text-sm leading-relaxed mb-4 font-medium">{p.nextStepsIntro}</p>}
                <div className="space-y-3">
                  {(p.nextStepsSteps ?? []).map((step, i) => (
                    <div key={i} className="flex items-start gap-3" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                      <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-[#0F172A] leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="px-12 pb-4 flex justify-between items-center">
            <p className="text-gray-300 text-xs">sleepcheckup.com</p>
            <p className="text-gray-300 text-xs">Page 5</p>
          </div>
        </div>

        {/* BACK COVER */}
        <div className="report-page relative min-h-[11in] flex flex-col bg-white">
          <div className="flex-1 px-12 py-12 space-y-10">
            <div>
              <h3 className="text-[#2563EB] text-xs uppercase tracking-widest font-semibold mb-3">About the Murphy Method™</h3>
              <p className="text-[#0F172A] text-sm leading-relaxed">
                The Murphy Method™ is a clinical system for understanding and treating snoring and obstructive sleep apnea, developed by Michael Murphy, MD, MPH. The Murphy Method is a simple, organized approach to understand both snoring and sleep apnea. Doctor Murphy uses this same method with every snoring and sleep apnea patient he sees in his office.
              </p>
            </div>
            <div>
              <h3 className="text-[#2563EB] text-xs uppercase tracking-widest font-semibold mb-3">About Michael Murphy, MD, MPH</h3>
              <p className="text-[#0F172A] text-sm leading-relaxed">
                Dr. Murphy is a dual board-certified ENT surgeon and Sleep Medicine physician with over 20 years of experience treating snoring and sleep apnea. His rare combination of surgical and non-surgical expertise allows him to see the full picture of sleep-disordered breathing — not just one treatment option.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-8">
              <p className="text-[#0F172A] text-sm font-semibold">Take the assessment at <span className="text-[#2563EB]">SleepCheckup.com</span></p>
            </div>
          </div>
          <div className="px-12 pb-10 space-y-6">
            <div className="border border-orange-200 rounded-lg p-4" style={{ backgroundColor: "#FFF7ED" }}>
              <p className="text-orange-700 text-xs font-semibold uppercase tracking-wide mb-1">Important Notice</p>
              <p className="text-orange-700 text-xs leading-relaxed">
                This report is generated from a self-administered questionnaire and is intended for educational purposes only. It does not constitute a medical diagnosis, clinical assessment, or treatment recommendation. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
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
        @page { size: letter; margin: 0; }
      `}</style>
    </div>
  );
}

import puppeteer from "puppeteer-core";

const CHROMIUM_PATH = "/nix/store/0n9rl5l9syy808xi9bk4f6dhnfrvhkww-playwright-browsers-chromium/chromium-1080/chrome-linux/chrome";

interface Zone {
  label: string;
  score: number;
  max: number;
  isPositive: boolean;
  answers: string[];
}

interface PalmItem {
  letter: string;
  name: string;
  score: number;
  isPositive: boolean;
  questions: string[];
}

interface ReportParams {
  email?: string;
  firstName?: string;
  pathwayName: string;
  pathwayLetter?: string;
  pathwayDescription: string;
  stopBangScore: number;
  osaRisk: string;
  isiScore?: number;
  insomniaSeverity?: string;
  bmiValue?: number | null;
  bmiLabel?: string;
  assessmentDate?: string;
  anatomyTotal?: number;
  anatomyZones?: Zone[];
  palmResults?: PalmItem[];
  medicalHistoryScore?: number;
  medicalHistoryConditions?: string[];
  platoTotal?: number;
  platoSleepQuality?: number;
  platoSectionA?: number;
  platoSectionB?: number;
  platoSectionC?: number;
  educationalSummary?: string;
  whatResultsSuggest?: string[];
  whyItMattersIntro?: string;
  whyItMattersPts?: string[];
  whatWorksBestIntro?: string;
  whatWorksBestOpts?: string[];
  nextStepsIntro?: string;
  nextStepsSteps?: string[];
  [key: string]: any;
}

function esc(s: string | number | null | undefined): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scoreCircleSvg(score: number, maxScore: number, color: string): string {
  const pct = Math.round((score / maxScore) * 100);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return `<svg width="72" height="72" viewBox="0 0 72 72">
    <circle cx="36" cy="36" r="${r}" fill="none" stroke="#E5E7EB" stroke-width="6"/>
    <circle cx="36" cy="36" r="${r}" fill="none" stroke="${color}" stroke-width="6"
      stroke-dasharray="${dash} ${circ}" stroke-linecap="round"
      transform="rotate(-90 36 36)"/>
    <text x="36" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="#0F172A">${score}</text>
  </svg>`;
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

function renderParaHtml(para: string): string {
  if (para.includes("\n•")) {
    const [intro, ...bullets] = para.split("\n•");
    const bulletItems = bullets.map(b =>
      `<li style="display:flex;align-items:flex-start;gap:8px;margin-bottom:4px;">
        <span style="width:6px;height:6px;border-radius:50%;background:#2563EB;flex-shrink:0;margin-top:6px;"></span>
        <span style="font-size:13px;color:#374151;">${esc(b.trim())}</span>
      </li>`
    ).join("");
    return `${intro ? `<p style="font-size:13px;color:#374151;line-height:1.6;margin:0 0 8px;">${esc(intro.trim())}</p>` : ""}
    <ul style="list-style:none;padding:0;margin:0 0 8px;">${bulletItems}</ul>`;
  }
  const html = esc(para)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<u>$1</u>");
  return `<p style="font-size:13px;color:#374151;line-height:1.6;margin:0 0 12px;">${html}</p>`;
}

function buildReportHtml(p: ReportParams): string {
  const osaRiskLabel = p.osaRisk === "high" ? "High" : p.osaRisk === "intermediate" ? "Moderate" : "Low";
  const osaRiskColor = p.osaRisk === "high" ? "#DC2626" : p.osaRisk === "intermediate" ? "#D97706" : "#16A34A";
  const osaRiskBg = p.osaRisk === "high" ? "#FEE2E2" : p.osaRisk === "intermediate" ? "#FEF3C7" : "#DCFCE7";

  const isiScore = p.isiScore ?? 0;
  const isiLabel = p.insomniaSeverity === "severe" ? "Severe" : p.insomniaSeverity === "moderate" ? "Moderate" : p.insomniaSeverity === "subthreshold" ? "Subthreshold" : "None / Mild";
  const isiColor = p.insomniaSeverity === "severe" ? "#DC2626" : p.insomniaSeverity === "moderate" ? "#D97706" : p.insomniaSeverity === "subthreshold" ? "#2563EB" : "#16A34A";
  const isiBg = p.insomniaSeverity === "severe" ? "#FEE2E2" : p.insomniaSeverity === "moderate" ? "#FEF3C7" : p.insomniaSeverity === "subthreshold" ? "#DBEAFE" : "#DCFCE7";

  const bmi = p.bmiValue ?? null;
  const bmiLabel = p.bmiLabel ?? (bmi == null ? "N/A" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : bmi < 35 ? "Obesity I" : bmi < 40 ? "Obesity II" : "Obesity III");
  const bmiColor = bmi == null ? "#6B7280" : bmi < 25 ? "#16A34A" : bmi < 30 ? "#D97706" : "#DC2626";
  const bmiBg = bmi == null ? "#F3F4F6" : bmi < 25 ? "#DCFCE7" : bmi < 30 ? "#FEF3C7" : "#FEE2E2";

  const medScore = p.medicalHistoryScore ?? 0;
  const medBg = medScore > 0 ? "#FEF3C7" : "#DCFCE7";
  const medColor = medScore > 0 ? "#D97706" : "#16A34A";
  const medLabel = medScore > 0 ? `${medScore} condition${medScore > 1 ? "s" : ""} reported` : "No conditions reported";

  const anatomyTotal = p.anatomyTotal ?? 0;
  const anatomyTotalColor = anatomyTotal > 0 ? "#C2410C" : "#16A34A";
  const anatomyTotalBg = anatomyTotal > 0 ? "#FED7AA" : "#DCFCE7";
  const anatomyTotalLabel = anatomyTotal > 0 ? `${anatomyTotal} finding${anatomyTotal > 1 ? "s" : ""}` : "No findings";

  const zones: Zone[] = p.anatomyZones ?? [
    { label: "Nose", score: 0, max: 5, isPositive: false, answers: [] },
    { label: "Palate & Tonsils", score: 0, max: 3, isPositive: false, answers: [] },
    { label: "Mandible & Tongue", score: 0, max: 3, isPositive: false, answers: [] },
    { label: "Neck", score: 0, max: 3, isPositive: false, answers: [] },
  ];

  const palm: PalmItem[] = p.palmResults ?? [
    { letter: "P", name: "Airway Narrowing", score: 0, isPositive: false, questions: [] },
    { letter: "A", name: "Arousal Threshold", score: 0, isPositive: false, questions: [] },
    { letter: "L", name: "Loop Gain", score: 0, isPositive: false, questions: [] },
    { letter: "M", name: "Muscle Responsiveness", score: 0, isPositive: false, questions: [] },
  ];

  const { keyConcept, bodyParas } = parseEducationalSummary(p.educationalSummary ?? "");

  const zoneRows = zones.map(z => {
    const color = z.isPositive ? "#C2410C" : "#16A34A";
    const border = z.isPositive ? "#86EFAC" : "#BBF7D0";
    const bg = z.isPositive ? "#F0FDF4" : "white";
    const badge = z.isPositive
      ? `<span style="background:#FFEDD5;color:#C2410C;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">Flagged</span>`
      : `<span style="background:#DCFCE7;color:#16A34A;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">Normal</span>`;
    const answersList = z.answers.length > 0
      ? `<ul style="margin:4px 0 0;padding-left:16px;font-size:11px;color:#374151;">${z.answers.map(a => `<li>${esc(a)}</li>`).join("")}</ul>`
      : `<p style="font-size:11px;color:#9CA3AF;font-style:italic;margin:4px 0 0;">No findings reported.</p>`;
    return `<div style="border:1px solid ${border};border-radius:8px;padding:12px;margin-bottom:8px;background:${bg};">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <p style="font-size:11px;font-weight:600;color:#16A34A;text-transform:uppercase;letter-spacing:0.05em;flex:1;margin:0;">${esc(z.label)}</p>
        <span style="font-size:14px;font-weight:700;color:${color};">${z.score}</span>
        <span style="font-size:11px;color:#9CA3AF;">/ ${z.max}</span>
        ${badge}
      </div>
      ${answersList}
    </div>`;
  }).join("");

  const palmRows = palm.map(item => {
    const bg = item.isPositive ? "#FEF2F2" : "white";
    const border = item.isPositive ? "#FECACA" : "#FEE2E2";
    const badge = item.isPositive
      ? `<span style="background:#FEE2E2;color:#B91C1C;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">Positive</span>`
      : `<span style="background:#F3F4F6;color:#6B7280;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">Negative</span>`;
    const qList = item.questions.length > 0
      ? `<ul style="margin:4px 0 0;padding-left:24px;font-size:11px;color:#374151;">${item.questions.map(q => `<li>${esc(q)}</li>`).join("")}</ul>`
      : `<p style="font-size:11px;color:#9CA3AF;font-style:italic;margin:4px 0 0 24px;">No positive findings.</p>`;
    return `<div style="border:1px solid ${border};border-radius:8px;padding:10px;margin-bottom:8px;background:${bg};">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <span style="width:22px;height:22px;border-radius:50%;background:#DC2626;color:white;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">${esc(item.letter)}</span>
        <p style="font-size:11px;font-weight:600;color:#DC2626;flex:1;margin:0;">${esc(item.name)}</p>
        <span style="font-size:11px;font-weight:600;color:#4B5563;">${item.score} Yes</span>
        ${badge}
      </div>
      ${qList}
    </div>`;
  }).join("");

  const whatResultsHtml = (p.whatResultsSuggest ?? []).map(pt =>
    `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:6px;">
      <span style="width:6px;height:6px;border-radius:50%;background:#475569;flex-shrink:0;margin-top:5px;"></span>
      <p style="font-size:13px;color:#374151;margin:0;">${esc(pt)}</p>
    </div>`
  ).join("");

  const whyItMattersHtml = (p.whyItMattersPts ?? []).map(pt =>
    `<div style="display:flex;align-items:flex-start;gap:10px;padding:10px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;margin-bottom:6px;page-break-inside:avoid;">
      <span style="width:6px;height:6px;border-radius:50%;background:#475569;flex-shrink:0;margin-top:5px;"></span>
      <p style="font-size:13px;color:#374151;margin:0;">${esc(pt)}</p>
    </div>`
  ).join("");

  const whatWorksBestHtml = (p.whatWorksBestOpts ?? []).map(item =>
    `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;page-break-inside:avoid;">
      <span style="width:6px;height:6px;border-radius:50%;background:#475569;flex-shrink:0;margin-top:5px;"></span>
      <p style="font-size:13px;color:#334155;margin:0;">${esc(item)}</p>
    </div>`
  ).join("");

  const nextStepsHtml = (p.nextStepsSteps ?? []).map((step, i) =>
    `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;page-break-inside:avoid;">
      <span style="width:22px;height:22px;border-radius:50%;background:#2563EB;color:white;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">${i + 1}</span>
      <p style="font-size:13px;color:#0F172A;line-height:1.5;margin:0;">${esc(step)}</p>
    </div>`
  ).join("");

  const medConditions = (p.medicalHistoryConditions ?? []).length > 0
    ? `<ul style="margin:4px 0 0;padding-left:16px;font-size:11px;color:#374151;">${(p.medicalHistoryConditions ?? []).map(c => `<li>${esc(c)}</li>`).join("")}</ul>`
    : "";

  const footer = (page: number) =>
    `<div style="padding:12px 48px;display:flex;justify-content:space-between;">
      <span style="font-size:10px;color:#D1D5DB;">sleepcheckup.com</span>
      <span style="font-size:10px;color:#D1D5DB;">Page ${page}</span>
    </div>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: white; }
  @page { size: letter; margin: 0; }
  .page { background: white; min-height: 11in; display: flex; flex-direction: column; page-break-after: always; }
  .page:last-child { page-break-after: avoid; }
  .section-header { background: #EFF6FF; border: 1px solid #BFDBFE; padding: 24px 32px; border-radius: 6px; margin-bottom: 28px; }
  .section-header h2 { font-weight: 800; font-size: 20px; text-transform: uppercase; letter-spacing: 0.05em; color: #0F172A; }
  .section-header p { font-size: 14px; color: #2563EB; margin-top: 4px; }
  .step-badge { width: 28px; height: 28px; border-radius: 50%; color: white; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .score-card { border: 1px solid #BFDBFE; border-radius: 8px; padding: 14px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; }
  .pathway-box { border: 1px solid #BFDBFE; border-radius: 8px; padding: 28px 32px; background: #DBEAFE; text-align: center; max-width: 360px; margin: 0 auto 28px; }
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page" style="justify-content:space-between;">
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:80px 48px 60px;text-align:center;">
    <h1 style="color:#0F172A;font-size:40px;font-weight:800;line-height:1.15;letter-spacing:-0.5px;margin-bottom:28px;">
      Murphy Method™ Assessment Report
    </h1>
    <div class="pathway-box">
      <p style="color:#1D4ED8;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;font-weight:600;margin-bottom:10px;">Your Assigned Pathway</p>
      <p style="color:#0F172A;font-size:26px;font-weight:700;line-height:1.2;margin-bottom:6px;">${esc(p.pathwayName)}</p>
      <p style="color:#2563EB;font-size:13px;font-weight:500;line-height:1.4;margin-top:8px;">${esc(p.pathwayDescription)}</p>
    </div>
    <div style="margin-bottom:24px;">
      <p style="color:#0F172A;font-size:18px;font-weight:600;">Assessment Participant</p>
      <p style="color:#6B7280;font-size:13px;margin-top:6px;">Assessment Date: <span style="color:#0F172A;font-weight:500;">${esc(p.assessmentDate ?? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))}</span></p>
    </div>
    <p style="color:#2563EB;font-size:15px;font-weight:600;letter-spacing:0.03em;">sleepcheckup.com</p>
  </div>
</div>

<!-- PAGE 2: YOUR RESULTS -->
<div class="page">
  <div style="flex:1;padding:36px 48px;">
    <div class="section-header">
      <h2>Your Results</h2>
      <p>Based on your Murphy Method™ assessment answers</p>
    </div>

    <!-- STEP 1 -->
    <div style="margin-bottom:28px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div class="step-badge" style="background:#2563EB;">1</div>
        <div>
          <h3 style="font-weight:700;color:#0F172A;font-size:14px;">How Is the Breathing at Night?</h3>
          <p style="font-size:11px;color:#6B7280;">Medical history, BMI, OSA risk, insomnia severity, and sleep quality scores</p>
        </div>
      </div>

      <!-- Medical History -->
      <div style="border:1px solid #BFDBFE;border-radius:8px;padding:14px;margin-bottom:12px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <p style="font-size:11px;font-weight:600;color:#2563EB;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Medical History</p>
            <div style="display:flex;align-items:baseline;gap:6px;">
              <span style="font-size:22px;font-weight:700;color:${medColor};">${medScore}</span>
              <span style="font-size:13px;color:#9CA3AF;">/ 8</span>
              <span style="background:${medBg};color:${medColor};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">${esc(medLabel)}</span>
            </div>
          </div>
          ${medConditions}
        </div>
      </div>

      <!-- BMI · STOP-BANG · ISI -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px;">
        <!-- BMI -->
        <div class="score-card">
          <div style="width:68px;height:68px;border-radius:50%;background:${bmiBg};display:flex;align-items:center;justify-content:center;">
            <span style="font-size:18px;font-weight:700;color:${bmiColor};">${bmi != null ? bmi.toFixed(1) : "—"}</span>
          </div>
          <p style="font-size:10px;color:#6B7280;">kg/m²</p>
          <p style="font-size:10px;font-weight:600;color:#2563EB;text-transform:uppercase;letter-spacing:0.05em;">Body Mass Index</p>
          <span style="background:${bmiBg};color:${bmiColor};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">${esc(bmiLabel)}</span>
          <p style="font-size:10px;color:#6B7280;line-height:1.4;">${bmi == null ? "BMI not calculated." : bmi >= 30 ? "BMI ≥30 is a significant OSA risk factor." : bmi >= 25 ? "Overweight BMI carries moderate elevated risk." : "BMI in normal range."}</p>
        </div>
        <!-- STOP-BANG -->
        <div class="score-card">
          ${scoreCircleSvg(p.stopBangScore, 8, osaRiskColor)}
          <p style="font-size:10px;font-weight:600;color:#2563EB;text-transform:uppercase;letter-spacing:0.05em;">STOP-BANG</p>
          <span style="background:${osaRiskBg};color:${osaRiskColor};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">${esc(osaRiskLabel)} OSA Risk</span>
          <p style="font-size:10px;color:#6B7280;line-height:1.4;">${p.osaRisk === "high" ? "Score ≥5 — sleep study strongly recommended." : p.osaRisk === "intermediate" ? "Score 3–4 — clinical evaluation recommended." : "Score 0–2 — lower risk; evaluation still advisable."}</p>
        </div>
        <!-- ISI -->
        <div class="score-card">
          ${scoreCircleSvg(isiScore, 28, isiColor)}
          <p style="font-size:10px;font-weight:600;color:#2563EB;text-transform:uppercase;letter-spacing:0.05em;">Insomnia Index (ISI)</p>
          <span style="background:${isiBg};color:${isiColor};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">${esc(isiLabel)} Insomnia</span>
          <p style="font-size:10px;color:#6B7280;line-height:1.4;">${p.insomniaSeverity === "severe" ? "Score ≥22 — significant insomnia requiring treatment." : p.insomniaSeverity === "moderate" ? "Score 15–21 — moderate insomnia; intervention recommended." : p.insomniaSeverity === "subthreshold" ? "Score 8–14 — subthreshold insomnia; monitor and address." : "Score &lt;8 — no clinically significant insomnia."}</p>
        </div>
      </div>

      <!-- PLATO-11 -->
      <div style="border:1px solid #BFDBFE;border-radius:8px;padding:14px;">
        <p style="font-size:11px;font-weight:600;color:#2563EB;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:2px;">PLATO-11 — Sleep Quality &amp; Daytime Impact</p>
        <p style="font-size:11px;color:#6B7280;font-style:italic;margin-bottom:10px;">This section describes your symptoms and sleep quality. It does not change your Murphy Method Pathway assignment.</p>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">
          ${[
            { label: "Total Score", value: p.platoTotal ?? 0, max: 44 },
            { label: "Sleep Quality", value: p.platoSleepQuality ?? 0, max: 10 },
            { label: "Section A", value: p.platoSectionA ?? 0, max: 32 },
            { label: "Section B", value: p.platoSectionB ?? 0, max: 8 },
            { label: "Section C", value: p.platoSectionC ?? 0, max: 4 },
          ].map(s => `<div style="background:#F9FAFB;border-radius:8px;padding:10px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:2px;">
            <span style="font-size:16px;font-weight:700;color:#0F172A;">${s.value}</span>
            <span style="font-size:10px;color:#9CA3AF;">/ ${s.max}</span>
            <span style="font-size:10px;color:#6B7280;line-height:1.3;">${esc(s.label)}</span>
          </div>`).join("")}
        </div>
      </div>
    </div>

    <!-- STEP 2 -->
    <div style="margin-bottom:28px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div class="step-badge" style="background:#16A34A;">2</div>
        <div>
          <h3 style="font-weight:700;color:#0F172A;font-size:14px;">Where Can the Airway Narrow?</h3>
          <p style="font-size:11px;color:#6B7280;">Your four airway levels — evaluated from nose to neck</p>
        </div>
      </div>

      <div style="border:1px solid #BBF7D0;border-radius:8px;padding:14px;margin-bottom:10px;">
        <div style="display:flex;align-items:baseline;gap:6px;">
          <p style="font-size:11px;font-weight:600;color:#16A34A;text-transform:uppercase;letter-spacing:0.05em;margin-right:6px;margin:0 6px 0 0;">Overall Score</p>
          <span style="font-size:22px;font-weight:700;color:${anatomyTotalColor};">${anatomyTotal}</span>
          <span style="font-size:13px;color:#9CA3AF;">/ 14</span>
          <span style="background:${anatomyTotalBg};color:${anatomyTotalColor};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">${esc(anatomyTotalLabel)}</span>
        </div>
      </div>

      ${zoneRows}
    </div>

    <!-- STEP 3 -->
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div class="step-badge" style="background:#DC2626;">3</div>
        <div>
          <h3 style="font-weight:700;color:#0F172A;font-size:14px;">Understand the Overall Approach and how the PALM Classification helps.</h3>
          <p style="font-size:11px;color:#6B7280;">Your Murphy Method pathway assignment</p>
        </div>
      </div>

      <p style="font-size:13px;color:#4B5563;margin-bottom:10px;">Treatment depends on where the blockage is and how serious the problem is.</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
        <div style="background:#EEF2FF;border:1px solid #C7D2FE;border-radius:8px;padding:14px;">
          <p style="font-size:13px;font-weight:700;color:#2563EB;margin-bottom:8px;">Non-Surgery Options</p>
          <ul style="font-size:13px;color:#374151;list-style:none;padding:0;margin:0;">
            <li style="margin-bottom:4px;">• CPAP</li>
            <li style="margin-bottom:4px;">• Oral appliance</li>
            <li>• Other treatments</li>
          </ul>
        </div>
        <div style="background:#FFF1F2;border:1px solid #FECDD3;border-radius:8px;padding:14px;">
          <p style="font-size:13px;font-weight:700;color:#DC2626;margin-bottom:8px;">Procedure Options</p>
          <ul style="font-size:13px;color:#374151;list-style:none;padding:0;margin:0;">
            <li style="margin-bottom:4px;">• Nose procedures</li>
            <li style="margin-bottom:4px;">• Palate / tonsil procedures</li>
            <li>• Jaw / tongue procedures</li>
          </ul>
        </div>
      </div>

      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px;margin-bottom:12px;text-align:center;">
        <p style="font-size:13px;color:#374151;"><strong>Simple idea:</strong> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.</p>
      </div>

      <!-- PALM -->
      <div style="border:1px solid #FECACA;border-radius:8px;padding:14px;">
        <p style="font-size:11px;font-weight:600;color:#DC2626;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:2px;">PALM Classification</p>
        <p style="font-size:11px;color:#6B7280;font-style:italic;margin-bottom:14px;">Understand underlying factors that may contribute to your sleep apnea</p>
        ${palmRows}
      </div>
    </div>
  </div>
  ${footer(2)}
</div>

<!-- PAGE 3: PATHWAY EDUCATIONAL SUMMARY -->
<div class="page">
  <div style="flex:1;padding:36px 48px;">
    <div class="section-header">
      <h2>Your Murphy Method Assigned Pathway</h2>
      <p style="color:#6B7280;">Your personalized treatment pathway based on your assessment</p>
    </div>

    <div style="margin-bottom:24px;">
      <h2 style="font-weight:700;color:#0F172A;font-size:22px;line-height:1.3;">${esc(p.pathwayName)}</h2>
      <p style="color:#374151;font-size:15px;font-weight:600;margin-top:8px;line-height:1.5;">${esc(p.pathwayDescription)}</p>
    </div>

    ${keyConcept ? `
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:18px;margin-bottom:28px;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
        <p style="font-size:10px;color:#2563EB;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;margin:0;">Key Concept</p>
      </div>
      <p style="font-size:13px;line-height:1.6;color:#0F172A;margin:0;">${esc(keyConcept)}</p>
    </div>` : ""}

    <div>
      ${bodyParas.map(para => renderParaHtml(para)).join("")}
    </div>
  </div>
  ${footer(3)}
</div>

<!-- PAGE 4: PERSONALIZED GUIDE -->
<div class="page">
  <div style="flex:1;padding:36px 48px;display:flex;flex-direction:column;gap:28px;">
    <div class="section-header">
      <h2>Your Personalized Guide</h2>
    </div>

    <!-- What Results Suggest -->
    <div>
      <h3 style="font-weight:700;color:#0F172A;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">What Your Results Suggest</h3>
      ${whatResultsHtml || '<p style="font-size:13px;color:#6B7280;">No results available.</p>'}
    </div>

    <!-- Why This Matters -->
    <div>
      <h3 style="font-weight:700;color:#0F172A;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">Why This Matters for Your Health</h3>
      ${p.whyItMattersIntro ? `<p style="font-size:13px;color:#4B5563;line-height:1.6;margin-bottom:10px;">${esc(p.whyItMattersIntro)}</p>` : ""}
      ${whyItMattersHtml}
    </div>

    <!-- What Usually Works Best -->
    <div>
      <h3 style="font-weight:700;color:#0F172A;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">What Usually Works Best for People in This Pathway</h3>
      <div style="border:1px solid #CBD5E1;border-radius:8px;padding:16px;background:#F8FAFC;">
        ${p.whatWorksBestIntro ? `<p style="font-size:13px;color:#334155;line-height:1.6;margin-bottom:10px;">${esc(p.whatWorksBestIntro)}</p>` : ""}
        ${whatWorksBestHtml}
      </div>
    </div>
  </div>
  ${footer(4)}
</div>

<!-- PAGE 5: NEXT STEPS -->
<div class="page">
  <div style="flex:1;padding:36px 48px;display:flex;flex-direction:column;gap:28px;">

    <!-- Action Plan -->
    <div style="border:1px solid #93C5FD;border-radius:8px;overflow:hidden;">
      <div style="background:#2563EB;padding:18px 24px;">
        <p style="color:#BFDBFE;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;margin-bottom:4px;">Action Plan</p>
        <h3 style="font-weight:700;color:white;font-size:17px;line-height:1.3;margin:0;">Your Murphy Method™ Next Steps</h3>
      </div>
      <div style="background:#EFF6FF;padding:20px 24px;">
        ${p.nextStepsIntro ? `<p style="font-size:13px;color:#1E3A8A;font-weight:500;line-height:1.5;margin-bottom:14px;">${esc(p.nextStepsIntro)}</p>` : ""}
        ${nextStepsHtml}
      </div>
    </div>

  </div>
  ${footer(5)}
</div>

<!-- BACK COVER -->
<div class="page" style="page-break-after:avoid;">
  <div style="flex:1;padding:48px;display:flex;flex-direction:column;gap:36px;">

    <div>
      <h3 style="color:#2563EB;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;margin-bottom:10px;">About the Murphy Method™</h3>
      <p style="color:#0F172A;font-size:13px;line-height:1.6;">
        The Murphy Method™ is a clinical system for understanding and treating snoring and obstructive sleep apnea, developed by Michael Murphy, MD, MPH. The Murphy Method is a simple, organized approach to understand both snoring and sleep apnea. Doctor Murphy uses this same method with every snoring and sleep apnea patient he sees in his office.
      </p>
    </div>

    <div>
      <h3 style="color:#2563EB;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;margin-bottom:10px;">About Michael Murphy, MD, MPH</h3>
      <p style="color:#0F172A;font-size:13px;line-height:1.6;">
        Dr. Murphy is a dual board-certified ENT surgeon and Sleep Medicine physician with over 20 years of experience treating snoring and sleep apnea. His rare combination of surgical and non-surgical expertise allows him to see the full picture of sleep-disordered breathing — not just one treatment option.
      </p>
    </div>

    <div style="border-top:1px solid #E5E7EB;padding-top:24px;">
      <p style="color:#0F172A;font-size:13px;font-weight:600;">Take the assessment at <span style="color:#2563EB;">SleepCheckup.com</span></p>
    </div>

  </div>

  <div style="padding:0 48px 36px;display:flex;flex-direction:column;gap:16px;">
    <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:14px;">
      <p style="color:#92400E;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Important Notice</p>
      <p style="color:#92400E;font-size:11px;line-height:1.5;margin:0;">
        This report is generated from a self-administered questionnaire and is intended for educational purposes only. It does not constitute a medical diagnosis, clinical assessment, or treatment recommendation. The information in this report should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
      </p>
    </div>
    <div style="color:#9CA3AF;font-size:10px;line-height:1.6;">
      <p style="margin:0;">© 2026 Murphy Method™. All rights reserved.</p>
      <p style="margin:0;">A service of Sleep Check Up, Inc.</p>
      <p style="margin:0;">Murphy Method™ is a trademark of Sleep Check Up, Inc.</p>
    </div>
  </div>
</div>

</body>
</html>`;
}

export async function generateReportPdf(params: ReportParams): Promise<Buffer> {
  const html = buildReportHtml(params);

  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

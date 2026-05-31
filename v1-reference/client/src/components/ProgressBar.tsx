import { User, Check } from "lucide-react";
import type { WizardStep } from "@/lib/types";
import type { MedicalHistoryAnswers, BmiData, StopBangAnswers, IsiAnswers, PlatoAnswers, PalmAnswers, ZoneAnswers } from "@/lib/types";

interface ProgressBarProps {
  currentStep: WizardStep;
  sectionLabel?: string;
  medicalHistoryAnswers?: MedicalHistoryAnswers;
  bmiData?: BmiData;
  stopBangAnswers?: StopBangAnswers;
  isiAnswers?: IsiAnswers;
  platoAnswers?: PlatoAnswers;
  palmAnswers?: PalmAnswers;
  zoneAnswers?: ZoneAnswers;
}

const TOTAL_QUESTIONS = 64;

function isAnswered(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "boolean") return true;
  if (typeof v === "number") return true;
  if (typeof v === "string") return v === "yes" || v === "no";
  return false;
}

function countFlatAnswered(obj: Record<string, unknown> | undefined): number {
  if (!obj) return 0;
  return Object.values(obj).filter(isAnswered).length;
}

function countNestedAnswered(obj: Record<string, Record<string, unknown>> | undefined): number {
  if (!obj) return 0;
  let count = 0;
  for (const section of Object.values(obj)) {
    if (section && typeof section === "object") {
      count += Object.values(section).filter(isAnswered).length;
    }
  }
  return count;
}

function countBmiAnswered(data: BmiData | undefined): number {
  if (!data) return 0;
  let count = 0;
  if (data.heightValue !== undefined && data.heightValue !== null) count++;
  if (data.weightValue !== undefined && data.weightValue !== null) count++;
  return count;
}

function computeProgress(props: ProgressBarProps): { answered: number; total: number; percent: number } {
  const { currentStep, medicalHistoryAnswers, bmiData, stopBangAnswers, isiAnswers, platoAnswers, palmAnswers, zoneAnswers } = props;

  if (currentStep === 1) return { answered: 0, total: TOTAL_QUESTIONS, percent: 0 };
  if (currentStep === 5) return { answered: TOTAL_QUESTIONS, total: TOTAL_QUESTIONS, percent: 100 };

  let answered = 0;
  answered += countFlatAnswered(medicalHistoryAnswers);
  answered += countBmiAnswered(bmiData);
  answered += countFlatAnswered(stopBangAnswers);
  answered += countFlatAnswered(isiAnswers);
  answered += countFlatAnswered(platoAnswers);
  answered += countNestedAnswered(palmAnswers as unknown as Record<string, Record<string, unknown>>);
  answered += countNestedAnswered(zoneAnswers as unknown as Record<string, Record<string, unknown>>);

  const percent = Math.round((answered / TOTAL_QUESTIONS) * 100);
  return { answered, total: TOTAL_QUESTIONS, percent };
}

// wizardStep: the main WizardStep value this track item corresponds to
// number: the visible step number (1, 2, 3) — 0 means no number shown (intro/results)
// kind: "intro" | "numbered" | "results"
const TRACK_STEPS = [
  { id: "intro",     label: "The Murphy Method™",             wizardStep: 1 as WizardStep, kind: "intro"    as const },
  { id: "breathing", label: "How Is the Breathing at Night?", wizardStep: 2 as WizardStep, kind: "numbered" as const, num: 1, color: "#2563EB", colorDone: "#1D4ED8" },
  { id: "airway",    label: "Where Can the Airway Narrow?",   wizardStep: 3 as WizardStep, kind: "numbered" as const, num: 2, color: "#16A34A", colorDone: "#15803D" },
  { id: "treatment", label: "What Can Help?",                 wizardStep: 4 as WizardStep, kind: "numbered" as const, num: 3, color: "#DC2626", colorDone: "#B91C1C" },
  { id: "results",   label: "Your Results",                   wizardStep: 5 as WizardStep, kind: "results"  as const },
];

function getCircleState(step: typeof TRACK_STEPS[0], currentWizardStep: WizardStep): "done" | "active" | "upcoming" {
  if (step.wizardStep < currentWizardStep) return "done";
  if (step.wizardStep === currentWizardStep) return "active";
  return "upcoming";
}

function TrackCircle({ step, state }: { step: typeof TRACK_STEPS[0]; state: "done" | "active" | "upcoming" }) {
  const base = "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all";

  if (step.kind === "intro") {
    if (state === "upcoming") {
      return (
        <div className={`${base} bg-white border-2 border-gray-300`}>
          <Check className="w-3.5 h-3.5 text-gray-300" />
        </div>
      );
    }
    return (
      <div className={`${base} bg-[#0F172A] border-2 border-[#0F172A]`}>
        <Check className="w-3.5 h-3.5 text-white" />
      </div>
    );
  }

  if (step.kind === "results") {
    if (state === "done" || state === "active") {
      return (
        <div className={`${base} bg-[#0F172A] border-2 border-[#0F172A]`}>
          <User className="w-3.5 h-3.5 text-white" />
        </div>
      );
    }
    return (
      <div className={`${base} bg-white border-2 border-gray-300`}>
        <User className="w-3.5 h-3.5 text-gray-300" />
      </div>
    );
  }

  const numberedStep = step as { num: number; color: string; colorDone: string };

  if (state === "done") {
    return (
      <div className={`${base} border-2`} style={{ backgroundColor: numberedStep.colorDone, borderColor: numberedStep.colorDone }}>
        <Check className="w-3.5 h-3.5 text-white" />
      </div>
    );
  }

  if (state === "active") {
    return (
      <div className={`${base} border-2 shadow-sm`} style={{ backgroundColor: numberedStep.color, borderColor: numberedStep.color }}>
        <span className="text-white text-xs font-bold">{numberedStep.num}</span>
      </div>
    );
  }

  return (
    <div className={`${base} bg-white border-2 border-gray-300`}>
      <span className="text-gray-400 text-xs font-semibold">{numberedStep.num}</span>
    </div>
  );
}

function ConnectorLine({ leftState }: { leftState: "done" | "active" | "upcoming" }) {
  return (
    <div className="flex-1 mx-3 mb-4 min-w-0">
      <div className={`h-px w-full ${leftState === "done" ? "bg-[#0F172A]" : "bg-gray-300"}`} />
    </div>
  );
}

export function ProgressBar(props: ProgressBarProps) {
  const { currentStep } = props;
  const { answered, total, percent } = computeProgress(props);
  const showBar = currentStep >= 2 && currentStep <= 4;

  return (
    <div
      className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden shadow-sm"
      data-testid="progress-bar"
    >
      <div className="max-w-4xl mx-auto px-6 pt-4 pb-3">
        {/* Step track */}
        <div className="flex items-center">
          {TRACK_STEPS.map((step, i) => {
            const state = getCircleState(step, currentStep);
            const isLast = i === TRACK_STEPS.length - 1;

            const labelColor =
              state === "active"
                ? "text-[#0F172A] font-semibold"
                : state === "done"
                ? "text-gray-500"
                : "text-gray-400";

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <TrackCircle step={step} state={state} />
                  <span className={`text-[10px] leading-tight whitespace-nowrap ${labelColor}`}>
                    {step.label}
                  </span>
                </div>
                {!isLast && <ConnectorLine leftState={state} />}
              </div>
            );
          })}
        </div>

        {/* Thin progress fill bar */}
        {showBar && (
          <div className="mt-3">
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden" data-testid="progress-fill-track">
              <div
                className="h-full rounded-full bg-[#2563EB] transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
                data-testid="progress-fill-bar"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

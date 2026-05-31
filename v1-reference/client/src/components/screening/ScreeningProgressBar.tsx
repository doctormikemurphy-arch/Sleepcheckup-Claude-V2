import { Check, Sparkles, Award, Save } from "lucide-react";
import type { ScreeningStep } from "@/lib/screening-types";
import type { StopBangAnswers, ZoneAnswers } from "@/lib/types";

interface ScreeningProgressBarProps {
  currentStep: ScreeningStep;
  stopBangAnswers?: StopBangAnswers;
  zoneAnswers?: ZoneAnswers;
}

const SCREENING_TOTAL = 22;

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

function computeScreeningProgress(props: ScreeningProgressBarProps) {
  const { currentStep, stopBangAnswers, zoneAnswers } = props;
  if (currentStep === 1) return { answered: 0, total: SCREENING_TOTAL, percent: 0, minutesLeft: 3 };
  if (currentStep === 5) return { answered: SCREENING_TOTAL, total: SCREENING_TOTAL, percent: 100, minutesLeft: 0 };

  let answered = 0;
  answered += countFlatAnswered(stopBangAnswers);
  answered += countNestedAnswered(zoneAnswers as unknown as Record<string, Record<string, unknown>>);

  const percent = Math.round((answered / SCREENING_TOTAL) * 100);
  const remaining = SCREENING_TOTAL - answered;
  const minutesLeft = Math.max(1, Math.ceil(remaining * 0.15));

  return { answered, total: SCREENING_TOTAL, percent, minutesLeft };
}

const steps = [
  { id: 1, label: "The Murphy Method™", shortLabel: "Welcome", color: "black", stepNumber: null as number | null, Icon: Sparkles },
  { id: 2, label: "Breathing at Night", shortLabel: "Breathing", color: "blue", stepNumber: 1, Icon: null },
  { id: 3, label: "Airway Zones", shortLabel: "Airway", color: "green", stepNumber: 2, Icon: null },
  { id: 4, label: "Treatment Options", shortLabel: "Treatment", color: "red", stepNumber: 3, Icon: null },
  { id: 5, label: "Your Results", shortLabel: "Results", color: "black", stepNumber: null as number | null, Icon: Award },
];

const getStepColors = (color: string, isCompleted: boolean, isCurrent: boolean, isUpcoming: boolean) => {
  if (isUpcoming) return "bg-muted text-muted-foreground";
  switch (color) {
    case "blue":
      return isCompleted ? "bg-blue-600 text-white" : isCurrent ? "bg-blue-600 text-white ring-2 ring-blue-600/30" : "";
    case "green":
      return isCompleted ? "bg-green-600 text-white" : isCurrent ? "bg-green-600 text-white ring-2 ring-green-600/30" : "";
    case "red":
      return isCompleted ? "bg-red-600 text-white" : isCurrent ? "bg-red-600 text-white ring-2 ring-red-600/30" : "";
    case "black":
      return isCompleted
        ? "bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900"
        : isCurrent
          ? "bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 ring-2 ring-gray-900/20 dark:ring-gray-200/20"
          : "";
    default:
      return isCompleted ? "bg-primary text-primary-foreground" : isCurrent ? "bg-primary text-primary-foreground ring-2 ring-primary/20" : "";
  }
};

const getConnectorColor = (color: string, isCompleted: boolean) => {
  if (!isCompleted) return "bg-muted";
  switch (color) {
    case "blue": return "bg-blue-600";
    case "green": return "bg-green-600";
    case "red": return "bg-red-600";
    case "black": return "bg-gray-900 dark:bg-gray-200";
    default: return "bg-primary";
  }
};

const getProgressBarColor = (step: number) => {
  if (step <= 2) return "bg-blue-600";
  if (step === 3) return "bg-green-600";
  if (step === 4) return "bg-red-600";
  return "bg-primary";
};

export function ScreeningProgressBar(props: ScreeningProgressBarProps) {
  const { currentStep } = props;
  const { answered, total, percent, minutesLeft } = computeScreeningProgress(props);
  const showDetailedProgress = currentStep >= 2 && currentStep <= 4;

  return (
    <div
      className="w-full bg-card border-b border-card-border sticky top-0 z-50 print:hidden"
      data-testid="screening-progress-bar"
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isUpcoming = currentStep < step.id;
            const StepIcon = step.Icon;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                      transition-all duration-300
                      ${getStepColors(step.color, isCompleted, isCurrent, isUpcoming)}
                    `}
                    data-testid={`screening-progress-step-${step.id}`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : step.stepNumber !== null ? (
                      step.stepNumber
                    ) : StepIcon ? (
                      <StepIcon className="w-3.5 h-3.5" />
                    ) : null}
                  </div>
                  <span className={`mt-1 text-[10px] font-medium hidden sm:block ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                  <span className={`mt-1 text-[10px] font-medium sm:hidden ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.shortLabel}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1.5 sm:mx-3 transition-all duration-300 ${getConnectorColor(step.color, currentStep > step.id)}`} />
                )}
              </div>
            );
          })}
        </div>

        {showDetailedProgress && (
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden" data-testid="screening-progress-fill-track">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressBarColor(currentStep)}`}
                style={{ width: `${percent}%` }}
                data-testid="screening-progress-fill-bar"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span data-testid="screening-progress-count">{answered} of {total} questions answered</span>
                <span className="flex items-center gap-1">
                  <Save className="w-2.5 h-2.5" />
                  Auto-saved
                </span>
              </div>
              <span data-testid="screening-progress-time">~{minutesLeft} min remaining</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

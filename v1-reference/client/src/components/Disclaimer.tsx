import { AlertCircle } from "lucide-react";

interface DisclaimerProps {
  variant?: "info" | "warning";
  mini?: boolean;
  className?: string;
}

export function Disclaimer({ variant = "info", mini = false, className = "" }: DisclaimerProps) {
  const bgColor = variant === "warning" ? "bg-amber-50 dark:bg-amber-950/30" : "bg-blue-50 dark:bg-blue-950/30";
  const borderColor = variant === "warning" ? "border-amber-400" : "border-primary";
  const iconColor = variant === "warning" ? "text-amber-600 dark:text-amber-400" : "text-primary";
  const textColor = variant === "warning" ? "text-amber-800 dark:text-amber-300" : "text-primary";

  if (mini) {
    return (
      <p
        className={`text-sm text-center ${textColor} font-medium ${className}`}
        data-testid="disclaimer-mini"
      >
        <AlertCircle className={`w-3 h-3 inline-block mr-1 mb-0.5 ${iconColor}`} />
        For educational purposes only — not a medical diagnosis.
      </p>
    );
  }

  return (
    <div
      className={`${bgColor} border-l-4 ${borderColor} p-3 rounded-r-md ${className}`}
      role="alert"
      data-testid="disclaimer-block"
    >
      <div className="flex gap-3">
        <AlertCircle className={`w-4 h-4 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="text-xs text-foreground/80 leading-relaxed">
          <p><span className="font-semibold">This Murphy Method&trade; Sleep Breathing Assessment is for education only.</span> It cannot diagnose obstructive sleep apnea or any other condition. It is not a substitute for seeing a doctor or sleep specialist. Always talk with a healthcare professional about your sleep and breathing.</p>
        </div>
      </div>
    </div>
  );
}

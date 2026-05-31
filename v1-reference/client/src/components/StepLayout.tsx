import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepLayoutProps {
  title: string;
  subtitle?: React.ReactNode;
  subtitleBold?: boolean;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  titleColor?: "blue" | "green" | "red" | "black";
  titleClassName?: string;
  subtitleClassName?: string;
}

const getTitleColorClass = (color?: "blue" | "green" | "red" | "black") => {
  switch (color) {
    case "blue": return "text-blue-600 dark:text-blue-400";
    case "green": return "text-green-600 dark:text-green-400";
    case "red": return "text-red-600 dark:text-red-400";
    case "black": return "text-gray-900 dark:text-gray-200";
    default: return "text-foreground";
  }
};

const getNextButtonClass = (color?: "blue" | "green" | "red" | "black", disabled?: boolean) => {
  const base = "gap-2 min-h-12 px-6 text-white border";
  switch (color) {
    case "blue":
      return `${base} ${disabled ? "bg-blue-400 border-blue-400 opacity-80" : "bg-blue-600 border-blue-600"}`;
    case "green":
      return `${base} ${disabled ? "bg-green-400 border-green-400 opacity-80" : "bg-green-600 border-green-600"}`;
    case "red":
      return `${base} ${disabled ? "bg-red-400 border-red-400 opacity-80" : "bg-red-600 border-red-600"}`;
    default:
      return `gap-2 min-h-12 px-6 ${disabled ? "bg-blue-800 text-white opacity-100" : ""}`;
  }
};

export function StepLayout({
  title,
  subtitle,
  subtitleBold = false,
  children,
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  nextDisabled = false,
  showBack = true,
  showNext = true,
  titleColor,
  titleClassName,
  subtitleClassName,
}: StepLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8">
        {title && (
          <header className="mb-6 sm:mb-8">
            <h1
              className={titleClassName || `text-2xl sm:text-3xl font-bold ${getTitleColorClass(titleColor)}`}
              data-testid="step-title"
            >
              {title}
            </h1>
            {subtitle && (
              <p className={subtitleClassName || `mt-2 text-muted-foreground ${subtitleBold ? 'font-bold' : ''}`} data-testid="step-subtitle">
                {subtitle}
              </p>
            )}
          </header>
        )}

        <main className="pb-24 sm:pb-8">{children}</main>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 sm:static sm:border-t-0 sm:bg-transparent print:hidden"
      >
        <div className="max-w-4xl mx-auto flex justify-between gap-4">
          {showBack && onBack ? (
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2 min-h-12"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{backLabel}</span>
              <span className="sm:hidden">Back</span>
            </Button>
          ) : (
            <div />
          )}

          {showNext && onNext && (
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className={getNextButtonClass(titleColor, nextDisabled)}
              data-testid="button-next"
            >
              <span>{nextLabel}</span>
              {!nextDisabled && <ArrowRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

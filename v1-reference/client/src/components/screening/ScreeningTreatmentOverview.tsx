import { StepLayout } from "../StepLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MurphyMethodVisual } from "../MurphyMethodVisual";

interface ScreeningTreatmentOverviewProps {
  onBack: () => void;
  onNext: () => void;
}

export function ScreeningTreatmentOverview({ onBack, onNext }: ScreeningTreatmentOverviewProps) {
  return (
    <StepLayout
      title="Step 3: What Can Help?"
      subtitle={<strong>A big picture way to organize possible treatments. No questionnaire - informational only.</strong>}
      onBack={onBack}
      onNext={onNext}
      nextLabel="See Your Results"
      titleColor="red"
    >
      <div className="flex justify-end mb-4">
        <Button
          onClick={onNext}
          className="gap-2 bg-red-600 border border-red-600 text-white"
          data-testid="button-see-results-top"
        >
          See Your Results
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div
        className="p-6 border border-border rounded-lg bg-card"
        data-testid="screening-panel-treatment-overview"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">
            Overview of the Murphy Method
          </h3>
          <p className="text-sm text-muted-foreground">
            The Murphy Method™ is a simple way to understand snoring and sleep apnea by showing how breathing changes during sleep, where the airway may be blocked, and what treatments may help.
          </p>
        </div>

        <MurphyMethodVisual />
      </div>
    </StepLayout>
  );
}

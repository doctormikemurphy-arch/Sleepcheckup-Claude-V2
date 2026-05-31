import { useEffect } from "react";
import { ScreeningProgressBar } from "@/components/screening/ScreeningProgressBar";
import { ScreeningWelcome } from "@/components/screening/ScreeningWelcome";
import { ScreeningQuestionnaire } from "@/components/screening/ScreeningQuestionnaire";
import { ZoneStep } from "@/components/ZoneStep";
import { ScreeningTreatmentOverview } from "@/components/screening/ScreeningTreatmentOverview";
import { ScreeningResults } from "@/components/screening/ScreeningResults";
import { useScreening } from "@/hooks/useScreening";
import type { ScreeningStep } from "@/lib/screening-types";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function ScreeningPage() {
  const {
    currentStep,
    stopBangAnswers,
    zoneAnswers,
    profile,
    setCurrentStep,
    setStopBangAnswers,
    setZoneAnswers,
    goToResults,
    restart,
    calculateProfile,
  } = useScreening();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const goToStep = (step: ScreeningStep) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ScreeningWelcome onStart={() => goToStep(2)} />;

      case 2:
        return (
          <ScreeningQuestionnaire
            stopBangAnswers={stopBangAnswers}
            onStopBangChange={setStopBangAnswers}
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        );

      case 3:
        return (
          <ZoneStep
            answers={zoneAnswers}
            onChange={setZoneAnswers}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
            nextLabel="What Can Help?"
          />
        );

      case 4:
        return (
          <ScreeningTreatmentOverview
            onBack={() => goToStep(3)}
            onNext={goToResults}
          />
        );

      case 5:
        const finalProfile = profile || calculateProfile();
        return <ScreeningResults profile={finalProfile} onRestart={restart} />;

      default:
        return <ScreeningWelcome onStart={() => goToStep(2)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ScreeningProgressBar
        currentStep={currentStep}
        stopBangAnswers={stopBangAnswers}
        zoneAnswers={zoneAnswers}
      />
      {currentStep !== 5 && (
        <div className="max-w-4xl mx-auto px-4 pt-2 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={restart}
            className="text-muted-foreground hover:text-foreground gap-1 text-xs"
            data-testid="screening-button-start-fresh"
          >
            <RotateCcw className="w-3 h-3" />
            Start Fresh
          </Button>
        </div>
      )}
      <main>{renderStep()}</main>
    </div>
  );
}

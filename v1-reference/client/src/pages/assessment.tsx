import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { WelcomeStep } from "@/components/WelcomeStep";
import { QuestionnaireStep } from "@/components/QuestionnaireStep";
import { ZoneStep } from "@/components/ZoneStep";
import { TreatmentStep } from "@/components/TreatmentStep";
import { ResultsSummary } from "@/components/ResultsSummary";
import { useAssessment } from "@/hooks/useAssessment";
import type { WizardStep } from "@/lib/types";
import { RotateCcw } from "lucide-react";

export default function AssessmentPage() {
  const {
    currentStep,
    medicalHistoryAnswers,
    bmiData,
    stopBangAnswers,
    isiAnswers,
    platoAnswers,
    palmAnswers,
    zoneAnswers,
    profile,
    setCurrentStep,
    setMedicalHistoryAnswers,
    setBmiData,
    setStopBangAnswers,
    setIsiAnswers,
    setPlatoAnswers,
    setPalmAnswers,
    setZoneAnswers,
    goToResults,
    restart,
    calculateProfile,
  } = useAssessment();

  const [sectionLabel, setSectionLabel] = useState<string>("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (currentStep === 3) setSectionLabel("Section 6 of 7 — Airway Zone Assessment");
    else if (currentStep === 4) setSectionLabel("Section 7 of 7 — Treatment Readiness");
  }, [currentStep]);

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const handleSectionChange = (label: string) => {
    setSectionLabel(label);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onStart={() => goToStep(2)} />;

      case 2:
        return (
          <QuestionnaireStep
            medicalHistoryAnswers={medicalHistoryAnswers}
            bmiData={bmiData}
            stopBangAnswers={stopBangAnswers}
            isiAnswers={isiAnswers}
            platoAnswers={platoAnswers}
            onMedicalHistoryChange={setMedicalHistoryAnswers}
            onBmiChange={setBmiData}
            onStopBangChange={setStopBangAnswers}
            onIsiChange={setIsiAnswers}
            onPlatoChange={setPlatoAnswers}
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
            onSectionChange={handleSectionChange}
          />
        );

      case 3:
        return (
          <ZoneStep
            answers={zoneAnswers}
            onChange={setZoneAnswers}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
          />
        );

      case 4:
        return (
          <TreatmentStep
            palmAnswers={palmAnswers}
            onPalmChange={setPalmAnswers}
            onBack={() => goToStep(3)}
            onNext={goToResults}
          />
        );

      case 5:
        const finalProfile = profile || calculateProfile();
        return <ResultsSummary profile={finalProfile} onRestart={restart} />;

      default:
        return <WelcomeStep onStart={() => goToStep(2)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar
        currentStep={currentStep}
        sectionLabel={sectionLabel}
        medicalHistoryAnswers={medicalHistoryAnswers}
        bmiData={bmiData}
        stopBangAnswers={stopBangAnswers}
        isiAnswers={isiAnswers}
        platoAnswers={platoAnswers}
        palmAnswers={palmAnswers}
        zoneAnswers={zoneAnswers}
      />
      {currentStep !== 5 && currentStep !== 1 && (
        <div className="max-w-4xl mx-auto px-4 pt-2 print:hidden flex justify-end">
          <button
            type="button"
            onClick={restart}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-start-fresh"
          >
            <RotateCcw className="w-3 h-3" />
            Start Fresh
          </button>
        </div>
      )}
      <main>{renderStep()}</main>
    </div>
  );
}

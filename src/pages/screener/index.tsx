import { useEffect } from "react";
import { useLocation } from "wouter";
import { useScreener } from "@/hooks/useScreener";
import { ProgressTopBar } from "@/components/layout/ProgressTopBar";
import { Step1Welcome } from "./Step1Welcome";
import { Step2StopBang } from "./Step2StopBang";
import { ZoneStep } from "./ZoneStep";
import { ZONE_QUESTIONS } from "@/lib/questionnaires";

export default function ScreenerPage() {
  const [, navigate] = useLocation();
  const {
    step,
    totalSteps,
    stepName,
    stopBangAnswers,
    zoneAnswers,
    resumedFromSaved,
    setStopBang,
    setZones,
    goNext,
    goBack,
    goToResults,
    dismissResume,
    isCurrentStepComplete,
    restart,
  } = useScreener();

  // When step reaches 7, compute & navigate to results
  useEffect(() => {
    if (step === 7) {
      goToResults();
      navigate("/screener/results");
    }
  }, [step, goToResults, navigate]);

  const noseConfig = ZONE_QUESTIONS.find((z) => z.zone === "nose")!;
  const palateConfig = ZONE_QUESTIONS.find((z) => z.zone === "palate")!;
  const mandibleConfig = ZONE_QUESTIONS.find((z) => z.zone === "mandible")!;
  const neckConfig = ZONE_QUESTIONS.find((z) => z.zone === "neck")!;

  const showBack = step > 1 && step < 7;

  return (
    <div style={{ paddingTop: "56px", minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>
      <ProgressTopBar
        step={step}
        totalSteps={totalSteps}
        stepName={stepName}
        onBack={showBack ? goBack : undefined}
        onExit={() => navigate("/")}
      />

      {/* Resume banner */}
      {resumedFromSaved && (
        <div
          className="px-4 py-3 flex items-center justify-between gap-3"
          style={{ backgroundColor: "var(--blue-soft)", borderBottom: "1px solid #BFDBFE" }}
        >
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#1E40AF" }}>
            Picking up where you left off.
          </p>
          <div className="flex gap-3">
            <button
              onClick={dismissResume}
              className="border-0 bg-transparent cursor-pointer"
              style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--blue)" }}
            >
              Continue
            </button>
            <button
              onClick={restart}
              className="border-0 bg-transparent cursor-pointer"
              style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)" }}
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {step === 1 && <Step1Welcome onBegin={goNext} />}

      {step === 2 && (
        <Step2StopBang
          answers={stopBangAnswers}
          onChange={setStopBang}
          onNext={goNext}
          isComplete={isCurrentStepComplete}
        />
      )}

      {step === 3 && (
        <ZoneStep
          zoneConfig={noseConfig}
          zoneKey="nose"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          nextLabel="Continue to Palate & Tonsils →"
          isComplete={isCurrentStepComplete}
          stepNum={3}
        />
      )}

      {step === 4 && (
        <ZoneStep
          zoneConfig={palateConfig}
          zoneKey="palate"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          nextLabel="Continue to Jaw & Tongue →"
          isComplete={isCurrentStepComplete}
          stepNum={4}
        />
      )}

      {step === 5 && (
        <ZoneStep
          zoneConfig={mandibleConfig}
          zoneKey="mandible"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          nextLabel="Continue to Neck →"
          isComplete={isCurrentStepComplete}
          stepNum={5}
        />
      )}

      {step === 6 && (
        <ZoneStep
          zoneConfig={neckConfig}
          zoneKey="neck"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          nextLabel="See My Results →"
          isComplete={isCurrentStepComplete}
          stepNum={6}
        />
      )}
    </div>
  );
}

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAssessment } from "@/hooks/useAssessment";
import { ProgressTopBar } from "@/components/layout/ProgressTopBar";
import { TOTAL_ASSESSMENT_STEPS, ASSESSMENT_STEP_NAMES } from "@/lib/assessment-types";
import { ZONE_QUESTIONS } from "@/lib/questionnaires";
import { Step1Welcome } from "./Step1Welcome";
import { Step2MedicalHistory } from "./Step2MedicalHistory";
import { Step3Bmi } from "./Step3Bmi";
import { Step4StopBang } from "./Step4StopBang";
import { Step5Isi } from "./Step5Isi";
import { Step6Plato } from "./Step6Plato";
import { ZoneStep } from "@/pages/screener/ZoneStep";
import { Step11Palm } from "./Step11Palm";

export default function AssessmentPage() {
  const [, navigate] = useLocation();
  const {
    step,
    medicalHistory,
    bmi,
    stopBang,
    isi,
    plato,
    zoneAnswers,
    palm,
    resumedFromSaved,
    screenerPrefilled,
    setMedicalHistory,
    setBmi,
    setStopBang,
    setIsi,
    setPlato,
    setZones,
    setPalm,
    dismissResume,
    restart,
    goNext,
    goBack,
    computeAndFinish,
    isCurrentStepComplete,
    isStepComplete,
  } = useAssessment();

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const noseConfig = ZONE_QUESTIONS.find((z) => z.zone === "nose")!;
  const palateConfig = ZONE_QUESTIONS.find((z) => z.zone === "palate")!;
  const mandibleConfig = ZONE_QUESTIONS.find((z) => z.zone === "mandible")!;
  const neckConfig = ZONE_QUESTIONS.find((z) => z.zone === "neck")!;

  const showBack = step > 1;
  const stepName = ASSESSMENT_STEP_NAMES[step] ?? "";

  const handleFinish = () => {
    computeAndFinish();
    navigate("/assessment/results");
  };

  return (
    <div style={{ paddingTop: "56px", minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>
      <ProgressTopBar
        step={step}
        totalSteps={TOTAL_ASSESSMENT_STEPS}
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

      {step === 1 && (
        <Step1Welcome
          onStart={goNext}
          onSkip={goNext}
        />
      )}

      {step === 2 && (
        <Step2MedicalHistory
          answers={medicalHistory}
          onChange={setMedicalHistory}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}

      {step === 3 && (
        <Step3Bmi
          bmi={bmi}
          onChange={setBmi}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}

      {step === 4 && (
        <Step4StopBang
          answers={stopBang}
          onChange={setStopBang}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
          screenerPrefilled={screenerPrefilled}
          bmiAutoFilled={bmi.calculatedBmi !== null && bmi.calculatedBmi >= 35}
        />
      )}

      {step === 5 && (
        <Step5Isi
          answers={isi}
          onChange={setIsi}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}

      {step === 6 && (
        <Step6Plato
          answers={plato}
          onChange={setPlato}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}

      {step === 7 && (
        <ZoneStep
          zoneConfig={noseConfig}
          zoneKey="nose"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          onBack={goBack}
          nextLabel="Continue to Palate & Tonsils →"
          isComplete={isStepComplete(7)}
          stepNum={7}
          zoneIndex={1}
        />
      )}

      {step === 8 && (
        <ZoneStep
          zoneConfig={palateConfig}
          zoneKey="palate"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          onBack={goBack}
          nextLabel="Continue to Jaw & Tongue →"
          isComplete={isStepComplete(8)}
          stepNum={8}
          zoneIndex={2}
        />
      )}

      {step === 9 && (
        <ZoneStep
          zoneConfig={mandibleConfig}
          zoneKey="mandible"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          onBack={goBack}
          nextLabel="Continue to Neck →"
          isComplete={isStepComplete(9)}
          stepNum={9}
          zoneIndex={3}
        />
      )}

      {step === 10 && (
        <ZoneStep
          zoneConfig={neckConfig}
          zoneKey="neck"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          onBack={goBack}
          nextLabel="Continue to Step 3: What Can Help →"
          isComplete={isStepComplete(10)}
          stepNum={10}
          zoneIndex={4}
        />
      )}

      {step === 11 && (
        <Step11Palm
          answers={palm}
          onChange={setPalm}
          onFinish={handleFinish}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}
    </div>
  );
}

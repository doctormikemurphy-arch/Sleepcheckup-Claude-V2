import { StepLayout } from "./StepLayout";
import { ZoneAirwaySelfCheck } from "./ZoneAirwaySelfCheck";
import type { ZoneAnswers, ZoneQuestionSet } from "@/lib/types";

interface ZoneStepProps {
  answers: ZoneAnswers;
  onChange: (answers: ZoneAnswers) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}

function isZoneComplete(zoneAnswers: ZoneQuestionSet, zone: string): boolean {
  const baseComplete = zoneAnswers.q1 !== null && zoneAnswers.q2 !== null && zoneAnswers.q3 !== null;
  if (zone === "nose") {
    return baseComplete && zoneAnswers.q4 !== null && zoneAnswers.q5 !== null;
  }
  return baseComplete;
}

export function ZoneStep({ answers, onChange, onBack, onNext, nextLabel = "What Can Help?" }: ZoneStepProps) {
  const allZonesComplete =
    isZoneComplete(answers.nose, "nose") &&
    isZoneComplete(answers.palate, "palate") &&
    isZoneComplete(answers.mandible, "mandible") &&
    isZoneComplete(answers.neck, "neck");

  return (
    <StepLayout
      title="Step 2: Where Can the Airway Narrow?"
      subtitle="Identify the areas where your airway may be causing your snoring or sleep apnea."
      onBack={onBack}
      onNext={onNext}
      nextLabel={allZonesComplete ? nextLabel : "Complete All 4 Zones Above"}
      nextDisabled={!allZonesComplete}
      titleColor="green"
    >
      <ZoneAirwaySelfCheck answers={answers} onChange={onChange} />
    </StepLayout>
  );
}

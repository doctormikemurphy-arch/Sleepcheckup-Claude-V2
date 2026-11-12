import type { AssessmentState } from "./assessment-types";
import type { MurphyPathwayId, PatientProfile } from "./types";
import {
  scoreStopBang, scoreIsi, scorePlato, scorePalm,
  scoreZones, scoreMedicalHistory, scoreAnatomy,
} from "./scoring";
import { assignMurphyPathway } from "./pathways";

export interface AssessmentResult {
  profile: PatientProfile;
  pathway: MurphyPathwayId;
  bmiValue: number | null;
}

/**
 * Scores a set of assessment answers and assigns the Murphy Method pathway.
 * Shared by the results page, the PDF report, and the admin Pathway Preview,
 * so all three always compute results the same way. Pure: no storage, no network.
 */
export function buildAssessmentResult(saved: AssessmentState): AssessmentResult {
  // Older saved states used different field names; keep reading them.
  const legacy = saved as any;
  const { score: stopBangScore, risk: osaRisk } = scoreStopBang(saved.stopBang ?? legacy.stopBangAnswers ?? {});
  const { score: isiScore, severity: insomniaSeverity } = scoreIsi(saved.isi ?? legacy.isiAnswers ?? {});
  const plato = scorePlato(saved.plato ?? legacy.platoAnswers ?? {});
  const palm = scorePalm(saved.palm ?? legacy.palmAnswers ?? {});
  const zones = scoreZones(saved.zoneAnswers ?? {});
  const medicalHistory = scoreMedicalHistory(saved.medicalHistory ?? legacy.medicalHistoryAnswers ?? {});
  const anatomy = scoreAnatomy(saved.zoneAnswers ?? {});
  const bmiValue = saved.bmi?.calculatedBmi ?? legacy.bmiData?.calculatedBmi ?? null;

  const profile: PatientProfile = {
    stopBangScore, osaRisk, isiScore, insomniaSeverity,
    plato, palm, zones, medicalHistory, anatomy, bmiValue,
    comorbidities: medicalHistory.answeredYes,
  };
  return { profile, pathway: assignMurphyPathway(profile), bmiValue };
}

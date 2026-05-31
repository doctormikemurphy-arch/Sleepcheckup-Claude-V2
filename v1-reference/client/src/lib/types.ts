export type OsaRisk = "low" | "intermediate" | "high";
export type InsomniaSeverity = "none_mild" | "subthreshold" | "moderate" | "severe";

// PALM Classification types
export interface PalmSectionAnswers {
  q1: boolean | null;
  q2: boolean | null;
  q3: boolean | null;
  q4?: boolean | null;
}

export interface PalmAnswers {
  pcrit: PalmSectionAnswers;      // P - Airway Narrowing (3 questions)
  arousal: PalmSectionAnswers;    // A - Arousal Threshold (3 questions)
  loopGain: PalmSectionAnswers;   // L - Loop Gain (4 questions)
  muscle: PalmSectionAnswers;     // M - Muscle Responsiveness (4 questions)
}

export interface PalmSectionScore {
  score: number;
  isPositive: boolean;  // ≥2 "Yes" answers = positive flag
  positiveQuestions: string[];  // Text of questions answered "Yes"
}

export interface PalmScore {
  pcrit: PalmSectionScore;
  arousal: PalmSectionScore;
  loopGain: PalmSectionScore;
  muscle: PalmSectionScore;
  totalPositiveSections: number;  // 0-4, how many sections flagged positive
}

export interface PlatoProfile {
  sectionAScore: number;  // Questions 1-8, max 32
  sectionBScore: number;  // Questions 1-2 (Q9-10), max 8
  sectionCScore: number;  // Sleep quality transformed, max 4
  totalScore: number;     // Sum of all sections, max 44
  sleepQualityRaw: number; // Original 0-10 rating for display
}

export interface ZoneScores {
  nose: number;
  palate: number;
  mandible: number;
  neck: number;
}

export interface MedicalHistoryScore {
  totalScore: number;  // Sum of all answers: Yes=1, No=0, max 8
  answeredYes: string[];  // List of conditions answered "Yes"
  isPositive: boolean;  // true if totalScore >= 1
}

export interface ZoneResponses {
  answeredYes: string[];    // List of question text answered "Yes"
}

export interface AnatomyScore {
  noseScore: number;      // Nose zone: 5 questions, max 5
  palateScore: number;    // Palate & Tonsils: 3 questions, max 3
  mandibleScore: number;  // Mandible & Tongue: 3 questions, max 3
  neckScore: number;      // Neck: 3 questions, max 3
  totalScore: number;     // Overall score, max 14
  noseIsPositive: boolean;     // true if noseScore >= 1
  palateIsPositive: boolean;   // true if palateScore >= 1
  mandibleIsPositive: boolean; // true if mandibleScore >= 1
  neckIsPositive: boolean;     // true if neckScore >= 1
  isPositive: boolean;         // true if totalScore >= 1
  noseResponses: ZoneResponses;
  palateResponses: ZoneResponses;
  mandibleResponses: ZoneResponses;
  neckResponses: ZoneResponses;
}

export interface PatientProfile {
  stopBangScore: number;
  osaRisk: OsaRisk;
  isiScore: number;
  insomniaSeverity: InsomniaSeverity;
  plato: PlatoProfile;
  zones: ZoneScores;
  medicalHistory: MedicalHistoryScore;
  anatomy: AnatomyScore;
  palm: PalmScore;
  bmiValue: number | null;
  comorbidities: string[];
  mainComplaint?: string;
}

export type MurphyPathwayId =
  | "A_insomnia"
  | "B_obesity"
  | "C_nasal"
  | "D_mandible"
  | "E_multilevel"
  | "F_physiology"
  | "G_low_risk"
  | "H_complex";

export interface PathwayDefinition {
  id: MurphyPathwayId;
  title: string;
  shortDescription: string;
  educationalSummary: string;
}

export interface StopBangAnswers {
  snoring: boolean | null;
  tired: boolean | null;
  observed: boolean | null;
  pressure: boolean | null;
  bmi: boolean | null;
  age: boolean | null;
  neck: boolean | null;
  gender: boolean | null;
}

export interface IsiAnswers {
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
  q7: number | null;
}

export interface PlatoAnswers {
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
  q7: number | null;
  q8: number | null;
  q9: number | null;
  q10: number | null;
  q11: number | null;
}

export type ZoneQuestionAnswer = "yes" | "no" | null;
export type MedicalHistoryAnswer = "yes" | "no" | null;

export interface ZoneQuestionSet {
  q1: ZoneQuestionAnswer;
  q2: ZoneQuestionAnswer;
  q3: ZoneQuestionAnswer;
  q4?: ZoneQuestionAnswer;
  q5?: ZoneQuestionAnswer;
}

export interface ZoneAnswers {
  nose: ZoneQuestionSet;
  palate: ZoneQuestionSet;
  mandible: ZoneQuestionSet;
  neck: ZoneQuestionSet;
}

export interface MedicalHistoryAnswers {
  heartDisease: MedicalHistoryAnswer;
  highBloodPressure: MedicalHistoryAnswer;
  diabetes: MedicalHistoryAnswer;
  stroke: MedicalHistoryAnswer;
  asthma: MedicalHistoryAnswer;
  anxiety: MedicalHistoryAnswer;
  acidReflux: MedicalHistoryAnswer;
  thyroidDisorder: MedicalHistoryAnswer;
}

export type HeightUnit = "inches" | "cm";
export type WeightUnit = "lbs" | "kg";

export interface BmiData {
  heightValue: number | null;
  heightUnit: HeightUnit;
  weightValue: number | null;
  weightUnit: WeightUnit;
  calculatedBmi: number | null;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface AssessmentState {
  currentStep: WizardStep;
  medicalHistoryAnswers: MedicalHistoryAnswers;
  bmiData: BmiData;
  stopBangAnswers: StopBangAnswers;
  isiAnswers: IsiAnswers;
  platoAnswers: PlatoAnswers;
  palmAnswers: PalmAnswers;
  zoneAnswers: ZoneAnswers;
  comorbidities: string[];
  mainComplaint: string;
  profile: PatientProfile | null;
  assessmentDate?: string; // ISO string set when assessment is completed
}

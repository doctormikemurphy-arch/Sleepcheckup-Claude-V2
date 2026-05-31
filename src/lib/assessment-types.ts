import type {
  StopBangAnswers,
  IsiAnswers,
  PlatoAnswers,
  ZoneAnswers,
  MedicalHistoryAnswers,
  PalmAnswers,
  PatientProfile,
} from "./types";

export interface BmiData {
  heightFt: number | null;
  heightIn: number | null;
  heightCm: number | null;
  heightUnit: "imperial" | "metric";
  weightLbs: number | null;
  weightKg: number | null;
  weightUnit: "lbs" | "kg";
  calculatedBmi: number | null;
}

export interface AssessmentState {
  step: number; // 1–11, then results at /assessment/report
  medicalHistory: MedicalHistoryAnswers;
  bmi: BmiData;
  stopBang: StopBangAnswers;
  isi: IsiAnswers;
  plato: PlatoAnswers;
  zoneAnswers: ZoneAnswers;
  palm: PalmAnswers;
  profile: PatientProfile | null;
  resumedFromSaved: boolean;
}

export const TOTAL_ASSESSMENT_STEPS = 11;

export const ASSESSMENT_STEP_NAMES: Record<number, string> = {
  1: "Welcome",
  2: "Medical History",
  3: "BMI Calculator",
  4: "STOP-BANG",
  5: "Insomnia Severity",
  6: "PLATO-11",
  7: "Airway — Nose",
  8: "Airway — Palate",
  9: "Airway — Mandible",
  10: "Airway — Neck",
  11: "Treatment Readiness",
};

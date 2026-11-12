// Admin Pathway Preview only: one realistic set of assessment answers per pathway.
// findSampleMismatches() runs each set through the real scoring + pathway logic, so if
// the pathway rules change and a sample stops landing on its pathway, the check fails.
import type { AssessmentState, BmiData } from "./assessment-types";
import type {
  MurphyPathwayId, StopBangAnswers, IsiAnswers, PlatoAnswers,
  ZoneQuestionSet, MedicalHistoryAnswers, PalmSectionAnswers,
} from "./types";
import { buildAssessmentResult } from "./build-assessment-result";

const yn = (on: boolean) => (on ? "yes" : "no") as "yes" | "no";

/** STOP-BANG: the first `count` items answered yes, the rest no. */
function stopBang(count: number): StopBangAnswers {
  const keys = ["snoring", "tired", "observed", "pressure", "bmi", "age", "neck", "gender"] as const;
  return Object.fromEntries(keys.map((k, i) => [k, i < count])) as unknown as StopBangAnswers;
}

/** ISI: seven answers (0–4 each). */
function isi(values: [number, number, number, number, number, number, number]): IsiAnswers {
  const [q1, q2, q3, q4, q5, q6, q7] = values;
  return { q1, q2, q3, q4, q5, q6, q7 };
}

const plato: PlatoAnswers = { q1: 2, q2: 1, q3: 2, q4: 1, q5: 1, q6: 2, q7: 1, q8: 1, q9: 1, q10: 2, q11: 5 };

/** Zone answers: the first `yesCount` questions answered yes. */
function zone(yesCount: number, size: 3 | 5 = 3): ZoneQuestionSet {
  const set: ZoneQuestionSet = { q1: yn(yesCount > 0), q2: yn(yesCount > 1), q3: yn(yesCount > 2) };
  if (size === 5) { set.q4 = yn(yesCount > 3); set.q5 = yn(yesCount > 4); }
  return set;
}

/** PALM section: the first `yesCount` questions answered yes. */
function palm(yesCount: number, size: 3 | 4): PalmSectionAnswers {
  const set: PalmSectionAnswers = { q1: yesCount > 0, q2: yesCount > 1, q3: yesCount > 2 };
  if (size === 4) set.q4 = yesCount > 3;
  return set;
}

function medical(yes: (keyof MedicalHistoryAnswers)[]): MedicalHistoryAnswers {
  const keys: (keyof MedicalHistoryAnswers)[] = [
    "heartDisease", "highBloodPressure", "diabetes", "stroke", "asthma", "anxiety", "acidReflux", "thyroidDisorder",
  ];
  return Object.fromEntries(keys.map((k) => [k, yn(yes.includes(k))])) as unknown as MedicalHistoryAnswers;
}

function bmi(value: number): BmiData {
  return { heightFt: null, heightIn: null, heightCm: null, heightUnit: "imperial", weightLbs: null, weightKg: null, weightUnit: "lbs", calculatedBmi: value };
}

interface SampleSpec {
  stopBang: number;
  isi: [number, number, number, number, number, number, number];
  bmi: number;
  zones: { nose: number; palate: number; mandible: number; neck: number };
  palm: { pcrit: number; arousal: number; loopGain: number; muscle: number };
  medical: (keyof MedicalHistoryAnswers)[];
}

function toState(s: SampleSpec): AssessmentState {
  return {
    step: 11,
    medicalHistory: medical(s.medical),
    bmi: bmi(s.bmi),
    stopBang: stopBang(s.stopBang),
    isi: isi(s.isi),
    plato,
    zoneAnswers: {
      nose: zone(s.zones.nose, 5),
      palate: zone(s.zones.palate),
      mandible: zone(s.zones.mandible),
      neck: zone(s.zones.neck),
    },
    palm: {
      pcrit: palm(s.palm.pcrit, 3),
      arousal: palm(s.palm.arousal, 3),
      loopGain: palm(s.palm.loopGain, 4),
      muscle: palm(s.palm.muscle, 4),
    },
    profile: null,
    resumedFromSaved: false,
  };
}

export const PREVIEW_PATHWAYS: { id: MurphyPathwayId; letter: string; summary: string }[] = [
  { id: "A_insomnia",   letter: "A", summary: "Intermediate risk, moderate insomnia (ISI 21)" },
  { id: "B_obesity",    letter: "B", summary: "High risk, BMI 34" },
  { id: "C_nasal",      letter: "C", summary: "Intermediate risk, nose zone 3/5" },
  { id: "D_mandible",   letter: "D", summary: "Intermediate risk, jaw & tongue zone 2/3" },
  { id: "E_multilevel", letter: "E", summary: "High risk, palate 2/3 and jaw & tongue 2/3" },
  { id: "F_physiology", letter: "F", summary: "Intermediate risk, low anatomy, loop gain 2/4" },
  { id: "G_low_risk",   letter: "G", summary: "Low risk (STOP-BANG 2), anatomy total 3" },
  { id: "H_complex",    letter: "H", summary: "Intermediate risk, palate 2/3 only, no PALM flags" },
];

const SPECS: Record<MurphyPathwayId, SampleSpec> = {
  A_insomnia: {
    stopBang: 4, isi: [3, 3, 3, 3, 3, 3, 3], bmi: 27.4,
    zones: { nose: 1, palate: 1, mandible: 1, neck: 0 },
    palm: { pcrit: 1, arousal: 2, loopGain: 1, muscle: 0 },
    medical: ["highBloodPressure"],
  },
  B_obesity: {
    stopBang: 6, isi: [1, 1, 1, 1, 1, 1, 1], bmi: 34.2,
    zones: { nose: 1, palate: 1, mandible: 1, neck: 2 },
    palm: { pcrit: 2, arousal: 0, loopGain: 1, muscle: 1 },
    medical: ["highBloodPressure", "diabetes"],
  },
  C_nasal: {
    stopBang: 3, isi: [1, 1, 2, 1, 1, 1, 1], bmi: 25.8,
    zones: { nose: 3, palate: 1, mandible: 0, neck: 0 },
    palm: { pcrit: 1, arousal: 0, loopGain: 0, muscle: 1 },
    medical: [],
  },
  D_mandible: {
    stopBang: 4, isi: [1, 1, 1, 2, 1, 1, 1], bmi: 26.9,
    zones: { nose: 1, palate: 0, mandible: 2, neck: 1 },
    palm: { pcrit: 2, arousal: 0, loopGain: 0, muscle: 1 },
    medical: ["acidReflux"],
  },
  E_multilevel: {
    stopBang: 5, isi: [1, 2, 1, 1, 1, 1, 1], bmi: 28.6,
    zones: { nose: 1, palate: 2, mandible: 2, neck: 1 },
    palm: { pcrit: 2, arousal: 1, loopGain: 1, muscle: 1 },
    medical: ["highBloodPressure"],
  },
  F_physiology: {
    stopBang: 3, isi: [1, 1, 1, 1, 1, 1, 1], bmi: 24.6,
    zones: { nose: 1, palate: 1, mandible: 1, neck: 0 },
    palm: { pcrit: 0, arousal: 1, loopGain: 2, muscle: 1 },
    medical: ["heartDisease"],
  },
  G_low_risk: {
    stopBang: 2, isi: [1, 1, 0, 1, 1, 0, 1], bmi: 24.1,
    zones: { nose: 1, palate: 1, mandible: 1, neck: 0 },
    palm: { pcrit: 1, arousal: 0, loopGain: 0, muscle: 0 },
    medical: [],
  },
  H_complex: {
    stopBang: 3, isi: [1, 1, 1, 1, 1, 1, 1], bmi: 27.0,
    zones: { nose: 1, palate: 2, mandible: 1, neck: 1 },
    palm: { pcrit: 1, arousal: 1, loopGain: 1, muscle: 1 },
    medical: ["stroke"],
  },
};

export const SAMPLE_ANSWERS: Record<MurphyPathwayId, AssessmentState> = Object.fromEntries(
  Object.entries(SPECS).map(([id, spec]) => [id, toState(spec)]),
) as Record<MurphyPathwayId, AssessmentState>;

/** Returns every sample whose answers don't land on the pathway they're meant to show. */
export function findSampleMismatches(): { expected: MurphyPathwayId; actual: MurphyPathwayId }[] {
  return PREVIEW_PATHWAYS
    .map(({ id }) => ({ expected: id, actual: buildAssessmentResult(SAMPLE_ANSWERS[id]).pathway }))
    .filter((r) => r.expected !== r.actual);
}

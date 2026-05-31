import type { AssessmentState } from "./types";

const BASE_ZONE_NO = { q1: "no" as const, q2: "no" as const, q3: "no" as const };
const BASE_ZONE_NO_5 = { q1: "no" as const, q2: "no" as const, q3: "no" as const, q4: "no" as const, q5: "no" as const };
const BASE_PALM_FALSE = { q1: false, q2: false, q3: false };
const BASE_PALM_FALSE_4 = { q1: false, q2: false, q3: false, q4: false };
const BASE_MED_HISTORY = {
  heartDisease: "no" as const, highBloodPressure: "no" as const,
  diabetes: "no" as const, stroke: "no" as const,
  asthma: "no" as const, anxiety: "no" as const,
  acidReflux: "no" as const, thyroidDisorder: "no" as const,
};

// Intermediate OSA risk (3 yes on STOP-BANG)
const STOPBANG_INTERMEDIATE = {
  snoring: true, tired: true, observed: true,
  pressure: false, bmi: false, age: false, neck: false, gender: false,
};

// Low ISI (none_mild, sum = 0)
const ISI_LOW = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0 };

// Moderate PLATO answers (representative mid-range)
const PLATO_MODERATE = {
  q1: 2, q2: 2, q3: 2, q4: 2, q5: 1, q6: 1, q7: 1, q8: 1, q9: 2, q10: 2, q11: 4,
};

// Low risk BMI
const BMI_NORMAL = {
  heightValue: 70, heightUnit: "inches" as const,
  weightValue: 175, weightUnit: "lbs" as const,
  calculatedBmi: 25.1,
};

// Obese BMI
const BMI_OBESE = {
  heightValue: 68, heightUnit: "inches" as const,
  weightValue: 225, weightUnit: "lbs" as const,
  calculatedBmi: 34.2,
};

export const DEV_MOCK_ASSESSMENTS: Record<string, AssessmentState> = {
  // ─── Pathway A: OSA with Insomnia ─────────────────────────────────────────
  // Rule: hasElevatedOsaRisk && isiScore >= 15
  A: {
    currentStep: 5,
    stopBangAnswers: STOPBANG_INTERMEDIATE,
    isiAnswers: { q1: 3, q2: 3, q3: 3, q4: 3, q5: 3, q6: 0, q7: 0 }, // sum = 15
    platoAnswers: { q1: 3, q2: 3, q3: 3, q4: 2, q5: 2, q6: 2, q7: 2, q8: 2, q9: 2, q10: 2, q11: 2 },
    palmAnswers: {
      pcrit: BASE_PALM_FALSE,
      arousal: BASE_PALM_FALSE,
      loopGain: BASE_PALM_FALSE_4,
      muscle: BASE_PALM_FALSE_4,
    },
    zoneAnswers: {
      nose: BASE_ZONE_NO_5,
      palate: BASE_ZONE_NO,
      mandible: BASE_ZONE_NO,
      neck: BASE_ZONE_NO,
    },
    bmiData: BMI_NORMAL,
    medicalHistoryAnswers: { ...BASE_MED_HISTORY, highBloodPressure: "yes" },
    comorbidities: ["High Blood Pressure"],
    mainComplaint: "I have trouble falling and staying asleep most nights.",
    profile: null,
  },

  // ─── Pathway B: OSA with Obesity ──────────────────────────────────────────
  // Rule: hasElevatedOsaRisk && bmiValue >= 30 (ISI < 15, arousal score < 3)
  B: {
    currentStep: 5,
    stopBangAnswers: { ...STOPBANG_INTERMEDIATE, bmi: true }, // 4 = intermediate still
    isiAnswers: { q1: 2, q2: 2, q3: 1, q4: 2, q5: 2, q6: 2, q7: 1 }, // sum = 12, subthreshold
    platoAnswers: PLATO_MODERATE,
    palmAnswers: {
      pcrit: { q1: true, q2: true, q3: false },
      arousal: BASE_PALM_FALSE,
      loopGain: BASE_PALM_FALSE_4,
      muscle: BASE_PALM_FALSE_4,
    },
    zoneAnswers: {
      nose: { q1: "yes" as const, q2: "no" as const, q3: "no" as const, q4: "no" as const, q5: "no" as const },
      palate: { q1: "yes" as const, q2: "no" as const, q3: "no" as const },
      mandible: BASE_ZONE_NO,
      neck: { q1: "yes" as const, q2: "no" as const, q3: "no" as const },
    },
    bmiData: BMI_OBESE,
    medicalHistoryAnswers: { ...BASE_MED_HISTORY, diabetes: "yes", highBloodPressure: "yes" },
    comorbidities: ["Diabetes", "High Blood Pressure"],
    mainComplaint: "I snore loudly and feel exhausted every morning.",
    profile: null,
  },

  // ─── Pathway C: OSA with Nasal Problem ────────────────────────────────────
  // Rule: hasElevatedOsaRisk && noseZoneScore >= 2 (ISI < 15, arousal < 3, BMI < 30)
  C: {
    currentStep: 5,
    stopBangAnswers: STOPBANG_INTERMEDIATE,
    isiAnswers: ISI_LOW,
    platoAnswers: PLATO_MODERATE,
    palmAnswers: {
      pcrit: { q1: true, q2: false, q3: false },
      arousal: BASE_PALM_FALSE,
      loopGain: BASE_PALM_FALSE_4,
      muscle: BASE_PALM_FALSE_4,
    },
    zoneAnswers: {
      nose: { q1: "yes" as const, q2: "yes" as const, q3: "yes" as const, q4: "no" as const, q5: "no" as const },
      palate: { q1: "yes" as const, q2: "no" as const, q3: "no" as const },
      mandible: BASE_ZONE_NO,
      neck: BASE_ZONE_NO,
    },
    bmiData: BMI_NORMAL,
    medicalHistoryAnswers: BASE_MED_HISTORY,
    comorbidities: [],
    mainComplaint: "My nose feels blocked at night and I breathe through my mouth when sleeping.",
    profile: null,
  },

  // ─── Pathway D: OSA with Mandible & Tongue ────────────────────────────────
  // Rule: hasElevatedOsaRisk && BMI < 30 && nose < 2 && palate < 2 && mandible >= 2 && neck < 2
  D: {
    currentStep: 5,
    stopBangAnswers: STOPBANG_INTERMEDIATE,
    isiAnswers: ISI_LOW,
    platoAnswers: PLATO_MODERATE,
    palmAnswers: {
      pcrit: { q1: true, q2: true, q3: false },
      arousal: BASE_PALM_FALSE,
      loopGain: BASE_PALM_FALSE_4,
      muscle: { q1: true, q2: true, q3: false, q4: false },
    },
    zoneAnswers: {
      nose: { q1: "yes" as const, q2: "no" as const, q3: "no" as const, q4: "no" as const, q5: "no" as const },
      palate: { q1: "yes" as const, q2: "no" as const, q3: "no" as const },
      mandible: { q1: "yes" as const, q2: "yes" as const, q3: "yes" as const },
      neck: BASE_ZONE_NO,
    },
    bmiData: BMI_NORMAL,
    medicalHistoryAnswers: BASE_MED_HISTORY,
    comorbidities: [],
    mainComplaint: "My jaw feels like it falls back when I sleep and I wake up gasping.",
    profile: null,
  },

  // ─── Pathway E: OSA with Multiple Level Obstruction ───────────────────────
  // Rule: hasElevatedOsaRisk && (palate >= 2) + (mandible >= 2) + (neck >= 2) >= 2
  E: {
    currentStep: 5,
    stopBangAnswers: { ...STOPBANG_INTERMEDIATE, neck: true }, // 4 = intermediate
    isiAnswers: ISI_LOW,
    platoAnswers: PLATO_MODERATE,
    palmAnswers: {
      pcrit: { q1: true, q2: true, q3: false },
      arousal: BASE_PALM_FALSE,
      loopGain: BASE_PALM_FALSE_4,
      muscle: BASE_PALM_FALSE_4,
    },
    zoneAnswers: {
      nose: { q1: "yes" as const, q2: "no" as const, q3: "no" as const, q4: "no" as const, q5: "no" as const },
      palate: { q1: "yes" as const, q2: "yes" as const, q3: "yes" as const },
      mandible: { q1: "yes" as const, q2: "yes" as const, q3: "no" as const },
      neck: { q1: "yes" as const, q2: "yes" as const, q3: "yes" as const },
    },
    bmiData: { heightValue: 70, heightUnit: "inches" as const, weightValue: 195, weightUnit: "lbs" as const, calculatedBmi: 28.0 },
    medicalHistoryAnswers: { ...BASE_MED_HISTORY, highBloodPressure: "yes" },
    comorbidities: ["High Blood Pressure"],
    mainComplaint: "I snore constantly, feel exhausted during the day, and my partner has watched me stop breathing.",
    profile: null,
  },

  // ─── Pathway F: OSA with Physiology Problem ───────────────────────────────
  // Rule: hasElevatedOsaRisk && allAnatomyLow (<2) && loopGain >= 2
  F: {
    currentStep: 5,
    stopBangAnswers: STOPBANG_INTERMEDIATE,
    isiAnswers: ISI_LOW,
    platoAnswers: PLATO_MODERATE,
    palmAnswers: {
      pcrit: BASE_PALM_FALSE,
      arousal: BASE_PALM_FALSE,
      loopGain: { q1: true, q2: true, q3: true, q4: true },
      muscle: BASE_PALM_FALSE_4,
    },
    zoneAnswers: {
      nose: { q1: "yes" as const, q2: "no" as const, q3: "no" as const, q4: "no" as const, q5: "no" as const },
      palate: { q1: "yes" as const, q2: "no" as const, q3: "no" as const },
      mandible: { q1: "yes" as const, q2: "no" as const, q3: "no" as const },
      neck: BASE_ZONE_NO,
    },
    bmiData: BMI_NORMAL,
    medicalHistoryAnswers: BASE_MED_HISTORY,
    comorbidities: [],
    mainComplaint: "My breathing seems to go in waves at night and I wake up gasping sometimes.",
    profile: null,
  },

  // ─── Pathway G: Low Risk / Snoring ────────────────────────────────────────
  // Rule: osaRisk === "low" (STOP-BANG score <= 2)
  G: {
    currentStep: 5,
    stopBangAnswers: {
      snoring: true, tired: true, observed: false,
      pressure: false, bmi: false, age: false, neck: false, gender: false,
    }, // score = 2 → low risk
    isiAnswers: { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 0, q7: 0 }, // sum = 5 → none_mild
    platoAnswers: { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1, q7: 1, q8: 1, q9: 2, q10: 1, q11: 7 },
    palmAnswers: {
      pcrit: BASE_PALM_FALSE,
      arousal: BASE_PALM_FALSE,
      loopGain: BASE_PALM_FALSE_4,
      muscle: BASE_PALM_FALSE_4,
    },
    zoneAnswers: {
      nose: { q1: "yes" as const, q2: "no" as const, q3: "no" as const, q4: "no" as const, q5: "no" as const },
      palate: { q1: "yes" as const, q2: "yes" as const, q3: "no" as const },
      mandible: { q1: "yes" as const, q2: "no" as const, q3: "no" as const },
      neck: BASE_ZONE_NO,
    },
    bmiData: BMI_NORMAL,
    medicalHistoryAnswers: BASE_MED_HISTORY,
    comorbidities: [],
    mainComplaint: "My partner says I snore but I generally feel okay during the day.",
    profile: null,
  },

  // ─── Pathway H: Complex / Mixed ───────────────────────────────────────────
  // Rule: catch-all — intermediate risk, no strong anatomy or physiology pattern
  H: {
    currentStep: 5,
    stopBangAnswers: STOPBANG_INTERMEDIATE,
    isiAnswers: ISI_LOW,
    platoAnswers: PLATO_MODERATE,
    palmAnswers: {
      pcrit: BASE_PALM_FALSE,
      arousal: BASE_PALM_FALSE,
      loopGain: BASE_PALM_FALSE_4,
      muscle: BASE_PALM_FALSE_4,
    },
    zoneAnswers: {
      nose: { q1: "yes" as const, q2: "no" as const, q3: "no" as const, q4: "no" as const, q5: "no" as const },
      palate: { q1: "yes" as const, q2: "no" as const, q3: "no" as const },
      mandible: { q1: "yes" as const, q2: "no" as const, q3: "no" as const },
      neck: BASE_ZONE_NO,
    },
    bmiData: BMI_NORMAL,
    medicalHistoryAnswers: { ...BASE_MED_HISTORY, acidReflux: "yes" },
    comorbidities: ["Acid Reflux"],
    mainComplaint: "I snore and feel tired but my situation doesn't fit a simple pattern.",
    profile: null,
  },
};

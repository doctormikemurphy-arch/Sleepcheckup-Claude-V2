import type {
  StopBangAnswers,
  IsiAnswers,
  PlatoAnswers,
  ZoneAnswers,
  MedicalHistoryAnswers,
  PalmAnswers,
  OsaRisk,
  InsomniaSeverity,
  PlatoProfile,
  ZoneScores,
  MedicalHistoryScore,
  AnatomyScore,
  PalmScore,
  PalmSectionScore,
  ZoneQuestionAnswer,
  ZoneResponses,
} from "./types";
import { ZONE_QUESTIONS, PALM_QUESTIONS } from "./questionnaires";

export function scoreStopBang(answers: StopBangAnswers): {
  score: number;
  risk: OsaRisk;
} {
  const values = Object.values(answers);
  const score = values.filter((v) => v === true).length;

  let risk: OsaRisk;
  if (score <= 2) {
    risk = "low";
  } else if (score <= 4) {
    risk = "intermediate";
  } else {
    risk = "high";
  }

  return { score, risk };
}

export function scoreIsi(answers: IsiAnswers): {
  score: number;
  severity: InsomniaSeverity;
} {
  const values = Object.values(answers);
  const score = values.reduce((sum, v) => sum + (v ?? 0), 0);

  let severity: InsomniaSeverity;
  if (score <= 7) {
    severity = "none_mild";
  } else if (score <= 14) {
    severity = "subthreshold";
  } else if (score <= 21) {
    severity = "moderate";
  } else {
    severity = "severe";
  }

  return { score, severity };
}

export function scorePlato(answers: PlatoAnswers): PlatoProfile {
  // Section A: Questions 1-8 (Never=0, Rarely=1, Sometimes=2, Often=3, Always=4)
  const sectionAScore =
    (answers.q1 ?? 0) +
    (answers.q2 ?? 0) +
    (answers.q3 ?? 0) +
    (answers.q4 ?? 0) +
    (answers.q5 ?? 0) +
    (answers.q6 ?? 0) +
    (answers.q7 ?? 0) +
    (answers.q8 ?? 0);

  // Section B: Questions 9-10 (Never=0, Rarely=1, Sometimes=2, Often=3, Always=4)
  const sectionBScore = (answers.q9 ?? 0) + (answers.q10 ?? 0);

  // Section C: Sleep quality (reverse scored)
  // Response 0-1 = 4, Response 2-3 = 3, Response 4-6 = 2, Response 7-8 = 1, Response 9-10 = 0
  const sleepQualityRaw = answers.q11 ?? 5;
  let sectionCScore: number;
  if (sleepQualityRaw <= 1) {
    sectionCScore = 4;
  } else if (sleepQualityRaw <= 3) {
    sectionCScore = 3;
  } else if (sleepQualityRaw <= 6) {
    sectionCScore = 2;
  } else if (sleepQualityRaw <= 8) {
    sectionCScore = 1;
  } else {
    sectionCScore = 0;
  }

  // Total Score: Sum of all sections (max 44)
  const totalScore = sectionAScore + sectionBScore + sectionCScore;

  return {
    sectionAScore,
    sectionBScore,
    sectionCScore,
    totalScore,
    sleepQualityRaw,
  };
}

export function scoreZones(answers: ZoneAnswers): ZoneScores {
  const countYes = (zone: ZoneAnswers[keyof ZoneAnswers], isNose: boolean = false) => {
    const values = [zone.q1, zone.q2, zone.q3];
    if (isNose) {
      if (zone.q4 !== undefined) values.push(zone.q4);
      if (zone.q5 !== undefined) values.push(zone.q5);
    }
    return values.filter((v) => v === "yes").length;
  };

  return {
    nose: countYes(answers.nose, true),
    palate: countYes(answers.palate),
    mandible: countYes(answers.mandible),
    neck: countYes(answers.neck),
  };
}

export function getOsaRiskLabel(risk: OsaRisk): string {
  switch (risk) {
    case "low":
      return "Low Risk";
    case "intermediate":
      return "Intermediate Risk";
    case "high":
      return "High Risk";
  }
}

export function getInsomniaSeverityLabel(severity: InsomniaSeverity): string {
  switch (severity) {
    case "none_mild":
      return "No Clinically Significant Insomnia";
    case "subthreshold":
      return "Subthreshold Insomnia";
    case "moderate":
      return "Moderate Insomnia";
    case "severe":
      return "Severe Insomnia";
  }
}

export function getZoneInterpretation(score: number): string {
  if (score === 0) {
    return "This area does not clearly stand out in your answers.";
  } else if (score === 1) {
    return "This area might play a role.";
  } else {
    return "This area is more likely to matter for your breathing during sleep.";
  }
}

const MEDICAL_HISTORY_LABELS: Record<keyof MedicalHistoryAnswers, string> = {
  heartDisease: "Heart Disease",
  highBloodPressure: "High Blood Pressure",
  diabetes: "Diabetes",
  stroke: "Stroke/TIA",
  asthma: "Asthma",
  anxiety: "Dementia",
  acidReflux: "Acid Reflux/GERD",
  thyroidDisorder: "Thyroid Disorder",
};

export function scoreMedicalHistory(answers: MedicalHistoryAnswers): MedicalHistoryScore {
  let totalScore = 0;
  const answeredYes: string[] = [];

  const keys = Object.keys(answers) as (keyof MedicalHistoryAnswers)[];
  
  for (const key of keys) {
    const answer = answers[key];
    const label = MEDICAL_HISTORY_LABELS[key];
    
    if (answer === "yes") {
      totalScore += 1;
      answeredYes.push(label);
    }
    // "no" = 0, null = 0
  }

  return {
    totalScore,
    answeredYes,
    isPositive: totalScore >= 1,
  };
}

function scoreZoneAnswer(answer: ZoneQuestionAnswer | undefined): number {
  if (answer === "yes") return 1;
  return 0; // "no", null, or undefined
}

function getZoneResponses(
  zone: "nose" | "palate" | "mandible" | "neck",
  answers: ZoneAnswers[typeof zone]
): ZoneResponses {
  const zoneConfig = ZONE_QUESTIONS.find((z) => z.zone === zone);
  const answeredYes: string[] = [];

  if (zoneConfig) {
    for (const question of zoneConfig.questions) {
      const key = question.fieldKey as keyof typeof answers;
      const answer = answers[key];
      if (answer === "yes") {
        answeredYes.push(question.text);
      }
    }
  }

  return { answeredYes };
}

// PALM Classification scoring
function scorePalmSection(
  sectionKey: "pcrit" | "arousal" | "loopGain" | "muscle",
  answers: PalmAnswers[typeof sectionKey]
): PalmSectionScore {
  const sectionConfig = PALM_QUESTIONS.find((s) => s.section === sectionKey);
  const positiveQuestions: string[] = [];
  let score = 0;

  if (sectionConfig) {
    for (const question of sectionConfig.questions) {
      const key = question.fieldKey as keyof typeof answers;
      if (answers[key] === true) {
        score++;
        positiveQuestions.push(question.text);
      }
    }
  }

  return {
    score,
    isPositive: score >= 2,  // ≥2 "Yes" answers = positive flag
    positiveQuestions,
  };
}

export function scorePalm(answers: PalmAnswers): PalmScore {
  const pcrit = scorePalmSection("pcrit", answers.pcrit);
  const arousal = scorePalmSection("arousal", answers.arousal);
  const loopGain = scorePalmSection("loopGain", answers.loopGain);
  const muscle = scorePalmSection("muscle", answers.muscle);

  const totalPositiveSections = [pcrit, arousal, loopGain, muscle].filter(
    (s) => s.isPositive
  ).length;

  return {
    pcrit,
    arousal,
    loopGain,
    muscle,
    totalPositiveSections,
  };
}

export function scoreAnatomy(answers: ZoneAnswers): AnatomyScore {
  // Nose: 5 questions (q1-q5), max 5
  const noseScore =
    scoreZoneAnswer(answers.nose.q1) +
    scoreZoneAnswer(answers.nose.q2) +
    scoreZoneAnswer(answers.nose.q3) +
    scoreZoneAnswer(answers.nose.q4) +
    scoreZoneAnswer(answers.nose.q5);

  // Palate & Tonsils: 3 questions, max 3
  const palateScore =
    scoreZoneAnswer(answers.palate.q1) +
    scoreZoneAnswer(answers.palate.q2) +
    scoreZoneAnswer(answers.palate.q3);

  // Mandible & Tongue: 3 questions, max 3
  const mandibleScore =
    scoreZoneAnswer(answers.mandible.q1) +
    scoreZoneAnswer(answers.mandible.q2) +
    scoreZoneAnswer(answers.mandible.q3);

  // Neck: 3 questions, max 3
  const neckScore =
    scoreZoneAnswer(answers.neck.q1) +
    scoreZoneAnswer(answers.neck.q2) +
    scoreZoneAnswer(answers.neck.q3);

  // Total: max 14
  const totalScore = noseScore + palateScore + mandibleScore + neckScore;

  // Track individual responses per zone
  const noseResponses = getZoneResponses("nose", answers.nose);
  const palateResponses = getZoneResponses("palate", answers.palate);
  const mandibleResponses = getZoneResponses("mandible", answers.mandible);
  const neckResponses = getZoneResponses("neck", answers.neck);

  return {
    noseScore,
    palateScore,
    mandibleScore,
    neckScore,
    totalScore,
    noseIsPositive: noseScore >= 1,
    palateIsPositive: palateScore >= 1,
    mandibleIsPositive: mandibleScore >= 1,
    neckIsPositive: neckScore >= 1,
    isPositive: totalScore >= 1,
    noseResponses,
    palateResponses,
    mandibleResponses,
    neckResponses,
  };
}

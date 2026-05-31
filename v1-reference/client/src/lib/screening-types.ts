import type {
  StopBangAnswers,
  ZoneAnswers,
  OsaRisk,
  AnatomyScore,
  ZoneScores,
} from "./types";

export type ScreeningStep = 1 | 2 | 3 | 4 | 5;

export interface ScreeningProfile {
  stopBangScore: number;
  osaRisk: OsaRisk;
  zones: ZoneScores;
  anatomy: AnatomyScore;
}

export interface ScreeningState {
  currentStep: ScreeningStep;
  stopBangAnswers: StopBangAnswers;
  zoneAnswers: ZoneAnswers;
  profile: ScreeningProfile | null;
}

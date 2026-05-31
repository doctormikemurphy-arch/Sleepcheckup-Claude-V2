import type { StopBangAnswers, ZoneAnswers, OsaRisk, AnatomyScore, ZoneScores } from "./types";

export interface ScreeningProfile {
  stopBangScore: number;
  osaRisk: OsaRisk;
  zones: ZoneScores;
  anatomy: AnatomyScore;
}

export interface ScreenerState {
  step: number; // 1–7 (step 7 = results)
  stopBangAnswers: StopBangAnswers;
  zoneAnswers: ZoneAnswers;
  profile: ScreeningProfile | null;
  resumedFromSaved: boolean;
}

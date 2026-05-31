import { useState, useEffect, useCallback } from "react";
import type {
  StopBangAnswers,
  ZoneAnswers,
  ZoneQuestionAnswer,
} from "@/lib/types";
import type { ScreeningStep, ScreeningState, ScreeningProfile } from "@/lib/screening-types";
import { scoreStopBang, scoreZones, scoreAnatomy } from "@/lib/scoring";

const STORAGE_KEY = "murphy_method_screening";

const initialStopBangAnswers: StopBangAnswers = {
  snoring: null,
  tired: null,
  observed: null,
  pressure: null,
  bmi: null,
  age: null,
  neck: null,
  gender: null,
};

const initialZoneAnswers: ZoneAnswers = {
  nose: { q1: null, q2: null, q3: null, q4: null, q5: null } as ZoneAnswers["nose"],
  palate: { q1: null, q2: null, q3: null } as ZoneAnswers["palate"],
  mandible: { q1: null, q2: null, q3: null } as ZoneAnswers["mandible"],
  neck: { q1: null, q2: null, q3: null } as ZoneAnswers["neck"],
};

const initialState: ScreeningState = {
  currentStep: 1,
  stopBangAnswers: initialStopBangAnswers,
  zoneAnswers: initialZoneAnswers,
  profile: null,
};

function migrateZoneAnswers(zone: { q1: unknown; q2: unknown; q3: unknown; q4?: unknown; q5?: unknown }, isNose: boolean = false): { q1: ZoneQuestionAnswer; q2: ZoneQuestionAnswer; q3: ZoneQuestionAnswer; q4?: ZoneQuestionAnswer; q5?: ZoneQuestionAnswer } {
  const migrate = (val: unknown): ZoneQuestionAnswer => {
    if (val === true) return "yes";
    if (val === false) return "no";
    if (val === "yes" || val === "no") return val;
    return null;
  };
  const result: { q1: ZoneQuestionAnswer; q2: ZoneQuestionAnswer; q3: ZoneQuestionAnswer; q4?: ZoneQuestionAnswer; q5?: ZoneQuestionAnswer } = {
    q1: migrate(zone.q1),
    q2: migrate(zone.q2),
    q3: migrate(zone.q3),
  };
  if (isNose) {
    result.q4 = migrate(zone.q4);
    result.q5 = migrate(zone.q5);
  }
  return result;
}

export function useScreening() {
  const [state, setState] = useState<ScreeningState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          if (parsed.zoneAnswers && typeof parsed.zoneAnswers === "object") {
            const zones = parsed.zoneAnswers as Record<string, { q1: unknown; q2: unknown; q3: unknown; q4?: unknown; q5?: unknown }>;
            parsed.zoneAnswers = {
              nose: migrateZoneAnswers(zones.nose || { q1: null, q2: null, q3: null, q4: null, q5: null }, true),
              palate: migrateZoneAnswers(zones.palate || { q1: null, q2: null, q3: null }),
              mandible: migrateZoneAnswers(zones.mandible || { q1: null, q2: null, q3: null }),
              neck: migrateZoneAnswers(zones.neck || { q1: null, q2: null, q3: null }),
            };
          }
          return { ...initialState, ...parsed };
        }
      }
    } catch {
      console.warn("Failed to load saved screening state");
    }
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      console.warn("Failed to save screening state");
    }
  }, [state]);

  const setCurrentStep = useCallback((step: ScreeningStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setStopBangAnswers = useCallback((answers: StopBangAnswers) => {
    setState((prev) => ({ ...prev, stopBangAnswers: answers }));
  }, []);

  const setZoneAnswers = useCallback((answers: ZoneAnswers) => {
    setState((prev) => ({ ...prev, zoneAnswers: answers }));
  }, []);

  const calculateProfile = useCallback((): ScreeningProfile => {
    const { score: stopBangScore, risk: osaRisk } = scoreStopBang(state.stopBangAnswers);
    const zones = scoreZones(state.zoneAnswers);
    const anatomy = scoreAnatomy(state.zoneAnswers);

    return {
      stopBangScore,
      osaRisk,
      zones,
      anatomy,
    };
  }, [state.stopBangAnswers, state.zoneAnswers]);

  const goToResults = useCallback(() => {
    const profile = calculateProfile();
    setState((prev) => ({ ...prev, profile, currentStep: 5 as ScreeningStep }));
  }, [calculateProfile]);

  const restart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, []);

  return {
    currentStep: state.currentStep,
    stopBangAnswers: state.stopBangAnswers,
    zoneAnswers: state.zoneAnswers,
    profile: state.profile,
    setCurrentStep,
    setStopBangAnswers,
    setZoneAnswers,
    goToResults,
    restart,
    calculateProfile,
  };
}

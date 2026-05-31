import { useState, useEffect, useCallback } from "react";
import type { StopBangAnswers, ZoneAnswers, ZoneQuestionAnswer } from "@/lib/types";
import type { ScreenerState, ScreeningProfile } from "@/lib/screener-types";
import { scoreStopBang, scoreZones, scoreAnatomy } from "@/lib/scoring";
import { KEYS, saveState, loadState, clearState } from "@/lib/storage";

export const TOTAL_SCREENER_STEPS = 7;

export const STEP_NAMES: Record<number, string> = {
  1: "Welcome",
  2: "STOP-BANG",
  3: "Airway — Nose",
  4: "Airway — Palate",
  5: "Airway — Mandible",
  6: "Airway — Neck",
  7: "Your Results",
};

const initialStopBang: StopBangAnswers = {
  snoring: null, tired: null, observed: null, pressure: null,
  bmi: null, age: null, neck: null, gender: null,
};

const initialZones: ZoneAnswers = {
  nose:     { q1: null, q2: null, q3: null, q4: null, q5: null },
  palate:   { q1: null, q2: null, q3: null },
  mandible: { q1: null, q2: null, q3: null },
  neck:     { q1: null, q2: null, q3: null },
};

const initialState: ScreenerState = {
  step: 1,
  stopBangAnswers: initialStopBang,
  zoneAnswers: initialZones,
  profile: null,
  resumedFromSaved: false,
};

function migrateZone(raw: Record<string, unknown>, isNose = false) {
  const m = (v: unknown): ZoneQuestionAnswer =>
    v === true ? "yes" : v === false ? "no" : (v === "yes" || v === "no" ? v : null);
  const out: ZoneAnswers["nose"] = { q1: m(raw.q1), q2: m(raw.q2), q3: m(raw.q3) };
  if (isNose) { out.q4 = m(raw.q4); out.q5 = m(raw.q5); }
  return out;
}

export function useScreener() {
  const [state, setState] = useState<ScreenerState>(() => {
    const saved = loadState<ScreenerState>(KEYS.screener);
    if (saved && typeof saved === "object" && saved.step) {
      // Migrate zone answer format if needed
      if (saved.zoneAnswers) {
        const z = saved.zoneAnswers as unknown as Record<string, Record<string, unknown>>;
        saved.zoneAnswers = {
          nose:     migrateZone(z.nose     ?? {}, true),
          palate:   migrateZone(z.palate   ?? {}),
          mandible: migrateZone(z.mandible ?? {}),
          neck:     migrateZone(z.neck     ?? {}),
        };
      }
      return { ...initialState, ...saved, resumedFromSaved: saved.step > 1 };
    }
    return initialState;
  });

  // Auto-save on every state change
  useEffect(() => {
    saveState(KEYS.screener, state);
  }, [state]);

  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step, resumedFromSaved: false }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, TOTAL_SCREENER_STEPS), resumedFromSaved: false }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1), resumedFromSaved: false }));
  }, []);

  const setStopBang = useCallback((answers: StopBangAnswers) => {
    setState((prev) => ({ ...prev, stopBangAnswers: answers }));
  }, []);

  const setZones = useCallback((answers: ZoneAnswers) => {
    setState((prev) => ({ ...prev, zoneAnswers: answers }));
  }, []);

  const computeProfile = useCallback((): ScreeningProfile => {
    const { score: stopBangScore, risk: osaRisk } = scoreStopBang(state.stopBangAnswers);
    return {
      stopBangScore,
      osaRisk,
      zones: scoreZones(state.zoneAnswers),
      anatomy: scoreAnatomy(state.zoneAnswers),
    };
  }, [state.stopBangAnswers, state.zoneAnswers]);

  const goToResults = useCallback(() => {
    const profile = computeProfile();
    // Read current saved state, patch profile in, and write synchronously.
    // This must happen before navigate() is called, because React 18 may
    // cancel a setState updater when the component unmounts mid-navigation.
    const current = loadState<ScreenerState>(KEYS.screener) ?? ({} as ScreenerState);
    saveState(KEYS.screener, { ...current, profile, step: 7, resumedFromSaved: false });
    setState((prev) => ({ ...prev, profile, step: 7, resumedFromSaved: false }));
  }, [computeProfile]);

  const restart = useCallback(() => {
    clearState(KEYS.screener);
    setState(initialState);
  }, []);

  const dismissResume = useCallback(() => {
    setState((prev) => ({ ...prev, resumedFromSaved: false }));
  }, []);

  // Step completeness checks
  const isStopBangComplete = Object.values(state.stopBangAnswers).every((v) => v !== null);
  const isNoseComplete = ["q1","q2","q3","q4","q5"].every((k) => state.zoneAnswers.nose[k as keyof typeof state.zoneAnswers.nose] !== null);
  const isPalateComplete = ["q1","q2","q3"].every((k) => state.zoneAnswers.palate[k as keyof typeof state.zoneAnswers.palate] !== null);
  const isMandibleComplete = ["q1","q2","q3"].every((k) => state.zoneAnswers.mandible[k as keyof typeof state.zoneAnswers.mandible] !== null);
  const isNeckComplete = ["q1","q2","q3"].every((k) => state.zoneAnswers.neck[k as keyof typeof state.zoneAnswers.neck] !== null);

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return true;
      case 2: return isStopBangComplete;
      case 3: return isNoseComplete;
      case 4: return isPalateComplete;
      case 5: return isMandibleComplete;
      case 6: return isNeckComplete;
      default: return true;
    }
  };

  return {
    step: state.step,
    totalSteps: TOTAL_SCREENER_STEPS,
    stepName: STEP_NAMES[state.step] ?? "",
    percentComplete: Math.round(((state.step - 1) / TOTAL_SCREENER_STEPS) * 100),
    stopBangAnswers: state.stopBangAnswers,
    zoneAnswers: state.zoneAnswers,
    profile: state.profile,
    resumedFromSaved: state.resumedFromSaved,
    setStep,
    goNext,
    goBack,
    setStopBang,
    setZones,
    goToResults,
    restart,
    dismissResume,
    isCurrentStepComplete: isStepComplete(state.step),
    isStepComplete,
  };
}

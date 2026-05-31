import { useState, useEffect, useCallback } from "react";
import type {
  StopBangAnswers, IsiAnswers, PlatoAnswers,
  ZoneAnswers, MedicalHistoryAnswers, PalmAnswers, ZoneQuestionAnswer,
} from "@/lib/types";
import type { AssessmentState, BmiData } from "@/lib/assessment-types";
import { TOTAL_ASSESSMENT_STEPS } from "@/lib/assessment-types";
import {
  scoreStopBang, scoreIsi, scorePlato, scoreZones,
  scoreMedicalHistory, scoreAnatomy, scorePalm,
} from "@/lib/scoring";
import { assignMurphyPathway } from "@/lib/pathways";
import { KEYS, saveState, loadState, clearState, loadState as loadScreenerState } from "@/lib/storage";

const initialMedicalHistory: MedicalHistoryAnswers = {
  heartDisease: null, highBloodPressure: null, diabetes: null,
  stroke: null, asthma: null, anxiety: null,
  acidReflux: null, thyroidDisorder: null,
};

const initialBmi: BmiData = {
  heightFt: null, heightIn: null, heightCm: null, heightUnit: "imperial",
  weightLbs: null, weightKg: null, weightUnit: "lbs", calculatedBmi: null,
};

const initialStopBang: StopBangAnswers = {
  snoring: null, tired: null, observed: null, pressure: null,
  bmi: null, age: null, neck: null, gender: null,
};

const initialIsi: IsiAnswers = { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null };

const initialPlato: PlatoAnswers = {
  q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null,
  q8: null, q9: null, q10: null, q11: 5,
};

const initialZones: ZoneAnswers = {
  nose: { q1: null, q2: null, q3: null, q4: null, q5: null },
  palate: { q1: null, q2: null, q3: null },
  mandible: { q1: null, q2: null, q3: null },
  neck: { q1: null, q2: null, q3: null },
};

const initialPalm: PalmAnswers = {
  pcrit: { q1: null, q2: null, q3: null },
  arousal: { q1: null, q2: null, q3: null },
  loopGain: { q1: null, q2: null, q3: null, q4: null },
  muscle: { q1: null, q2: null, q3: null, q4: null },
};

const initialState: AssessmentState = {
  step: 1, medicalHistory: initialMedicalHistory, bmi: initialBmi,
  stopBang: initialStopBang, isi: initialIsi, plato: initialPlato,
  zoneAnswers: initialZones, palm: initialPalm, profile: null, resumedFromSaved: false,
};

function migrateZone(raw: Record<string, unknown>, isNose = false) {
  const m = (v: unknown): ZoneQuestionAnswer =>
    v === true ? "yes" : v === false ? "no" : (v === "yes" || v === "no" ? v : null);
  const out: ZoneAnswers["nose"] = { q1: m(raw.q1), q2: m(raw.q2), q3: m(raw.q3) };
  if (isNose) { out.q4 = m(raw.q4); out.q5 = m(raw.q5); }
  return out;
}

// Try to load screener's STOP-BANG answers for pre-fill
function loadScreenerStopBang(): StopBangAnswers | null {
  try {
    const screenerState = loadScreenerState<{ stopBangAnswers?: StopBangAnswers }>(KEYS.screener);
    if (screenerState?.stopBangAnswers) {
      const ans = screenerState.stopBangAnswers;
      const hasAnswers = Object.values(ans).some((v) => v !== null);
      return hasAnswers ? ans : null;
    }
  } catch { /* ignore */ }
  return null;
}

// Try to load screener's zone answers for pre-fill
function loadScreenerZones(): ZoneAnswers | null {
  try {
    const screenerState = loadScreenerState<{ zoneAnswers?: ZoneAnswers }>(KEYS.screener);
    if (screenerState?.zoneAnswers) {
      const z = screenerState.zoneAnswers as unknown as Record<string, Record<string, unknown>>;
      const zones: ZoneAnswers = {
        nose: migrateZone(z.nose ?? {}, true),
        palate: migrateZone(z.palate ?? {}),
        mandible: migrateZone(z.mandible ?? {}),
        neck: migrateZone(z.neck ?? {}),
      };
      const hasAnswers = Object.values(zones.nose).some((v) => v !== null);
      return hasAnswers ? zones : null;
    }
  } catch { /* ignore */ }
  return null;
}

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>(() => {
    const params = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
    const fromScreener = params.get("from") === "screener";
    const fromResults = params.get("from") === "results";

    // Coming from screener: always start at step 1 with screener data pre-filled
    if (fromScreener) {
      clearState(KEYS.assessment);
      const screenerSb = loadScreenerStopBang();
      const screenerZones = loadScreenerZones();
      return {
        ...initialState,
        stopBang: screenerSb ?? initialStopBang,
        zoneAnswers: screenerZones ?? initialZones,
      };
    }

    const saved = loadState<AssessmentState>(KEYS.assessment);
    if (saved && typeof saved === "object" && saved.step) {
      // Migrate zone answers
      if (saved.zoneAnswers) {
        const z = saved.zoneAnswers as unknown as Record<string, Record<string, unknown>>;
        saved.zoneAnswers = {
          nose: migrateZone(z.nose ?? {}, true),
          palate: migrateZone(z.palate ?? {}),
          mandible: migrateZone(z.mandible ?? {}),
          neck: migrateZone(z.neck ?? {}),
        };
      }
      // fromResults: resume silently without the banner
      return { ...initialState, ...saved, resumedFromSaved: fromResults ? false : saved.step > 1 };
    }
    // Fresh start — pre-fill STOP-BANG from screener if available
    const screenerSb = loadScreenerStopBang();
    return {
      ...initialState,
      stopBang: screenerSb ?? initialStopBang,
    };
  });

  useEffect(() => {
    saveState(KEYS.assessment, state);
  }, [state]);

  const goNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.min(prev.step + 1, TOTAL_ASSESSMENT_STEPS),
      resumedFromSaved: false,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1), resumedFromSaved: false }));
  }, []);

  const setMedicalHistory = useCallback((answers: MedicalHistoryAnswers) => {
    setState((prev) => ({ ...prev, medicalHistory: answers }));
  }, []);

  const setBmi = useCallback((data: BmiData) => {
    setState((prev) => {
      const bmiVal = data.calculatedBmi;
      return {
        ...prev,
        bmi: data,
        stopBang: bmiVal !== null
          ? { ...prev.stopBang, bmi: bmiVal >= 35 }
          : prev.stopBang,
      };
    });
  }, []);

  const setStopBang = useCallback((answers: StopBangAnswers) => {
    setState((prev) => ({ ...prev, stopBang: answers }));
  }, []);

  const setIsi = useCallback((answers: IsiAnswers) => {
    setState((prev) => ({ ...prev, isi: answers }));
  }, []);

  const setPlato = useCallback((answers: PlatoAnswers) => {
    setState((prev) => ({ ...prev, plato: answers }));
  }, []);

  const setZones = useCallback((answers: ZoneAnswers) => {
    setState((prev) => ({ ...prev, zoneAnswers: answers }));
  }, []);

  const setPalm = useCallback((answers: PalmAnswers) => {
    setState((prev) => ({ ...prev, palm: answers }));
  }, []);

  const dismissResume = useCallback(() => {
    setState((prev) => ({ ...prev, resumedFromSaved: false }));
  }, []);

  const restart = useCallback(() => {
    clearState(KEYS.assessment);
    setState(initialState);
  }, []);

  const computeAndFinish = useCallback(() => {
    const { score: stopBangScore, risk: osaRisk } = scoreStopBang(state.stopBang);
    const { score: isiScore, severity: insomniaSeverity } = scoreIsi(state.isi);
    const platoProfile = scorePlato(state.plato);
    const palm = scorePalm(state.palm);
    const zones = scoreZones(state.zoneAnswers);
    const medicalHistory = scoreMedicalHistory(state.medicalHistory);
    const anatomy = scoreAnatomy(state.zoneAnswers);

    const profile = {
      stopBangScore, osaRisk, isiScore, insomniaSeverity,
      plato: platoProfile, palm, zones, medicalHistory, anatomy,
      bmiValue: state.bmi.calculatedBmi,
      comorbidities: medicalHistory.answeredYes,
      mainComplaint: undefined,
    };

    const current = loadState<AssessmentState>(KEYS.assessment) ?? ({} as AssessmentState);
    saveState(KEYS.assessment, { ...current, profile });
    setState((prev) => ({ ...prev, profile }));
    return { profile, pathwayId: assignMurphyPathway(profile) };
  }, [state.stopBang, state.isi, state.plato, state.palm, state.zoneAnswers, state.medicalHistory, state.bmi]);

  // Per-step completeness
  const isStepComplete = useCallback((step: number): boolean => {
    switch (step) {
      case 1: return true;
      case 2: return Object.values(state.medicalHistory).every((v) => v !== null);
      case 3: return state.bmi.calculatedBmi !== null;
      case 4: return Object.values(state.stopBang).every((v) => v !== null);
      case 5: return Object.values(state.isi).every((v) => v !== null);
      case 6: {
        const p = state.plato;
        return [p.q1,p.q2,p.q3,p.q4,p.q5,p.q6,p.q7,p.q8,p.q9,p.q10].every((v) => v !== null);
      }
      case 7: return ["q1","q2","q3","q4","q5"].every((k) => state.zoneAnswers.nose[k as keyof typeof state.zoneAnswers.nose] !== null);
      case 8: return ["q1","q2","q3"].every((k) => state.zoneAnswers.palate[k as keyof typeof state.zoneAnswers.palate] !== null);
      case 9: return ["q1","q2","q3"].every((k) => state.zoneAnswers.mandible[k as keyof typeof state.zoneAnswers.mandible] !== null);
      case 10: return ["q1","q2","q3"].every((k) => state.zoneAnswers.neck[k as keyof typeof state.zoneAnswers.neck] !== null);
      case 11: {
        const palm = state.palm;
        const allPcrit = [palm.pcrit.q1, palm.pcrit.q2, palm.pcrit.q3].every((v) => v !== null);
        const allArousal = [palm.arousal.q1, palm.arousal.q2, palm.arousal.q3].every((v) => v !== null);
        const allLoop = [palm.loopGain.q1, palm.loopGain.q2, palm.loopGain.q3, palm.loopGain.q4].every((v) => v !== null);
        const allMuscle = [palm.muscle.q1, palm.muscle.q2, palm.muscle.q3, palm.muscle.q4].every((v) => v !== null);
        return allPcrit && allArousal && allLoop && allMuscle;
      }
      default: return true;
    }
  }, [state]);

  const screenerPrefilled = loadScreenerStopBang() !== null;

  return {
    step: state.step,
    medicalHistory: state.medicalHistory,
    bmi: state.bmi,
    stopBang: state.stopBang,
    isi: state.isi,
    plato: state.plato,
    zoneAnswers: state.zoneAnswers,
    palm: state.palm,
    profile: state.profile,
    resumedFromSaved: state.resumedFromSaved,
    screenerPrefilled,
    goNext,
    goBack,
    setMedicalHistory,
    setBmi,
    setStopBang,
    setIsi,
    setPlato,
    setZones,
    setPalm,
    dismissResume,
    restart,
    computeAndFinish,
    isCurrentStepComplete: isStepComplete(state.step),
    isStepComplete,
  };
}

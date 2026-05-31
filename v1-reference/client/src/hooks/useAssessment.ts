import { useState, useEffect, useCallback } from "react";
import type {
  WizardStep,
  MedicalHistoryAnswers,
  BmiData,
  StopBangAnswers,
  IsiAnswers,
  PlatoAnswers,
  PalmAnswers,
  ZoneAnswers,
  PatientProfile,
  AssessmentState,
  ZoneQuestionAnswer,
} from "@/lib/types";
import { scoreStopBang, scoreIsi, scorePlato, scorePalm, scoreZones, scoreMedicalHistory, scoreAnatomy } from "@/lib/scoring";
import { assignMurphyPathway } from "@/lib/pathways";
import { apiRequest, queryClient } from "@/lib/queryClient";

const STORAGE_KEY = "murphy_method_assessment";

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
    q3: migrate(zone.q3) 
  };
  if (isNose) {
    result.q4 = migrate(zone.q4);
    result.q5 = migrate(zone.q5);
  }
  return result;
}

function migrateStoredState(saved: unknown): AssessmentState | null {
  if (!saved || typeof saved !== "object") return null;
  const state = saved as Record<string, unknown>;
  
  if (state.zoneAnswers && typeof state.zoneAnswers === "object") {
    const zones = state.zoneAnswers as Record<string, { q1: unknown; q2: unknown; q3: unknown; q4?: unknown; q5?: unknown }>;
    state.zoneAnswers = {
      nose: migrateZoneAnswers(zones.nose || { q1: null, q2: null, q3: null, q4: null, q5: null }, true),
      palate: migrateZoneAnswers(zones.palate || { q1: null, q2: null, q3: null }),
      mandible: migrateZoneAnswers(zones.mandible || { q1: null, q2: null, q3: null }),
      neck: migrateZoneAnswers(zones.neck || { q1: null, q2: null, q3: null }),
    };
  }
  
  // Migrate from old palmAnswers to platoAnswers
  if (state.palmAnswers && typeof state.palmAnswers === "object") {
    state.platoAnswers = state.palmAnswers;
    delete state.palmAnswers;
  }
  
  if (state.platoAnswers && typeof state.platoAnswers === "object") {
    const plato = state.platoAnswers as Record<string, number | null>;
    const platoKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11'];
    for (const key of platoKeys) {
      if (plato[key] === undefined) {
        plato[key] = key === 'q11' ? 5 : null;
      }
    }
    if (plato.q11 === null) {
      plato.q11 = 5;
    }
  } else {
    state.platoAnswers = {
      q1: null, q2: null, q3: null, q4: null, q5: null,
      q6: null, q7: null, q8: null, q9: null, q10: null, q11: 5,
    };
  }

  if (!state.medicalHistoryAnswers || typeof state.medicalHistoryAnswers !== "object") {
    state.medicalHistoryAnswers = {
      heartDisease: null,
      highBloodPressure: null,
      diabetes: null,
      stroke: null,
      asthma: null,
      anxiety: null,
      acidReflux: null,
      thyroidDisorder: null,
    };
  }

  if (!state.bmiData || typeof state.bmiData !== "object") {
    state.bmiData = {
      heightValue: null,
      heightUnit: "inches",
      weightValue: null,
      weightUnit: "lbs",
      calculatedBmi: null,
    };
  }

  // Migrate palmAnswers if missing
  if (!state.palmAnswers || typeof state.palmAnswers !== "object") {
    state.palmAnswers = {
      pcrit: { q1: null, q2: null, q3: null },
      arousal: { q1: null, q2: null, q3: null },
      loopGain: { q1: null, q2: null, q3: null, q4: null },
      muscle: { q1: null, q2: null, q3: null, q4: null },
    };
  }
  
  return state as unknown as AssessmentState;
}

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

const initialMedicalHistoryAnswers: MedicalHistoryAnswers = {
  heartDisease: null,
  highBloodPressure: null,
  diabetes: null,
  stroke: null,
  asthma: null,
  anxiety: null,
  acidReflux: null,
  thyroidDisorder: null,
};

const initialBmiData: BmiData = {
  heightValue: null,
  heightUnit: "inches",
  weightValue: null,
  weightUnit: "lbs",
  calculatedBmi: null,
};

const initialIsiAnswers: IsiAnswers = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null,
  q6: null,
  q7: null,
};

const initialPlatoAnswers: PlatoAnswers = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null,
  q6: null,
  q7: null,
  q8: null,
  q9: null,
  q10: null,
  q11: 5,
};

const initialPalmAnswers: PalmAnswers = {
  pcrit: { q1: null, q2: null, q3: null },
  arousal: { q1: null, q2: null, q3: null },
  loopGain: { q1: null, q2: null, q3: null, q4: null },
  muscle: { q1: null, q2: null, q3: null, q4: null },
};

const initialZoneAnswers: ZoneAnswers = {
  nose: { q1: null, q2: null, q3: null, q4: null, q5: null } as ZoneAnswers["nose"],
  palate: { q1: null, q2: null, q3: null } as ZoneAnswers["palate"],
  mandible: { q1: null, q2: null, q3: null } as ZoneAnswers["mandible"],
  neck: { q1: null, q2: null, q3: null } as ZoneAnswers["neck"],
};

const initialState: AssessmentState = {
  currentStep: 1,
  medicalHistoryAnswers: initialMedicalHistoryAnswers,
  bmiData: initialBmiData,
  stopBangAnswers: initialStopBangAnswers,
  isiAnswers: initialIsiAnswers,
  platoAnswers: initialPlatoAnswers,
  palmAnswers: initialPalmAnswers,
  zoneAnswers: initialZoneAnswers,
  comorbidities: [],
  mainComplaint: "",
  profile: null,
};

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated = migrateStoredState(parsed);
        if (migrated) {
          return { ...initialState, ...migrated };
        }
      }
    } catch {
      console.warn("Failed to load saved assessment state");
    }
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      console.warn("Failed to save assessment state");
    }
  }, [state]);

  const setCurrentStep = useCallback((step: WizardStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setMedicalHistoryAnswers = useCallback((answers: MedicalHistoryAnswers) => {
    setState((prev) => ({ ...prev, medicalHistoryAnswers: answers }));
  }, []);

  const setBmiData = useCallback((data: BmiData) => {
    setState((prev) => {
      const updatedState = { ...prev, bmiData: data };
      if (data.calculatedBmi !== null) {
        updatedState.stopBangAnswers = {
          ...prev.stopBangAnswers,
          bmi: data.calculatedBmi >= 35,
        };
      }
      return updatedState;
    });
  }, []);

  const setStopBangAnswers = useCallback((answers: StopBangAnswers) => {
    setState((prev) => ({ ...prev, stopBangAnswers: answers }));
  }, []);

  const setIsiAnswers = useCallback((answers: IsiAnswers) => {
    setState((prev) => ({ ...prev, isiAnswers: answers }));
  }, []);

  const setPlatoAnswers = useCallback((answers: PlatoAnswers) => {
    setState((prev) => ({ ...prev, platoAnswers: answers }));
  }, []);

  const setPalmAnswers = useCallback((answers: PalmAnswers) => {
    setState((prev) => ({ ...prev, palmAnswers: answers }));
  }, []);

  const setZoneAnswers = useCallback((answers: ZoneAnswers) => {
    setState((prev) => ({ ...prev, zoneAnswers: answers }));
  }, []);

  const calculateProfile = useCallback((): PatientProfile => {
    const { score: stopBangScore, risk: osaRisk } = scoreStopBang(state.stopBangAnswers);
    const { score: isiScore, severity: insomniaSeverity } = scoreIsi(state.isiAnswers);
    const plato = scorePlato(state.platoAnswers);
    const palm = scorePalm(state.palmAnswers);
    const zones = scoreZones(state.zoneAnswers);
    const medicalHistory = scoreMedicalHistory(state.medicalHistoryAnswers);
    const anatomy = scoreAnatomy(state.zoneAnswers);

    return {
      stopBangScore,
      osaRisk,
      isiScore,
      insomniaSeverity,
      plato,
      palm,
      zones,
      medicalHistory,
      anatomy,
      bmiValue: state.bmiData.calculatedBmi,
      comorbidities: state.comorbidities,
      mainComplaint: state.mainComplaint || undefined,
    };
  }, [state.stopBangAnswers, state.isiAnswers, state.platoAnswers, state.palmAnswers, state.zoneAnswers, state.medicalHistoryAnswers, state.comorbidities, state.mainComplaint]);

  const goToResults = useCallback(() => {
    const profile = calculateProfile();
    const assessmentDate = new Date().toISOString();
    setState((prev) => ({ ...prev, profile, currentStep: 5, assessmentDate }));

    const pathwayId = assignMurphyPathway(profile);
    const serverPayload = {
      stopBangScore: profile.stopBangScore,
      osaRisk: profile.osaRisk,
      isiScore: profile.isiScore,
      insomniaSeverity: profile.insomniaSeverity,
      bmiValue: profile.bmiValue || undefined,
      platoProfile: profile.plato,
      zoneScores: profile.zones,
      assignedPathway: pathwayId,
      comorbidities: profile.comorbidities || [],
      mainComplaint: profile.mainComplaint || "",
      completedAt: new Date().toISOString(),
    };

    apiRequest("POST", "/api/assessments", serverPayload)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/assessments/me"] });
      })
      .catch((err) => {
        console.log("Assessment saved locally. Server save skipped:", err.message);
      });
  }, [calculateProfile]);

  const restart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, []);

  return {
    currentStep: state.currentStep,
    medicalHistoryAnswers: state.medicalHistoryAnswers,
    bmiData: state.bmiData,
    stopBangAnswers: state.stopBangAnswers,
    isiAnswers: state.isiAnswers,
    platoAnswers: state.platoAnswers,
    palmAnswers: state.palmAnswers,
    zoneAnswers: state.zoneAnswers,
    profile: state.profile,
    setCurrentStep,
    setMedicalHistoryAnswers,
    setBmiData,
    setStopBangAnswers,
    setIsiAnswers,
    setPlatoAnswers,
    setPalmAnswers,
    setZoneAnswers,
    goToResults,
    restart,
    calculateProfile,
  };
}

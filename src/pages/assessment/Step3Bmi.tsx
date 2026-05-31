import { useState } from "react";
import type { BmiData } from "@/lib/assessment-types";
import { Info } from "lucide-react";

interface Step3BmiProps {
  bmi: BmiData;
  onChange: (data: BmiData) => void;
  onNext: () => void;
  onBack?: () => void;
  isComplete: boolean;
}

function calcBmiImperial(ft: number | null, inches: number | null, lbs: number | null): number | null {
  if (ft === null || lbs === null) return null;
  const totalInches = (ft * 12) + (inches ?? 0);
  if (totalInches <= 0 || lbs <= 0) return null;
  return Math.round(((lbs / (totalInches * totalInches)) * 703) * 10) / 10;
}

function calcBmiMetric(cm: number | null, kg: number | null): number | null {
  if (cm === null || kg === null || cm <= 0 || kg <= 0) return null;
  const m = cm / 100;
  return Math.round((kg / (m * m)) * 10) / 10;
}

export function Step3Bmi({ bmi, onChange, onNext, onBack, isComplete }: Step3BmiProps) {
  const [unit, setUnit] = useState<"imperial" | "metric">(bmi.heightUnit);

  const update = (patch: Partial<BmiData>) => {
    const next = { ...bmi, ...patch };
    const bmiVal = unit === "imperial"
      ? calcBmiImperial(next.heightFt, next.heightIn, next.weightLbs)
      : calcBmiMetric(next.heightCm, next.weightKg);
    onChange({ ...next, calculatedBmi: bmiVal, heightUnit: unit });
  };

  const switchUnit = (u: "imperial" | "metric") => {
    setUnit(u);
    onChange({ ...bmi, heightUnit: u, calculatedBmi: null });
  };

  const bmiCategory = bmi.calculatedBmi === null ? null
    : bmi.calculatedBmi < 18.5 ? { label: "Underweight", color: "#1D4ED8" }
    : bmi.calculatedBmi < 25 ? { label: "Normal weight", color: "#16A34A" }
    : bmi.calculatedBmi < 30 ? { label: "Overweight", color: "#B45309" }
    : { label: "Obese", color: "#DC2626" };

  return (
    <div className="mx-auto px-4 py-10" style={{ maxWidth: "900px" }} id="main-content">
      <h2 className="font-bold text-ink mb-2" style={{ fontSize: "26px" }}>BMI Calculator</h2>
      <p className="text-ink-muted mb-6" style={{ fontSize: "17px", lineHeight: 1.6 }}>
        Body mass index helps assess obesity-related sleep apnea risk. Enter your height and weight.
      </p>

      {/* Unit toggle */}
      <div className="flex rounded-lg border overflow-hidden mb-8 w-48" style={{ borderColor: "#E2E8F0" }}>
        {(["imperial", "metric"] as const).map((u) => (
          <button
            key={u}
            onClick={() => switchUnit(u)}
            className="flex-1 font-semibold transition-colors"
            style={{
              minHeight: "40px",
              fontSize: "14px",
              backgroundColor: unit === u ? "#1D4ED8" : "#fff",
              color: unit === u ? "#fff" : "#475569",
              border: "none",
              cursor: "pointer",
            }}
          >
            {u === "imperial" ? "Imperial" : "Metric"}
          </button>
        ))}
      </div>

      <div className="space-y-5 mb-8">
        {unit === "imperial" ? (
          <>
            <div>
              <label className="block font-semibold text-ink mb-2" style={{ fontSize: "17px" }}>Height</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
                    <input
                      type="number"
                      placeholder="0"
                      min={0}
                      max={8}
                      value={bmi.heightFt ?? ""}
                      onChange={(e) => update({ heightFt: e.target.value ? Number(e.target.value) : null })}
                      className="flex-1 px-4 outline-none text-ink bg-white"
                      style={{ fontSize: "17px", minHeight: "52px", border: "none" }}
                    />
                    <span className="px-3 font-medium text-ink-muted" style={{ fontSize: "15px" }}>ft</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
                    <input
                      type="number"
                      placeholder="0"
                      min={0}
                      max={11}
                      value={bmi.heightIn ?? ""}
                      onChange={(e) => update({ heightIn: e.target.value ? Number(e.target.value) : null })}
                      className="flex-1 px-4 outline-none text-ink bg-white"
                      style={{ fontSize: "17px", minHeight: "52px", border: "none" }}
                    />
                    <span className="px-3 font-medium text-ink-muted" style={{ fontSize: "15px" }}>in</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-ink mb-2" style={{ fontSize: "17px" }}>Weight</label>
              <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  value={bmi.weightLbs ?? ""}
                  onChange={(e) => update({ weightLbs: e.target.value ? Number(e.target.value) : null })}
                  className="flex-1 px-4 outline-none text-ink bg-white"
                  style={{ fontSize: "17px", minHeight: "52px", border: "none" }}
                />
                <span className="px-3 font-medium text-ink-muted" style={{ fontSize: "15px" }}>lbs</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block font-semibold text-ink mb-2" style={{ fontSize: "17px" }}>Height</label>
              <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  value={bmi.heightCm ?? ""}
                  onChange={(e) => update({ heightCm: e.target.value ? Number(e.target.value) : null })}
                  className="flex-1 px-4 outline-none text-ink bg-white"
                  style={{ fontSize: "17px", minHeight: "52px", border: "none" }}
                />
                <span className="px-3 font-medium text-ink-muted" style={{ fontSize: "15px" }}>cm</span>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-ink mb-2" style={{ fontSize: "17px" }}>Weight</label>
              <div className="flex items-center rounded-lg border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  value={bmi.weightKg ?? ""}
                  onChange={(e) => update({ weightKg: e.target.value ? Number(e.target.value) : null })}
                  className="flex-1 px-4 outline-none text-ink bg-white"
                  style={{ fontSize: "17px", minHeight: "52px", border: "none" }}
                />
                <span className="px-3 font-medium text-ink-muted" style={{ fontSize: "15px" }}>kg</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* BMI result */}
      {bmi.calculatedBmi !== null && (
        <div className="rounded-xl border p-5 mb-8" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ink-muted" style={{ fontSize: "14px" }}>Your BMI</p>
              <p className="font-black text-ink" style={{ fontSize: "36px", lineHeight: 1 }}>
                {bmi.calculatedBmi}
              </p>
            </div>
            {bmiCategory && (
              <div
                className="rounded-full px-4 py-2 font-bold"
                style={{ backgroundColor: `${bmiCategory.color}20`, color: bmiCategory.color, fontSize: "15px" }}
              >
                {bmiCategory.label}
              </div>
            )}
          </div>
          {bmi.calculatedBmi >= 35 && (
            <div className="flex items-start gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
              <p className="text-ink-muted" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                BMI ≥ 35 counts as a positive STOP-BANG factor and has been automatically applied to your score.
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!isComplete}
        className="w-full font-semibold rounded-xl transition-colors"
        style={{
          backgroundColor: isComplete ? "#1D4ED8" : "#CBD5E1",
          color: isComplete ? "#fff" : "#94A3B8",
          minHeight: "56px",
          fontSize: "17px",
          cursor: isComplete ? "pointer" : "not-allowed",
        }}
      >
        {isComplete ? "Continue to STOP-BANG →" : "Enter your height and weight to continue"}
      </button>
      {onBack && (
        <button onClick={onBack} style={{ display: "block", margin: "12px auto 0", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          ← Back
        </button>
      )}
    </div>
  );
}

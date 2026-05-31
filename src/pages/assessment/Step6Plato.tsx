import { OptionCards } from "@/components/forms/OptionCards";
import {
  PLATO_QUESTIONS,
  PLATO_FREQUENCY_OPTIONS_DAY,
  PLATO_FREQUENCY_OPTIONS_NIGHT,
  PLATO_SECTION_HEADERS,
} from "@/lib/questionnaires";
import type { PlatoAnswers } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Step6PlatoProps {
  answers: PlatoAnswers;
  onChange: (answers: PlatoAnswers) => void;
  onNext: () => void;
  onBack?: () => void;
  isComplete: boolean;
}

export function Step6Plato({ answers, onChange, onNext, onBack, isComplete }: Step6PlatoProps) {
  type PlatoKey = keyof PlatoAnswers;

  const handleChange = (key: PlatoKey, value: number) => {
    onChange({ ...answers, [key]: value });
  };

  const answeredCount = [
    answers.q1, answers.q2, answers.q3, answers.q4, answers.q5,
    answers.q6, answers.q7, answers.q8, answers.q9, answers.q10,
  ].filter((v) => v !== null).length;

  const sectionAQuestions = PLATO_QUESTIONS.filter((q) => q.section === "A");
  const sectionBQuestions = PLATO_QUESTIONS.filter((q) => q.section === "B");
  const sectionCQuestion = PLATO_QUESTIONS.find((q) => q.section === "C")!;

  const renderSection = (
    questions: typeof PLATO_QUESTIONS,
    header: { title: string; instruction: string },
    options: { value: number; label: string; sublabel?: string }[],
    startIndex: number
  ) => (
    <div className="mb-8">
      <div className="rounded-xl border p-4 mb-4" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
        <p className="font-bold text-ink mb-1" style={{ fontSize: "15px" }}>{header.title}</p>
        <p className="text-ink-muted" style={{ fontSize: "15px" }}>{header.instruction}</p>
      </div>
      <div className="space-y-4">
        {questions.map((q, i) => {
          const key = q.id as PlatoKey;
          const val = answers[key];
          const answered = val !== null;
          return (
            <div
              key={q.id}
              className={cn(
                "rounded-xl border p-5 transition-colors",
                answered ? "border-[#1D4ED8]/30 bg-[#EFF6FF]/40" : "border-[#E2E8F0] bg-white"
              )}
            >
              <p className="font-medium text-ink mb-4" style={{ fontSize: "17px" }}>
                <span className="text-[#1D4ED8] font-bold mr-2">{startIndex + i + 1}.</span>
                {q.text}
              </p>
              <OptionCards
                id={q.id}
                value={val as number | null}
                options={options}
                onChange={(v) => handleChange(key, v)}
                compact
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="mx-auto px-4 py-10" style={{ maxWidth: "900px" }} id="main-content">
      <h2 className="font-bold text-ink mb-2" style={{ fontSize: "26px" }}>PLATO-11</h2>
      <p className="text-ink-muted mb-6" style={{ fontSize: "17px", lineHeight: 1.6 }}>
        The PLATO-11 is a short questionnaire that helps identify how much your sleep and breathing problems may be affecting your daily life, energy, and overall health.
      </p>

      {renderSection(sectionAQuestions, PLATO_SECTION_HEADERS.A, PLATO_FREQUENCY_OPTIONS_DAY, 0)}
      {renderSection(sectionBQuestions, PLATO_SECTION_HEADERS.B, PLATO_FREQUENCY_OPTIONS_NIGHT, 8)}

      {/* Section C — 0–10 sleep quality rating */}
      <div className="mb-8">
        <div className="rounded-xl border p-4 mb-4" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
          <p className="font-bold text-ink mb-1" style={{ fontSize: "15px" }}>Section C</p>
          <p className="text-ink-muted" style={{ fontSize: "15px" }}>{PLATO_SECTION_HEADERS.C.instruction}</p>
        </div>
        <div
          className={cn(
            "rounded-xl border p-5 transition-colors",
            answers.q11 !== null ? "border-[#1D4ED8]/30 bg-[#EFF6FF]/40" : "border-[#E2E8F0] bg-white"
          )}
        >
          <p className="font-medium text-ink mb-4" style={{ fontSize: "17px" }}>
            <span className="text-[#1D4ED8] font-bold mr-2">11.</span>
            {sectionCQuestion.text}
          </p>
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={answers.q11 ?? 5}
              onChange={(e) => handleChange("q11", Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#1D4ED8", height: "6px" }}
            />
            <div className="flex justify-between" style={{ fontSize: "13px", color: "#64748B" }}>
              <span>0 — Very poor</span>
              <span className="font-bold text-ink" style={{ fontSize: "17px" }}>{answers.q11 ?? 5}</span>
              <span>10 — Excellent</span>
            </div>
          </div>
        </div>
      </div>

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
        {isComplete ? "Continue to Airway — Nose →" : `Answer all 10 questions to continue (${answeredCount}/10)`}
      </button>
      {onBack && (
        <button onClick={onBack} style={{ display: "block", margin: "12px auto 0", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          ← Back
        </button>
      )}
    </div>
  );
}

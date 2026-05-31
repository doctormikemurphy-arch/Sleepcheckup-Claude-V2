import { QuestionCard } from "@/components/forms/QuestionCard";
import { STOP_BANG_QUESTIONS } from "@/lib/questionnaires";
import type { StopBangAnswers } from "@/lib/types";

interface Step2StopBangProps {
  answers: StopBangAnswers;
  onChange: (answers: StopBangAnswers) => void;
  onNext: () => void;
  isComplete: boolean;
}

export function Step2StopBang({ answers, onChange, onNext, isComplete }: Step2StopBangProps) {
  const handleChange = (fieldKey: keyof StopBangAnswers, value: boolean) => {
    onChange({ ...answers, [fieldKey]: value });
  };

  return (
    <div
      className="mx-auto px-4"
      style={{ maxWidth: "720px", paddingTop: "40px", paddingBottom: "96px" }}
      id="main-content"
    >
      <div className="eyebrow mb-3">Step 1</div>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "clamp(22px, 3vw, 32px)",
          lineHeight: 1.1,
          color: "var(--text-ink)",
          marginBottom: "8px",
        }}
      >
        How Is the Breathing at Night?
      </h2>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "32px" }}>
        Answer all 8 questions to calculate your STOP-BANG sleep apnea risk score.
      </p>

      <div className="space-y-4 mb-10">
        {STOP_BANG_QUESTIONS.map((q, i) => (
          <QuestionCard
            key={q.id}
            id={q.id}
            number={i + 1}
            text={q.text}
            helpText={q.helpText}
            helpLink={q.helpLink}
            value={answers[q.fieldKey]}
            onChange={(val) => handleChange(q.fieldKey, val)}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!isComplete}
        className="btn-primary w-full"
        style={{
          opacity: isComplete ? 1 : 0.4,
          cursor: isComplete ? "pointer" : "not-allowed",
          fontSize: "17px",
        }}
      >
        {isComplete ? "Continue to Airway — Nose →" : "Answer all 8 questions to continue"}
      </button>

      {!isComplete && (
        <p className="text-center mt-3 text-ink-muted" style={{ fontSize: "15px" }}>
          {Object.values(answers).filter((v) => v !== null).length} of 8 answered
        </p>
      )}
    </div>
  );
}

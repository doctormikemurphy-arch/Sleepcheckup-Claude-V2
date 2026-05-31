import { QuestionCard } from "@/components/forms/QuestionCard";
import { MEDICAL_HISTORY_QUESTIONS } from "@/lib/questionnaires";
import type { MedicalHistoryAnswers, MedicalHistoryAnswer } from "@/lib/types";

interface Step2MedicalHistoryProps {
  answers: MedicalHistoryAnswers;
  onChange: (answers: MedicalHistoryAnswers) => void;
  onNext: () => void;
  onBack?: () => void;
  isComplete: boolean;
}

export function Step2MedicalHistory({ answers, onChange, onNext, onBack, isComplete }: Step2MedicalHistoryProps) {
  const handleChange = (fieldKey: keyof MedicalHistoryAnswers, value: boolean) => {
    const strVal: MedicalHistoryAnswer = value ? "yes" : "no";
    onChange({ ...answers, [fieldKey]: strVal });
  };

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;

  return (
    <div className="mx-auto px-4 py-10" style={{ maxWidth: "900px" }} id="main-content">
      <h2 className="font-bold text-ink mb-2" style={{ fontSize: "26px" }}>Medical History</h2>
      <p className="text-ink-muted mb-8" style={{ fontSize: "17px", lineHeight: 1.6 }}>
        These conditions are associated with sleep-disordered breathing. Answer all 8 questions.
      </p>

      <div className="space-y-4 mb-10">
        {MEDICAL_HISTORY_QUESTIONS.map((q, i) => {
          const val = answers[q.fieldKey];
          const boolVal = val === "yes" ? true : val === "no" ? false : null;
          return (
            <QuestionCard
              key={q.id}
              id={q.id}
              number={i + 1}
              text={q.text}
              value={boolVal}
              onChange={(v) => handleChange(q.fieldKey, v)}
            />
          );
        })}
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
        {isComplete ? "Continue to BMI →" : `Answer all 8 questions to continue (${answeredCount}/8)`}
      </button>
      {onBack && (
        <button onClick={onBack} style={{ display: "block", margin: "12px auto 0", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          ← Back
        </button>
      )}
    </div>
  );
}

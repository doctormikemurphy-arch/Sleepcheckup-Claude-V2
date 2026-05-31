import { QuestionCard } from "@/components/forms/QuestionCard";
import { STOP_BANG_QUESTIONS } from "@/lib/questionnaires";
import type { StopBangAnswers } from "@/lib/types";
import { Info } from "lucide-react";

interface Step4StopBangProps {
  answers: StopBangAnswers;
  onChange: (answers: StopBangAnswers) => void;
  onNext: () => void;
  onBack?: () => void;
  isComplete: boolean;
  screenerPrefilled: boolean;
  bmiAutoFilled: boolean;
}

export function Step4StopBang({ answers, onChange, onNext, onBack, isComplete, screenerPrefilled, bmiAutoFilled }: Step4StopBangProps) {
  const handleChange = (fieldKey: keyof StopBangAnswers, value: boolean) => {
    onChange({ ...answers, [fieldKey]: value });
  };

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;

  return (
    <div className="mx-auto px-4 py-10" style={{ maxWidth: "900px" }} id="main-content">
      <h2 className="font-bold text-ink mb-2" style={{ fontSize: "26px" }}>STOP-BANG Questionnaire</h2>
      <p className="text-ink-muted mb-4" style={{ fontSize: "17px", lineHeight: 1.6 }}>
        A validated 8-item screening tool for obstructive sleep apnea risk.
      </p>

      {screenerPrefilled && (
        <div className="flex items-start gap-3 rounded-xl border p-4 mb-6" style={{ borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" }}>
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
          <p style={{ fontSize: "15px", color: "#1E40AF", lineHeight: 1.6 }}>
            We've kept your screener answers — review and adjust if needed.
          </p>
        </div>
      )}

      {bmiAutoFilled && (
        <div className="flex items-start gap-3 rounded-xl border p-4 mb-6" style={{ borderColor: "#DBEAFE", backgroundColor: "#EFF6FF" }}>
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
          <p style={{ fontSize: "15px", color: "#1E40AF", lineHeight: 1.6 }}>
            Question 5 (BMI) has been automatically set based on your BMI entry.
          </p>
        </div>
      )}

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
        className="w-full font-semibold rounded-xl transition-colors"
        style={{
          backgroundColor: isComplete ? "#1D4ED8" : "#CBD5E1",
          color: isComplete ? "#fff" : "#94A3B8",
          minHeight: "56px",
          fontSize: "17px",
          cursor: isComplete ? "pointer" : "not-allowed",
        }}
      >
        {isComplete ? "Continue to Insomnia Severity →" : `Answer all 8 questions to continue (${answeredCount}/8)`}
      </button>
      {onBack && (
        <button onClick={onBack} style={{ display: "block", margin: "12px auto 0", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          ← Back
        </button>
      )}
    </div>
  );
}

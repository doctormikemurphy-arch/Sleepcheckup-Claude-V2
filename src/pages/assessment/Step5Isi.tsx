import { OptionCards } from "@/components/forms/OptionCards";
import { ISI_QUESTIONS } from "@/lib/questionnaires";
import type { IsiAnswers } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Step5IsiProps {
  answers: IsiAnswers;
  onChange: (answers: IsiAnswers) => void;
  onNext: () => void;
  onBack?: () => void;
  isComplete: boolean;
}

export function Step5Isi({ answers, onChange, onNext, onBack, isComplete }: Step5IsiProps) {
  const handleChange = (fieldKey: keyof IsiAnswers, value: number) => {
    onChange({ ...answers, [fieldKey]: value });
  };

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;

  return (
    <div className="mx-auto px-4 py-10" style={{ maxWidth: "900px" }} id="main-content">
      <h2 className="font-bold text-ink mb-2" style={{ fontSize: "26px" }}>Insomnia Severity Index</h2>
      <p className="text-ink-muted mb-8" style={{ fontSize: "17px", lineHeight: 1.6 }}>
        Rate how severe your insomnia symptoms have been <strong className="text-ink">in the past 2 weeks</strong>. Answer all 7 questions.
      </p>

      <div className="space-y-6 mb-10">
        {ISI_QUESTIONS.map((q, i) => {
          const val = answers[q.fieldKey];
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
                <span className="text-[#1D4ED8] font-bold mr-2">{i + 1}.</span>
                {q.text}
              </p>
              <OptionCards
                id={q.id}
                value={val}
                options={q.options}
                onChange={(v) => handleChange(q.fieldKey, v)}
                compact
              />
            </div>
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
        {isComplete ? "Continue to PLATO-11 →" : `Answer all 7 questions to continue (${answeredCount}/7)`}
      </button>
      {onBack && (
        <button onClick={onBack} style={{ display: "block", margin: "12px auto 0", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          ← Back
        </button>
      )}
    </div>
  );
}

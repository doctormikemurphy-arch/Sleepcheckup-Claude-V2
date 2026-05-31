import { QuestionCard } from "@/components/forms/QuestionCard";
import type { ZoneAnswers, ZoneQuestionAnswer } from "@/lib/types";
import type { ZoneQuestionConfig } from "@/lib/questionnaires";

type ZoneKey = keyof ZoneAnswers;
type QuestionKey = "q1" | "q2" | "q3" | "q4" | "q5";

interface ZoneStepProps {
  zoneConfig: ZoneQuestionConfig;
  zoneKey: ZoneKey;
  answers: ZoneAnswers;
  onChange: (answers: ZoneAnswers) => void;
  onNext: () => void;
  onBack?: () => void;
  nextLabel: string;
  isComplete: boolean;
  stepNum: number;
  zoneIndex?: number;
}

export function ZoneStep({
  zoneConfig,
  zoneKey,
  answers,
  onChange,
  onNext,
  onBack,
  nextLabel,
  isComplete,
  stepNum,
  zoneIndex,
}: ZoneStepProps) {
  const zoneAnswers = answers[zoneKey] as Record<QuestionKey, ZoneQuestionAnswer>;
  const totalQ = zoneConfig.questions.length;

  const handleChange = (fieldKey: QuestionKey, value: boolean) => {
    const strVal: ZoneQuestionAnswer = value ? "yes" : "no";
    onChange({
      ...answers,
      [zoneKey]: { ...zoneAnswers, [fieldKey]: strVal },
    });
  };

  const answeredCount = Object.values(zoneAnswers).filter((v) => v !== null).length;

  return (
    <div
      className="mx-auto px-4"
      style={{ maxWidth: "720px", paddingTop: "40px", paddingBottom: "96px" }}
      id="main-content"
    >
      <div className="eyebrow mb-3" style={{ color: "#15803D" }}>Step 2</div>
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
        Where Can the Airway Narrow?
      </h2>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: "19px",
          color: "var(--text-ink)",
          marginBottom: "8px",
        }}
      >
        {zoneConfig.zoneName}
      </p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "32px" }}>
        {zoneConfig.zoneDescription}
      </p>

      <div className="space-y-4 mb-10">
        {zoneConfig.questions.map((q, i) => {
          const val = zoneAnswers[q.fieldKey as QuestionKey];
          const boolVal = val === "yes" ? true : val === "no" ? false : null;
          return (
            <QuestionCard
              key={q.id}
              id={q.id}
              number={i + 1}
              text={q.text}
              value={boolVal}
              onChange={(v) => handleChange(q.fieldKey as QuestionKey, v)}
              accentColor="#15803D"
              accentSoftColor="#EAF3DE"
              cardBackground="#EAF3DE"
            />
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!isComplete}
        className="btn-primary w-full"
        style={{
          opacity: isComplete ? 1 : 0.4,
          cursor: isComplete ? "pointer" : "not-allowed",
          fontSize: "17px",
          backgroundColor: "#15803D",
          borderColor: "#15803D",
        }}
      >
        {isComplete ? nextLabel : `Answer all ${totalQ} questions to continue`}
      </button>

      {!isComplete && (
        <p className="text-center mt-3" style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>
          {answeredCount} of {totalQ} answered
        </p>
      )}
      {onBack && (
        <button onClick={onBack} style={{ display: "block", margin: "12px auto 0", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          ← Back
        </button>
      )}
    </div>
  );
}

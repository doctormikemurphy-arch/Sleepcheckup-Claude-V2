import { PALM_QUESTIONS } from "@/lib/questionnaires";
import type { PalmAnswers, PalmSectionAnswers } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step11PalmProps {
  answers: PalmAnswers;
  onChange: (answers: PalmAnswers) => void;
  onFinish: () => void;
  onBack?: () => void;
  isComplete: boolean;
}

type PalmSection = keyof PalmAnswers;
type QuestionKey = "q1" | "q2" | "q3" | "q4";

export function Step11Palm({ answers, onChange, onFinish, onBack, isComplete }: Step11PalmProps) {
  const handleChange = (section: PalmSection, key: QuestionKey, value: boolean) => {
    const sectionAnswers = answers[section] as PalmSectionAnswers;
    onChange({
      ...answers,
      [section]: { ...sectionAnswers, [key]: value },
    });
  };

  const totalQ = PALM_QUESTIONS.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredCount = PALM_QUESTIONS.reduce((sum, s) => {
    const sectionAnswers = answers[s.section] as PalmSectionAnswers;
    return sum + s.questions.filter((q) => sectionAnswers[q.fieldKey] !== null).length;
  }, 0);

  return (
    <div className="mx-auto px-4 py-10" style={{ maxWidth: "900px" }} id="main-content">
      <h2 className="font-bold mb-4" style={{ fontSize: "22px", color: "#B91C1C" }}>The PALM Classification Screening</h2>
      <p className="text-ink-soft mb-4" style={{ fontSize: "16px", lineHeight: 1.7 }}>
        In addition to having a primary problem with the structure (called anatomy) of their airway, <strong>70%</strong> of patients with obstructive sleep apnea also have a problem with how their body works (called physiology). About <strong>20%</strong> of patients with obstructive sleep apnea have physiology as the main problem.
      </p>
      <p className="text-ink-soft mb-4" style={{ fontSize: "16px", lineHeight: 1.7 }}>
        The <strong>PALM classification</strong> helps explain why sleep apnea happens by looking at four things: how narrow the airway is <strong>(P)</strong>, how easily the brain wakes up <strong>(A)</strong>, how steady the breathing control is <strong>(L)</strong>, and how strong the breathing muscles are during sleep <strong>(M)</strong>, so treatment can be better matched to the person. The ALM part of the PALM Classification organizes the physiology problems for patients with obstructive sleep apnea.
      </p>
      <p className="text-ink-soft mb-8" style={{ fontSize: "16px", lineHeight: 1.7 }}>
        Answer the questions below. A section is flagged positive if you answer "Yes" to 2 or more questions.
      </p>

      <div className="space-y-8 mb-10">
        {PALM_QUESTIONS.map((sectionConfig) => {
          const sectionAnswers = answers[sectionConfig.section] as PalmSectionAnswers;
          const sectionAnsweredCount = sectionConfig.questions.filter((q) => sectionAnswers[q.fieldKey] !== null).length;
          const sectionComplete = sectionAnsweredCount === sectionConfig.questions.length;

          return (
            <div key={sectionConfig.section}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold"
                  style={{ backgroundColor: sectionComplete ? "#1D4ED8" : "#E2E8F0", color: sectionComplete ? "#fff" : "#64748B", fontSize: "15px" }}
                >
                  {sectionComplete ? <Check className="w-4 h-4" strokeWidth={3} /> : sectionConfig.sectionLetter}
                </div>
                <div>
                  <p className="font-bold text-ink" style={{ fontSize: "17px" }}>{sectionConfig.sectionName}</p>
                  <p className="text-ink-muted" style={{ fontSize: "14px" }}>{sectionConfig.description}</p>
                </div>
              </div>

              <div className="space-y-3 pl-1">
                {sectionConfig.questions.map((q, i) => {
                  const val = sectionAnswers[q.fieldKey];
                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "rounded-xl border p-4 transition-colors",
                        val !== null ? "border-[#1D4ED8]/30 bg-[#EFF6FF]/40" : "border-[#E2E8F0] bg-white"
                      )}
                    >
                      <p className="font-medium text-ink mb-3" style={{ fontSize: "16px" }}>
                        <span className="text-[#1D4ED8] font-bold mr-2">{i + 1}.</span>
                        {q.text}
                      </p>
                      <div className="flex gap-3">
                        {([true, false] as const).map((opt) => {
                          const label = opt ? "Yes" : "No";
                          const selected = val === opt;
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => handleChange(sectionConfig.section, q.fieldKey, opt)}
                              aria-pressed={selected}
                              className={cn(
                                "flex-1 flex items-center justify-between rounded-lg border transition-all cursor-pointer font-semibold",
                                selected
                                  ? "border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]"
                                  : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#1D4ED8] hover:bg-[#F8FAFC]"
                              )}
                              style={{ minHeight: "48px", padding: "0 16px", fontSize: "15px" }}
                            >
                              <span>{label}</span>
                              {selected && (
                                <span
                                  className="flex items-center justify-center rounded-full"
                                  style={{ width: "20px", height: "20px", backgroundColor: "#1D4ED8", flexShrink: 0 }}
                                >
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onFinish}
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
        {isComplete ? "See My Results →" : `Answer all ${totalQ} questions to continue (${answeredCount}/${totalQ})`}
      </button>
      {onBack && (
        <button onClick={onBack} style={{ display: "block", margin: "12px auto 0", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
          ← Back
        </button>
      )}
    </div>
  );
}

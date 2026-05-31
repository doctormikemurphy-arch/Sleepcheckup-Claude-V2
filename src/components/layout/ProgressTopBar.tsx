import { X } from "lucide-react";

interface ProgressTopBarProps {
  step: number;
  totalSteps: number;
  stepName: string;
  onBack?: () => void;
  onExit?: () => void;
}

export function ProgressTopBar({ step, totalSteps, stepName, onBack, onExit }: ProgressTopBarProps) {
  const percent = Math.round(((step - 1) / totalSteps) * 100);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* 4px progress fill bar */}
      <div style={{ height: "4px", backgroundColor: "var(--blue-soft)" }}>
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            backgroundColor: "var(--blue)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Toolbar row */}
      <div
        className="mx-auto px-4 flex items-center justify-between"
        style={{
          maxWidth: "800px",
          height: "52px",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        {onBack ? (
          <button
            onClick={onBack}
            className="border-0 bg-transparent cursor-pointer transition-colors"
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--text-muted)",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "0",
              fontFamily: "var(--font-sans)",
            }}
          >
            ← Back
          </button>
        ) : (
          <div style={{ width: "48px" }} />
        )}

        <div className="text-center">
          <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-ink)", fontFamily: "var(--font-sans)" }}>
            Step {step} of {totalSteps}
          </span>
          {stepName && (
            <span style={{ fontSize: "15px", fontWeight: 400, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>
              {" "}— {stepName}
            </span>
          )}
        </div>

        {onExit ? (
          <button
            onClick={onExit}
            aria-label="Exit to home"
            className="border-0 cursor-pointer transition-colors flex items-center gap-1.5 rounded-lg"
            style={{
              minHeight: "36px",
              padding: "0 10px",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-muted)",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-soft)",
            }}
          >
            <X size={14} />
            Exit
          </button>
        ) : (
          <div style={{ width: "48px" }} />
        )}
      </div>
    </div>
  );
}

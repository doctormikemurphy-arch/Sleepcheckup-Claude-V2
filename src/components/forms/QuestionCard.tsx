import { YesNoCard } from "./YesNoCard";

interface QuestionCardProps {
  id: string;
  number: number;
  text: string;
  helpText?: string;
  helpLink?: { text: string; href: string };
  value: boolean | null;
  onChange: (value: boolean) => void;
  accentColor?: string;
  accentSoftColor?: string;
  cardBackground?: string;
}

export function QuestionCard({ id, number, text, helpText, helpLink, value, onChange, accentColor, accentSoftColor, cardBackground }: QuestionCardProps) {
  return (
    <div className="card" style={{ padding: "32px", ...(cardBackground ? { backgroundColor: cardBackground } : {}) }}>
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <span
            className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold"
            style={{
              width: "24px",
              height: "24px",
              fontSize: "12px",
              marginTop: "2px",
              backgroundColor: accentColor ?? "var(--blue)",
              fontFamily: "var(--font-sans)",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {number}
          </span>
          <div>
            <p
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "var(--text-ink)",
                lineHeight: 1.4,
                fontFamily: "var(--font-sans)",
              }}
            >
              {text}
            </p>
            {(helpText || helpLink) && (
              <p
                className="mt-2"
                style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.55 }}
              >
                {helpText}
                {helpLink && (
                  <>
                    {helpText ? " " : ""}
                    <a
                      href={helpLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--blue)", textDecoration: "underline" }}
                    >
                      {helpLink.text}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
      <YesNoCard id={id} value={value} onChange={onChange} accentColor={accentColor} accentSoftColor={accentSoftColor} />
    </div>
  );
}

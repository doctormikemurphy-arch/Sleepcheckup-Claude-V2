import { Check } from "lucide-react";

interface YesNoCardProps {
  id: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  accentColor?: string;
  accentSoftColor?: string;
}

export function YesNoCard({ value, onChange, id, accentColor = "var(--blue)", accentSoftColor = "var(--blue-soft)" }: YesNoCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Yes or No">
      {([true, false] as const).map((opt) => {
        const label = opt ? "Yes" : "No";
        const selected = value === opt;
        return (
          <button
            key={label}
            type="button"
            id={`${id}-${label.toLowerCase()}`}
            onClick={() => onChange(opt)}
            aria-pressed={selected}
            className="relative flex items-center justify-center transition-all cursor-pointer border-0"
            style={{
              minHeight: "72px",
              fontSize: "18px",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              borderRadius: "16px",
              border: selected ? `2px solid ${accentColor}` : "1.5px solid var(--border-soft)",
              backgroundColor: selected ? accentColor : "var(--bg-card)",
              color: selected ? "#FFFFFF" : "var(--text-muted)",
              padding: "18px",
            }}
            onMouseEnter={(e) => {
              if (!selected) {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = accentSoftColor;
                el.style.borderColor = accentColor;
                el.style.color = accentColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!selected) {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "var(--bg-card)";
                el.style.borderColor = "var(--border-soft)";
                el.style.color = "var(--text-muted)";
              }
            }}
          >
            <span>{label}</span>
            {selected && (
              <span
                className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-white"
                style={{ width: "20px", height: "20px" }}
              >
                <Check className="w-3 h-3" style={{ color: accentColor }} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

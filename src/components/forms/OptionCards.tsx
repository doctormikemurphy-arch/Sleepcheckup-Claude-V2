import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Option {
  value: number;
  label: string;
  sublabel?: string;
}

interface OptionCardsProps {
  id: string;
  value: number | null;
  options: Option[];
  onChange: (value: number) => void;
  compact?: boolean;
}

export function OptionCards({ id, value, options, onChange, compact = false }: OptionCardsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", compact && "gap-1.5")}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            id={`${id}-${opt.value}`}
            onClick={() => onChange(opt.value)}
            aria-pressed={selected}
            className={cn(
              "flex-1 min-w-[80px] flex flex-col items-center justify-center rounded-lg border transition-all cursor-pointer font-semibold text-center",
              selected
                ? "border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]"
                : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#1D4ED8] hover:bg-[#F8FAFC]"
            )}
            style={{
              minHeight: compact ? "52px" : "60px",
              padding: compact ? "6px 10px" : "8px 12px",
              fontSize: compact ? "13px" : "14px",
            }}
          >
            <span className="leading-tight">{opt.label}</span>
            {opt.sublabel && (
              <span className="text-ink-muted font-normal" style={{ fontSize: "11px", marginTop: "2px" }}>
                {opt.sublabel}
              </span>
            )}
            {selected && (
              <span
                className="flex items-center justify-center rounded-full mt-1"
                style={{ width: "16px", height: "16px", backgroundColor: "#1D4ED8" }}
              >
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

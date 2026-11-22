import type { CSSProperties } from "react";
import { Wind } from "lucide-react";

/** Small blue airflow icon that marks nose add-on items in place of the normal bullet. */
export function AddOnIcon({ size = 14, style }: { size?: number; style?: CSSProperties }) {
  return (
    <Wind
      aria-label="Nasal problem"
      className="flex-shrink-0"
      style={{ width: `${size}px`, height: `${size}px`, color: "var(--blue)", ...style }}
    />
  );
}

/** Same icon sized to sit inline right before a step's bold lead-in. */
export function InlineAddOnIcon() {
  return <AddOnIcon size={15} style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "6px" }} />;
}

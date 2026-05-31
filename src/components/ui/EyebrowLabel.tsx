import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface EyebrowLabelProps extends HTMLAttributes<HTMLParagraphElement> {
  color?: "blue" | "muted";
  children: ReactNode;
}

export function EyebrowLabel({ color = "blue", className, children, ...props }: EyebrowLabelProps) {
  return (
    <p
      className={cn(
        "sc-eyebrow",
        color === "blue" ? "text-[#1D4ED8]" : "text-[#64748B]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

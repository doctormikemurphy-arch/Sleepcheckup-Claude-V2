import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

type SectionSpacing = "default" | "tight" | "feature";
type SectionBg = "white" | "soft" | "navy";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: SectionSpacing;
  bg?: SectionBg;
  as?: "section" | "div";
  children: ReactNode;
}

const spacingClass: Record<SectionSpacing, string> = {
  default: "sc-section",
  tight: "sc-section-tight",
  feature: "sc-section-feature",
};

const bgClass: Record<SectionBg, string> = {
  white: "bg-white",
  soft: "bg-[#F8FAFC]",
  navy: "bg-[#0F172A]",
};

export function Section({
  spacing = "default",
  bg = "white",
  as: Tag = "section",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn(spacingClass[spacing], bgClass[bg], className)} {...props}>
      {children}
    </Tag>
  );
}

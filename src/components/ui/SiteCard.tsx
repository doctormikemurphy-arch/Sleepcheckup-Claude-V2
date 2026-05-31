import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

type CardVariant = "default" | "filled" | "featured";

interface SiteCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

const variantClass: Record<CardVariant, string> = {
  default: "sc-card",
  filled: "sc-card-filled",
  featured: "sc-card-featured",
};

export function SiteCard({ variant = "default", className, children, ...props }: SiteCardProps) {
  return (
    <div className={cn(variantClass[variant], className)} {...props}>
      {children}
    </div>
  );
}

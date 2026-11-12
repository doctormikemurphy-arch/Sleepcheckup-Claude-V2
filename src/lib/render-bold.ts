import { createElement, type ReactNode } from "react";

const BOLD = /\*\*(.+?)\*\*/g;

/**
 * Renders **text** as bold. Everything else stays plain React text, so no HTML
 * gets through. Text without ** is returned unchanged.
 */
export function renderBold(text: string): ReactNode {
  if (!text.includes("**")) return text;
  // split() with a capture group puts the bold parts at the odd indexes.
  return text.split(BOLD).map((part, i) => (i % 2 === 1 ? createElement("strong", { key: i }, part) : part));
}

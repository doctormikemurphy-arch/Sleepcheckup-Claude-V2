import { createElement, type ReactNode } from "react";

const BOLD = /\*\*(.+?)\*\*/g;

/**
 * Renders **text** as bold. Everything else stays plain React text, so no HTML
 * gets through. Text without ** is returned unchanged.
 *
 * Text with bold is wrapped in one <span>, so it stays a single inline run of text
 * even when the parent is a flex container (otherwise each piece becomes a flex item).
 */
export function renderBold(text: string): ReactNode {
  if (!text.includes("**")) return text;
  // split() with a capture group puts the bold parts at the odd indexes.
  const parts = text.split(BOLD).map((part, i) => (i % 2 === 1 ? createElement("strong", { key: i }, part) : part));
  return createElement("span", null, ...parts);
}

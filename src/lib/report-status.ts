// Shared "did the customer save their report / did we email it" state for one paid assessment.
// Stored in localStorage under the Stripe payment ID, so the results page and the report page
// (and other tabs) all see the same thing. Without a payment ID (admin preview) it lives only
// in memory and nothing is stored, sent or logged.
import { useEffect, useState } from "react";

export type EmailStatus = "idle" | "sending" | "sent" | "failed";

export interface ReportStatus {
  checkbox: boolean;
  downloaded: boolean;
  ackLogged: boolean;
  email: { status: "sent" | "failed"; attempts: number } | null;
}

/** The first send plus one more try on a later visit. */
const MAX_EMAIL_ATTEMPTS = 2;
const EMPTY: ReportStatus = { checkbox: false, downloaded: false, ackLogged: false, email: null };
const PREFIX = "report_status_v1:";

const memory = new Map<string, ReportStatus>();
const sending = new Set<string>();
const listeners = new Map<string, Set<() => void>>();

const keyFor = (sessionId: string | null) => (sessionId ? PREFIX + sessionId : null);

function read(sessionId: string | null): ReportStatus {
  const key = keyFor(sessionId);
  if (!key) return memory.get("preview") ?? EMPTY;
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(sessionId: string | null, next: ReportStatus) {
  const key = keyFor(sessionId);
  if (!key) memory.set("preview", next);
  else {
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* storage full or blocked */ }
  }
  notify(sessionId);
}

function update(sessionId: string | null, change: Partial<ReportStatus>) {
  write(sessionId, { ...read(sessionId), ...change });
}

function notify(sessionId: string | null) {
  listeners.get(keyFor(sessionId) ?? "preview")?.forEach((fn) => fn());
}

/** Current status for this payment, kept up to date across pages and tabs. */
export function useReportStatus(sessionId: string | null) {
  const [status, setStatus] = useState(() => read(sessionId));
  const [isSending, setIsSending] = useState(() => !!sessionId && sending.has(sessionId));
  useEffect(() => {
    const key = keyFor(sessionId) ?? "preview";
    const refresh = () => { setStatus(read(sessionId)); setIsSending(!!sessionId && sending.has(sessionId)); };
    refresh();
    const set = listeners.get(key) ?? new Set();
    set.add(refresh);
    listeners.set(key, set);
    const onStorage = (e: StorageEvent) => { if (e.key === key) refresh(); };
    window.addEventListener("storage", onStorage);
    return () => { set.delete(refresh); window.removeEventListener("storage", onStorage); };
  }, [sessionId]);

  const emailStatus: EmailStatus = isSending ? "sending" : status.email?.status ?? "idle";
  return { ...status, emailStatus, acknowledged: status.checkbox || status.downloaded };
}

function logAcknowledgment(sessionId: string | null, method: "checkbox" | "download") {
  if (!sessionId || read(sessionId).ackLogged) return;
  update(sessionId, { ackLogged: true });
  fetch("/api/log-acknowledgment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stripeSessionId: sessionId, acknowledgedAt: new Date().toISOString(), method }),
  }).catch(() => {
    // Best-effort logging only; failures shouldn't affect the customer's experience.
  });
}

export function setSavedCheckbox(sessionId: string | null, checked: boolean) {
  update(sessionId, { checkbox: checked });
  if (checked) logAcknowledgment(sessionId, "checkbox");
}

export function markDownloaded(sessionId: string | null) {
  update(sessionId, { downloaded: true });
  logAcknowledgment(sessionId, "download");
}

/** After Start Over: the old report is gone, so ask the customer to save the new one. The email record stays. */
export function resetSaved(sessionId: string | null) {
  update(sessionId, { checkbox: false, downloaded: false });
}

/**
 * Sends the report email unless it was already sent for this payment. The "sent" mark is saved
 * only after the server confirms success, so a failed send can be tried once more on a later visit.
 */
export async function sendReportEmailOnce(sessionId: string, payload: object): Promise<void> {
  const current = read(sessionId);
  if (current.email?.status === "sent" || sending.has(sessionId)) return;
  const attempts = current.email?.attempts ?? 0;
  if (attempts >= MAX_EMAIL_ATTEMPTS) return;

  sending.add(sessionId);
  notify(sessionId);
  let ok = false;
  try {
    const res = await fetch("/api/submit-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => null);
    ok = res.ok && body?.ok === true;
  } catch {
    // Network error: ok stays false.
  }
  sending.delete(sessionId);
  update(sessionId, { email: { status: ok ? "sent" : "failed", attempts: attempts + 1 } });
}

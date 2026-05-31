export const KEYS = {
  screener: "screener_state_v2",
  assessment: "assessment_state_v2",
  paidSession: "paid_session_v2",
  screenerEmail: "mm_screener_email",
} as const;

export function loadState<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail if storage is full
  }
}

export function clearState(key: string): void {
  localStorage.removeItem(key);
}

export function isPaid(): boolean {
  return localStorage.getItem(KEYS.paidSession) !== null;
}

export function setPaidSession(sessionId: string, email: string | null): void {
  localStorage.setItem(KEYS.paidSession, JSON.stringify({ sessionId, email, paidAt: new Date().toISOString() }));
}

export function getPaidSession(): { sessionId: string; email: string | null; paidAt: string } | null {
  try {
    const raw = localStorage.getItem(KEYS.paidSession);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getScreenerEmail(): string {
  return localStorage.getItem(KEYS.screenerEmail) ?? "";
}

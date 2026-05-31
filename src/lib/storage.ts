export const KEYS = {
  screener: "screener_state_v2",
  assessment: "assessment_state_v2",
  mockPaidAt: "mock_paid_at",
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

export function isMockPaid(): boolean {
  return localStorage.getItem(KEYS.mockPaidAt) !== null;
}

export function setMockPaid(): void {
  localStorage.setItem(KEYS.mockPaidAt, new Date().toISOString());
}

export type ConsentState = "granted" | "denied" | null;

const STORAGE_KEY = "sleepcheckup_cookie_consent";
const EVENT_NAME = "cookie-consent-change";

export function getConsent(): ConsentState {
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setConsent(value: Exclude<ConsentState, null>) {
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: value }));
}

export function clearConsent() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function onConsentChange(callback: (value: ConsentState) => void) {
  const handler = (e: Event) => callback((e as CustomEvent).detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

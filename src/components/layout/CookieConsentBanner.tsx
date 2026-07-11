import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getConsent, setConsent } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  if (!visible) return null;

  const handleChoice = (value: "granted" | "denied") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="px-4 pb-4 pt-3 md:px-6 md:pb-6"
      data-print-hide
    >
      <div
        className="mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        style={{
          maxWidth: "960px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-floating)",
          padding: "20px 24px",
        }}
      >
        <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-ink-soft)", margin: 0 }}>
          We use essential cookies to run this site and analytics cookies to understand usage. See our{" "}
          <Link href="/privacy" className="no-underline" style={{ color: "var(--blue)", fontWeight: 600 }}>
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleChoice("denied")}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "14px",
              padding: "10px 20px",
              borderRadius: "var(--radius-pill)",
              border: "1.5px solid var(--text-ink)",
              background: "transparent",
              color: "var(--text-ink)",
              cursor: "pointer",
            }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleChoice("granted")}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "14px",
              padding: "10px 20px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              background: "var(--blue)",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

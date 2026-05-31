import { Link } from "wouter";
import logoImg from "@/assets/images/logo.png";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Dr. Murphy", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Medical Disclaimer", href: "/disclaimer" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--bg-dark)" }} data-print-hide>
      <div
        className="mx-auto px-6 md:px-8"
        style={{ maxWidth: "1200px", paddingTop: "80px", paddingBottom: "48px" }}
      >
        <div className="grid gap-12 md:grid-cols-3">
          {/* Column 1 — Logo + tagline */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logoImg} alt="" aria-hidden="true" style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "8px" }} />
              <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-on-dark)", fontFamily: "var(--font-sans)" }}>
                sleepcheckup.com
              </span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: "1.65", color: "var(--text-on-dark-soft)" }}>
              A service of Sleep Check Up, Inc. Clinical content by Michael Murphy, MD, MPH — Stanford Medicine.
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <div className="eyebrow-muted mb-5">Quick Links</div>
            <ul className="space-y-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="no-underline transition-colors"
                    style={{ color: "var(--text-on-dark-soft)", fontSize: "15px" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-on-dark)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-on-dark-soft)"; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Legal */}
          <div>
            <div className="eyebrow-muted mb-5">Legal</div>
            <div className="space-y-3 mb-8">
              {LEGAL_LINKS.map(({ label, href }) => (
                <div key={href}>
                  <Link
                    href={href}
                    className="no-underline transition-colors"
                    style={{ color: "var(--text-on-dark-soft)", fontSize: "15px" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-on-dark)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-on-dark-soft)"; }}
                  >
                    {label}
                  </Link>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "13px", lineHeight: "1.65", color: "var(--text-on-dark-soft)", maxWidth: "280px" }}>
              Murphy Method™ is a trademark of Sleep Check Up, Inc. This tool is for educational purposes only and does not constitute medical advice or diagnosis.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#64748B" }}>
            © {new Date().getFullYear()} Murphy Method™. All rights reserved. A service of Sleep Check Up, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}

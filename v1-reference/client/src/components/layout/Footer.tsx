import { Link } from "wouter";
import { SiteLogoIcon } from "@/components/SiteLogoIcon";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0F172A" }} data-print-hide>
      <div className="container mx-auto px-4 md:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Column 1 — Logo + description */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <SiteLogoIcon size={32} variant="dark" />
              <span className="text-white font-semibold text-base">sleepcheckup.com</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
              A service of Sleep Check Up, Inc. Clinical content by Michael Murphy, MD, MPH — Stanford Medicine.
            </p>
          </div>

          {/* Column 2 — Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "About Dr. Murphy", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Start Free Screening", href: "/screener" },
                { label: "My Portal", href: "/portal" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors no-underline"
                    style={{ color: "#9CA3AF" }}
                    data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Disclaimer */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#9CA3AF" }}>
              Murphy Method™ is a trademark of Sleep Check Up, Inc. This tool is for educational purposes only and does not constitute medical advice or diagnosis.
            </p>
            <div className="space-y-2">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Use", href: "/terms" },
                { label: "Medical Disclaimer", href: "/disclaimer" },
              ].map(({ label, href }) => (
                <div key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors no-underline"
                    style={{ color: "#9CA3AF" }}
                    data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
            <p>© {new Date().getFullYear()} Murphy Method™. All rights reserved.</p>
            <p>A service of Sleep Check Up, Inc.</p>
            <p>Murphy Method™ is a trademark of Sleep Check Up, Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

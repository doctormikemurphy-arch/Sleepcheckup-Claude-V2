import { Link, useLocation } from "wouter";
import { X } from "lucide-react";
import { useEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import logoImg from "@/assets/images/logo.png";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const drawerLinks = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Dr. Murphy", href: "/about" },
  { label: "Free Screener", href: "/screener" },
];

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const [location] = useLocation();

  useEffect(() => { onClose(); }, [location, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" aria-hidden="true" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        id="mobile-drawer"
        className="fixed inset-0 z-50 flex flex-col"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border-soft)" }}
        >
          <Link href="/" className="flex items-center gap-2 no-underline" onClick={onClose}>
            <img src={logoImg} alt="" aria-hidden="true" style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "8px" }} />
            <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-ink)", fontFamily: "var(--font-sans)" }}>
              sleepcheckup.com
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex items-center justify-center rounded-full border-0 bg-transparent cursor-pointer transition-colors"
            style={{ width: "44px", height: "44px", color: "var(--text-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-5 pt-2 flex-1 overflow-y-auto">
          {drawerLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="no-underline py-4 transition-colors"
              style={{
                fontSize: "18px",
                fontWeight: isActive(href) ? 600 : 500,
                color: isActive(href) ? "var(--blue)" : "var(--text-ink)",
                borderBottom: "1px solid var(--border-soft)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {label}
            </Link>
          ))}

          <div className="pt-6 flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="no-underline" style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>
                Sign in
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/portal" className="no-underline" style={{ fontSize: "15px", fontWeight: 500, color: "var(--blue)", fontFamily: "var(--font-sans)" }}>
                My Portal
              </Link>
            </SignedIn>
            {import.meta.env.DEV && (
              <Link
                href="/admin"
                className="no-underline"
                style={{ fontSize: "13px", fontWeight: 500, color: "#B45309", fontFamily: "var(--font-sans)", padding: "4px 10px", borderRadius: "6px", backgroundColor: "#FEF3C7", border: "1px solid #FDE68A" }}
              >
                Admin
              </Link>
            )}
          </div>
        </nav>

        {/* Bottom CTA */}
        <div className="px-5 pb-8 pt-4" style={{ borderTop: "1px solid var(--border-soft)" }}>
          <Link href="/screener" className="block no-underline">
            <button className="btn-primary w-full">
              Start Free Screening
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

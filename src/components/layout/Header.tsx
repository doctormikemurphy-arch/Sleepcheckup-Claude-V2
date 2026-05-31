import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import logoImg from "@/assets/images/logo.png";
import { MobileDrawer } from "./MobileDrawer";

const NAV_ITEMS = [
  { title: "Home", href: "/" },
  { title: "How It Works", href: "/how-it-works" },
  { title: "About Dr. Murphy", href: "/about" },
];

const clerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function Header() {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <>
      <header
        className="fixed z-50"
        style={{ top: "16px", left: "16px", right: "16px" }}
        data-print-hide
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{
            maxWidth: "1100px",
            height: "60px",
            padding: "0 20px",
            background: "rgba(246, 248, 251, 0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "9999px",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            boxShadow: "0 4px 24px rgba(15, 23, 42, 0.06)",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 no-underline flex-shrink-0"
            aria-label="SleepCheckup home"
          >
            <img src={logoImg} alt="" aria-hidden="true" style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "8px" }} />
            <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-ink)", fontFamily: "var(--font-sans)" }}>
              sleepcheckup.com
            </span>
          </Link>

          {/* Desktop center nav */}
          <nav
            className="hidden md:flex items-center"
            style={{ gap: "8px" }}
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ title, href }) => (
              <Link
                key={href}
                href={href}
                className="no-underline transition-colors"
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: isActive(href) ? "var(--text-ink)" : "var(--text-ink-soft)",
                  minHeight: "40px",
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 16px",
                  borderBottom: isActive(href) ? "1.5px solid var(--text-ink)" : "none",
                  fontFamily: "var(--font-sans)",
                }}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {title}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {import.meta.env.DEV && (
              <Link
                href="/admin"
                className="no-underline"
                style={{ fontSize: "13px", fontWeight: 500, color: "#B45309", fontFamily: "var(--font-sans)", padding: "4px 10px", borderRadius: "6px", backgroundColor: "#FEF3C7", border: "1px solid #FDE68A" }}
              >
                Admin
              </Link>
            )}
            {clerkEnabled ? (
              <>
                <SignedOut>
                  <Link href="/sign-in" className="no-underline">
                    <button
                      className="border-0 bg-transparent cursor-pointer"
                      style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
                    >
                      Sign in
                    </button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/portal"
                    className="no-underline"
                    style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
                  >
                    My Portal
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            ) : (
              <Link href="/sign-in" className="no-underline">
                <button
                  className="border-0 bg-transparent cursor-pointer"
                  style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
                >
                  Sign in
                </button>
              </Link>
            )}
            <Link href="/screener" className="no-underline">
              <button
                className="btn-primary"
                style={{ fontSize: "15px", padding: "10px 24px", minHeight: "40px" }}
              >
                Start Free Screening
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center border-0 bg-transparent cursor-pointer rounded-full transition-colors"
            style={{ width: "40px", height: "40px", color: "var(--text-ink-soft)" }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

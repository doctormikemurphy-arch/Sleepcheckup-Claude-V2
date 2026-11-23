import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import logoImg from "@/assets/images/logo.png";
import { MobileDrawer } from "./MobileDrawer";

const NAV_ITEMS = [
  { title: "Home", href: "/" },
  { title: "How It Works", href: "/how-it-works" },
  { title: "About Dr. Murphy", href: "/about" },
];

const clerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

/** The floating nav sits 16px from the top and is 60px tall. */
const NAV_TOP = 16;
const NAV_HEIGHT = 60;

const isTransparent = (color: string) => !color || color === "transparent" || /^rgba\(.*,\s*0\)$/.test(color);

/**
 * Color of the full-width section currently just below the nav strip, so the strip blends into
 * it: dark over a dark hero, light over light sections. Looks at each layer at that spot from the
 * top down; cards narrower than the window are skipped. Over a full-width video (the home page
 * hero) the strip is see-through, so the video shows behind the nav. A gradient overlay with no
 * video under it counts as its first color at full strength.
 */
function colorUnderNav(strip: HTMLElement | null): string {
  const y = NAV_TOP + NAV_HEIGHT + 1;
  const minWidth = window.innerWidth * 0.9;
  let gradientColor: string | null = null;
  for (const el of document.elementsFromPoint(4, y)) {
    if (el === strip || el.closest("header")) continue;
    if (el.getBoundingClientRect().width < minWidth) continue;
    if (el.tagName === "VIDEO") return "transparent";
    const style = getComputedStyle(el);
    if (!isTransparent(style.backgroundColor)) return gradientColor ?? style.backgroundColor;
    const first = style.backgroundImage.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (first && !gradientColor) gradientColor = `rgb(${first[1]}, ${first[2]}, ${first[3]})`;
  }
  return gradientColor ?? "var(--bg-page)";
}

export function Header() {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stripColor, setStripColor] = useState("var(--bg-page)");
  const stripRef = useRef<HTMLDivElement>(null);

  // Keep the solid strip behind the nav the same color as the section scrolling under it.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setStripColor(colorUnderNav(stripRef.current)));
    };
    update();
    const late = setTimeout(update, 300); // pages that render their first section a moment later
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(late);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <>
      {/* Solid strip above and behind the floating nav, so page content scrolling up
          does not show in the gap around it. */}
      <div
        ref={stripRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-40 print:hidden"
        style={{ height: `${NAV_TOP + NAV_HEIGHT}px`, backgroundColor: stripColor }}
      />
      <header
        className="fixed z-50"
        style={{ top: `${NAV_TOP}px`, left: "16px", right: "16px" }}
        data-print-hide
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{
            maxWidth: "1100px",
            height: `${NAV_HEIGHT}px`,
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
            ) : null}
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

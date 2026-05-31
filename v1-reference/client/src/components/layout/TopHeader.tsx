import { Link, useLocation } from "wouter";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { SiteLogoIcon } from "@/components/SiteLogoIcon";
import { DEV_MOCK_ASSESSMENTS } from "@/lib/dev-mock-assessments";

const PATHWAYS = [
  { letter: "A", label: "Insomnia (COMISA)" },
  { letter: "B", label: "Obesity" },
  { letter: "C", label: "Nasal" },
  { letter: "D", label: "Mandible & Tongue" },
  { letter: "E", label: "Multi-Level" },
  { letter: "F", label: "Physiology" },
  { letter: "G", label: "Low Risk / Snoring" },
  { letter: "H", label: "Complex / Mixed" },
];

const STORAGE_KEY = "murphy_method_assessment";

function DevPathwayBar() {
  const [location, navigate] = useLocation();
  const activePathway = location.match(/^\/pathways\/([a-h])$/i)?.[1]?.toUpperCase();
  const isReportPage = location === "/assessment/report";
  const [activeReport, setActiveReport] = useState<string | null>(null);

  function loadReportPreview(letter: string) {
    const mock = DEV_MOCK_ASSESSMENTS[letter];
    if (!mock) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
    setActiveReport(letter);
    navigate("/assessment/report");
  }

  const ROW = {
    height: "36px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "0 16px",
    overflowX: "auto" as const,
    flexShrink: 0,
  };

  const CHIP_BASE = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "11px",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#cbd5e1",
    fontWeight: 500,
  };

  return (
    <div style={{ backgroundColor: "#1e3a5f", borderBottom: "1px solid #2d5282", flexShrink: 0 }}>
      {/* Row 1 — Pathway landing pages */}
      <div style={ROW}>
        <span style={{ color: "#fbbf24", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap", marginRight: "4px" }}>DEV</span>
        <span style={{ color: "#94a3b8", fontSize: "11px", whiteSpace: "nowrap", marginRight: "4px" }}>Pages:</span>
        {PATHWAYS.map(({ letter, label }) => {
          const isActive = activePathway === letter;
          return (
            <Link
              key={letter}
              href={`/pathways/${letter.toLowerCase()}`}
              title={`Pathway ${letter}: ${label}`}
              style={{
                ...CHIP_BASE,
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? "#fbbf24" : "rgba(255,255,255,0.08)",
                color: isActive ? "#1e3a5f" : "#cbd5e1",
                border: isActive ? "1px solid #fbbf24" : "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span style={{ fontWeight: 700 }}>{letter}</span>
              <span style={{ opacity: 0.8 }}>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Row 2 — Full report previews */}
      <div style={{ ...ROW, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <span style={{ color: "#34d399", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap", marginRight: "4px" }}>RPT</span>
        <span style={{ color: "#94a3b8", fontSize: "11px", whiteSpace: "nowrap", marginRight: "4px" }}>Reports:</span>
        {PATHWAYS.map(({ letter, label }) => {
          const isActive = isReportPage && activeReport === letter;
          return (
            <button
              key={letter}
              onClick={() => loadReportPreview(letter)}
              title={`Preview Report for Pathway ${letter}: ${label}`}
              style={{
                ...CHIP_BASE,
                fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? "#34d399" : "rgba(255,255,255,0.08)",
                color: isActive ? "#1e3a5f" : "#cbd5e1",
                border: isActive ? "1px solid #34d399" : "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span style={{ fontWeight: 700 }}>{letter}</span>
              <span style={{ opacity: 0.8 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const navItems = [
  { title: "Home", href: "/" },
  { title: "How It Works", href: "/how-it-works" },
  { title: "About Dr. Murphy", href: "/about" },
];

export function TopHeader() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const headerHeight = import.meta.env.DEV ? "136px" : "64px";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex flex-col"
      style={{ height: headerHeight }}
      data-print-hide
    >
      {import.meta.env.DEV && <DevPathwayBar />}
      <div className="container mx-auto px-4 md:px-6" style={{ height: "64px", display: "flex", alignItems: "center" }}>
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" data-testid="logo-header">
            <SiteLogoIcon size={36} />
            <span className="font-semibold text-base tracking-tight" style={{ color: "#0F172A" }}>
              sleepcheckup.com
            </span>
          </Link>

          {/* Desktop Center Nav */}
          <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-4 py-2 text-[15px] transition-colors no-underline"
                style={{
                  color: isActive(item.href) ? "#0F172A" : "#374151",
                  fontWeight: isActive(item.href) ? "600" : "500",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#0F172A";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = isActive(item.href) ? "#0F172A" : "#374151";
                }}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Desktop Right: Admin link + My Portal + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/portal"
              className="text-[13px] no-underline font-medium"
              style={{ color: "#374151" }}
              data-testid="nav-portal-link"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0F172A"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#374151"; }}
            >
              My Portal
            </Link>
            {(import.meta.env.DEV || (!isLoading && isAuthenticated)) && (
              <Link
                href="/admin"
                className="text-[13px] no-underline"
                style={{ color: "#6B7280" }}
                data-testid="nav-admin-link"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0F172A"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6B7280"; }}
              >
                Admin
              </Link>
            )}
            {!isLoading && isAuthenticated && (
              <button
                onClick={() => logout()}
                className="text-[13px] text-gray-400 border-0 bg-transparent cursor-pointer flex items-center gap-1 p-0"
                data-testid="nav-sign-out"
                title="Sign out"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0F172A"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; }}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
            {!isLoading && !isAuthenticated && (
              <a
                href="/api/login"
                className="text-[13px] no-underline font-medium"
                style={{ color: "#374151" }}
                data-testid="nav-login-link"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0F172A"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#374151"; }}
              >
                Log In
              </a>
            )}
            <Link href="/screener" data-testid="nav-start-screening-header">
              <button
                className="text-white text-[14px] font-medium rounded-md transition-colors cursor-pointer border-0"
                style={{
                  backgroundColor: "#0F172A",
                  padding: "10px 20px",
                  borderRadius: "6px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1E293B";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#0F172A";
                }}
              >
                Start Free Screening
              </button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 border-0 bg-transparent cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <nav className="flex flex-col px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                data-testid={`nav-mobile-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="py-3 text-[15px] border-b border-gray-100 no-underline"
                style={{
                  color: isActive(item.href) ? "#0F172A" : "#374151",
                  fontWeight: isActive(item.href) ? "600" : "500",
                }}
              >
                {item.title}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-3">
              <Link href="/portal" className="text-[14px] font-medium text-gray-700 no-underline" data-testid="nav-mobile-portal">
                My Portal
              </Link>
              {(import.meta.env.DEV || (!isLoading && isAuthenticated)) && (
                <Link href="/admin" className="text-[14px] text-gray-500 no-underline" data-testid="nav-mobile-admin">
                  Admin Panel
                </Link>
              )}
              {!isLoading && isAuthenticated && (
                <button
                  onClick={() => logout()}
                  className="text-[14px] text-gray-400 border-0 bg-transparent cursor-pointer flex items-center gap-2 p-0 text-left"
                  data-testid="nav-mobile-sign-out"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              )}
              {!isLoading && !isAuthenticated && (
                <a
                  href="/api/login"
                  className="text-[14px] font-medium text-gray-700 no-underline"
                  data-testid="nav-mobile-login"
                >
                  Log In
                </a>
              )}
              <Link href="/screener" data-testid="nav-mobile-screening" className="block">
                <button
                  className="w-full text-white text-[15px] font-medium py-3 rounded-md border-0 cursor-pointer"
                  style={{ backgroundColor: "#0F172A", borderRadius: "6px" }}
                >
                  Start Free Screening
                </button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

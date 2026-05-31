import { Link, useLocation } from "wouter";

const HIDDEN_ROUTES = ["/screener", "/assessment"];

export function StickyMobileCTA() {
  const [location] = useLocation();

  if (HIDDEN_ROUTES.some((route) => location.startsWith(route))) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3"
      style={{
        background: "linear-gradient(to top, rgba(246,248,251,1) 60%, rgba(246,248,251,0))",
      }}
      data-print-hide
    >
      <Link href="/screener" className="block no-underline">
        <button className="btn-primary w-full">
          Start Free Screening →
        </button>
      </Link>
    </div>
  );
}

import { useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCTA } from "./StickyMobileCTA";
import { CookieConsentBanner } from "./CookieConsentBanner";

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideStickyBar?: boolean;
}

export function Layout({
  children,
  hideHeader = false,
  hideFooter = false,
}: LayoutProps) {
  const [location] = useLocation();

  // Land at the top of each new page instead of preserving scroll position
  // from the page the person navigated away from.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>
      {!hideHeader && <Header />}

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {!hideFooter && <Footer />}

      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col">
        <CookieConsentBanner />
        <StickyMobileCTA />
      </div>
    </div>
  );
}

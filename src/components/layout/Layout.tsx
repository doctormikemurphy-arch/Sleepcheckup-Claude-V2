import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCTA } from "./StickyMobileCTA";

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
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-page)" }}>
      {!hideHeader && <Header />}

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {!hideFooter && <Footer />}

      <StickyMobileCTA />
    </div>
  );
}

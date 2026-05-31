import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsent } from "@/components/CookieConsent";
import { TopHeader } from "@/components/layout/TopHeader";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

import HomePage from "@/pages/home";
import HowItWorksPage from "@/pages/how-it-works";
import AssessmentWrapper from "@/pages/assessment-wrapper";
import ResultsPage from "@/pages/results";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import DisclaimerPage from "@/pages/disclaimer";
import AssessmentInfoPage from "@/pages/assessment-info";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import ScreeningWrapper from "@/pages/screening-wrapper";
import AssessmentReportPage from "@/pages/assessment-report";
import ReportTokenPage from "@/pages/report-token";
import AdminPage from "@/pages/admin/resources";
import ResourcesPage from "@/pages/resources";
import MyPortalPage from "@/pages/my-pathway";
import PathwayAPage from "@/pages/pathways/a";
import PathwayBPage from "@/pages/pathways/b";
import PathwayCPage from "@/pages/pathways/c";
import PathwayDPage from "@/pages/pathways/d";
import PathwayEPage from "@/pages/pathways/e";
import PathwayFPage from "@/pages/pathways/f";
import PathwayGPage from "@/pages/pathways/g";
import PathwayHPage from "@/pages/pathways/h";
import RackCardPage from "@/pages/rack-card";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/about" component={AboutPage} />
      {/* /screener is the canonical URL per spec; /screening and /screener/results kept for compat */}
      <Route path="/screener" component={ScreeningWrapper} />
      <Route path="/screener/results" component={ScreeningWrapper} />
      <Route path="/screening" component={ScreeningWrapper} />
      <Route path="/assessment/info" component={AssessmentInfoPage} />
      <Route path="/assessment/report" component={AssessmentReportPage} />
      <Route path="/report/:token" component={ReportTokenPage} />
      <Route path="/assessment" component={AssessmentWrapper} />
      <Route path="/results" component={ResultsPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/disclaimer" component={DisclaimerPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/portal" component={MyPortalPage} />
      <Route path="/rack-card" component={RackCardPage} />
      <Route path="/pathways/a" component={PathwayAPage} />
      <Route path="/pathways/b" component={PathwayBPage} />
      <Route path="/pathways/c" component={PathwayCPage} />
      <Route path="/pathways/d" component={PathwayDPage} />
      <Route path="/pathways/e" component={PathwayEPage} />
      <Route path="/pathways/f" component={PathwayFPage} />
      <Route path="/pathways/g" component={PathwayGPage} />
      <Route path="/pathways/h" component={PathwayHPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <TopHeader />
      {/* In dev: pt-[136px] for two 36px dev rows + 64px nav. In prod: pt-16 (64px) */}
      <main className={`flex-1 ${import.meta.env.DEV ? "pt-[136px]" : "pt-16"}`}>
        <Router />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppShell />
        <Toaster />
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

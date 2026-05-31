import { Route, Switch } from "wouter";
import { Layout } from "@/components/layout/Layout";
import HomePage from "@/pages/home";
import ScreenerPage from "@/pages/screener/index";
import ScreenerResults from "@/pages/ScreenerResults";
import AssessmentPage from "@/pages/assessment/index";
import AssessmentInfoPage from "@/pages/assessment-info";
import AssessmentCheckoutPage from "@/pages/assessment-checkout";
import AssessmentReportPage from "@/pages/assessment-report";
import AssessmentResultsPage from "@/pages/assessment-results";
import HowItWorksPage from "@/pages/how-it-works";
import AboutPage from "@/pages/about";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import PathwaysPage from "@/pages/pathways/index";
import PathwayDetailPage from "@/pages/pathways/detail";
import ContactPage from "@/pages/contact";
import PortalPage from "@/pages/portal";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import DisclaimerPage from "@/pages/disclaimer";
import AdminPage from "@/pages/admin/index";

function ComingSoon({ page }: { page: string }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
      <div className="text-center px-4">
        <p className="text-ink-soft" style={{ fontSize: "13px" }}>sleepcheckup v2</p>
        <h1 className="font-bold text-ink mt-2" style={{ fontSize: "26px" }}>{page}</h1>
        <p className="text-ink-muted mt-1" style={{ fontSize: "15px" }}>Coming in a future phase</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Switch>
        {/* Assessment + screener flows — no standard header (they get ProgressTopBar) */}
        <Route path="/screener">
          <Layout hideHeader hideFooter>
            <ScreenerPage />
          </Layout>
        </Route>
        <Route path="/screener/results">
          <Layout hideHeader hideFooter>
            <ScreenerResults />
          </Layout>
        </Route>
        <Route path="/assessment/info">
          <Layout>
            <AssessmentInfoPage />
          </Layout>
        </Route>
        <Route path="/assessment/checkout">
          <Layout>
            <AssessmentCheckoutPage />
          </Layout>
        </Route>
        <Route path="/assessment/results">
          <Layout hideHeader hideFooter>
            <AssessmentResultsPage />
          </Layout>
        </Route>
        <Route path="/assessment/report">
          <Layout hideHeader hideFooter>
            <AssessmentReportPage />
          </Layout>
        </Route>
        <Route path="/assessment">
          <Layout hideHeader hideFooter>
            <AssessmentPage />
          </Layout>
        </Route>

        {/* Standard pages */}
        <Route path="/">
          <Layout>
            <HomePage />
          </Layout>
        </Route>
        <Route path="/how-it-works">
          <Layout>
            <HowItWorksPage />
          </Layout>
        </Route>
        <Route path="/about">
          <Layout>
            <AboutPage />
          </Layout>
        </Route>
        <Route path="/pricing">
          <Layout>
            <PricingPage />
          </Layout>
        </Route>
        <Route path="/blog">
          <Layout>
            <BlogPage />
          </Layout>
        </Route>
        <Route path="/blog/:slug">
          <Layout>
            <ComingSoon page="Blog Post" />
          </Layout>
        </Route>
        <Route path="/pathways">
          <Layout>
            <PathwaysPage />
          </Layout>
        </Route>
        <Route path="/pathways/:letter">
          <Layout>
            <PathwayDetailPage />
          </Layout>
        </Route>
        <Route path="/contact">
          <Layout>
            <ContactPage />
          </Layout>
        </Route>
        <Route path="/portal">
          <Layout>
            <PortalPage />
          </Layout>
        </Route>
        <Route path="/sign-in">
          <Layout hideHeader hideFooter>
            <SignInPage />
          </Layout>
        </Route>
        <Route path="/sign-in/sso-callback">
          <Layout hideHeader hideFooter>
            <SignInPage />
          </Layout>
        </Route>
        <Route path="/sign-up">
          <Layout hideHeader hideFooter>
            <SignUpPage />
          </Layout>
        </Route>
        <Route path="/sign-up/sso-callback">
          <Layout hideHeader hideFooter>
            <SignUpPage />
          </Layout>
        </Route>
        <Route path="/privacy">
          <Layout>
            <PrivacyPage />
          </Layout>
        </Route>
        <Route path="/terms">
          <Layout>
            <TermsPage />
          </Layout>
        </Route>
        <Route path="/disclaimer">
          <Layout>
            <DisclaimerPage />
          </Layout>
        </Route>
        <Route path="/admin">
          <AdminPage />
        </Route>
        <Route path="/rack-card">
          <Layout>
            <ComingSoon page="Rack Card" />
          </Layout>
        </Route>
        <Route>
          <Layout>
            <ComingSoon page="Page Not Found" />
          </Layout>
        </Route>
      </Switch>
    </>
  );
}

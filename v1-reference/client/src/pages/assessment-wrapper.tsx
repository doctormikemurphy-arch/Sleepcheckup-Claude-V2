import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import AssessmentPage from "./assessment";
import { Loader2, Lock, ArrowRight, LayoutDashboard, History, BookOpen, Sparkles, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

const PAYMENT_KEY = "mm_payment_session";

function getStoredPayment(): string | null {
  try { return localStorage.getItem(PAYMENT_KEY); } catch { return null; }
}
function storePayment(sessionId: string) {
  try { localStorage.setItem(PAYMENT_KEY, sessionId); } catch {}
}

function PortalPrompt({ onSkip }: { onSkip: () => void }) {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <LayoutDashboard className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-portal-prompt-heading">
              Your report is ready — and there's more ahead
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your PDF report is being emailed to you now. Setting up a free portal gives you a permanent home for your results — and keeps you updated as pathway resources evolve.
            </p>
          </div>

          <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
            <CardContent className="pt-5 pb-4 space-y-3">
              <p className="text-sm font-medium text-foreground">My Portal includes:</p>
              <ul className="space-y-2">
                {[
                  { icon: Laptop, text: "Access your full report and PDF from any device, any time" },
                  { icon: BookOpen, text: "Pathway-specific resources — videos, articles, and specialists — updated continuously" },
                  { icon: History, text: "Full assessment history so you can track changes over time" },
                  { icon: Sparkles, text: "Retake the assessment anytime — each result is saved and archived" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <a href="/api/login?returnTo=/assessment" data-testid="button-setup-portal">
              <Button size="lg" className="w-full gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Set Up My Portal (free)
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={onSkip}
              data-testid="button-skip-portal"
            >
              Continue to assessment
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Your PDF report will be emailed to you regardless. The portal is simply a way to keep everything in one place and stay connected to your pathway resources over time.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default function AssessmentWrapper() {
  const [location] = useLocation();
  const [status, setStatus] = useState<"checking" | "portal-prompt" | "paid" | "unpaid">("checking");
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    // Dev mode: skip payment gate entirely
    if (import.meta.env.DEV) {
      setStatus("paid");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const stored = getStoredPayment();

    // Already verified in a previous visit — skip portal prompt
    if (stored && !sessionId) {
      setStatus("paid");
      return;
    }

    // Coming back from Stripe with a session_id — verify it
    if (sessionId) {
      fetch(`/api/verify-payment?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.paid) {
            storePayment(sessionId);
            if (data.email) {
              localStorage.setItem("mm_screener_email", data.email);
              setVerifiedEmail(data.email);
            }
            // Clean session_id from URL without reload
            window.history.replaceState({}, "", "/assessment");
            // Show portal setup prompt for fresh payments
            setStatus("portal-prompt");
          } else {
            setStatus("unpaid");
          }
        })
        .catch(() => setStatus("unpaid"));
      return;
    }

    // No session_id, no stored payment
    setStatus("unpaid");
  }, []);

  if (status === "checking") {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground text-sm">Verifying your payment…</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (status === "portal-prompt") {
    return <PortalPrompt onSkip={() => setStatus("paid")} />;
  }

  if (status === "unpaid") {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md space-y-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Payment Required</h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                The full assessment requires a one-time $1 payment. Return to your screening results to complete checkout and unlock the assessment.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/screener">
                <Button size="lg" className="w-full gap-2" data-testid="button-return-to-results">
                  Return to My Results &amp; Pay
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full" data-testid="button-go-home">
                  Back to Home
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Already paid? Make sure you're using the same browser and device from your purchase.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AssessmentPage />
    </Layout>
  );
}

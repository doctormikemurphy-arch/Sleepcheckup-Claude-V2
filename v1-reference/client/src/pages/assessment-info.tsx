import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/Disclaimer";
import { PremiumBadge } from "@/components/PremiumGate";
import {
  Check, ArrowRight, ClipboardList, Stethoscope, Target, FileText, Sparkles, Loader2, LayoutDashboard, BookOpen, RotateCcw
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "How Is the Breathing at Night?",
    description: "Medical history, BMI, STOP-BANG, ISI, and PLATO-11 questionnaires.",
    colorClass: "text-blue-600 dark:text-blue-400",
    iconBgClass: "bg-blue-600/10",
  },
  {
    icon: Stethoscope,
    title: "Where Can the Airway Narrow?",
    description: "Identify areas of your airway that may affect breathing during sleep.",
    colorClass: "text-green-600 dark:text-green-400",
    iconBgClass: "bg-green-600/10",
  },
  {
    icon: Target,
    title: "What Can Help?",
    description: "PALM classification and a full overview of treatment options.",
    colorClass: "text-red-600 dark:text-red-400",
    iconBgClass: "bg-red-600/10",
  },
  {
    icon: FileText,
    title: "Your Results",
    description: "Personalized pathway assignment with curated resources, printable for your doctor.",
    colorClass: "text-gray-900 dark:text-gray-200",
    iconBgClass: "bg-gray-900/10 dark:bg-gray-200/10",
  },
];

const includedFeatures = [
  "Medical history screening (10 conditions)",
  "STOP-BANG sleep apnea risk score",
  "Insomnia Severity Index (ISI)",
  "PLATO-11 treatment readiness profile",
  "Top-Down Anatomy self-check (4 zones)",
  "Personalized pathway assignment",
  "Pathway-specific curated resources",
  "Video courses & expert content",
  "Product & specialist recommendations",
  "Printable results for your doctor",
  "Export results as PDF, JSON, or CSV",
];

export default function AssessmentInfoPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    // Dev mode: skip Stripe entirely and go straight to the assessment
    if (import.meta.env.DEV) {
      navigate("/assessment");
      return;
    }

    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const email = localStorage.getItem("mm_screener_email") || undefined;
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = data.url;
          } else {
            window.location.href = data.url;
          }
        } catch (_) {
          window.open(data.url, "_blank");
        }
      } else {
        setCheckoutError("Could not start checkout. Please try again.");
        setCheckingOut(false);
      }
    } catch {
      setCheckoutError("Could not start checkout. Please try again.");
      setCheckingOut(false);
    }
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-10">

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Murphy Method™ Full Assessment
                </h1>
                <PremiumBadge />
              </div>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                A comprehensive educational evaluation of your sleep breathing — personalized to your unique situation.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {steps.map((step) => (
                <div key={step.title} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className={`w-9 h-9 rounded-md ${step.iconBgClass} flex items-center justify-center flex-shrink-0`}>
                    <step.icon className={`w-5 h-5 ${step.colorClass}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${step.colorClass}`}>{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="border-primary/30" data-testid="card-assessment-info-included">
              <CardContent className="pt-6 pb-6 space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">What's Included</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Everything in this comprehensive evaluation</p>
                </div>

                <ul className="space-y-2">
                  {includedFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-md bg-primary/5 border border-primary/20 p-4 space-y-3" data-testid="card-portal-benefit">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">My Portal — Free with Purchase</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    After completing your assessment, you can set up My Portal to save your results, track progress over time, and access live pathway resources updated by Dr. Murphy's team. Retake the assessment whenever your situation changes — all your history is kept.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { icon: FileText, label: "Results saved & archived" },
                      { icon: RotateCcw, label: "Track retakes over time" },
                      { icon: BookOpen, label: "Live pathway resources" },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-2 space-y-2">
                  <Button
                    className="gap-2 text-lg px-8 h-12"
                    data-testid="button-begin-assessment"
                    onClick={handleCheckout}
                    disabled={checkingOut}
                  >
                    {checkingOut ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecting to checkout…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Begin Assessment
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                  {checkoutError && (
                    <p className="text-sm text-red-600">{checkoutError}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Disclaimer variant="warning" />

          </div>
        </div>
      </section>
    </Layout>
  );
}

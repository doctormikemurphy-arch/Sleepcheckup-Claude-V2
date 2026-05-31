import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Check, ArrowRight } from "lucide-react";

const PAYMENT_KEY = "mm_payment_session";
const ASSESSMENT_KEY = "murphy_method_assessment";

function hasCompletedAssessment(): boolean {
  try {
    const paid = localStorage.getItem(PAYMENT_KEY);
    const data = localStorage.getItem(ASSESSMENT_KEY);
    return !!(paid || data);
  } catch {
    return false;
  }
}

const PREMIUM_FEATURES = [
  "Complete pathway assignment (1 of 8 Murphy Method™ pathways)",
  "Medical history & comorbidity analysis",
  "BMI and physical risk assessment",
  "Treatment options specific to your pathway",
  "Doctor visit prep sheet",
  "Curated pathway resources — videos, articles, specialists",
  "Emailed report with permanent recovery link",
];

interface PremiumGateProps {
  children: React.ReactNode;
  featureLabel?: string;
}

export function PremiumGate({ children, featureLabel }: PremiumGateProps) {
  if (hasCompletedAssessment()) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#EFF6FF" }}>
            <Lock className="w-6 h-6" style={{ color: "#2563EB" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#0F172A" }}>
            Full Assessment Required
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
            {featureLabel ? `Access to ${featureLabel} is` : "Pathway details and resources are"} included with the full Murphy Method™ assessment — a one-time $1 purchase.
          </p>
        </div>

        <Card style={{ border: "1px solid #BFDBFE", backgroundColor: "#EFF6FF" }}>
          <CardContent className="pt-5 pb-4 space-y-3">
            <p className="text-sm font-semibold" style={{ color: "#1D4ED8" }}>Full Assessment includes:</p>
            <ul className="space-y-2">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#2563EB" }} />
                  <span className="text-sm" style={{ color: "#1E3A5F" }}>{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Link href="/screener">
            <Button className="w-full gap-2" style={{ backgroundColor: "#2563EB", color: "white" }}>
              Start Free Screener — Then Get Your Report
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full text-sm" style={{ color: "#6B7280" }}>
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs" style={{ color: "#9CA3AF" }}>
          $1 one-time · No account required · No subscription
        </p>
      </div>
    </div>
  );
}

export function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-md">
      <Lock className="w-3 h-3" />
      Premium
    </span>
  );
}

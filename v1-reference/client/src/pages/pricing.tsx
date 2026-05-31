import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Check, X, ArrowRight, Lock, Sparkles } from "lucide-react";
import { PremiumBadge } from "@/components/PremiumGate";

const freeFeatures = [
  { text: "STOP-BANG sleep apnea risk score", included: true },
  { text: "Insomnia Severity Index (ISI)", included: true },
  { text: "Airway self-check (4 zones)", included: true },
  { text: "Treatment overview", included: true },
  { text: "Printable results for your doctor", included: true },
  { text: "General educational resources", included: true },
  { text: "PLATO-11 treatment profile", included: false },
  { text: "Medical history screening", included: false },
  { text: "Personalized pathway assignment", included: false },
  { text: "Pathway-specific curated resources", included: false },
  { text: "Video courses & expert content", included: false },
  { text: "Product & specialist recommendations", included: false },
];

const fullFeatures = [
  { text: "STOP-BANG sleep apnea risk score", included: true },
  { text: "Insomnia Severity Index (ISI)", included: true },
  { text: "Airway self-check (4 zones)", included: true },
  { text: "Treatment overview", included: true },
  { text: "Printable results for your doctor", included: true },
  { text: "General educational resources", included: true },
  { text: "PLATO-11 treatment profile", included: true },
  { text: "Medical history screening", included: true },
  { text: "Personalized pathway assignment", included: true },
  { text: "Pathway-specific curated resources", included: true },
  { text: "Video courses & expert content", included: true },
  { text: "Product & specialist recommendations", included: true },
];

function FeatureRow({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-start gap-3">
      {included ? (
        <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
      )}
      <span className={`text-sm ${included ? "text-foreground" : "text-muted-foreground/60"}`}>
        {text}
      </span>
    </li>
  );
}

export default function PricingPage() {
  const [showBypass, setShowBypass] = useState(false);

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                Choose your path to better sleep
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start for free and explore your risk profile, or unlock the full assessment for a personalized educational pathway built around your specific situation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <Card data-testid="card-pricing-free">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-xl">Free Screening</CardTitle>
                    <span className="text-2xl font-bold text-foreground">$0</span>
                  </div>
                  <CardDescription className="text-base">
                    A quick snapshot of your sleep apnea risk and anatomy, with printable results.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {freeFeatures.map((f, i) => (
                      <FeatureRow key={i} {...f} />
                    ))}
                  </ul>
                  <Link href="/screening">
                    <Button variant="outline" className="w-full" size="default" data-testid="button-pricing-free-cta">
                      Start Free Screening
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-primary" data-testid="card-pricing-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl">Full Assessment</CardTitle>
                      <PremiumBadge />
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-foreground">Coming soon</span>
                      <p className="text-xs text-muted-foreground">Pricing TBD</p>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    Your complete, personalized educational pathway with curated resources tailored to your unique situation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {fullFeatures.map((f, i) => (
                      <FeatureRow key={i} {...f} />
                    ))}
                  </ul>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Premium — Coming Soon</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      We're preparing the premium experience. Join the waitlist to be notified when it launches.
                    </p>
                    {import.meta.env.DEV && (
                      !showBypass ? (
                        <button
                          type="button"
                          onClick={() => setShowBypass(true)}
                          className="text-xs text-muted-foreground/50 underline block mx-auto"
                          data-testid="button-pricing-bypass"
                        >
                          Preview full assessment (dev)
                        </button>
                      ) : (
                        <Link href="/assessment/info">
                          <Button className="w-full gap-2" size="default" data-testid="button-pricing-full-cta">
                            <Sparkles className="w-4 h-4" />
                            Preview Full Assessment
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 space-y-4">
              <div className="p-6 rounded-lg bg-muted/40 border border-border text-center">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Educational purposes only.</strong>{" "}
                  The Murphy Method™ is not a substitute for a clinical evaluation. Results are intended to support informed conversations with your healthcare provider.
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Billing entity: Sleep Check Up, Inc.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

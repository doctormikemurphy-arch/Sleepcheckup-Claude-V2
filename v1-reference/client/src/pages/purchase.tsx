import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  CreditCard,
  Star,
  Shield,
  ClipboardCheck,
  BarChart3,
  Route,
  Stethoscope,
  Brain,
  HeartPulse,
  Target,
  Lightbulb,
  BookOpen,
  TrendingUp,
  FileDown,
  UserCheck,
  Video,
  ShoppingBag,
} from "lucide-react";

const VALUE_ITEMS = [
  "Validated screening questionnaires used in clinical practice",
  "Personalized risk scoring across multiple sleep-related domains",
  "Guided self-assessment of your upper airway anatomy",
  "Interactive 3D anatomy explorer for deeper understanding",
  "A comprehensive analysis of the factors behind your sleep breathing patterns",
  "Assignment to your own personalized Murphy Method pathway",
  "Detailed, printable results summary for your doctor",
  "A personalized action plan with clear next steps",
  "Curated resources: videos, articles, products, books, and specialist referrals",
];

const JOURNEY_STEPS = [
  {
    step: 1,
    icon: ClipboardCheck,
    title: "Complete Your Assessment",
    description: "Answer clinically validated questionnaires and perform guided self-assessments designed by a board-certified ENT and Sleep physician.",
  },
  {
    step: 2,
    icon: BarChart3,
    title: "Get Your Personalized Results",
    description: "Receive detailed scoring and analysis across multiple domains — with a printable summary you can share with your healthcare provider.",
  },
  {
    step: 3,
    icon: Route,
    title: "Follow Your Pathway",
    description: "Get assigned to your own Murphy Method pathway with a personalized action plan, curated resources, and clear next steps.",
  },
];

const DISCOVERY_ITEMS = [
  {
    icon: HeartPulse,
    title: "Your Sleep Breathing Risk Profile",
    description: "Understand where you fall on validated clinical scales for sleep apnea risk, insomnia severity, and symptom burden.",
  },
  {
    icon: Stethoscope,
    title: "Your Upper Airway Assessment",
    description: "A guided self-check of key anatomical areas that influence your breathing during sleep, with scoring and interpretation.",
  },
  {
    icon: Brain,
    title: "The Factors Behind Your Patterns",
    description: "Learn which underlying physiological factors may be driving your sleep breathing patterns — not just the symptoms.",
  },
  {
    icon: Target,
    title: "Your Personalized Pathway",
    description: "Based on your unique combination of results, you'll be matched to a personalized pathway with guidance tailored to your situation.",
  },
  {
    icon: Lightbulb,
    title: "A Clear Action Plan",
    description: "Step-by-step next steps written in plain language, so you know exactly what to do — and which type of specialist to see.",
  },
  {
    icon: BookOpen,
    title: "Curated Resources",
    description: "Hand-picked videos, articles, recommended reading, products, and specialist directories specific to your pathway.",
  },
];

const RESOURCE_TYPES = [
  { icon: Video, label: "Educational Videos" },
  { icon: BookOpen, label: "Recommended Reading" },
  { icon: ShoppingBag, label: "Curated Products" },
  { icon: Stethoscope, label: "Specialist Directories" },
  { icon: FileDown, label: "Printable Reports" },
  { icon: UserCheck, label: "Action Plans" },
];

export default function PurchasePage() {
  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-4 text-sm" data-testid="badge-premium">
                Full Assessment
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-purchase-title">
                Your Personalized Sleep Breathing Assessment
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-purchase-subtitle">
                Get a comprehensive analysis of your sleep breathing patterns with a personalized
                pathway and action plan designed by a board-certified ENT and Sleep physician.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center" data-testid="text-journey-heading">
                How It Works
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Three steps to understanding your sleep breathing
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                {JOURNEY_STEPS.map((item) => (
                  <Card key={item.step} className="relative" data-testid={`card-journey-step-${item.step}`}>
                    <CardContent className="pt-6 pb-5 px-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary-foreground">{item.step}</span>
                        </div>
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="mb-12 border-primary border-2" data-testid="card-value-highlights">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>What's Included</CardTitle>
                    <CardDescription>Everything in your full assessment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {VALUE_ITEMS.map((item, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`item-value-${i}`}>
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center" data-testid="text-discover-heading">
                What You'll Discover
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Personalized insights you won't find anywhere else
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {DISCOVERY_ITEMS.map((item, i) => (
                  <Card key={i} data-testid={`card-discovery-${i}`}>
                    <CardContent className="pt-5 pb-4 px-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="mb-12" data-testid="card-resources-preview">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Unlock Your Pathway Resources</CardTitle>
                    <CardDescription>
                      After completing the assessment, you'll get access to curated resources matched to your pathway
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {RESOURCE_TYPES.map((resource, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                      data-testid={`resource-type-${i}`}
                    >
                      <resource.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-muted-foreground">{resource.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-12" data-testid="card-who-benefits">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Who Benefits Most</CardTitle>
                    <CardDescription>This assessment is designed for people who</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Snore or have been told they stop breathing during sleep",
                    "Wake up feeling unrefreshed despite getting enough hours of sleep",
                    "Have been diagnosed with or suspect sleep apnea",
                    "Want to understand what's happening with their airway during sleep",
                    "Are exploring treatment options and want guidance on where to start",
                    "Want a printable summary to bring to their doctor or specialist",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`item-benefit-${i}`}>
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8 border-primary border-2" data-testid="card-purchase-cta">
              <CardContent className="py-10">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3" data-testid="text-purchase-cta-title">
                    Get Your Full Assessment
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto mb-8" data-testid="text-purchase-cta-description">
                    Unlock your personalized sleep breathing assessment with detailed results,
                    a customized pathway, actionable next steps, and curated resources — all designed
                    by a board-certified ENT and Sleep physician.
                  </p>
                  <Link href="/assessment">
                    <Button
                      size="lg"
                      className="text-lg px-10 h-14 gap-2"
                      data-testid="button-purchase"
                    >
                      Start Full Assessment
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3 mb-10">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Physician-Developed</h4>
                  <p className="text-xs text-muted-foreground">Created by a board-certified specialist</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Secure & Private</h4>
                  <p className="text-xs text-muted-foreground">Your data stays safe and confidential</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Evidence-Based</h4>
                  <p className="text-xs text-muted-foreground">Uses validated screening instruments</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Not ready yet? Try our free screening first.
              </p>
              <Link href="/screening">
                <Button variant="outline" className="gap-2" data-testid="button-free-screening-fallback">
                  Take Free Screening
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

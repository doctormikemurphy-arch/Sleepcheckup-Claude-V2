import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { PathwayGuard } from "@/components/PathwayGuard";
import { PathwayResources } from "@/components/PathwayResources";
import { 
  ArrowLeft, 
  RotateCcw, 
  ChevronRight,
  AlertCircle,
  Heart,
  Lightbulb,
  ClipboardList,
  ArrowRight,
  Printer,
} from "lucide-react";

export interface PathwayNextStepsContent {
  pathwayLetter: string;
  title: string;
  subtitle: string;
  whatResultsSuggest: string[];
  whyItMatters: {
    intro: string;
    points: string[];
  };
  whatWorksBest: {
    intro: string;
    options: string[];
  };
  nextSteps: {
    intro: string;
    steps: string[];
  };
  cta: {
    text: string;
    description: string;
  };
}

interface PathwayNextStepsPageProps {
  content: PathwayNextStepsContent;
}

const LETTER_TO_PATHWAY_ID: Record<string, string> = {
  A: "A_insomnia",
  B: "B_obesity",
  C: "C_nasal",
  D: "D_mandible",
  E: "E_multilevel",
  F: "F_physiology",
  G: "G_low_risk",
  H: "H_complex",
};

export function PathwayNextStepsPage({ content }: PathwayNextStepsPageProps) {
  const pathwayId = content.pathwayLetter.toLowerCase();
  const fullPathwayId = LETTER_TO_PATHWAY_ID[content.pathwayLetter.toUpperCase()] || "G_low_risk";
  
  return (
    <PathwayGuard>
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 print:hidden">
              <Link 
                href="/assessment/report" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                data-testid={`link-back-results-${pathwayId}`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Your Report
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-2"
                data-testid={`button-print-pathway-${pathwayId}`}
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>


            <div className="flex items-start gap-6 mb-10">
              <div 
                className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0"
                data-testid={`badge-pathway-${pathwayId}`}
              >
                <span className="text-3xl font-bold text-primary-foreground">
                  {content.pathwayLetter}
                </span>
              </div>
              <div>
                <h1 
                  className="text-3xl md:text-4xl font-bold text-foreground mb-2"
                  data-testid={`text-pathway-title-${pathwayId}`}
                >
                  {content.title}
                </h1>
                <p 
                  className="text-lg text-muted-foreground"
                  data-testid={`text-pathway-subtitle-${pathwayId}`}
                >
                  {content.subtitle}
                </p>
              </div>
            </div>

            <Card className="mb-8 bg-muted/30" data-testid="card-pathway-guidance">
              <CardContent className="py-5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    The Murphy Method pathways represent common clinical situations and are designed to give you the most efficient path forward with your doctor. Your pathway assignment is based on your specific assessment answers — it is the starting point for a productive conversation with your sleep specialist.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8" data-testid={`card-results-suggest-${pathwayId}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>What Your Results Suggest</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3" data-testid={`list-results-suggest-${pathwayId}`}>
                  {content.whatResultsSuggest.map((point, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`item-results-suggest-${pathwayId}-${i}`}>
                      <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8" data-testid={`card-why-matters-${pathwayId}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>Why This Matters for Your Health</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4" data-testid={`text-why-matters-intro-${pathwayId}`}>
                  {content.whyItMatters.intro}
                </p>
                <ul className="space-y-3" data-testid={`list-why-matters-${pathwayId}`}>
                  {content.whyItMatters.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`item-why-matters-${pathwayId}-${i}`}>
                      <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8" data-testid={`card-what-works-${pathwayId}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>What Usually Works Best for People in This Pathway</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4" data-testid={`text-what-works-intro-${pathwayId}`}>
                  {content.whatWorksBest.intro}
                </p>
                <ul className="space-y-3" data-testid={`list-what-works-${pathwayId}`}>
                  {content.whatWorksBest.options.map((option, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`item-what-works-${pathwayId}-${i}`}>
                      <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{option}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8 border-primary border-2" data-testid={`card-next-steps-${pathwayId}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle>Your Murphy Method Next Steps</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4" data-testid={`text-next-steps-intro-${pathwayId}`}>
                  {content.nextSteps.intro}
                </p>
                <ol className="space-y-3" data-testid={`list-next-steps-${pathwayId}`}>
                  {content.nextSteps.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3" data-testid={`item-next-step-${pathwayId}-${i}`}>
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <PathwayResources pathwayId={fullPathwayId} />

            <Card className="bg-primary text-primary-foreground mb-8 print:hidden" data-testid={`card-cta-${pathwayId}`}>
              <CardContent className="py-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2" data-testid={`text-cta-heading-${pathwayId}`}>
                    {content.cta.text}
                  </h3>
                  <p className="opacity-90 mb-6 max-w-lg mx-auto" data-testid={`text-cta-description-${pathwayId}`}>
                    {content.cta.description}
                  </p>
                  <Link href="/contact">
                    <Button variant="secondary" size="lg" className="gap-2" data-testid={`button-cta-${pathwayId}`}>
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 mb-8 print:hidden" data-testid={`card-reassessment-${pathwayId}`}>
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Track Your Progress Over Time
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      After making changes or starting treatment, retake the assessment to 
                      measure improvement and guide your next decisions.
                    </p>
                  </div>
                  <Link href="/assessment/info">
                    <Button variant="outline" className="gap-2" data-testid={`button-retake-${pathwayId}`}>
                      <RotateCcw className="w-4 h-4" />
                      Retake Assessment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-lg bg-muted/30 border border-border" data-testid={`text-disclaimer-${pathwayId}`}>
              <p className="text-sm text-muted-foreground text-center">
                <strong>Educational Disclaimer:</strong> This information is for educational 
                purposes only and does not constitute medical advice, diagnosis, or treatment. 
                Obstructive sleep apnea has multiple root causes, which is why treatment must 
                be personalized. Always consult with qualified healthcare providers for medical decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
    </PathwayGuard>
  );
}

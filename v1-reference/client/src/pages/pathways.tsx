import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, Compass, Target, CheckCircle2 } from "lucide-react";

export default function PathwaysPage() {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Compass className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="text-pathways-heading">
                Your Situation Is Unique — Your Pathway Should Be Too
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sleep breathing problems aren't one-size-fits-all. The Murphy Method™ identifies <strong className="text-foreground">8 distinct pathways</strong> based on your anatomy, symptoms, and risk factors — so you get guidance that actually fits your situation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <Card data-testid="card-pathway-example-1">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-md bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-foreground">Example: Sleep Apnea + Insomnia</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    When sleep apnea and insomnia overlap, treating one without the other often leads to frustration. This pathway focuses on:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Understanding how insomnia and apnea reinforce each other</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">CBT-I and PAP therapy coordination strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Questions to ask your sleep specialist about combined treatment</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card data-testid="card-pathway-example-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-md bg-green-600/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-foreground">Example: Sleep Apnea + Nasal Problem</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    A blocked or narrow nose can worsen apnea and make treatments harder to tolerate. This pathway focuses on:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">How nasal obstruction contributes to sleep-disordered breathing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Medical and surgical options for improving nasal airflow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">How fixing nasal issues can make non-surgical options like CPAP and oral appliances more successful</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center space-y-4 mb-10">
              <p className="text-muted-foreground max-w-xl mx-auto">
                These are just two examples. The full assessment evaluates your complete picture — anatomy, symptoms, risk factors, and treatment readiness — to match you with the pathway that fits <em>your</em> situation.
              </p>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Each pathway includes a personalized educational summary, curated resources, video courses, specialist recommendations, and a discussion guide for your doctor — all tailored to your specific sleep breathing pattern.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href="/assessment/info">
                  <Button className="gap-2" data-testid="button-discover-pathway">
                    Discover Your Pathway
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/screening">
                  <Button variant="outline" className="gap-2" data-testid="button-start-screening-pathways">
                    Start Free Screening
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-muted/30 border border-border">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Educational Information:</strong> These pathways represent common
                patterns in sleep breathing challenges. Each person is unique, and these
                categories are meant to guide — not replace — professional medical evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

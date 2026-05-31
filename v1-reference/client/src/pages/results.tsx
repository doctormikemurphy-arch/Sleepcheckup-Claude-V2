import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { 
  ArrowRight, 
  RotateCcw,
  Download,
  BookOpen,
  Stethoscope,
  GraduationCap,
  AlertTriangle,
  Compass,
  Star,
  LogIn
} from "lucide-react";
import { getPathwayDefinition, assignMurphyPathway, MURPHY_PATHWAYS } from "@/lib/pathways";
import type { MurphyPathwayId, PatientProfile } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

const STORAGE_KEY = "murphy_method_assessment";

const PATHWAY_ROUTES: Record<string, string> = {
  A_insomnia: "/pathways/a",
  B_obesity: "/pathways/b",
  C_nasal: "/pathways/c",
  D_mandible: "/pathways/d",
  E_multilevel: "/pathways/e",
  F_physiology: "/pathways/f",
  G_low_risk: "/pathways/g",
  H_complex: "/pathways/h",
};

function getPathwayLetter(pathwayId: string): string {
  return pathwayId.charAt(0).toUpperCase();
}

function getLocalStorageResult(): { pathwayId: MurphyPathwayId; profile: PatientProfile } | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      if (state.profile) {
        const profile = state.profile as PatientProfile;
        const pathwayId = assignMurphyPathway(profile);
        return { pathwayId, profile };
      }
    }
  } catch (e) {
    console.error("Error parsing stored assessment:", e);
  }
  return null;
}

export default function ResultsPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  
  const { data: serverResult, isLoading: resultLoading } = useQuery<{ hasResult: boolean; result: any } | null>({
    queryKey: ["/api/assessments/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: isAuthenticated,
  });

  const localResult = getLocalStorageResult();
  
  const isLoading = authLoading || (isAuthenticated && resultLoading);
  
  let pathwayId: MurphyPathwayId | null = null;
  let fromServer = false;

  if (isAuthenticated && serverResult?.hasResult) {
    pathwayId = serverResult.result.assignedPathway;
    fromServer = true;
  } else if (localResult) {
    pathwayId = localResult.pathwayId;
  }

  if (isLoading) {
    return (
      <Layout>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted animate-pulse mx-auto mb-6" />
              <div className="h-8 bg-muted rounded animate-pulse mb-4 max-w-md mx-auto" />
              <div className="h-4 bg-muted rounded animate-pulse max-w-sm mx-auto" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!pathwayId) {
    return (
      <Layout>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                No Results Found
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {isAuthenticated 
                  ? "You haven't completed an assessment yet. Take the assessment to discover your personalized sleep breathing pathway."
                  : "Take the assessment to discover your personalized sleep breathing pathway. Log in to save your results."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/assessment">
                  <Button size="lg" className="text-lg px-8" data-testid="button-take-assessment">
                    Take the Assessment
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <a href="/api/login">
                    <Button size="lg" variant="outline" className="gap-2" data-testid="button-login-results">
                      <LogIn className="w-4 h-4" />
                      Log In
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const pathway = getPathwayDefinition(pathwayId);
  const pathwayLetter = getPathwayLetter(pathwayId);
  const pathwayRoute = PATHWAY_ROUTES[pathwayId] || "/pathways/g";

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Your Sleep Breathing Results
              </h1>
              <p className="text-lg text-muted-foreground">
                Based on your assessment responses, explore your personalized pathway 
                and learn about all available pathways.
              </p>
              {!isAuthenticated && localResult && (
                <Card className="mt-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <CardContent className="py-3">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Your results are stored locally on this device. 
                      <a href="/api/login" className="font-medium underline ml-1">Log in</a> to save them to your account.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Tabs defaultValue="your-pathway" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="your-pathway" className="gap-2" data-testid="tab-your-pathway">
                  <Star className="w-4 h-4" />
                  Your Pathway
                </TabsTrigger>
                <TabsTrigger value="explore" className="gap-2" data-testid="tab-explore-pathways">
                  <Compass className="w-4 h-4" />
                  Explore All Pathways
                </TabsTrigger>
              </TabsList>

              <TabsContent value="your-pathway">
                <Card className="border-primary border-2 mb-8">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-foreground">
                          {pathwayLetter}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-2xl" data-testid="pathway-title">
                            {pathway.title}
                          </CardTitle>
                          <Badge variant="default" className="bg-primary">
                            Your Match
                          </Badge>
                        </div>
                        <CardDescription className="text-base" data-testid="pathway-description">
                          {pathway.shortDescription}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {pathway.educationalSummary.split("\n\n")[0]}
                    </p>
                    <Link href={pathwayRoute}>
                      <Button className="gap-2" data-testid="button-learn-more">
                        Learn More About Your Pathway
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="hover-elevate">
                    <CardHeader className="pb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Educational resources about your pathway and sleep breathing.
                      </p>
                      <Link href={pathwayRoute}>
                        <Button variant="outline" size="sm" className="w-full">
                          Explore Content
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate">
                    <CardHeader className="pb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Consider</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Treatment categories and options relevant to your pathway.
                      </p>
                      <Link href={pathwayRoute}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Options
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate">
                    <CardHeader className="pb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Stethoscope className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Consult</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Prepare to discuss your results with a healthcare provider.
                      </p>
                      <Link href="/contact">
                        <Button variant="outline" size="sm" className="w-full">
                          Get In Touch
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          View Full Results
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          See detailed scores, anatomy assessment, and PALM classification.
                        </p>
                      </div>
                      <Link href="/assessment">
                        <Button variant="outline" className="gap-2">
                          <Download className="w-4 h-4" />
                          View in Assessment
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="explore">
                <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Explore for education:</strong> These pathways 
                    show the range of sleep breathing patterns. Your assessment matched you to 
                    <strong className="text-primary"> Pathway {pathwayLetter}</strong>, but learning 
                    about other pathways can help you understand sleep breathing better.
                  </p>
                </div>

                <div className="grid gap-4">
                  {MURPHY_PATHWAYS.map((p) => {
                    const pLetter = getPathwayLetter(p.id);
                    const pRoute = PATHWAY_ROUTES[p.id] || "/pathways/g";
                    const isAssigned = p.id === pathwayId;

                    return (
                      <Card 
                        key={p.id} 
                        className={`hover-elevate ${isAssigned ? "border-primary border-2 bg-primary/5" : ""}`}
                        data-testid={`card-pathway-${pLetter.toLowerCase()}`}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isAssigned ? "bg-primary" : "bg-muted"
                            }`}>
                              <span className={`text-lg font-bold ${
                                isAssigned ? "text-primary-foreground" : "text-muted-foreground"
                              }`}>
                                {pLetter}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold text-foreground">
                                  {p.title}
                                </h3>
                                {isAssigned && (
                                  <Badge variant="default" className="bg-primary">
                                    Your Match
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {p.shortDescription}
                              </p>
                              <Link href={pRoute}>
                                <Button 
                                  variant={isAssigned ? "default" : "outline"} 
                                  size="sm" 
                                  className="gap-2"
                                  data-testid={`button-view-pathway-${pLetter.toLowerCase()}`}
                                >
                                  {isAssigned ? "View Your Pathway" : "Learn More"}
                                  <ArrowRight className="w-3 h-3" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/assessment">
                <Button variant="ghost" className="gap-2" data-testid="button-retake">
                  <RotateCcw className="w-4 h-4" />
                  Retake Assessment
                </Button>
              </Link>
            </div>

            <div className="mt-12 p-6 rounded-lg bg-muted/30 border border-border">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Educational Disclaimer:</strong> This assessment and pathway 
                information are for educational purposes only. They do not constitute 
                medical advice, diagnosis, or treatment. Always consult with a qualified 
                healthcare provider for medical concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

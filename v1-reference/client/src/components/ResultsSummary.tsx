import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "./Disclaimer";
import { StepLayout } from "./StepLayout";
import type { PatientProfile, MurphyPathwayId } from "@/lib/types";
import { getPathwayDefinition, assignMurphyPathway } from "@/lib/pathways";

const PATHWAY_ROUTES: Record<MurphyPathwayId, string> = {
  A_insomnia: "/pathways/a",
  B_obesity: "/pathways/b",
  C_nasal: "/pathways/c",
  D_mandible: "/pathways/d",
  E_multilevel: "/pathways/e",
  F_physiology: "/pathways/f",
  G_low_risk: "/pathways/g",
  H_complex: "/pathways/h",
};
import {
  getOsaRiskLabel,
  getInsomniaSeverityLabel,
  getZoneInterpretation,
} from "@/lib/scoring";
import { exportToJSON, exportToCSV } from "@/lib/export";
import { Link } from "wouter";
import {
  Printer,
  RotateCcw,
  AlertTriangle,
  Moon,
  Activity,
  Stethoscope,
  Target,
  Download,
  FileJson,
  FileSpreadsheet,
  HeartPulse,
  Hand,
  GitFork,
  ArrowRight,
  Scale,
  Lightbulb,
  Footprints,
} from "lucide-react";

interface ResultsSummaryProps {
  profile: PatientProfile;
  onRestart: () => void;
}

const riskColors = {
  low: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30",
  intermediate: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  high: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
};

const severityColors = {
  none_mild: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30",
  subthreshold: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
  moderate: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  severe: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30",
};

const getBmiCategory = (bmi: number | null): { label: string; colorClass: string } => {
  if (bmi === null) return { label: "Not calculated", colorClass: "text-muted-foreground bg-muted" };
  if (bmi < 18.5) return { label: "Underweight", colorClass: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30" };
  if (bmi < 25) return { label: "Normal", colorClass: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30" };
  if (bmi < 30) return { label: "Overweight", colorClass: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" };
  if (bmi < 35) return { label: "Obesity Class I", colorClass: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30" };
  if (bmi < 40) return { label: "Obesity Class II", colorClass: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30" };
  return { label: "Obesity Class III", colorClass: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/50" };
};

export function ResultsSummary({ profile, onRestart }: ResultsSummaryProps) {
  const pathwayId = assignMurphyPathway(profile);
  const pathway = getPathwayDefinition(pathwayId);

  const emptyResponses = { answeredYes: [] };
  const anatomy = profile.anatomy || {
    noseScore: 0,
    palateScore: 0,
    mandibleScore: 0,
    neckScore: 0,
    totalScore: 0,
    noseIsPositive: false,
    palateIsPositive: false,
    mandibleIsPositive: false,
    neckIsPositive: false,
    isPositive: false,
    noseResponses: emptyResponses,
    palateResponses: emptyResponses,
    mandibleResponses: emptyResponses,
    neckResponses: emptyResponses,
  };

  const medicalHistory = profile.medicalHistory || {
    totalScore: 0,
    answeredYes: [],
    isPositive: false,
  };

  const plato = profile.plato || {
    sectionAScore: 0,
    sectionBScore: 0,
    sectionCScore: 0,
    totalScore: 0,
    sleepQualityRaw: 5,
  };

  const emptyPalmSection = { score: 0, isPositive: false, positiveQuestions: [] };
  const palm = profile.palm || {
    pcrit: emptyPalmSection,
    arousal: emptyPalmSection,
    loopGain: emptyPalmSection,
    muscle: emptyPalmSection,
    totalPositiveSections: 0,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    exportToJSON(profile);
  };

  const handleExportCSV = () => {
    exportToCSV(profile);
  };

  const getSleepQualityLabel = () => {
    const sleepQuality = plato.sleepQualityRaw;
    if (sleepQuality <= 3) return "Poor";
    if (sleepQuality <= 5) return "Fair";
    if (sleepQuality <= 7) return "Good";
    return "Excellent";
  };

  return (
    <StepLayout
      title="Your Results"
      subtitle="Review your personalized Murphy Method pathway"
      subtitleBold={true}
      showNext={false}
      titleColor="black"
      showBack={false}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-end gap-3 print:hidden">
          <Link href="/assessment/report">
            <Button size="sm" className="gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-[#2563EB]" data-testid="button-view-full-report">
              <Download className="w-4 h-4" />
              View Full Report
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handlePrint} data-testid="button-print-results-top">
            <Printer className="w-4 h-4 mr-2" />
            Print / Save PDF
          </Button>
        </div>

        <Disclaimer mini />

        <div className="text-center py-4">
          <p className="text-2xl font-bold text-foreground" data-testid="pathway-assignment">
            {pathway.title}
          </p>
        </div>

        {/* Nighttime Breathing Spectrum™ Section */}
        <div className="space-y-4">
          <div className="border-b-2 border-blue-600 pb-2">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Step 1: How Is the Breathing at Night?
            </h2>
            <p className="text-sm text-muted-foreground font-bold">
              Your medical history and questionnaire results
            </p>
          </div>

          <Card className="border-card-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Medical History</CardTitle>
              </div>
              <CardDescription>
                Health conditions that may affect sleep breathing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-4">
                <div>
                  <p className="text-2xl font-bold text-foreground" data-testid="medical-history-score">
                    {medicalHistory.totalScore}/8
                  </p>
                  <p className="text-xs text-muted-foreground">Total Score (Yes=1, No=0)</p>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    medicalHistory.isPositive
                      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
                      : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
                  }`}
                  data-testid="medical-history-flag"
                >
                  {medicalHistory.isPositive ? "Positive" : "Negative"}
                </div>
              </div>
              {medicalHistory.answeredYes.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground mb-1">Reported Conditions:</p>
                  <div className="flex flex-wrap gap-2">
                    {medicalHistory.answeredYes.map((condition) => (
                      <span
                        key={condition}
                        className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        data-testid={`condition-yes-${condition.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {medicalHistory.answeredYes.length === 0 && (
                <p className="text-sm text-muted-foreground">No conditions reported.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-card-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Body Mass Index (BMI)</CardTitle>
              </div>
              <CardDescription>
                A measure of body fat based on height and weight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground" data-testid="bmi-value">
                    {profile.bmiValue !== null ? profile.bmiValue.toFixed(1) : "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">kg/m²</p>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${getBmiCategory(profile.bmiValue).colorClass}`}
                  data-testid="bmi-category-badge"
                >
                  {getBmiCategory(profile.bmiValue).label}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-card-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">Sleep Apnea Risk</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground" data-testid="stopbang-score">
                      {profile.stopBangScore}/8
                    </p>
                    <p className="text-sm text-muted-foreground">STOP-BANG Score</p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${riskColors[profile.osaRisk]}`}
                    data-testid="osa-risk-badge"
                  >
                    {getOsaRiskLabel(profile.osaRisk)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-card-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">Insomnia Severity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground" data-testid="isi-score">
                      {profile.isiScore}/28
                    </p>
                    <p className="text-sm text-muted-foreground">ISI Score</p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${severityColors[profile.insomniaSeverity]}`}
                    data-testid="insomnia-severity-badge"
                  >
                    {getInsomniaSeverityLabel(profile.insomniaSeverity)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-card-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">PLATO-11 Symptom Assessment</CardTitle>
              </div>
              <CardDescription>
                This section describes your symptoms and sleep quality. It does not change your Murphy Method™ pathway assignment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-2xl font-bold text-foreground" data-testid="plato-total-score">
                      {plato.totalScore}/44
                    </p>
                    <p className="text-xs text-muted-foreground">Total Score</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-2xl font-bold text-foreground" data-testid="plato-sleep-quality">
                      {plato.sleepQualityRaw}/10
                    </p>
                    <p className="text-xs text-muted-foreground">Sleep Quality Rating</p>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {getSleepQualityLabel()}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">Section A (Daytime Symptoms):</span>
                  <span className="font-medium text-foreground" data-testid="plato-section-a-score">{plato.sectionAScore}/32</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">Section B (Nighttime Symptoms):</span>
                  <span className="font-medium text-foreground" data-testid="plato-section-b-score">{plato.sectionBScore}/8</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/30">
                  <span className="text-muted-foreground">Section C (Sleep Quality):</span>
                  <span className="font-medium text-foreground" data-testid="plato-section-c-score">{plato.sectionCScore}/4</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top-Down Approach to Anatomy™ Section */}
        <div className="space-y-4">
          <div className="border-b-2 border-green-600 pb-2">
            <h2 className="text-xl font-bold text-green-600 dark:text-green-400">
              Step 2: Where Can the Airway Narrow?
            </h2>
            <p className="text-sm text-muted-foreground font-bold">
              Anatomical areas that may affect your breathing during sleep
            </p>
          </div>

          <Card className="border-card-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Anatomy Level Assessment</CardTitle>
              </div>
              <CardDescription>
                Self-assessment scores for each anatomical zone (Yes=1, No=0)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-4">
                <div>
                  <p className="text-2xl font-bold text-foreground" data-testid="anatomy-total-score">
                    {anatomy.totalScore}/14
                  </p>
                  <p className="text-xs text-muted-foreground">Overall Anatomy Level Score</p>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    anatomy.isPositive
                      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
                      : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
                  }`}
                  data-testid="anatomy-overall-flag"
                >
                  {anatomy.isPositive ? "Positive" : "Negative"}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { key: "nose", icon: "N", name: "Nose", score: anatomy.noseScore, max: 5, isPositive: anatomy.noseIsPositive, responses: anatomy.noseResponses || emptyResponses },
                  { key: "palate", icon: "P", name: "Palate & Tonsils", score: anatomy.palateScore, max: 3, isPositive: anatomy.palateIsPositive, responses: anatomy.palateResponses || emptyResponses },
                  { key: "mandible", icon: "M", name: "Mandible & Tongue", score: anatomy.mandibleScore, max: 3, isPositive: anatomy.mandibleIsPositive, responses: anatomy.mandibleResponses || emptyResponses },
                  { key: "neck", icon: "K", name: "Neck", score: anatomy.neckScore, max: 3, isPositive: anatomy.neckIsPositive, responses: anatomy.neckResponses || emptyResponses },
                ].map((zone) => (
                  <div key={zone.key} className="p-3 rounded-lg bg-muted/30" data-testid={`anatomy-zone-${zone.key}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {zone.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{zone.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground" data-testid={`anatomy-${zone.key}-score`}>
                              {zone.score}/{zone.max}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                                zone.isPositive
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                              }`}
                              data-testid={`anatomy-${zone.key}-flag`}
                            >
                              {zone.isPositive ? "Positive" : "Negative"}
                            </span>
                          </div>
                        </div>
                        {zone.responses.answeredYes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-foreground mb-1">Answered Yes:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {zone.responses.answeredYes.map((text, i) => (
                                <li key={i} className="text-xs text-amber-600 dark:text-amber-400">{text}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fork in the Road Approach to Treatment™ Section */}
        <div className="space-y-4">
          <div className="border-b-2 border-red-600 pb-2">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
              Step 3: What Can Help?
            </h2>
            <p className="text-sm text-muted-foreground font-bold">
              Your personalized pathway based on your assessment results
            </p>
          </div>

          <Card className="border-card-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Hand className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">PALM Classification</CardTitle>
              </div>
              <CardDescription>
                Understanding the underlying factors that may contribute to your sleep breathing patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-4">
                <div>
                  <p className="text-2xl font-bold text-foreground" data-testid="palm-positive-count">
                    {palm.totalPositiveSections}/4
                  </p>
                  <p className="text-xs text-muted-foreground">Positive Sections (2+ Yes per section)</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { key: "pcrit", letter: "P", name: "Airway Narrowing", data: palm.pcrit },
                  { key: "arousal", letter: "A", name: "Arousal Threshold", data: palm.arousal },
                  { key: "loopGain", letter: "L", name: "Loop Gain", data: palm.loopGain },
                  { key: "muscle", letter: "M", name: "Muscle Responsiveness", data: palm.muscle },
                ].map((section) => (
                  <div key={section.key} className="p-3 rounded-lg bg-muted/30" data-testid={`palm-section-${section.key}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {section.letter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{section.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{section.data.score} Yes</span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                                section.data.isPositive
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                              }`}
                              data-testid={`palm-${section.key}-status`}
                            >
                              {section.data.isPositive ? "Positive" : "Negative"}
                            </span>
                          </div>
                        </div>
                        {section.data.positiveQuestions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-foreground mb-1">Answered Yes:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {section.data.positiveQuestions.map((text, i) => (
                                <li key={i} className="text-xs text-amber-600 dark:text-amber-400">{text}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary border-2">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl" data-testid="pathway-title">
                    {pathway.title}
                  </CardTitle>
                  <CardDescription data-testid="pathway-description" className="font-semibold text-foreground">
                    {pathway.shortDescription}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {pathway.educationalSummary.split("\n\n").filter(p => p.trim()).map((paragraph, i) => {
                  const trimmedParagraph = paragraph.trim();
                  const renderWithBoldTerms = (text: string) => {
                    let result: (string | JSX.Element)[] = [text];
                    
                    const applyFormatting = (
                      parts: (string | JSX.Element)[],
                      searchTerm: string,
                      format: (term: string) => JSX.Element
                    ) => {
                      const newParts: (string | JSX.Element)[] = [];
                      parts.forEach((part, partIdx) => {
                        if (typeof part === 'string' && part.includes(searchTerm)) {
                          const splits = part.split(searchTerm);
                          splits.forEach((split, idx) => {
                            newParts.push(split);
                            if (idx < splits.length - 1) {
                              newParts.push(<span key={`${partIdx}-${idx}`}>{format(searchTerm)}</span>);
                            }
                          });
                        } else {
                          newParts.push(part);
                        }
                      });
                      return newParts;
                    };
                    
                    result = applyFormatting(result, "Body-Mass Index (BMI)", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "Body-Mass Index", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "Obesity is defined as having a body mass index (BMI) of 30 kg/m² or higher,", (term) => <u>{term}</u>);
                    result = applyFormatting(result, "40 to 80% of adults with obesity have OSA", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "This is called Insomnia,", (term) => <>This is called <strong>Insomnia</strong>,</>);
                    result = applyFormatting(result, "30 to 40% of OSA patients have insomnia symptoms", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "Your Results", (term) => <strong className="text-gray-900 dark:text-gray-200">{term}</strong>);
                    result = applyFormatting(result, "Murphy Method™", (term) => <strong className="text-gray-900 dark:text-gray-200">{term}</strong>);
                    result = applyFormatting(result, "Anatomy Level Assessment", (term) => <u>{term}</u>);
                    result = applyFormatting(result, "First,", (term) => <><u>First</u>,</>);
                    result = applyFormatting(result, "Second,", (term) => <><u>Second</u>,</>);
                    result = applyFormatting(result, "www.entnet.org", (term) => <a href="https://www.entnet.org" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{term}</a>);
                    result = applyFormatting(result, "www.aasm.org", (term) => <a href="https://www.aasm.org" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{term}</a>);
                    result = applyFormatting(result, "Your mandible & tongue position is likely the main cause of your OSA.", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "Your OSA is coming from multiple places.", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "This is the situation for about 20% of people with obstructive sleep apnea (OSA).", (term) => <u>{term}</u>);
                    result = applyFormatting(result, "PALM classification", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "PALM Classification section", (term) => <u>{term}</u>);
                    result = applyFormatting(result, "the way your body works, not the structure of your airway", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "(P for Pcrit)", (term) => <u>{term}</u>);
                    result = applyFormatting(result, "(A for arousal threshold)", (term) => <u>{term}</u>);
                    result = applyFormatting(result, "(L for loop gain)", (term) => <u>{term}</u>);
                    result = applyFormatting(result, "(M for muscle responsiveness)", (term) => <u>{term}</u>);
                    result = applyFormatting(result, "www.aadsm.org", (term) => <a href="https://www.aadsm.org" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{term}</a>);
                    result = applyFormatting(result, "About 25% of adults snore regularly", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "about 64 million adults snoring regularly", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "THIS DOES NOT MEAN THAT YOU DO NOT HAVE OSA", (term) => <strong>{term}</strong>);
                    result = applyFormatting(result, "Top-Down Approach to Anatomy™", (term) => <strong className="text-green-600 dark:text-green-400">Where Can the Airway Narrow?</strong>);
                    result = applyFormatting(result, "Fork in the Road Approach to Treatment™", (term) => <strong className="text-red-600 dark:text-red-400">What Can Help?</strong>);
                    
                    return result.length === 1 && typeof result[0] === 'string' ? result[0] : <>{result}</>;
                  };
                  
                  if (trimmedParagraph.startsWith("Key Concept:")) {
                    return (
                      <div key={i} className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                          <strong className="text-amber-700 dark:text-amber-400">Key Concept</strong>
                        </div>
                        <p className="text-foreground/80 leading-relaxed">
                          {renderWithBoldTerms(trimmedParagraph.substring(12).trim())}
                        </p>
                      </div>
                    );
                  }
                  if (trimmedParagraph.startsWith("Your Next Step:")) {
                    return (
                      <div key={i} className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Footprints className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                          <strong className="text-red-700 dark:text-red-400">Your Next Step</strong>
                        </div>
                        <p className="text-foreground/80 leading-relaxed">
                          {renderWithBoldTerms(trimmedParagraph.substring(15).trim())}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="text-foreground/80 leading-relaxed">
                      {renderWithBoldTerms(trimmedParagraph)}
                    </p>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Link href={PATHWAY_ROUTES[pathwayId]} onClick={() => window.scrollTo(0, 0)}>
                  <Button className="w-full gap-2" data-testid="button-view-pathway">
                    Learn More About Your Pathway
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-card-border print:hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Export Your Results</CardTitle>
            </div>
            <CardDescription>
              Download your results to share with your healthcare provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handlePrint} className="gap-2" data-testid="button-print">
                <Printer className="w-4 h-4" />
                Print / Save as PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleExportJSON}
                className="gap-2"
                data-testid="button-export-json"
              >
                <FileJson className="w-4 h-4" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="gap-2"
                data-testid="button-export-csv"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center print:hidden">
          <Button
            variant="ghost"
            onClick={onRestart}
            className="gap-2"
            data-testid="button-restart"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-8 print:block">
          <p>
            Thank you for completing the Murphy Method&trade; Sleep Breathing Assessment.
          </p>
          <p className="mt-1">
            Please share these results with your healthcare provider.
          </p>
        </div>

      </div>
    </StepLayout>
  );
}

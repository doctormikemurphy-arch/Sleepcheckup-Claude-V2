import { useState, useEffect } from "react";
import { StepLayout } from "./StepLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Hand, CheckCircle2, ArrowRight, Check } from "lucide-react";
import { PALM_QUESTIONS } from "@/lib/questionnaires";
import type { PalmAnswers, PalmSectionAnswers } from "@/lib/types";
import { MurphyMethodVisual } from "./MurphyMethodVisual";
import forkInTheRoadImage from "@assets/fork_in_the_road_treatment.png";

interface TreatmentStepProps {
  palmAnswers: PalmAnswers;
  onPalmChange: (answers: PalmAnswers) => void;
  onBack: () => void;
  onNext: () => void;
}

const sectionOrder = ["palm", "overview"] as const;
type SectionId = typeof sectionOrder[number];

const sectionNames: Record<SectionId, string> = {
  palm: "PALM Classification",
  overview: "Treatment Overview",
};

export function TreatmentStep({ palmAnswers, onPalmChange, onBack, onNext }: TreatmentStepProps) {
  const [activeTab, setActiveTab] = useState<string>("palm");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handlePalmAnswer = (
    section: keyof PalmAnswers,
    questionKey: keyof PalmSectionAnswers,
    value: boolean
  ) => {
    const newAnswers: PalmAnswers = {
      pcrit: { ...palmAnswers.pcrit },
      arousal: { ...palmAnswers.arousal },
      loopGain: { ...palmAnswers.loopGain },
      muscle: { ...palmAnswers.muscle },
    };
    newAnswers[section] = {
      ...newAnswers[section],
      [questionKey]: value,
    };
    onPalmChange(newAnswers);
  };

  const getSectionYesCount = (section: keyof PalmAnswers): number => {
    const sectionAnswers = palmAnswers[section];
    return Object.values(sectionAnswers).filter((v) => v === true).length;
  };

  const isSectionComplete = (section: keyof PalmAnswers): boolean => {
    const sectionConfig = PALM_QUESTIONS.find((s) => s.section === section);
    if (!sectionConfig) return false;
    const sectionAnswers = palmAnswers[section];
    return sectionConfig.questions.every((q) => {
      const key = q.fieldKey as keyof PalmSectionAnswers;
      return sectionAnswers[key] !== null && sectionAnswers[key] !== undefined;
    });
  };

  const isSectionPositive = (section: keyof PalmAnswers): boolean => {
    return getSectionYesCount(section) >= 2;
  };

  const isPalmComplete = (["pcrit", "arousal", "loopGain", "muscle"] as const).every(
    (s) => isSectionComplete(s)
  );

  const unlocked: Record<SectionId, boolean> = {
    palm: true,
    overview: true,
  };

  const handleTabChange = (value: string) => {
    if (unlocked[value as SectionId]) {
      setActiveTab(value);
    }
  };

  return (
    <StepLayout
      title="Step 3: What Can Help?"
      subtitle="Complete the PALM Classification screening below. For a big picture overview of treatment options, see the Treatment Overview section."
      onBack={onBack}
      onNext={onNext}
      nextLabel="See Your Results"
      nextDisabled={!isPalmComplete}
      titleColor="red"
    >
      <div className="flex justify-end mb-4">
        <Button
          onClick={onNext}
          data-testid="button-see-results-top"
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white gap-2"
        >
          See Your Results
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6" data-testid="treatment-tabs-list">
          <TabsTrigger
            value="palm"
            className="gap-1 text-xs sm:text-sm overflow-visible data-[state=active]:text-red-600 data-[state=active]:dark:text-red-400"
            data-testid="tab-palm"
          >
            <Hand className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">PALM Classification</span>
            <span className="sm:hidden">PALM</span>
            {isPalmComplete && <Check className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />}
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="gap-1 text-xs sm:text-sm overflow-visible data-[state=active]:text-red-600 data-[state=active]:dark:text-red-400"
            data-testid="tab-treatment-overview"
          >
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Method Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="palm" className="mt-0">
          <div
            className="p-6 border border-border rounded-lg bg-card"
            data-testid="panel-palm"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">
                The PALM Classification Screening
              </h3>
              <p className="text-sm text-muted-foreground">
                In addition to having a primary problem with the structure (called anatomy) of their 
                airway, <strong>70%</strong> of patients with obstructive sleep apnea also have a problem with how 
                their body works (called physiology). About <strong>20%</strong> of patients with obstructive sleep 
                apnea have physiology as the main problem.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                The <strong>PALM classification</strong> helps explain why sleep apnea happens by looking at four things: how narrow the airway is <strong>(P)</strong>, 
                how easily the brain wakes up <strong>(A)</strong>, how steady the breathing control is <strong>(L)</strong>, and how strong the breathing muscles 
                are during sleep <strong>(M)</strong>, so treatment can be better matched to the person. The ALM part of the PALM Classification 
                organizes the physiology problems for patients with obstructive sleep apnea.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Answer the questions below. A section is flagged positive if you answer "Yes" to 2 or more questions.
              </p>
            </div>

            <div className="space-y-6">
              {PALM_QUESTIONS.map((section) => {
                const sectionKey = section.section as keyof PalmAnswers;
                const isComplete = isSectionComplete(sectionKey);
                const isPositive = isSectionPositive(sectionKey);
                const yesCount = getSectionYesCount(sectionKey);

                return (
                  <Card key={section.section} className="border-card-border">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                        <div>
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                              {section.sectionLetter}
                            </span>
                            {section.sectionName}
                            {isComplete && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {section.description}
                          </p>
                        </div>
                        {isComplete && (
                          <div
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              isPositive
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                : "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                            }`}
                          >
                            {isPositive ? "Positive" : "Negative"} ({yesCount} Yes)
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 mt-4">
                        {section.questions.map((question) => {
                          const questionKey = question.fieldKey as keyof PalmSectionAnswers;
                          const currentValue = palmAnswers[sectionKey][questionKey];

                          return (
                            <div
                              key={question.id}
                              className="p-3 rounded-lg bg-muted/30"
                              data-testid={`palm-question-${question.id}`}
                            >
                              <p className="text-sm text-foreground mb-3">
                                {question.isCore && (
                                  <span className="text-xs font-medium text-primary mr-2">[Core]</span>
                                )}
                                {question.text}
                              </p>
                              <RadioGroup
                                value={currentValue === true ? "yes" : currentValue === false ? "no" : ""}
                                onValueChange={(value) =>
                                  handlePalmAnswer(sectionKey, questionKey, value === "yes")
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="yes"
                                    id={`${question.id}-yes`}
                                    data-testid={`palm-${question.id}-yes`}
                                  />
                                  <Label htmlFor={`${question.id}-yes`} className="text-sm cursor-pointer">
                                    Yes
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="no"
                                    id={`${question.id}-no`}
                                    data-testid={`palm-${question.id}-no`}
                                  />
                                  <Label htmlFor={`${question.id}-no`} className="text-sm cursor-pointer">
                                    No
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <Button
                onClick={() => setActiveTab("overview")}
                disabled={!isPalmComplete}
                className="gap-2"
                data-testid="button-continue-to-overview"
              >
                {isPalmComplete
                  ? <>Continue to Treatment Overview <ArrowRight className="w-4 h-4" /></>
                  : "Complete all PALM questions to continue"
                }
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="mt-0">
          <div
            className="p-6 border border-border rounded-lg bg-card"
            data-testid="panel-treatment-overview"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">
                Overview of the Murphy Method
              </h3>
              <p className="text-sm text-muted-foreground">
                The Murphy Method™ is a simple way to understand snoring and sleep apnea by showing how breathing changes during sleep, where the airway may be blocked, and what treatments may help.
              </p>
            </div>

            <MurphyMethodVisual />
          </div>
        </TabsContent>
      </Tabs>
    </StepLayout>
  );
}

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZONE_QUESTIONS } from "@/lib/questionnaires";
import type { ZoneAnswers, ZoneQuestionAnswer, ZoneQuestionSet } from "@/lib/types";
import { Stethoscope, Check, Info, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { MurphyMethodVisual } from "./MurphyMethodVisual";
import topDownAnatomyDiagram from "@assets/top_down_anatomy_diagram.png";

interface ZoneAirwaySelfCheckProps {
  answers: ZoneAnswers;
  onChange: (answers: ZoneAnswers) => void;
}

function isZoneComplete(zoneAnswers: ZoneQuestionSet, zone: string): boolean {
  const baseComplete = zoneAnswers.q1 !== null && zoneAnswers.q2 !== null && zoneAnswers.q3 !== null;
  if (zone === "nose") {
    return baseComplete && zoneAnswers.q4 !== null && zoneAnswers.q5 !== null;
  }
  return baseComplete;
}

function getTabStatus(complete: boolean) {
  if (complete) {
    return <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />;
  }
  return null;
}

export function ZoneAirwaySelfCheck({ answers, onChange }: ZoneAirwaySelfCheckProps) {
  const [activeTab, setActiveTab] = useState("nose");
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleChange = (
    zone: keyof ZoneAnswers,
    questionKey: "q1" | "q2" | "q3" | "q4" | "q5",
    value: ZoneQuestionAnswer
  ) => {
    onChange({
      ...answers,
      [zone]: {
        ...answers[zone],
        [questionKey]: value,
      },
    });
  };

  const noseComplete = isZoneComplete(answers.nose, "nose");
  const palateComplete = isZoneComplete(answers.palate, "palate");
  const mandibleComplete = isZoneComplete(answers.mandible, "mandible");
  const neckComplete = isZoneComplete(answers.neck, "neck");

  const zoneCompletionMap: Record<string, boolean> = {
    nose: noseComplete,
    palate: palateComplete,
    mandible: mandibleComplete,
    neck: neckComplete,
  };

  const zoneOrder = ["nose", "palate", "mandible", "neck"] as const;
  const zoneUnlocked: Record<string, boolean> = {
    nose: true,
    palate: noseComplete,
    mandible: noseComplete && palateComplete,
    neck: noseComplete && palateComplete && mandibleComplete,
  };

  const zoneNames: Record<string, string> = {
    nose: "Nose",
    palate: "Palate & Tonsils",
    mandible: "Mandible & Tongue",
    neck: "Neck",
  };

  const handleTabChange = (value: string) => {
    if (value === "overview" || zoneUnlocked[value]) {
      setActiveTab(value);
      scrollToTop();
    }
  };

  const goToNextZone = (currentZone: string) => {
    const currentIndex = zoneOrder.indexOf(currentZone as typeof zoneOrder[number]);
    if (currentIndex < zoneOrder.length - 1) {
      setActiveTab(zoneOrder[currentIndex + 1]);
      scrollToTop();
    }
  };

  return (
    <div className="space-y-6" ref={topRef}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">Airway Self-Check</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Think about your airway from top to bottom. For each zone, answer the questions
          based on what you know or have noticed. It is okay if you are not sure—just answer
          as best you can. For a better understanding, select the Overview tab.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6" data-testid="zone-tabs-list">
          <TabsTrigger
            value="nose"
            className="gap-1 text-xs sm:text-sm data-[state=active]:text-green-600 data-[state=active]:dark:text-green-400"
            data-testid="tab-nose"
          >
            <span className="hidden sm:inline">Nose</span>
            <span className="sm:hidden">Nose</span>
            {getTabStatus(noseComplete)}
          </TabsTrigger>
          <TabsTrigger
            value="palate"
            className="gap-1 text-xs sm:text-sm overflow-visible data-[state=active]:text-green-600 data-[state=active]:dark:text-green-400"
            disabled={!zoneUnlocked.palate}
            data-testid="tab-palate"
          >
            {!zoneUnlocked.palate && <Lock className="w-3 h-3 flex-shrink-0" />}
            <span className="hidden sm:inline truncate">Palate & Tonsils</span>
            <span className="sm:hidden">Palate</span>
            {getTabStatus(palateComplete)}
          </TabsTrigger>
          <TabsTrigger
            value="mandible"
            className="gap-1 text-xs sm:text-sm overflow-visible data-[state=active]:text-green-600 data-[state=active]:dark:text-green-400"
            disabled={!zoneUnlocked.mandible}
            data-testid="tab-mandible"
          >
            {!zoneUnlocked.mandible && <Lock className="w-3 h-3 flex-shrink-0" />}
            <span className="hidden sm:inline truncate">Mandible & Tongue</span>
            <span className="sm:hidden">Mandible</span>
            {getTabStatus(mandibleComplete)}
          </TabsTrigger>
          <TabsTrigger
            value="neck"
            className="gap-1 text-xs sm:text-sm data-[state=active]:text-green-600 data-[state=active]:dark:text-green-400"
            disabled={!zoneUnlocked.neck}
            data-testid="tab-neck"
          >
            {!zoneUnlocked.neck && <Lock className="w-3 h-3 flex-shrink-0" />}
            <span className="hidden sm:inline">Neck</span>
            <span className="sm:hidden">Neck</span>
            {getTabStatus(neckComplete)}
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="gap-1 text-xs sm:text-sm data-[state=active]:text-green-600 data-[state=active]:dark:text-green-400"
            data-testid="tab-overview"
          >
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Method Overview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div
            className="p-6 border border-border rounded-lg bg-card"
            data-testid="zone-panel-overview"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-1">
                Overview of the Murphy Method
              </h3>
              <p className="text-sm text-muted-foreground">
                The Murphy Method™ is a simple way to understand snoring and sleep apnea by showing how breathing changes during sleep, where the airway may be blocked, and what treatments may help.
              </p>
            </div>

            <MurphyMethodVisual />

            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => { setActiveTab("nose"); scrollToTop(); }}
                className="gap-2 bg-green-600 border border-green-600 text-white"
                data-testid="button-go-to-nose"
              >
                Go to Nose — Start the Airway Assessment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {ZONE_QUESTIONS.map((zone) => (
          <TabsContent key={zone.zone} value={zone.zone} className="mt-0">
            <div
              className="p-6 border border-border rounded-lg bg-card"
              data-testid={`zone-panel-${zone.zone}`}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-1">
                  {zone.zoneName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {zone.zoneDescription}
                </p>
              </div>

              <div className="space-y-6">
                {zone.questions.map((question, qIndex) => {
                  const currentValue = answers[zone.zone][question.fieldKey];
                  return (
                    <div key={question.id} className="space-y-3">
                      <p className="text-sm text-foreground/90 font-medium">
                        <span className="text-primary">{qIndex + 1}.</span>{" "}
                        {question.text}
                      </p>
                      <RadioGroup
                        value={currentValue || undefined}
                        onValueChange={(value) => {
                          handleChange(zone.zone, question.fieldKey, value as ZoneQuestionAnswer);
                        }}
                        className="flex gap-3"
                        data-testid={`radio-group-${question.id}`}
                      >
                        <div className="flex-1">
                          <Label
                            htmlFor={`${question.id}-yes`}
                            className={`
                              flex items-center justify-center p-3 rounded-md border cursor-pointer
                              transition-all text-sm min-h-12
                              ${currentValue === "yes"
                                ? "border-primary bg-primary/5 text-primary font-medium"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                              }
                            `}
                            data-testid={`label-${question.id}-yes`}
                          >
                            <RadioGroupItem
                              value="yes"
                              id={`${question.id}-yes`}
                              className="sr-only"
                              data-testid={`radio-${question.id}-yes`}
                            />
                            Yes
                          </Label>
                        </div>
                        <div className="flex-1">
                          <Label
                            htmlFor={`${question.id}-no`}
                            className={`
                              flex items-center justify-center p-3 rounded-md border cursor-pointer
                              transition-all text-sm min-h-12
                              ${currentValue === "no"
                                ? "border-primary bg-primary/5 text-primary font-medium"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                              }
                            `}
                            data-testid={`label-${question.id}-no`}
                          >
                            <RadioGroupItem
                              value="no"
                              id={`${question.id}-no`}
                              className="sr-only"
                              data-testid={`radio-${question.id}-no`}
                            />
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  );
                })}
              </div>

              {(() => {
                const currentIndex = zoneOrder.indexOf(zone.zone as typeof zoneOrder[number]);
                const isComplete = zoneCompletionMap[zone.zone];
                const isLastZone = currentIndex === zoneOrder.length - 1;
                const nextZoneName = !isLastZone ? zoneNames[zoneOrder[currentIndex + 1]] : null;

                return (
                  <div className="mt-6 pt-4 border-t border-border">
                    {isLastZone ? (
                      isComplete ? (
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          All zones complete! You can now proceed.
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Complete all questions in this zone to finish the self-check.
                        </p>
                      )
                    ) : (
                      <Button
                        onClick={() => goToNextZone(zone.zone)}
                        disabled={!isComplete}
                        className={`gap-2 border text-white ${isComplete ? "bg-green-600 border-green-600" : "bg-green-400 border-green-400 opacity-80"}`}
                        data-testid={`button-next-zone-${zone.zone}`}
                      >
                        {isComplete
                          ? <>Continue to {nextZoneName} <ArrowRight className="w-4 h-4" /></>
                          : `Complete all questions to unlock ${nextZoneName}`
                        }
                      </Button>
                    )}
                  </div>
                );
              })()}
            </div>
          </TabsContent>
        ))}

      </Tabs>

      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium text-foreground mb-2">Zone Progress</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {ZONE_QUESTIONS.map((zone) => {
            const unlocked = zoneUnlocked[zone.zone];
            return (
              <button
                key={zone.zone}
                type="button"
                className={`flex items-center gap-2 text-left ${unlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                onClick={() => unlocked && setActiveTab(zone.zone)}
                disabled={!unlocked}
                data-testid={`progress-${zone.zone}`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    zoneCompletionMap[zone.zone] ? "bg-primary" : "bg-border"
                  }`}
                >
                  {zoneCompletionMap[zone.zone] && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <span
                  className={`${unlocked ? "underline" : ""} ${
                    zoneCompletionMap[zone.zone]
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {zone.zoneName}
                </span>
                {!unlocked && <Lock className="w-3 h-3 text-muted-foreground" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { StepLayout } from "../StepLayout";
import { StopBangForm } from "../StopBangForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { StopBangAnswers } from "@/lib/types";
import { Check, Info } from "lucide-react";
import { MurphyMethodVisual } from "../MurphyMethodVisual";
import nighttimeBreathingSpectrum from "@assets/Nighttime_Breathing_Spectrum_1765140225407.png";

interface ScreeningQuestionnaireProps {
  stopBangAnswers: StopBangAnswers;
  onStopBangChange: (answers: StopBangAnswers) => void;
  onBack: () => void;
  onNext: () => void;
}

function isStopBangComplete(answers: StopBangAnswers): boolean {
  return Object.values(answers).every((v) => v !== null);
}

export function ScreeningQuestionnaire({
  stopBangAnswers,
  onStopBangChange,
  onBack,
  onNext,
}: ScreeningQuestionnaireProps) {
  const [activeTab, setActiveTab] = useState("stopbang");
  const tabsRef = useRef<HTMLDivElement>(null);

  const stopBangComplete = isStopBangComplete(stopBangAnswers);
  const allComplete = stopBangComplete;

  const getTabStatus = (complete: boolean) => {
    if (complete) {
      return (
        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
          <Check className="w-3 h-3" />
        </Badge>
      );
    }
    return null;
  };

  return (
    <StepLayout
      title="Step 1: How Is the Breathing at Night?"
      subtitle={<strong>Complete the screening questionnaire below. For a better understanding, select the Method Overview tab.</strong>}
      onBack={onBack}
      onNext={allComplete ? onNext : () => {
        setActiveTab("stopbang");
        setTimeout(() => {
          tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }}
      nextDisabled={false}
      nextLabel={allComplete ? "Next" : "Go to STOP-BANG Questionnaire"}
      titleColor="blue"
    >
      <Tabs ref={tabsRef} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger
            value="stopbang"
            className="gap-1 text-xs sm:text-sm data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-400"
            data-testid="screening-tab-stopbang"
          >
            <span className="hidden sm:inline font-bold">STOP-BANG Questionnaire</span>
            <span className="sm:hidden">Risk</span>
            {getTabStatus(stopBangComplete)}
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="gap-1 text-xs sm:text-sm data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-400"
            data-testid="screening-tab-overview"
          >
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Method Overview</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div
            className="p-6 border border-border rounded-lg bg-card"
            data-testid="screening-panel-overview"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
                Overview of the Murphy Method
              </h3>
              <p className="text-sm text-muted-foreground">
                The Murphy Method™ is a simple way to understand snoring and sleep apnea by showing how breathing changes during sleep, where the airway may be blocked, and what treatments may help.
              </p>
            </div>

            <MurphyMethodVisual />

          </div>
        </TabsContent>

        <TabsContent value="stopbang" className="mt-0">
          <StopBangForm answers={stopBangAnswers} onChange={onStopBangChange} />
        </TabsContent>
      </Tabs>
    </StepLayout>
  );
}

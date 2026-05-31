import { useState, useEffect, useRef } from "react";
import { StepLayout } from "./StepLayout";
import { MedicalHistoryForm } from "./MedicalHistoryForm";
import { BmiCalculator } from "./BmiCalculator";
import { StopBangForm } from "./StopBangForm";
import { IsiForm } from "./IsiForm";
import { PlatoForm } from "./PlatoForm";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { MedicalHistoryAnswers, BmiData, StopBangAnswers, IsiAnswers, PlatoAnswers } from "@/lib/types";
import { Check, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuestionnaireStepProps {
  medicalHistoryAnswers: MedicalHistoryAnswers;
  bmiData: BmiData;
  stopBangAnswers: StopBangAnswers;
  isiAnswers: IsiAnswers;
  platoAnswers: PlatoAnswers;
  onMedicalHistoryChange: (answers: MedicalHistoryAnswers) => void;
  onBmiChange: (data: BmiData) => void;
  onStopBangChange: (answers: StopBangAnswers) => void;
  onIsiChange: (answers: IsiAnswers) => void;
  onPlatoChange: (answers: PlatoAnswers) => void;
  onBack: () => void;
  onNext: () => void;
  onSectionChange?: (sectionLabel: string) => void;
}

function isMedicalHistoryComplete(answers: MedicalHistoryAnswers): boolean {
  return Object.values(answers).every((v) => v !== null);
}
function isBmiComplete(data: BmiData | undefined): boolean {
  return data?.calculatedBmi !== null && data?.calculatedBmi !== undefined;
}
function isStopBangComplete(answers: StopBangAnswers): boolean {
  return Object.values(answers).every((v) => v !== null);
}
function isIsiComplete(answers: IsiAnswers): boolean {
  return Object.values(answers).every((v) => v !== null);
}
function isPlatoComplete(answers: PlatoAnswers): boolean {
  return Object.values(answers).every((v) => v !== null);
}

const sections = [
  { id: "medicalhistory", name: "Medical History", questionCount: 8, time: "~1 min", description: "Quick yes/no questions about conditions that can affect your breathing during sleep." },
  { id: "bmi",           name: "BMI Calculator",  questionCount: 2, time: "~30 sec", description: "Enter your height and weight to calculate your BMI — a key factor in sleep apnea risk." },
  { id: "stopbang",      name: "STOP-BANG",       questionCount: 8, time: "~1 min", description: "Eight yes/no questions to assess your risk for obstructive sleep apnea." },
  { id: "isi",           name: "Insomnia Screening", questionCount: 7, time: "~1 min", description: "Rate how your sleep has been over the past two weeks." },
  { id: "plato",         name: "PLATO-11",         questionCount: 11, time: "~2 min", description: "How does your breathing at night affect your daily life? This can track improvement over time." },
] as const;

type SectionId = typeof sections[number]["id"];

export function QuestionnaireStep({
  medicalHistoryAnswers,
  bmiData,
  stopBangAnswers,
  isiAnswers,
  platoAnswers,
  onMedicalHistoryChange,
  onBmiChange,
  onStopBangChange,
  onIsiChange,
  onPlatoChange,
  onBack,
  onNext,
  onSectionChange,
}: QuestionnaireStepProps) {
  const [activeTab, setActiveTab] = useState<SectionId>("medicalhistory");
  const topRef = useRef<HTMLDivElement>(null);
  const [celebrated, setCelebrated] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const medicalHistoryComplete = isMedicalHistoryComplete(medicalHistoryAnswers);
  const bmiComplete = isBmiComplete(bmiData);
  const stopBangComplete = isStopBangComplete(stopBangAnswers);
  const isiComplete = isIsiComplete(isiAnswers);
  const platoComplete = isPlatoComplete(platoAnswers);
  const allComplete = medicalHistoryComplete && bmiComplete && stopBangComplete && isiComplete && platoComplete;

  const completionMap: Record<SectionId, boolean> = {
    medicalhistory: medicalHistoryComplete,
    bmi: bmiComplete,
    stopbang: stopBangComplete,
    isi: isiComplete,
    plato: platoComplete,
  };

  const completedCount = sections.filter((s) => completionMap[s.id]).length;
  const currentSectionIdx = sections.findIndex((s) => s.id === activeTab);
  const currentSection = sections[currentSectionIdx];

  useEffect(() => {
    if (onSectionChange && currentSection) {
      onSectionChange(`Section ${currentSectionIdx + 1} of ${sections.length} — ${currentSection.name}`);
    }
  }, [activeTab]);

  useEffect(() => {
    const id = setTimeout(() => {
      const el = topRef.current;
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
    return () => clearTimeout(id);
  }, [activeTab]);

  useEffect(() => {
    for (const s of sections) {
      if (completionMap[s.id] && !celebrated.has(s.id)) {
        setCelebrated((prev) => new Set(prev).add(s.id));
        const nextSection = sections[sections.findIndex((x) => x.id === s.id) + 1];
        toast({
          title: `${s.name} complete`,
          description: nextSection ? `Moving to ${nextSection.name}.` : "All sections complete!",
          duration: 2000,
        });
        break;
      }
    }
  }, [medicalHistoryComplete, bmiComplete, stopBangComplete, isiComplete, platoComplete]);

  const goToSection = (sectionId: SectionId) => {
    setActiveTab(sectionId);
  };

  const goToNextSection = () => {
    const nextIdx = currentSectionIdx + 1;
    if (nextIdx < sections.length) {
      setActiveTab(sections[nextIdx].id);
    }
  };

  return (
    <StepLayout
      title=""
      subtitle=""
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!allComplete}
      nextLabel={allComplete ? "Next: Airway Zones" : `Complete ${sections.length - completedCount} more section${sections.length - completedCount !== 1 ? "s" : ""}`}
      titleColor="blue"
    >
      <div ref={topRef} />

      {/* Section Progress Indicator */}
      <div className="mb-6 border-b border-border pb-5" data-testid="section-progress-indicator">
        <div className="flex items-center gap-2 mb-3">
          {sections.map((s, i) => {
            const isActive = s.id === activeTab;
            const isDone = completionMap[s.id];
            return (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isDone || i === 0 || completionMap[sections[i - 1].id]) {
                      goToSection(s.id);
                    }
                  }}
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all
                    ${isDone
                      ? "bg-blue-600 text-white cursor-pointer"
                      : isActive
                      ? "bg-blue-600 text-white ring-2 ring-blue-200"
                      : "bg-muted text-muted-foreground cursor-default"}
                  `}
                  data-testid={`section-dot-${s.id}`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : i + 1}
                </button>
                {i < sections.length - 1 && (
                  <div className={`h-px flex-1 w-4 ${completionMap[s.id] ? "bg-blue-600" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-semibold text-foreground" style={{ fontSize: "18px" }} data-testid="section-title">
              Section {currentSectionIdx + 1} of {sections.length} — {currentSection?.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">{currentSection?.description}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
            <span>{currentSection?.questionCount} questions</span>
            <span>·</span>
            <span>{currentSection?.time}</span>
            {completedCount > 0 && (
              <>
                <span>·</span>
                <span className="text-blue-600 font-medium">{completedCount}/{sections.length} done</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Section Forms — tab content without visible tab bar */}
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="medicalhistory" className="mt-0">
          <MedicalHistoryForm answers={medicalHistoryAnswers} onChange={onMedicalHistoryChange} />
          <SectionFooter isComplete={medicalHistoryComplete} isLast={false} nextName={sections[1].name} onContinue={goToNextSection} onFinish={onNext} allComplete={allComplete} />
        </TabsContent>

        <TabsContent value="bmi" className="mt-0">
          <BmiCalculator bmiData={bmiData} onChange={onBmiChange} />
          <SectionFooter isComplete={bmiComplete} isLast={false} nextName={sections[2].name} onContinue={goToNextSection} onFinish={onNext} allComplete={allComplete} />
        </TabsContent>

        <TabsContent value="stopbang" className="mt-0">
          <StopBangForm answers={stopBangAnswers} onChange={onStopBangChange} />
          <SectionFooter isComplete={stopBangComplete} isLast={false} nextName={sections[3].name} onContinue={goToNextSection} onFinish={onNext} allComplete={allComplete} />
        </TabsContent>

        <TabsContent value="isi" className="mt-0">
          <IsiForm answers={isiAnswers} onChange={onIsiChange} />
          <SectionFooter isComplete={isiComplete} isLast={false} nextName={sections[4].name} onContinue={goToNextSection} onFinish={onNext} allComplete={allComplete} />
        </TabsContent>

        <TabsContent value="plato" className="mt-0">
          <PlatoForm answers={platoAnswers} onChange={onPlatoChange} />
          <SectionFooter isComplete={platoComplete} isLast={true} nextName="" onContinue={goToNextSection} onFinish={onNext} allComplete={allComplete} />
        </TabsContent>
      </Tabs>
    </StepLayout>
  );
}

function SectionFooter({
  isComplete,
  isLast,
  nextName,
  onContinue,
  onFinish,
  allComplete,
}: {
  isComplete: boolean;
  isLast: boolean;
  nextName: string;
  onContinue: () => void;
  onFinish: () => void;
  allComplete: boolean;
}) {
  return (
    <div className="mt-6 pt-4 border-t border-border">
      {isLast ? (
        allComplete ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              All sections complete — tap "Next: Airway Zones" below to continue.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Complete all questions to continue.</p>
        )
      ) : (
        <Button
          onClick={onContinue}
          disabled={!isComplete}
          className="gap-2"
          data-testid={`button-continue-to-${nextName.toLowerCase().replace(/\s/g, "-")}`}
        >
          {isComplete ? (
            <>Continue to {nextName} <ArrowRight className="w-4 h-4" /></>
          ) : (
            "Complete all questions to continue"
          )}
        </Button>
      )}
    </div>
  );
}

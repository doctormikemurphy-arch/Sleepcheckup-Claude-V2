import { useState } from "react";
import { StepLayout } from "./StepLayout";
import { Disclaimer } from "./Disclaimer";
import {
  ClipboardList, Stethoscope, Target, FileText,
  ChevronDown, ChevronUp, User, Info, BookOpen,
} from "lucide-react";
import drMurphyPhoto from "@assets/Murphy-14_1765142967232.jpg";
import murphyMethodDiagram from "@assets/The_Murphy_Method._1765143304942.png";

interface WelcomeStepProps {
  onStart: () => void;
}

const steps = [
  {
    icon: ClipboardList,
    title: "How Is the Breathing at Night?",
    description: "Answer questions about your medical history and complete questionnaires to understand your nighttime breathing.",
    colorClass: "text-blue-600 dark:text-blue-400",
    iconBgClass: "bg-blue-600/10",
  },
  {
    icon: Stethoscope,
    title: "Where Can the Airway Narrow?",
    description: "Identify areas of your airway that might affect your breathing during sleep.",
    colorClass: "text-green-600 dark:text-green-400",
    iconBgClass: "bg-green-600/10",
  },
  {
    icon: Target,
    title: "What Can Help?",
    description: "Follow an organized pathway that includes all treatment options to find the best treatment options for you.",
    colorClass: "text-red-600 dark:text-red-400",
    iconBgClass: "bg-red-600/10",
  },
  {
    icon: FileText,
    title: "Your Results",
    description: "Print or save your results to share with your healthcare provider.",
    colorClass: "text-gray-900 dark:text-gray-200",
    iconBgClass: "bg-gray-900/10 dark:bg-gray-200/10",
  },
];

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  return (
    <StepLayout
      title="Murphy Method™ Sleep Breathing Assessment"
      subtitle="An educational tool to help you understand if you snore or have sleep apnea and guide you towards a solution for your problem."
      onNext={onStart}
      nextLabel="Begin Assessment"
      titleColor="black"
    >
      <div className="space-y-6">
        <Disclaimer variant="warning" mini />

        {/* Step Overview */}
        <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
          <p className="text-sm text-muted-foreground mb-3">
            This assessment takes about <strong className="text-foreground">5–10 minutes</strong> to complete. You will follow these steps:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-md ${step.iconBgClass} flex items-center justify-center flex-shrink-0`}>
                  <step.icon className={`w-4 h-4 ${step.colorClass}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${step.colorClass}`}>{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before You Begin */}
        <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-foreground mb-2">Before You Begin</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Find a quiet place where you can focus for a few minutes.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Answer honestly based on your typical experiences.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>If you are unsure about a question, choose the answer that feels closest.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>Your answers are stored only on this device and are not sent anywhere.</span>
            </li>
          </ul>
        </div>

        {/* Learn More collapsible */}
        <div className="border border-border rounded-lg overflow-visible">
          <button
            type="button"
            onClick={() => setLearnMoreOpen(!learnMoreOpen)}
            className="w-full flex items-center justify-between p-4 text-left hover-elevate rounded-lg"
            data-testid="button-learn-more-toggle"
          >
            <span className="font-medium text-foreground">Learn More About the Murphy Method</span>
            {learnMoreOpen
              ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
              : <ChevronDown className="w-5 h-5 text-muted-foreground" />
            }
          </button>

          {learnMoreOpen && (
            <div className="px-4 pb-4 space-y-6">
              <div className="p-5 border border-border rounded-lg bg-card" data-testid="panel-drmurphy">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Michael Murphy, MD MPH</h3>
                </div>
                <div className="prose prose-sm max-w-none text-foreground/90">
                  <p>
                    I am a medical doctor board-certified in both Otolaryngology-Head & Neck Surgery 
                    (commonly known as ENT) and Sleep Medicine. I completed my Otolaryngology residency 
                    at the University of Washington in 2002. I have cared for patients with snoring and 
                    obstructive sleep apnea my whole career. Witnessing firsthand the negative effects 
                    of poor sleep in my patients and recognizing the strong connection between ENT 
                    conditions and sleep disorders, I became board-certified in sleep medicine in 2009. 
                    This dual expertise has allowed me to develop a unique, comprehensive method for 
                    evaluating and treating my patients with snoring and obstructive sleep apnea.
                  </p>
                </div>
                <div className="flex justify-center mt-4">
                  <img 
                    src={drMurphyPhoto} 
                    alt="Michael Murphy, MD MPH" 
                    className="rounded-lg shadow-md max-w-xs w-full object-cover"
                    data-testid="img-dr-murphy"
                  />
                </div>
              </div>

              <div className="p-5 border border-border rounded-lg bg-card" data-testid="panel-overview">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Overview</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  The Murphy Method is based on three critical concepts and steps I share with my patients:
                </p>
                <div className="flex justify-center mb-4">
                  <img 
                    src={murphyMethodDiagram} 
                    alt="The Murphy Method - The Evaluation and Treatment of Snoring and Sleep Apnea" 
                    className="rounded-lg max-w-full w-full sm:max-w-lg object-contain"
                    data-testid="img-murphy-method-diagram"
                  />
                </div>
                <div className="prose prose-sm max-w-none text-foreground/90 space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-1 border-b-2 border-blue-600 dark:border-blue-400 pb-1 inline-block">Step 2 - How Is the Breathing at Night?</h4>
                    <p className="text-muted-foreground">
                      Our breathing at night occurs along a spectrum. When airflow is normal (not turbulent or blocked) 
                      breathing is quiet and the condition is normal breathing. When airflow becomes turbulent (swirling around) 
                      snoring occurs. The turbulent airflow can then become blocked causing pauses in breathing ("hypopneas or apneas") 
                      and obstructive sleep apnea occurs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1 border-b-2 border-green-600 dark:border-green-400 pb-1 inline-block">Step 3 - Where Can the Airway Narrow?</h4>
                    <p className="text-muted-foreground">
                      This covers the physical structure of the upper airway, following the flow of air from the top level 
                      at the nose to the bottom level in the neck (the vocal cords and entrance to the windpipe to the lungs). 
                      Turbulent or obstructed airflow can occur at any level, or multiple levels along the airway.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1 border-b-2 border-red-600 dark:border-red-400 pb-1 inline-block">Step 4 - What Can Help?</h4>
                    <p className="text-muted-foreground">
                      This organizes the options for snoring and obstructive sleep apnea treatment providing people with 
                      a decision-making process that will help them think through key treatment decisions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 border border-border rounded-lg bg-card" data-testid="panel-introduction">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Introduction</h3>
                </div>
                <div className="prose prose-sm max-w-none text-foreground/90">
                  <p className="mb-3">
                    We will follow the steps of the <strong className="text-foreground">Murphy Method</strong>:
                  </p>
                  <p className="mb-2">
                    <strong className="text-blue-600 dark:text-blue-400">Step 1: "How Is the Breathing at Night?"</strong> You will answer questions about your medical history and complete questionnaires to assess your risk for obstructive sleep apnea, insomnia, and how your sleep breathing problem affects your life.
                  </p>
                  <p className="mb-2">
                    <strong className="text-green-600 dark:text-green-400">Step 2: "Where Can the Airway Narrow?"</strong> You will answer questions to determine where your airway blockage is happening.
                  </p>
                  <p className="mb-2">
                    <strong className="text-red-600 dark:text-red-400">Step 3: "What Can Help?"</strong> You will be directed to a treatment pathway.
                  </p>
                  <p>
                    The <strong className="text-foreground">Your Results</strong> step provides you with a summary of your Murphy Method™ Sleep Breathing Assessment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </StepLayout>
  );
}

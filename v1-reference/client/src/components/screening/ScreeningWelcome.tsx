import { StepLayout } from "../StepLayout";
import { Disclaimer } from "../Disclaimer";
import { ClipboardList, Stethoscope, GitBranch, Clock, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import drMurphyPhoto from "@assets/Murphy-14_1765142967232.jpg";
import murphyMethodDiagram from "@assets/The_Murphy_Method._1765143304942.png";

interface ScreeningWelcomeProps {
  onStart: () => void;
}

const features = [
  {
    icon: ClipboardList,
    title: "How Is the Breathing at Night?",
    description: "A quick screening questionnaire to assess your risk for sleep apnea.",
    colorClass: "text-blue-600 dark:text-blue-400",
    iconBgClass: "bg-blue-600/10",
    iconColorClass: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Stethoscope,
    title: "Where Can the Airway Narrow?",
    description: "Identify areas of your airway that might affect your breathing during sleep.",
    colorClass: "text-green-600 dark:text-green-400",
    iconBgClass: "bg-green-600/10",
    iconColorClass: "text-green-600 dark:text-green-400",
  },
  {
    icon: GitBranch,
    title: "What Can Help?",
    description: "Understand the big picture of how snoring and sleep apnea treatment options are organized.",
    colorClass: "text-red-600 dark:text-red-400",
    iconBgClass: "bg-red-600/10",
    iconColorClass: "text-red-600 dark:text-red-400",
  },
];

const highlights = [
  {
    icon: Clock,
    text: "Takes only 2-3 minutes",
  },
  {
    icon: Printer,
    text: "Print results for your doctor",
  },
];

export function ScreeningWelcome({ onStart }: ScreeningWelcomeProps) {
  return (
    <StepLayout
      title="A Free Sleep Breathing Screening"
      subtitle="The Murphy Method is a simple system to help you understand if you snore or have sleep apnea, the location of your airway problem and the big picture of your treatment options."
      onNext={onStart}
      showBack={false}
      nextLabel="Start Screening"
      titleClassName="text-[32px] sm:text-[36px] font-bold text-blue-900 dark:text-blue-300 mt-8"
      subtitleClassName="text-[20px] font-bold text-foreground/80 mb-4 mt-2"
    >
      <div className="space-y-6">
        <Disclaimer variant="warning" mini />

        <div className="max-w-none">
          <p className="text-[16px] sm:text-[18px] font-normal leading-[1.6] text-foreground/90">
            This free screening follows the same proven framework I use with every snoring and sleep apnea patient I see in my office. In just a few minutes, you will get a snapshot of your risk of having sleep apnea
            and which areas of your airway may be involved.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-[20px] font-bold text-foreground/80">The Murphy Method™ covers three key steps:</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className="border-card-border">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg ${feature.iconBgClass} flex items-center justify-center`}>
                        <feature.icon className={`w-5 h-5 ${feature.iconColorClass}`} />
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-semibold ${feature.colorClass}`}>{index + 1}. {feature.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {highlights.map((h) => (
            <div key={h.text} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
              <h.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{h.text}</span>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground">
            Want a more comprehensive evaluation with personalized treatment pathways?
            The full <strong className="text-foreground">Murphy Method™ Sleep Breathing Assessment</strong> includes
            medical history review, BMI analysis, additional questionnaires, treatment pathway classification,
            and detailed educational guidance.
          </p>
        </div>

      </div>
    </StepLayout>
  );
}

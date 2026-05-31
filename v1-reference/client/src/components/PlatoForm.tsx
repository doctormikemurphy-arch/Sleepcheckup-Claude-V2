import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  PLATO_QUESTIONS,
  PLATO_FREQUENCY_OPTIONS_DAY,
  PLATO_FREQUENCY_OPTIONS_NIGHT,
  PLATO_SECTION_HEADERS,
} from "@/lib/questionnaires";
import type { PlatoAnswers } from "@/lib/types";

interface PlatoFormProps {
  answers: PlatoAnswers;
  onChange: (answers: PlatoAnswers) => void;
}

type QuestionKey = keyof PlatoAnswers;

export function PlatoForm({ answers, onChange }: PlatoFormProps) {
  const getAnswer = (questionId: QuestionKey): number | null => {
    return answers[questionId];
  };

  const handleFrequencyChange = (questionId: QuestionKey, value: number) => {
    onChange({
      ...answers,
      [questionId]: value,
    });
  };

  const handleRatingChange = (questionId: QuestionKey, value: number[]) => {
    onChange({
      ...answers,
      [questionId]: value[0],
    });
  };

  const sectionAQuestions = PLATO_QUESTIONS.filter((q) => q.section === "A");
  const sectionBQuestions = PLATO_QUESTIONS.filter((q) => q.section === "B");
  const sectionCQuestions = PLATO_QUESTIONS.filter((q) => q.section === "C");

  const getQuestionNumber = (questionId: string): number => {
    return parseInt(questionId.replace("q", ""));
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">PLATO-11</h2>
        <p className="text-sm text-muted-foreground">
          Patient-Reported Longitudinal Assessment Tool for Sleep Apnea — 11 item (PLATO-11)
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          You are being asked to complete this questionnaire to help your health care provider understand your recent sleep-related experiences <strong>in the past 7 days</strong>. Please indicate the answer to each question that best describes you and your experiences.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-muted/70 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              A
            </div>
            <p className="font-medium text-foreground">
              {PLATO_SECTION_HEADERS.A.instruction}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {sectionAQuestions.map((question) => {
            const qKey = question.id as QuestionKey;
            const currentValue = getAnswer(qKey);
            return (
              <Card key={question.id} className="border-card-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm text-primary font-semibold">
                      {getQuestionNumber(question.id)}
                    </span>
                    <span className="flex-1">{question.text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <RadioGroup
                    value={currentValue !== null ? String(currentValue) : undefined}
                    onValueChange={(value) => handleFrequencyChange(qKey, parseInt(value))}
                    className="grid grid-cols-5 gap-2"
                    data-testid={`radio-group-${question.id}`}
                  >
                    {PLATO_FREQUENCY_OPTIONS_DAY.map((option) => (
                      <div key={option.value} className="flex-1">
                        <Label
                          htmlFor={`${question.id}-${option.value}`}
                          data-testid={`label-${question.id}-${option.value}`}
                          className={`
                            flex flex-col items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer
                            transition-all min-h-16 text-center
                            ${
                              currentValue === option.value
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }
                          `}
                        >
                          <RadioGroupItem
                            value={String(option.value)}
                            id={`${question.id}-${option.value}`}
                            className="sr-only"
                            data-testid={`radio-${question.id}-${option.value}`}
                          />
                          <span className="font-medium text-xs sm:text-sm">{option.label}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">{option.sublabel}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-muted/70 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-3">
            For the following questions, please consider your night-time experience over <strong>the past 7 nights</strong>.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              B
            </div>
            <p className="font-medium text-foreground">
              {PLATO_SECTION_HEADERS.B.instruction}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {sectionBQuestions.map((question) => {
            const qKey = question.id as QuestionKey;
            const currentValue = getAnswer(qKey);
            return (
              <Card key={question.id} className="border-card-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm text-primary font-semibold">
                      {getQuestionNumber(question.id) - 8}
                    </span>
                    <span className="flex-1">{question.text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <RadioGroup
                    value={currentValue !== null ? String(currentValue) : undefined}
                    onValueChange={(value) => handleFrequencyChange(qKey, parseInt(value))}
                    className="grid grid-cols-5 gap-2"
                    data-testid={`radio-group-${question.id}`}
                  >
                    {PLATO_FREQUENCY_OPTIONS_NIGHT.map((option) => (
                      <div key={option.value} className="flex-1">
                        <Label
                          htmlFor={`${question.id}-${option.value}`}
                          data-testid={`label-${question.id}-${option.value}`}
                          className={`
                            flex flex-col items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer
                            transition-all min-h-16 text-center
                            ${
                              currentValue === option.value
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }
                          `}
                        >
                          <RadioGroupItem
                            value={String(option.value)}
                            id={`${question.id}-${option.value}`}
                            className="sr-only"
                            data-testid={`radio-${question.id}-${option.value}`}
                          />
                          <span className="font-medium text-xs sm:text-sm">{option.label}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">{option.sublabel}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-muted/70 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              C
            </div>
            <p className="font-medium text-foreground">
              {PLATO_SECTION_HEADERS.C.instruction}
            </p>
          </div>
        </div>

        {sectionCQuestions.map((question) => {
          const qKey = question.id as QuestionKey;
          const currentValue = getAnswer(qKey);
          return (
            <Card key={question.id} className="border-card-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-center">
                  {question.text}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground px-2">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                  </div>
                  <Slider
                    value={[currentValue ?? 5]}
                    onValueChange={(value) => handleRatingChange(qKey, value)}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                    data-testid={`slider-${question.id}`}
                  />
                  <div className="flex justify-between text-sm font-medium px-2">
                    <span className="text-muted-foreground">POOR</span>
                    <span className="text-primary text-lg font-bold">
                      {currentValue ?? 5}
                    </span>
                    <span className="text-muted-foreground">EXCELLENT</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { STOP_BANG_QUESTIONS } from "@/lib/questionnaires";
import type { StopBangAnswers } from "@/lib/types";
import { HelpCircle, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StopBangFormProps {
  answers: StopBangAnswers;
  onChange: (answers: StopBangAnswers) => void;
}

export function StopBangForm({ answers, onChange }: StopBangFormProps) {
  const handleChange = (fieldKey: keyof StopBangAnswers, value: boolean) => {
    onChange({
      ...answers,
      [fieldKey]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-sm text-foreground font-bold">
          This questionnaire will assess your risk of having obstructive sleep apnea.
          Answer yes or no to each question.
        </p>
      </div>

      {STOP_BANG_QUESTIONS.map((question, index) => (
        <Card
          key={question.id}
          className="border-card-border"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm text-primary font-semibold">
                {index + 1}
              </span>
              <span className="flex-1">{question.text}</span>
              {question.helpText && question.id !== "sb5" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                      data-testid={`help-${question.id}`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>{question.helpText}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </CardTitle>
            {question.id === "sb5" && (
              <p className="text-xs text-muted-foreground mt-1 ml-8">
                Not sure?{" "}
                <a
                  href="https://nhlbi.nih.gov/calculate-your-bmi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary inline-flex items-center gap-1"
                  data-testid="link-bmi-calculator"
                >
                  Calculate your BMI here
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={answers[question.fieldKey] === null ? undefined : answers[question.fieldKey] ? "yes" : "no"}
              onValueChange={(value) => handleChange(question.fieldKey, value === "yes")}
              className="flex gap-4"
            >
              <div className="flex-1">
                <Label
                  htmlFor={`${question.id}-yes`}
                  className={`
                    flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer
                    transition-all min-h-12
                    ${answers[question.fieldKey] === true
                      ? "border-primary bg-primary/5 text-primary"
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
                  <span className="font-medium">Yes</span>
                </Label>
              </div>
              <div className="flex-1">
                <Label
                  htmlFor={`${question.id}-no`}
                  className={`
                    flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer
                    transition-all min-h-12
                    ${answers[question.fieldKey] === false
                      ? "border-primary bg-primary/5 text-primary"
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
                  <span className="font-medium">No</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

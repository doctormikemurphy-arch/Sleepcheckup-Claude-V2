import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ISI_QUESTIONS } from "@/lib/questionnaires";
import type { IsiAnswers } from "@/lib/types";

interface IsiFormProps {
  answers: IsiAnswers;
  onChange: (answers: IsiAnswers) => void;
}

export function IsiForm({ answers, onChange }: IsiFormProps) {
  const handleChange = (fieldKey: keyof IsiAnswers, value: number) => {
    onChange({
      ...answers,
      [fieldKey]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Insomnia Severity Index</h2>
        <p className="text-sm text-muted-foreground mb-2">
          This questionnaire is used to help determine your risk of having insomnia (Trouble going to and/or staying asleep).
        </p>
        <p className="text-sm text-muted-foreground">
          Rate each of the following based on your experience over the past two weeks.
        </p>
      </div>

      {ISI_QUESTIONS.map((question, index) => (
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
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup
              value={answers[question.fieldKey]?.toString()}
              onValueChange={(value) => handleChange(question.fieldKey, parseInt(value, 10))}
              className="grid grid-cols-2 sm:grid-cols-5 gap-2"
            >
              {question.options.map((option) => (
                <div key={option.value}>
                  <Label
                    htmlFor={`${question.id}-${option.value}`}
                    className={`
                      flex flex-col items-center justify-center gap-1 p-3 rounded-lg border cursor-pointer
                      transition-all min-h-16 text-center
                      ${answers[question.fieldKey] === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }
                    `}
                  >
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`${question.id}-${option.value}`}
                      className="sr-only"
                    />
                    <span className="text-xs font-medium">{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

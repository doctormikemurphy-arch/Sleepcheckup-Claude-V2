import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MEDICAL_HISTORY_QUESTIONS } from "@/lib/questionnaires";
import type { MedicalHistoryAnswers, MedicalHistoryAnswer } from "@/lib/types";

interface MedicalHistoryFormProps {
  answers: MedicalHistoryAnswers;
  onChange: (answers: MedicalHistoryAnswers) => void;
}

const ANSWER_OPTIONS: { value: MedicalHistoryAnswer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export function MedicalHistoryForm({ answers, onChange }: MedicalHistoryFormProps) {
  const handleChange = (fieldKey: keyof MedicalHistoryAnswers, value: MedicalHistoryAnswer) => {
    onChange({
      ...answers,
      [fieldKey]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Medical History</h2>
        <p className="text-sm text-muted-foreground">
          Please answer the following questions about your medical history. See if your medical history includes conditions that can be related to obstructive sleep apnea.
        </p>
      </div>

      {MEDICAL_HISTORY_QUESTIONS.map((question, index) => (
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
              value={answers[question.fieldKey] ?? undefined}
              onValueChange={(value) => handleChange(question.fieldKey, value as MedicalHistoryAnswer)}
              className="grid grid-cols-2 gap-2"
              data-testid={`radio-group-${question.id}`}
            >
              {ANSWER_OPTIONS.map((option) => (
                <div key={option.value}>
                  <Label
                    htmlFor={`${question.id}-${option.value}`}
                    data-testid={`label-${question.id}-${option.value}`}
                    className={`
                      flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer
                      transition-all min-h-12 text-center
                      ${answers[question.fieldKey] === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }
                    `}
                  >
                    <RadioGroupItem
                      value={option.value!}
                      id={`${question.id}-${option.value}`}
                      className="sr-only"
                      data-testid={`radio-${question.id}-${option.value}`}
                    />
                    <span className="text-sm font-medium">{option.label}</span>
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

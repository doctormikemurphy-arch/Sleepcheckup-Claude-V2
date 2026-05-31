import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BmiData, HeightUnit, WeightUnit } from "@/lib/types";
import { Calculator, Scale, Ruler } from "lucide-react";

interface BmiCalculatorProps {
  bmiData: BmiData;
  onChange: (data: BmiData) => void;
}

function calculateBmi(
  heightValue: number | null,
  heightUnit: HeightUnit,
  weightValue: number | null,
  weightUnit: WeightUnit
): number | null {
  if (heightValue === null || weightValue === null || heightValue <= 0 || weightValue <= 0) {
    return null;
  }

  let heightInMeters: number;
  let weightInKg: number;

  if (heightUnit === "inches") {
    heightInMeters = heightValue * 0.0254;
  } else {
    heightInMeters = heightValue / 100;
  }

  if (weightUnit === "lbs") {
    weightInKg = weightValue * 0.453592;
  } else {
    weightInKg = weightValue;
  }

  const bmi = weightInKg / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
}

function getBmiCategory(bmi: number | null): { label: string; color: string; description: string } {
  if (bmi === null) {
    return { label: "Not calculated", color: "text-muted-foreground", description: "Enter your height and weight" };
  }
  if (bmi < 18.5) {
    return { label: "Underweight", color: "text-blue-600 dark:text-blue-400", description: "BMI less than 18.5" };
  }
  if (bmi < 25) {
    return { label: "Normal weight", color: "text-green-600 dark:text-green-400", description: "BMI 18.5 to 24.9" };
  }
  if (bmi < 30) {
    return { label: "Overweight", color: "text-yellow-600 dark:text-yellow-400", description: "BMI 25 to 29.9" };
  }
  return { label: "Obese", color: "text-red-600 dark:text-red-400", description: "BMI 30 or greater" };
}

export function BmiCalculator({ bmiData, onChange }: BmiCalculatorProps) {
  const handleHeightChange = (value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    const newBmi = calculateBmi(numValue, bmiData.heightUnit, bmiData.weightValue, bmiData.weightUnit);
    onChange({
      ...bmiData,
      heightValue: numValue,
      calculatedBmi: newBmi,
    });
  };

  const handleHeightUnitChange = (unit: HeightUnit) => {
    const newBmi = calculateBmi(bmiData.heightValue, unit, bmiData.weightValue, bmiData.weightUnit);
    onChange({
      ...bmiData,
      heightUnit: unit,
      calculatedBmi: newBmi,
    });
  };

  const handleWeightChange = (value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    const newBmi = calculateBmi(bmiData.heightValue, bmiData.heightUnit, numValue, bmiData.weightUnit);
    onChange({
      ...bmiData,
      weightValue: numValue,
      calculatedBmi: newBmi,
    });
  };

  const handleWeightUnitChange = (unit: WeightUnit) => {
    const newBmi = calculateBmi(bmiData.heightValue, bmiData.heightUnit, bmiData.weightValue, unit);
    onChange({
      ...bmiData,
      weightUnit: unit,
      calculatedBmi: newBmi,
    });
  };

  const category = getBmiCategory(bmiData.calculatedBmi);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Body Mass Index (BMI) Calculator</h2>
        <p className="text-sm text-muted-foreground">
          Enter your height and weight to calculate your BMI. This information is used to help assess your risk of having obstructive sleep apnea.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-card-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Ruler className="w-5 h-5 text-primary" />
              Height
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="height-input" className="sr-only">Height value</Label>
                <Input
                  id="height-input"
                  type="number"
                  placeholder={bmiData.heightUnit === "inches" ? "e.g., 68" : "e.g., 173"}
                  value={bmiData.heightValue ?? ""}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  min="0"
                  step="0.1"
                  data-testid="input-height"
                />
              </div>
              <Select value={bmiData.heightUnit} onValueChange={handleHeightUnitChange}>
                <SelectTrigger className="w-24" data-testid="select-height-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inches">inches</SelectItem>
                  <SelectItem value="cm">cm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              {bmiData.heightUnit === "inches" 
                ? "Total height in inches (e.g., 5'8\" = 68 inches)" 
                : "Height in centimeters"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Weight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="weight-input" className="sr-only">Weight value</Label>
                <Input
                  id="weight-input"
                  type="number"
                  placeholder={bmiData.weightUnit === "lbs" ? "e.g., 170" : "e.g., 77"}
                  value={bmiData.weightValue ?? ""}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  min="0"
                  step="0.1"
                  data-testid="input-weight"
                />
              </div>
              <Select value={bmiData.weightUnit} onValueChange={handleWeightUnitChange}>
                <SelectTrigger className="w-24" data-testid="select-weight-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">lbs</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              {bmiData.weightUnit === "lbs" ? "Weight in pounds" : "Weight in kilograms"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className={`border-2 ${bmiData.calculatedBmi !== null ? "border-primary/30" : "border-card-border"}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Your BMI Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground" data-testid="text-bmi-value">
                {bmiData.calculatedBmi !== null ? bmiData.calculatedBmi : "—"}
              </div>
              <div className={`text-lg font-medium ${category.color}`} data-testid="text-bmi-category">
                {category.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {category.description}
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Underweight: &lt;18.5</div>
                <div>Normal: 18.5–24.9</div>
                <div>Overweight: 25–29.9</div>
                <div>Obese: 30+</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium text-foreground mb-2">Why BMI Matters for Sleep</h3>
        <p className="text-sm text-muted-foreground">
          A higher BMI is associated with increased risk for obstructive sleep apnea (OSA). 
          Excess weight, especially around the neck and throat, can contribute to airway 
          obstruction during sleep. This information helps personalize your sleep breathing assessment.
        </p>
      </div>
    </div>
  );
}

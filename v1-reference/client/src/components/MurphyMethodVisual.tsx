import { ArrowRight, ArrowDown } from "lucide-react";

interface MurphyMethodVisualProps {
  stepsOnly?: number[];
}

export function MurphyMethodVisual({ stepsOnly }: MurphyMethodVisualProps = {}) {
  const show = (step: number) => !stepsOnly || stepsOnly.includes(step);

  return (
    <div className="space-y-6">

      {/* STEP 1 — BLUE */}
      {show(1) && (
        <div className="rounded-xl p-5 sm:p-6 bg-card border border-blue-200 dark:border-blue-800 shadow-sm">
          <h4 className="text-lg font-extrabold text-blue-700 dark:text-blue-400 mb-1">
            Step 1 — How is the breathing at night?
          </h4>
          <p className="text-sm text-muted-foreground mb-5">
            Breathing can move from normal, to snoring, to sleep apnea.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="inline-block px-4 py-2 rounded-full font-bold text-sm bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
              Normal
            </span>
            <ArrowRight className="w-5 h-5 text-blue-700 dark:text-blue-400 flex-shrink-0" />
            <span className="inline-block px-4 py-2 rounded-full font-bold text-sm bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Snoring
            </span>
            <ArrowRight className="w-5 h-5 text-blue-700 dark:text-blue-400 flex-shrink-0" />
            <span className="inline-block px-4 py-2 rounded-full font-bold text-sm bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
              Sleep Apnea
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl p-4 bg-muted/40 border border-border">
              <p className="font-extrabold text-green-700 dark:text-green-400 mb-2">Normal</p>
              <p className="text-sm text-foreground/80 leading-relaxed">Air moves easily</p>
              <p className="text-sm text-foreground/80 leading-relaxed">Quiet breathing</p>
              <p className="text-sm text-foreground/80 leading-relaxed">Healthy sleep</p>
            </div>
            <div className="rounded-xl p-4 bg-muted/40 border border-border">
              <p className="font-extrabold text-amber-700 dark:text-amber-400 mb-2">Snoring</p>
              <p className="text-sm text-foreground/80 leading-relaxed">Air becomes noisy</p>
              <p className="text-sm text-foreground/80 leading-relaxed">Airflow gets rough</p>
              <p className="text-sm text-foreground/80 leading-relaxed">Snoring may happen</p>
            </div>
            <div className="rounded-xl p-4 bg-muted/40 border border-border">
              <p className="font-extrabold text-red-700 dark:text-red-400 mb-2">Sleep Apnea</p>
              <p className="text-sm text-foreground/80 leading-relaxed">Airflow gets blocked</p>
              <p className="text-sm text-foreground/80 leading-relaxed">Breathing can pause</p>
              <p className="text-sm text-foreground/80 leading-relaxed">This is more serious</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — GREEN */}
      {show(2) && (
        <div className="rounded-xl p-5 sm:p-6 bg-card border border-green-200 dark:border-green-800 shadow-sm">
          <h4 className="text-lg font-extrabold text-green-700 dark:text-green-400 mb-1">
            Step 2 — Where can the airway narrow?
          </h4>
          <p className="text-sm text-muted-foreground mb-5">
            The Murphy Method looks from top to bottom through the airway.
          </p>

          <div className="max-w-sm mx-auto space-y-1">
            {[
              { label: "Nose", color: "text-green-700 dark:text-green-400" },
              { label: "Palate & Tonsils", color: "text-green-700 dark:text-green-400" },
              { label: "Mandible & Tongue", color: "text-green-700 dark:text-green-400" },
              { label: "Neck", color: "text-green-700 dark:text-green-400" },
            ].map((item, index) => (
              <div key={item.label} className="text-center">
                <div className={`rounded-xl py-3 px-4 bg-muted/40 border border-border font-extrabold text-base ${item.color}`}>
                  {item.label}
                </div>
                {index < 3 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-5 h-5 text-green-700 dark:text-green-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 — RED */}
      {show(3) && (
        <div className="rounded-xl p-5 sm:p-6 bg-card border border-red-200 dark:border-red-800 shadow-sm">
          <h4 className="text-lg font-extrabold text-red-700 dark:text-red-400 mb-1">
            Step 3 — What can help?
          </h4>
          <p className="text-sm text-muted-foreground mb-5">
            Treatment depends on where the blockage is and how serious the problem is.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="font-extrabold text-red-700 dark:text-red-400 text-base mb-3">
                Non-Surgery Options
              </p>
              <ul className="text-sm text-foreground/80 space-y-1.5 leading-relaxed">
                <li>CPAP</li>
                <li>Oral appliance</li>
                <li>Other treatments</li>
              </ul>
            </div>
            <div className="rounded-xl p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="font-extrabold text-red-700 dark:text-red-400 text-base mb-3">
                Procedure Options
              </p>
              <ul className="text-sm text-foreground/80 space-y-1.5 leading-relaxed">
                <li>Nose procedures</li>
                <li>Palate / tonsil procedures</li>
                <li>Jaw / tongue procedures</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-xl p-4 bg-muted/40 border border-border text-center">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <strong className="text-red-700 dark:text-red-400">Simple idea:</strong> first understand
              the breathing problem, then look at where the airway is narrowing, then
              choose treatment options that fit that pattern.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

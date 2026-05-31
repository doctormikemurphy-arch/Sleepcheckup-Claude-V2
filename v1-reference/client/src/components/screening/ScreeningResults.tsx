import { useEffect, useState, useCallback, useRef, type ElementType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Disclaimer } from "../Disclaimer";
import { StepLayout } from "../StepLayout";
import type { ScreeningProfile } from "@/lib/screening-types";
import {
  getOsaRiskLabel,
  getZoneInterpretation,
} from "@/lib/scoring";
import { getUrgencyInfo } from "@/lib/screening-helpers";
import { Link } from "wouter";
import {
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileText,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Activity,
  Lightbulb,
  Stethoscope,
  ChevronRight,
  Moon,
  Ear,
  Smile,
  Brain,
  FlaskConical,
  Printer,
  BookOpen,
  Gift,
  Loader2,
  RotateCcw,
} from "lucide-react";

interface ScreeningResultsProps {
  profile: ScreeningProfile;
  onRestart: () => void;
}

const anatomyZones = [
  { key: "nose" as const, label: "Nose & Nasal Airway", scoreKey: "noseScore" as const, positiveKey: "noseIsPositive" as const, responsesKey: "noseResponses" as const, maxScore: 5 },
  { key: "palate" as const, label: "Palate & Tonsils", scoreKey: "palateScore" as const, positiveKey: "palateIsPositive" as const, responsesKey: "palateResponses" as const, maxScore: 3 },
  { key: "mandible" as const, label: "Jaw & Tongue", scoreKey: "mandibleScore" as const, positiveKey: "mandibleIsPositive" as const, responsesKey: "mandibleResponses" as const, maxScore: 3 },
  { key: "neck" as const, label: "Neck & Body", scoreKey: "neckScore" as const, positiveKey: "neckIsPositive" as const, responsesKey: "neckResponses" as const, maxScore: 3 },
];

const riskBadgeColors = {
  low: "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40",
  intermediate: "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40",
  high: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40",
};

const stopBangMeaning = {
  low: "A score of 0–2 indicates a lower probability of obstructive sleep apnea based on the standard STOP-BANG clinical screening tool.",
  intermediate: "A score of 3–4 indicates a meaningful probability of obstructive sleep apnea and warrants further clinical evaluation.",
  high: "A score of 5–8 indicates a high probability of moderate-to-severe obstructive sleep apnea. Clinical evaluation is strongly recommended.",
};

function SpecialistLogo({ logo, abbr, Icon, iconBg }: { logo: string; abbr: string; Icon: ElementType; iconBg: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`w-16 h-16 rounded-md ${iconBg} flex flex-col items-center justify-center flex-shrink-0 gap-1`}>
        <Icon className="w-5 h-5 text-white" />
        <span className="text-white text-[9px] font-bold leading-none tracking-wide">{abbr}</span>
      </div>
    );
  }
  return (
    <div className="w-16 h-16 rounded-md bg-white flex items-center justify-center flex-shrink-0 border border-border p-1.5">
      <img
        src={logo}
        alt={abbr}
        className="w-full h-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function ScreeningResults({ profile, onRestart }: ScreeningResultsProps) {
  const urgency = getUrgencyInfo(profile);
  const [email, setEmail] = useState(() => localStorage.getItem("mm_screener_email") || "");
  const [emailSubmitted, setEmailSubmitted] = useState(() => !!localStorage.getItem("mm_screener_email"));
  const [resourcesEmailSubmitted, setResourcesEmailSubmitted] = useState(() => !!localStorage.getItem("mm_screener_email"));
  const [resourcesEmail, setResourcesEmail] = useState("");

  useEffect(() => {
    localStorage.setItem("mm_screening_date", new Date().toISOString());
  }, []);

  const UrgencyIcon = urgency.level === "urgent" ? ShieldAlert : urgency.level === "soon" ? Clock : CheckCircle2;

  const handleStartFresh = () => {
    localStorage.removeItem("murphy_method_screening");
    localStorage.removeItem("mm_screener_email");
    localStorage.removeItem("mm_screening_date");
    onRestart();
  };

  const callScreenerSubmitApi = useCallback(async (submittedEmail: string) => {
    const flaggedZones: string[] = [];
    if (profile.anatomy?.noseIsPositive) flaggedZones.push("nose");
    if (profile.anatomy?.palateIsPositive) flaggedZones.push("palate");
    if (profile.anatomy?.mandibleIsPositive) flaggedZones.push("tongue");
    if (profile.anatomy?.neckIsPositive) flaggedZones.push("throat");

    try {
      await fetch("/api/screener/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: submittedEmail,
          stopBangScore: profile.stopBangScore ?? 0,
          osaRisk: profile.osaRisk ?? "low",
          flaggedZones,
        }),
      });
    } catch (err) {
      console.error("Failed to submit screener:", err);
    }
  }, [profile]);

  const handleResourcesEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourcesEmail.trim()) return;
    const trimmed = resourcesEmail.trim();
    localStorage.setItem("mm_screener_email", trimmed);
    setEmail(trimmed);
    setEmailSubmitted(true);
    setResourcesEmailSubmitted(true);
    callScreenerSubmitApi(trimmed);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const trimmed = email.trim();
    localStorage.setItem("mm_screener_email", trimmed);
    setEmailSubmitted(true);
    callScreenerSubmitApi(trimmed);
  };

  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined }),
      });
      const data = await res.json();
      if (data.url) {
        // Try top-frame navigation first (escapes Replit preview iframe);
        // fall back to new tab if cross-origin security blocks it;
        // final fallback is same-window redirect (works on deployed site).
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = data.url;
          } else {
            window.location.href = data.url;
          }
        } catch (_) {
          window.open(data.url, "_blank");
        }
      } else {
        setCheckoutError("Could not start checkout. Please try again.");
        setCheckingOut(false);
      }
    } catch (err) {
      setCheckoutError("Could not start checkout. Please try again.");
      setCheckingOut(false);
    }
  };

  const hasHighOsaRisk = profile.osaRisk === "high";
  const hasModeRateRisk = profile.osaRisk === "intermediate";

  return (
    <StepLayout
      title="Your Screening Results"
      subtitle="Free Murphy Method™ Screening Summary"
      subtitleBold={true}
      showNext={false}
      titleColor="black"
      showBack={false}
    >
      <div className="space-y-10">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartFresh}
            data-testid="button-start-fresh"
            className="gap-2 text-muted-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Fresh
          </Button>
        </div>

        <Disclaimer variant="warning" mini />

        {/* URGENCY SIGNAL */}
        <div
          className={`rounded-xl p-5 border-2 ${urgency.colorClasses} ${urgency.borderClass}`}
          data-testid="screening-urgency-signal"
        >
          <div className="flex items-start gap-3">
            <UrgencyIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-base mb-1">{urgency.headline}</p>
              <p className="text-sm leading-relaxed">{urgency.message}</p>
            </div>
          </div>
        </div>

        {/* ── STEP 1: HOW IS THE BREATHING AT NIGHT ── */}
        <section className="space-y-4" data-testid="section-step1">
          <div className="flex items-center gap-3 border-b-2 border-blue-500 pb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">1</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Step 1: How is the Breathing at Night?</h2>
              <p className="text-sm text-muted-foreground">STOP-BANG Obstructive Sleep Apnea Risk Score</p>
            </div>
            <Activity className="w-5 h-5 text-blue-600 ml-auto flex-shrink-0" />
          </div>

          <Card data-testid="card-breathing-spectrum">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-4xl font-extrabold text-foreground tracking-tight" data-testid="screening-stopbang-score">
                    {profile.stopBangScore}<span className="text-xl font-medium text-muted-foreground">/8</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">STOP-BANG Score</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-bold ${riskBadgeColors[profile.osaRisk]}`}
                  data-testid="screening-osa-risk-badge"
                >
                  {getOsaRiskLabel(profile.osaRisk)} Risk
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div className="bg-green-400 dark:bg-green-600" style={{ width: "37.5%" }} />
                  <div className="bg-yellow-400 dark:bg-yellow-500" style={{ width: "25%" }} />
                  <div className="bg-red-500 dark:bg-red-600" style={{ width: "37.5%" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low (0–2)</span>
                  <span>Moderate (3–4)</span>
                  <span>High (5–8)</span>
                </div>
                <div className="relative h-2 mt-1">
                  <div
                    className="absolute w-3 h-3 rounded-full bg-foreground border-2 border-background shadow -translate-x-1/2 -top-0.5"
                    style={{ left: `${(profile.stopBangScore / 8) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {stopBangMeaning[profile.osaRisk]}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ── EMAIL CAPTURE ── appears right after score while interest is highest */}
        {!emailSubmitted ? (
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3" data-testid="section-email-capture-top">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Email me these results</p>
                <p className="text-xs text-muted-foreground mt-0.5">Get a copy in your inbox + be the first to know when new resources are added.</p>
              </div>
            </div>
            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="screener-email-top"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9"
                  data-testid="input-screener-email-top"
                />
              </div>
              <Button type="submit" data-testid="button-save-email-top">
                Send
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">No spam. Unsubscribe any time. We never share your information.</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg px-4 py-3 border border-green-200 dark:border-green-800" data-testid="section-email-confirmed-top">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Results sent to <strong>{email}</strong> — check your inbox (and spam folder just in case).</span>
          </div>
        )}

        {/* ── STEP 2: WHERE CAN THE AIRWAY NARROW ── */}
        <section className="space-y-4" data-testid="section-step2">
          <div className="flex items-center gap-3 border-b-2 border-green-500 pb-3">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">2</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Step 2: Where Can the Airway Narrow?</h2>
              <p className="text-sm text-muted-foreground">Airway Zone Assessment — Nose to Neck</p>
            </div>
            <AlertCircle className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
          </div>

          <Card data-testid="card-anatomy-zones">
            <CardContent className="p-5 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Murphy Method™ evaluates four anatomical zones from top to bottom. Each zone that responds positively is <strong className="text-foreground">flagged</strong> — meaning your responses suggest that area may be contributing to sleep-disordered breathing.
              </p>

              <div className="space-y-3 pt-1">
                {anatomyZones.map((zone) => {
                  const score = profile.anatomy[zone.scoreKey];
                  const isPositive = profile.anatomy[zone.positiveKey];
                  const answeredYes = profile.anatomy[zone.responsesKey].answeredYes;

                  return (
                    <div
                      key={zone.key}
                      className={`rounded-lg border ${
                        isPositive
                          ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20"
                          : "border-transparent bg-muted/30"
                      }`}
                      data-testid={`screening-zone-${zone.key}`}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isPositive ? "bg-yellow-500" : "bg-green-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">{zone.label}</p>
                          <p className="text-xs text-muted-foreground">{getZoneInterpretation(score)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-muted-foreground">{score}/{zone.maxScore}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isPositive
                              ? "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40"
                              : "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40"
                          }`}>
                            {isPositive ? "Flagged" : "Clear"}
                          </span>
                        </div>
                      </div>
                      {isPositive && answeredYes.length > 0 && (
                        <ul className="px-4 pb-3 space-y-1">
                          {answeredYes.map((q, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

            </CardContent>
          </Card>
        </section>

        {/* ── STEP 3: WHAT CAN HELP ── */}
        <section className="space-y-4" data-testid="section-step3">
          <div className="flex items-center gap-3 border-b-2 border-red-500 pb-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">3</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Step 3: What Can Help?</h2>
              <p className="text-sm text-muted-foreground">Treatment depends on where the blockage is and how serious the problem is.</p>
            </div>
            <Stethoscope className="w-5 h-5 text-red-600 ml-auto flex-shrink-0" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4" data-testid="card-what-can-help">
            {/* Non-Surgery Options */}
            <div className="rounded-xl p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="font-extrabold text-blue-700 dark:text-blue-300 text-base mb-4">
                Non-Surgery Options
              </p>
              <ul className="space-y-2">
                {["CPAP", "Oral appliance", "Other treatments"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Procedure Options */}
            <div className="rounded-xl p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="font-extrabold text-red-700 dark:text-red-300 text-base mb-4">
                Procedure Options
              </p>
              <ul className="space-y-2">
                {["Nose procedures", "Palate / tonsil procedures", "Jaw / tongue procedures"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Summary box */}
          <div className="rounded-xl p-5 bg-muted/40 border border-border text-center">
            <p className="text-sm text-foreground leading-relaxed">
              <strong className="text-blue-700 dark:text-blue-300">Simple idea:</strong> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.
            </p>
          </div>
        </section>

        {/* ── KEY CONCEPT BOX ── */}
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6" data-testid="section-key-concept">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Key Concept</p>
              <p className="font-semibold text-foreground leading-relaxed mb-2">
                A low-risk STOP-BANG score does NOT mean you do not have OSA.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If your Screening Results indicate that you are at low risk for OSA, <strong className="text-foreground">this does not mean that you do not have OSA.</strong> The STOP-BANG is a screening tool — not a diagnosis. Anyone with snoring, witnessed pauses in breathing, or excessive daytime sleepiness should discuss these symptoms with a doctor regardless of their score.
              </p>
            </div>
          </div>
        </div>

        {/* ── YOUR NEXT STEP ── */}
        <section className="space-y-4" data-testid="section-what-to-expect">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-bold text-foreground">Your Next Step</h2>
            <p className="text-sm text-muted-foreground">What to Do With These Results</p>
          </div>

          <Card>
            <CardContent className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The next step is to <strong className="text-foreground">see a doctor to discuss the results of this screening tool</strong> and see if you have snoring or OSA. This will probably include a sleep study to measure your breathing while you sleep. You can probably start by meeting with your primary care provider.
              </p>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">1</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">See Your Primary Care Provider</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Share these results and discuss your symptoms. They can order a sleep study or refer you to the right specialist based on your anatomy and risk profile.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">2</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">Get a Sleep Study if Recommended</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {hasHighOsaRisk
                      ? "Your STOP-BANG score indicates high risk — a sleep study is strongly recommended. This may be an in-lab polysomnography or a home sleep apnea test (HSAT)."
                      : hasModeRateRisk
                        ? "Your STOP-BANG score indicates moderate risk. A sleep study is a reasonable next step to confirm or rule out OSA and determine its severity."
                        : "Even with a lower STOP-BANG score, if you have symptoms such as snoring, witnessed apneas, or daytime sleepiness, discuss a sleep study with your doctor."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-xs">3</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">See the Right Specialist for Your Anatomy</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The Find a Specialist section below lists the medical providers best suited to evaluate and treat sleep-disordered breathing based on your results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── FIND A SPECIALIST ── */}
        <section className="space-y-4" data-testid="section-find-specialist">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-bold text-foreground">Find a Specialist</h2>
            <p className="text-sm text-muted-foreground">Connect with a qualified specialist who can evaluate and treat your sleep breathing concerns</p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "sleep-center",
                abbr: "AASM",
                Icon: Moon,
                iconBg: "bg-blue-600",
                logo: "/logos/aasm.svg",
                name: "American Academy of Sleep Medicine – Find a Sleep Center",
                url: "sleepeducation.org/sleep-center",
                href: "https://sleepeducation.org/sleep-center",
                description: "Locate an accredited sleep center near you staffed with sleep medicine specialists who can evaluate both insomnia and sleep apnea.",
              },
              {
                id: "ent",
                abbr: "AAO",
                Icon: Ear,
                iconBg: "bg-teal-600",
                logo: "/logos/entnet.png",
                name: "American Academy of Otolaryngology – Find an ENT",
                url: "enthealth.org/find-ent",
                href: "https://www.enthealth.org/find-ent",
                description: "Locate an Ear, Nose & Throat surgeon who specializes in diagnosing and treating nasal obstruction and airway issues.",
              },
              {
                id: "dental",
                abbr: "AADSM",
                Icon: Smile,
                iconBg: "bg-indigo-600",
                logo: "/logos/aadsm.png",
                name: "American Academy of Dental Sleep Medicine",
                url: "aadsm.org/find_an_aadsm_qualilfied_denti.php",
                href: "https://www.aadsm.org/find_an_aadsm_qualilfied_denti.php",
                description: "Find a dentist specializing in oral appliance therapy for the treatment of snoring and obstructive sleep apnea.",
              },
              {
                id: "behavioral",
                abbr: "SBSM",
                Icon: Brain,
                iconBg: "bg-emerald-600",
                logo: "/logos/behavioralsleep.png",
                name: "Society of Behavioral Sleep Medicine – Find a Provider",
                url: "www.behavioralsleep.org",
                href: "https://www.behavioralsleep.org",
                description: "Find a behavioral sleep medicine specialist trained in CBT-I for insomnia treatment.",
              },
              {
                id: "endocrinology",
                abbr: "AACE",
                Icon: FlaskConical,
                iconBg: "bg-violet-600",
                logo: "/logos/aace.png",
                name: "American Association of Clinical Endocrinology – Find an Endocrinologist",
                url: "www.aace.com",
                href: "https://www.aace.com",
                description: "Find an endocrinologist who specializes in thyroid disorders, metabolic conditions, and hormonal imbalances that can affect sleep.",
              },
            ].map(({ id, abbr, Icon, iconBg, logo, name, url, href, description }) => (
              <Card key={id} data-testid={`specialist-card-${id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <SpecialistLogo logo={logo} abbr={abbr} Icon={Icon} iconBg={iconBg} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground mb-1">{name}</p>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary underline underline-offset-2 mb-1.5 block"
                        data-testid={`specialist-link-${id}`}
                      >
                        {url}
                      </a>
                      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── PRINT ── */}
        <Card data-testid="action-card-print">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Printer className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <p className="font-semibold text-sm text-foreground">Print / Save as PDF</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Print a copy to bring to your doctor, or use your browser's "Save as PDF" option to keep a digital copy.
            </p>
            <Button
              variant="outline"
              className="w-full sm:w-auto flex-shrink-0"
              data-testid="button-print-results"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Results
            </Button>
          </CardContent>
        </Card>

        {/* ── FREE RESOURCES OPT-IN ── */}
        <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-4" data-testid="section-resources-optin">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Gift className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-foreground text-base mb-1">Get Dr. Murphy's Free Resource Library</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter your email to access curated articles, product reviews, recommended books, and specialist-finder tools — organized by sleep condition. New resources added regularly.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
            {[
              { icon: BookOpen, label: "Sleep health articles & guides" },
              { icon: CheckCircle2, label: "Vetted product recommendations" },
              { icon: Stethoscope, label: "Find the right specialist" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {!resourcesEmailSubmitted ? (
            <form onSubmit={handleResourcesEmailSubmit} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={resourcesEmail}
                    onChange={(e) => setResourcesEmail(e.target.value)}
                    required
                    className="pl-9"
                    data-testid="input-resources-email"
                  />
                </div>
                <Button type="submit" variant="outline" data-testid="button-resources-email-submit">
                  Get Free Access
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">No spam. Unsubscribe any time.</p>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg px-4 py-3">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You're in — browse the full resource library below.</span>
              </div>
              <a href="/resources" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full gap-2" data-testid="button-resources-browse">
                  <BookOpen className="w-4 h-4" />
                  Browse Resources Now
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* ── UPGRADE CTA ── */}
        <div className="rounded-xl border-2 border-primary bg-primary/5 p-6 space-y-5" data-testid="section-upgrade-cta">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground text-lg mb-1">Unlock Your Murphy Method™ Treatment Path — $1</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Most people with sleep problems are never told <strong className="text-foreground">which specific treatment path applies to their anatomy</strong>. Based on your 4-zone airway profile, you fall into 1 of 8 distinct treatment pathways — a framework developed exclusively by Dr. Murphy that doesn't exist anywhere else. Your full report tells you exactly which one you are, what it means, and what to do next.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {[
              "Your 1-of-8 treatment path — matched to your exact anatomy",
              "Treatment options specific to your flagged zones — not generic advice",
              "What to avoid based on your anatomy, and why",
              "Exact questions to ask your doctor at your next visit",
              "Which tests to request at your appointment",
              "Doctor visit prep sheet you can print and bring",
              "Specialist referral guide matched to your pathway",
              "Pathway-specific resources and next steps",
              "My Portal — save results, track retakes & access live pathway resources",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-muted/40 border border-border px-4 py-3 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">100% Satisfaction Guarantee.</strong> If you don't find the report valuable, email us and we'll refund you in full — no questions asked.
            </p>
          </div>

          {!emailSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <Label htmlFor="screener-email" className="text-sm font-medium text-foreground">
                  Enter your email — your report will be sent here
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="screener-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9"
                      data-testid="input-screener-email"
                    />
                  </div>
                  <Button type="submit" data-testid="button-save-email">
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  We don't share your information.
                </p>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Saved — your report will be sent to <strong>{email}</strong></span>
            </div>
          )}

          {checkoutError && (
            <p className="text-sm text-red-600 text-center">{checkoutError}</p>
          )}

          <Button
            size="lg"
            className="w-full gap-2 text-base"
            data-testid="button-get-full-report"
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting to checkout…
              </>
            ) : (
              <>
                Get My Full Report — $1
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>

          <div className="border-t border-primary/20 pt-3 space-y-2">
            <p className="text-xs text-muted-foreground text-center font-medium">
              No subscription · No account required
            </p>
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground text-center">
                Secure checkout via Stripe · Delivered by email in under 2 minutes
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRestart}
            className="text-muted-foreground gap-2"
            data-testid="button-retake-screening"
          >
            Retake Screening
          </Button>
        </div>

      </div>
    </StepLayout>
  );
}

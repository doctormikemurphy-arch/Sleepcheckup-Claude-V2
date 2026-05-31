import { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { useScreener } from "@/hooks/useScreener";
import {
  ShieldAlert, Clock, CheckCircle2, Activity, AlertCircle,
  Stethoscope, ChevronRight, Gift, BookOpen, ArrowLeft,
  Printer, Mail, ArrowRight, Lightbulb, RotateCcw,
} from "lucide-react";
import { getUrgencyInfo } from "@/lib/screener-helpers";
import { getOsaRiskLabel, getZoneInterpretation, scoreStopBang, scoreZones, scoreAnatomy } from "@/lib/scoring";
import type { ScreeningProfile } from "@/lib/screener-types";

const anatomyZones = [
  { key: "nose" as const, label: "Nose & Nasal Airway", scoreKey: "noseScore" as const, positiveKey: "noseIsPositive" as const, responsesKey: "noseResponses" as const, maxScore: 5 },
  { key: "palate" as const, label: "Palate & Tonsils", scoreKey: "palateScore" as const, positiveKey: "palateIsPositive" as const, responsesKey: "palateResponses" as const, maxScore: 3 },
  { key: "mandible" as const, label: "Jaw & Tongue", scoreKey: "mandibleScore" as const, positiveKey: "mandibleIsPositive" as const, responsesKey: "mandibleResponses" as const, maxScore: 3 },
  { key: "neck" as const, label: "Neck & Body", scoreKey: "neckScore" as const, positiveKey: "neckIsPositive" as const, responsesKey: "neckResponses" as const, maxScore: 3 },
];

const riskBgColors = {
  low: { bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" },
  intermediate: { bg: "#FFFBEB", text: "#B45309", border: "#FCD34D" },
  high: { bg: "#FEF2F2", text: "#B91C1C", border: "#FCA5A5" },
};

const stopBangMeaning = {
  low: "A score of 0–2 indicates a lower probability of obstructive sleep apnea based on the standard STOP-BANG clinical screening tool.",
  intermediate: "A score of 3–4 indicates a meaningful probability of obstructive sleep apnea and warrants further clinical evaluation.",
  high: "A score of 5–8 indicates a high probability of moderate-to-severe obstructive sleep apnea. Clinical evaluation is strongly recommended.",
};

const specialists = [
  {
    id: "sleep-center",
    logoUrl: "https://sleepeducation.org/wp-content/uploads/2023/10/AASM_logo_h_RT_rgb-300x89.png",
    name: "American Academy of Sleep Medicine – Find a Sleep Center",
    url: "sleepeducation.org/sleep-center",
    href: "https://sleepeducation.org/sleep-center",
    description: "Locate an accredited sleep center near you staffed with sleep medicine specialists who can evaluate both insomnia and sleep apnea.",
  },
  {
    id: "ent",
    logoUrl: "https://www.entnet.org/wp-content/uploads/2020/07/AAO-HNS_logo.png",
    name: "American Academy of Otolaryngology – Find an ENT",
    url: "enthealth.org/find-ent",
    href: "https://www.enthealth.org/find-ent",
    description: "Locate an Ear, Nose & Throat surgeon who specializes in diagnosing and treating nasal obstruction and airway issues.",
  },
  {
    id: "dental",
    logoUrl: "https://aadsm.org/images/main-logo.png",
    name: "American Academy of Dental Sleep Medicine",
    url: "aadsm.org",
    href: "https://www.aadsm.org/find_an_aadsm_qualilfied_denti.php",
    description: "Find a dentist specializing in oral appliance therapy for the treatment of snoring and obstructive sleep apnea.",
  },
  {
    id: "behavioral",
    logoUrl: "https://www.behavioralsleep.org/images/2021/graphics/SBSMlogo70H.png",
    name: "Society of Behavioral Sleep Medicine – Find a Provider",
    url: "behavioralsleep.org",
    href: "https://www.behavioralsleep.org",
    description: "Find a behavioral sleep medicine specialist trained in CBT-I for insomnia treatment.",
  },
  {
    id: "endocrinology",
    logoUrl: "https://www.aace.com/images/wwwaacecom.jpg",
    name: "American Association of Clinical Endocrinology – Find an Endocrinologist",
    url: "aace.com/find-an-endo",
    href: "https://www.aace.com/find-an-endo",
    description: "Find a clinical endocrinologist who specializes in metabolic conditions including obesity, which is a major contributor to obstructive sleep apnea.",
  },
];

export default function ScreenerResults() {
  const [, navigate] = useLocation();
  const { profile: storedProfile, stopBangAnswers, zoneAnswers, restart } = useScreener();
  const [email, setEmail] = useState(() => localStorage.getItem("mm_screener_email") || "");
  const [emailSaved, setEmailSaved] = useState(() => !!localStorage.getItem("mm_screener_email"));
  const [libraryEmail, setLibraryEmail] = useState("");
  const [librarySubmitted, setLibrarySubmitted] = useState(false);

  // Recompute from answers as a fallback in case the stored profile didn't survive navigation
  const computedProfile = useMemo((): ScreeningProfile | null => {
    const hasAnswers = Object.values(stopBangAnswers).some((v) => v !== null);
    if (!hasAnswers) return null;
    const { score: stopBangScore, risk: osaRisk } = scoreStopBang(stopBangAnswers);
    return {
      stopBangScore,
      osaRisk,
      zones: scoreZones(zoneAnswers),
      anatomy: scoreAnatomy(zoneAnswers),
    };
  }, [stopBangAnswers, zoneAnswers]);

  const profile = storedProfile ?? computedProfile;

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh", padding: "40px 20px", backgroundColor: "var(--bg-page)" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", marginBottom: "16px" }}>No results found. Please complete the screening first.</p>
        <Link href="/screener">
          <button className="btn-primary">Start Screening</button>
        </Link>
      </div>
    );
  }

  const urgency = getUrgencyInfo(profile);
  const UrgencyIcon = urgency.level === "urgent" ? ShieldAlert : urgency.level === "soon" ? Clock : CheckCircle2;
  const riskColors = riskBgColors[profile.osaRisk];
  const hasHighRisk = profile.osaRisk === "high";
  const hasMedRisk = profile.osaRisk === "intermediate";

  const handleRestart = () => {
    restart();
    navigate("/screener");
  };

  const handleEmailSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    localStorage.setItem("mm_screener_email", trimmed);
    setEmailSaved(true);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-page)", minHeight: "100vh" }}>
      <div className="mx-auto px-4" style={{ maxWidth: "900px", paddingTop: "48px", paddingBottom: "80px" }}>

        {/* Back to home */}
        <div className="mb-6">
          <Link href="/" className="no-underline inline-flex items-center gap-1.5" style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="eyebrow mb-2">YOUR RESULTS</div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(24px, 3vw, 40px)",
                lineHeight: 1.1,
                color: "var(--text-ink)",
              }}
            >
              Your Screening <em>Results</em>
            </h1>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-full border transition-colors"
            style={{ borderColor: "var(--border-soft)", backgroundColor: "var(--bg-card)", minHeight: "40px", padding: "0 16px", fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-sans)", cursor: "pointer" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Fresh
          </button>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-xl border p-4 mb-8"
          style={{ borderColor: "#FDE68A", backgroundColor: "#FFFBEB" }}
        >
          <p style={{ fontSize: "14px", color: "#92400E", lineHeight: 1.6 }}>
            <strong>Medical Disclaimer:</strong> This screening tool is for educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.
          </p>
        </div>

        {/* Urgency signal */}
        <div
          className="rounded-xl border-2 p-5 mb-8"
          style={{ borderColor: urgency.level === "urgent" ? "#FCA5A5" : urgency.level === "soon" ? "#FCD34D" : "#86EFAC", backgroundColor: urgency.level === "urgent" ? "#FEF2F2" : urgency.level === "soon" ? "#FFFBEB" : "#F0FDF4" }}
        >
          <div className="flex items-start gap-3">
            <UrgencyIcon className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: urgency.level === "urgent" ? "#B91C1C" : urgency.level === "soon" ? "#B45309" : "#15803D" }} />
            <div>
              <p className="font-bold mb-1" style={{ fontSize: "17px", color: "#0F172A" }}>{urgency.headline}</p>
              <p style={{ fontSize: "15px", lineHeight: 1.65, color: "#475569" }}>{urgency.message}</p>
            </div>
          </div>
        </div>

        {/* STEP 1: STOP-BANG */}
        <section className="mb-8">
          <div className="flex items-center gap-3 pb-3 mb-4" style={{ borderBottom: "2px solid #1D4ED8" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#1D4ED8" }}>
              <span className="text-white font-bold" style={{ fontSize: "13px" }}>1</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Step 1: How is the Breathing at Night?</p>
              <p className="text-ink-muted" style={{ fontSize: "14px" }}>STOP-BANG Obstructive Sleep Apnea Risk Score</p>
            </div>
            <Activity className="w-5 h-5 flex-shrink-0" style={{ color: "#1D4ED8" }} />
          </div>

          <div className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <p className="font-black text-ink" style={{ fontSize: "40px", lineHeight: 1 }}>
                  {profile.stopBangScore}<span className="font-medium text-ink-muted" style={{ fontSize: "20px" }}>/8</span>
                </p>
                <p className="text-ink-muted" style={{ fontSize: "14px" }}>STOP-BANG Score</p>
              </div>
              <div
                className="rounded-full px-4 py-2 font-bold"
                style={{ backgroundColor: riskColors.bg, color: riskColors.text, fontSize: "14px" }}
              >
                {getOsaRiskLabel(profile.osaRisk)}
              </div>
            </div>

            {/* Spectrum bar */}
            <div className="mb-3">
              <div className="flex h-3 rounded-full overflow-hidden mb-1.5">
                <div style={{ width: "37.5%", backgroundColor: "#4ADE80" }} />
                <div style={{ width: "25%", backgroundColor: "#FACC15" }} />
                <div style={{ width: "37.5%", backgroundColor: "#F87171" }} />
              </div>
              <div className="flex justify-between" style={{ fontSize: "12px", color: "#64748B" }}>
                <span>Low (0–2)</span>
                <span>Moderate (3–4)</span>
                <span>High (5–8)</span>
              </div>
              <div className="relative" style={{ height: "12px", marginTop: "4px" }}>
                <div
                  className="absolute rounded-full border-2 border-white"
                  style={{
                    width: "14px", height: "14px",
                    backgroundColor: "#0F172A",
                    left: `${(profile.stopBangScore / 8) * 100}%`,
                    transform: "translateX(-50%)",
                    top: "-1px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </div>

            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.65 }}>
              {stopBangMeaning[profile.osaRisk]}
            </p>
          </div>
        </section>

        {/* Email capture — top */}
        {!emailSaved ? (
          <div
            className="rounded-xl border-2 p-5 mb-8"
            style={{ borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#1D4ED8" }}>
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-ink" style={{ fontSize: "15px" }}>Email me these results</p>
                <p className="text-ink-muted" style={{ fontSize: "14px" }}>Get a copy in your inbox — no spam, unsubscribe any time.</p>
              </div>
            </div>
            <form onSubmit={handleEmailSave} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-lg border px-3"
                style={{ borderColor: "#93C5FD", fontSize: "16px", minHeight: "44px", outline: "none" }}
              />
              <button
                type="submit"
                className="font-semibold text-white rounded-lg px-4"
                style={{ backgroundColor: "#1D4ED8", minHeight: "44px", fontSize: "15px" }}
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border px-4 py-3 mb-8" style={{ borderColor: "#86EFAC", backgroundColor: "#F0FDF4" }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#15803D" }} />
            <p style={{ fontSize: "15px", color: "#15803D" }}>Results saved — check your inbox.</p>
          </div>
        )}

        {/* STEP 2: Airway Zones */}
        <section className="mb-8">
          <div className="flex items-center gap-3 pb-3 mb-4" style={{ borderBottom: "2px solid #16A34A" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#16A34A" }}>
              <span className="text-white font-bold" style={{ fontSize: "13px" }}>2</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Step 2: Where Can the Airway Narrow?</p>
              <p className="text-ink-muted" style={{ fontSize: "14px" }}>Airway Zone Assessment — Nose to Neck</p>
            </div>
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#16A34A" }} />
          </div>

          <div className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="text-ink-muted mb-4" style={{ fontSize: "15px", lineHeight: 1.65 }}>
              The Murphy Method™ evaluates four anatomical zones from top to bottom. Each zone that responds positively is <strong className="text-ink">flagged</strong> — meaning your responses suggest that area may be contributing to sleep-disordered breathing.
            </p>

            <div className="space-y-3">
              {anatomyZones.map((zone) => {
                const score = profile.anatomy[zone.scoreKey];
                const isPositive = profile.anatomy[zone.positiveKey];
                const answeredYes = profile.anatomy[zone.responsesKey]?.answeredYes ?? [];

                return (
                  <div
                    key={zone.key}
                    className="rounded-lg border"
                    style={{
                      borderColor: isPositive ? "#FDE68A" : "transparent",
                      backgroundColor: isPositive ? "#FFFBEB" : "#F8FAFC",
                    }}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div
                        className="rounded-full flex-shrink-0"
                        style={{ width: "8px", height: "8px", backgroundColor: isPositive ? "#EAB308" : "#22C55E" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink" style={{ fontSize: "15px" }}>{zone.label}</p>
                        <p className="text-ink-muted" style={{ fontSize: "13px" }}>{getZoneInterpretation(score)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-ink-muted" style={{ fontSize: "13px" }}>{score}/{zone.maxScore}</span>
                        <span
                          className="rounded-full font-semibold px-2 py-0.5"
                          style={{
                            fontSize: "12px",
                            backgroundColor: isPositive ? "#FEF9C3" : "#DCFCE7",
                            color: isPositive ? "#713F12" : "#14532D",
                          }}
                        >
                          {isPositive ? "Flagged" : "Clear"}
                        </span>
                      </div>
                    </div>
                    {isPositive && answeredYes.length > 0 && (
                      <ul className="px-4 pb-3 space-y-1">
                        {answeredYes.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-ink-muted" style={{ fontSize: "13px" }}>
                            <span className="rounded-full flex-shrink-0 mt-1.5" style={{ width: "6px", height: "6px", backgroundColor: "#EAB308" }} />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STEP 3: What Can Help */}
        <section className="mb-8">
          <div className="flex items-center gap-3 pb-3 mb-4" style={{ borderBottom: "2px solid #DC2626" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#DC2626" }}>
              <span className="text-white font-bold" style={{ fontSize: "13px" }}>3</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Step 3: What Can Help?</p>
              <p className="text-ink-muted" style={{ fontSize: "14px" }}>Treatment depends on where the blockage is and how serious the problem is.</p>
            </div>
            <Stethoscope className="w-5 h-5 flex-shrink-0" style={{ color: "#DC2626" }} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl border p-5" style={{ borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" }}>
              <p className="font-bold mb-4" style={{ fontSize: "15px", color: "#1E40AF" }}>Non-Surgery Options</p>
              <ul className="space-y-2">
                {["CPAP", "Oral appliance", "Other treatments"].map((item) => (
                  <li key={item} className="flex items-start gap-2" style={{ fontSize: "15px", color: "#0F172A" }}>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border p-5" style={{ borderColor: "#FECACA", backgroundColor: "#FEF2F2" }}>
              <p className="font-bold mb-4" style={{ fontSize: "15px", color: "#991B1B" }}>Procedure Options</p>
              <ul className="space-y-2">
                {["Nose procedures", "Palate / tonsil procedures", "Jaw / tongue procedures"].map((item) => (
                  <li key={item} className="flex items-start gap-2" style={{ fontSize: "15px", color: "#0F172A" }}>
                    <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#DC2626" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border p-4 text-center" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
            <p style={{ fontSize: "15px", color: "#0F172A", lineHeight: 1.6 }}>
              <strong style={{ color: "#1E40AF" }}>Simple idea:</strong> first understand the breathing problem, then look at where the airway is narrowing, then choose treatment options that fit that pattern.
            </p>
          </div>
        </section>

        {/* Key Concept */}
        <div
          className="rounded-xl border-2 p-6 mb-8"
          style={{ borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#DBEAFE" }}>
              <Lightbulb className="w-4 h-4" style={{ color: "#1D4ED8" }} />
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider mb-2" style={{ fontSize: "11px", color: "#1D4ED8" }}>Key Concept</p>
              <p className="font-semibold text-ink mb-2" style={{ fontSize: "17px", lineHeight: 1.4 }}>
                A low-risk STOP-BANG score does NOT mean you do not have OSA.
              </p>
              <p className="text-ink-muted" style={{ fontSize: "15px", lineHeight: 1.65 }}>
                If your Screening Results indicate that you are at low risk for OSA, <strong className="text-ink">this does not mean that you do not have OSA.</strong> The STOP-BANG is a screening tool — not a diagnosis. Anyone with snoring, witnessed pauses in breathing, or excessive daytime sleepiness should discuss these symptoms with a doctor regardless of their score.
              </p>
            </div>
          </div>
        </div>

        {/* Your Next Step */}
        <section className="mb-8">
          <div className="pb-3 mb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <p className="font-bold text-ink" style={{ fontSize: "19px" }}>Your Next Step</p>
            <p className="text-ink-muted" style={{ fontSize: "15px" }}>What to Do With These Results</p>
          </div>

          <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
            <p className="text-ink-muted" style={{ fontSize: "15px", lineHeight: 1.65 }}>
              The next step is to <strong className="text-ink">see a doctor to discuss the results of this screening tool</strong> and see if you have snoring or OSA. This will probably include a sleep study to measure your breathing while you sleep. You can probably start by meeting with your primary care provider.
            </p>
            {[
              {
                num: "1",
                title: "See Your Primary Care Provider",
                body: "Share these results and discuss your symptoms. They can order a sleep study or refer you to the right specialist based on your anatomy and risk profile.",
              },
              {
                num: "2",
                title: "Get a Sleep Study if Recommended",
                body: hasHighRisk
                  ? "Your STOP-BANG score indicates high risk — a sleep study is strongly recommended. This may be an in-lab polysomnography or a home sleep apnea test (HSAT)."
                  : hasMedRisk
                    ? "Your STOP-BANG score indicates moderate risk. A sleep study is a reasonable next step to confirm or rule out OSA and determine its severity."
                    : "Even with a lower STOP-BANG score, if you have symptoms such as snoring, witnessed apneas, or daytime sleepiness, discuss a sleep study with your doctor.",
              },
              {
                num: "3",
                title: "See the Right Specialist for Your Anatomy",
                body: "The Find a Specialist section below lists the medical providers best suited to evaluate and treat sleep-disordered breathing based on your results.",
              },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-4 rounded-lg p-4" style={{ backgroundColor: "#F8FAFC" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#DBEAFE" }}>
                  <span className="font-bold" style={{ fontSize: "13px", color: "#1D4ED8" }}>{item.num}</span>
                </div>
                <div>
                  <p className="font-semibold text-ink mb-1" style={{ fontSize: "15px" }}>{item.title}</p>
                  <p className="text-ink-muted" style={{ fontSize: "15px", lineHeight: 1.65 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Find a Specialist */}
        <section className="mb-8">
          <div className="pb-3 mb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <p className="font-bold text-ink" style={{ fontSize: "19px" }}>Find a Specialist</p>
            <p className="text-ink-muted" style={{ fontSize: "15px" }}>Connect with a qualified specialist who can evaluate and treat your sleep breathing concerns</p>
          </div>

          <div className="space-y-3">
            {specialists.map((s) => (
              <div key={s.id} className="rounded-xl border p-4" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
                <div className="flex items-start gap-3">
                  <div
                    className="rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ width: "80px", height: "56px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", padding: "8px" }}
                  >
                    <img
                      src={s.logoUrl}
                      alt=""
                      aria-hidden="true"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink mb-1" style={{ fontSize: "15px" }}>{s.name}</p>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 mb-1.5 block" style={{ fontSize: "13px", color: "#1D4ED8" }}>
                      {s.url}
                    </a>
                    <p className="text-ink-muted" style={{ fontSize: "13px", lineHeight: 1.6 }}>{s.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resource Library CTA */}
        <div className="rounded-xl border p-5 mb-8" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
          {/* Header row */}
          <div className="flex items-start gap-3 mb-4">
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ width: "40px", height: "40px", backgroundColor: "#DCFCE7" }}
            >
              <Gift className="w-5 h-5" style={{ color: "#15803D" }} />
            </div>
            <div>
              <p className="font-bold text-ink" style={{ fontSize: "17px" }}>Get Dr. Murphy's Free Resource Library</p>
              <p className="text-ink-muted" style={{ fontSize: "15px", lineHeight: 1.6 }}>
                Enter your email to access curated articles, product reviews, recommended books, and specialist-finder tools — organized by sleep condition. New resources added regularly.
              </p>
            </div>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
            {[
              { Icon: BookOpen, label: "Sleep health articles & guides" },
              { Icon: CheckCircle2, label: "Vetted product recommendations" },
              { Icon: Stethoscope, label: "Find the right specialist" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5" style={{ fontSize: "14px", color: "#15803D" }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Email form */}
          {librarySubmitted ? (
            <div className="flex items-center gap-2 rounded-lg border px-4 py-3" style={{ borderColor: "#86EFAC", backgroundColor: "#F0FDF4" }}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#15803D" }} />
              <p style={{ fontSize: "15px", color: "#15803D" }}>You're in — check your inbox for access.</p>
            </div>
          ) : (
            <>
              <form
                onSubmit={(e) => { e.preventDefault(); if (libraryEmail.trim()) setLibrarySubmitted(true); }}
                className="flex gap-2"
              >
                <div className="flex items-center flex-1 rounded-lg border px-3 gap-2" style={{ borderColor: "#D1D5DB", backgroundColor: "#fff" }}>
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#9CA3AF" }} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={libraryEmail}
                    onChange={(e) => setLibraryEmail(e.target.value)}
                    required
                    style={{ flex: 1, border: "none", outline: "none", fontSize: "16px", minHeight: "44px", backgroundColor: "transparent", fontFamily: "var(--font-sans)" }}
                  />
                </div>
                <button
                  type="submit"
                  className="font-semibold rounded-lg px-5 flex-shrink-0"
                  style={{ backgroundColor: "#0F172A", color: "#fff", minHeight: "44px", fontSize: "15px", border: "none", cursor: "pointer" }}
                >
                  Get Free Access
                </button>
              </form>
              <p className="mt-2" style={{ fontSize: "13px", color: "#9CA3AF" }}>No spam. Unsubscribe any time.</p>
            </>
          )}
        </div>

        {/* Print */}
        <div className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 mb-8" style={{ borderColor: "#E2E8F0", backgroundColor: "#fff" }}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Printer className="w-5 h-5 text-ink-muted flex-shrink-0" />
            <p className="font-semibold text-ink" style={{ fontSize: "15px" }}>Print / Save as PDF</p>
          </div>
          <p className="text-ink-muted flex-1" style={{ fontSize: "14px", lineHeight: 1.6 }}>
            Print a copy to bring to your doctor, or use your browser's "Save as PDF" option to keep a digital copy.
          </p>
          <button
            onClick={() => window.print()}
            className="rounded-lg border font-semibold text-ink flex items-center gap-2 flex-shrink-0"
            style={{ borderColor: "#E2E8F0", minHeight: "44px", padding: "0 20px", fontSize: "15px", backgroundColor: "#fff" }}
          >
            <Printer className="w-4 h-4" />
            Print Results
          </button>
        </div>

        {/* Upgrade CTA */}
        <div
          className="card mb-8"
          style={{ padding: "48px", border: "2px solid var(--blue)" }}
        >
          <div className="eyebrow mb-4">RECOMMENDED NEXT STEP</div>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(22px, 3vw, 36px)",
              lineHeight: 1.1,
              color: "var(--text-ink)",
              marginBottom: "16px",
            }}
          >
            Get your full Murphy Method™ <em>Report</em>
          </h3>
          <div className="mb-5">
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-ink-soft)", lineHeight: 1.65 }}>
              Most people with sleep problems are never told <strong style={{ color: "var(--text-ink)" }}>which specific treatment path applies to their anatomy</strong>. Based on your questionnaire and 4-zone anatomy profile results, you fall into 1 of 8 distinct treatment pathways — a framework developed exclusively by Dr. Murphy that doesn't exist anywhere else. Your full report tells you exactly which one you are, what it means, and what to do next.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-2 mb-5">
            {[
              "Your 1-of-8 treatment path — matched to your exact anatomy",
              "Treatment options specific to your flagged zones — not generic advice",
              "What to avoid based on your anatomy, and why",
              "Exact questions to ask your doctor at your next visit",
              "Which tests to request at your appointment",
              "Doctor visit prep sheet you can print and bring",
              "Specialist referral guide matched to your pathway",
              "My Portal — save results, track retakes & access live pathway resources",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-ink-muted" style={{ fontSize: "14px" }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-lg px-4 py-3 mb-5" style={{ backgroundColor: "#DBEAFE" }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#16A34A" }} />
            <p style={{ fontSize: "13px", color: "#1E40AF", lineHeight: 1.6 }}>
              <strong>100% Satisfaction Guarantee.</strong> If you don't find the report valuable, email us and we'll refund you in full — no questions asked.
            </p>
          </div>

          <Link href="/assessment/checkout">
            <button className="btn-primary w-full" style={{ fontSize: "18px", gap: "8px" }}>
              Get My Full Report — $79
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

          <p className="text-center mt-4" style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)" }}>
            No subscription · No account required · Secure checkout
          </p>
        </div>

        {/* Retake */}
        <div className="text-center">
          <button
            onClick={handleRestart}
            className="text-ink-muted flex items-center gap-2 mx-auto"
            style={{ fontSize: "15px", background: "none", border: "none", cursor: "pointer" }}
          >
            <RotateCcw className="w-4 h-4" />
            Retake Screening
          </button>
        </div>

      </div>
    </div>
  );
}

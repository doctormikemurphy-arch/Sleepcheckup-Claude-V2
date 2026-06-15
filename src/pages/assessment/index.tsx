import { useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import { useAssessment } from "@/hooks/useAssessment";
import { ProgressTopBar } from "@/components/layout/ProgressTopBar";
import { TOTAL_ASSESSMENT_STEPS, ASSESSMENT_STEP_NAMES } from "@/lib/assessment-types";
import { ZONE_QUESTIONS } from "@/lib/questionnaires";
import { isPaid, setPaidSession } from "@/lib/storage";
import { Step1Welcome } from "./Step1Welcome";
import { Step2MedicalHistory } from "./Step2MedicalHistory";
import { Step3Bmi } from "./Step3Bmi";
import { Step4StopBang } from "./Step4StopBang";
import { Step5Isi } from "./Step5Isi";
import { Step6Plato } from "./Step6Plato";
import { ZoneStep } from "@/pages/screener/ZoneStep";
import { Step11Palm } from "./Step11Palm";

const clerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AccountInterstitial() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-page)",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        {/* Green check */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#DCFCE7",
            marginBottom: "28px",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#16A34A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="eyebrow mb-4">PAYMENT CONFIRMED</div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(24px, 3vw, 36px)",
            lineHeight: 1.05,
            color: "var(--text-ink)",
            marginBottom: "16px",
          }}
        >
          One last step before you begin
        </h1>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "17px",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            maxWidth: "400px",
            margin: "0 auto 40px",
          }}
        >
          Create your free account to save your results and access them from any device, anytime.
          This takes about 30 seconds.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/sign-up?redirect_url=/assessment" className="no-underline">
            <button className="btn-primary w-full" style={{ fontSize: "16px" }}>
              Create Free Account →
            </button>
          </Link>
          <Link href="/sign-in?redirect_url=/assessment" className="no-underline">
            <button className="btn-secondary w-full" style={{ fontSize: "16px" }}>
              Sign In to Existing Account
            </button>
          </Link>
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            color: "var(--text-muted)",
            marginTop: "24px",
            lineHeight: 1.5,
          }}
        >
          Your payment is confirmed and won't expire.
        </p>
      </div>
    </section>
  );
}

function AssessmentPageCore({
  isSignedIn,
  clerkLoaded,
}: {
  isSignedIn: boolean;
  clerkLoaded: boolean;
}) {
  const [, navigate] = useLocation();
  const search = useSearch();
  const [paid, setPaidStatus] = useState(() => isPaid());
  // paymentChecked starts true if already paid (no API call needed), false if pending verification
  const [paymentChecked, setPaymentChecked] = useState(() => isPaid());

  // Verify Stripe payment session on mount; redirect to checkout if unpaid
  useEffect(() => {
    const params = new URLSearchParams(search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      fetch(`/api/verify-payment?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.paid) {
            setPaidSession(sessionId, data.email ?? null);
            setPaidStatus(true);
            setPaymentChecked(true);
            window.history.replaceState({}, "", "/assessment");
          } else {
            setPaymentChecked(true);
            navigate("/assessment/checkout");
          }
        })
        .catch(() => {
          setPaymentChecked(true);
          if (!isPaid()) navigate("/assessment/checkout");
        });
    } else if (!isPaid()) {
      navigate("/assessment/checkout");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    step,
    medicalHistory,
    bmi,
    stopBang,
    isi,
    plato,
    zoneAnswers,
    palm,
    resumedFromSaved,
    screenerPrefilled,
    setMedicalHistory,
    setBmi,
    setStopBang,
    setIsi,
    setPlato,
    setZones,
    setPalm,
    dismissResume,
    restart,
    goNext,
    goBack,
    computeAndFinish,
    isCurrentStepComplete,
    isStepComplete,
  } = useAssessment();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const noseConfig = ZONE_QUESTIONS.find((z) => z.zone === "nose")!;
  const palateConfig = ZONE_QUESTIONS.find((z) => z.zone === "palate")!;
  const mandibleConfig = ZONE_QUESTIONS.find((z) => z.zone === "mandible")!;
  const neckConfig = ZONE_QUESTIONS.find((z) => z.zone === "neck")!;

  const showBack = step > 1;
  const stepName = ASSESSMENT_STEP_NAMES[step] ?? "";

  const handleFinish = () => {
    computeAndFinish();
    navigate("/assessment/results");
  };

  // Hold on a blank screen while payment is being verified or Clerk is initializing.
  // This prevents a flash from assessment step 1 → interstitial.
  if (!paymentChecked || (clerkEnabled && !clerkLoaded)) {
    return (
      <div
        style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)" }}
        aria-hidden="true"
      />
    );
  }

  // Show account interstitial if paid but not signed into Clerk
  if (clerkEnabled && paid && !isSignedIn) {
    return <AccountInterstitial />;
  }

  return (
    <div style={{ paddingTop: "56px", minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>
      <ProgressTopBar
        step={step}
        totalSteps={TOTAL_ASSESSMENT_STEPS}
        stepName={stepName}
        onBack={showBack ? goBack : undefined}
        onExit={() => navigate("/")}
      />

      {resumedFromSaved && (
        <div
          className="px-4 py-3 flex items-center justify-between gap-3"
          style={{ backgroundColor: "var(--blue-soft)", borderBottom: "1px solid #BFDBFE" }}
        >
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#1E40AF" }}>
            Picking up where you left off.
          </p>
          <div className="flex gap-3">
            <button
              onClick={dismissResume}
              className="border-0 bg-transparent cursor-pointer"
              style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--blue)" }}
            >
              Continue
            </button>
            <button
              onClick={restart}
              className="border-0 bg-transparent cursor-pointer"
              style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)" }}
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {step === 1 && <Step1Welcome onStart={goNext} onSkip={goNext} />}
      {step === 2 && (
        <Step2MedicalHistory
          answers={medicalHistory}
          onChange={setMedicalHistory}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}
      {step === 3 && (
        <Step3Bmi
          bmi={bmi}
          onChange={setBmi}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}
      {step === 4 && (
        <Step4StopBang
          answers={stopBang}
          onChange={setStopBang}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
          screenerPrefilled={screenerPrefilled}
          bmiAutoFilled={bmi.calculatedBmi !== null && bmi.calculatedBmi >= 35}
        />
      )}
      {step === 5 && (
        <Step5Isi
          answers={isi}
          onChange={setIsi}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}
      {step === 6 && (
        <Step6Plato
          answers={plato}
          onChange={setPlato}
          onNext={goNext}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}
      {step === 7 && (
        <ZoneStep
          zoneConfig={noseConfig}
          zoneKey="nose"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          onBack={goBack}
          nextLabel="Continue to Palate & Tonsils →"
          isComplete={isStepComplete(7)}
          stepNum={7}
          zoneIndex={1}
        />
      )}
      {step === 8 && (
        <ZoneStep
          zoneConfig={palateConfig}
          zoneKey="palate"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          onBack={goBack}
          nextLabel="Continue to Jaw & Tongue →"
          isComplete={isStepComplete(8)}
          stepNum={8}
          zoneIndex={2}
        />
      )}
      {step === 9 && (
        <ZoneStep
          zoneConfig={mandibleConfig}
          zoneKey="mandible"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          onBack={goBack}
          nextLabel="Continue to Neck →"
          isComplete={isStepComplete(9)}
          stepNum={9}
          zoneIndex={3}
        />
      )}
      {step === 10 && (
        <ZoneStep
          zoneConfig={neckConfig}
          zoneKey="neck"
          answers={zoneAnswers}
          onChange={setZones}
          onNext={goNext}
          onBack={goBack}
          nextLabel="Continue to Step 3: What Can Help →"
          isComplete={isStepComplete(10)}
          stepNum={10}
          zoneIndex={4}
        />
      )}
      {step === 11 && (
        <Step11Palm
          answers={palm}
          onChange={setPalm}
          onFinish={handleFinish}
          onBack={goBack}
          isComplete={isCurrentStepComplete}
        />
      )}
    </div>
  );
}

// Thin wrapper that reads Clerk auth state and passes it down.
// Isolated here so that useAuth() is only called when ClerkProvider is present.
function AssessmentPageWithClerk() {
  const { isSignedIn, isLoaded } = useAuth();
  return <AssessmentPageCore isSignedIn={!!isSignedIn} clerkLoaded={isLoaded} />;
}

export default function AssessmentPage() {
  return clerkEnabled ? (
    <AssessmentPageWithClerk />
  ) : (
    <AssessmentPageCore isSignedIn={true} clerkLoaded={true} />
  );
}

import { useEffect } from "react";
import { Link } from "wouter";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";

interface SavedAssessment {
  completedAt: string;
  pathway: string;
  pathwayLetter: string;
  pathwayName: string;
  stripeSessionId: string;
  stopBangScore: number;
  osaRisk: string;
  isiScore: number;
  insomniaSeverity: string;
  bmiValue: number | null;
}

const riskColors: Record<string, { color: string; bg: string }> = {
  high:         { color: "#B91C1C", bg: "#FEF2F2" },
  intermediate: { color: "#B45309", bg: "#FFFBEB" },
  low:          { color: "#15803D", bg: "#F0FDF4" },
};

function PortalDashboard() {
  const { user } = useUser();
  const firstName =
    user?.firstName ??
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ??
    "there";

  // Refresh on mount so publicMetadata reflects the latest saved assessment
  useEffect(() => {
    user?.reload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const assessments: SavedAssessment[] = Array.isArray(
    (user?.publicMetadata as Record<string, unknown> | undefined)?.assessments
  )
    ? ((user?.publicMetadata as Record<string, unknown>).assessments as SavedAssessment[])
    : [];

  // Most recent first
  const sorted = [...assessments].reverse();

  return (
    <section className="section" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="eyebrow">YOUR PORTAL</div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.05,
            color: "var(--text-ink)",
            marginBottom: "32px",
          }}
        >
          Welcome back, <em>{firstName}</em>
        </h1>

        {sorted.length === 0 ? (
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "17px",
                color: "var(--text-muted)",
                lineHeight: 1.65,
                marginBottom: "32px",
              }}
            >
              You haven't completed a full assessment yet. Once you do, your pathway and results
              will appear here — accessible from any device, anytime.
            </p>
            <Link href="/assessment/info" className="no-underline">
              <button className="btn-primary">Get My Full Assessment — $79</button>
            </Link>
          </div>
        ) : (
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                color: "var(--text-muted)",
                marginBottom: "20px",
              }}
            >
              {sorted.length} assessment{sorted.length !== 1 ? "s" : ""} saved to your account.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {sorted.map((a, i) => {
                const risk = riskColors[a.osaRisk] ?? riskColors.low;
                const date = new Date(a.completedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                return (
                  <div key={i} className="card" style={{ padding: "28px" }}>
                    {/* Pathway header */}
                    <div className="flex items-start gap-4 mb-20px" style={{ marginBottom: "20px" }}>
                      <div
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{
                          width: "52px",
                          height: "52px",
                          backgroundColor: "var(--blue-soft)",
                          color: "var(--blue)",
                          borderRadius: "14px",
                          fontFamily: "var(--font-sans)",
                          fontSize: "28px",
                          fontWeight: 700,
                        }}
                      >
                        {a.pathwayLetter}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 700,
                            fontSize: "16px",
                            color: "var(--text-ink)",
                            marginBottom: "4px",
                            lineHeight: 1.3,
                          }}
                        >
                          {a.pathwayName}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "13px",
                            color: "var(--text-muted)",
                          }}
                        >
                          Completed {date}
                        </p>
                      </div>
                    </div>

                    {/* Key scores */}
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        style={{
                          textAlign: "center",
                          padding: "10px 8px",
                          borderRadius: "10px",
                          backgroundColor: risk.bg,
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 700,
                            fontSize: "20px",
                            color: risk.color,
                            lineHeight: 1,
                            marginBottom: "4px",
                          }}
                        >
                          {a.stopBangScore}
                          <span style={{ fontSize: "13px", fontWeight: 500 }}>/8</span>
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "11px",
                            color: "var(--text-muted)",
                          }}
                        >
                          STOP-BANG
                        </p>
                      </div>

                      <div
                        style={{
                          textAlign: "center",
                          padding: "10px 8px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-page)",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 700,
                            fontSize: "20px",
                            color: "var(--text-ink)",
                            lineHeight: 1,
                            marginBottom: "4px",
                          }}
                        >
                          {a.isiScore}
                          <span style={{ fontSize: "13px", fontWeight: 500 }}>/28</span>
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "11px",
                            color: "var(--text-muted)",
                          }}
                        >
                          ISI
                        </p>
                      </div>

                      <div
                        style={{
                          textAlign: "center",
                          padding: "10px 8px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-page)",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 700,
                            fontSize: "20px",
                            color: "var(--text-ink)",
                            lineHeight: 1,
                            marginBottom: "4px",
                          }}
                        >
                          {a.bmiValue ? a.bmiValue.toFixed(1) : "—"}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "11px",
                            color: "var(--text-muted)",
                          }}
                        >
                          BMI
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "32px" }}>
              <Link href="/assessment/info" className="no-underline">
                <button className="btn-secondary">Take Assessment Again</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SignInPrompt() {
  return (
    <section className="section" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "440px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div className="eyebrow mb-4">YOUR PORTAL</div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.05,
            color: "var(--text-ink)",
            marginBottom: "16px",
          }}
        >
          Sign in to access your <em>results</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "17px",
            color: "var(--text-muted)",
            marginBottom: "40px",
            lineHeight: 1.65,
          }}
        >
          Save your reports, track progress over time, and access resources matched to your pathway.
        </p>

        <Link href="/sign-in" className="no-underline w-full">
          <button className="btn-primary w-full" style={{ marginBottom: "16px" }}>
            Sign in
          </button>
        </Link>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="no-underline"
            style={{ color: "var(--blue)", fontWeight: 600 }}
          >
            Create one free →
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function PortalPage() {
  return (
    <>
      <SignedIn>
        <PortalDashboard />
      </SignedIn>
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
    </>
  );
}

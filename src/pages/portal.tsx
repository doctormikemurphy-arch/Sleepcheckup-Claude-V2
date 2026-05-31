import { Link } from "wouter";
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/clerk-react";
import { FileText, RefreshCw, BookOpen } from "lucide-react";

const FEATURES = [
  { icon: FileText, title: "Saved Reports", body: "Access your past assessment reports from any device, any time." },
  { icon: RefreshCw, title: "Retake Tracking", body: "Compare results across multiple assessments to track changes over time." },
  { icon: BookOpen, title: "Live Pathway Resources", body: "Curated articles and tools that update as guidelines evolve — matched to your assigned pathway." },
];

function PortalDashboard() {
  const { user } = useUser();
  const firstName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "there";

  return (
    <section className="section" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 24px" }}>
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
            marginBottom: "16px",
          }}
        >
          Welcome back, <em>{firstName}</em>
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", marginBottom: "48px", lineHeight: 1.65 }}>
          The portal lets you save results, retake the assessment, and access live pathway resources. It's included free with every full assessment.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left", marginBottom: "40px" }}>
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card flex items-start gap-4" style={{ padding: "24px" }}>
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "var(--blue-soft)" }}
              >
                <Icon className="w-5 h-5" style={{ color: "var(--blue)" }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "15px", color: "var(--text-ink)", marginBottom: "4px" }}>{title}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        <Link href="/screener" className="no-underline">
          <button className="btn-primary w-full">Start Free Screener →</button>
        </Link>
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
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", marginBottom: "40px", lineHeight: 1.65 }}>
          Save your reports, track progress over time, and access resources matched to your pathway.
        </p>

        <SignInButton mode="modal">
          <button className="btn-primary w-full" style={{ marginBottom: "16px" }}>
            Sign in with Google
          </button>
        </SignInButton>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <SignInButton mode="modal">
            <button className="border-0 bg-transparent cursor-pointer" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--blue)", fontWeight: 600 }}>
              Create one free →
            </button>
          </SignInButton>
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

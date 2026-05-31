export default function PrivacyPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: "120px", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow mb-4">LEGAL</div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.05,
              color: "var(--text-ink)",
              marginBottom: "12px",
            }}
          >
            Privacy <em>Policy</em>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
            Last updated: January 1, 2025 · Sleep Check Up, Inc.
          </p>
        </div>
      </section>

      <section className="section-tinted">
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
              lineHeight: 1.75,
              color: "var(--text-ink-soft)",
            }}
          >
            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                1. Information We Collect
              </h2>
              <p>SleepCheckup.com collects information you provide when completing the free screener or full assessment, including your responses to health questionnaires. If you purchase the full assessment, we collect your email address and payment information (processed by our third-party payment provider — we do not store full card numbers).</p>
              <p style={{ marginTop: "12px" }}>We also collect standard server logs and analytics data (page views, session duration, browser type) to improve the service.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                2. How We Use Your Information
              </h2>
              <p>We use your information to:</p>
              <ul style={{ paddingLeft: "24px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Generate and deliver your personalized assessment report</li>
                <li>Process payments and prevent fraud</li>
                <li>Improve the accuracy and relevance of the assessment</li>
                <li>Respond to support requests</li>
              </ul>
              <p style={{ marginTop: "12px" }}>We do not sell your personal information to third parties. We do not use your health questionnaire responses for advertising purposes.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                3. Data Storage and Security
              </h2>
              <p>Assessment responses are stored locally in your browser using localStorage and are not transmitted to our servers unless you complete a purchase. We use industry-standard encryption (TLS) for all data in transit.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                4. Cookies
              </h2>
              <p>We use essential cookies to maintain your session and analytics cookies (via a privacy-first analytics provider) to understand aggregate usage. We do not use advertising cookies or cross-site tracking cookies.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                5. Your Rights
              </h2>
              <p>You may request deletion of any personal data we hold about you by contacting us at privacy@sleepcheckup.com. California residents have additional rights under the CCPA.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                6. Changes to This Policy
              </h2>
              <p>We may update this policy from time to time. Material changes will be noted at the top of this page with an updated date.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                7. Contact
              </h2>
              <p>Questions about this policy? Email us at privacy@sleepcheckup.com or write to Sleep Check Up, Inc., Palo Alto, CA.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

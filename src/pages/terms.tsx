export default function TermsPage() {
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
            Terms of <em>Service</em>
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
                1. Acceptance of Terms
              </h2>
              <p>By using SleepCheckup.com (the "Service"), you agree to these Terms of Service. If you do not agree, do not use the Service. The Service is operated by Sleep Check Up, Inc.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                2. Educational Purpose Only
              </h2>
              <p>The Murphy Method™ assessment is an educational tool. It does not constitute medical advice, diagnosis, or treatment. Results are intended to help you prepare for a conversation with a qualified healthcare provider — not to replace one. Always consult a physician or licensed healthcare professional before making health decisions.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                3. Eligibility
              </h2>
              <p>You must be 18 years of age or older to use this Service. By using the Service, you represent that you are at least 18.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                4. Payment and Refunds
              </h2>
              <p>The full assessment is offered at a one-time fee of $79.00 USD. If you complete the assessment and are not satisfied with your report, you may request a full refund within 7 days of purchase by contacting support@sleepcheckup.com. Refunds are issued to the original payment method.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                5. Intellectual Property
              </h2>
              <p>Murphy Method™ is a trademark of Sleep Check Up, Inc. All content, scoring logic, pathway frameworks, and report formats are proprietary and may not be reproduced, distributed, or used commercially without written permission.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                6. Limitation of Liability
              </h2>
              <p>To the fullest extent permitted by law, Sleep Check Up, Inc. and its officers, employees, and agents are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service or reliance on assessment results.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                7. Governing Law
              </h2>
              <p>These Terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of Santa Clara County, California.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                8. Contact
              </h2>
              <p>Questions about these Terms? Email support@sleepcheckup.com.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

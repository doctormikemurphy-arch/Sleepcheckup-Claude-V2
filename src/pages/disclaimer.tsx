export default function DisclaimerPage() {
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
            Medical <em>Disclaimer</em>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
            Sleep Check Up, Inc. · sleepcheckup.com
          </p>
        </div>
      </section>

      <section className="section-tinted">
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
          <div
            className="card"
            style={{ padding: "24px", marginBottom: "40px", border: "1px solid #FECACA", backgroundColor: "#FEF2F2" }}
          >
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px", color: "#991B1B", marginBottom: "8px" }}>
              Important — Please Read
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "#7F1D1D", lineHeight: 1.7 }}>
              The Murphy Method™ assessment is an educational tool only. It does not constitute medical advice, a medical diagnosis, or a recommendation for medical treatment. Do not use this tool as a substitute for professional medical care.
            </p>
          </div>

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
                No Doctor-Patient Relationship
              </h2>
              <p>Use of SleepCheckup.com does not create a doctor-patient relationship between you and Dr. Michael Murphy or any other physician. Dr. Murphy is the content author of the Murphy Method™ framework — he is not your treating physician and has not reviewed your individual case.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                Purpose of This Tool
              </h2>
              <p>This assessment is designed to help you understand the general landscape of sleep-disordered breathing, identify which clinical categories may be relevant to your situation, and prepare more effectively for a conversation with your own physician or specialist.</p>
              <p style={{ marginTop: "12px" }}>It does not replace a clinical evaluation, a sleep study, or a diagnosis from a qualified healthcare provider.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                Consult Your Doctor
              </h2>
              <p>Always consult a qualified healthcare professional before making any changes to your health management, stopping any current treatment, or beginning any new treatment based on information from this assessment. If you are experiencing a medical emergency, call 911 or your local emergency number immediately.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                Accuracy of Information
              </h2>
              <p>While every effort is made to ensure the clinical frameworks and educational content are accurate and up-to-date, medical knowledge evolves. The content of this assessment is not a substitute for current, individualized clinical judgment.</p>
            </section>

            <section>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "18px", color: "var(--text-ink)", marginBottom: "12px" }}>
                Questions
              </h2>
              <p>If you have questions about the content of your assessment results, please consult with your physician. For technical or billing questions, contact us at support@sleepcheckup.com.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

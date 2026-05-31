import { useState } from "react";
import { Send, Check } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <>
      <section className="section" style={{ paddingTop: "120px", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 24px" }}>
          <div className="eyebrow mb-4">CONTACT</div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.05,
              color: "var(--text-ink)",
              marginBottom: "16px",
            }}
          >
            Get in <em>Touch</em>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.65 }}>
            Questions about the assessment, your results, or the Murphy Method™? We'll respond within one business day.
          </p>
        </div>
      </section>

      <section className="section-tinted">
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "0 24px" }}>
          {submitted ? (
            <div
              className="card"
              style={{ padding: "48px", textAlign: "center", border: "1px solid #BBF7D0", backgroundColor: "#F0FDF4" }}
            >
              <div
                className="flex items-center justify-center mx-auto mb-4"
                style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#16A34A" }}
              >
                <Check className="w-6 h-6 text-white" />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 400,
                  fontSize: "24px",
                  color: "var(--text-ink)",
                  marginBottom: "8px",
                }}
              >
                Message received
              </h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-muted)" }}>
                We'll be in touch within one business day.
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: "40px" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "var(--text-ink)",
                      marginBottom: "6px",
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      border: "1.5px solid var(--border-soft)",
                      padding: "12px 16px",
                      fontSize: "15px",
                      fontFamily: "var(--font-sans)",
                      color: "var(--text-ink)",
                      outline: "none",
                      backgroundColor: "var(--bg-card)",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "var(--text-ink)",
                      marginBottom: "6px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      border: "1.5px solid var(--border-soft)",
                      padding: "12px 16px",
                      fontSize: "15px",
                      fontFamily: "var(--font-sans)",
                      color: "var(--text-ink)",
                      outline: "none",
                      backgroundColor: "var(--bg-card)",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "var(--text-ink)",
                      marginBottom: "6px",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="How can we help?"
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      border: "1.5px solid var(--border-soft)",
                      padding: "12px 16px",
                      fontSize: "15px",
                      fontFamily: "var(--font-sans)",
                      color: "var(--text-ink)",
                      outline: "none",
                      resize: "none",
                      backgroundColor: "var(--bg-card)",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
                  />
                </div>
                <button type="submit" className="btn-primary flex items-center justify-center gap-2 w-full">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

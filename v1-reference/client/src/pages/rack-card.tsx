import { Printer } from "lucide-react";

const NAVY = "#1e3a5f";
const NAVY_DEEP = "#162d4a";
const GOLD = "#c9a84c";
const WHITE = "#ffffff";
const LIGHT_NAVY = "#e8eef5";

const QR_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https%3A%2F%2Fsleepcheckup.com&color=1e3a5f&bgcolor=ffffff&margin=4";

function LogoSVGLight({ size = 40 }: { size?: number }) {
  const id = `rc-mask-light-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <mask id={id}>
          <rect width="44" height="44" fill="black" />
          <circle cx="21" cy="12" r="11" fill="white" />
          <circle cx="27" cy="12" r="7.5" fill="black" />
        </mask>
      </defs>
      <circle cx="21" cy="12" r="11" fill="white" mask={`url(#${id})`} />
      <circle cx="36" cy="4"  r="1.5" fill="white" />
      <circle cx="40" cy="11" r="1.0" fill="white" />
      <circle cx="37" cy="20" r="1.2" fill="white" />
      <circle cx="14" cy="26" r="2"   fill="white" />
      <circle cx="28" cy="26" r="2"   fill="white" />
      <path d="M 14,26 Q 17,31 21,32 Q 25,31 28,26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="21" y1="32" x2="21" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="21" cy="39" r="3.5" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="21" cy="39" r="1.2" fill="white" />
    </svg>
  );
}

function LogoSVGDark({ size = 40 }: { size?: number }) {
  const id = `rc-mask-dark-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <mask id={id}>
          <rect width="44" height="44" fill="black" />
          <circle cx="21" cy="12" r="11" fill="white" />
          <circle cx="27" cy="12" r="7.5" fill="black" />
        </mask>
      </defs>
      <rect width="44" height="44" rx="9" fill={NAVY} />
      <circle cx="21" cy="12" r="11" fill="white" mask={`url(#${id})`} />
      <circle cx="36" cy="4"  r="1.5" fill="white" />
      <circle cx="40" cy="11" r="1.0" fill="white" />
      <circle cx="37" cy="20" r="1.2" fill="white" />
      <circle cx="14" cy="26" r="2"   fill="white" />
      <circle cx="28" cy="26" r="2"   fill="white" />
      <path d="M 14,26 Q 17,31 21,32 Q 25,31 28,26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="21" y1="32" x2="21" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="21" cy="39" r="3.5" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="21" cy="39" r="1.2" fill="white" />
    </svg>
  );
}

/* ─── FRONT ─── white base, navy header band, navy accents — low ink */
function CardFront() {
  return (
    <div
      className="rack-card-face"
      style={{
        width: "4in",
        height: "6in",
        backgroundColor: WHITE,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        fontFamily: "Georgia, 'Times New Roman', serif",
        border: `1px solid #c8d4e3`,
        overflow: "hidden",
      }}
    >
      {/* Navy header band — only coloured area on front */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 100%)`,
        padding: "0.22in 0.28in 0.18in",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
      }}>
        <LogoSVGLight size={44} />
        <div>
          <div style={{
            color: WHITE,
            fontFamily: "Inter, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "-0.3px",
            lineHeight: 1,
          }}>
            sleepcheckup.com
          </div>
          <div style={{
            color: GOLD,
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: "8.5px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: "3px",
          }}>
            Murphy Method™
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "0.22in 0.28in 0.2in",
        boxSizing: "border-box",
      }}>
        {/* Gold rule */}
        <div style={{ width: "0.5in", height: "2.5px", backgroundColor: GOLD, borderRadius: "1px", marginBottom: "0.16in" }} />

        {/* Headline */}
        <div style={{
          color: NAVY,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "21px",
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: "0.1in",
          letterSpacing: "-0.3px",
        }}>
          Snoring and Sleep Apnea<br />is Not One-Size-Fits-All
        </div>

        {/* Sub-headline */}
        <div style={{
          color: "#4a5568",
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: "10px",
          lineHeight: 1.55,
          marginBottom: "0.18in",
        }}>
          Get a free 3-minute sleep risk screening — developed
          by a Stanford-trained, dual board-certified sleep physician.
        </div>

        {/* Bullet list */}
        <div style={{
          backgroundColor: LIGHT_NAVY,
          borderRadius: "6px",
          padding: "0.12in 0.15in",
          marginBottom: "0.18in",
          border: `1px solid #c8d4e3`,
        }}>
          {[
            "Free personalized sleep risk screening",
            "Identifies 1 of 8 clinical sleep patterns",
            "Full report to share with your doctor",
            "No account or appointment needed",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
              <div style={{
                width: "13px", height: "13px", borderRadius: "50%",
                backgroundColor: GOLD, flexShrink: 0, marginTop: "1px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="7" height="5" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{
                color: NAVY,
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: "9.5px",
                lineHeight: 1.45,
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* QR + URL side by side */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "0.12in 0.14in",
          border: `1px solid #c8d4e3`,
          borderRadius: "6px",
          marginBottom: "0.14in",
        }}>
          <img
            src={QR_URL}
            alt="QR code for sleepcheckup.com"
            width="100"
            height="100"
            style={{ display: "block", flexShrink: 0 }}
          />
          <div>
            <div style={{
              color: NAVY,
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              Scan to get started
            </div>
            <div style={{
              color: NAVY,
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "-0.2px",
              marginBottom: "4px",
            }}>
              sleepcheckup.com
            </div>
            <div style={{
              color: "#718096",
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: "8.5px",
              lineHeight: 1.5,
            }}>
              Free screening.<br />
              No appointment needed.
            </div>
          </div>
        </div>

        {/* Footer disclaimer */}
        <div style={{
          marginTop: "auto",
          color: "#a0aec0",
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: "7px",
          textAlign: "center",
          lineHeight: 1.4,
        }}>
          For informational purposes only. Not a substitute for medical advice.
        </div>
      </div>
    </div>
  );
}

/* ─── BACK ─── white base, navy header band — fixed layout, no overflow clip on content */
function CardBack() {
  return (
    <div
      className="rack-card-face"
      style={{
        width: "4in",
        height: "6in",
        backgroundColor: WHITE,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        fontFamily: "Inter, Arial, sans-serif",
        border: `1px solid #c8d4e3`,
        overflow: "hidden",
      }}
    >
      {/* Navy header band */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 100%)`,
        padding: "0.18in 0.26in",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
      }}>
        <LogoSVGLight size={38} />
        <div>
          <div style={{ color: WHITE, fontWeight: 700, fontSize: "13px", letterSpacing: "-0.2px", lineHeight: 1.1 }}>
            Murphy Method™
          </div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "8px", marginTop: "2px" }}>
            Sleep Intelligence Report
          </div>
        </div>
      </div>

      {/* Body — fixed padding, no flex-grow tricks */}
      <div style={{ padding: "0.16in 0.26in 0.16in", display: "flex", flexDirection: "column", gap: "0.12in" }}>

        {/* Full report includes */}
        <div style={{
          backgroundColor: LIGHT_NAVY,
          borderRadius: "6px",
          padding: "0.1in 0.14in",
          border: `1px solid #c8d4e3`,
        }}>
          <div style={{
            color: NAVY, fontSize: "8px", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "7px",
          }}>
            Full report includes
          </div>
          {[
            ["Pathway assignment", "1 of 8 Murphy Method™ clinical patterns"],
            ["Risk analysis", "Cardiovascular, metabolic & daytime function"],
            ["Treatment options", "Specific to your assigned pathway"],
            ["Doctor visit prep", "Questions to ask, tests to request"],
            ["Pathway resources", "Curated videos, articles & specialists"],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: "flex", gap: "7px", marginBottom: "5px", alignItems: "flex-start" }}>
              <div style={{
                width: "5px", height: "5px", borderRadius: "50%",
                backgroundColor: GOLD, flexShrink: 0, marginTop: "3px",
              }} />
              <div style={{ fontSize: "9px", lineHeight: 1.4 }}>
                <span style={{ color: NAVY, fontWeight: 600 }}>{title}</span>
                <span style={{ color: "#4a5568" }}>{" — "}{desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div>
          <div style={{
            color: NAVY, fontSize: "8px", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "7px",
          }}>
            How it works
          </div>
          {[
            ["1", "Free screener", "STOP-BANG + airway zones — 3 minutes"],
            ["2", "Full assessment", "Medical history, BMI, risk factors — $79"],
            ["3", "Your report", "Emailed instantly. Bring to your appointment."],
          ].map(([num, step, desc]) => (
            <div key={num} style={{ display: "flex", gap: "9px", marginBottom: "6px", alignItems: "flex-start" }}>
              <div style={{
                width: "17px", height: "17px", borderRadius: "50%", backgroundColor: NAVY,
                flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                color: WHITE, fontSize: "8.5px", fontWeight: 700,
              }}>
                {num}
              </div>
              <div style={{ fontSize: "9px", lineHeight: 1.4 }}>
                <span style={{ color: NAVY, fontWeight: 600 }}>{step}</span>
                <span style={{ color: "#4a5568" }}>{" — "}{desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dr. Murphy credentials */}
        <div style={{ borderTop: `2px solid ${GOLD}`, paddingTop: "0.09in" }}>
          <div style={{ color: NAVY, fontFamily: "Georgia, serif", fontSize: "10px", fontWeight: 700, marginBottom: "3px" }}>
            Michael P. Murphy, MD, MPH
          </div>
          <div style={{ color: "#4a5568", fontSize: "8.5px", lineHeight: 1.5 }}>
            Board-Certified ENT &amp; Sleep Medicine Physician<br />
            Stanford-Trained · Dual Board-Certified<br />
            Developer of the Murphy Method™ Pathway System
          </div>
        </div>

        {/* QR + URL */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "13px",
          borderTop: "1px solid #dde3ed",
          paddingTop: "0.1in",
        }}>
          <div style={{
            border: "1px solid #dde3ed", borderRadius: "5px",
            padding: "4px", flexShrink: 0, backgroundColor: WHITE,
          }}>
            <img
              src={QR_URL}
              alt="QR code for sleepcheckup.com"
              width="68"
              height="68"
              style={{ display: "block", borderRadius: "3px" }}
            />
          </div>
          <div>
            <div style={{ color: NAVY, fontSize: "12px", fontWeight: 800, letterSpacing: "-0.2px", marginBottom: "3px" }}>
              sleepcheckup.com
            </div>
            <div style={{ color: "#718096", fontSize: "8.5px", lineHeight: 1.5 }}>
              Start your free screening anytime.<br />
              No appointment. No account required.
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          color: "#a0aec0", fontSize: "7px", textAlign: "center", lineHeight: 1.4,
          borderTop: "1px solid #edf2f7", paddingTop: "0.07in",
        }}>
          For informational purposes only. Not a medical diagnosis. Consult a physician for evaluation and treatment. © Sleep Check Up, Inc.
        </div>
      </div>
    </div>
  );
}

export default function RackCardPage() {
  return (
    <>
      <style>{`
        @media print {
          @page { size: 4in 6in; margin: 0; }
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-page-break { page-break-after: always; }
          .rack-card-face { box-shadow: none !important; }
          .screen-layout { display: block !important; padding: 0 !important; }
          .card-wrapper { margin: 0 !important; }
        }
        @media screen {
          .screen-layout {
            min-height: 100vh;
            background: #f0f4f8;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      {/* Screen header */}
      <div className="no-print" style={{ textAlign: "center", marginBottom: "28px", fontFamily: "Inter, Arial, sans-serif" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: NAVY, marginBottom: "6px" }}>
          Rack Card — 4&Prime; × 6&Prime; Print-Ready
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
          Front and back shown below. Print at actual size on a 4×6 card stock.
        </p>
        <button
          onClick={() => window.print()}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: NAVY, color: WHITE, border: "none",
            borderRadius: "8px", padding: "10px 22px", fontSize: "14px",
            fontWeight: 600, cursor: "pointer", fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          <Printer size={16} />
          Print / Save as PDF
        </button>
        <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
          Tip: In print dialog → paper size: 4×6, margins: None, scale: 100%.
        </p>
      </div>

      <div className="screen-layout">
        <div className="card-wrapper print-page-break" style={{ marginBottom: "32px" }}>
          <div className="no-print" style={{
            fontFamily: "Inter, Arial, sans-serif", fontSize: "11px", fontWeight: 600,
            color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase",
            textAlign: "center", marginBottom: "10px",
          }}>Front</div>
          <div style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.14)", borderRadius: "6px", overflow: "hidden" }}>
            <CardFront />
          </div>
        </div>

        <div className="card-wrapper">
          <div className="no-print" style={{
            fontFamily: "Inter, Arial, sans-serif", fontSize: "11px", fontWeight: 600,
            color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase",
            textAlign: "center", marginBottom: "10px",
          }}>Back</div>
          <div style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.14)", borderRadius: "6px", overflow: "hidden" }}>
            <CardBack />
          </div>
        </div>
      </div>
    </>
  );
}

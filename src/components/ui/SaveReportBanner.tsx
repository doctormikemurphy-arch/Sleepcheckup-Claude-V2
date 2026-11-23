// "Save your report now" banner shown at the top of the results page and the report page.
// The checkbox, the download click and the email status are shared between both pages
// (see src/lib/report-status.ts), so ticking the box on one page also ticks it on the other.
// The full banner scrolls away with the page; once it is out of view, a slim bar stays
// pinned at the top with the Download button (and the checkbox on wider screens).
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Download, Mail } from "lucide-react";
import { getPaidSession } from "@/lib/storage";
import { useReportStatus, setSavedCheckbox, markDownloaded } from "@/lib/report-status";

/** Shown in the admin preview, where no real customer email exists. */
const PREVIEW_EMAIL = "customer@example.com";

export function SaveReportBanner({ preview, leftSlot, onDownload }: {
  /** Admin preview: nothing is stored, logged or sent, and there is no "Leave site?" warning. */
  preview?: boolean;
  /** Link shown on the left of the bar (for example, back to the results page). */
  leftSlot?: ReactNode;
  /** Opens the print dialog for the PDF report. */
  onDownload: () => void;
}) {
  const paid = preview ? null : getPaidSession();
  const sessionId = paid?.sessionId ?? null;
  const email = preview ? PREVIEW_EMAIL : paid?.email ?? null;
  const status = useReportStatus(sessionId);
  const emailStatus = preview ? "sent" : status.emailStatus;

  // Browser "Leave site?" warning until the customer ticks the box or clicks Download.
  useEffect(() => {
    if (preview || status.acknowledged) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [preview, status.acknowledged]);

  // Show the slim bar only after the full banner has scrolled up out of view.
  const fullRef = useRef<HTMLDivElement>(null);
  const [scrolledPast, setScrolledPast] = useState(false);
  useEffect(() => {
    const el = fullRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setScrolledPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const couldNotEmail = !email || emailStatus === "failed";

  const handleDownload = () => {
    markDownloaded(sessionId);
    onDownload();
  };

  const checkbox = (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={status.checkbox}
        onChange={(e) => setSavedCheckbox(sessionId, e.target.checked)}
        style={{ width: "16px", height: "16px", flexShrink: 0 }}
      />
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#92400E", whiteSpace: "nowrap" }}>
        I've downloaded or printed my report.
      </span>
    </label>
  );

  return (
    <>
      <div ref={fullRef} className="print:hidden border-b" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-soft)" }}>
        <div className="mx-auto flex flex-col gap-3 px-6 py-3" style={{ maxWidth: "960px" }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {leftSlot ?? <span />}
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-2"
              style={{ minHeight: "52px", fontSize: "17px", fontWeight: 700, padding: "0 28px" }}
            >
              <Download className="w-5 h-5" />
              Download / Print Your PDF Report
            </button>
          </div>
          <div
            className="flex flex-col gap-2.5"
            style={{ borderRadius: "10px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", padding: "12px 16px" }}
          >
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#B45309", marginTop: "2px" }} />
              <p role="status" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#92400E", lineHeight: 1.55 }}>
                <strong>Save your report now.</strong>{" "}
                {couldNotEmail ? (
                  <>We could not email your report, so please download or print your PDF before you leave.</>
                ) : (
                  <>
                    You may not be able to come back to this page later. Download or print your PDF.
                    {emailStatus === "sent" && <> We also emailed a copy to <strong>{email}</strong>.</>}
                  </>
                )}
              </p>
            </div>
            <div style={{ paddingLeft: "26px" }}>{checkbox}</div>
          </div>
        </div>
      </div>

      {scrolledPast && (
        <div
          data-save-bar="slim"
          role="region"
          aria-label="Save your report"
          className="print:hidden fixed top-0 left-0 right-0 z-40 border-b"
          style={{ backgroundColor: "#FFFBEB", borderColor: "#FCD34D", boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)" }}
        >
          <div className="mx-auto flex items-center justify-between gap-3 px-4 py-1.5" style={{ maxWidth: "960px" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 700, color: "#92400E", whiteSpace: "nowrap", margin: 0 }}>
              Save your report
            </p>
            <div className="hidden md:flex">{checkbox}</div>
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-2 flex-shrink-0"
              style={{ minHeight: "36px", fontSize: "14px", fontWeight: 700, padding: "0 14px", whiteSpace: "nowrap" }}
            >
              <Download className="w-4 h-4" />
              <span className="sm:hidden">Download / Print</span>
              <span className="hidden sm:inline">Download / Print Your PDF Report</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Banner test: checks the pathway guide box, the shared "Save your report now" banner, the
// email status (success, failure with one retry, no resend in a new tab), the Start Over
// confirmation and the /pathways guide box, on the REAL customer pages in headless Chrome.
// The email request is answered inside Chrome (it never reaches any server), so no email is sent.
//
// How to run (from the repo root, in one terminal):
//   npx vite --port 5199 --strictPort &
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9333 \
//     --user-data-dir=/tmp/banner-test-chrome --no-first-run about:blank &
//   npx tsx --tsconfig tsconfig.app.json scripts/banner-test.mts http://localhost:5199 9333
// Then stop both background processes (e.g. `kill %1 %2`) and delete /tmp/banner-test-chrome.
// Exits with code 1 if any check fails.
import { SAMPLE_ANSWERS } from "../src/lib/admin-sample-answers";
import { PATHWAY_GUIDE_TITLE, PATHWAY_GUIDE_BODY } from "../src/components/ui/PathwayGuideBox";

const [base, port] = process.argv.slice(2);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

async function newTab(fakeEmail?: { status: number; body: object }) {
  const res = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  const { webSocketDebuggerUrl, id } = await res.json();
  const ws = new WebSocket(webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let n = 0;
  const pending = new Map<number, (v: any) => void>();
  const tab = { emailRequests: 0, send: null as any, evaluate: null as any, goto: null as any, close: null as any };
  const send = (method: string, params: object = {}) =>
    new Promise<any>((r) => { const i = ++n; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(String(e.data));
    if (m.id && pending.has(m.id)) { pending.get(m.id)!(m); pending.delete(m.id); return; }
    if (m.method === "Fetch.requestPaused") {
      tab.emailRequests++;
      const f = fakeEmail ?? { status: 502, body: { ok: false } };
      send("Fetch.fulfillRequest", {
        requestId: m.params.requestId, responseCode: f.status,
        responseHeaders: [{ name: "Content-Type", value: "application/json" }],
        body: Buffer.from(JSON.stringify(f.body)).toString("base64"),
      });
    }
  });
  await send("Page.enable");
  await send("Runtime.enable");
  // Every email request is answered inside Chrome; none goes to the network.
  await send("Fetch.enable", { patterns: [{ urlPattern: "*api/submit-assessment*" }] });
  const evaluate = async (expression: string) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
  const goto = async (url: string, waitFor: string) => {
    await send("Page.navigate", { url });
    for (let t = 0; t < 60; t++) {
      await sleep(250);
      if (await evaluate(`document.readyState === "complete" && document.body.innerText.includes(${JSON.stringify(waitFor)})`)) return true;
    }
    return false;
  };
  const close = async () => { ws.close(); await fetch(`http://127.0.0.1:${port}/json/close/${id}`); };
  return Object.assign(tab, { send, evaluate, goto, close });
}

const SID = "local-banner-test";
const text = async (t: any) => norm(await t.evaluate("document.body.innerText"));
async function seed(t: any, email: string | null) {
  await t.goto(`${base}/`, "");
  await t.evaluate(`localStorage.clear(); sessionStorage.clear();
    localStorage.setItem("assessment_state_v2", ${JSON.stringify(JSON.stringify(SAMPLE_ANSWERS.A_insomnia_nasal))});
    localStorage.setItem("paid_session_v2", JSON.stringify({ sessionId: "${SID}", email: ${JSON.stringify(email)}, paidAt: new Date().toISOString() }));
    true`);
}
const record = async (t: any) => JSON.parse((await t.evaluate(`localStorage.getItem("report_status_v1:${SID}")`)) ?? "null");
const click = (t: any, label: string) => t.evaluate(`(() => { const b = [...document.querySelectorAll("button")].find(x => x.textContent.trim() === ${JSON.stringify(label)}); if (!b) return false; b.click(); return true; })()`);

const SENT_PREFIX = "Save your report now. You may not be able to come back to this page later. Download or print your PDF.";
const FAILED = "Save your report now. We could not email your report, so please download or print your PDF before you leave.";
const GUIDE = norm(`${PATHWAY_GUIDE_TITLE} ${PATHWAY_GUIDE_BODY}`);
const results: [string, boolean][] = [];
const check = (name: string, ok: boolean) => { results.push([name, ok]); console.log(`${ok ? "ok  " : "FAIL"} ${name}`); };

// 1. No email on file: failed banner, guide box, disclaimer, shared checkbox, Start Over confirmation.
{
  const t = await newTab();
  await seed(t, null);
  await t.goto(`${base}/assessment/results`, "Save your report now");
  let x = await text(t);
  check("results (no email): 'could not email' banner", x.includes(FAILED));
  check("results: guide box title and body", x.includes(GUIDE));
  check("results: guide box before 'What Your Results Suggest'", x.indexOf(PATHWAY_GUIDE_TITLE) < x.indexOf("WHAT YOUR RESULTS SUGGEST") || x.indexOf(PATHWAY_GUIDE_TITLE) < x.toUpperCase().lastIndexOf("WHAT YOUR RESULTS SUGGEST"));
  check("results: new disclaimer text", x.includes("For educational purposes only. Not a medical diagnosis. Share these results with your doctor."));
  check("results: no email request made without an email", t.emailRequests === 0);
  await t.evaluate(`document.querySelector('input[type=checkbox]').click(); true`);
  await sleep(200);
  check("results: checkbox ticked is saved for this payment", (await record(t))?.checkbox === true);
  await click(t, "Start Over"); await sleep(200);
  x = await text(t);
  check("Start Over shows confirmation text", x.includes("This deletes your answers and report from this browser. Save your PDF first."));
  await click(t, "Cancel"); await sleep(200);
  x = await text(t);
  check("Cancel hides confirmation and keeps answers", !x.includes("This deletes your answers") && (await t.evaluate(`localStorage.getItem("assessment_state_v2") !== null`)));
  await t.goto(`${base}/assessment/report`, "Save your report now");
  x = await text(t);
  check("report: checkbox already ticked (shared with results page)", await t.evaluate(`document.querySelector('input[type=checkbox]').checked`));
  check("report (no email): 'could not email' banner", x.includes(FAILED));
  check("report: guide box title and body", x.includes(GUIDE));
  check("report: guide box before 'What your results suggest'", x.indexOf(PATHWAY_GUIDE_TITLE) < x.indexOf("What your results suggest"));
  await t.goto(`${base}/assessment/results`, "Save your report now");
  await click(t, "Start Over"); await sleep(200);
  await click(t, "Delete and start over"); await sleep(800);
  check("Delete and start over removes answers and goes to /assessment",
    (await t.evaluate(`localStorage.getItem("assessment_state_v2") === null || JSON.parse(localStorage.getItem("assessment_state_v2")).profile == null`)) &&
    (await t.evaluate(`location.pathname`)) === "/assessment");
  check("Start Over clears the saved checkbox", (await record(t))?.checkbox === false);
  await t.close();
}

// 2. Email succeeds: sent banner with address, marker saved, no second send in a new tab.
{
  const t = await newTab({ status: 200, body: { ok: true, success: true } });
  await seed(t, "test@example.com");
  await t.goto(`${base}/assessment/results`, "We also emailed a copy");
  const x = await text(t);
  check("success: banner shows 'We also emailed a copy to test@example.com.'", x.includes(`${SENT_PREFIX} We also emailed a copy to test@example.com.`));
  check("success: exactly 1 email request", t.emailRequests === 1);
  check("success: marked sent in localStorage", (await record(t))?.email?.status === "sent");
  await t.close();
  const t2 = await newTab({ status: 200, body: { ok: true } });
  await t2.goto(`${base}/assessment/results`, "We also emailed a copy");
  await sleep(1000);
  check("success: new tab does not send again", t2.emailRequests === 0);
  await t2.goto(`${base}/assessment/report`, "We also emailed a copy");
  check("success: report banner shows the sent version", (await text(t2)).includes(`We also emailed a copy to test@example.com.`));
  await t2.close();
}

// 3. Email fails: failed banner, one retry on a later visit, then no more.
{
  const t = await newTab({ status: 502, body: { ok: false, error: "fake failure" } });
  await seed(t, "test@example.com");
  await t.goto(`${base}/assessment/results`, "We could not email your report");
  check("failure: 'could not email' banner", (await text(t)).includes(FAILED));
  check("failure: 1 request, recorded as failed (attempt 1)", t.emailRequests === 1 && (await record(t))?.email?.attempts === 1);
  await t.goto(`${base}/assessment/results`, "We could not email your report");
  await sleep(500);
  check("failure: later visit tries once more (attempt 2)", t.emailRequests === 2 && (await record(t))?.email?.attempts === 2);
  await t.goto(`${base}/assessment/results`, "We could not email your report");
  await sleep(1000);
  check("failure: no third attempt", t.emailRequests === 2);
  await t.close();
}

// 4. /pathways page: guide box replaces the lightbulb note.
{
  const t = await newTab();
  await t.goto(`${base}/pathways/a`, PATHWAY_GUIDE_TITLE);
  const x = await text(t);
  check("/pathways/a: guide box shown", x.includes(GUIDE));
  check("/pathways/a: old lightbulb note gone", !x.includes("represent common clinical situations") && !x.includes("💡"));
  await t.close();
}

const failed = results.filter(([, ok]) => !ok).length;
console.log(`\n${failed ? `${failed} check(s) failed` : `ALL ${results.length} CHECKS PASSED`}`);
process.exit(failed ? 1 : 0);

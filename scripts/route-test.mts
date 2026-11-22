// Route test: loads the REAL customer pages (/assessment/results and /assessment/report) in
// headless Chrome for a few admin sample answers, and checks the pathway text and nose add-on.
// Storage is seeded like a real paid customer with email null, so no email is sent; nothing is clicked,
// so no acknowledgment is logged. Edit CASES below to test other pathways or samples.
//
// How to run (from the repo root, in one terminal):
//   npx vite --port 5199 --strictPort &
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9333 \
//     --user-data-dir=/tmp/route-test-chrome --no-first-run about:blank &
//   npx tsx --tsconfig tsconfig.app.json scripts/route-test.mts http://localhost:5199 9333
// Then stop both background processes (e.g. `kill %1 %2`) and delete /tmp/route-test-chrome.
// Exits with code 1 if any check fails.
import { SAMPLE_ANSWERS } from "../src/lib/admin-sample-answers";
import { NOSE_ADDON, PATHWAY_CONTENT } from "../src/lib/pathway-content";
import { getPathwayDefinition } from "../src/lib/pathways";

const [base, port] = process.argv.slice(2);
const strip = (s: string) => s.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function newTab() {
  const res = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  const { webSocketDebuggerUrl, id } = await res.json();
  const ws = new WebSocket(webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let n = 0;
  const pending = new Map<number, (v: any) => void>();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(String(e.data));
    if (m.id && pending.has(m.id)) { pending.get(m.id)!(m); pending.delete(m.id); }
  });
  const send = (method: string, params: object = {}) =>
    new Promise<any>((r) => { const i = ++n; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
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
  return { send, evaluate, goto, close };
}

const ADDON = Object.values(NOSE_ADDON).map(strip);
type Case = { key: keyof typeof SAMPLE_ANSWERS; pathway: string; addOn: boolean };
const CASES: Case[] = [
  { key: "A_insomnia_nasal", pathway: "A_insomnia", addOn: true },
  { key: "A_insomnia", pathway: "A_insomnia", addOn: false },
  { key: "C_nasal", pathway: "C_nasal", addOn: false },
];

let failures = 0;
for (const c of CASES) {
  for (const route of ["/assessment/results", "/assessment/report"]) {
    const tab = await newTab();
    const checks: [string, boolean][] = [];
    try {
      await tab.send("Page.enable");
      await tab.send("Runtime.enable");
      // Seed storage on the app's origin exactly as a real paid customer would have it.
      await tab.goto(`${base}/`, "");
      await tab.evaluate(`localStorage.clear(); sessionStorage.clear();
        localStorage.setItem("assessment_state_v2", ${JSON.stringify(JSON.stringify(SAMPLE_ANSWERS[c.key]))});
        localStorage.setItem("paid_session_v2", JSON.stringify({ sessionId: "local-test", email: null, paidAt: new Date().toISOString() }));
        true`);
      const title = getPathwayDefinition(c.pathway as any).title;
      const pc = PATHWAY_CONTENT[c.pathway];
      const loaded = await tab.goto(`${base}${route}`, pc.nextSteps.steps.map(strip)[0].slice(0, 30));
      checks.push(["page loaded with pathway content", loaded]);
      const text = strip(await tab.evaluate("document.body.innerText"));
      const icons = await tab.evaluate(`document.querySelectorAll("svg.lucide-wind").length`);
      checks.push([`shows pathway title "${title}"`, text.includes(title)]);
      checks.push([`all pathway next steps present`, pc.nextSteps.steps.every((s) => text.includes(strip(s)))]);
      if (c.addOn) {
        ADDON.forEach((a, i) => checks.push([`add-on item ${i + 1} present`, text.includes(a)]));
        checks.push([`4 airflow icons (found ${icons})`, icons === 4]);
        const steps = pc.nextSteps.steps.map(strip);
        const nose = text.indexOf(ADDON[3]);
        checks.push(["nose step is second-to-last (after step " + (steps.length - 1) + ", before the final step)",
          nose > text.indexOf(steps[steps.length - 2]) && nose < text.indexOf(steps[steps.length - 1])]);
      } else {
        checks.push([`no add-on items`, ADDON.every((a) => !text.includes(a))]);
        checks.push([`no airflow icons (found ${icons})`, icons === 0]);
      }
      if (c.pathway === "C_nasal") {
        for (const s of [pc.subtitle, pc.whyItMatters.intro, pc.whatWorksBest.intro, pc.whatResultsSuggest[1], pc.whyItMatters.points[0], pc.whatWorksBest.options[4]]) {
          checks.push([`new C text: "${strip(s).slice(0, 50)}…"`, text.includes(strip(s))]);
        }
        checks.push(["old C text gone", !text.includes("Optimize Nasal Breathing") && !text.includes("Your self-assessment identified significant nasal factors")]);
      }
    } finally {
      await tab.close();
    }
    const failed = checks.filter(([, ok]) => !ok);
    failures += failed.length;
    console.log(`\n${failed.length ? "FAIL" : "PASS"}  ${c.key}  ${route}`);
    for (const [name, ok] of checks) console.log(`   ${ok ? "ok  " : "FAIL"} ${name}`);
  }
}
console.log(`\n${failures === 0 ? "ALL PASSED" : `${failures} check(s) failed`}`);
process.exit(failures ? 1 : 0);

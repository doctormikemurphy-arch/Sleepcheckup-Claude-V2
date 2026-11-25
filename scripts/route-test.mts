// Route test: loads the REAL customer pages (/assessment/results and /assessment/report) in
// headless Chrome for a few admin sample answers, and checks the pathway text and nose add-on.
// It also checks the free screener results page (/screener/results) zone labels.
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
import { NOSE_ADDON, PATHWAY_CONTENT, D_WEIGHT_BULLET } from "../src/lib/pathway-content";
import { getPathwayDefinition } from "../src/lib/pathways";
import { ZONE_STATUS_EXPLANATION, PALM_STATUS_EXPLANATION, ZONE_STATUS_DESCRIPTION } from "../src/lib/zone-status";

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
  { key: "D_mandible", pathway: "D_mandible", addOn: false },
  { key: "D_mandible_no_bmi", pathway: "D_mandible", addOn: false },
];

// D sample zones: Jaw & Tongue 2/3, Nose 1/5, Neck 1/3, Palate 0/3 (the screener check uses the same answers).
const D_ZONES = [["Nose & Nasal Airway", "Noted"], ["Palate & Tonsils", "Clear"], ["Jaw & Tongue", "Flagged"], ["Neck", "Noted"]] as const;
const DESC = { Flagged: ZONE_STATUS_DESCRIPTION.flagged, Noted: ZONE_STATUS_DESCRIPTION.noted, Clear: ZONE_STATUS_DESCRIPTION.clear };
/** Checks each zone row reads "<zone> <description> <score> <label>". */
function zoneChecks(text: string, checks: [string, boolean][]) {
  for (const [zone, want] of D_ZONES) {
    const i = text.indexOf(`${zone} ${DESC[want]}`);
    const got = i < 0 ? null : (text.slice(i, i + 160).match(/\b(Flagged|Noted|Clear)\b/) ?? [])[1] ?? null;
    checks.push([`zone "${zone}" shows "${DESC[want]}" and ${want} (found ${got})`, got === want]);
  }
  checks.push(["new zone explanation text", text.includes(ZONE_STATUS_EXPLANATION)]);
  checks.push(["old zone explanation gone", !text.includes("Each zone that responds positively")]);
  checks.push(["old zone description lines gone", !text.includes("This area might play a role") && !text.includes("does not clearly stand out")]);
}

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
      if (c.pathway === "D_mandible") {
        for (const s of [pc.subtitle, pc.whyItMatters.intro, pc.whatWorksBest.intro, pc.whatResultsSuggest[3]]) {
          checks.push([`new D text: "${strip(s).slice(0, 50)}…"`, text.includes(strip(s))]);
        }
        checks.push(["old D text gone", !text.includes("Jaw & Tongue Blockage") && !text.includes("Address Jaw & Tongue Factors")]);
        zoneChecks(text, checks);
        checks.push(["new PALM explanation text", text.includes(PALM_STATUS_EXPLANATION)]);
        checks.push(["Step 2 subtitle uses a colon", text.includes("Top-Down Anatomy Self-Check: 4 zones evaluated") && !text.includes("Self-Check —")]);
        const hasBmi = c.key !== "D_mandible_no_bmi";
        checks.push([hasBmi ? "weight bullet shown (BMI entered)" : "weight bullet hidden (no BMI)", text.includes(D_WEIGHT_BULLET) === hasBmi]);
        checks.push(["no allergy specialist link", !text.includes("allergist.aaaai.org") && !text.includes("Find an Allergy Specialist")]);
        for (const url of ["https://www.enthealth.org/find-ent/", "https://www.aadsm.org/find_an_aadsm_qualified_dentis.php", "https://sleepeducation.org/sleep-center/"]) {
          checks.push([`specialist link ${url}`, text.includes(url)]);
        }
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
// Free screener results page, seeded with the D sample's STOP-BANG and zone answers. No email is
// saved, so the page never sends one.
{
  const tab = await newTab();
  const checks: [string, boolean][] = [];
  try {
    await tab.send("Page.enable");
    await tab.send("Runtime.enable");
    await tab.goto(`${base}/`, "");
    const d = SAMPLE_ANSWERS.D_mandible;
    const screener = { step: 7, stopBangAnswers: d.stopBang, zoneAnswers: d.zoneAnswers, profile: null, resumedFromSaved: false };
    await tab.evaluate(`localStorage.clear(); sessionStorage.clear();
      localStorage.setItem("screener_state_v2", ${JSON.stringify(JSON.stringify(screener))}); true`);
    checks.push(["page loaded", await tab.goto(`${base}/screener/results`, "Where Can the Airway Narrow?")]);
    const text = strip(await tab.evaluate("document.body.innerText"));
    zoneChecks(text, checks);
    // Only Jaw & Tongue is Flagged, so the 2+ flagged zones note must not appear.
    checks.push(["no 'flagged N airway zones' note (only 1 zone Flagged)", !/flagged \d+ airway zones/.test(text)]);
  } finally {
    await tab.close();
  }
  const failed = checks.filter(([, ok]) => !ok);
  failures += failed.length;
  console.log(`\n${failed.length ? "FAIL" : "PASS"}  screener (D sample answers)  /screener/results`);
  for (const [name, ok] of checks) console.log(`   ${ok ? "ok  " : "FAIL"} ${name}`);
}

// /pathways/<letter> headings: the last words are in italics, e.g. "Sleep Apnea with *Insomnia*".
{
  const want: Record<string, string> = { a: "Insomnia", b: "Body Weight", c: "Nasal Problem", d: "Tongue and Jaw Problem", e: "Blockage", f: "Breathing Control", g: "Snoring", h: "Multiple Factors" };
  const tab = await newTab();
  const checks: [string, boolean][] = [];
  try {
    await tab.send("Page.enable");
    await tab.send("Runtime.enable");
    for (const [letter, italic] of Object.entries(want)) {
      const id = ({ a: "A_insomnia", b: "B_obesity", c: "C_nasal", d: "D_mandible", e: "E_multilevel", f: "F_physiology", g: "G_low_risk", h: "H_complex" } as const)[letter as "a"];
      const title = getPathwayDefinition(id).title;
      await tab.goto(`${base}/pathways/${letter}`, title);
      const h1 = await tab.evaluate(`JSON.stringify({ text: document.querySelector("h1")?.innerText, em: document.querySelector("h1 em")?.innerText })`);
      const { text, em } = JSON.parse(h1 ?? "{}");
      checks.push([`/pathways/${letter}: "${title}" with "${italic}" in italics (found "${em}")`, strip(text ?? "") === title && em === italic]);
    }
  } finally {
    await tab.close();
  }
  const failed = checks.filter(([, ok]) => !ok);
  failures += failed.length;
  console.log(`\n${failed.length ? "FAIL" : "PASS"}  pathway detail headings`);
  for (const [name, ok] of checks) console.log(`   ${ok ? "ok  " : "FAIL"} ${name}`);
}

console.log(`\n${failures === 0 ? "ALL PASSED" : `${failures} check(s) failed`}`);
process.exit(failures ? 1 : 0);

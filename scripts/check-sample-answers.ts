// Checks that each admin Pathway Preview sample lands on its pathway.
// Run: npx tsx --tsconfig tsconfig.app.json scripts/check-sample-answers.ts
import { PREVIEW_PATHWAYS, SAMPLE_ANSWERS, findSampleMismatches } from "../src/lib/admin-sample-answers";
import { buildAssessmentResult } from "../src/lib/build-assessment-result";

for (const { id, letter, summary } of PREVIEW_PATHWAYS) {
  const { pathway, profile } = buildAssessmentResult(SAMPLE_ANSWERS[id]);
  const ok = pathway === id ? "OK  " : "FAIL";
  console.log(`${ok} ${letter}  expected ${id.padEnd(13)} got ${pathway.padEnd(13)} (STOP-BANG ${profile.stopBangScore}, ISI ${profile.isiScore}, BMI ${profile.bmiValue}) — ${summary}`);
}

const mismatches = findSampleMismatches();
if (mismatches.length > 0) {
  console.error(`\n${mismatches.length} sample(s) do not land on their pathway.`);
  process.exit(1);
}
console.log("\nAll 8 samples land on their pathway.");

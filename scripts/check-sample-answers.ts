// Checks that each admin Pathway Preview sample lands on its pathway, and that the
// nose add-on shows only for the samples meant to have it.
// Run: npx tsx --tsconfig tsconfig.app.json scripts/check-sample-answers.ts
import { PREVIEW_PATHWAYS, checkSample, findSampleMismatches } from "../src/lib/admin-sample-answers";

for (const sample of PREVIEW_PATHWAYS) {
  const { pathway, profile, noseAddOn, ok } = checkSample(sample);
  const addOn = `nose add-on ${noseAddOn ? "yes" : "no "} (expected ${sample.noseAddOn ? "yes" : "no"})`;
  console.log(`${ok ? "OK  " : "FAIL"} ${sample.letter.padEnd(18)} expected ${sample.id.padEnd(13)} got ${pathway.padEnd(13)} ${addOn} (STOP-BANG ${profile.stopBangScore}, ISI ${profile.isiScore}, BMI ${profile.bmiValue}, nose ${profile.anatomy.noseScore}) — ${sample.summary}`);
}

const mismatches = findSampleMismatches();
if (mismatches.length > 0) {
  console.error(`\n${mismatches.length} sample(s) failed the check.`);
  process.exit(1);
}
console.log(`\nAll ${PREVIEW_PATHWAYS.length} samples land on their pathway, with the nose add-on only where expected.`);

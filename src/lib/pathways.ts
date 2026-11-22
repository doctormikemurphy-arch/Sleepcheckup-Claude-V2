import type { PatientProfile, MurphyPathwayId, PathwayDefinition } from "./types";

export const MURPHY_PATHWAYS: PathwayDefinition[] = [
  {
    id: "A_insomnia",
    title: "Sleep Apnea with Insomnia",
    shortDescription: "Addressing your insomnia is a key to successful treatment of your sleep apnea.",
    educationalSummary: `Your assessment shows that difficulty falling asleep, staying asleep, or waking too early is a significant concern for you. This is called **insomnia**, and it can make other sleep problems like sleep apnea feel worse and harder to treat. You are not alone. About **30 to 40%** of sleep apnea patients have insomnia symptoms.

In this situation, breathing problems during sleep and trouble falling or staying asleep are happening together. Poor sleep can make breathing problems feel worse, and breathing problems can keep the brain too alert to sleep well. This creates a cycle where sleep never feels restful. For this reason, both sleep apnea and insomnia need to be treated.

When insomnia and sleep breathing problems occur together, doctors often recommend treating the insomnia at the same time as the sleep apnea. This is because better sleep habits and reduced anxiety about sleep can make it easier to succeed with sleep apnea treatments.

Cognitive Behavioral Therapy for Insomnia (CBT-I) is a proven, effective approach that helps people with insomnia sleep better without medication. It involves changing sleep habits and thoughts about sleep. A sleep specialist or psychologist trained in CBT-I can guide you through this process. Many people find that improving their insomnia helps them feel more ready and able to address their sleep apnea.

Key Concept: If both sleep apnea and insomnia are not treated together, you may continue to have symptoms even if one problem improves.


Your Next Step: See a doctor to talk about the results of this assessment and find out if you have snoring or sleep apnea. This will probably include a sleep study to measure your breathing while you sleep. Make sure your insomnia is also checked and treated, by the same doctor or by someone else. A sleep medicine specialist can treat both problems. Use the Find a Specialist links below to find one near you.`,
  },
  {
    id: "B_obesity",
    title: "Sleep Apnea and Body Weight",
    shortDescription: "Weight and sleep apnea are closely linked, so losing weight can help a lot. That's why most people start with treatments that don't need surgery, like CPAP or an oral appliance, while they work on losing weight.",
    educationalSummary: `Based on the height and weight you entered, your body weight is higher than the healthy range for your height. Doctors check this with a number called **Body Mass Index (BMI)**, which compares your weight to your height. A BMI of 30 or higher, like yours, is called **obesity**. BMI is a helpful estimate, but it is not perfect. For example, people with a lot of muscle can have a high BMI. Your doctor can look at your full picture.

When we gain weight, some of the extra fat goes into the bottom part of the tongue and the area around the throat. This makes the airway smaller when we sleep, so it gets blocked more easily. That is why sleep apnea is so common in people with higher body weight. About **40 to 80% of adults with obesity have sleep apnea**.

Obesity is a medical diagnosis, not a label. Some people find the word hard to hear, but your doctor uses it to help decide which tests and treatments are right for you. Higher body weight can raise your chance of health problems like sleep apnea, type 2 diabetes, and heart disease. **The good news is that weight is something you can change, and losing even some weight can make a big difference in your health.** Today there are many treatments that work well, including newer weight loss medicines called GLP-1 medicines.

Losing weight can help open your airway during sleep and may reduce or even fix sleep apnea. While you work on losing weight, most people also start a sleep apnea treatment that doesn't need surgery. This may be a CPAP machine (which gently blows air through a mask to keep your airway open while you sleep) or an oral appliance (a mouth guard that holds the jaw and tongue forward at night).

Key Concept: Higher body weight can narrow your airway at the tongue and throat and cause sleep apnea. The good news is that weight is something you can change. Get checked for sleep apnea, and if you need treatment, start it while you work on losing weight.


Your Next Step: See a doctor to talk about the results of this assessment and find out if you have snoring or sleep apnea. This will probably include a sleep study to measure your breathing while you sleep. Also ask your doctor about making a plan to lose weight.`,
  },
  {
    id: "C_nasal",
    title: "Sleep Apnea with a Nasal Problem",
    shortDescription: "Fixing your nasal problem is key to treating your sleep apnea successfully.",
    educationalSummary: `Your answers show that you have trouble breathing through your nose at night. When you can't breathe well through your nose, you breathe through your mouth while you sleep. Mouth breathing lets your jaw and tongue fall back, which makes the space in your throat smaller. This can cause snoring or sleep apnea, or make them worse. The "Where Can the Airway Narrow?" section of your results lists the nose questions you answered yes to, which point to the likely cause.

Fixing your nose matters for two reasons. First, your nose is the top of your airway. Sometimes it is the only cause of sleep apnea, and often it is one of several. Second, a clear nose makes common sleep apnea treatments work better and feel more comfortable. These include CPAP (a machine that gently blows air through a mask to keep your airway open while you sleep) and an oral appliance (a mouth guard that holds the jaw and tongue forward at night).

Key Concept: Finding and treating a nasal problem can help fix sleep apnea. It also makes other treatments easier to use and more likely to work.


Your Next Step: See a doctor to talk about the results of this assessment and find out if you have snoring or sleep apnea. This will probably include a sleep study to measure your breathing while you sleep. If you can, also see an ENT (ear, nose, and throat) doctor, who is an expert in finding and treating nasal problems. Use the Find a Specialist links below to find one near you.`,
  },
  {
    id: "D_mandible",
    title: "Sleep Apnea with Jaw & Tongue Blockage",
    shortDescription: "Your jaw and tongue position is likely the main cause of your sleep apnea. An oral appliance or surgery are good treatment options to consider.",
    educationalSummary: `The results of your assessment show that the main problem with your sleep apnea may be the position of your mandible & tongue when you sleep. I tell my patients that your mandible (lower jaw) is a bony box that your tongue must fit inside. If the lower jaw is positioned back or narrow the tongue is pushed back making the space in your throat to breathe smaller causing sleep apnea.

The assessment also shows that you probably breathe okay through your nose when you sleep. In your situation, the most effective treatment for your sleep apnea may be an oral appliance (a device made by a specially trained dentist to keep your lower jaw and tongue forward and your airway open at night while you sleep). Another possible option is surgery. As a surgeon I do not automatically recommend surgery. On the other hand, if surgery can fix a problem, I do not hesitate to consider the option. There are surgical options to treat your blockage at the level of your mandible & tongue.

Key Concept: Your mandible & tongue position is likely the main cause of your sleep apnea. Fixing the position of your mandible & tongue can fix the problem.


Your Next Step: The next step is to see a doctor to discuss the results of this assessment and see if you have snoring or sleep apnea. This will probably include a sleep study to measure your breathing while you sleep. If possible, see an Ear, Nose & Throat (ENT) doctor to confirm that the main problem is the position of your mandible & tongue when you sleep. You can learn about ENT doctors on the American Academy of Otolaryngology – Head & Neck Surgery website (www.entnet.org). You could also see a dentist who specializes in treating sleep apnea with oral appliances. You can learn more about this option from the American Academy of Dental Sleep Medicine website (www.aadsm.org).`,
  },
  {
    id: "E_multilevel",
    title: "Sleep Apnea with Multi-Level Blockage",
    shortDescription: "Many people with sleep apnea have blockage at more than one level of their airway.",
    educationalSummary: `Your self-assessment indicates that more than one area of your airway—such as a combination of nose, palate & tonsil, mandible & tongue, or neck factors—may be involved in your sleep breathing challenges. If you have a problem with the palate & tonsil level, this is a common pathway. This is a very common situation. It is rare that a person with sleep apnea has a problem with only one of the four levels of the airway when they sleep. **Your sleep apnea is coming from multiple places.**

Non-surgery treatments like a CPAP machine (which gently blows air to keep the airway open during sleep) or an oral appliance (a mouth device that holds the jaw and tongue forward to help keep breathing clear at night) can work well even with multiple levels of blockage. There are also surgical procedures to fix each of the levels of blockage.

Key Concept: You have a problem with multiple levels of your airway when you sleep. There is no need to worry because this is a common situation. You can still successfully treat your sleep apnea.


Your Next Step: The next step is to see a doctor to discuss the results of this assessment and see if you have snoring or sleep apnea. This will probably include a sleep study to measure your breathing while you sleep. You will need to see an Ear, Nose & Throat (ENT) doctor for a visit to confirm where your airway problem is located and develop a treatment plan (including surgery if it makes sense to you). You can learn about ENT doctors on the American Academy of Otolaryngology – Head & Neck Surgery website (www.entnet.org).`,
  },
  {
    id: "F_physiology",
    title: "Sleep Apnea with a Breathing Control Problem",
    shortDescription: "You may have a problem with the way your body works at night, not with the structure of your airway.",
    educationalSummary: `Your assessment shows that the main problem with your breathing when you sleep is not the structure of your airway (anatomy) but the way your body works (physiology). This is the situation for about 20% of people with sleep apnea.

The PALM classification helps explain why sleep apnea happens by looking at four things: how narrow the airway is (P for Pcrit), how easily the brain wakes up (A for arousal threshold), how steady the breathing control is (L for loop gain), and how strong the breathing muscles are during sleep (M for muscle responsiveness), so treatment can be better matched to the person. The (P) is for anatomy problems but the other parts (ALM) organize the physiology problems. You answered questions in the PALM Classification section of the assessment.

This is important to understand because knowing that the structure of your airway is not the problem means that procedures or surgery are probably not the best treatment option. This Your Results summary has a PALM Classification section above that lists your responses for each letter. You can see your physiology problem. Treatment can be tailored for your situation.

Key Concept: The cause of your sleep breathing problem is probably the way your body works, not the structure of your airway. For this reason, non-surgery treatment options will probably work best for you.


Your Next Step: The next step is to see a doctor to discuss the results of this assessment and see if you have snoring or sleep apnea. This will probably include a sleep study to measure your breathing while you sleep. You will need to be referred to a sleep medicine specialist who understands sleep physiology to confirm that your sleep apnea is due to a physiology problem and provide treatment based on your situation. You can learn more about sleep medicine specialists on the American Academy of Sleep Medicine website (www.aasm.org).`,
  },
  {
    id: "G_low_risk",
    title: "Low Risk Sleep Apnea or Snoring",
    shortDescription: "Your assessment indicates that you are at low risk for sleep apnea and may just be snoring. THIS DOES NOT MEAN THAT YOU DO NOT HAVE SLEEP APNEA. You still need to be evaluated for sleep apnea.",
    educationalSummary: `Your assessment shows that you are at low risk for sleep apnea and that the main problem with your breathing while you sleep may be snoring. Do not feel bad or discouraged because you are not alone! About 25% of adults snore regularly, meaning they snore most nights. This translates to about 64 million adults snoring regularly in the U.S (given an adult population of ~255 million). WOW.

Snoring is not harmless. Snoring causes events called respiratory arousals (a fancy term for partially waking up) leading to poor quality sleep and stress on the body. This interrupted, poor-quality sleep has been linked to lower performance and with stress in our closest relationships. Snoring can make it harder for us to function well during the day, reflected in:
• Poor Concentration
• Less mental energy
• Slower reflexes
• Fatigue or chronic low energy level
• Reduced commitment to self-care
• Interruptions in memory processing
• Negativity
• Loss of impulse control
• Irritability or short temper
• Increased risk of health problems such as hypertension, prediabetes, weight gain

Following The Murphy Method™ works for people who snore. The Top-Down Approach to Anatomy™ will show you what level or levels of your airway are causing the snoring. This Your Results summary includes an Anatomy Level Assessment section above listing your positive answers for the four levels of anatomy (and the likely cause of the problem).

Following the Fork in the Road Approach to Treatment™ works because the basic treatment decision is still procedures/surgery (depending on the level of the problem) or non-procedure/surgery options. Most of the time people start with the non-procedure/surgery options for treatment. These options include good sleep habits (sleep hygiene), addressing any nasal issues to make sure there is good breathing through the nose, sleeping in certain positions to prevent snoring and possibly an oral appliance if the mandible and tongue position are a problem. These are just a few of the treatment options for snoring.

Key Concept: Your assessment indicates that you are at low risk for sleep apnea and may be snoring instead. THIS DOES NOT MEAN THAT YOU DO NOT HAVE SLEEP APNEA. If you snore loudly and/or have any of the symptoms of snoring listed above, you still need to be evaluated for sleep apnea.


Your Next Step: The next step is to see a doctor to discuss the results of this assessment and see if you have snoring or sleep apnea. This will probably include a sleep study to measure your breathing while you sleep. If possible, see an Ear, Nose & Throat (ENT) doctor who can figure out where your snoring is coming from and help you with a treatment plan. You can learn about ENT doctors on the American Academy of Otolaryngology – Head & Neck Surgery website (www.entnet.org).`,
  },
  {
    id: "H_complex",
    title: "Sleep Apnea with Multiple Factors",
    shortDescription: "Not everyone fits into a nice, clean path. This is not a bad thing. Proceed with evaluation and the same Murphy Method™ principles will direct you to the correct treatment.",
    educationalSummary: `The results of your assessment do not place you in one of the other pathways. This is not unusual. The other pathways are just common scenarios for people with snoring or sleep apnea. For example, you could have sleep apnea with blockage only at the level of your palate & tonsils (this is not as common as the other pathways but still happens). This situation is easily treated.

Key Concept: Just because you do not fit into one of the other pathways, this does not automatically mean that your situation is more serious or difficult to treat. Finding a successful solution to your situation may include seeing several different doctors.


Your Next Step: The next step is to see a doctor to discuss the results of this assessment and see if you have snoring or sleep apnea. This will probably include a sleep study to measure your breathing while you sleep. Seeing several different kinds of doctors will likely be helpful. A sleep medicine specialist who can provide the sleep study and create a treatment plan is a good main option. You can learn more about sleep medicine specialists on the American Academy of Sleep Medicine website (www.aasm.org). An Ear, Nose & Throat (ENT) doctor can help you with the anatomy problems. You can learn about ENT doctors on the American Academy of Otolaryngology – Head & Neck Surgery website (www.entnet.org).`,
  },
];

function anyZoneAtLeast(profile: PatientProfile, n: number): boolean {
  const z = profile.zones || { nose: 0, palate: 0, mandible: 0, neck: 0 };
  return z.nose >= n || z.palate >= n || z.mandible >= n || z.neck >= n;
}

function totalZoneScore(profile: PatientProfile): number {
  const z = profile.zones || { nose: 0, palate: 0, mandible: 0, neck: 0 };
  return z.nose + z.palate + z.mandible + z.neck;
}

export function assignMurphyPathway(profile: PatientProfile): MurphyPathwayId {
  const osaRisk = profile.osaRisk || "low";
  const insomniaSeverity = profile.insomniaSeverity || "none_mild";
  const zones = profile.zones || { nose: 0, palate: 0, mandible: 0, neck: 0 };
  const comorbidities = profile.comorbidities || [];
  const mainComplaint = profile.mainComplaint || "";

  const bmiValue = profile.bmiValue || 0;
  const neckAnatomyScore = profile.anatomy?.neckScore || 0;
  const hasElevatedOsaRisk = osaRisk === "high" || osaRisk === "intermediate";

  // A: OSA with Insomnia - Elevated OSA risk + (ISI >= 15 OR arousal score = 3)
  // Checked FIRST because insomnia makes treatments like CPAP or hypoglossal nerve stimulation harder to tolerate
  // Takes priority over anatomy zones and medical history
  const arousalScore = profile.palm?.arousal?.score || 0;
  const isiScore = profile.isiScore || 0;
  if (hasElevatedOsaRisk && (isiScore >= 15 || arousalScore === 3)) {
    return "A_insomnia";
  }

  // B: OSA with Obesity - BMI >= 30 with intermediate or high OSA risk
  // Note: Neck score is excluded here and only counts toward E multi-level obstruction
  if (hasElevatedOsaRisk && bmiValue >= 30) {
    return "B_obesity";
  }

  // C: OSA with a Nasal Problem - Elevated OSA risk + Nose zone score >= 2
  const noseZoneScore = profile.anatomy?.noseScore || 0;
  if (hasElevatedOsaRisk && noseZoneScore >= 2) {
    return "C_nasal";
  }

  // D: OSA with Mandible & Tongue Obstruction
  // BMI < 30, Elevated OSA risk, Nose < 2, Palate < 2, Mandible >= 2, Neck < 2
  const palateScore = profile.anatomy?.palateScore || 0;
  const mandibleScore = profile.anatomy?.mandibleScore || 0;
  if (
    hasElevatedOsaRisk &&
    bmiValue < 30 &&
    noseZoneScore < 2 &&
    palateScore < 2 &&
    mandibleScore >= 2 &&
    neckAnatomyScore < 2
  ) {
    return "D_mandible";
  }

  // E: OSA with Multiple Level Obstruction
  // Elevated OSA risk + two or more non-nasal anatomy zones with score >= 2
  // Nose excluded so patients with nose >= 2 route to C first; E captures palate/mandible/neck combinations
  const zonesWithHighScore = [
    palateScore >= 2,
    mandibleScore >= 2,
    neckAnatomyScore >= 2,
  ].filter(Boolean).length;
  if (hasElevatedOsaRisk && zonesWithHighScore >= 2) {
    return "E_multilevel";
  }

  // F: OSA with Physiology Problem
  // Elevated OSA risk, all anatomy zones < 2, and at least one PALM score (Arousal/LoopGain/Muscle) >= 2
  const loopGainScore = profile.palm?.loopGain?.score || 0;
  const muscleScore = profile.palm?.muscle?.score || 0;
  const hasPhysiologyFlag = arousalScore >= 2 || loopGainScore >= 2 || muscleScore >= 2;
  const allAnatomyLow = noseZoneScore < 2 && palateScore < 2 && mandibleScore < 2 && neckAnatomyScore < 2;
  if (hasElevatedOsaRisk && allAnatomyLow && hasPhysiologyFlag) {
    return "F_physiology";
  }

  // G: Low Risk OSA or Snoring - low risk with anatomy zone score >= 3
  if (osaRisk === "low" && totalZoneScore(profile) >= 3) {
    return "G_low_risk";
  }

  // G: Low risk default - catch any low-risk cases not matched elsewhere
  if (osaRisk === "low") {
    return "G_low_risk";
  }

  // H: Catch-all for complex cases
  return "H_complex";
}

export function getPathwayDefinition(id: MurphyPathwayId): PathwayDefinition {
  return MURPHY_PATHWAYS.find((p) => p.id === id) || MURPHY_PATHWAYS[MURPHY_PATHWAYS.length - 1];
}

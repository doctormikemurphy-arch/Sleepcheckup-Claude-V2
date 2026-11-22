import type { PatientProfile } from "./types";

export interface PathwayContent {
  pathwayLetter: string;
  title: string;
  subtitle: string;
  whatResultsSuggest: string[];
  whyItMatters: {
    intro: string;
    points: string[];
  };
  whatWorksBest: {
    intro: string;
    options: string[];
  };
  nextSteps: {
    intro: string;
    steps: string[];
  };
  cta: {
    text: string;
    description: string;
  };
}

export const PATHWAY_CONTENT: Record<string, PathwayContent> = {
  A_insomnia: {
    pathwayLetter: "A",
    title: "Sleep Apnea with Insomnia",
    subtitle: "Addressing your insomnia is a key to successful treatment of your sleep apnea",
    whatResultsSuggest: [
      "Your answers show that you are at risk for obstructive sleep apnea. This means your airway narrows or gets blocked while you sleep, so your breathing stops and starts. Over time, this can lead to health problems if it is not treated.",
      "Your answers also show you have trouble sleeping. This is called insomnia. Insomnia means trouble falling asleep, staying asleep, or waking up too early. Some people also wake up very easily during the night.",
      "Having sleep apnea and insomnia together has a name: COMISA (Comorbid Insomnia and Sleep Apnea). \"Comorbid\" means two health problems happening at the same time.",
    ],
    whyItMatters: {
      intro: "Insomnia and sleep apnea feed off each other.",
      points: [
        "Each problem makes the other worse. Breathing problems keep waking up your brain, and poor sleep can make breathing problems worse.",
        "Worrying about sleep adds to the cycle. The more you worry, the harder it is to fall asleep and to use your sleep apnea treatment.",
        "Insomnia makes sleep apnea treatment harder to stick with. A common treatment is CPAP (continuous positive airway pressure). CPAP is a small machine that sends a steady stream of air through a mask while you sleep, so your airway stays open. If you already have trouble falling asleep, getting used to a mask is even harder.",
        "Treating only sleep apnea often does not work, because the insomnia is still there. Both problems need to be treated.",
      ],
    },
    whatWorksBest: {
      intro: "For people with COMISA, treating insomnia and sleep apnea at the same time usually works best.",
      options: [
        "**CBT-I (cognitive behavioral therapy for insomnia).** This is the gold standard, meaning the best proven treatment for insomnia. It does not use medicine. A trained provider helps you change the sleep habits and worried thoughts that keep you awake.",
        "**Good sleep habits (called sleep hygiene).** Go to bed and wake up at the same time every day. Keep your bedroom dark, quiet, and cool.",
        "**Keep using sleep apnea treatment.** Stay with it if you can, even while you work on insomnia. If it's too hard, talk with your doctor about ways to make it easier.",
        "**Sleep medicine for a short time.** Your doctor may suggest a sleep medicine to help while other treatments start to work. Your doctor will choose one that is safe for people with sleep apnea.",
        "**Surgery for sleep apnea.** Some people with insomnia do better with surgery, because they don't have to wear a CPAP mask or an oral appliance (a mouth guard that holds the jaw forward) at night. An ENT (ear, nose, and throat) doctor can tell you if surgery is an option for you.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is your action plan:",
      steps: [
        "**Get a sleep study.** This test measures your breathing while you sleep. It shows if you have sleep apnea and how serious it is. Insurance usually covers a sleep study when your doctor orders it.",
        "**Start sleep apnea treatment and stay with it.** Work with your doctor to choose the right treatment. If insomnia makes treatment hard, tell your doctor. Small changes, like trying a different CPAP mask, can make it easier.",
        "**Ask for a referral to a CBT-I provider at the same time.** CBT-I (cognitive behavioral therapy for insomnia) usually takes 6 to 8 sessions over several weeks.",
        "**Follow your CBT-I plan.** Your provider will help you wake up at the same time every day, spend less time lying in bed awake, and worry less about sleep.",
        "**Keep checking in with your doctor.** As your insomnia gets better, sleep apnea treatment usually gets easier to use.",
      ],
    },
    cta: {
      text: "Treat Insomnia and Sleep Apnea Together",
      description: "People with COMISA do best when both problems are treated at the same time. As your insomnia gets better, sleep apnea treatment usually gets easier.",
    },
  },

  B_obesity: {
    pathwayLetter: "B",
    title: "Sleep Apnea and Body Weight",
    subtitle: "Weight and sleep apnea are closely linked, so losing weight can help a lot. That's why most people start with treatments that don't need surgery, like CPAP or an oral appliance, while they work on losing weight.",
    whatResultsSuggest: [
      "Your answers show that you are at risk for obstructive sleep apnea. This means your airway narrows or gets blocked while you sleep, so your breathing stops and starts. Over time, this can lead to health problems if it is not treated.",
      "Based on the height and weight you entered, your Body Mass Index (BMI) is 30 or higher. Doctors call this obesity.",
      "Extra weight in the tongue and around the throat can narrow your airway. This makes higher body weight one of the most common causes of sleep apnea. Losing weight is one of the biggest steps you can take to help your sleep apnea and your overall health.",
    ],
    whyItMatters: {
      intro: "Sleep apnea and body weight affect each other.",
      points: [
        "Each problem can make the other worse. Extra weight narrows your airway and can cause sleep apnea. Sleep apnea keeps you from getting good, restful sleep, which can make you hungrier, more tired, and less active. That makes it harder to lose weight.",
        "When sleep apnea is not treated, you are fighting your own metabolism (how your body uses food for energy). Untreated sleep apnea can lead to insulin resistance, which means your body has trouble using sugar for energy. Over time, this can lead to weight gain, prediabetes, and type 2 diabetes. Losing weight with untreated sleep apnea is like pushing a rock uphill. You can still do it, but it is much harder. Treating your sleep apnea makes the climb easier.",
        "Losing weight helps, but it often does not fix sleep apnea by itself. Many people have more than one cause, like a blocked nose or a small jaw, so they still need sleep apnea treatment. Surgery is rarely the first choice while you are losing weight. As you lose weight, your doctor may test your sleep again. At that point, more treatment options may make sense, including a procedure or surgery.",
        "Treating your sleep apnea and your weight at the same time works best.",
      ],
    },
    whatWorksBest: {
      intro: "Most people start a sleep apnea treatment that doesn't need surgery and work on losing weight at the same time.",
      options: [
        "**CPAP (continuous positive airway pressure).** This is usually the first choice. Extra weight often narrows the airway low in the throat, below the tongue, and CPAP keeps the whole airway open. It is the most reliable way to treat your sleep apnea while you work on losing weight. CPAP does not have to be a life sentence. After you lose weight, another treatment may be a better fit.",
        "**Oral appliance.** A mouth guard made by a dentist that holds your jaw forward to keep your airway open. It works less well when the narrowing is low in the throat, but it is the best choice without surgery for people who can't use CPAP.",
        "**Medical weight loss program.** A program led by a doctor or care team that gives you a plan, support, and regular check-ins.",
        "**Weight loss medicine.** Tirzepatide (Zepbound) is the first medicine the FDA approved to treat sleep apnea. It is for adults with obesity (a BMI of 30 or higher) who have moderate to severe obstructive sleep apnea on a sleep study. It is used along with healthy eating and more physical activity. In a large study, people who lost weight with this medicine had fewer breathing pauses during sleep. Other GLP-1 type medicines are now being studied for sleep apnea too.",
        "**Weight loss specialists.** An endocrinologist is a doctor who treats weight with medicine and other medical care. A bariatric surgeon is a surgeon who does weight loss surgery for people who need it.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is your action plan:",
      steps: [
        "**Get a sleep study.** This test measures your breathing while you sleep. It shows if you have sleep apnea and how serious it is. It also helps your doctor know if you qualify for some weight loss medicines. Insurance usually covers a sleep study when your doctor orders it.",
        "**Start sleep apnea treatment and stay with it.** Work with your doctor to choose the right treatment. For most people with higher body weight, this is CPAP.",
        "**Make a weight loss plan with your doctor at the same time.** Ask about a medical weight loss program and whether a GLP-1 medicine like tirzepatide (Zepbound) is right for you. Losing 5 to 10% of your body weight can make a real difference.",
        "**Ask about a weight loss specialist if you need more help.** An endocrinologist or a bariatric surgeon can offer more options. Use the Find a Specialist links below to learn about these doctors and find one near you.",
        "**Get a follow-up sleep study after you lose weight.** Your sleep apnea may improve. Your doctor can then decide if you need a different treatment, which could include a procedure or surgery.",
      ],
    },
    cta: {
      text: "Treat Sleep Apnea and Weight Together",
      description: "People with higher body weight do best when they treat their sleep apnea and work on losing weight at the same time. Many people find they have more energy, sleep better, and feel healthier overall.",
    },
  },

  C_nasal: {
    pathwayLetter: "C",
    title: "Sleep Apnea with a Nasal Problem",
    subtitle: "Fixing your nasal problem is key to treating your sleep apnea successfully.",
    whatResultsSuggest: [
      "Your answers show that you are at risk for obstructive sleep apnea. This means your airway narrows or gets blocked while you sleep, so your breathing stops and starts. Over time, this can lead to health problems if it is not treated.",
      "Your answers also show a nasal problem that is likely adding to your sleep apnea.",
      "You answered yes to some questions about your nose in the \"Where Can the Airway Narrow?\" section. Each yes answer points to a possible cause of your nasal problem. Share these answers with your doctor to help you get the right treatment.",
      "Fixing your nose may not cure your sleep apnea (sometimes it does), but it makes other treatments easier to use and more likely to work.",
    ],
    whyItMatters: {
      intro: "Healthy breathing during sleep starts with your nose.",
      points: [
        "When you can't breathe well through your nose, you breathe through your mouth. This narrows your airway and makes snoring and sleep apnea worse.",
        "A nasal problem makes CPAP and oral appliances harder to use. Many people stop using these treatments because their nasal problem was never found or fixed.",
        "The good news is that most nasal problems can be found and treated, with medicine or with a procedure. A big bonus: your nose will also work better during the day.",
      ],
    },
    whatWorksBest: {
      intro: "Don't wait to treat your sleep apnea, and make fixing your nasal problem a priority.",
      options: [
        "**Sleep apnea treatment.** Work with your doctor to start treatment right away. A clear nose makes that treatment easier to use, so work on your nose at the same time.",
        "**ENT (ear, nose, and throat) exam.** An ENT doctor looks inside your nose to find the cause, like a structural problem (something about the shape inside your nose that blocks airflow) or a swollen lining.",
        "**Medicine for your nose.** Nasal steroid sprays like Flonase (fluticasone) or Nasacort (triamcinolone) can calm swelling. Antihistamine pills like Claritin (loratadine), Zyrtec (cetirizine), or Allegra (fexofenadine) can help when allergies are part of the problem. Saline rinses (salt water) clean and clear your nose. Even though you can buy these without a prescription, talk with your doctor before starting any new medicine to make sure it is safe for you.",
        "**Allergies and nose swelling.** When the lining of your nose swells, drains, or makes you sneeze, it is called rhinitis. Most of the time, it is caused by allergies. Your doctor can help you treat it, or you can see an allergy specialist. Use the Find a Specialist links below to find one near you.",
        "**Nasal strips or nasal dilators.** Nasal strips stick across the outside of your nose, like a bandage. Dilators fit just inside your nose. Both help hold your nose open at night. If they help you breathe or sleep better, that is a sign your nose is part of the problem. They can also make sleep apnea treatments like an oral appliance easier to use. They don't fix the cause and are usually not a long-term answer. If they help, see an ENT doctor to find the exact problem.",
        "**Surgery or a procedure.** If you have a structural problem in your nose, a procedure in the office or surgery is usually the best fix. ENT doctors find these problems and do these procedures. Use the Find a Specialist links below to find one near you.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is your action plan:",
      steps: [
        "**Get a sleep study.** This test measures your breathing while you sleep. It shows if you have sleep apnea and how serious it is. Insurance usually covers a sleep study when your doctor orders it.",
        "**Start sleep apnea treatment.** Work with your doctor to choose the right treatment. Don't wait for your nose to be fixed first.",
        "**Try medicine for your nose.** Ask your doctor about a nasal steroid spray, an antihistamine, or saline rinses to see if your breathing gets better. If allergies seem to be part of the problem, ask about allergy testing.",
        "**See an ENT doctor for a nose exam.** Even if medicine helps, an ENT can find the exact cause of your nasal problem, like a structural problem or a swollen lining. They can treat your nose with medicine, or with a procedure or surgery if needed.",
        "**If you use CPAP, ask about a full face mask.** A mask that covers your nose and mouth works better while your nose is being treated. Once your nose is better, a smaller nose mask may be easier to use.",
        "**Check your progress.** After your nose is treated, your doctor may test your sleep again to see how much it helped.",
      ],
    },
    cta: {
      text: "Treat Your Nose and Sleep Apnea Together",
      description: "Many people are surprised how much better they sleep once their nose is treated. It is often the missing piece that helps other treatments work.",
    },
  },

  D_mandible: {
    pathwayLetter: "D",
    title: "Sleep Apnea with Jaw & Tongue Blockage",
    subtitle: "Your jaw and tongue positioning may be contributing to airway blockage during sleep.",
    whatResultsSuggest: [
      "Your answers show that you are at risk for obstructive sleep apnea. This means your airway narrows or gets blocked while you sleep, so your breathing stops and starts. Over time, this can lead to health problems if it is not treated.",
      "Your self-assessment suggests that jaw (mandible) and tongue factors are primary contributors.",
      "Your weight is not elevated, which means anatomical factors rather than obesity are likely driving your sleep breathing issues.",
    ],
    whyItMatters: {
      intro: "Lean patients can absolutely have significant obstructive sleep apnea. When jaw and tongue anatomy are the primary factors, treatment approaches differ from weight-related cases.",
      points: [
        "A smaller or recessed jaw creates less space for the tongue, making airway collapse more likely during sleep.",
        "Tongue position and muscle tone play a major role in keeping the airway open.",
        "CPAP is not always the best first option for anatomy-dominant cases—oral appliances can be highly effective.",
        "Myofunctional therapy (exercises for tongue and throat muscles) can complement other treatments.",
      ],
    },
    whatWorksBest: {
      intro: "People with primary mandible and tongue factors often respond well to treatments that address jaw positioning and muscle tone.",
      options: [
        "Oral appliance therapy—custom-fitted devices that hold the jaw forward during sleep.",
        "Sleep dentist evaluation to assess jaw anatomy and appliance candidacy.",
        "Myofunctional therapy—targeted exercises to strengthen tongue and throat muscles.",
        "Positional therapy if apnea is significantly worse when sleeping on your back.",
        "Follow-up sleep testing to confirm treatment effectiveness.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is a recommended action plan:",
      steps: [
        "Get a sleep study to confirm diagnosis and measure severity.",
        "Request a referral to a sleep dentist or oral medicine specialist.",
        "Discuss oral appliance therapy as a primary or alternative treatment option.",
        "After starting oral appliance treatment, get a follow-up sleep study to verify effectiveness.",
        "If surgery is a possible option get a referral to an ENT specialist and/or Oral Surgeon for evaluation and possible treatment.",
      ],
    },
    cta: {
      text: "Address Jaw & Tongue Factors",
      description: "Oral appliances and targeted therapies can be very effective for this type of sleep apnea. Working with a sleep dentist opens options beyond CPAP.",
    },
  },

  E_multilevel: {
    pathwayLetter: "E",
    title: "Sleep Apnea with Multi-Level Blockage",
    subtitle: "Multiple areas of your airway may be contributing to breathing difficulties during sleep.",
    whatResultsSuggest: [
      "Your answers show that you are at risk for obstructive sleep apnea. This means your airway narrows or gets blocked while you sleep, so your breathing stops and starts. Over time, this can lead to health problems if it is not treated.",
      "Your self-assessment identified two or more anatomical areas (such as palate, tongue, jaw, or neck) that may be contributing to airway obstruction.",
      "Multi-level involvement is common and means that comprehensive treatment planning is important.",
    ],
    whyItMatters: {
      intro: "When multiple levels of the airway are involved, no single treatment is likely to fully resolve the problem. This is why a coordinated approach matters.",
      points: [
        "Single-level treatments often fall short when multiple areas are contributing to obstruction.",
        "Trial-and-error with one treatment at a time leads to frustration and delayed relief.",
        "Combination therapy—addressing multiple levels simultaneously—often produces the best outcomes.",
        "A comprehensive evaluation can identify which areas matter most for your specific situation.",
      ],
    },
    whatWorksBest: {
      intro: "People with multi-level obstruction typically benefit from a comprehensive evaluation and a treatment plan that addresses all contributing areas.",
      options: [
        "Comprehensive ENT airway evaluation including examination of nose, palate, tongue base, and throat.",
        "Combination therapy that may include CPAP, oral appliance, and nasal optimization together.",
        "Staged surgical approaches when appropriate—addressing one level at a time or in combination.",
        "Drug-induced sleep endoscopy (DISE) to visualize where obstruction occurs during simulated sleep.",
        "Regular follow-up and adjustment as treatment progresses.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is a recommended action plan:",
      steps: [
        "Get a diagnostic sleep study to confirm and measure severity.",
        "Request a referral to an ENT or sleep surgeon with expertise in airway evaluation.",
        "Ask about drug-induced sleep endoscopy (DISE) if surgery is being considered.",
        "Work with your sleep team to create a coordinated treatment plan addressing all levels.",
        "Be prepared for a step-by-step approach—multi-level cases often require adjustment over time.",
      ],
    },
    cta: {
      text: "Build a Multi-Level Treatment Plan",
      description: "Multi-level obstruction requires a coordinated approach. Working with specialists who understand the whole airway gives you the best chance of success.",
    },
  },

  F_physiology: {
    pathwayLetter: "F",
    title: "Sleep Apnea with a Breathing Control Problem",
    subtitle: "Your sleep breathing may involve subtle body signals beyond just airway blockage.",
    whatResultsSuggest: [
      "Your answers show that you are at risk for obstructive sleep apnea. This means your airway narrows or gets blocked while you sleep, so your breathing stops and starts. Over time, this can lead to health problems if it is not treated.",
      "Your anatomy scores are relatively low, suggesting that physical airway narrowing may not be the primary issue.",
      "Your responses suggest that physiological factors—like brain signals, arousal patterns, or respiratory control—may be playing a significant role.",
    ],
    whyItMatters: {
      intro: "Not all sleep apnea is caused by a physically blocked airway. Sometimes the brain's control of breathing, arousal patterns, or respiratory drive are the real issues.",
      points: [
        "Some people have airways that look normal but still experience apnea due to how the brain controls breathing during sleep.",
        "Low arousal threshold means waking up too easily, which can fragment sleep and worsen apnea symptoms.",
        "High loop gain means the body over-corrects breathing, creating instability.",
        "Standard CPAP therapy may not work as well for physiology-dominant cases without adjustments.",
      ],
    },
    whatWorksBest: {
      intro: "For people with physiology-dominant sleep apnea, treatment often requires more fine-tuning and specialized approaches.",
      options: [
        "Advanced sleep study interpretation to identify specific physiological traits (phenotyping).",
        "Adaptive PAP therapy (ASV or APAP) that responds to breathing patterns rather than using fixed pressure.",
        "Medication options that can stabilize respiratory drive or raise arousal threshold.",
        "Cognitive behavioral therapy for insomnia (CBT-I) if low arousal threshold is contributing.",
        "Neurology or specialty sleep consultation for complex cases.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is a recommended action plan:",
      steps: [
        "Get a comprehensive sleep study, ideally with advanced physiological analysis.",
        "Ask your sleep specialist about phenotyping—understanding which specific physiological traits apply to you.",
        "Discuss adaptive PAP options if standard CPAP hasn't worked well.",
        "Inquire about medication options that might help stabilize breathing control.",
        "Consider a specialty referral if standard approaches aren't providing relief.",
      ],
    },
    cta: {
      text: "Address Sleep Apnea Physiology",
      description: "Physiology-dominant sleep apnea is real and treatable—it just requires a more personalized approach. The right specialist can help identify what's driving your symptoms.",
    },
  },

  G_low_risk: {
    pathwayLetter: "G",
    title: "Low Risk Sleep Apnea or Snoring",
    subtitle: "Simple lifestyle changes may help reduce snoring and improve your sleep.",
    whatResultsSuggest: [
      "Your screening indicates a lower risk for obstructive sleep apnea compared to other pathways.",
      "Your main concerns may be snoring or mild sleep disruption rather than a more serious breathing disorder.",
      "This is encouraging news—many people in this category can see significant improvement with straightforward lifestyle changes.",
    ],
    whyItMatters: {
      intro: "Not all snoring is sleep apnea, and not everyone who snores needs intensive treatment. Understanding your risk level helps you take appropriate action.",
      points: [
        "Snoring without apnea can still disrupt sleep quality—both yours and your bed partner's.",
        "Lifestyle factors like alcohol, sleep position, and weight often play major roles in simple snoring.",
        "Conservative management is appropriate for low-risk cases and can be very effective.",
        "Monitoring is important—if symptoms worsen or daytime fatigue develops, reassessment may be needed.",
      ],
    },
    whatWorksBest: {
      intro: "For people with low sleep apnea risk, conservative measures often produce meaningful improvement without the need for devices or procedures.",
      options: [
        "Positional therapy—sleeping on your side instead of your back.",
        "Avoiding alcohol close to bedtime (within 3-4 hours of sleep).",
        "Maintaining a healthy weight or losing modest amounts if overweight.",
        "Nasal strips or saline rinses if nasal congestion is a factor.",
        "Establishing a consistent sleep schedule and good sleep environment.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is a recommended action plan:",
      steps: [
        "Try positional therapy: use a body pillow or positional device to stay off your back.",
        "Eliminate alcohol within 3-4 hours of bedtime for 2-4 weeks and assess improvement.",
        "If overweight, target a 5-10% weight reduction as an initial goal.",
        "Optimize your sleep environment: dark, cool, quiet, consistent schedule.",
        "Monitor symptoms—if snoring worsens, daytime fatigue develops, or a bed partner notices breathing pauses, seek evaluation.",
      ],
    },
    cta: {
      text: "Optimize Sleep & Snoring",
      description: "Sometimes simple changes make a big difference. Start with lifestyle modifications and monitor your progress over the coming weeks.",
    },
  },

  H_complex: {
    pathwayLetter: "H",
    title: "Sleep Apnea with Multiple Factors",
    subtitle: "Your situation may benefit from a more in-depth, personalized evaluation.",
    whatResultsSuggest: [
      "Your screening indicates a combination of factors that don't fit neatly into a single category.",
      "This is not unusual—many people have a mix of anatomy, physiology, and sleep quality concerns.",
      "A complex picture doesn't mean poor outcomes—it just means coordinated care is especially important.",
    ],
    whyItMatters: {
      intro: "When multiple factors contribute to sleep-disordered breathing, a one-size-fits-all approach rarely works. Personalized evaluation and treatment planning are essential.",
      points: [
        "Complex cases require looking at all the pieces together, not just one factor in isolation.",
        "A multidisciplinary approach—involving sleep medicine, ENT, and sometimes other specialists—often produces the best results.",
        "Taking time for a thorough evaluation upfront saves frustration and failed treatments later.",
        "Many people with mixed-factor presentations find excellent solutions once they work with the right team.",
      ],
    },
    whatWorksBest: {
      intro: "For people with complex presentations, a comprehensive evaluation is the foundation for building an effective treatment plan.",
      options: [
        "Full sleep specialist workup including detailed history, examination, and comprehensive sleep study.",
        "ENT evaluation to assess anatomical contributors.",
        "Collaboration between sleep medicine and other specialists as needed.",
        "Personalized treatment roadmap that addresses your specific combination of factors.",
        "Longitudinal follow-up to adjust treatment as you respond.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is a recommended action plan:",
      steps: [
        "Schedule a comprehensive evaluation with a sleep medicine specialist.",
        "Be prepared to share your full medical history, medications, and previous sleep-related treatments.",
        "Request coordination between your sleep doctor and any other relevant specialists.",
        "Ask for a written treatment plan that prioritizes your specific factors.",
        "Plan for follow-up assessments to track progress and make adjustments.",
      ],
    },
    cta: {
      text: "Get a Personalized Sleep Strategy",
      description: "Complex cases deserve comprehensive care. The right team can help you navigate your unique combination of factors and find what works.",
    },
  },
};

// ── Nose add-on ──
// Extra text for people with a nasal problem (nose score 2 or more) whose pathway is not C.
// The pathway entries above stay unchanged; getPathwayContent() adds these items on top, so
// the results page, PDF report, email and /pathways page all show the same thing.
export const NOSE_ADDON = {
  results: "Your answers also show a nasal problem, which can make sleep apnea worse and make treatment harder to use. Your yes answers about your nose in the \"Where Can the Airway Narrow?\" section point to possible causes. Share them with your doctor.",
  whyItMatters: "A nasal problem makes you breathe through your mouth at night, which narrows your airway. It also makes CPAP and oral appliances harder to use.",
  whatWorksBest: "**Treating your nose.** Medicine like a nasal steroid spray, an antihistamine, or saline rinses often helps. Talk with your doctor before starting any new medicine. An ENT (ear, nose, and throat) doctor can find the exact cause and treat it, including with a procedure if needed.",
  nextStep: "**Get your nose checked.** Ask your doctor about medicine for your nose, and see an ENT doctor to find the exact cause. A clear nose makes sleep apnea treatment easier to use.",
} as const;

const NOSE_ADDON_TEXTS: ReadonlySet<string> = new Set(Object.values(NOSE_ADDON));

/** True for list items that came from the nose add-on (shown with the airflow icon). */
export function isAddOnItem(text: string): boolean {
  return NOSE_ADDON_TEXTS.has(text);
}

/** Nose add-on applies when the nose score is 2 or more and the pathway is not C. */
export function hasNoseAddOn(pathway: string, profile?: PatientProfile | null): boolean {
  return !!profile && pathway !== "C_nasal" && (profile.anatomy?.noseScore ?? 0) >= 2;
}

/**
 * The content to show for a pathway. Without a profile (or when no add-on applies) this is
 * exactly PATHWAY_CONTENT[pathway]. With the nose add-on, one item is added as the last
 * bullet of each list and as the second-to-last next step.
 */
export function getPathwayContent(pathway: string, profile?: PatientProfile | null): PathwayContent | undefined {
  const base = PATHWAY_CONTENT[pathway];
  if (!base || !hasNoseAddOn(pathway, profile)) return base;
  const steps = base.nextSteps.steps;
  return {
    ...base,
    whatResultsSuggest: [...base.whatResultsSuggest, NOSE_ADDON.results],
    whyItMatters: { ...base.whyItMatters, points: [...base.whyItMatters.points, NOSE_ADDON.whyItMatters] },
    whatWorksBest: { ...base.whatWorksBest, options: [...base.whatWorksBest.options, NOSE_ADDON.whatWorksBest] },
    nextSteps: { ...base.nextSteps, steps: [...steps.slice(0, -1), NOSE_ADDON.nextStep, ...steps.slice(-1)] },
  };
}

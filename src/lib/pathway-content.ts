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
    title: "Pathway A: Sleep Apnea with Insomnia (COMISA)",
    subtitle: "Addressing your insomnia is a key to successful treatment of your sleep apnea",
    whatResultsSuggest: [
      "Your screening indicates an elevated risk for obstructive sleep apnea.",
      "You also have significant insomnia symptoms—difficulty falling asleep, staying asleep, or waking too early.",
      "This combination is called COMISA (Comorbid Insomnia and Sleep Apnea) and requires an integrated treatment approach.",
    ],
    whyItMatters: {
      intro: "When insomnia and sleep apnea occur together, they can make each other worse. Treating only one condition often leads to poor outcomes.",
      points: [
        "Insomnia makes it much harder to adapt to sleep apnea treatments such as CPAP — leading to higher failure rates.",
        "Anxiety about sleep creates a cycle that perpetuates both conditions.",
        "Treating sleep apnea alone often fails in COMISA patients because insomnia persists.",
        "Integrated treatment that addresses both conditions simultaneously produces the best results.",
      ],
    },
    whatWorksBest: {
      intro: "For people with COMISA, the most effective approach often involves treating insomnia first—or at least at the same time as sleep apnea.",
      options: [
        "CBT-I (Cognitive Behavioral Therapy for Insomnia)—the gold-standard, non-medication treatment for insomnia.",
        "Sleep hygiene optimization including consistent sleep schedules and bedroom environment improvements.",
        "Integrated COMISA treatment protocols developed specifically for this combination.",
        "Initiate sleep apnea treatment and take a break if needed until insomnia symptoms improve.",
        "Sleep medication used strategically and temporarily when appropriate.",
        "People with insomnia may benefit from surgical treatment of their sleep apnea, avoiding either CPAP or oral appliance treatment. Make an appointment with an Ear, Nose & Throat Specialist to see if surgery is a treatment option for your sleep apnea.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is a recommended action plan:",
      steps: [
        "Get a sleep study to confirm and measure your sleep apnea severity. Make a plan and start treatment for your sleep apnea. If you are having trouble with treatment because of your insomnia it is okay to take a break and work on treating your insomnia first if your doctor says it is safe to do so.",
        "Ask for a referral to a provider trained in CBT-I (cognitive behavioral therapy for insomnia).",
        "Begin CBT-I treatment—typically 6-8 sessions over several weeks.",
        "Work on sleep hygiene: consistent wake time, limiting time in bed, reducing sleep anxiety.",
        "After insomnia improves, reintroduce sleep apnea treatment with better tolerance.",
      ],
    },
    cta: {
      text: "Treat Insomnia and Apnea Together",
      description: "COMISA requires an integrated approach. Many patients find that once insomnia is addressed, they're much more successful with sleep apnea treatment.",
    },
  },

  B_obesity: {
    pathwayLetter: "B",
    title: "Pathway B: Sleep Apnea with Obesity",
    subtitle: "Obesity and sleep apnea go hand in hand. Treating your body weight/obesity can have a big impact on your sleep apnea. Usually non surgery treatments like CPAP are tried first.",
    whatResultsSuggest: [
      "Your screening indicates an elevated risk for obstructive sleep apnea.",
      "When our bodies put on too much weight, fat is deposited into the bottom of our tongue and the area around our throat. This reduces the size of our airway when we sleep.",
      "A high percentage of people with obesity have sleep apnea. Estimates vary but overall, 40 to 80% of adults with obesity have sleep apnea.",
      "Addressing both your sleep apnea and obesity at the same time is the best way to succeed.",
    ],
    whyItMatters: {
      intro: "Weight and neck anatomy directly influence how easily your airway collapses during sleep. Understanding this connection opens the door to effective treatment strategies.",
      points: [
        "Excess weight, especially around the neck and throat, increases pressure on the airway during sleep.",
        "Treating sleep apnea often improves energy, metabolism, and makes weight management easier.",
        "Weight loss alone rarely fully resolves moderate-to-severe sleep apnea—but it can significantly improve outcomes when combined with other treatments.",
        "Device-based therapies like CPAP and oral appliances are highly effective for this presentation.",
      ],
    },
    whatWorksBest: {
      intro: "People in this category typically benefit from a two-pronged approach: treating the airway directly while also addressing weight factors. Because of the weight factor, surgery is not usually the first line of sleep apnea treatment (but is appropriate in some cases).",
      options: [
        "CPAP (continuous positive airway pressure) is usually the treatment of choice. This is the easiest way to make sure that the sleep apnea is fixed while working on weight loss. CPAP does not have to be a \"life sentence\"! Once the weight loss is obtained other treatment options may be a better choice.",
        "Oral appliance therapy—a CPAP alternative that holds the jaw forward to maintain airway opening.",
        "Structured weight-loss programs with medical support and accountability.",
        "In 2024, the FDA approved a weight-loss medicine called tirzepatide for adults with obesity and obstructive sleep apnea, after the SURMOUNT-OSA study showed that losing weight with this medicine helped people have fewer breathing pauses during sleep.",
        "Medical specialists who treat patients for weight loss include endocrinologists (for medical treatment) and bariatric surgeons (for surgical treatment).",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is a recommended action plan:",
      steps: [
        "Get a sleep study to confirm diagnosis and measure the severity of your sleep apnea.",
        "Meet with a doctor to discuss which sleep apnea treatment option is best for you.",
        "Meet with a doctor to discuss weight loss treatment options including weight loss medication, supervised medical weight-loss programs or consultation with a bariatric specialist.",
        "Because of the close relationship between sleep apnea and body weight, plan for follow-up testing after significant weight loss to reassess your sleep apnea severity.",
      ],
    },
    cta: {
      text: "Start the Airway + Weight Strategy",
      description: "Combining airway treatment with weight management gives you the best chance of success. Many people in this category see dramatic improvements in energy, sleep quality, and overall health.",
    },
  },

  C_nasal: {
    pathwayLetter: "C",
    title: "Pathway C: Sleep Apnea with A Nasal Problem",
    subtitle: "An open nasal airway is essential for successful treatment of your sleep apnea",
    whatResultsSuggest: [
      "Your screening indicates an elevated risk for obstructive sleep apnea.",
      "Your self-assessment identified significant nasal factors that are contributing to your sleep apnea.",
      "Your nasal problem is a key factor in causing your sleep apnea. Fixing your nose may not cure the sleep apnea (sometimes it does) but will make all other treatments easier to handle and more successful.",
    ],
    whyItMatters: {
      intro: "The nose plays a critical role in healthy breathing during sleep. When nasal airflow is compromised, it affects everything downstream.",
      points: [
        "Nasal blockage forces mouth breathing, which destabilizes the airway and worsens both snoring and sleep apnea.",
        "Poor nasal breathing makes both CPAP and Oral Appliance treatments harder to tolerate. Patients often \"fail\" these treatments because their nasal problem is not addressed and fixed.",
        "Fortunately, both medical and surgical nasal problems can be effectively identified and treated. One big bonus - your nose will also work better during the day when you are awake!",
      ],
    },
    whatWorksBest: {
      intro: "For people with significant nasal factors, addressing the nose first—or alongside other treatments—typically produces better outcomes.",
      options: [
        "ENT (Ear, Nose & Throat) evaluation to identify structural and inflammatory causes.",
        "Allergy testing and treatment if allergic rhinitis is contributing.",
        "Medical therapy including nasal steroid sprays, antihistamines, and saline irrigation.",
        "Nasal strips or internal dilators for temporary relief and CPAP optimization.",
        "Surgical options (septoplasty, turbinate reduction) when appropriate.",
      ],
    },
    nextSteps: {
      intro: "Based on your pathway, here is a recommended action plan:",
      steps: [
        "Get a sleep study to confirm diagnosis and measure the severity of your sleep apnea.",
        "Schedule an appointment with an ENT specialist for a nasal evaluation.",
        "Under the direction of your primary care doctor pursue medical treatments for your nose including nasal saline irrigations and over-the-counter nasal sprays (steroids or antihistamines) to see if your symptoms improve.",
        "Get allergy testing if you have seasonal or environmental triggers.",
        "If you are currently using CPAP consider switching to a full mask (that goes over your nose and mouth) so that all the air to keep your airway open is not going only through your nose. Once your nasal problem is fixed it will be easier to use a nasal mask if you continue with CPAP treatment.",
        "After nasal optimization, reassess your sleep breathing to measure improvement.",
      ],
    },
    cta: {
      text: "Optimize Nasal Breathing",
      description: "Many people are surprised how much better they sleep once nasal breathing is optimized. It's often the missing piece that makes other treatments more effective.",
    },
  },

  D_mandible: {
    pathwayLetter: "D",
    title: "Pathway D: Sleep Apnea with Mandible & Tongue Obstruction",
    subtitle: "Your jaw and tongue positioning may be contributing to airway blockage during sleep.",
    whatResultsSuggest: [
      "Your screening indicates an elevated risk for obstructive sleep apnea.",
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
    title: "Pathway E: Sleep Apnea with Multi-Level Obstruction",
    subtitle: "Multiple areas of your airway may be contributing to breathing difficulties during sleep.",
    whatResultsSuggest: [
      "Your screening indicates an elevated risk for obstructive sleep apnea.",
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
    title: "Pathway F: Sleep Apnea with Physiology Problem",
    subtitle: "Your sleep breathing may involve subtle body signals beyond just airway blockage.",
    whatResultsSuggest: [
      "Your screening indicates an elevated risk for obstructive sleep apnea.",
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
    title: "Pathway G: Low Risk Sleep Apnea / Snoring",
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
    title: "Pathway H: Sleep Apnea with Complex / Mixed Factors",
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

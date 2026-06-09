// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT
// Edit text anywhere in this file — pages pull their copy from here.
// ─────────────────────────────────────────────────────────────────────────────

// ── SHARED / REUSED ACROSS PAGES ─────────────────────────────────────────────

export const DR_MURPHY = {
  name: "Michael Murphy, MD, MPH",
  tagline: "Otolaryngology · Sleep Medicine · Stanford Medicine",
  shortBio:
    "Dr. Murphy is a dual board-certified ENT surgeon and Sleep Medicine physician with over 20 years of experience treating snoring and sleep apnea. His rare combination of surgical and non-surgical expertise allows him to see the full picture of sleep-disordered breathing — not just one treatment option.",
  longBio1:
    "Dr. Murphy is a dual board-certified ENT surgeon and Sleep Medicine physician with over 20 years of experience treating snoring and obstructive sleep apnea at Stanford Medicine. His rare combination of surgical and non-surgical expertise allows him to see the full picture of sleep-disordered breathing — not just one treatment option — and to match each patient to the approach most likely to help them specifically.",
  longBio2:
    "After years of watching patients arrive unprepared to their appointments — not knowing what kind of sleep problem they had, what questions to ask, or what treatment paths existed — Dr. Murphy developed The Murphy Method™ to change that. It's the same framework he uses with his own patients, distilled into a structured assessment that anyone can complete in under 20 minutes.",
  quote:
    "I have used The Murphy Method™ every day for years to help my patients with snoring and sleep apnea. I built this so you get the full benefit of an office visit with me — without the visit. The same questions I ask every patient. The same framework. The same clarity.",
  quoteAttribution: "— Michael Murphy, MD, MPH",
  reportQuote:
    "\"If a patient came to their appointment with this report, they would be the most prepared patient I've ever seen.\"",
  stanfordUrl: "https://stanfordhealthcare.org/doctors/m/michael-murphy.html",
  stanfordLinkText: "View Full Profile at Stanford Healthcare",
  credentials: [
    { label: "Medical School", value: "St. Louis University School of Medicine — MD" },
    { label: "Public Health", value: "Masters in Public Health (MPH)" },
    { label: "Residency", value: "University of Washington — Otolaryngology" },
    { label: "Board Certification", value: "Otolaryngology–Head & Neck Surgery" },
    { label: "Board Certification", value: "Sleep Medicine" },
    { label: "Practice", value: "Stanford Healthcare · Palo Alto, CA" },
    { label: "Experience", value: "20+ years treating snoring & sleep apnea" },
    { label: "Patient Rating", value: "4.9/5 · 303 verified ratings" },
  ],
  credentialPills: [
    "Board Certified — Otolaryngology",
    "Board Certified — Sleep Medicine",
    "St. Louis University School of Medicine",
    "University of Washington Residency",
    "4.9/5 · 303 Patient Ratings",
    "Stanford Medicine",
  ],
};

// ── HOME PAGE ─────────────────────────────────────────────────────────────────

export const HOME = {
  // Section 1: Hero
  hero: {
    label: "Murphy Method™",
    headline: "Snoring and Sleep Apnea is not One-Size-Fits-All",
    subtitle: "Let a double board-certified doctor in sleep medicine and ear, nose & throat surgery help you overcome your snoring or sleep apnea.",
    subheadline:
      "For snorers, the chronically exhausted, those told they stop breathing at night, and anyone who gets a sleep apnea warning from their watch or wearable device.",
    ctaButton: "Start Free Screening — 3 Minutes",
    trustLine: "No account required. Created by Michael Murphy, MD, MPH — Stanford Medicine.",

    // Alternate headlines for traffic from specific sources (?src=watch or ?src=snoring)
    variants: {
      watch: {
        headline: "Your Apple Watch Detected Sleep Apnea. Here's What To Do Next.",
        subheadline:
          "Millions of Apple Watch users are getting flagged. A Stanford sleep specialist explains exactly what your next step should be.",
      },
      snoring: {
        headline: "If You Snore, It Could Be More Serious Than You Think.",
        subheadline:
          "Snoring is the #1 symptom of sleep apnea — a condition linked to heart disease, stroke, and diabetes. Find out where you stand in 3 minutes.",
      },
    },
  },

  // Section 2: Social proof stats bar
  stats: [
    { stat: "4.9/5", label: "Patient Rating (303 Reviews)" },
    { stat: "20+", label: "Years Treating Sleep Disorders" },
    { stat: "2x", label: "Board Certified Specialties" },
    { stat: "30M+", label: "Americans Affected by Sleep Apnea" },
  ],

  // Section 3: The Problem
  problem: {
    headline: "Most people with sleep apnea have no idea they have it.",
    body: "An estimated 30 million Americans have obstructive sleep apnea. 80% are undiagnosed. It's not just about snoring — untreated sleep apnea is directly linked to heart disease, stroke, Type 2 diabetes, high blood pressure, and accelerated cognitive decline. The challenge isn't only detecting it. It's knowing what kind you have, what's causing it, and what to actually do about it.",
    bullets: [
      "Linked to heart attack, stroke, and arrhythmia",
      "Associated with memory loss and early dementia",
      "Causes dangerous daytime sleepiness — including while driving",
    ],
    // StoryBrand: Internal problem — the emotional experience
    internalProblem:
      "You have Googled. You may have felt frustrated being handed a number with no explanation. You may be scared — not sure whether this is serious or something you can ignore. That uncertainty is not your fault. The tools that exist were never designed to answer the questions that actually matter.",
  },

  // Section 4: Murphy Method Approach / Pathway cards
  pathways: {
    headline: "Your Situation Is Unique — Your Pathway Should Be Too",
    subheadline:
      "Snoring and sleep apnea aren't one-size-fits-all. The Murphy Method™ Full Assessment identifies 8 distinct pathways based on your symptoms, risk factors and anatomy - so you get guidance that actually fits your situation.",
    card1: {
      title: "Example: Sleep Apnea + Insomnia",
      intro: "When sleep apnea and insomnia overlap, treating one without the other often leads to frustration. This pathway focuses on:",
      bullets: [
        "Understanding how insomnia and apnea reinforce each other",
        "CBT-I and PAP therapy coordination strategies",
        "Questions to ask your sleep specialist about combined treatment",
      ],
    },
    card2: {
      title: "Example: Sleep Apnea + Nasal Problem",
      intro: "A blocked or narrow nose can worsen apnea and make treatments harder to tolerate. This pathway focuses on:",
      bullets: [
        "How nasal obstruction contributes to sleep-disordered breathing",
        "Medical and surgical options for improving nasal airflow",
        "How fixing nasal issues can make non-surgical options like CPAP and oral appliances more successful",
      ],
    },
    footerText:
      "These are two examples. Take the full assessment and be assigned to the correct pathway for your situation.",
    ctaButton: "Take the Full Assessment",
  },

  // Section 5: How It Works — 3 steps
  steps: {
    headline: "Three Steps to Clarity",
    items: [
      {
        num: "1",
        title: "Take the Free Screener",
        sub: "3 minutes · No account needed",
        body: "Answer quick questions about your symptoms, sleep patterns, breathing, and risk factors. Get your risk score and see which airway zones may be involved. Completely free.",
      },
      {
        num: "2",
        title: "Complete the Full Assessment",
        sub: "15–20 minutes · $1 one-time",
        body: "Go deeper with the complete Murphy Method™ protocol — medical history, anatomy, treatment readiness, and clinical scoring. Designed by a Stanford specialist.",
      },
      {
        num: "3",
        title: "Receive Your Personalized Report",
        sub: "Emailed as PDF instantly",
        body: "Get a comprehensive, designed report identifying your exact pathway — with risk scores, treatment options specific to your situation, and a doctor-visit prep sheet.",
      },
    ],
    reportCaption:
      "Your Full Assessment Report includes your Murphy Method™ Pathway, Detailed Assessment Results, Pathway Overview, and Personalized Guide.",
  },

  // Section 6: Pricing
  pricing: {
    headline: "Simple, Transparent Pricing",
    subheadline: "One free screener. One report. No subscriptions, no hidden fees.",
    free: {
      label: "Free Screening",
      price: "$0",
      duration: "3 minutes",
      features: [
        "STOP-BANG sleep apnea risk score",
        "Airway zone self-assessment",
        "Risk level summary (Low / Moderate / High)",
        "See which Murphy Method™ categories apply to you",
      ],
      ctaButton: "Start Free Screening →",
    },
    paid: {
      label: "Full Assessment",
      badge: "RECOMMENDED",
      price: "$79",
      duration: "one-time · no subscription",
      features: [
        "Everything in Free Screening, plus:",
        "Complete pathway assignment (1 of 8 Murphy Method™ pathways)",
        "Full personalized PDF report",
        "Medical history & comorbidity analysis",
        "BMI and physical risk assessment",
        "Treatment options specific to your pathway",
        "Doctor visit prep sheet",
        "Questions to ask your sleep specialist",
        "Emailed to you instantly on completion",
        "My Portal — save results, track retakes & access live pathway resources (free)",
      ],
      ctaButton: "Get My Full Report — $1 →",
    },
  },

  // Section 8: Testimonials
  testimonials: [
    {
      quote:
        "Dr. Murphy was very thorough in explaining all of the issues pertaining to sleep apnea. I came in knowing almost nothing and left with a real plan.",
      date: "February 2025",
    },
    {
      quote:
        "My Apple Watch flagged sleep apnea and I panicked. Dr. Murphy's report gave me immediate clarity on what it meant and exactly what to do next.",
      date: "January 2025",
    },
    {
      quote:
        "After seeing three different doctors over two years, this report finally gave me a clear picture of what's actually happening and why previous treatments failed.",
      date: "March 2025",
    },
    {
      quote:
        "The doctor prep sheet was worth $79 on its own. My ENT said it was the most thorough patient summary she had ever received before an appointment.",
      date: "December 2024",
    },
  ],

  // Section 9: FAQs — trimmed to the 4 questions that remove purchase barriers
  faqs: [
    {
      q: "Is this a medical diagnosis?",
      a: "No. The Murphy Method™ assessment is an educational tool designed to help you understand your situation and prepare for a conversation with your doctor. It does not replace a clinical evaluation. It gives you the knowledge to make that evaluation far more productive.",
    },
    {
      q: "What happens after I pay?",
      a: "You're taken directly to the full 15–20 minute assessment. When you finish, your personalized PDF report is generated immediately and emailed to the address you provided. No login required. No waiting.",
    },
    {
      q: "Is my health information private?",
      a: "Yes. We do not sell, share, or use your health information for any purpose other than generating your report. See our Privacy Policy for full details.",
    },
    {
      q: "Can I get a refund?",
      a: "If you complete the assessment and are not satisfied with your report, contact us within 7 days for a full refund.",
    },
  ],

  // StoryBrand: Philosophical problem statement — used beneath "Different From Every Sleep Tool" heading
  philosophicalStatement:
    "If you have a real health concern, you deserve a real explanation — not a score from 0 to 8 and a referral.",

  // StoryBrand: Transformation / success scene — placed between pricing and Dr. Murphy section
  transformation: {
    headline: "What Changes After Your Assessment",
    intro:
      "Most people walk into their first sleep appointment confused, unprepared, and unsure what to say. Here is what it looks like when you walk in with your Murphy Method™ report instead.",
    outcomes: [
      {
        before: "Before: A number from a quiz",
        after: "You know your pathway — the specific pattern of what is happening in your body and why, not just a risk score.",
      },
      {
        before: "Before: 'See a doctor'",
        after: "You know which type of specialist fits your situation — ENT, sleep medicine, dentist, or a combination — and why.",
      },
      {
        before: "Before: Sitting in silence",
        after: "You arrive with specific, informed questions and understand what the answers mean for your treatment options.",
      },
      {
        before: "Before: Starting from zero",
        after: "Your doctor sees you as one of the most prepared patients they have encountered. Your appointment becomes a real conversation.",
      },
    ],
    closingLine:
      "\"If a patient came to their appointment with this report, they would be in the 99th percentile of prepared patients I've ever seen.\" — Michael Murphy, MD, MPH — Stanford Medicine",
  },

  // Section 10: Final CTA
  finalCta: {
    headline: "Sleep apnea can be treated. The first step is knowing what you're dealing with.",
    subheadline: "Take the free 3-minute screener. No account. No commitment.",
    ctaButton: "Start Free Screening — 3 Minutes",
    ctaSubtext: "No account required. Created by Michael Murphy, MD, MPH.",
  },
};

// ── HOW IT WORKS PAGE ─────────────────────────────────────────────────────────

export const HOW_IT_WORKS = {
  hero: {
    label: "The Process",
    headline: "How The Murphy Method™ Works",
    subheadline:
      "A 20-year clinical methodology, built into a 3-step process that gives you answers — not just a score.",
  },

  freePaid: {
    headline: "Start Free. Go Deeper When You're Ready.",
    free: {
      badge: "Free · 3 minutes",
      title: "Free Screener",
      body: "The free screener covers three validated screening tools: STOP-BANG (obstructive sleep apnea risk), the Insomnia Severity Index, and an airway zone self-check. No account required. You'll see your risk score immediately, along with which anatomical zones are flagged.",
      features: [
        "STOP-BANG sleep apnea risk score",
        "Insomnia severity screening",
        "Airway zone self-assessment",
        "Instant risk level (Low / Moderate / High)",
      ],
      ctaButton: "Start Free Screener →",
    },
    paid: {
      badge: "$1 one-time · 15–20 min",
      title: "Full Assessment",
      body: "The full assessment goes deeper across all six clinical dimensions. Your screener responses carry forward — no need to repeat them. This is where the pathway assignment happens and where your personalized PDF report is generated.",
      features: [
        "All free screener content, plus:",
        "Complete pathway assignment (1 of 8)",
        "Medical history & comorbidity analysis",
        "PLATO-11 treatment readiness",
        "Full personalized PDF report — emailed instantly",
      ],
      ctaButton: "Get My Full Report — $1 →",
    },
  },

  assessmentSections: {
    headline: "What the Full Assessment Covers",
    items: [
      {
        title: "Medical History",
        body: "Reviews 10 conditions directly linked to sleep-disordered breathing — including heart disease, diabetes, and hypertension.",
      },
      {
        title: "BMI & Physical Factors",
        body: "Body composition and neck anatomy are major contributors to airway collapse. This section quantifies your physical risk profile.",
      },
      {
        title: "STOP-BANG Screening",
        body: "The gold-standard clinical screening tool for obstructive sleep apnea, used by physicians worldwide.",
      },
      {
        title: "Insomnia Screening",
        body: "Sleep apnea and insomnia frequently co-exist. Treating one without the other leads to poor outcomes. This section identifies overlap.",
      },
      {
        title: "PLATO-11 Treatment Readiness",
        body: "Assesses which treatment options you're most likely to tolerate and adhere to — a critical factor in treatment success.",
      },
      {
        title: "Airway Zone Assessment",
        body: "Maps which of the 4 anatomical zones of your airway are most likely contributing to your symptoms.",
      },
    ],
  },

  pathwaysSection: {
    headline: "8 Pathways. One That's Yours.",
    body: "The full assessment sorts you into one of 8 clinically distinct pathways. Each pathway has different causes, different treatment options, and a different roadmap. Knowing yours changes everything.",
    footerText: "The full assessment tells you which pathway is yours, what it means, and what to do about it.",
    ctaButton: "Discover My Pathway — $1",
    pathways: [
      "Pathway A: OSA + Insomnia",
      "Pathway B: OSA + Obesity",
      "Pathway C: Nasal Obstruction",
      "Pathway D: Jaw & Tongue Obstruction",
      "Pathway E: Multi-Level Obstruction",
      "Pathway F: Sleep Physiology Problem",
      "Pathway G: Low Risk / Simple Snoring",
      "Pathway H: Complex / Multi-Factor OSA",
    ],
  },

  reportSection: {
    headline: "Inside the Report",
    subheadline:
      "Your $79 report is a personalized, professionally designed PDF that translates your full assessment into something you can read, understand, and hand to any doctor. Most patients arrive at sleep appointments with no information — yours arrives with a complete picture.",
    rows: [
      { title: "Cover Page", body: "Assigned Pathway · Patient Name · Assessment Date" },
      { title: "Your Results", body: "Step 1: How Is the Breathing at Night? — Medical History · BMI · Sleep Apnea Risk (STOP-BANG) · Insomnia Severity (ISI) · Sleep Quality & Daytime Impact (PLATO-11)\nStep 2: Where Can the Airway Narrow? — Nose · Palate & Tonsils · Mandible & Tongue · Neck\nStep 3: Understand the Overall Approach and how the PALM Classification helps — PALM Classification (Airway Narrowing · Arousal Threshold · Loop Gain · Muscle Responsiveness)" },
      { title: "Your Murphy Method™ Assigned Pathway", body: "Key Concept · Pathway Educational Summary" },
      { title: "Your Personalized Guide", body: "What Your Results Suggest · Why This Matters for Your Health · What Usually Works Best" },
      { title: "Your Murphy Method™ Next Steps", body: "Recommended Next Steps · Find a Specialist (pathway-specific specialist directory)" },
      { title: "Back Cover", body: "About The Murphy Method™ · About Dr. Murphy · Medical Disclaimer" },
    ],
  },

  faqs: [
    {
      q: "Is this a medical diagnosis?",
      a: "No. The Murphy Method™ assessment is an educational tool designed to help you understand your situation and prepare for a conversation with your doctor. It does not replace a clinical evaluation. It gives you the knowledge to make that evaluation far more productive.",
    },
    {
      q: "Do I need to create an account?",
      a: "No. The free screener requires no account. After completing the full assessment and paying, your report is emailed directly to the address you provide.",
    },
    {
      q: "How is the pathway assigned?",
      a: "Pathway assignment is based on the combined output of all six assessment sections. The logic was developed by Dr. Murphy based on 20+ years of clinical experience and validated clinical frameworks.",
    },
    {
      q: "Can I bring the report to any doctor?",
      a: "Yes. The report is designed to be useful regardless of which specialist you see — primary care, ENT, sleep medicine, dentist, or pulmonologist.",
    },
    {
      q: "What if I've already been diagnosed with sleep apnea?",
      a: "The full assessment is still valuable. It can help clarify which type you have, whether your current treatment matches your pathway, and what questions to bring to your next appointment.",
    },
    {
      q: "What happens after I pay?",
      a: "You're taken directly to the full 15–20 minute assessment. When you finish, your personalized PDF report is generated immediately and emailed to the address you provided. No login required. No waiting.",
    },
  ],

  finalCta: {
    headline: "Your sleep is affecting everything. Find out why.",
    subheadline: "Take the free 3-minute screener. No account. No commitment.",
    ctaButton: "Start Free Screening — It's Free",
  },
};

// ── ABOUT PAGE ────────────────────────────────────────────────────────────────

export const ABOUT = {
  hero: {
    label: "About the Creator",
  },

  originStory: {
    headline: "Why I Built This",
    paragraphs: [
      "After 20 years in practice, I noticed a consistent pattern: patients were arriving to their appointments completely unprepared. They didn't know what kind of sleep problem they had, what questions to ask, or what treatment paths existed. A 15-minute appointment was being spent on the basics instead of on a real plan.",
      "I developed The Murphy Method™ to change that. The methodology sorts patients into one of 8 distinct pathways based on their anatomy, symptoms, and risk profile — so that by the time they sit down with a specialist, they already understand their situation and can have a real, informed conversation about treatment.",
      "What surprised me was how much difference it made — not just for complex cases, but for every kind of patient. The ones who came in with a clear picture of their situation got better diagnoses, moved through treatment faster, and had far better outcomes.",
      "This tool exists to give every patient that same advantage — regardless of whether they've ever seen a specialist, regardless of whether they can afford multiple appointments to figure out the basics.",
    ],
  },

  methodSection: {
    headline: "About The Murphy Method™",
    paragraphs: [
      "The Murphy Method™ is a clinical framework that categorizes sleep apnea and snoring into 8 distinct pathways based on anatomy, symptoms, medical history, and physiological risk factors. Each pathway corresponds to a specific clinical picture — with targeted treatment options, specialist recommendations, and tailored doctor questions.",
      "The methodology draws on validated clinical instruments including the STOP-BANG questionnaire, the Insomnia Severity Index (ISI), the PLATO-11 treatment readiness scale, and the PALM classification — the same tools used by sleep medicine physicians in clinical practice worldwide.",
      "Murphy Method™ is a trademark of Sleep Check Up, Inc. This assessment is designed for educational and preparation purposes only — it is not a substitute for a clinical evaluation by a qualified healthcare provider.",
    ],
  },

  cta: {
    headline: "Ready to take the first step?",
    subheadline: "The free 3-minute screener takes no account, no login — just answers.",
    ctaButton: "Start Free Screening — 3 Minutes",
  },
};

// ── BLOG ──────────────────────────────────────────────────────────────────────

export const BLOG = {
  hero: {
    label: "Sleep Health Resource",
    headline: "Sleep Health Articles",
    subheadline:
      "Evidence-based information on sleep apnea, snoring, and sleep disorders — written by Dr. Michael Murphy, MD, MPH.",
  },
  ctaBanner: {
    headline: "Not sure if you have sleep apnea?",
    subheadline: "Take the free 3-minute screener designed by Dr. Murphy.",
    ctaButton: "Start Free Screening",
  },
};

// ── NAVIGATION & FOOTER ───────────────────────────────────────────────────────

export const NAV = {
  links: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Dr. Murphy", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  ctaButton: "Start Free Screening",
};

export const FOOTER = {
  tagline: "A clinical sleep assessment tool by Sleep Check Up, Inc. — developed by Michael Murphy, MD, MPH — Stanford Medicine.",
  columns: {
    product: {
      heading: "Product",
      links: [
        { label: "Free Screener", href: "/screener" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Full Assessment — $79", href: "/screener" },
      ],
    },
    company: {
      heading: "Company",
      links: [
        { label: "About Dr. Murphy", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    legal: {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Medical Disclaimer", href: "/disclaimer" },
      ],
    },
  },
  disclaimer:
    "This tool is for educational purposes only and does not constitute a medical diagnosis or treatment recommendation. Always consult a qualified healthcare professional.",
  copyright: `© ${new Date().getFullYear()} Murphy Method™. All rights reserved. A service of Sleep Check Up, Inc.`,
};

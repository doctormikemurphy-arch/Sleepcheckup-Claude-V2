export interface QuestionConfig {
  id: string;
  text: string;
  helpText?: string;
  helpLink?: { text: string; href: string };
}

export interface StopBangQuestionConfig extends QuestionConfig {
  fieldKey: "snoring" | "tired" | "observed" | "pressure" | "bmi" | "age" | "neck" | "gender";
}

export interface IsiQuestionConfig extends QuestionConfig {
  fieldKey: "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7";
  options: { value: number; label: string }[];
}

export const STOP_BANG_QUESTIONS: StopBangQuestionConfig[] = [
  {
    id: "sb1",
    fieldKey: "snoring",
    text: "Do you Snore Loudly (loud enough to be heard through closed doors or your bed-partner elbows you for snoring at night)?",
  },
  {
    id: "sb2",
    fieldKey: "tired",
    text: "Do you often feel Tired, Fatigued, or Sleepy during the daytime (such as falling asleep during driving or talking to someone)?",
  },
  {
    id: "sb3",
    fieldKey: "observed",
    text: "Has anyone Observed you Stop Breathing or Choking/Gasping during your sleep?",
  },
  {
    id: "sb4",
    fieldKey: "pressure",
    text: "Do you have or are being treated for High Blood Pressure?",
  },
  {
    id: "sb5",
    fieldKey: "bmi",
    text: "Is your Body Mass Index more than 35 kg/m\u00B2?",
    helpText: "If unsure, you can calculate your BMI using your height and weight.",
    helpLink: { text: "Calculate your BMI \u2192", href: "https://www.nhlbi.nih.gov/calculate-your-bmi" },
  },
  {
    id: "sb6",
    fieldKey: "age",
    text: "Are you older than 50 years of age?",
  },
  {
    id: "sb7",
    fieldKey: "neck",
    text: "Is your Neck size large? (Measured around Adams apple: Is your shirt collar 16 inches / 40cm or larger?)",
  },
  {
    id: "sb8",
    fieldKey: "gender",
    text: "Is your Gender Male?",
  },
];

export const ISI_QUESTIONS: IsiQuestionConfig[] = [
  {
    id: "isi1",
    fieldKey: "q1",
    text: "Difficulty falling asleep:",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Mild" },
      { value: 2, label: "Moderate" },
      { value: 3, label: "Severe" },
      { value: 4, label: "Very Severe" },
    ],
  },
  {
    id: "isi2",
    fieldKey: "q2",
    text: "Difficulty staying asleep:",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Mild" },
      { value: 2, label: "Moderate" },
      { value: 3, label: "Severe" },
      { value: 4, label: "Very Severe" },
    ],
  },
  {
    id: "isi3",
    fieldKey: "q3",
    text: "Problem waking up too early in the morning:",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Mild" },
      { value: 2, label: "Moderate" },
      { value: 3, label: "Severe" },
      { value: 4, label: "Very Severe" },
    ],
  },
  {
    id: "isi4",
    fieldKey: "q4",
    text: "How SATISFIED/DISSATISFIED are you with your current sleep pattern?",
    options: [
      { value: 0, label: "Very Satisfied" },
      { value: 1, label: "Satisfied" },
      { value: 2, label: "Neutral" },
      { value: 3, label: "Dissatisfied" },
      { value: 4, label: "Very Dissatisfied" },
    ],
  },
  {
    id: "isi5",
    fieldKey: "q5",
    text: "To what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g., daytime fatigue, ability to function at work/daily chores, concentration, memory, mood).",
    options: [
      { value: 0, label: "Not at all Interfering" },
      { value: 1, label: "A Little Interfering" },
      { value: 2, label: "Somewhat Interfering" },
      { value: 3, label: "Much Interfering" },
      { value: 4, label: "Very Much Interfering" },
    ],
  },
  {
    id: "isi6",
    fieldKey: "q6",
    text: "How NOTICEABLE to others do you think your sleeping problem is in terms of impairing the quality of your life?",
    options: [
      { value: 0, label: "Not at all Noticeable" },
      { value: 1, label: "A little Noticeable" },
      { value: 2, label: "Somewhat Noticeable" },
      { value: 3, label: "Much Noticeable" },
      { value: 4, label: "Very Much Noticeable" },
    ],
  },
  {
    id: "isi7",
    fieldKey: "q7",
    text: "How WORRIED/DISTRESSED are you about your current sleep problem?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A Little" },
      { value: 2, label: "Somewhat" },
      { value: 3, label: "Much" },
      { value: 4, label: "Very Much" },
    ],
  },
];

export interface ZoneQuestionConfig {
  zone: "nose" | "palate" | "mandible" | "neck";
  zoneName: string;
  zoneDescription: string;
  questions: {
    id: string;
    fieldKey: "q1" | "q2" | "q3" | "q4" | "q5";
    text: string;
  }[];
}

export const ZONE_QUESTIONS: ZoneQuestionConfig[] = [
  {
    zone: "nose",
    zoneName: "Nose",
    zoneDescription: "The nose is the top level of our airway at night. We are designed to breathe through our nose at night.",
    questions: [
      {
        id: "nose1",
        fieldKey: "q1",
        text: "Do you frequently wake up from sleep (during the night or in the morning) with a blocked nose?",
      },
      {
        id: "nose2",
        fieldKey: "q2",
        text: "Does one side of your nose always feel more blocked than the other, almost like air goes in easily on one side but not on the other (Deviated Nasal Septum)?",
      },
      {
        id: "nose3",
        fieldKey: "q3",
        text: "Do your nose passages feel puffy or swollen inside, especially at night or when lying down (Inferior Turbinate Hypertrophy)?",
      },
      {
        id: "nose4",
        fieldKey: "q4",
        text: "When you breathe in through your nose, does the side of your nose collapse or cave in, making it hard to breathe (Nasal Valve or Lateral Nasal Wall Collapse)?",
      },
      {
        id: "nose5",
        fieldKey: "q5",
        text: "Do you often have a runny or stuffy nose, sneezing or itching that comes and goes over days or weeks (Rhinitis: allergic or non-allergic)?",
      },
    ],
  },
  {
    zone: "palate",
    zoneName: "Palate & Tonsils",
    zoneDescription: "The soft palate and tonsils are in the back of your throat and can narrow your airway.",
    questions: [
      {
        id: "palate1",
        fieldKey: "q1",
        text: "Have you ever looked in your mouth and seen a long thing hanging down in the back, or do you sometimes feel like something touches your tongue or makes you gag when you breathe or sleep (Uvular Enlargement)?",
      },
      {
        id: "palate2",
        fieldKey: "q2",
        text: "When you open your mouth wide and say 'ahh,' does the roof in the back of your mouth look low or thick, or does it feel like it blocks your throat when you lie down (Soft Palate Enlargement)?",
      },
      {
        id: "palate3",
        fieldKey: "q3",
        text: "When you open your mouth, do you see big lumps on the sides of your throat that look like they touch or almost touch in the middle (Tonsillar Enlargement)?",
      },
    ],
  },
  {
    zone: "mandible",
    zoneName: "Mandible & Tongue",
    zoneDescription: "A small or set-back jaw, or a large tongue, can crowd your airway during sleep.",
    questions: [
      {
        id: "mandible1",
        fieldKey: "q1",
        text: "Does your lower jaw look or feel like it sits farther back than your upper jaw, or do your bottom teeth sit behind your top teeth when you bite (Class II Occlusion, Retrognathia or a small/backward lower jaw)?",
      },
      {
        id: "mandible2",
        fieldKey: "q2",
        text: "When you lie on your back, do you ever feel like your tongue falls back and makes it harder to breathe through your mouth or nose (Tongue Blockage)?",
      },
      {
        id: "mandible3",
        fieldKey: "q3",
        text: "Do you sometimes feel like something deep in your throat flops back or makes breathing noisy or harder when you breathe in (Blockage below the tongue)?",
      },
    ],
  },
  {
    zone: "neck",
    zoneName: "Neck",
    zoneDescription: "Extra tissue around the neck can put pressure on the airway when you lie down.",
    questions: [
      {
        id: "neck1",
        fieldKey: "q1",
        text: "Do you feel like your throat is tight or crowded inside, especially when you lie down, or do people say you snore very loudly because your neck area looks thick?",
      },
      {
        id: "neck2",
        fieldKey: "q2",
        text: "Have you gained weight around your neck or chin area recently?",
      },
      {
        id: "neck3",
        fieldKey: "q3",
        text: "Do you feel like your airway closes more when lying on your back?",
      },
    ],
  },
];

export interface PlatoQuestionConfig {
  id: string;
  type: "frequency_day" | "frequency_night" | "rating";
  text: string;
  section: "A" | "B" | "C";
}

export const PLATO_FREQUENCY_OPTIONS_DAY = [
  { value: 0, label: "Never", sublabel: "(0 Days)" },
  { value: 1, label: "Rarely", sublabel: "(1-2 Days)" },
  { value: 2, label: "Sometimes", sublabel: "(3-4 Days)" },
  { value: 3, label: "Often", sublabel: "(5-6 Days)" },
  { value: 4, label: "Always", sublabel: "(Every Day)" },
];

export const PLATO_FREQUENCY_OPTIONS_NIGHT = [
  { value: 0, label: "Never", sublabel: "(0 Nights)" },
  { value: 1, label: "Rarely", sublabel: "(1-2 Nights)" },
  { value: 2, label: "Sometimes", sublabel: "(3-4 Nights)" },
  { value: 3, label: "Often", sublabel: "(5-6 Nights)" },
  { value: 4, label: "Always", sublabel: "(Every Night)" },
];

export const PLATO_SECTION_HEADERS = {
  A: {
    title: "Section A",
    instruction: "In the past 7 days, about how often did you experience the following during the day?",
  },
  B: {
    title: "Section B", 
    instruction: "In the past 7 nights, about how often did you experience the following?",
  },
  C: {
    title: "Section C",
    instruction: "For the following question, please consider your overall sleep experience in the past 7 nights.",
  },
};

export const PLATO_QUESTIONS: PlatoQuestionConfig[] = [
  {
    id: "q1",
    type: "frequency_day",
    section: "A",
    text: "I felt tired",
  },
  {
    id: "q2",
    type: "frequency_day",
    section: "A",
    text: "I felt sleepy",
  },
  {
    id: "q3",
    type: "frequency_day",
    section: "A",
    text: "I felt exhausted",
  },
  {
    id: "q4",
    type: "frequency_day",
    section: "A",
    text: "I felt irritable",
  },
  {
    id: "q5",
    type: "frequency_day",
    section: "A",
    text: "I had morning headaches",
  },
  {
    id: "q6",
    type: "frequency_day",
    section: "A",
    text: "I nodded off in the middle of participating in an activity",
  },
  {
    id: "q7",
    type: "frequency_day",
    section: "A",
    text: "I nodded off when I was sitting quietly",
  },
  {
    id: "q8",
    type: "frequency_day",
    section: "A",
    text: "It was difficult for me to concentrate",
  },
  {
    id: "q9",
    type: "frequency_night",
    section: "B",
    text: "I was told that I snored",
  },
  {
    id: "q10",
    type: "frequency_night",
    section: "B",
    text: "I had difficulty staying asleep",
  },
  {
    id: "q11",
    type: "rating",
    section: "C",
    text: "Thinking about the past 7 nights, how would you rate your sleep quality?",
  },
];

export interface MedicalHistoryQuestionConfig extends QuestionConfig {
  fieldKey: "heartDisease" | "highBloodPressure" | "diabetes" | "stroke" | "asthma" | "anxiety" | "acidReflux" | "thyroidDisorder";
}

// PALM Classification Questions
export interface PalmQuestionConfig {
  id: string;
  fieldKey: "q1" | "q2" | "q3" | "q4";
  text: string;
  isCore?: boolean;  // True for core question, false for supporting
}

export interface PalmSectionConfig {
  section: "pcrit" | "arousal" | "loopGain" | "muscle";
  sectionName: string;
  sectionLetter: string;
  description: string;
  questions: PalmQuestionConfig[];
}

export const PALM_QUESTIONS: PalmSectionConfig[] = [
  {
    section: "pcrit",
    sectionName: "Airway Narrowing (Pcrit)",
    sectionLetter: "P",
    description: "Your airway may be narrow or soft in certain areas, which makes it easier to block off when you sleep",
    questions: [
      {
        id: "pcrit1",
        fieldKey: "q1",
        text: "Does your throat or nose often feel blocked when you lie down?",
        isCore: true,
      },
      {
        id: "pcrit2",
        fieldKey: "q2",
        text: "Do you snore loudly most nights?",
      },
      {
        id: "pcrit3",
        fieldKey: "q3",
        text: "Has someone told you your breathing stops or sounds tight?",
      },
    ],
  },
  {
    section: "arousal",
    sectionName: "Arousal Threshold",
    sectionLetter: "A",
    description: "How easily the brain wakes up during sleep. People with a low arousal threshold wake up too easily.",
    questions: [
      {
        id: "arousal1",
        fieldKey: "q1",
        text: "Are you a very light sleeper who wakes up easily during the night?",
        isCore: true,
      },
      {
        id: "arousal2",
        fieldKey: "q2",
        text: "Do small breathing changes or noises wake you up?",
      },
      {
        id: "arousal3",
        fieldKey: "q3",
        text: "Do you have trouble staying asleep because you wake up many times during the night?",
      },
    ],
  },
  {
    section: "loopGain",
    sectionName: "Loop Gain",
    sectionLetter: "L",
    description: "How steady the breathing control is. High loop gain means the breathing control system is over-reactive, causing unstable breathing.",
    questions: [
      {
        id: "loopGain1",
        fieldKey: "q1",
        text: "Does your breathing at night sometimes go in waves — breathing too much, then too little?",
        isCore: true,
      },
      {
        id: "loopGain2",
        fieldKey: "q2",
        text: "Do you sometimes wake up suddenly feeling like you took a big gasp of air?",
      },
      {
        id: "loopGain3",
        fieldKey: "q3",
        text: "Do you have nights where your breathing feels 'up and down' rather than steady?",
      },
      {
        id: "loopGain4",
        fieldKey: "q4",
        text: "Has anyone said you breathe fast, then slow, during sleep?",
      },
    ],
  },
  {
    section: "muscle",
    sectionName: "Muscle Responsiveness",
    sectionLetter: "M",
    description: "How strong the breathing muscles are during sleep. Poor muscle compensation means the throat muscles don't respond well to keep the airway open.",
    questions: [
      {
        id: "muscle1",
        fieldKey: "q1",
        text: "Does your tongue fall back or block your throat when you lie on your back?",
        isCore: true,
      },
      {
        id: "muscle2",
        fieldKey: "q2",
        text: "Do you snore much more when you sleep on your back?",
      },
      {
        id: "muscle3",
        fieldKey: "q3",
        text: "Do you feel like your throat muscles get tired or weak at night?",
      },
      {
        id: "muscle4",
        fieldKey: "q4",
        text: "Do you wake up choking or gasping when rolled onto your back?",
      },
    ],
  },
];

export interface MedicalHistoryQuestionConfig extends QuestionConfig {
  fieldKey: "heartDisease" | "highBloodPressure" | "diabetes" | "stroke" | "asthma" | "anxiety" | "acidReflux" | "thyroidDisorder";
}

export const MEDICAL_HISTORY_QUESTIONS: MedicalHistoryQuestionConfig[] = [
  {
    id: "mh1",
    fieldKey: "heartDisease",
    text: "Have you been diagnosed with heart disease (e.g., coronary artery disease, heart attack, heart failure, arrhythmia)?",
  },
  {
    id: "mh2",
    fieldKey: "highBloodPressure",
    text: "Do you have high blood pressure (hypertension)?",
  },
  {
    id: "mh3",
    fieldKey: "stroke",
    text: "Have you ever had a stroke or transient ischemic attack (TIA)?",
  },
  {
    id: "mh4",
    fieldKey: "diabetes",
    text: "Have you been diagnosed with prediabetes or Type 2 diabetes?",
  },
  {
    id: "mh5",
    fieldKey: "asthma",
    text: "Do you have trouble thinking clearly or problems with your memory?",
  },
  {
    id: "mh6",
    fieldKey: "anxiety",
    text: "Have been diagnosed with or treated for dementia?",
  },
  {
    id: "mh7",
    fieldKey: "acidReflux",
    text: "Have you had a near accident or accident due to being sleepy?",
  },
  {
    id: "mh8",
    fieldKey: "thyroidDisorder",
    text: "Have you received a message from your watch (Apple or Samsung Galaxy) about having possible sleep apnea and the need to be evaluated by a doctor?",
  },
];

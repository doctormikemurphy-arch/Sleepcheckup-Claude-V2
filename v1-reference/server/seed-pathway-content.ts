import { db } from "./db";
import { pathwayContent } from "@shared/schema";

const seedContent = [
  // Pathway A: OSA with Insomnia
  { pathwayId: "A_insomnia", contentType: "article", title: "Understanding COMISA: When Insomnia and Sleep Apnea Coexist", description: "Learn why treating both insomnia and sleep apnea together leads to better outcomes than addressing either condition alone.", url: "https://www.sleepfoundation.org/insomnia/insomnia-and-sleep-apnea", displayOrder: 1 },
  { pathwayId: "A_insomnia", contentType: "article", title: "Cognitive Behavioral Therapy for Insomnia (CBT-I)", description: "The gold-standard non-medication treatment for insomnia. Learn what CBT-I involves and how to find a trained provider.", url: "https://www.sleepfoundation.org/insomnia/treatment/cognitive-behavioral-therapy-insomnia", displayOrder: 2 },
  { pathwayId: "A_insomnia", contentType: "book", title: "Say Good Night to Insomnia by Gregg D. Jacobs, PhD", description: "A proven program based on CBT-I techniques that helps you overcome insomnia without medication.", url: "https://www.amazon.com/dp/0805089586", displayOrder: 1 },
  { pathwayId: "A_insomnia", contentType: "book", title: "The Insomnia Workbook by Stephanie Silberman, PhD", description: "A comprehensive self-help workbook with CBT-I exercises and sleep improvement strategies.", url: "https://www.amazon.com/dp/1572246359", displayOrder: 2 },
  { pathwayId: "A_insomnia", contentType: "specialist", title: "American Academy of Sleep Medicine – Find a Sleep Center", description: "Locate an accredited sleep center near you staffed with sleep medicine specialists who can evaluate both insomnia and sleep apnea.", url: "https://www.aasm.org", displayOrder: 1 },
  { pathwayId: "A_insomnia", contentType: "specialist", title: "Society of Behavioral Sleep Medicine – Find a Provider", description: "Find a behavioral sleep medicine specialist trained in CBT-I for insomnia treatment.", url: "https://www.behavioralsleep.org", displayOrder: 2 },

  // Pathway B: OSA with Obesity
  { pathwayId: "B_obesity", contentType: "article", title: "Obesity and Obstructive Sleep Apnea: The Connection", description: "Understand how excess weight contributes to airway obstruction during sleep and why weight loss is a key part of OSA treatment.", url: "https://www.sleepfoundation.org/physical-health/obesity-and-sleep", displayOrder: 1 },
  { pathwayId: "B_obesity", contentType: "article", title: "Weight Loss Strategies That Help with Sleep Apnea", description: "Evidence-based approaches to weight management that can reduce OSA severity, including dietary changes and physical activity.", url: "https://www.sleepfoundation.org/sleep-apnea/weight-loss-and-sleep-apnea", displayOrder: 2 },
  { pathwayId: "B_obesity", contentType: "book", title: "CPAP User's Manual by Dr. Edward Grandi", description: "A practical guide to getting the most out of CPAP therapy, with tips for comfort and compliance.", url: "https://www.amazon.com/dp/B08MVYRG8K", displayOrder: 1 },
  { pathwayId: "B_obesity", contentType: "product", title: "CPAP Machines and Supplies", description: "Browse CPAP machines, masks, and accessories from leading manufacturers. A prescription is required.", url: "https://www.cpap.com", displayOrder: 1 },
  { pathwayId: "B_obesity", contentType: "specialist", title: "American Academy of Sleep Medicine", description: "Find a sleep medicine specialist who can evaluate your OSA and help create a treatment plan including CPAP therapy.", url: "https://www.aasm.org", displayOrder: 1 },

  // Pathway C: OSA with Nasal Problem
  { pathwayId: "C_nasal", contentType: "article", title: "How Nasal Obstruction Affects Sleep Breathing", description: "Learn why a blocked nose forces mouth breathing and how this contributes to snoring and sleep apnea.", url: "https://www.entnet.org/content/nose", displayOrder: 1 },
  { pathwayId: "C_nasal", contentType: "article", title: "Nasal Surgery for Sleep Apnea: What to Expect", description: "An overview of common nasal procedures (septoplasty, turbinate reduction) and how they can improve sleep breathing.", url: "https://www.sleepfoundation.org/sleep-apnea/surgery", displayOrder: 2 },
  { pathwayId: "C_nasal", contentType: "product", title: "Breathe Right Nasal Strips", description: "Drug-free nasal strips that open nasal passages to reduce nasal congestion and improve breathing during sleep.", url: "https://www.amazon.com/dp/B001G7QSRG", displayOrder: 1 },
  { pathwayId: "C_nasal", contentType: "product", title: "NeilMed Sinus Rinse Kit", description: "Saline nasal irrigation system for clearing nasal passages and reducing congestion.", url: "https://www.amazon.com/dp/B000RDZFZ0", displayOrder: 2 },
  { pathwayId: "C_nasal", contentType: "specialist", title: "American Academy of Otolaryngology – Find an ENT", description: "Locate an Ear, Nose & Throat surgeon who specializes in diagnosing and treating nasal obstruction.", url: "https://www.entnet.org", displayOrder: 1 },
  { pathwayId: "C_nasal", contentType: "book", title: "The Breathing Cure by Patrick McKeown", description: "Learn breathing techniques that can complement medical treatment for nasal problems and sleep-disordered breathing.", url: "https://www.amazon.com/dp/1630061972", displayOrder: 1 },

  // Pathway D: OSA with Mandible & Tongue Obstruction
  { pathwayId: "D_mandible", contentType: "article", title: "Oral Appliance Therapy for Sleep Apnea", description: "Learn how custom-fitted oral appliances work to keep your jaw and tongue forward, preventing airway collapse during sleep.", url: "https://www.aadsm.org/oral_appliance_therapy.php", displayOrder: 1 },
  { pathwayId: "D_mandible", contentType: "article", title: "Understanding Mandibular Advancement Devices", description: "A detailed look at how mandibular advancement devices (MADs) treat sleep apnea by repositioning the lower jaw.", url: "https://www.sleepfoundation.org/sleep-apnea/oral-appliances", displayOrder: 2 },
  { pathwayId: "D_mandible", contentType: "specialist", title: "American Academy of Dental Sleep Medicine", description: "Find a dentist specializing in oral appliance therapy for the treatment of snoring and obstructive sleep apnea.", url: "https://www.aadsm.org", displayOrder: 1 },
  { pathwayId: "D_mandible", contentType: "specialist", title: "American Academy of Otolaryngology – Find an ENT", description: "Find an ENT surgeon who can confirm that mandible and tongue position is the primary cause of your OSA.", url: "https://www.entnet.org", displayOrder: 2 },
  { pathwayId: "D_mandible", contentType: "book", title: "Jaws: The Story of a Hidden Epidemic by Sandra Kahn & Paul R. Ehrlich", description: "Explores how jaw development affects breathing and sleep, and what can be done about it.", url: "https://www.amazon.com/dp/1503604136", displayOrder: 1 },

  // Pathway E: OSA with Multiple Level Obstruction
  { pathwayId: "E_multilevel", contentType: "article", title: "Multi-Level Airway Obstruction in Sleep Apnea", description: "Understanding why most people with OSA have blockage at more than one level and how this guides treatment decisions.", url: "https://www.sleepfoundation.org/sleep-apnea", displayOrder: 1 },
  { pathwayId: "E_multilevel", contentType: "article", title: "CPAP vs. Surgery: Treatment Options for Complex OSA", description: "Compare non-surgical and surgical approaches when multiple levels of the airway are involved.", url: "https://www.sleepfoundation.org/sleep-apnea/treatment", displayOrder: 2 },
  { pathwayId: "E_multilevel", contentType: "product", title: "CPAP Machines and Supplies", description: "Browse CPAP machines, masks, and accessories. CPAP works well even with multiple levels of obstruction.", url: "https://www.cpap.com", displayOrder: 1 },
  { pathwayId: "E_multilevel", contentType: "specialist", title: "American Academy of Otolaryngology – Find an ENT", description: "Find an ENT surgeon experienced in evaluating and treating multi-level airway obstruction.", url: "https://www.entnet.org", displayOrder: 1 },
  { pathwayId: "E_multilevel", contentType: "specialist", title: "American Academy of Sleep Medicine", description: "Find a sleep medicine specialist for comprehensive evaluation and treatment planning.", url: "https://www.aasm.org", displayOrder: 2 },
  { pathwayId: "E_multilevel", contentType: "book", title: "Sleep Interrupted by Steven Y. Park, MD", description: "An ENT surgeon explains the breathing-sleep connection and treatment options for obstructive sleep apnea.", url: "https://www.amazon.com/dp/0980236401", displayOrder: 1 },

  // Pathway F: OSA with Physiology Problem
  { pathwayId: "F_physiology", contentType: "article", title: "PALM Classification: Understanding the Physiology of Sleep Apnea", description: "Learn about the four physiological traits (Pcrit, Arousal threshold, Loop gain, Muscle responsiveness) that can cause OSA beyond anatomy.", url: "https://www.sleepfoundation.org/sleep-apnea", displayOrder: 1 },
  { pathwayId: "F_physiology", contentType: "article", title: "Non-Surgical Treatments for Physiological OSA", description: "When anatomy isn't the primary problem, targeted non-surgical treatments may be more effective.", url: "https://www.sleepfoundation.org/sleep-apnea/treatment", displayOrder: 2 },
  { pathwayId: "F_physiology", contentType: "specialist", title: "American Academy of Sleep Medicine", description: "Find a sleep medicine specialist who understands sleep physiology and can provide targeted treatment.", url: "https://www.aasm.org", displayOrder: 1 },
  { pathwayId: "F_physiology", contentType: "book", title: "The Sleep Solution by W. Chris Winter, MD", description: "A neurologist and sleep specialist explains the science of sleep and practical solutions for sleep disorders.", url: "https://www.amazon.com/dp/0399583602", displayOrder: 1 },

  // Pathway G: Low Risk OSA or Snoring
  { pathwayId: "G_low_risk", contentType: "article", title: "Snoring: Causes, Risks, and Solutions", description: "Even without sleep apnea, snoring can significantly impact your health and relationships. Learn what causes it and what you can do.", url: "https://www.sleepfoundation.org/snoring", displayOrder: 1 },
  { pathwayId: "G_low_risk", contentType: "article", title: "Sleep Hygiene: Building Better Sleep Habits", description: "Simple lifestyle changes that can reduce snoring and improve overall sleep quality.", url: "https://www.sleepfoundation.org/sleep-hygiene", displayOrder: 2 },
  { pathwayId: "G_low_risk", contentType: "product", title: "Positional Therapy Devices", description: "Devices designed to keep you sleeping on your side, which can significantly reduce snoring.", url: "https://www.amazon.com/s?k=positional+therapy+sleep", displayOrder: 1 },
  { pathwayId: "G_low_risk", contentType: "product", title: "Breathe Right Nasal Strips", description: "Drug-free nasal strips that help open nasal passages for better breathing during sleep.", url: "https://www.amazon.com/dp/B001G7QSRG", displayOrder: 2 },
  { pathwayId: "G_low_risk", contentType: "specialist", title: "American Academy of Otolaryngology – Find an ENT", description: "Even at low risk for OSA, an ENT doctor can help identify the source of your snoring and recommend targeted treatment.", url: "https://www.entnet.org", displayOrder: 1 },
  { pathwayId: "G_low_risk", contentType: "book", title: "The 8-Hour Sleep Paradox by Dr. Mark Burhenne", description: "A holistic guide to understanding how breathing affects sleep quality, with practical tips for improvement.", url: "https://www.amazon.com/dp/1541371968", displayOrder: 1 },

  // Pathway H: OSA with Other Factors
  { pathwayId: "H_complex", contentType: "article", title: "Understanding Complex Sleep Apnea", description: "When your situation doesn't fit a standard pattern, a comprehensive approach with multiple specialists may be needed.", url: "https://www.sleepfoundation.org/sleep-apnea", displayOrder: 1 },
  { pathwayId: "H_complex", contentType: "article", title: "Working with Multiple Sleep Specialists", description: "How to coordinate care between sleep medicine, ENT, and other specialists for the best outcomes.", url: "https://www.sleepfoundation.org/sleep-apnea/treatment", displayOrder: 2 },
  { pathwayId: "H_complex", contentType: "specialist", title: "American Academy of Sleep Medicine", description: "Find a sleep medicine specialist for comprehensive evaluation with a sleep study.", url: "https://www.aasm.org", displayOrder: 1 },
  { pathwayId: "H_complex", contentType: "specialist", title: "American Academy of Otolaryngology – Find an ENT", description: "Find an ENT doctor who can evaluate the anatomical aspects of your sleep breathing challenges.", url: "https://www.entnet.org", displayOrder: 2 },
  { pathwayId: "H_complex", contentType: "book", title: "Sleep Interrupted by Steven Y. Park, MD", description: "An ENT surgeon's comprehensive guide to sleep-disordered breathing and treatment options.", url: "https://www.amazon.com/dp/0980236401", displayOrder: 1 },
];

async function seed() {
  console.log("Seeding pathway content...");

  const existing = await db.select().from(pathwayContent);
  if (existing.length > 0) {
    console.log(`Found ${existing.length} existing content items. Skipping seed.`);
    return;
  }

  for (const item of seedContent) {
    await db.insert(pathwayContent).values(item);
  }

  console.log(`Seeded ${seedContent.length} pathway content items.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });

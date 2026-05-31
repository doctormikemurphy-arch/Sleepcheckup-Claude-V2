# SleepCheckup.com — Full Business Context
*For business planning and strategic analysis*

---

## The One-Line Summary

SleepCheckup.com is a direct-to-consumer pre-visit intelligence platform for snoring and sleep apnea patients — built around the Murphy Method™, a clinical framework developed by Dr. Michael P. Murphy, MD, MPH, a dual board-certified Stanford sleep physician with 20+ years of experience.

---

## The Founder

**Michael P. Murphy, MD, MPH**

- Medical School: St. Louis University School of Medicine
- Public Health: Masters in Public Health (MPH)
- Residency: University of Washington — Otolaryngology (ENT)
- Board Certifications: Otolaryngology–Head & Neck Surgery AND Sleep Medicine (rare dual certification)
- Practice: Stanford Healthcare, Palo Alto, CA
- Experience: 20+ years treating snoring and obstructive sleep apnea
- Patient Rating: 4.9/5 based on 303 verified ratings
- Stanford Profile: stanfordhealthcare.org/doctors/m/michael-murphy.html

**Why he built this:**
After 20 years watching patients arrive completely unprepared to appointments — not knowing what kind of sleep problem they had, what questions to ask, or what treatment paths existed — Dr. Murphy developed the Murphy Method™ to change that. The methodology is the same framework he uses with every patient in his practice, distilled into a structured assessment anyone can complete in under 20 minutes.

His own words:
> "I have used the Murphy Method every day for years to help my patients with snoring and sleep apnea. I built this so you get the full benefit of an office visit with me — without the visit. The same questions I ask every patient. The same framework. The same clarity."

> "If a patient came to their appointment with this report, they would be in the 99th percentile of prepared patients I've ever seen."

---

## The Core Problem Being Solved

**Market size:** ~30 million Americans have obstructive sleep apnea. An estimated 80% are undiagnosed.

**The clinical problem:** Sleep apnea and snoring are not one-size-fits-all conditions. There are 8 clinically distinct patterns — each with different causes, different anatomical contributors, different treatment options, and different specialist needs. The standard of care for most patients is: get a STOP-BANG score (0–8), get told your risk level, get referred to "a doctor." That's it.

**The patient experience problem:**
- Patients Googling symptoms get generic, non-actionable information
- CPAP is often prescribed without matching the patient to their actual pattern
- Patients with failed CPAP treatment have no framework to understand why
- Apple Watch sleep apnea detection (launched ~2024) is creating millions of anxious patients with nowhere to go for intelligent guidance
- Appointment time is wasted on basics — 15 minutes getting up to speed on what a patient should have known before walking in

**The insight:** Patients who arrive to appointments with a clear picture of their situation get better diagnoses, move through treatment faster, and have significantly better outcomes. Dr. Murphy saw this in his own practice consistently.

---

## The Product

### Murphy Method™ — The Clinical Framework

The Murphy Method™ classifies sleep apnea and snoring into **8 distinct pathways** based on anatomy, symptoms, medical history, treatment readiness, and physiological risk factors. The methodology draws on validated clinical instruments:

- **STOP-BANG** — gold-standard OSA screening tool used by physicians worldwide
- **Insomnia Severity Index (ISI)** — screens for co-occurring insomnia (a critical overlap that changes treatment)
- **PLATO-11** — treatment readiness and adherence predictor
- **PALM Classification** — airway Anatomy, arousal threshold (Lowering), loop gain (Loop), muscle responsiveness (Motor) — the same framework used in academic sleep medicine

**The 8 Pathways:**
- **Pathway A:** OSA + Insomnia (COMISA) — treating one without the other fails
- **Pathway B:** OSA + Obesity — weight is the dominant driver
- **Pathway C:** Nasal Obstruction — nasal anatomy is the bottleneck
- **Pathway D:** Jaw & Tongue Obstruction — mandibular/lingual anatomy
- **Pathway E:** Multi-Level Obstruction — multiple anatomical sites involved
- **Pathway F:** Sleep Physiology Problem — central/mixed/arousal threshold issues
- **Pathway G:** Low Risk / Simple Snoring — no significant apnea
- **Pathway H:** Complex / Multi-Factor OSA — multiple contributing factors requiring specialist coordination

---

### The Assessment Flow

**Step 1 — Free Screener (3 minutes, no account required)**
- STOP-BANG questionnaire
- Insomnia Severity Index (basic)
- 4-zone airway self-check (nose, palate/tonsils, jaw/tongue, neck)
- Output: risk level (Low/Moderate/High), airway zones flagged, pathway teaser
- Email capture at results page
- CTA: "Get My Full Report — $79"

**Step 2 — Stripe Payment ($79 one-time)**
- Single Stripe checkout
- No account created, no login required
- Email pre-filled from screener
- Screener responses carry forward — no re-entry

**Step 3 — Full Assessment (15–20 minutes)**
The six clinical sections:
1. Medical History — 10 conditions directly linked to sleep-disordered breathing (heart disease, diabetes, hypertension, etc.)
2. BMI & Physical Factors — body composition, neck anatomy
3. STOP-BANG (carried from screener)
4. Insomnia Screening (ISI — expanded)
5. PLATO-11 Treatment Readiness — which treatments patient will likely tolerate and adhere to
6. Airway Zone Assessment — maps 4 anatomical zones

**Step 4 — Report Delivery**
- Pathway assigned algorithmically based on combined section outputs
- Personalized PDF report generated immediately
- Emailed to patient instantly on completion
- Permanent recovery link (`sleepcheckup.com/report/[token]`) in the email — no login needed, any device
- Optional: set up My Portal for ongoing access, history tracking, pathway resources

---

### The PDF Report — The Core Product

This is the deliverable everything is built around. Professionally designed, 6-page structure:

1. **Cover Page** — Assigned Pathway, patient name, assessment date, Dr. Murphy credentials
2. **Your Results** —
   - *How Is the Breathing at Night?* Medical History · BMI · STOP-BANG · ISI · PLATO-11
   - *Where Can the Airway Narrow?* Nose · Palate & Tonsils · Mandible & Tongue · Neck
   - *Overall Approach* — PALM Classification explained
3. **Your Assigned Pathway** — Key Concept, Pathway Educational Summary
4. **Your Personalized Guide** — What your results suggest, why it matters for your health, what usually works best
5. **Next Steps & Resources** — Murphy Method™ next steps, find a specialist
6. **Back Cover** — About Murphy Method™, about Dr. Murphy, medical disclaimer

The report is explicitly designed to be handed to any doctor — primary care, ENT, sleep medicine, dentist, pulmonologist — and immediately useful.

---

### My Portal (Optional, Post-Payment)

- Offered after payment, before full assessment begins — totally optional, zero friction to report
- Provides: assessment history (all retakes archived chronologically), pathway dashboard, pathway-specific curated resources (videos, articles, products, specialists), profile
- Login via Replit Auth (OAuth — no password creation)
- Unauthenticated visitors to the portal see a demo mode with sample data and login prompt
- Without portal setup: the tokenized email link provides permanent access to the report on any device

---

## Business Model

**Revenue:**
- $79 one-time per full assessment (currently $1 for testing/lean startup validation — will return to $79 at launch)
- No subscriptions, no recurring billing
- No upsells at this time

**Funnel:**
```
Organic/Referral → Free Screener → Email Capture → $79 Assessment → PDF Report → Portal (optional)
```

**Conversion levers:**
- Free screener is genuinely useful (real risk score, real airway zones) — creates real urgency
- Email captured before payment (re-engagement possible)
- No friction: no account creation, no login until post-payment portal option
- The report is positioned as unique, high-value, physician-designed

**Referral channels being developed:**
- Medical colleague referral (ENT, Sleep Medicine, Dental Sleep Medicine)
- Apple Watch sleep apnea notification traffic (`/?ref=watch` landing variant)
- Snoring concern traffic (`/?ref=snoring` landing variant)
- SEO blog content (4 posts planned)

---

## Marketing Assets Built

**Website (sleepcheckup.com):**
- `/` — Home (9-section conversion page with StoryBrand structure)
- `/how-it-works` — Expanded 3-step process with section-by-section breakdown
- `/about` — Full Dr. Murphy biography and methodology origin story
- `/screener` — Free screener (no account)
- `/assessment` — Full assessment wizard (post-payment)
- `/blog` — Blog (SEO-targeted posts planned)
- `/contact`, `/privacy`, `/terms`, `/disclaimer` — Legal/utility

**Rack Card (4×6 print-ready):**
- Available at `/rack-card`
- Front: Brand headline ("Snoring and Sleep Apnea is Not One-Size-Fits-All"), key benefits, QR code
- Back: What's in the full report, how it works, Dr. Murphy credentials, QR code
- Designed for distribution through medical and dental offices

**Peer Referral Email (drafted):**
A short, focused email for medical and dental sleep medicine colleagues to review the site and direct snoring/sleep apnea patients. Emphasizes the comprehensive, practical, pre-visit intelligence approach.

---

## Target Audiences

**Primary (direct consumer):**
1. Adults who snore and have a concerned bed partner
2. Adults who received an Apple Watch sleep apnea notification
3. Adults who are chronically fatigued, wake unrefreshed, or have daytime sleepiness
4. Adults recently diagnosed with sleep apnea who want to understand it better
5. Adults who tried CPAP, failed, and don't know why

**Secondary (referral channel):**
1. ENT physicians
2. Sleep medicine physicians
3. Dental sleep medicine practitioners (oral appliance therapy)
4. Primary care physicians (snoring/apnea complaints are extremely common)
5. Pulmonologists

---

## Competitive Landscape

**What exists today:**
- STOP-BANG calculators (free, generic, give you a number 0–8, no context, no pathway)
- WebMD/Mayo Clinic symptom articles (generic, non-actionable)
- Sleep study ordering (clinical, expensive, slow, requires appointment, gives diagnosis not guidance)
- CPAP companies (SleepScore, ResMed apps — device-centric, not pre-diagnosis)
- Telehealth sleep medicine (Cerebral Sleep, Nox Health — appointment-based, insurance complexity)

**What makes Murphy Method™ different:**
1. The 8-pathway framework — no other consumer tool assigns you to a clinical pattern
2. The pre-visit prep framing — positions the report as preparation for a doctor visit, not a replacement
3. Physician-designed and physician-branded — Dr. Murphy is credible and specific (Stanford, dual board-certified, 303 verified patient ratings)
4. The PLATO-11 inclusion — treatment readiness is not addressed anywhere in consumer tools
5. The PALM classification — clinical-grade framework not found in any consumer product
6. The doctor visit prep sheet — specific questions to ask, tests to request, red flags to mention
7. No login friction before payment — zero barriers in the funnel

---

## Legal and Compliance Positioning

- Explicitly educational, not diagnostic
- "Does not replace a clinical evaluation" language throughout
- Never uses the word "diagnose"
- 7-day refund policy stated in FAQs
- Privacy Policy, Terms of Service, and Medical Disclaimer all live
- Legal entity: Sleep Check Up, Inc.
- Murphy Method™ is a trademark of Sleep Check Up, Inc.

---

## Current Technical State (May 2026)

**What is fully built and live:**
- Complete website with all pages
- Free screener (STOP-BANG + ISI + Airway Zones) — fully functional
- Stripe payment integration ($79 one-time, currently $1 for testing)
- Full assessment wizard (all 6 clinical sections)
- Pathway assignment algorithm (8 pathways)
- PDF report generation (Puppeteer-based, all 8 pathway variants)
- Email delivery (Resend — confirmation + report PDF attachment)
- Tokenized report recovery link (permanent, no login needed)
- My Portal (optional post-payment — assessment history, pathway resources)
- Admin panel (testimonials, subscribers, analytics, site copy editing)
- Pathway-specific resources system (admin-managed per pathway)
- Access control: pathway content gated behind payment

**What is in progress / not yet done:**
- SEO blog content (structure built, 4 posts to be written)
- Professional photography / video for Dr. Murphy
- Paid advertising setup
- Analytics/tracking beyond internal admin panel

**Tech stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn UI
- Backend: Node.js + Express
- Database: PostgreSQL (Neon) + Drizzle ORM
- Payment: Stripe
- Email/PDF: Resend + Puppeteer
- Hosting: Replit (deployed)
- Routing: wouter

---

## Key Metrics / Assumptions for Business Planning

- Price point: $79 (testing at $1, returning to $79 at launch)
- No subscriptions — pure transaction revenue
- Assessment completion time: 15–20 minutes
- Screener: 3 minutes
- PDF delivered: instantly on completion
- Refund window: 7 days
- No insurance involvement — cash pay only
- Primary acquisition: referral (medical/dental colleagues) + organic search + Apple Watch traffic

---

## Brand Voice and Positioning Principles

1. **Meet them emotionally first** — uncertainty and frustration are the dominant patient emotions
2. **Never say "diagnose"** — always "understand your situation," "identify your pattern," "prepare for your appointment"
3. **Stanford as signal, not brag** — mention it, let it do its work, don't repeat it
4. **The PDF is the product** — everything on the site is about earning the right to deliver that report
5. **Credibility is the #1 purchase driver** — Dr. Murphy's credentials are the conversion lever
6. **No friction before payment** — the funnel removes every possible barrier before the Stripe page

---

## What Claude Should Know About the Business Stage

This is a **lean startup / pre-scale** phase:
- Product is fully built and live
- Testing at $1 to validate conversion before returning to $79
- No paid acquisition yet — all traffic is direct/referral
- The founder is a practicing Stanford physician — time is limited
- The goal is to validate the funnel ($79 → report → satisfied patient) before investing in growth
- The referral channel (medical/dental colleagues directing patients) is the primary near-term go-to-market
- The Apple Watch notification audience is a significant near-term opportunity (large, anxious, actively looking for answers)
- Long-term: the platform could expand to portal subscriptions, pathway updates, specialist referral partnerships, or employer/insurance partnerships

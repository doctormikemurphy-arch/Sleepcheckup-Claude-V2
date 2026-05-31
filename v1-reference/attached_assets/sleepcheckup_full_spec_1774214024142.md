# SleepCheckup.com — Complete Build Specification
**This document supersedes all previous briefs. Build exactly what is described here. Do not carry over any structure, navigation, or logic from the existing site unless explicitly stated.**

---

## GROUND RULES FOR THE BUILD

1. This is NOT a SaaS app. There are no user accounts, no login, no portal, no dashboard. Remove all of that entirely.
2. There are exactly 5 pages: Home, How It Works, About Dr. Murphy, Blog Index, and Blog Post template.
3. There are 2 functional flows: Free Screener and Full Assessment (post-payment).
4. The only nav items are: Logo | Home | How It Works | About Dr. Murphy | [Start Free Screening] button.
5. The price ($79) is shown publicly on the homepage. Never hide it.
6. No user ever creates a password. Email address is the only identifier, captured once at the end of the free screener.

---

## GLOBAL ELEMENTS (appear on every page)

### Navigation Bar
- Position: fixed to top of viewport, full width, stays visible on scroll
- Background: white with a subtle 1px bottom border in light gray (#E5E7EB)
- Height: 64px desktop, 56px mobile
- Left side: Logo — the owl/moon icon + "sleepcheckup.com" wordmark in dark navy (#0F172A), same as existing logo
- Center (desktop only): three text links — "Home", "How It Works", "About Dr. Murphy"
  - Font: medium weight, 15px, dark gray (#374151)
  - On hover: color changes to dark navy (#0F172A), no underline
  - Active page link: dark navy, slightly heavier weight
- Right side: one button — "Start Free Screening"
  - Background: dark navy (#0F172A)
  - Text: white, 14px, medium weight
  - Padding: 10px 20px
  - Border radius: 6px
  - On hover: background lightens slightly to (#1E293B)
- Mobile: hamburger menu icon on right. Clicking opens a full-width dropdown showing all three nav links stacked vertically, then the "Start Free Screening" button full-width at the bottom. Background white. Close on tap outside.
- NO "Log In" link. NO "My Portal" link. NO "Explore Pathways" link. These do not exist anywhere on the site.

### Footer
- Background: dark navy (#0F172A)
- Text color: light gray (#9CA3AF)
- Three columns on desktop, stacked on mobile:
  - Column 1: Logo (white version) + one-line description: "Personalized sleep apnea assessment by Dr. Michael P. Murphy, MD, MPH — Stanford Medicine."
  - Column 2: Links — Home, How It Works, About Dr. Murphy, Blog, Start Free Screening
  - Column 3: Text block — "Murphy Method™ is a trademark of Dr. Michael P. Murphy. This tool is for educational purposes only and does not constitute medical advice or diagnosis."
- Bottom bar: thin line separator, then: "© 2026 SleepCheckup.com. All rights reserved." on left, "Privacy Policy | Terms of Use" links on right (these pages can be simple placeholder pages for now)
- No social media icons at MVP

---

## PAGE 1: HOME

URL: / (root)
Meta title: "Sleep Apnea Assessment by a Stanford Specialist | SleepCheckup.com"
Meta description: "Find out exactly which of 8 sleep apnea pathways applies to you. Free 3-minute screener designed by Dr. Michael Murphy, dual board-certified Stanford sleep physician."

### Section 1: Hero
- Full-width section, minimum height 92vh (nearly full screen on load)
- Background: the existing dark bedroom photo with a dark overlay (rgba 0,0,0,0.55) so text is clearly readable
- All content centered horizontally, vertically centered in the section
- Content stack from top to bottom:
  1. Small uppercase label above headline: "MURPHY METHOD™" — white, 12px, letter-spacing 0.15em, with a thin horizontal line on each side (decorative)
  2. Main headline: "Find Out Exactly What's Causing Your Sleep Problems — And What Can Fix Them"
     - White text
     - Desktop: 52px, bold weight
     - Mobile: 32px, bold weight
     - Line height: 1.15
     - Max width: 780px
  3. Subheadline (16px, white at 85% opacity, max width 560px, margin top 20px): "Take the free 3-minute screening designed by a Stanford sleep specialist. Get real answers — not generic advice."
  4. CTA button (margin top 32px): "Start Free Screening — 3 Minutes"
     - Background: #2563EB (bright blue, stands out against dark hero)
     - Text: white, 16px, semibold
     - Padding: 14px 32px
     - Border radius: 8px
     - On hover: background darkens to #1D4ED8, slight upward translateY(1px) transform
  5. Trust line below button (margin top 16px): white text at 70% opacity, 13px — "No account required. Created by Dr. Michael Murphy, MD, MPH — Stanford Medicine."
- URL parameter logic: if URL contains ?src=watch, the headline changes to: "Your Apple Watch Detected Sleep Apnea. Here's What To Do Next." — subheadline changes to: "Millions of Apple Watch users are getting flagged. A Stanford sleep specialist explains exactly what your next step should be." — everything else stays the same.
- If URL contains ?src=snoring, headline changes to: "If You Snore, It Could Be More Serious Than You Think." — subheadline: "Snoring is the #1 symptom of sleep apnea — a condition linked to heart disease, stroke, and diabetes. Find out where you stand in 3 minutes."

### Section 2: Social Proof Bar
- Immediately below hero, full width
- Background: white
- Padding: 24px 0
- A single horizontal row of 4 stat blocks, evenly spaced, centered
- On mobile: 2x2 grid
- Each stat block:
  - Large number or rating in dark navy, 24px bold: "4.9/5" | "20+" | "2x" | "30M+"
  - Small label below in gray (#6B7280), 13px: "Patient Rating (303 Reviews)" | "Years Treating Sleep Disorders" | "Board Certified Specialties" | "Americans Affected by Sleep Apnea"
- Thin 1px gray border on top and bottom of this section to separate it cleanly

### Section 3: The Problem
- Background: very light gray (#F9FAFB)
- Padding: 80px 0
- Max content width: 720px, centered
- Headline (centered, dark navy, 36px bold): "Most people with sleep apnea have no idea they have it."
- Body paragraph below (centered, #4B5563, 17px, line height 1.7): "An estimated 30 million Americans have obstructive sleep apnea. 80% are undiagnosed. It's not just about snoring — untreated sleep apnea is directly linked to heart disease, stroke, Type 2 diabetes, high blood pressure, and accelerated cognitive decline. The challenge isn't only detecting it. It's knowing what kind you have, what's causing it, and what to actually do about it."
- Below paragraph: three horizontal icon + text rows (not bullet points — each on its own line with an icon to the left):
  - ❤️ "Linked to heart attack, stroke, and arrhythmia"
  - 🧠 "Associated with memory loss and early dementia"
  - 😴 "Causes dangerous daytime sleepiness — including while driving"
- Each row: icon on left, text on right, 16px, #374151
- Bottom of section: no CTA here — let the user read first

### Section 4: The Murphy Method™ Approach (Methodology Teaser)
- Background: white
- Padding: 80px 0
- Two-column layout on desktop (text left, visual right), single column on mobile
- LEFT COLUMN:
  - Small label: "THE MURPHY METHOD™" — same style as hero label, dark navy
  - Headline (dark navy, 36px bold, max width 480px): "Your Situation Is Unique. Your Pathway Should Be Too."
  - Body text (17px, #4B5563, line height 1.7): "Most sleep resources give you a risk score and send you to your doctor. That's not enough. The Murphy Method™ — developed over 20 years of treating thousands of patients — identifies exactly which of 8 distinct pathways applies to your anatomy, symptoms, and risk factors. Each pathway has different causes, different treatment options, and a different roadmap. Knowing yours changes everything."
  - Below body: two example pathway cards stacked:
    - Card 1: thin border, rounded corners (8px), padding 20px
      - Title (dark navy, 15px semibold): "Example: Sleep Apnea + Nasal Obstruction"
      - Body (13px, #6B7280): "A blocked or narrow nose can worsen apnea and make treatments like CPAP harder to tolerate. This pathway identifies the nasal contribution and focuses treatment accordingly."
    - Card 2: same styling
      - Title: "Example: Sleep Apnea + Insomnia Overlap"
      - Body: "When apnea and insomnia overlap, treating one without the other leads to frustration. This pathway addresses both conditions in a coordinated way."
  - Below cards: italic note in gray (14px): "These are 2 of 8 pathways. The full assessment identifies exactly which one is yours."
- RIGHT COLUMN:
  - The existing airway diagram showing the top-to-bottom airway zones (Nose → Palate & Tonsils → Tongue Base → Lower Throat) — keep this visual, it works well
  - Below diagram: simple label "The Murphy Method™ evaluates all 4 airway zones — not just one."

### Section 5: How It Works
- Background: very light gray (#F9FAFB)
- Padding: 80px 0
- Centered headline (dark navy, 36px bold): "Three Steps to Clarity"
- Three cards in a horizontal row on desktop, stacked on mobile
- Each card: white background, subtle shadow, rounded corners (12px), padding 32px, centered content
  - CARD 1:
    - Step number circle: dark navy circle with white "1" inside, 40px diameter
    - Title (dark navy, 20px semibold, margin top 16px): "Take the Free Screener"
    - Subtitle (blue, 13px): "3 minutes · No account needed"
    - Body (14px, #6B7280, line height 1.6): "Answer quick questions about your symptoms, sleep patterns, breathing, and risk factors. Get your risk score and see which airway zones may be involved. Completely free."
  - CARD 2:
    - Step number circle: bright blue (#2563EB) with white "2"
    - Title: "Complete the Full Assessment"
    - Subtitle (blue, 13px): "15–20 minutes · $79 one-time"
    - Body: "Go deeper with the complete Murphy Method™ protocol — medical history, anatomy, treatment readiness, and clinical scoring. Designed by a Stanford specialist. Covers everything your doctor will want to know."
  - CARD 3:
    - Step number: dark navy with white "3"
    - Title: "Receive Your Personalized Report"
    - Subtitle (blue, 13px): "Emailed as PDF instantly"
    - Body: "Get a comprehensive, designed report identifying your exact pathway — with risk scores, treatment options specific to your situation, and a doctor-visit prep sheet. Bring it to any specialist."
- Below cards: a SAMPLE REPORT PREVIEW
  - Headline (centered, 20px semibold): "What Your Report Looks Like"
  - Display a mockup image of the report cover page and first content page side by side
  - The report mockup should show: Dr. Murphy's photo, "Murphy Method™ Assessment Report", a pathway name (blurred with a CSS blur filter of 4px), scores section (blurred), and the doctor prep sheet (blurred)
  - Below image: caption in gray, 13px, italic: "Personal details blurred. Your report includes your name, pathway, scores, treatment options, and doctor prep sheet."
  - NOTE TO DEVELOPER: Generate this mockup as a designed HTML/CSS component that looks like a real document, then screenshot it. Do not use a placeholder image.

### Section 6: Pricing
- Background: white
- Padding: 80px 0
- Centered headline (dark navy, 36px bold): "Simple, Transparent Pricing"
- Centered subheadline (17px, #6B7280): "One free screener. One report. No subscriptions, no hidden fees."
- Two cards side by side on desktop (stacked on mobile), max combined width 800px, centered:

  FREE SCREENING CARD:
  - Border: 1px solid #E5E7EB
  - Border radius: 12px
  - Padding: 36px
  - Background: white
  - Top: label "FREE SCREENING" in gray uppercase 12px
  - Price: "$0" in dark navy, 48px bold
  - Subtext: "3 minutes" in gray, 14px
  - Divider line
  - Feature list (each item has a gray checkmark ✓ on left):
    - STOP-BANG sleep apnea risk score
    - Airway zone self-assessment
    - Risk level summary (Low / Moderate / High)
    - See which Murphy Method™ categories apply to you
  - Bottom: outline button "Start Free Screening →" — dark navy border and text, white background, full width of card, 12px border radius

  FULL ASSESSMENT CARD:
  - Border: 2px solid #2563EB (blue border, visually dominant)
  - Border radius: 12px
  - Padding: 36px
  - Background: very subtle blue tint (#F0F7FF)
  - Top badge: pill badge "RECOMMENDED" — blue background, white text, 11px, centered above card
  - Label: "FULL ASSESSMENT" in blue uppercase 12px
  - Price: "$79" in dark navy, 48px bold
  - Subtext: "one-time · no subscription" in gray, 14px
  - Divider line
  - Feature list (each item has a blue checkmark ✓):
    - Everything in Free Screening, plus:
    - Complete pathway assignment (1 of 8 Murphy Method™ pathways)
    - Full personalized PDF report
    - Medical history & comorbidity analysis
    - BMI and physical risk assessment
    - Treatment options specific to your pathway
    - Doctor visit prep sheet
    - Questions to ask your sleep specialist
    - Emailed to you instantly on completion
  - Bottom: filled button "Get My Full Report — $79 →" — blue background, white text, full width, 12px border radius

### Section 7: Dr. Murphy
- Background: dark navy (#0F172A)
- Padding: 80px 0
- Two-column layout on desktop (photo left, text right), stacked on mobile
- LEFT: Dr. Murphy's photo, circular crop, 240px diameter, with a thin blue border ring
- RIGHT:
  - Small label: "CREATED BY" — white at 60% opacity, 12px uppercase, letter-spacing
  - Name (white, 32px bold): "Michael P. Murphy, MD, MPH"
  - Credentials (blue #60A5FA, 15px): "Stanford Medicine · Otolaryngology · Sleep Medicine"
  - Body text (white at 80% opacity, 16px, line height 1.7): "Dr. Murphy is a dual board-certified ENT surgeon and Sleep Medicine physician with over 20 years of experience treating snoring and sleep apnea. His rare combination of surgical and non-surgical expertise allows him to see the full picture of sleep-disordered breathing — not just one treatment option."
  - Pull quote block (left border in blue, padding left 20px, margin top 24px):
    - Quote text (white, 18px italic): "After 20 years of watching patients walk into appointments with no idea what they have or what to ask — I built this so that never has to happen again."
    - Attribution (gray, 14px): "— Dr. Michael Murphy"
  - Credential pills below (each a small dark-bordered pill, white text, 13px):
    - "Board Certified — Otolaryngology"
    - "Board Certified — Sleep Medicine"
    - "St. Louis University School of Medicine"
    - "University of Washington Residency"
    - "4.9/5 · 303 Patient Ratings"
  - Link: "View Full Profile at Stanford Healthcare →" — blue text, 14px, opens in new tab

### Section 8: Testimonials
- Background: very light gray (#F9FAFB)
- Padding: 80px 0
- Centered headline (dark navy, 32px bold): "What Patients Say"
- Centered subheadline (gray, 15px): "Verified reviews from Stanford Healthcare"
- Four testimonial cards in a 2x2 grid on desktop, stacked on mobile
- Each card: white background, subtle shadow, rounded (12px), padding 28px
  - Five gold stars at top (★★★★★, #F59E0B)
  - Quote text (dark gray #374151, 15px, line height 1.6, italic): [use real quotes from Stanford profile that mention sleep apnea — e.g., "Dr. Murphy was very thorough in explaining all of the issues pertaining to sleep apnea." — pull 4 that mention sleep specifically]
  - Date below quote (gray, 13px): "Verified Stanford Healthcare Patient · [Month Year]"
- Below grid: gray note, 13px, centered: "Reviews sourced from Stanford Healthcare patient verification system."

### Section 9: FAQ
- Background: white
- Padding: 80px 0
- Max content width: 680px, centered
- Headline (dark navy, 32px bold, centered): "Common Questions"
- Accordion-style FAQ — each question is a row with a "+" icon on the right that expands to show the answer. Only one open at a time. Smooth expand/collapse animation.
- Questions and answers:

  Q: "Is this a medical diagnosis?"
  A: "No. The Murphy Method™ assessment is an educational tool designed to help you understand your situation and prepare for a conversation with your doctor. It does not replace a clinical evaluation. It gives you the knowledge to make that evaluation far more productive."

  Q: "How is this different from other sleep apnea tools online?"
  A: "Most tools give you a single risk score based on 4-8 generic questions. The Murphy Method™ evaluates your anatomy, medical history, symptom patterns, treatment readiness, and risk factors across 64 validated questions — then sorts you into one of 8 specific pathways. It was developed over 20 years of hands-on clinical practice by a dual board-certified Stanford specialist."

  Q: "What do I do with my report?"
  A: "Bring it to your primary care doctor, ENT, or sleep specialist. It will show them exactly which pathway you're on, your risk scores, and the specific questions and tests relevant to your situation. Dr. Murphy estimates that a patient arriving with this report would be in the top 1% of prepared patients he's ever seen."

  Q: "What if my screener shows I'm high risk?"
  A: "The full report will tell you exactly what type of specialist to see, what tests to ask for, and what to say when you get there. It does not diagnose you — but it gives you a clear roadmap for getting properly evaluated and treated quickly."

  Q: "What happens after I pay?"
  A: "You're taken directly to the full 15–20 minute assessment. When you finish, your personalized PDF report is generated immediately and emailed to the address you provided. No login required. No waiting."

  Q: "Is my health information private?"
  A: "Yes. We do not sell, share, or use your health information for any purpose other than generating your report. See our Privacy Policy for full details."

  Q: "Can I get a refund?"
  A: "If you complete the assessment and are not satisfied with your report, contact us within 7 days for a full refund."

### Section 10: Final CTA
- Background: dark navy (#0F172A) with a very subtle dark texture or gradient
- Padding: 100px 0
- Centered content:
  - Headline (white, 40px bold, max width 600px): "Your sleep is affecting everything. Find out why."
  - Subheadline (white at 70% opacity, 17px, margin top 16px): "Take the free 3-minute screener. No account. No commitment."
  - CTA button (margin top 32px): "Start Free Screening — It's Free"
    - Background: #2563EB
    - White text, 16px semibold
    - Padding: 14px 36px
    - Border radius: 8px

---

## PAGE 2: HOW IT WORKS

URL: /how-it-works
Meta title: "How the Murphy Method™ Works | SleepCheckup.com"
Meta description: "See exactly how the Murphy Method™ assessment works — what it covers, what you receive, and how a Stanford sleep specialist built it."

### Section 1: Page Hero
- Background: very light gray (#F9FAFB), NOT a photo hero — this is an informational page
- Padding: 80px 0
- Centered:
  - Small label: "THE PROCESS" — same label style
  - Headline (dark navy, 44px bold): "How the Murphy Method™ Works"
  - Subheadline (gray, 18px, max width 560px): "A 20-year clinical methodology, built into a 3-step process that gives you answers — not just a score."

### Section 2: The Two-Tier Structure
- Background: white
- Padding: 60px 0
- Centered headline (dark navy, 28px bold): "Start Free. Go Deeper When You're Ready."
- Explain the free vs paid split in plain language — two columns:
  - Left: Free Screener explanation (3 min, what it covers, what output looks like)
  - Right: Full Assessment explanation (15-20 min, what it covers, what report looks like)
- Each column has a CTA button at the bottom

### Section 3: Assessment Sections Explained
- Background: very light gray
- Padding: 60px 0
- Centered headline: "What the Full Assessment Covers"
- Six section cards in a 2x3 grid (desktop), stacked (mobile):
  Each card has: section name as title, a 1-sentence clinical explanation of why it matters, and an icon
  - CARD 1 — Medical History: "Reviews 10 conditions directly linked to sleep-disordered breathing — including heart disease, diabetes, and hypertension."
  - CARD 2 — BMI & Physical Factors: "Body composition and neck anatomy are major contributors to airway collapse. This section quantifies your physical risk profile."
  - CARD 3 — STOP-BANG Screening: "The gold-standard clinical screening tool for obstructive sleep apnea, used by physicians worldwide."
  - CARD 4 — Insomnia Screening: "Sleep apnea and insomnia frequently co-exist. Treating one without the other leads to poor outcomes. This section identifies overlap."
  - CARD 5 — PLATO-11 Treatment Readiness: "Assesses which treatment options you're most likely to tolerate and adhere to — a critical factor in treatment success."
  - CARD 6 — Airway Zone Assessment: "Maps which of the 4 anatomical zones of your airway are most likely contributing to your symptoms."

### Section 4: The 8 Pathways (Teaser — not full detail)
- Background: white
- Padding: 60px 0
- Headline: "8 Pathways. One That's Yours."
- Body: explain that the full assessment sorts users into one of 8 clinically distinct pathways. List the pathway categories as names only (no descriptions — descriptions are the paid product):
  Show 8 pill/badge elements with pathway names like:
  "Pathway 1: Simple Snoring" | "Pathway 2: Mild OSA" | "Pathway 3: Moderate OSA" | "Pathway 4: Severe OSA" | "Pathway 5: OSA + Nasal Obstruction" | "Pathway 6: OSA + Insomnia" | "Pathway 7: OSA + Positional Component" | "Pathway 8: Complex/Multi-Factor OSA"
  NOTE TO DEVELOPER: Use placeholder pathway names if the real ones aren't provided — the structure matters, not the exact names here
- Below pills: "The full assessment tells you which pathway is yours, what it means, and what to do about it."
- CTA button: "Discover My Pathway — $79"

### Section 5: Report Preview (expanded)
- Larger version of the report mockup from the homepage
- Walk through each section of the report with a screenshot/mockup of that section beside the description
- 6 rows, alternating left-right layout (text left/image right, then text right/image left):
  Row 1: Cover Page — "Your name, pathway, date, and Dr. Murphy's credentials on a professional cover."
  Row 2: Results Summary — "Overall risk score, STOP-BANG score, insomnia score, and top 3 findings in plain language."
  Row 3: Your Pathway Explained — "What your pathway means, which anatomical zones are involved, and why."
  Row 4: Risk Profile — "Cardiovascular risk, metabolic risk, and daytime function impact specific to your results."
  Row 5: Treatment Options — "What treatments work best for your pathway — and which are less likely to help."
  Row 6: Doctor Prep Sheet — "Exactly what to tell your doctor, which tests to request, and the questions to ask."

### Section 6: FAQ (same as homepage FAQ, repeated here)

### Section 7: CTA
- Same final CTA section as homepage

---

## PAGE 3: ABOUT DR. MURPHY

URL: /about
Meta title: "About Dr. Michael Murphy, MD, MPH | SleepCheckup.com"
Meta description: "Dr. Michael Murphy is a dual board-certified Stanford sleep physician and ENT surgeon who developed the Murphy Method™ after 20 years of treating sleep apnea."

### Section 1: Hero
- Background: very light gray
- Padding: 80px 0
- Two-column layout: photo left, text right
- Photo: Dr. Murphy full professional photo, NOT circular on this page — rectangular with rounded corners (12px), large (400px wide)
- Right column:
  - Label: "ABOUT THE CREATOR"
  - Name: "Michael P. Murphy, MD, MPH" — dark navy, 40px bold
  - Title: "Stanford Medicine · Otolaryngology · Sleep Medicine" — blue, 16px
  - Body (17px, #4B5563, line height 1.7): Full bio paragraph — dual board certifications, 20 years of experience, practice at Stanford Medicine, what makes his approach unique (surgical + non-surgical options), why he developed the Murphy Method™
  - Credential grid (2x3 grid of credential pills, same style as homepage)
  - Link to Stanford profile

### Section 2: The Origin of the Murphy Method™
- Background: white
- Padding: 80px 0
- Max width 720px centered
- Headline: "Why I Built This"
- Written in first-person from Dr. Murphy's voice. Content TBD by Dr. Murphy — placeholder text: "After 20 years in practice, I noticed a consistent pattern: patients were arriving to their appointments completely unprepared. They didn't know what kind of sleep problem they had, what questions to ask, or what treatment paths existed. A 15-minute appointment was being spent on the basics instead of on a real plan. I developed the Murphy Method™ to change that. The methodology sorts patients into one of 8 distinct pathways based on their anatomy, symptoms, and risk profile — so that by the time they sit down with a specialist, they already understand their situation and can have a real, informed conversation about treatment."
- Pull quote in blue bordered block: "If a patient came to their appointment with this report, they would be in the 99th percentile of prepared patients I've ever seen."

### Section 3: Video (if available)
- If a video of Dr. Murphy exists, embed it here full width with a play button overlay
- If not, show a placeholder section: "Video coming soon — subscribe to be notified."
- This section can be skipped entirely at MVP if no video

### Section 4: Credentials (detailed)
- Full list of credentials, certifications, education, residency — formatted as a clean timeline or list
- Link to Stanford Healthcare profile

### Section 5: CTA
- Same final CTA block as other pages

---

## PAGE 4: BLOG INDEX

URL: /blog
Meta title: "Sleep Apnea Resources & Guides | SleepCheckup.com"
Meta description: "Expert sleep apnea guides from Dr. Michael Murphy, Stanford sleep specialist. Understand your symptoms, risk factors, and treatment options."

### Layout
- Header: "Sleep Apnea Guides & Resources" — centered, dark navy, 36px bold
- Subheadline: "Written with clinical input from Dr. Michael Murphy, MD, MPH — Stanford Medicine"
- Blog post grid: 3 columns desktop, 2 tablet, 1 mobile
- Each blog card:
  - Feature image (auto-generated or stock, relevant to sleep/health)
  - Category pill (e.g., "Apple Watch" | "Treatment" | "Risk Factors")
  - Title (dark navy, 18px semibold)
  - 2-line excerpt (gray, 14px)
  - "Read More →" link
  - Date published

### Initial posts to create (developer creates page structure, content to be added):
  1. "Your Apple Watch Just Detected Sleep Apnea — Here's Exactly What To Do" — URL: /blog/apple-watch-sleep-apnea
  2. "The 8 Types of Sleep Apnea and How to Know Which One Is Yours" — URL: /blog/8-types-sleep-apnea
  3. "Why Your CPAP Isn't Working — And What To Do About It" — URL: /blog/cpap-not-working
  4. "Sleep Apnea and Heart Disease: What You Need to Know" — URL: /blog/sleep-apnea-heart-disease

---

## PAGE 5: BLOG POST TEMPLATE

URL: /blog/[slug]
- Clean reading layout, max width 720px, centered
- Header: category pill + title (dark navy, 36px bold) + date + "By Dr. Michael Murphy, MD, MPH" byline with his small photo
- Feature image below header, full content width
- Body: 17px, #374151, line height 1.75 — clean, generous reading typography
- Inline CTA box (appears once, approximately 40% into the article): dark navy background, white text — "Not sure which sleep apnea pathway applies to you? Take the free 3-minute screener." + "Start Free Screening" button
- End of article: full-width CTA section same as homepage final CTA
- Right sidebar (desktop only): sticky card with "Take the Free Screener" CTA

---

## FREE SCREENER FLOW

URL: /screener
Access: clicking any "Start Free Screening" button anywhere on the site

### Step 1: Screener Questions
- NO account creation. NO login prompt. User goes directly into questions.
- Progress bar at top: thin blue bar showing % complete
- Above bar: "Free Screening · Step 1 of 1" — no step numbers needed, it's all one flow
- Questions displayed one section at a time (not all at once) — keep existing question logic
- Clean, minimal UI — white background, dark navy question text, large tap targets for answers
- "Back" button bottom left, "Next" button bottom right (blue, filled)
- Auto-save is fine to keep

### Step 2: Email Capture (shown BEFORE results)
- After final question, before showing any results:
- Full-page interstitial (white background, centered content):
  - Headline (dark navy, 28px bold): "Your results are ready."
  - Subheadline (gray, 16px): "Enter your email to see your risk score and save your results."
  - Email input field (full width, large, placeholder "your@email.com")
  - Submit button: "See My Results →" — blue, full width
  - Below button: gray 12px text — "We'll also email you a copy of your free results. We don't sell your information."
  - NO account creation. NO password. Email only.

### Step 3: Free Results Page
URL: /screener/results
- Shows immediately after email submission
- Layout (centered, max width 680px):
  - Top: "Your Free Screening Results" — dark navy, 28px bold
  - Below: their email address shown as confirmation ("Results saved to: [email]")
  
  RESULT BLOCK 1 — Risk Level:
  - Large visual indicator (colored circle or gauge): Low / Moderate / High based on STOP-BANG score
  - Score displayed numerically (e.g., "STOP-BANG Score: 4 of 8")
  - One-sentence plain language interpretation based on score range

  RESULT BLOCK 2 — Airway Zones:
  - Show which zones were flagged in their answers
  - Simple visual: the airway diagram with flagged zones highlighted in orange/red
  - Below: "Based on your responses, [X] of 4 airway zones show potential involvement."

  RESULT BLOCK 3 — Pathway Teaser (THE HOOK):
  - Dark navy background box, padding 32px, rounded corners
  - Headline (white, 20px semibold): "Your responses suggest characteristics associated with multiple Murphy Method™ pathways."
  - Body (white at 80%, 15px): "The full assessment will identify exactly which of the 8 pathways applies to your specific anatomy, symptoms, and risk profile — and give you a complete personalized report to bring to your doctor."
  - List (white, 14px) with blue checkmarks:
    ✓ Exact pathway assignment (1 of 8)
    ✓ Full risk score breakdown
    ✓ Treatment options specific to your pathway
    ✓ Doctor visit prep sheet with questions to ask
    ✓ Emailed as a professional PDF instantly
  - CTA button (blue, full width of box): "Get My Full Report — $79"
  - Below button: gray 12px — "One-time payment. No subscription. Report emailed instantly."

  BELOW THE BOX:
  - Small text link: "Not ready yet? Download your free results as PDF" — this generates a simple 1-page PDF with just the free results (STOP-BANG score + airway zones). This is the only thing the free tier delivers as a document. It intentionally does NOT include pathway information, treatment options, or doctor prep sheet.

---

## FULL ASSESSMENT FLOW (POST-PAYMENT)

### Step 1: Stripe Checkout
- Clicking "Get My Full Report — $79" opens Stripe checkout
- Email is pre-filled from screener
- Product name in Stripe: "Murphy Method™ Full Assessment Report"
- Amount: $79.00 USD
- One-time charge, no subscription
- On successful payment: redirect to /assessment

### Step 2: Full Assessment
URL: /assessment
- Existing 64-question assessment logic stays EXACTLY the same — do not change the questions
- UI changes:
  - Remove the tab bar showing "Medical History | BMI | STOP-BANG | Insomnia | PLATO-11 | Overview" — this over-exposes the methodology structure. Replace with a simple progress bar and section title only (e.g., "Section 2 of 5 — Airway Assessment")
  - Remove "1 of 64 questions answered" counter — replace with section-level progress only ("3 of 8 questions in this section")
  - Remove "~16 min remaining" timer — it discourages completion. Replace with "Almost there — keep going."
  - Keep auto-save
  - Keep "Start Fresh" option but make it less prominent (small gray text link, not a button)

### Step 3: Report Generation
- On final question submission: show a loading screen (white background, centered):
  - Animated spinner or pulse animation
  - Text: "Generating your personalized Murphy Method™ report..."
  - Subtext: "This takes about 30 seconds."
  - Do NOT let this screen feel broken — keep a visible animation the whole time

### Step 4: Confirmation Page
URL: /assessment/complete
- White background, centered, clean:
  - Large checkmark icon (green #10B981, 64px)
  - Headline (dark navy, 32px bold): "Your Report Is On Its Way"
  - Body (gray, 16px): "We've sent your personalized Murphy Method™ report to [email]. It should arrive within 2 minutes. Check your spam folder if you don't see it."
  - Pathway name revealed here (first time they see it): "Your Pathway: [Pathway Name]" — shown in a dark navy badge with white text, centered, 20px
  - Below: "While you wait, here's what to do with your report:" followed by 3 simple numbered steps:
    1. "Read your pathway explanation first — it provides the context for everything else."
    2. "Review the treatment options section before your doctor appointment."
    3. "Print the Doctor Prep Sheet (page 6) and bring it with you."
  - Secondary CTA (gray outline button): "Didn't receive your email? Resend Report"

---

## THE PDF REPORT (generated server-side)

Generate using Puppeteer rendering a styled HTML template, or equivalent. The report MUST look professionally designed — not a plain text dump.

### Page 1: Cover
- Full page
- Background: dark navy (#0F172A)
- Top: SleepCheckup.com logo in white + "Murphy Method™ Assessment Report" in white 14px uppercase
- Center: Dr. Murphy's photo (circular, 120px), then his name "Michael P. Murphy, MD, MPH" in white 18px, then "Stanford Medicine · Otolaryngology · Sleep Medicine" in blue 14px
- Below: thick horizontal divider line in blue
- Patient info block: "Prepared for: [First Name Last Name]" | "Assessment Date: [Date]" | "Report ID: [UUID]"
- Large pathway name in blue (#60A5FA), 32px bold, centered near bottom: "[Pathway Name]"
- Very bottom: "This report is for educational purposes and does not constitute a medical diagnosis."

### Page 2: Your Results Summary
- White background
- Section header bar: dark navy background, white text "YOUR RESULTS SUMMARY"
- 4 score blocks in a 2x2 grid, each with a visual gauge/circle, score number, label, and plain-language interpretation
- Below grid: "TOP 3 FINDINGS" — three numbered items in plain language

### Page 3: Your Pathway Explained
- White background
- Section header: "YOUR PATHWAY: [Pathway Name]"
- Full explanation of the pathway (from Dr. Murphy's book content — this is where that content gets used)
- Airway diagram with the relevant zones highlighted for this pathway
- "What makes this pathway different from others" comparison notes

### Page 4: Your Risk Profile
- White background
- Section header: "YOUR RISK PROFILE"
- Comorbid conditions flagged (from medical history questions)
- Cardiovascular risk summary
- Metabolic risk summary
- Daytime function impact

### Page 5: Treatment Options
- White background
- Section header: "TREATMENT OPTIONS FOR YOUR PATHWAY"
- Two columns: "More Likely To Help" and "Less Likely To Help For This Pathway"
- Non-surgical options listed with brief explanations
- Surgical options if applicable to this pathway
- Lifestyle modifications specific to this pathway

### Page 6: Doctor Visit Prep Sheet
- Light blue background (#EFF6FF) to make it visually distinct and easy to find
- Section header: "YOUR DOCTOR VISIT PREP SHEET"
- "WHAT TO TELL YOUR DOCTOR:" — 3-5 bullet points specific to this pathway
- "TESTS TO ASK ABOUT:" — specific tests relevant to this pathway
- "QUESTIONS TO ASK YOUR SPECIALIST:" — 8-10 questions, pathway-specific
- "RED FLAGS — MENTION THESE IMMEDIATELY:" — urgent symptoms if any were flagged

### Back Cover
- Dark navy background
- "About the Murphy Method™" paragraph
- "About Dr. Murphy" — condensed bio
- SleepCheckup.com URL and contact email
- Disclaimer in full

---

## TECHNICAL REQUIREMENTS

### Stack
- Keep existing Replit/Node stack — do not rebuild the backend
- All frontend changes are UI/UX only unless specified otherwise

### Stripe Integration
- Use Stripe Checkout (hosted payment page) — simplest integration, most trusted by users
- Product: "Murphy Method™ Full Assessment Report" — $79.00 one-time
- Success URL: /assessment (passes session ID for verification)
- Cancel URL: /screener/results (returns them to results page)
- Webhook: on payment_intent.succeeded → unlock assessment for that email

### PDF Generation
- Use Puppeteer or html-pdf-node
- Render a styled HTML template for the report (not a raw data dump)
- Store generated PDFs temporarily and email them — do not store permanently at MVP

### Email
- Use SendGrid or Resend (simpler API)
- Two emails sent:
  1. Free results email: simple HTML email with their STOP-BANG score, airway zones, and CTA to get full report
  2. Report delivery email: "Your Murphy Method™ Report Is Attached" with PDF attached and the 3 steps for what to do with it

### Analytics (add from day one)
- Google Analytics 4
- Custom events to track:
  - screener_started
  - screener_completed
  - email_captured
  - checkout_initiated
  - payment_completed
  - report_emailed
  - report_resend_requested

### SEO
- Every page: unique meta title and meta description (specified above per page)
- Blog posts: H1, H2 structure, meta tags
- Add sitemap.xml at /sitemap.xml
- Add robots.txt
- All images: descriptive alt tags

### Performance
- Lazy load images below the fold
- Hero image compressed and served as WebP
- Target: Lighthouse performance score > 85 on mobile

### Domain
- Deploy at sleepcheckup.com — NOT the replit.dev URL
- SSL certificate required (HTTPS only)
- www redirect to non-www (or vice versa — pick one and redirect the other)

---

## WHAT TO DELETE FROM THE EXISTING SITE

The following elements from the current build must be completely removed — do not repurpose, do not hide, delete entirely:

1. "My Portal" — nav link, page, and all associated routes
2. "Explore Pathways" — nav link and page
3. "Log In" — nav link and all auth flows
4. Account creation at any point before payment
5. The "Two Ways to Get Started" section that reveals the full feature list of the free tier (it gives too much away)
6. The tab bar inside the assessment showing "Medical History | BMI | STOP-BANG | Insomnia | PLATO-11 | Overview" — replace with section-level progress bar only
7. "~16 min remaining" timer inside assessment
8. "1 of 64 questions answered" counter inside assessment
9. Any pricing below $79 for the full assessment
10. "Video courses & expert content" from the paid tier feature list — this doesn't exist yet

---

## SUMMARY OF WHAT THIS SITE IS

- 5 pages: Home, How It Works, About Dr. Murphy, Blog Index, Blog Post
- 2 flows: Free Screener (no auth), Full Assessment (post-Stripe-payment)
- 1 product: $79 one-time PDF report
- 0 user accounts at MVP
- 1 email captured: at end of free screener
- 1 conversion goal: free screener → $79 purchase

Build this. Nothing more.

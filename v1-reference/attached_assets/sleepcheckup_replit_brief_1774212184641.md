# SleepCheckup.com — Full Product & Development Brief
**For:** Replit AI / Developer  
**Project:** Reshape sleepcheckup.com into a high-converting "Pre-Visit Intelligence Report" business  
**Version:** 1.0

---

## OVERVIEW & BUSINESS GOAL

This is not a SaaS product. It is a **premium diagnostic report service** built around a trademarked clinical methodology (the Murphy Method™) developed by Dr. Michael P. Murphy, MD, MPH — a dual board-certified Stanford sleep physician with 20+ years of experience.

The business model is simple:
- **Free 3-minute screener** → creates urgency, captures email
- **$79 full assessment** → delivers a personalized, beautifully designed PDF report sorted into one of 8 clinical pathways
- **No portal, no account creation before payment, no friction**

The customer is someone who just got an Apple Watch sleep apnea notification, or whose partner told them they stop breathing at night, or who is exhausted and has been for years. They are scared and don't know what to do. We give them clarity, from a Stanford specialist, for $79.

The primary conversion metric is: **free screener completion → paid full assessment purchase.**

---

## WHAT NEEDS TO CHANGE (CRITICAL)

### 1. REMOVE account/portal requirement before payment
Currently users are asked to create an account before or during the assessment. This kills conversion. **No account creation until after payment.** The only thing we capture before payment is their email address (at the end of the free screener, before showing them their result and the upgrade CTA).

### 2. RESTRUCTURE the free/paid boundary
Currently the free tier gives away too much value (printable results, doctor questions). This undercuts the paid product.

**New free tier gives:**
- STOP-BANG risk score
- Which anatomical zones are flagged (nose, palate, tongue base, etc.)
- A statement like: *"Your responses suggest characteristics consistent with [X] of the 8 Murphy Method™ pathways. To discover exactly which pathway applies to you — and get a complete report to bring to your doctor — complete the full assessment."*
- Email capture
- CTA to purchase full assessment

**New paid tier ($79) gives:**
- Complete pathway assignment (1 of 8 Murphy Method™ pathways)
- Full personalized report (see Report spec below)
- Risk scores across all dimensions
- Plain-language explanation of their anatomy and contributing factors
- Treatment options specific to their pathway
- "Bring to your doctor" prep sheet with specific questions
- Delivered as a beautiful PDF to their email within seconds of completing assessment

### 3. REMOVE portal/account dashboard from MVP
The "My Portal" nav item and account dashboard should be removed entirely for now. It adds complexity and implies a subscription product, which is not what this is. All report delivery happens via email PDF.

### 4. REMOVE "Explore Pathways" from public nav
This page educates users on the methodology for free and reduces willingness to pay. Remove from nav. Pathway content is the paid product.

---

## SITE ARCHITECTURE

### Navigation (simplified)
```
Logo (sleepcheckup.com)  |  Home  |  How It Works  |  About Dr. Murphy  |  [Start Free Screening — CTA Button]
```

No "My Portal." No "Explore Pathways." No login in nav at MVP.

---

### PAGE 1: HOME (primary conversion page)

**One job: get them to start the free screener.**

#### Section 1 — Hero
- **Headline variants** (show different headlines based on URL parameter for future A/B testing):
  - Default: *"Find Out Exactly What's Causing Your Sleep Problems — And What Can Fix Them"*
  - `/watch` variant: *"Your Apple Watch Detected Sleep Apnea. Here's What To Do Next."*
  - `/snoring` variant: *"If You Snore, This Could Be More Serious Than You Think."*
- **Subheadline:** *"Take the free 3-minute screening designed by a Stanford sleep specialist. Get answers — not generic advice."*
- **CTA button:** "Start Free Screening — 3 Minutes" (primary, large, dark blue)
- **Trust line below button:** "Used by thousands of patients. Created by Dr. Michael Murphy, MD, MPH — Stanford Medicine."
- **Hero image:** The existing bedroom photo works. Keep it.

#### Section 2 — Social proof bar
A simple horizontal strip with 3-4 stats:
- "4.9/5 patient rating (303 verified ratings)"
- "20+ years treating sleep disorders"
- "Dual board-certified: ENT & Sleep Medicine"
- "Stanford Medicine"

#### Section 3 — The Problem (emotional)
Headline: *"Most people with sleep apnea don't know they have it."*

Short paragraph: Sleep apnea affects an estimated 30 million Americans. 80% are undiagnosed. Left untreated, it's linked to heart disease, stroke, diabetes, and early cognitive decline. The problem isn't just finding out if you have it — it's knowing what to do about it. Most resources give generic advice. The Murphy Method™ gives you a personalized roadmap.

#### Section 4 — "Not One Size Fits All" (methodology teaser)
Keep the existing content here — it works well. The airway diagram showing Nose → Palate & Tonsils → Tongue Base → Lower Throat is good. Keep the "8 distinct pathways" explanation. Show the two pathway examples (Sleep Apnea + Insomnia and Sleep Apnea + Nasal Problem) as teasers.

End with: *"The full assessment identifies exactly which pathway is yours."* + CTA button.

#### Section 5 — How It Works (3 steps)
Simple three-column layout:

**Step 1: Take the Free Screener (3 min)**  
Answer quick questions about your symptoms, sleep patterns, and risk factors. Get your risk score instantly — no account needed.

**Step 2: Complete the Full Assessment ($79)**  
Go deeper with the complete Murphy Method™ assessment — anatomy, medical history, treatment readiness. Takes 15–20 minutes.

**Step 3: Receive Your Personalized Report**  
Get a comprehensive PDF report emailed to you immediately. Bring it to any doctor. Understand your pathway. Know what to ask.

Include a **blurred/redacted sample report preview image** here. People pay for things they can visualize. The report should look like something worth $79 — Dr. Murphy's photo on the cover, pathway name, scores, prep sheet visible but not readable.

#### Section 6 — Pricing (transparent, on the homepage)
**This section is critical. Do not hide the price.**

Two-column card layout:

| Free Screening | Full Assessment |
|---|---|
| $0 | $79 one-time |
| 3 minutes | 15–20 minutes |
| STOP-BANG risk score | Everything in free, plus: |
| Airway zone identification | Complete pathway assignment (1 of 8) |
| Risk level summary | Full personalized report PDF |
| — | Medical history analysis |
| — | Treatment options for your pathway |
| — | Doctor visit prep sheet |
| — | Questions to ask your specialist |
| [Start Free Screening] | [Take Full Assessment] |

#### Section 7 — Dr. Murphy Bio
Keep the existing content. It works. Add: a quote from him in his own voice about why he built this. Something like: *"After 20 years of seeing patients walk in completely unprepared — and watching 15-minute appointments get wasted on basics — I wanted to give people a way to show up already knowing what they have and what questions to ask."*

#### Section 8 — Patient testimonials
Pull 4–6 real quotes from his Stanford profile reviews that mention sleep apnea specifically. These are verified patient reviews — they're legitimate social proof. Examples already visible in the existing profile.

#### Section 9 — FAQ
- Is this a diagnosis? (No — this is a preparation and education tool designed by a board-certified sleep physician.)
- How is this different from other sleep apnea tools? (The Murphy Method™ identifies 8 distinct pathways based on anatomy, symptoms, and risk factors — not just a generic risk score.)
- What do I do with my report? (Bring it to your doctor, ENT, or sleep specialist. It will put you in the top percentile of prepared patients.)
- What if my result says I'm at risk? (The report tells you exactly which type of specialist to see and what tests to ask for.)
- Is my information private? (Yes. We do not sell or share your health information.)

#### Final CTA section
Dark background. Headline: *"Your sleep is affecting everything. Find out why."* Single button: "Start Free Screening — It's Free."

---

### PAGE 2: HOW IT WORKS

Expand the 3-step process into full detail. Include:
- What each section of the assessment covers (Medical History, BMI, STOP-BANG, Insomnia screening, PLATO-11, Airway Zones)
- Why each piece matters clinically (1-2 sentences per section — Dr. Murphy's voice)
- The sample report preview (larger version, still blurred/redacted)
- FAQ repeated
- CTA

---

### PAGE 3: ABOUT DR. MURPHY

Full biography page. Include:
- Professional photo
- Full credentials and certifications
- The origin story of the Murphy Method™ (written in first person or close third)
- Why he built this consumer product
- Link to Stanford Healthcare profile
- If possible: an embedded short video (even iPhone quality) of him explaining the problem in plain language
- CTA to start free screening

---

### PAGE 4: BLOG / CONTENT (build over time, critical for SEO)

Create a blog section. Initial posts to write and publish immediately:

1. **"Your Apple Watch Just Detected Sleep Apnea — Here's Exactly What To Do"**  
   Target keyword: "apple watch sleep apnea what to do"

2. **"The 8 Types of Sleep Apnea Treatment Paths (And How to Know Which One is Yours)"**  
   Target keyword: "sleep apnea treatment options"

3. **"Why Your CPAP Isn't Working — It Might Be Your Pathway"**  
   Target keyword: "cpap not working sleep apnea"

4. **"Sleep Apnea and Heart Disease: What You Need to Know Before Your Next Appointment"**  
   Target keyword: "sleep apnea heart disease risk"

Each post should end with a CTA to take the free screener.

---

## ASSESSMENT FLOW (REVISED)

### Free Screener Flow (unchanged in questions, changed in output)

1. User clicks "Start Free Screening" — **no account creation, no login**
2. Takes 3-minute screener (existing questions work)
3. Reaches results page — sees:
   - Their STOP-BANG score with risk level
   - Airway zones flagged
   - A statement: *"Based on your responses, you show characteristics associated with [X] Murphy Method™ risk categories. The full assessment will identify exactly which of the 8 pathways applies to your situation."*
   - **Email capture field:** "Enter your email to save your results and continue to the full assessment"
   - **CTA button:** "Get My Full Report — $79"
4. Email is captured. This is their identifier going forward.

### Full Assessment Flow (post-payment)

1. User clicks "Get My Full Report — $79"
2. **Stripe checkout page** — email pre-filled from screener
3. Payment completes → user is taken directly back to assessment to complete remaining questions
4. On completion → **report is generated and emailed as PDF immediately**
5. Confirmation page: *"Your report is on its way to [email]. Check your inbox — it should arrive within 2 minutes."*
6. Optional: offer to schedule a consultation with Dr. Murphy (future upsell)

**No portal. No account creation. No password. Just pay → complete → receive PDF.**

---

## THE REPORT (most important deliverable)

The PDF report is the product. It needs to look and feel like it cost $79. This is what gets shared, talked about, and brought to doctor visits.

### Report Structure:

**Cover Page**
- SleepCheckup.com logo + Murphy Method™ mark
- Patient name
- Date
- "Prepared by Dr. Michael P. Murphy, MD, MPH — Stanford Medicine"
- Dr. Murphy's photo
- Pathway name prominently displayed (e.g., "Pathway 4: Sleep Apnea with Nasal Obstruction")

**Page 2: Your Results Summary**
- Overall risk score (visual gauge)
- STOP-BANG score
- Insomnia score
- BMI/physical risk factors
- Top 3 findings in plain language

**Page 3: Your Pathway Explained**
- What this pathway means
- Which anatomical areas are involved
- Why this pattern exists clinically
- What makes this pathway different from others

**Page 4: Your Risk Profile**
- Comorbid conditions flagged
- Cardiovascular risk
- Metabolic risk
- Daytime function impact

**Page 5: Treatment Options For Your Pathway**
- What treatments are typically most effective for this pathway
- What treatments are less likely to work (and why)
- Non-surgical options
- Surgical options if relevant
- Lifestyle modifications specific to this pathway

**Page 6: Your Doctor Visit Prep Sheet**
- "What to tell your doctor" (3-5 bullet points specific to their pathway)
- "Tests to ask about" (specific to their pathway)
- "Questions to ask your specialist" (8-10 questions, pathway-specific)
- "Red flags to mention immediately"

**Back Cover**
- About the Murphy Method™
- About Dr. Murphy
- Disclaimer: This report is an educational tool designed to help you prepare for a conversation with your healthcare provider. It is not a medical diagnosis.

---

## TECH REQUIREMENTS

### Payment
- **Stripe** for payment processing
- One-time charge of $79
- No subscription, no recurring billing
- Email receipt from Stripe

### Report Generation
- Generate PDF on assessment completion
- Email PDF to user automatically via SendGrid or similar
- PDF should be designed (not just a text dump) — use a PDF generation library that supports styling (e.g., Puppeteer rendering a styled HTML template, or a service like DocRaptor)

### Email
- Capture email at end of free screener (before showing upgrade CTA)
- Send report PDF on assessment completion
- Optional: send a follow-up email 3 days later asking for feedback

### Analytics
- Google Analytics or Posthog
- Track: screener start, screener completion, email capture, payment initiated, payment completed, report opened
- This funnel data is critical for optimization

### SEO
- Each page needs proper meta titles and descriptions
- Blog section with clean URLs (sleepcheckup.com/blog/apple-watch-sleep-apnea)
- Sitemap.xml
- robots.txt

### No login/auth required at MVP
Remove all authentication requirements before payment. Post-payment, the email address is the user's identifier. If they want to retrieve their report, they can request a re-send by email.

---

## COPY PRINCIPLES

1. **Meet them emotionally first.** Fear, exhaustion, confusion. Then credibility. Then solution.
2. **Never say "diagnose."** Say "identify," "assess," "prepare," "understand."
3. **Stanford is a signal, not a brag.** Mention it once prominently. Let the credentials do the work.
4. **The report is the product.** Everything on the site exists to make someone want that report.
5. **Specific beats vague.** "8 distinct pathways based on your anatomy, symptoms, and risk factors" beats "personalized results."
6. **Dr. Murphy's voice should be present.** First-person quotes throughout. He's the reason this is trustworthy.

---

## DESIGN DIRECTION

Keep the existing color scheme (dark navy/blue + white) — it's professional and medical without being cold.

Changes:
- The hero section needs more emotional weight — consider a headline typographic treatment that feels urgent, not just informational
- Add Dr. Murphy's photo higher on the page (above the fold on desktop if possible)
- The report preview image is critical — design a realistic-looking sample report cover and first page, blur the personal details, screenshot it, use it on the site
- Mobile-first — the Apple Watch notification user is on their phone

---

## WHAT SUCCESS LOOKS LIKE AT 30 DAYS

- Site deployed publicly at sleepcheckup.com
- Stripe paywall live at $79
- Free screener live with email capture
- Report PDF generating and emailing automatically
- 3 blog posts live targeting watch notification keywords
- First 50 paying customers acquired
- Funnel data showing where people drop off

---

## WHAT IS NOT IN SCOPE FOR MVP

- User accounts / login / portal (remove entirely)
- "Explore Pathways" public page (remove from nav)
- Provider/B2B version (future phase)
- Mobile app (future phase)
- Subscription pricing (future phase)
- Video courses (future phase — mentioned in current paid tier but not MVP)

---

*Brief prepared for SleepCheckup.com / Murphy Method™*  
*All methodology and content © Dr. Michael P. Murphy, MD, MPH*

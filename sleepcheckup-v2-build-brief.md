# SleepCheckup v2 — Localhost UX Variant Build Brief

**Purpose:** Build a complete localhost-only frontend prototype variant of sleepcheckup.com. The variant exists purely to evaluate proposed UX/UI changes side-by-side with the production site. The original project at `sleepcheckup.com` (referenced as "v1") must not be modified.

**Hand-off context:** This brief is written for Claude Code working in a clean local directory. You will scaffold a new Vite + React + TypeScript + Tailwind project from scratch and rebuild every user-facing page of the existing site.

---

## ⚠️ Absolute Rules — Do Not Violate

1. **DO NOT modify any wording.** Every headline, button label, FAQ question, FAQ answer, testimonial, hero subtitle, section description, disclaimer, founder quote, pathway description, educational summary, and resource caption must be reproduced **verbatim** from v1. This is a UX-only experiment.
2. **DO NOT modify any assessment question text or answer options.** STOP-BANG, Insomnia Severity Index, PLATO-11, Medical History, BMI Calculator, Zone Airway Self-Check (Nose / Palate / Mandible / Neck), and PALM Treatment Readiness must use identical question text and identical answer options.
3. **DO NOT modify pathway content.** All 8 pathways (A–H) must use the identical educational summary, key concept, "what your results suggest" prose, and "what usually works best" content.
4. **DO NOT modify scoring logic.** STOP-BANG numeric scoring, ISI scoring tiers, PLATO-11 calculation, anatomy zone scoring, BMI calculation, risk-tier mapping, and pathway assignment algorithm must produce identical outputs to v1.
5. **DO NOT include any backend.** No Stripe, no Resend email, no PostgreSQL, no PDF generation, no Replit Auth. The prototype is frontend-only with localStorage persistence and mock data for everything that would normally hit an API.
6. **DO NOT use the same project location as v1.** Create a new directory.

The content (copy and questions) is the contract. The presentation is the variable.

---

## What You're Building

A localhost-only React SPA that replicates every page of sleepcheckup.com with the following structural and visual changes applied. Built to be served by `npm run dev` at `http://localhost:5173` (Vite default) with no external dependencies beyond what runs in-browser.

### Files needed verbatim from v1

You will be given the v1 codebase as a reference. Treat these files as the source of truth for content — copy their string content into your new component files without changes:

- `client/src/content.ts` — all marketing copy (hero, FAQs, testimonials, pricing, pathways cards, transformation outcomes, Dr. Murphy quotes, etc.)
- `client/src/lib/questionnaires.ts` — every assessment question and its answer options
- `client/src/lib/pathway-content.ts` — all 8 pathway educational summaries and content
- `client/src/lib/pathways.ts` — the pathway assignment algorithm (port verbatim)
- `client/src/lib/scoring.ts` — STOP-BANG, ISI, PLATO, anatomy, BMI scoring functions (port verbatim)
- `client/src/lib/types.ts` — type definitions for answers and profiles
- All pages in `client/src/pages/` for legal text (privacy, terms, disclaimer)
- `client/src/pages/about.tsx` and `client/src/pages/how-it-works.tsx` for body copy

Copy these files into the new project unchanged, then build new components around them.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Build tool | Vite | Same as v1 |
| Framework | React 18 + TypeScript | Same as v1 |
| Styling | Tailwind CSS | Same as v1 |
| Component primitives | shadcn/ui | Same as v1 — copy the relevant `ui/` components |
| Routing | wouter | Same as v1, minimal API |
| State (assessment) | React state + localStorage | No backend |
| Icons | lucide-react | Same as v1 |
| Form management | Native React state (no react-hook-form needed) | Keep it light |

**No new dependencies** beyond what v1 already uses. Nothing exotic — the prototype should be self-contained and runnable with `npm install && npm run dev`.

---

## Design Direction

**Anchor preference:** Blue primary color, high readability for an older audience (45–65). Existing v1 uses `#2563EB` (Tailwind blue-600) — keep this as the conversion blue. The variant should *feel* more refined, less busy, more confident — not more decorative.

### Design tokens (use these consistently)

```css
/* Primary palette */
--c-primary:   #1D4ED8;  /* Slightly deeper blue than v1's #2563EB — more authoritative */
--c-primary-h: #1E40AF;  /* hover */
--c-ink:       #0F172A;  /* near-black for body text */
--c-ink-muted: #475569;  /* secondary text */
--c-ink-soft:  #64748B;  /* tertiary text, captions */
--c-bg:        #FFFFFF;
--c-bg-soft:   #F8FAFC;  /* very light section background */
--c-bg-tint:   #EFF6FF;  /* primary-tinted callout background */
--c-border:    #E2E8F0;
--c-success:   #15803D;
--c-warning:   #B45309;
--c-danger:    #B91C1C;

/* Typography scale (older-audience-friendly) */
--fs-display:  44px;   /* hero headline */
--fs-h1:       34px;
--fs-h2:       26px;
--fs-h3:       20px;
--fs-body:     17px;   /* up from typical 16px — readability for 50+ */
--fs-small:    15px;
--fs-tiny:     13px;
--lh-body:     1.65;   /* generous line-height for readability */

/* Spacing scale */
section padding: 80px desktop / 56px mobile (vs v1's denser 72px)

/* Borders & radii */
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--border-soft: 1px solid #E2E8F0;
```

### Typography choice

Use **Inter** for body and **Source Serif Pro** (or Georgia as fallback) for the hero headline and key pull quotes. The serif moment adds editorial credibility for a medical product, and Inter at 17px is industry-standard for older-audience readability.

Load both via Google Fonts. One serif accent moment — the hero headline — is enough; don't sprinkle the serif everywhere.

### Visual rhythm

- **More whitespace than v1.** Section padding 80px desktop, 56px mobile.
- **Calmer color use.** v1 uses 4+ accent colors (blue/orange/violet/green) in the "Who This Is For" cards. Reduce to two: primary blue + neutral gray. Color carries meaning — overuse dilutes it.
- **Cards have subtle borders, no shadows by default.** Shadows only on hover/active.
- **Larger tap targets.** Minimum 48px tap height on mobile (Apple HIG). All buttons get `min-height: 48px`.

---

## Site Map & Routes

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Reordered per audit |
| `/how-it-works` | How It Works | Same content, restructured layout |
| `/about` | About Dr. Murphy | Same content |
| `/screener` | Free Screener | Restructured flow (see Screener section) |
| `/screener/results` | Screener Results | Separated from screener route for clarity |
| `/assessment/info` | Assessment Intro / Pricing Confirmation | Pre-payment |
| `/assessment/checkout` | Mock checkout page | Stripe replaced with "Continue (prototype)" button |
| `/assessment` | Full Assessment Wizard | Split steps (see Full Assessment section) |
| `/assessment/report` | Report View | Web view of the report (no PDF generation) |
| `/portal` | My Portal | Shows mock history |
| `/pathways/:letter` | Individual pathway pages A–H | Same content |
| `/pathways` | All pathways overview | Same content |
| `/blog` | Blog index | Use v1 blog list, stub posts |
| `/blog/:slug` | Blog post | Stub layout |
| `/pricing` | Pricing | Same content |
| `/contact` | Contact | Static |
| `/privacy`, `/terms`, `/disclaimer` | Legal | Static |
| `/rack-card` | Rack Card | Same as v1 |

---

## Global Layout Changes

### Header / Navigation

**v1 problems being fixed:**
- Two equally-styled buttons in hero with no clear primary
- "My Portal" in main nav confuses new visitors
- No persistent screener anchor in nav

**v2 implementation:**

Header has 3 nav items (desktop):
- Home
- How It Works
- About Dr. Murphy

Right side of header:
- A single, distinct primary CTA: **"Start Free Screening"** (blue filled button, slightly larger than nav items)
- A small text-link "Sign in" (for returning users with a portal) — moved away from main nav, sized smaller, lower contrast

Mobile:
- Hamburger menu opens a full-screen drawer (not a dropdown).
- Drawer has: Home / How It Works / About Dr. Murphy / Free Screener / Sign in
- Drawer close button is large and obvious (44px+ tap target)

### Sticky mobile CTA bar (NEW)

A slim bar fixed to the bottom of the viewport on mobile only (`md:hidden`), visible on every page *except* during the assessment/screener flow itself. Contains:

```
[Start Free Screening →]   (full-width, blue, 56px tall)
```

This addresses the audit finding: once a mobile user scrolls past the hero, they lose the CTA. The sticky bar keeps it available.

### Footer

Keep the v1 three-column structure. No content changes. Slightly more generous padding.

### Dev bar

**Do not port the dev bar.** v1 has a development pathway preview bar that should not exist in the variant — the variant has no dev/prod split needed.

---

## Page-by-Page Changes

### `/` — Home

**New section order** (vs v1's 9+ section sprawl):

```
1. Hero (single primary CTA)
2. Credential strip
3. Dr. Murphy section ⬆️ (moved up from position 7)
4. Who This Is For (4 cards, recolored to 2-tone)
5. The Murphy Method 3-step (the educational diagram)
6. Comparison block (standard quiz vs Murphy Method)
7. How It Works (3-step process with report visual)
8. Testimonials ⬆️ (moved up from bottom, before pricing)
9. Pricing
10. FAQ
```

**Removed from homepage:**
- The "How It Fits In Your Care Journey" 4-step dark section. The information is redundant with section 7 (How It Works). Cut it.
- The "Transformation / Success Scene" section. The before/after framing is interesting but adds another section. Either cut it or merge as a 2-3 line callout inside the Dr. Murphy section.

**Hero changes:**

- Single primary CTA: **"Take the Free Screener — 3 minutes"** (large, blue filled, 56px tall)
- Secondary action: just a text link below — **"or see what's in the full assessment →"** (no button styling, low visual weight)
- Hero background image stays (snoring couple), but darken the overlay from v1's `rgba(0,0,0,0.38)` to `rgba(0,0,0,0.5)` for better text contrast on the larger headline
- Use the serif font for the hero headline at `--fs-display` size — gives it a magazine-feature feel
- Subtitle and subheadline use Inter

**Credential strip (Section 2):**

- Keep all content (4.9/5, 20+ years, 2× board certs)
- Add 1 line of context above the stats: copy verbatim the line about Stanford
- Increase font size of stat numbers from v1's 18px to 22px
- Add a thin blue accent under the section

**Dr. Murphy section (now Section 3):**

- Same content as v1
- Background remains dark (`#0F172A`) — this section is allowed to be visually different from the rest, it's the credibility moment
- The quote pull-out should use the serif font for typographic gravity
- The credential pills row should stay; add 1 more if there's room (limit 6)

**Who This Is For (Section 4):**

- Same 4 cards, same content
- **Recolor:** all 4 cards use the same neutral gray icon background. The "highlighted" card (currently #3 about "someone told me I stop breathing") keeps a blue border + blue icon tint. Drop the orange/violet variants — they add visual noise without meaning.
- Card body text upsized to 16px (from v1's 14px) for readability

**Murphy Method 3-step (Section 5):**

- Same content (Normal/Snoring/Apnea spectrum, 4-zone airway, treatment options)
- Slight refinement: the spectrum pills are good, keep them. The 4-zone vertical stack is good, keep it.
- Visual cleanup: cards inside steps should have consistent padding and the green/red borders should be subtler (use 1px borders, not 2px)

**Comparison block (Section 6):**

- Same two-column comparison
- Same content verbatim
- Adjust visual weight: left card (standard quiz) is gray-toned, right card (Murphy Method) gets the blue accent border. v1 already does this — keep it but tighten spacing.

**How It Works (Section 7):**

- Same 3-step cards
- **Replace the tiny blurred report mockup** with a larger single-page mockup. Instead of two tiny pages side-by-side with blurred content, show ONE page at ~400px width with real (verbatim from v1) section titles visible: "Your Results", "Your Assigned Pathway", "Your Personalized Guide". Only the patient-identifying details (name, date) should be visually placeholdered with light gray rectangles.
- The report visual should feel like an actual document, not a UI mock with shimmer.

**Testimonials (Section 8, moved up from end):**

- Same testimonials, same content
- **Add specificity to bylines:** since v1 uses generic "Murphy Method™ User · [date]", make a small structural change: add a place for "first name + state" if/when testimonials are submitted. For the prototype, use plausible placeholders ("Sarah M., Arizona" — verbatim only IF those exist in v1 content; otherwise use neutral placeholder identities like "Patient User" — but do not invent fake stories).
- 5-star icons stay
- "Share Your Experience" button stays

**Pricing (Section 9):**

- Same two-card structure, same content
- The "currently $1 for testing" price stays — this is the v1 state and we don't change content
- Trust signal addition: a small row below the pricing cards showing 3 trust indicators — "7-day refund · No subscription · Instantly emailed". Pull copy from v1 FAQ/pricing area if these phrases already exist; otherwise omit (no inventing copy).

**FAQ (Section 10):**

- Same accordion, same Q/A content
- Tighter visual styling — borders only, no shadows

---

### `/how-it-works`

Same content as v1 page (port verbatim). Visual refresh: more whitespace, restructured 3-step process with diagrams. The page should feel like a calm explainer, not a sales page.

### `/about`

Same content as v1. Restructure the bio into clear sections:
- Photo + name + headline credentials (large)
- Origin story (verbatim from v1)
- Credentials list (formal CV-style)
- Philosophy quotes (verbatim from v1)

### `/screener` — Free Screener (REFLOW)

**v1 problems being fixed:**
- "Method Overview" tab is awkwardly nested alongside the STOP-BANG questionnaire on the same step
- Welcome step pitches the paid product before the user has answered a single question
- Locked zone tabs create mobile visual clutter

**v2 flow:**

```
Step 1: Welcome
  ├─ Verbatim intro copy from v1
  ├─ The 3 Murphy Method steps explained (currently in the "Method Overview" tab)
  ├─ The Disclaimer
  └─ Single CTA: "Begin"
  
  ❌ REMOVE the v1 paid-product upsell box at the bottom. This is the wrong moment.

Step 2: STOP-BANG (8 questions)
  └─ Pure questionnaire. No tabs. No upsell. Just the questions.
  ❌ REMOVE the "Method Overview" peer tab — content moved to Step 1.

Step 3: Airway Self-Check — Nose
  └─ Just the nose questions (5 questions). Single section visible.

Step 4: Airway Self-Check — Palate & Tonsils
  └─ Just the palate questions (3 questions).

Step 5: Airway Self-Check — Mandible & Tongue
  └─ Just the mandible questions (3 questions).

Step 6: Airway Self-Check — Neck
  └─ Just the neck questions (3 questions).

Step 7: Results + Email Capture
  └─ Risk score, zones flagged, recommended next step
  └─ ✅ HERE is where the paid assessment upsell appears (earned upsell)
  └─ Email capture field
```

**Critical UX changes:**

- **Each step is its own page-equivalent.** The user can see exactly how far they are: "Step 3 of 7."
- **Top-level progress bar shows real progress:** thin blue fill bar + "Step 3 of 7" label + section name. Persistent at top.
- **No nested tabs anywhere.** v1's "tabs within steps" pattern is gone.
- **Back/Next buttons:** Back is a low-contrast text link top-left of the form. Next is the primary blue button bottom-right. Both visible without scrolling on the questionnaire pages.
- **Auto-save:** Use localStorage to persist progress; if the user closes the tab and returns, they resume where they were. Show a small "Picking up where you left off" notice if state is restored.
- **Zone overview content** (the diagram showing 4 zones from top to bottom) appears once on Step 3 (the first zone step) as a small "Why we ask in this order" disclosure (collapsible), not as a persistent tab.

### `/screener/results`

New dedicated route (vs v1 where results render inside the screener page state).

Structure:
1. Headline: "Your Screening Results" + risk badge (Low/Moderate/High)
2. STOP-BANG breakdown
3. Anatomy zones flagged (visual: the 4-zone stack with positive zones highlighted)
4. Urgency context (verbatim from v1 `getUrgencyInfo`)
5. **Earned upsell card:** "Get your full Murphy Method™ Report" — verbatim copy from v1's `assessment-info.tsx`. Primary CTA: "Get My Full Report — $79" (note: even though v1 currently has the price at $1 for testing, the prototype can show $79 to demonstrate the intended state; or match v1's current price — either is fine, but be consistent).
6. Email capture (verbatim copy from v1)
7. Specialists list (verbatim from v1)
8. Restart button (text link, low contrast)

### `/assessment/info` — Pre-Payment Assessment Info

Restructure v1's bloated info page into a clean confirmation page:

```
[Hero band]
What you get for $79

[Two columns]
LEFT: The 4 sections of the assessment (icons + brief description, verbatim from v1)
RIGHT: What you receive (the bullet list of report contents, verbatim from v1)

[Trust band]
Verbatim trust copy from v1 (7-day refund, no subscription, etc. — only what exists)

[CTA]
"Continue to checkout (prototype) →"

[Below CTA]
Disclaimer (verbatim from v1)
```

### `/assessment/checkout` — Mock Checkout

Since there's no backend, this is a static page that simulates the moment of payment:

```
[Top: "Checkout — Prototype Mode"]
"This prototype does not process real payments. Click below to continue to the assessment."

[Card]
Murphy Method™ Full Assessment Report — $79

[Button]
"Simulate Payment & Continue →"
```

This makes clear to anyone testing that no real money is involved. Clicking the button sets a `localStorage` flag `mock_paid_at` and redirects to `/assessment`.

### `/assessment` — Full Assessment Wizard (MAJOR REFLOW)

**v1's hidden depth problem:** outer wizard says "Step 2 of 4" but Step 2 contains 5 sub-sections, so users have no idea how far they are.

**v2 flow:**

Outer wizard has **11 visible steps**:

```
Step 1:  Welcome (skippable)
Step 2:  Medical History       (8 questions)
Step 3:  BMI Calculator        (2 inputs)
Step 4:  STOP-BANG             (8 questions — pre-fill from screener if present)
Step 5:  Insomnia Severity     (7 questions)
Step 6:  PLATO-11              (11 questions)
Step 7:  Airway — Nose         (5 questions)
Step 8:  Airway — Palate       (3 questions)
Step 9:  Airway — Mandible     (3 questions)
Step 10: Airway — Neck         (3 questions)
Step 11: Treatment Readiness   (PALM section)

→ Results page (separate route: /assessment/report)
```

The progress bar at top shows "Step 5 of 11 — Insomnia Severity" + a thin blue fill bar showing percent complete (using the same `TOTAL_QUESTIONS = 64` calc from v1's ProgressBar component).

**Critical UX changes:**

1. **Welcome step is skippable.** Two options at top:
   - "I've seen this before — start now" (primary)
   - "Show me the method overview" (secondary, expands the educational content inline)
   
   v1's verbatim welcome content stays available — just gated behind the "show me" button so users motivated to start don't have to scroll past it.

2. **Pre-fill from screener.** If the user took the free screener and their answers are in localStorage, pre-fill STOP-BANG answers in Step 4. Show a small banner: "We've kept your screener answers — review and continue."

3. **One section per step.** No tabs nested inside steps. Each clinical instrument is its own discrete, named step. This matches what the user's mental model already expects from "Step X of Y" progress bars.

4. **Save & resume:** Every answer change auto-saves to localStorage. If the user closes the tab and comes back to `/assessment`, they resume at the step they were on. Show a "Resume where you left off?" prompt with "Start over" option.

5. **Step transitions:** Smooth scroll to top of next step. No jarring jumps. Show a brief "Section complete ✓" inline confirmation before the next step renders.

6. **Mobile back button:** Bottom-left of every step. Top progress bar shows the current step name even when scrolled.

7. **Required validation:** Next button is disabled (but visible) until the current step is complete. Show a small grey hint: "Answer all questions to continue."

### `/assessment/report` — Report View

Since there's no real PDF generation, this is a web view of what the report would contain. Structure mirrors the v1 PDF layout described in the business context doc:

```
[Cover band]
Murphy Method™ Assessment Report
Your Assigned Pathway: [Pathway X — Name]
Prepared for: [Name] (or "Patient User" in prototype)
Date: [today]

[Section 1: Your Results]
- Medical History summary
- BMI
- STOP-BANG score + tier
- ISI score + tier  
- PLATO-11 readiness

[Section 2: Where the Airway May Narrow]
- 4-zone visual with flagged zones highlighted

[Section 3: Your Assigned Pathway]
- Pathway letter + name
- Verbatim educational summary from pathway-content.ts

[Section 4: Your Personalized Guide]
- "What your results suggest" (verbatim)
- "Why it matters" (verbatim)
- "What usually works best" (verbatim)

[Section 5: Next Steps & Resources]
- Murphy Method next steps (verbatim)
- Specialist directory links (verbatim)

[Section 6: Print / Download]
- "Print this page" button (uses window.print() with print stylesheet)
- "Email me this report" — disabled with note: "Email delivery is part of the full product"
```

### Pathway pages `/pathways/[a-h]`

Each pathway page should follow the same template (`PathwayNextStepsPage`) as v1 with these visual changes:

- Larger heading typography
- Cleaner card hierarchy for resources
- Same content verbatim from `pathway-content.ts`
- Same `PathwayGuard` component logic — but in prototype mode the guard accepts the `mock_paid_at` localStorage flag as proof of payment

### `/portal` — My Portal

In the prototype, the portal shows a mock state demonstrating the feature without any real auth. Use a clear "Demo Mode" banner at the top.

Layout:
- Recent assessment (mock entry showing pathway X)
- Pathway dashboard link
- Assessment history list (1-2 mock entries)
- Profile section (placeholder)

### Blog, Pricing, Contact, Legal

Static pages. Port content verbatim from v1. Visual refresh only — typography hierarchy, spacing, no decorative elements.

---

## Component Architecture

```
src/
  components/
    layout/
      Layout.tsx              — wraps every page
      Header.tsx              — desktop + mobile nav
      MobileDrawer.tsx        — full-screen mobile menu
      Footer.tsx
      StickyMobileCTA.tsx     — NEW
      ProgressTopBar.tsx      — assessment/screener progress
    forms/
      RadioGroup.tsx          — large, high-contrast radio for older users
      QuestionCard.tsx        — single question wrapper with consistent spacing
      ScaleInput.tsx          — 0-4 Likert scale (for ISI, PLATO)
      BmiInputs.tsx           — height/weight inputs
    ui/                       — shadcn primitives (copy from v1)
    pathway/
      PathwayPageLayout.tsx
      PathwayResourceCard.tsx
    report/
      ReportSection.tsx
      ReportZoneVisual.tsx
      ReportPathwayBlock.tsx
  pages/
    home.tsx
    how-it-works.tsx
    about.tsx
    screener/
      ScreenerLayout.tsx
      Step1Welcome.tsx
      Step2StopBang.tsx
      Step3Nose.tsx
      Step4Palate.tsx
      Step5Mandible.tsx
      Step6Neck.tsx
      Step7Results.tsx
    assessment/
      AssessmentLayout.tsx
      Step1Welcome.tsx
      Step2MedicalHistory.tsx
      Step3Bmi.tsx
      Step4StopBang.tsx
      Step5Isi.tsx
      Step6Plato.tsx
      Step7Nose.tsx
      Step8Palate.tsx
      Step9Mandible.tsx
      Step10Neck.tsx
      Step11Palm.tsx
    assessment-info.tsx
    assessment-checkout.tsx
    assessment-report.tsx
    pathways/
      [a-h].tsx
      PathwayPageTemplate.tsx
    portal.tsx
    pricing.tsx
    blog.tsx
    blog-post.tsx
    contact.tsx
    privacy.tsx
    terms.tsx
    disclaimer.tsx
    rack-card.tsx
  lib/
    content.ts                — VERBATIM from v1
    questionnaires.ts         — VERBATIM from v1
    pathway-content.ts        — VERBATIM from v1
    pathways.ts               — VERBATIM (scoring/assignment)
    scoring.ts                — VERBATIM
    types.ts                  — VERBATIM
    storage.ts                — localStorage helpers (NEW)
    mock-assessments.ts       — sample data for portal demo
  hooks/
    useScreener.ts            — new, cleaner state machine
    useAssessment.ts          — new, cleaner state machine
  App.tsx
  main.tsx
  index.css
```

---

## State Management — Screener & Assessment

Both flows use a single React state object persisted to localStorage. Keys:

- `screener_state_v2` — current step, all answers, computed profile
- `assessment_state_v2` — current step, all answers, computed profile  
- `mock_paid_at` — ISO timestamp set by mock checkout

**Hook shape:**

```ts
const {
  step,                  // current step number
  totalSteps,            // total step count
  stepName,              // human label like "Insomnia Severity"
  percentComplete,       // 0-100
  goNext,
  goBack,
  goToStep,              // for jumping back to a completed step
  isCurrentStepComplete,
  answers,
  setAnswers,
  profile,               // computed only on goToResults()
  reset,
  hasResumableState,
} = useAssessment()
```

The `useAssessment` and `useScreener` hooks should compute scoring on-demand by calling the verbatim-ported functions from `lib/scoring.ts`.

---

## Accessibility Requirements (mandatory for this audience)

The target audience skews older. Accessibility is not optional.

1. **All text minimum 17px body, 15px small.** Nothing smaller than 13px except legal fine print.
2. **All interactive elements minimum 48×48px tap target.**
3. **Color contrast minimum WCAG AA (4.5:1 for body, 3:1 for large text).** The blue + white combinations need to be verified.
4. **All form inputs have visible labels** (not just placeholder text — placeholders disappear and confuse older users).
5. **Radio buttons should look like buttons.** Large clickable cards with clear selected state, not tiny radio dots. Selected state = blue background + checkmark.
6. **Focus rings are visible.** A 2px solid blue outline on any focused element. No `outline: none`.
7. **No relying on hover for critical information.** Mobile users have no hover.
8. **Semantic HTML.** Real `<button>`, `<nav>`, `<main>`, `<form>`, `<label>` elements.
9. **Skip-to-content link** at top of every page (visually hidden until focused).
10. **Page titles update** on route change.

---

## What to Skip / Stub in the Prototype

These v1 features are explicitly out of scope:

- ❌ Stripe payment processing — replaced with mock checkout page
- ❌ Email delivery (Resend) — replaced with "Email sent ✓" mock confirmation
- ❌ PDF generation (Puppeteer) — replaced with web view of report
- ❌ Database (PostgreSQL/Neon) — replaced with localStorage
- ❌ Replit Auth — portal works in demo mode only
- ❌ Admin panel — not needed for UX evaluation
- ❌ Real testimonial submission — form shows "Thank you" toast then closes (no real submit)
- ❌ Real Apple Watch / referral source tracking (`?ref=watch`, `?src=watch`) — keep the URL param logic if simple, otherwise drop
- ❌ Real analytics

---

## Setup Instructions for Claude Code

When you receive this brief plus the v1 codebase, follow this order:

### Phase 1: Project setup
```bash
mkdir sleepcheckup-v2 && cd sleepcheckup-v2
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install wouter lucide-react clsx tailwind-merge
npm install -D @types/node
# shadcn/ui primitives — copy needed ones from v1's client/src/components/ui/
```

### Phase 2: Port verbatim content
1. Copy `content.ts`, `questionnaires.ts`, `pathway-content.ts`, `pathways.ts`, `scoring.ts`, `types.ts` from v1 to `src/lib/`
2. Copy needed shadcn `ui/` components from v1
3. Copy image assets from v1 (`Murphy-14_*.jpg`, hero image, anatomy diagrams, logos)

### Phase 3: Build layout + tokens
1. `tailwind.config.js` — extend theme with the design tokens above
2. `index.css` — global resets, font imports, tokens as CSS variables
3. `Layout.tsx`, `Header.tsx`, `MobileDrawer.tsx`, `Footer.tsx`, `StickyMobileCTA.tsx`

### Phase 4: Build home page
The reordered home page with all 10 sections, verbatim copy, new visual treatment.

### Phase 5: Build screener flow
7 separate step components, top progress bar, results page.

### Phase 6: Build full assessment flow  
11 separate step components, progress bar with named steps, results page.

### Phase 7: Build remaining pages
Pathway pages (template + 8 instances), portal, legal, etc.

### Phase 8: QA pass
- Run `npm run dev`, click every page, every step.
- Verify scoring outputs match v1 (load identical answers in both, compare assigned pathway).
- Verify zero copy changes vs v1 (diff the content strings).
- Mobile viewport check at 375×667 (iPhone SE) and 414×896 (iPhone 11).
- Lighthouse accessibility audit — should be 95+.

---

## Acceptance Criteria

The variant is done when:

- [ ] Every page route works locally on `npm run dev`
- [ ] Every word of every headline, FAQ, testimonial, question, and answer matches v1 verbatim
- [ ] Every clinical instrument (STOP-BANG, ISI, PLATO-11, Medical History, Zones, PALM) produces identical scores to v1 for identical inputs
- [ ] Pathway assignment produces identical letter (A–H) to v1 for identical inputs
- [ ] Home page section order matches the new order in this brief
- [ ] Full assessment shows 11 visible top-level steps (not 4 with hidden depth)
- [ ] Screener shows 7 visible top-level steps (not 5 with tabs)
- [ ] No tabs nested inside wizard steps anywhere
- [ ] Sticky mobile CTA visible on home page mobile
- [ ] Dr. Murphy section is position 3 on home page (not position 7)
- [ ] localStorage persistence works for both flows (close tab, reopen, resumes)
- [ ] All text body 17px+, all tap targets 48px+
- [ ] No console errors in browser dev tools on any page

---

## One final note for Claude Code

The v1 site is a legitimate clinical product. The job of this variant is to test whether the same content presented with better structure and visual hierarchy converts better and feels more trustworthy. Resist the temptation to "improve" copy that reads awkwardly — the founder (a Stanford physician) wrote it deliberately and any wording critique is out of scope for this build. Your only levers are structure, visual hierarchy, spacing, typography, and flow.

When in doubt about a layout decision, ask yourself: "Would a 58-year-old patient who just got an Apple Watch notification at 11pm understand exactly what to do on this screen?" If the answer is anything less than "obviously yes," simplify further.

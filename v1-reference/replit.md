# SleepCheckup.com — Murphy Method™ Pre-Visit Intelligence Report

## Overview
SleepCheckup.com is a premium diagnostic report service built around the Murphy Method™, developed by Dr. Michael P. Murphy, MD, MPH — a dual board-certified Stanford sleep physician. The business model is a high-converting free-to-paid funnel:
- **Free 3-minute screener** → captures email, creates urgency
- **$79 full assessment** → delivers a personalized, beautifully designed PDF report (one of 8 Murphy Method™ pathways)
- **Optional portal** — users can set up My Portal after payment to save history, track retakes, access resources

## Business Model
- One-time $79 payment via Stripe
- Free screener → email capture → upgrade CTA
- PDF report emailed immediately after completing full assessment
- Optional portal setup offered post-payment (zero friction before payment)
- Portal: assessment history archived on retake, pathway resources, profile
- No subscriptions, no recurring billing

## User Preferences
- **Credibility is paramount**: Dr. Murphy's credentials, Stanford affiliation, and the PDF quality signal legitimacy
- **Conversion-first**: No friction before payment. No account creation before payment.
- **Copy principles**: Meet them emotionally first. Never say "diagnose." Stanford as signal not brag.
- **PDF is the product**: Everything drives to the report. Design matters.

## Admin Panel
- URL: `/admin` — requires Replit login as admin (user ID `50344991`)
- **Tabs:**
  - **Resources** — Add/edit/delete pathway content (videos, articles, products, specialists) per pathway
  - **Testimonials** — Add/edit/delete DB-backed testimonials; active ones appear on the home page (overrides `content.ts` defaults)
  - **Subscribers** — View email subscribers
  - **Analytics** — Assessment counts, pathway distribution, subscriber sources
  - **Site Copy** — Edit Home FAQs, How It Works FAQs, and pathway card descriptions; saves to `data/site-copy.json`

## Site Architecture

### Navigation
Logo | Home | How It Works | About Dr. Murphy | [My Portal — auth only] | [Admin — auth only] | [Start Free Screening — CTA]
- My Portal and Admin only appear when logged in (or in dev mode)

### Pages
- `/` — Home (9-section conversion page)
- `/how-it-works` — Expanded 3-step process with assessment section breakdown
- `/about` — Full Dr. Murphy biography page
- `/screening` — Free 3-minute screener (no account required)
- `/assessment/info` — Full assessment info/gate
- `/assessment` — Full assessment wizard
- `/blog` — Blog listing (4 SEO-targeted posts planned)
- `/blog/:slug` — Individual blog post
- `/contact`, `/privacy`, `/terms`, `/disclaimer` — Legal/utility pages

### Portal
- `/portal` — My Portal (maps to `my-pathway.tsx`): shows assessment history, pathway dashboard, retake CTA, profile
  - Unauthenticated: shows demo mode (Jane Doe sample data) with login prompt
  - Post-payment: portal setup prompt shown before assessment starts (set up or skip)
  - History: all past assessments archived, shown chronologically

### Removed from MVP
- `/pathways` (explore pathways)
- `/pathways/:letter` (individual pathway pages)
- `/community`
- `/resources`
- `/admin/resources`
- `/pricing` (pricing is on home page)
- Login/authentication from nav

## Assessment Flow

### Free Screener (/screening)
1. User clicks "Start Free Screening" — no account, no login
2. STOP-BANG questionnaire
3. Airway zone self-check (4 zones)
4. Results page showing:
   - STOP-BANG score + risk level
   - Airway zones flagged
   - Pathway teaser statement
   - **Email capture field** (saves to localStorage + server)
   - **CTA: "Get My Full Report — $79"**

### Full Assessment (post-email + Stripe payment)
1. User clicks "Get My Full Report — $79"
2. Stripe checkout ($79 one-time, email pre-filled)
3. Payment completes → assessment continues
4. On completion → PDF generated and emailed instantly
5. Confirmation page
- **No portal. No account. No password.**

## PDF Report (Most Important Deliverable)
The report is a professionally designed PDF. Structure:
1. Cover page (pathway name, Dr. Murphy credentials, patient name, date)
2. Results summary (visual gauge, scores, top 3 findings)
3. Pathway explained (anatomy, clinical pattern, why it exists)
4. Risk profile (cardiovascular, metabolic, daytime function)
5. Treatment options for pathway
6. Doctor visit prep sheet (questions, tests to request, red flags)
7. Back cover (About Murphy Method™, disclaimer)

## Technical Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Routing**: wouter
- **Data fetching**: TanStack Query v5
- **Payment**: Stripe (to be integrated — $79 one-time)
- **Email/PDF**: SendGrid + Puppeteer (to be integrated)

## UI/UX Decisions
- **Branding**: `sleepcheckup.com` with `Murphy Method™` as the core product brand
- **Legal entity**: Sleep Check Up, Inc. (in footer and legal pages)
- **Color Scheme**: Deep navy blue primary (HSL 215 45% 30%)
- **Hero URL variants**: `/?ref=watch` for Apple Watch landing, `/?ref=snoring` for snoring landing
- **Mobile-first**: Apple Watch notification user is on their phone

## External Dependencies
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn UI
- TanStack Query v5
- PostgreSQL (Neon) + Drizzle ORM
- wouter (routing)
- Stripe (payment — pending integration)
- SendGrid (email — pending integration)
- Puppeteer or DocRaptor (PDF generation — pending integration)

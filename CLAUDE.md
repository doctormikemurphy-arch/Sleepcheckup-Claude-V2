# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # TypeScript check + Vite production build → dist/
npm run lint       # ESLint
npm run preview    # Serve the dist/ build locally
```

Deploy: push to `main` on GitHub — Vercel auto-deploys to sleepcheckup.com.

## Architecture

### App type
React 19 SPA (Vite + TypeScript). Routing via **Wouter** (`<Switch>` / `<Route>`). No backend server — all dynamic logic runs client-side; serverless functions live in `api/`.

### Two core user flows

**1. Free Screener** (`/screener`) — 7 steps
- State managed by `src/hooks/useScreener.ts`
- Persisted to `localStorage` under key `screener_state_v2`
- Scores STOP-BANG + 4 airway zones; produces a `ScreeningProfile`
- Results page at `/screener/results`

**2. Full Assessment** (`/assessment`) — 11 steps, requires payment
- State managed by `src/hooks/useAssessment.ts`
- Persisted to `localStorage` under key `assessment_state_v2`
- Pre-fills STOP-BANG and zone answers from screener when coming from `?from=screener`
- Steps: Welcome → Medical History → BMI → STOP-BANG → ISI → PLATO-11 → Nose → Palate → Mandible → Neck → PALM
- On finish, `computeAndFinish()` runs all scoring functions and calls `assignMurphyPathway()` to assign one of 8 pathways (A–H)
- Payment gated: `localStorage` key `paid_session_v2` is set by `api/verify-payment.ts` after Stripe checkout

### Pathway assignment
`src/lib/pathways.ts` — `MURPHY_PATHWAYS` defines all 8 pathways (A–H). `assignMurphyPathway(profile)` contains the clinical decision logic that maps a scored `PatientProfile` to a pathway ID.

### Scoring
`src/lib/scoring.ts` — pure functions: `scoreStopBang`, `scoreIsi`, `scorePlato`, `scoreZones`, `scoreMedicalHistory`, `scoreAnatomy`, `scorePalm`. Each takes answers and returns structured scores.

### Content / copy
**All user-facing text lives in `src/lib/content.ts`** — single source of truth for headlines, body copy, FAQ, pricing, pathway labels, and nav links. Pages import from this file rather than hardcoding strings.

### Styling
- Design tokens defined as CSS custom properties in `src/index.css` (colors, fonts, radii, shadows)
- Tailwind for utility classes
- `@` alias resolves to `src/` (configured in `vite.config.ts`)
- Fonts: **Fraunces** (serif, display) and **Inter** (sans, body)
- Shadcn/Radix UI primitives in `src/components/ui/`

### API routes (Vercel serverless)
Located in `api/` — deployed as Vercel Edge/Node functions:
- `create-checkout-session.ts` — creates a Stripe Checkout session; `PRICE_CENTS` constant sets the charge amount
- `verify-payment.ts` — verifies Stripe session after redirect, sets paid session
- `submit-assessment.ts` — sends the PDF report email via Resend
- `screener-submit.ts` — handles screener email capture

### Auth
Clerk (`@clerk/clerk-react`). `VITE_CLERK_PUBLISHABLE_KEY` must be set. Used for the patient portal (`/portal`).

### Environment variables
See `.env.example`:
- `VITE_CLERK_PUBLISHABLE_KEY` — browser-safe, prefixed with `VITE_`
- `STRIPE_SECRET_KEY` — server-side only (never expose to client)
- `RESEND_API_KEY` — server-side only

### Storage keys
All `localStorage` keys are defined in `src/lib/storage.ts` under the `KEYS` constant.

### `v1-reference/`
Old V1 codebase kept for reference only. **Do not edit files in this directory.**

## Project rules

**Assessment content is locked.** Never change question text, pathway educational summaries, scoring logic, or clinical copy. This includes anything in `src/lib/scoring.ts`, `src/lib/pathways.ts`, `src/lib/questionnaires.ts`, and the pathway/question content sections of `src/lib/content.ts`. The only permitted changes to `content.ts` are to UI labels, pricing, and marketing copy — not to clinical or assessment text. Visual and styling changes are always fine.

**This is a solo, after-hours project run by a non-developer.** Before making any change, explain in plain language what the change is, why it's needed, and what file it touches. Make one small change at a time. Prefer reversible edits. Do not batch unrelated changes into a single step.

**The admin panel is internal only.** The route `/admin` and everything in `src/pages/admin/` contains internal business strategy (Lean Startup roadmap, experiment tracking, metrics). It must never be linked from any public page, referenced in any public-facing copy, or made more discoverable. Confirm before making any change that touches the admin route or its content.

**Warn before any `git push` to main.** This repository's `main` branch auto-deploys to sleepcheckup.com via Vercel. Before running `git push`, explicitly confirm with the user that the changes are ready for the live site.

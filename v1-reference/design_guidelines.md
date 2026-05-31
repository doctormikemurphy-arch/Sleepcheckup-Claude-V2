# Murphy Method™ Sleep Pathways - Design Guidelines

## Design Approach

**Selected Approach:** Assessment-First Clinical Platform
A modern clinical website built around the Murphy Method™ Sleep Pathways Assessment. The design prioritizes trust, clarity, and conversion to assessment completion while providing a pathway-aware post-assessment experience.

**Core Principles:**
- Assessment is the gateway - optimize for start + completion
- Deep medical blue as primary brand color
- Modern clinical aesthetic (credible, calm, legible)
- NOT wellness, NOT playful - serious medical feel
- Information clarity over visual flair
- Accessibility and readability first

---

## Brand Colors

**Primary (Deep Medical Blue):**
- Light mode: hsl(210, 85%, 42%) - #1a5fb4
- Dark mode: hsl(210, 85%, 55%) - #3584e4
- Use for: CTAs, headings, accents, icons, links

**Supporting Palette:**
- Background: Pure white (light) / Near black (dark)
- Cards: Slight off-white for depth
- Muted text: Desaturated blue-gray
- Success: Green for positive indicators
- Warning: Amber for attention states
- Error: Red for critical states

**Color Usage Rules:**
- Primary blue dominates CTAs and key UI elements
- Avoid bright gradients or playful colors
- Keep contrast high for readability
- Use color sparingly - let content breathe

---

## Typography

**Font Selection:**
- Primary: Inter or system sans-serif
- Headings: 600-700 weight
- Body: 400 weight
- Emphasis: 500 weight

**Hierarchy:**
- H1 (Hero/Page Titles): 48px / 3rem, bold - impact statements
- H2 (Section Headers): 32px / 2rem, semibold
- H3 (Subsections): 24px / 1.5rem, semibold
- H4 (Card Headers): 20px / 1.25rem, semibold
- Body Text: 16px / 1rem, regular
- Small Text: 14px / 0.875rem, regular
- Labels: 14px / 0.875rem, medium

**Line Height:** 1.6 for body text, 1.3 for headings

---

## Layout System

**Website Shell:**
- Minimal header with logo and sparse navigation
- Consistent footer across all pages
- Assessment page: header only, minimal distraction
- Post-assessment pages: full navigation

**Spacing Units:** Tailwind scale
- Tight: 2-4 (8-16px)
- Standard: 6-8 (24-32px)
- Section: 12-16 (48-64px)
- Hero: 20-24 (80-96px)

**Container Widths:**
- Full-width header/footer
- Content: max-w-6xl (1152px) for landing pages
- Assessment: max-w-4xl (896px) for focused flow
- Text blocks: max-w-3xl (768px) for readability

---

## Page Templates

### Homepage (Pre-Assessment)
- Minimal, focused design
- Hero with single powerful headline
- One dominant CTA: "Start the Assessment"
- Trust cues below fold (credentials, evidence)
- Sparse - don't distract from main action

### How It Works
- 3-step visual explanation
- Clean iconography
- CTA repeated at bottom

### Assessment Page
- Assessment runs unchanged
- Wrapped in minimal shell (header only)
- "View Next Steps" link in header for post-completion

### Results Hub
- Pathway-aware personalization
- Clear pathway display with explanation
- Next steps CTAs
- Save/login prompt (optional)

### Pathway Pages
- Consistent structure across all 9 pathways
- Educational content
- Next step categories (Learn, Consider, Consult)
- Retake and export CTAs

### Legal Pages
- Simple typography-focused layouts
- Standard disclaimer language

---

## Component Library

### Navigation
**Header:**
- Logo left
- Minimal nav links center/right
- CTA button right (context-aware)
- Sticky on scroll (optional)

**Footer:**
- Logo + tagline
- Quick links
- Legal links
- Educational disclaimer

### Buttons
**Primary:**
- Deep blue background
- White text
- Large touch target (h-12 minimum)
- Strong visual weight

**Secondary:**
- Outline style
- Blue border and text
- Transparent background

**Ghost:**
- No border
- Blue text only
- Subtle hover state

### Cards
- Clean white background
- Subtle border
- Rounded corners (rounded-lg)
- Consistent padding (p-6)
- Optional hover elevation for interactive cards

### Trust Elements
- Credential badges (board-certified, evidence-based)
- Small, tasteful, not overbearing
- Positioned to support, not distract

---

## Responsive Behavior

**Mobile (< 768px):**
- Stack all content vertically
- Full-width CTAs
- Hamburger menu if needed
- Large touch targets

**Tablet (768px - 1024px):**
- Two-column layouts where appropriate
- Centered containers

**Desktop (> 1024px):**
- Max-width containers
- Generous whitespace
- Side-by-side layouts for comparisons

---

## Accessibility

- WCAG AA contrast ratios
- Focus states on all interactive elements
- Keyboard navigation
- Semantic HTML
- Skip-to-content links
- Large readable text (16px minimum)
- Touch targets 48px minimum

---

## Tone & Copy

**Voice:**
- Direct, reassuring, non-salesy
- Avoid hype language
- Educational framing

**Key Messages:**
- "Sleep apnea is not one-size-fits-all"
- "Pathway-based approach"
- "Educational purposes only"
- "Consult a clinician"

**Avoid:**
- Medical claims
- Diagnostic language
- Pressure or urgency tactics
- Playful or casual tone

---

## Animations

**Minimal and purposeful:**
- Page transitions: Simple fade (200ms)
- Button hover: Subtle elevation
- No scroll animations or parallax
- Fast, responsive feel

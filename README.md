# Handoff: Carter Twitty Landing Page

## Overview

A single-page, long-scroll marketing site for **Carter Twitty**, a movement coach launching a 9-week 1:1 integrated mentorship program called **"The Foundation"** (positioned as *"Practice the how of doing everything in your life with quality"*).

**Primary goal:** Convert warm Instagram followers (@cartertwitty) into Discovery Call bookings via a single primary CTA that links to an external Cal.com / Calendly URL.

**Tone:** Editorial, restrained, serif-driven. Not fitness-influencer energy. Think: quiet authority, depth, dark-mode brand.

## About the Design Files

The files in this bundle (`carter.html`, `carter.css`, and the `src/` JSX files) are a **design reference prototype**, built as a single-page React-in-Babel HTML app. They are the visual and behavioral source of truth — **not production code to ship directly**.

**The task:** Rebuild this design in a production environment. Recommended target stack is **Astro** (static output, fastest, perfect for a one-pager) deployed to **Vercel**. Next.js is also fine. Port each section to its own `.astro` (or `.tsx`) component. Preserve the exact design system, copy, animations, and Tweaks behavior.

## Fidelity

**High-fidelity.** All colors, typography, spacing, interactions, and copy are final. The developer should recreate pixel-perfectly and preserve motion behavior (parallax, reveals, cursor aura, scroll progress, testimonial carousel).

## Design System (locked — do not deviate)

### Colors
| Token | Value | Usage |
|---|---|---|
| `--bg-0` | `#0F0F0F` | Page background, hero, story, program, final CTA, footer |
| `--bg-1` | `#1A1A1A` | Alternating section bg (problem, fit) |
| `--bg-card` | `#222222` | Card backgrounds (program cards, portrait placeholder) |
| `--text` | `#F0ECE4` | Primary text (warm off-white) |
| `--text-dim` | `#A8A29E` | Secondary text, body copy |
| `--text-faint` | `rgba(168,162,158,0.5)` | Tertiary / metadata |
| `--accent` | `#D4843E` *(user-tweaked from default `#E87534`)* | Single accent color — CTAs, eyebrows, accent lines |
| `--accent-hover` | `#F58A4A` | Hover state |
| `--divider` | `rgba(240,236,228,0.08)` | Subtle dividers |
| `--divider-strong` | `rgba(240,236,228,0.14)` | Emphasized dividers |

### Typography
- **Display / headings:** Playfair Display (400, 500, 600; italic 400/500) — loaded from Google Fonts
- **Body / UI:** Inter (300, 400, 500, 600, 700)
- **Mono / metadata:** JetBrains Mono (400, 500)
- Tweaks also expose Fraunces and Cormorant Garamond as heading alternatives

### Type scale (clamped for responsive)
- Hero H1: `clamp(2.6rem, 6.4vw, 5.2rem)`, weight 400, line-height 1.02, letter-spacing -0.015em
- Section heading H2: `clamp(2rem, 4.2vw, 3rem)`, weight 400, line-height 1.15
- Body: 1.05rem, weight 300, line-height 1.7
- Eyebrow: 0.7rem, uppercase, letter-spacing 0.22em
- Meta labels: 0.7rem JetBrains Mono, uppercase, letter-spacing 0.14em

### Spacing / layout
- Section padding: `7rem 2rem` (reduces on mobile)
- Containers: `max-width: 720px` (narrow), `1040px` (wide)
- Grid: 2-column program grid, 2-column fit columns (collapse to 1col below 820px / 720px)

## Sections (top to bottom)

1. **Nav** — fixed; logo ("Carter Twitty" with italic surname), 3 anchor links, Apply CTA. Backdrop blur. Active-section underline. Shrinks padding on scroll.
2. **Scroll progress bar** — fixed, top of viewport, 2px, accent color with glow.
3. **Hero** — 3 variants exposed via Tweaks:
   - **Split** (default): left = headline + sub + CTAs + meta row; right = Carter's portrait (`assets/carter-portrait.jpg`, 4:5, grayscale(0.1), with corner accent marks and bottom vignette).
   - **Centered**: stacked centered.
   - **Full-bleed**: large stage with placeholder inside.
   - Parallax: grid lines + portrait shift on scroll via `--hero-parallax` CSS var.
4. **Story (The Origin)** — long-form narrative, ends in a pull-quote with orange left border.
5. **Problem (Sound Familiar?)** — 5-item numbered list, monospace numerals, hover shifts padding-left.
6. **Program (The Foundation)** — 4 cards in 2x2 grid + 4-item meta row (9 weeks, 1:1, Custom Programming, Direct Access). Cards have monospace "01/04" counter, serif title, dim body.
7. **Fit (Is This For You?)** — 2 columns: "This is for you if" (orange, dashes) vs "This is not for you if" (dim, × marks).
8. **Testimonials** — auto-advancing carousel (7s interval), 3 placeholder slides, dots + arrow nav. **Clearly tagged as placeholder pending real testimonials.** Toggle-able via Tweaks.
9. **Final CTA** — centered headline, lede, Apply button, 3-column stats row.
10. **Footer** — name, IG/Substack/Apply links, © line.

## Interactions & Motion

- **Reveal on scroll**: `.reveal` elements fade up (32px) with ease-out cubic-bezier, IntersectionObserver at 12% threshold, rootMargin `-40px`. Stagger delays via `.reveal-delay-1` through `-4`.
- **Cursor aura**: 520px radial gradient blob follows cursor with lerp smoothing (0.08), mix-blend-mode screen. Disabled in minimal-motion mode.
- **Hero parallax**: scroll multiplies into `--hero-parallax` CSS var (up to -60px), portrait moves at 0.25x, grid lines at 1x.
- **Nav active section**: `useActiveSection` hook computes current section from `window.scrollY + 140` offset.
- **Nav scrolled state**: `.nav.scrolled` added when `scrollY > 40`.
- **Testimonial auto-advance**: 7s interval, pauses when user clicks dot/arrow.
- **Scroll position persistence**: `window.scrollY` saved to `localStorage` key `carter_scroll`, restored on load (for iterative editing convenience).
- **All CTAs** use `window.open` or `<a target="_blank">` to external `bookingUrl` — currently a Calendly placeholder; **replace with Carter's actual Cal.com URL**.

## Copy (exact — do not rewrite)

All body copy is finalized in `src/sections.jsx`. Every headline, list item, testimonial (placeholder), and meta label is intentional. Do not paraphrase during the port.

## Tweaks System

The prototype exposes a toolbar-activated Tweaks panel bottom-right. These are **author-time design controls**, not end-user features. In production they can be dropped OR kept as a hidden admin panel. Exposes:
- Accent color (5 swatches)
- Hero layout (Split / Centered / Full-bleed)
- Heading font (Playfair / Fraunces / Cormorant)
- Motion level (Tasteful / Minimal)
- Testimonials show/hide
- Uses `postMessage` protocol (`__edit_mode_available`, `__activate_edit_mode`, `__edit_mode_set_keys`) that is specific to this prototype environment — safe to drop on port.

## State

- `tweaks` object — persisted via postMessage protocol in prototype; in production, either hard-code or wire to a CMS.
- `activeSection` — derived from scroll.
- `scrollProgress` — derived from scroll.
- `testimonialIndex` — local carousel state.

## Assets

- `assets/carter-portrait.jpg` — real photo of Carter, 3024×4032. Treated with grayscale(0.1), contrast(1.03), and a bottom-to-center dark vignette + subtle orange radial in the top-left corner.

## External Services

- **Booking URL**: placeholder `https://calendly.com/cartertwitty/discovery` — replace with Carter's real Cal.com or Calendly link before launch.
- **Instagram**: `https://www.instagram.com/cartertwitty`
- **Substack**: `https://substack.com/@cartertwitty`

## Files in this handoff

- `carter.html` — entry HTML with font imports, tweak defaults, and React/Babel script tags
- `carter.css` — complete stylesheet (~25KB, all custom properties + all sections)
- `src/sections.jsx` — all section components (Nav, Hero variants, Story, Problem, Program, Fit, Testimonials, FinalCTA, Footer) + reveal/scroll hooks
- `src/tweaks.jsx` — TweaksPanel + useTweaks hook + hex-alpha helper
- `src/app.jsx` — root App component wiring everything together
- `assets/carter-portrait.jpg` — hero portrait photo

## Recommended port path (Astro)

```bash
npm create astro@latest cartertwitty-site -- --template minimal --typescript strict
cd cartertwitty-site
npm install
# Drop this handoff folder inside as /reference/
# Ask Claude Code to port each .jsx section into an .astro component
# Keep the exact CSS (can be imported as global stylesheet)
# Images go in /public/
npm run dev
```

Then deploy via Vercel (connect GitHub repo, one-click deploy). Add custom domain in Vercel dashboard. Total time from scratch to live: ~2 hours.

## Do not ship

- The inline React+Babel approach in `carter.html` — fine for prototyping, slow for production. Port to Astro components.
- The placeholder testimonials — clearly labeled as placeholder; remove or replace with real ones before launch.
- The placeholder booking URL.

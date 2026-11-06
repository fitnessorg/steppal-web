# Contributor tasks

Open work on the site. Everything here is scoped to a single file or a single
page — this repo is small on purpose.

---

## Good first issues

*(All current initial Good First Issues have been completed! Check the scoped Features or codebase `TODO(contributor)` comments for next opportunities.)*

---

## Features

### Durable waitlist storage
**File:** `src/lib/waitlist.ts` · **Difficulty:** medium

The memory store loses signups on redeploy and the Resend path is untested
against the live API. Add a third store that posts to steppal-core, so signups
land in the same Postgres as everything else, and pick it up from an env var
like the others.

**Done when:** signups survive a redeploy, and the memory store is still the
default so the repo runs with no configuration.

### Double-submit protection on the client
**File:** `src/components/sections/Waitlist.tsx` · **Difficulty:** easy

The button disables while sending, but a fast double-tap on a slow connection
can still fire twice. The server dedupes, so this is cosmetic — but the second
request burns a rate-limit slot.

### A changelog page
**Difficulty:** medium

Three repos are moving and there is nowhere that says what shipped. Read the
GitHub releases API at build time and render them.

---

## Performance and quality

### Tests for the components
**Difficulty:** medium

The existing tests cover `src/lib`, performance isolation, and SEO/OG generators.
The interactive components most likely to break silently are the theme toggle's store
(it has a server snapshot and a storage listener) and the waitlist form's state machine.

---

## Completed

- **Custom branded 404 page** (`src/app/not-found.tsx`): On-brand recovery view with typography tokens, frame borders, and direct recovery paths.
- **Anchor links on document pages** (`src/components/Prose.tsx`): Auto-slugging heading IDs and hover/focus permalink anchors (`#`) across `/architecture`, `/contribute`, `/privacy`, and `/terms`.
- **Keyboard focus audit**: Accessible tablist navigation and keyboard controls in `Showcase.tsx`, high-contrast `:focus-visible` using `var(--color-flame)` that preserves element curvature, and frame-offset skip links.
- **Dynamic Open Graph & social card generation** (`src/app/opengraph-image.tsx`, `src/app/architecture/opengraph-image.tsx`, `src/app/contribute/opengraph-image.tsx`): Built with Next.js `ImageResponse` using signature flame frames, brand tokens, and route-specific metadata badges.
- **Split motion out of document pages** (`src/app/layout.tsx`, `src/app/page.tsx`): Decoupled `SmoothScroll` (Lenis + GSAP RAF loop) from the root shell, mounting it only on the landing page while prose document routes run pure native scrolling.
- **Lighthouse & asset optimization pass**: Compressed hero mark from 218KB to 87KB (~60% reduction), scoped display font (`Unbounded`) strictly to interactive routes, and configured modern AVIF/WebP image formats in `next.config.ts`.



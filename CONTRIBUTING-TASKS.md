# Contributor tasks

Open work on the site. Everything here is scoped to a single file or a single
page — this repo is small on purpose.

---

## Good first issues

### Open Graph images
**File:** `src/app/opengraph-image.tsx` (new) · **Difficulty:** easy

Links to the site unfurl with no image. Add a generated OG image using Next's
`ImageResponse`, and a per-page one for `/architecture` and `/contribute`.

**Done when:** a shared link shows a StepPal card rather than a bare title.

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

### Lighthouse pass
**Difficulty:** medium

Never measured. Likely suspects: the hero PNG is 218KB and unoptimised, three
variable font families load on every page including the document pages that
only need two, and GSAP plus Lenis are in the bundle of pages with no motion.

**Done when:** there is a recorded baseline and at least the font and image
wins are taken.

### Split motion out of the document pages
**File:** `src/app/layout.tsx` · **Difficulty:** medium

`SmoothScroll` mounts on every route, including `/privacy`, which has nothing
to scroll-animate. Move it to the landing page, or make it a route group.

### Tests for the components
**Difficulty:** medium

The 15 existing tests cover `src/lib` only. The parts most likely to break
silently are the theme toggle's store (it has a server snapshot and a storage
listener) and the waitlist form's state machine.

---

## Completed

- **Custom branded 404 page** (`src/app/not-found.tsx`): On-brand recovery view with typography tokens, frame borders, and direct recovery paths.
- **Anchor links on document pages** (`src/components/Prose.tsx`): Auto-slugging heading IDs and hover/focus permalink anchors (`#`) across `/architecture`, `/contribute`, `/privacy`, and `/terms`.
- **Keyboard focus audit**: Accessible tablist navigation and keyboard controls in `Showcase.tsx`, high-contrast `:focus-visible` using `var(--color-flame)` that preserves element curvature, and frame-offset skip links.


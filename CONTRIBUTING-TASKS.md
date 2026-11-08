# Contributor tasks

Open work on the site. Everything here is scoped to a single file or a single
page — this repo is small on purpose.

---

## Good first issues

*(All current initial Good First Issues have been completed! Check the scoped Features or codebase `TODO(contributor)` comments for next opportunities.)*

---

## Features

### A changelog page
**Difficulty:** medium

Three repos are moving and there is nowhere that says what shipped. Read the
GitHub releases API at build time and render them.

---

## Performance and quality

*(All initial Performance and Quality tasks have been completed!)*

---

## Completed

- **Custom branded 404 page** (`src/app/not-found.tsx`): On-brand recovery view with typography tokens, frame borders, and direct recovery paths.
- **Anchor links on document pages** (`src/components/Prose.tsx`): Auto-slugging heading IDs and hover/focus permalink anchors (`#`) across `/architecture`, `/contribute`, `/privacy`, and `/terms`.
- **Keyboard focus audit**: Accessible tablist navigation and keyboard controls in `Showcase.tsx`, high-contrast `:focus-visible` using `var(--color-flame)` that preserves element curvature, and frame-offset skip links.
- **Dynamic Open Graph & social card generation** (`src/app/opengraph-image.tsx`, `src/app/architecture/opengraph-image.tsx`, `src/app/contribute/opengraph-image.tsx`): Built with Next.js `ImageResponse` using signature flame frames, brand tokens, and route-specific metadata badges.
- **Split motion out of document pages** (`src/app/layout.tsx`, `src/app/page.tsx`): Decoupled `SmoothScroll` (Lenis + GSAP RAF loop) from the root shell, mounting it only on the landing page while prose document routes run pure native scrolling.
- **Lighthouse & asset optimization pass**: Compressed hero mark from 218KB to 87KB (~60% reduction), scoped display font (`Unbounded`) strictly to interactive routes, and configured modern AVIF/WebP image formats in `next.config.ts`.
- **Durable steppal-core waitlist storage** (`src/lib/waitlist.ts`): Pluggable backend store posting to `steppal-core` with HTTP 409 Conflict deduplication, surviving redeploys while keeping in-memory default for 0-config clones.
- **Double-submit client protection** (`src/components/sections/Waitlist.tsx`): Synchronous submission lock and disabled state machine preventing rapid double-taps on slow mobile networks from consuming rate-limit slots.
- **Component & state machine test suite** (`test/theme-toggle.test.tsx`, `test/waitlist-component.test.tsx`, `test/navigation-and-showcase.test.tsx`): Full test coverage of the theme toggle's external store, server snapshots, storage listeners, waitlist form state transitions, and navigation landmarks.



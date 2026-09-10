# Contributor tasks

The site is built to ~65% on purpose. What's below is the rest — real work, not
busywork. Each maps to a `TODO(contributor):` marker in the code.

File these as GitHub issues with the difficulty as a label.

---

## Easy

### Wire up waitlist submission
**File:** `src/components/sections/Waitlist.tsx`

The form validates and manages its own state, but nothing is persisted. Add a
route handler at `src/app/api/waitlist/route.ts` that stores the address (Resend
audience, or a table in `steppal-core`). Handle duplicate signups gracefully and
surface real errors in the UI rather than always showing success.

### Add the favicon and OG image
**Files:** `src/app/icon.tsx`, `src/app/opengraph-image.tsx`

Metadata is declared in `layout.tsx` but there's no actual image. Build a
generated OG card using `next/og` — the wordmark on the ground colour, with the
tagline. This is the first thing most people see, because the link gets pasted
into WhatsApp groups.

### Privacy and terms pages
**Files:** `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`

Footer links to both and neither exists. Health data and money both need real
policies — Play Store review will ask for the privacy URL specifically.

---

## Medium

### Mobile motion pass
**File:** `src/components/sections/Showcase.tsx`

The pinned showcase is designed for desktop. On narrow screens pinning is
disabled but the section hasn't been reconsidered — it should probably become a
horizontal swipe or a simple stack. Decide, then build it.

### Real device frames
**File:** `src/components/sections/Showcase.tsx`

Phone screens are hand-built markup, which is fine for now but drifts from the
real app. Replace with actual screenshots from `steppal-mobile` once the app
has screens worth showing, and keep the mock as the fallback.

### Nav bar
**Doesn't exist yet.**

There's no navigation at all. Add one that hides on scroll-down and reappears on
scroll-up, driven by the existing Lenis instance rather than a scroll listener.
Must not fight the pinned section.

---

## Hard

### Page transitions
**Doesn't exist yet.**

An overlay wipe on route change using the accent colour, under 600ms. Needs to
work with Lenis (scroll position reset) and not break ScrollTrigger. Start with
the View Transitions API and fall back to a GSAP overlay.

### Performance pass on low-end Android
**Everywhere.**

Target is 60fps on a mid-range Android device. Profile a real one — not a
throttled desktop — and fix what's slow. Likely suspects: SplitText re-splitting
on resize, the number of simultaneous ScrollTriggers, and `will-change`
lingering after animations finish.

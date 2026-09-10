# steppal-web

Marketing site for **StepPal** — an open-source app where friends form a group,
everyone stakes money, and at the end of the week it settles based on who
actually walked.

This site doesn't run the product. It exists to make people want the app and to
make developers want to contribute.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| Styling | Tailwind 4 — tokens live in `src/app/globals.css` |
| Scroll | [Lenis](https://github.com/darkroomengineering/lenis) |
| Animation | GSAP + ScrollTrigger + SplitText |
| Fonts | `@fontsource-variable/*` — self-hosted from npm, no build-time network call |

## How the design is organised

**Every colour and size resolves in `src/app/globals.css`.** No component
hardcodes a value, so changing that `@theme` block re-skins the whole site.

- Ground is warm near-black rather than cold — with the chartreuse accent it
  reads as effort and daylight rather than gaming neon.
- Clay (`--color-money`) is reserved **exclusively** for naira figures, so money
  is recognisable at a glance without a label. Don't spend it elsewhere.
- Type primitives (`.t-hero`, `.t-section`, `.t-label`, `.t-num`) live in
  `@layer components` so Tailwind utilities still override them. Unlayered CSS
  beats every utility in Tailwind 4 — that's a real trap.

## How the motion is organised

`src/lib/motion.ts` holds the whole vocabulary: easing, durations, stagger,
trigger points. **Tune the feel there, not in components.**

The register is *heavy and smooth* — weighted easing, generous durations.
Nothing bouncy, springy or snappy. `back`, `elastic` and `bounce` are banned.

Building blocks:

| Component | Does |
|---|---|
| `SmoothScroll` | Mounts Lenis, drives it from GSAP's ticker so both share one RAF loop |
| `RevealText` | Masked line reveal — the primitive everything else builds on |
| `Reveal` | Generic entry reveal for non-text blocks |
| `Counter` | Number ticks up on entry, tabular-nums so nothing jitters |
| `MagneticButton` | CTA drifts toward the cursor, pointer-fine devices only |

### Rules that aren't negotiable

- **`prefers-reduced-motion`** degrades everything to opacity fades and disables
  Lenis. Test it.
- **Transform and opacity only.** Never animate layout properties.
- **Nothing parked at `opacity: 0`.** GSAP sets its own from-state at runtime,
  so if JS fails the page is still fully readable.
- **`ScrollTrigger.refresh()` after fonts load** — already wired in
  `SmoothScroll`. Fonts landing late is the classic cause of triggers firing at
  the wrong scroll position.
- Target is **60fps on a mid-range Android**, not your laptop. That's who opens
  this from a WhatsApp link.

## Contributing

Real tasks are in [`CONTRIBUTING-TASKS.md`](./CONTRIBUTING-TASKS.md). The site is
built to roughly 65% on purpose — the rest is deliberately left for
contributors, marked in code with `TODO(contributor):`.

Apache-2.0.

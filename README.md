# StepPal — web

The site for [StepPal](https://github.com/fitnessorg), a commitment app where
you put money behind a step goal and a contract holds it until you have either
earned it back or lost it.

This repo is **informational only** — it ships no product features. The app is
[steppal-mobile](https://github.com/fitnessorg/steppal-mobile); the API,
settlement rules and Soroban escrow are in
[steppal-core](https://github.com/fitnessorg/steppal-core).

## Run it

```bash
npm install
npm run dev
```

No accounts, no API keys, no services. The waitlist form works out of the box
against an in-memory store that logs to your terminal.

```bash
npm run build       # production build
npm test            # 15 tests
npm run lint
npm run typecheck
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | The landing page — nine scroll-driven sections |
| `/contribute` | How to pick up work across the three repos |
| `/architecture` | Where the money sits and who may move it |
| `/privacy` | What the app collects, and what it deliberately does not |
| `/terms` | The deal, in plain words |
| `/api/waitlist` | `POST { email }` — validation, dedupe, honeypot, rate limit |

## The waitlist is real

`src/lib/waitlist.ts` holds validation and a pluggable store, kept out of the
route handler so both can be tested without a request.

- **Memory store by default.** Logs to stdout and dedupes for the life of the
  process. This is what makes the form genuinely work from a fresh clone — a
  contributor can submit it, see the success state, and watch the address land
  in the terminal. It is not durable and says so.
- **Resend when configured.** Set `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` and
  signups go to a Resend audience. One `fetch`, no SDK.
- **A honeypot field** named `company`, hidden from people and from screen
  readers. A filled honeypot gets the same answer a real signup does, because
  telling a bot it was caught only teaches whoever wrote it.
- **A fixed-window rate limit per client**, in memory. Honest about its limits:
  serverless means several instances, each with its own counter. It raises the
  cost of a casual script, which is the actual threat to a form like this.

Email validation is deliberately permissive. Addresses are stranger than most
regexes allow, and the only authority on whether one works is the mail server —
rejecting a real address costs a signup, which is worse than storing one that
bounces.

## Motion

Everything pulls its easing and duration from `src/lib/motion.ts`. Never inline
a raw cubic-bezier or a magic number in a component — one file is what keeps
nine sections feeling like one site.

GSAP with ScrollTrigger for reveals, Lenis for smooth scroll, driven from GSAP's
ticker so both share a single RAF loop. Two independent loops is the usual cause
of jittery scroll-linked animation.

**`prefers-reduced-motion` is honoured throughout.** Lenis does not mount at
all, reveals become opacity-only, the counter renders its final value, and the
magnetic button stops tracking. The document pages have no motion by design —
a page that animates while you are trying to read it fights you.

## Two things that will bite you

**Tailwind 4 unlayered CSS beats every utility.** A bare `.t-section { margin: 0 }`
outside a layer ate a `mb-20` and collided two sections. Type primitives live in
`@layer components` for exactly this reason. Put new component classes there.

**Fonts ship from npm, not `next/font/google`.** The woff2 files are in the
lockfile, so builds need no network and are reproducible. Three variable
families, three files.

## Deploying

The canonical origin is read from the environment, never hard-coded — the
domain is not owned yet, and a wrong canonical URL on every page is worse than
no domain. `src/lib/site.ts` prefers `NEXT_PUBLIC_SITE_URL`, falls back to
Vercel's `VERCEL_PROJECT_PRODUCTION_URL` so a fresh deploy is already correct,
and otherwise uses localhost.

## Contributing

See [CONTRIBUTING-TASKS.md](./CONTRIBUTING-TASKS.md) and the `/contribute` page.

MIT. See [LICENSE](./LICENSE).

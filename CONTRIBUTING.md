# Contributing to StepPal Web

Thank you for your interest in contributing to StepPal!

StepPal is an open-source decentralized fitness commitment platform where participants back personal and group step goals with money. The escrow, validation, and settlement rules are enforced transparently via Soroban smart contracts on the Stellar network.

`steppal-web` is the web presence and contributor hub for the StepPal ecosystem. Its role is to explain product mechanics, provide architectural transparency, capture early waitlist interest, and onboard contributors.

---

## The StepPal Ecosystem

StepPal is divided across three focused repositories:

1. **`steppal-core`**: The API, settlement engine, Soroban escrow smart contract, and TypeScript SDK.
2. **`steppal-mobile`**: The Android mobile client (Expo + React Native) that interfaces with Health Connect and displays user pots and settlements.
3. **`steppal-web`** (this repo): The public web front door, documentation, and waitlist.

None of the three repositories require each other to build or run locally.

---

## Core Philosophy

- **Zero accounts or external services required:** You do not need API keys, database credentials, or third-party accounts to build, develop, or test this site.
- **Functional defaults:** The waitlist operates out of the box with an in-memory store that logs submissions directly to stdout.
- **Rock-solid reliability:** Every commit must pass typechecks, linting, unit tests, and production static builds.
- **Accessible & readable:** Reading pages (`/architecture`, `/contribute`, `/privacy`, `/terms`) are built for reading with standard measure and zero distracting animations.

---

## Quick Start

### Prerequisites
- **Node.js**: v20 or newer
- **Package Manager**: `npm` (v10+) or `pnpm`

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/fitnessorg/steppal-web.git
cd steppal-web

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Verification

Before submitting changes, run the local verification suite:

```bash
# Run all checks (typecheck, lint, tests)
npm run check

# Verify production build and static page generation
npm run build
```

> **Windows Note:** On Windows environments, ensure commands are executed from the canonical NTFS path casing (e.g., `C:\Users\<user>\Documents\...` rather than lowercase `documents`). This prevents Node from dual-loading Next.js Turbopack internals during static prerendering.

---

## Codebase Anatomy

```text
steppal-web/
├── .agent/              # Agent briefs, multi-day development plan, and logs
├── .github/workflows/   # Continuous integration workflows
├── public/              # Static assets (brand mark, icons, robots.txt)
├── src/
│   ├── app/             # Next.js App Router pages, layouts, and API routes
│   │   ├── (prose)/     # Reading shell routes: /architecture, /contribute, /privacy, /terms
│   │   ├── api/         # Route handlers (/api/waitlist)
│   │   ├── globals.css  # Design tokens, Tailwind v4 theme, and component layers
│   │   └── not-found.tsx# Branded 404 recovery page
│   ├── components/      # Reusable UI components (Prose, Header, ThemeToggle, MagneticButton)
│   │   └── sections/    # Landing page sections (Hero, Showcase, HowItWorks, Waitlist, etc.)
│   └── lib/             # Pure utility modules: motion tokens, site URL, waitlist storage
└── test/                # Vitest test suites
```

---

## Engineering Standards

### 1. Next.js & React 19
- Default to **Server Components**. Only mark components with `'use client'` when they require browser event listeners, interactive state machines, or animation tickers.
- Document pages must remain lightweight reading shells without heavy motion bundles.

### 2. Styling & Tailwind CSS v4
- Design tokens resolve in `@theme` inside `src/app/globals.css`.
- Always declare custom component classes inside `@layer components`. Unlayered CSS rules will override Tailwind utilities regardless of order.
- Respect StepPal design tokens: `--color-ground`, `--color-surface`, `--color-flame`, `--color-accent`, and `--color-money` (reserved strictly for monetary figures).

### 3. Motion & Animation
- Never inline magic numbers or raw cubic-bezier strings. Import shared easing functions and durations from `src/lib/motion.ts`.
- Always respect `prefersReducedMotion()`. When reduced motion is requested, disable Lenis smooth scrolling, collapse GSAP timelines to immediate opacity fades, and disable magnetic cursor tracking.

### 4. Accessibility (a11y)
- All interactive controls (buttons, links, form fields, and showcase tabs) must be reachable and operable via keyboard navigation.
- Focus rings must maintain a contrast ratio of at least 3:1 against adjacent backgrounds (`:focus-visible` uses `var(--color-flame)`).
- Preserve element outline curvature by avoiding hardcoded border radii on `:focus-visible`.
- Skip links must be provided at the top of the DOM to bypass repetitive navigation headers.

### 5. Testing
- Place test files in `test/*.test.ts` or `test/*.test.tsx`.
- Write deterministic, fast tests with Vitest.
- Mock network or file system calls when testing storage adapters.

---

## Finding Tasks to Work On

Check [`CONTRIBUTING-TASKS.md`](./CONTRIBUTING-TASKS.md) for a curated list of open tasks, tagged by difficulty:
- **Good First Issues**: Small, self-contained improvements (e.g. Open Graph images, metadata enhancements).
- **Features**: Waitlist integrations, changelog hubs.
- **Performance & Quality**: Bundle optimizations, component testing.

You can also grep the codebase for `TODO(contributor)` markers.

---

## Pull Request Process

1. **Create a branch**: Use descriptive branch names like `feat/heading-permalinks` or `fix/waitlist-rate-limit`.
2. **Make atomic commits**: Write clear [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `perf:`).
3. **Run local verification**: Confirm `npm run check` and `npm run build` pass with zero errors and zero warnings.
4. **Open a Pull Request**: Provide a concise summary of changes, motivation, and test coverage.

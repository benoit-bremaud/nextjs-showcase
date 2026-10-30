# nextjs-showcase

A dashboard of my public GitHub projects, built to show current Next.js App Router practice in public code.

It complements [benoitbremaud.fr](https://benoitbremaud.fr), a static Astro site with zero JavaScript; the reasons for this split are in that project's ADR-0002 and in [ADR-0001](docs/architecture/decisions/0001-nextjs-16-on-vercel.md) here.

## Status

Foundation only: the dashboard features are in progress. Conception: [ADR-0001](docs/architecture/decisions/0001-nextjs-16-on-vercel.md) and the [dashboard UML diagrams](docs/architecture/diagrams/dashboard/).

## Stack

- Next.js 16 (App Router, Cache Components, Partial Prerendering), React 19, strict TypeScript
- Vitest (unit, 80 % coverage floor) and Playwright (end-to-end)
- GitHub Actions: lint, type check, tests, build, Gitleaks, CodeQL, dependency review; Dependabot
- Hosting: Vercel Hobby (planned)

## Run locally

Requires Node.js 22 (`.nvmrc`).

```bash
npm ci
npm run dev
```

## Checks

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run test:e2e
```

## Licence

[MIT](LICENSE)

# nextjs-showcase

A dashboard of my public GitHub projects, built to show current Next.js App Router practice in public code.

It complements [benoitbremaud.fr](https://benoitbremaud.fr), a static Astro site with zero JavaScript; the reasons for this split are in that project's ADR-0002 and in [ADR-0001](docs/architecture/decisions/0001-nextjs-16-on-vercel.md) here.

## Status

Dashboard working locally: project list, project pages, `GET /api/projects` and an Open Graph image; deployment to Vercel pending. Conception: [ADR-0001](docs/architecture/decisions/0001-nextjs-16-on-vercel.md) and the [dashboard UML diagrams](docs/architecture/diagrams/dashboard/).

## Stack

- Next.js 16 (App Router, Cache Components, Partial Prerendering), React 19, strict TypeScript
- Vitest (unit, 80 % coverage floor) and Playwright (end-to-end)
- Local CI with just, lefthook and mise (four tiers, below); GitHub Actions runs `just check`, CodeQL and dependency review; Dependabot
- Hosting: Vercel Hobby (planned)

## Run locally

Requires [mise](https://mise.jdx.dev); it installs Node.js and every check tool pinned in `mise.toml`.

```bash
mise install
mise x -- lefthook install
npm ci
npm run dev
```

The app reads the public GitHub API anonymously (60 requests per hour, cached for hours). Optional variables:

| Variable | Effect |
|---|---|
| `GITHUB_TOKEN` | read-only token, raises the API rate limit |
| `GITHUB_FIXTURES=1` | serves `src/lib/fixtures/repos.json` instead of the API (tests, offline) |

## Checks

| Tier | Command | When |
|---|---|---|
| L0 | `just fast` | pre-commit hook: ESLint, typos, actionlint, Gitleaks on staged files |
| L1 | `just check` | pre-push hook and GitHub CI: lint, type check, unit tests with coverage, Semgrep, osv-scanner, zizmor, Gitleaks |
| L2 | `just gate` | before every merge: L1 + build, Playwright, SonarQube quality gate |
| L3 | `just nightly` | on demand: L1 + TruffleHog and outdated tools |

## Licence

[MIT](LICENSE)

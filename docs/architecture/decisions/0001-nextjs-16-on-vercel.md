# ADR-0001: Build a GitHub projects dashboard with Next.js 16 App Router on Vercel

- Status: Accepted
- Date: 2026-10-30
- Origin: <https://github.com/benoit-bremaud/benoitbremaud.fr/issues/128> (follow-up of ADR-0002 in that repository)

This record fixes the subject, the Next.js features shown and the hosting of the public showcase.

## Context

The owner's site benoitbremaud.fr is built with Astro, ships zero JavaScript and enforces a strict
Content Security Policy (CSP). Its ADR-0002 moved the Next.js showcase to a separate public
repository so that Next.js skills are visible in real, public code. This repository is that
showcase.

## Decision

1. **Subject**: a dashboard of the owner's public GitHub repositories (list, per-repository page,
   recent activity), fed by the public GitHub REST API.
2. **Next.js features shown** (Next.js 16, App Router, Cache Components enabled):
   Server Components, `'use cache'` with `cacheLife`, Partial Prerendering through `<Suspense>`,
   `generateStaticParams`, a JSON Route Handler, the Metadata API with an Open Graph image,
   `loading` / `error` / `not-found` files, and security headers set in `next.config.ts`
   (CSP strategy: see the amendment below).
3. **Hosting**: Vercel Hobby (non-commercial use), one preview deployment per pull request.

### MCDA (approved by the owner on 2026-10-30)

Subject — weights: Next.js showcase 35, real usefulness 25, KISS 20, public data without secrets
or personal data 20.

| Option | Showcase | Usefulness | KISS | Data | Total /500 |
|---|---|---|---|---|---|
| **GitHub projects dashboard** | 5 | 5 | 4 | 5 | **475** |
| Improv sketch catalogue | 4 | 3 | 3 | 4 | 360 |
| Bookmarks with authentication | 4 | 2 | 2 | 2 | 270 |

Features — weights: credibility 40, KISS 30, testability 30.

| Option | Total /500 |
|---|---|
| **Modern base (list above)** | **400** |
| Static generation and a route handler only | 380 |
| Modern base plus Server Actions and a database | 350 |

Hosting — weights: Next.js fidelity 35, zero cost 25, consistency with existing infrastructure 20,
security headers 20.

| Option | Fidelity | Cost | Consistency | Security | Total /500 |
|---|---|---|---|---|---|
| **Vercel Hobby** | 5 | 5 | 2 | 5 | **440** |
| Cloudflare Workers through OpenNext | 4 | 5 | 5 | 3 | 400 |
| Fly.io container | 4 | 3 | 3 | 4 | 355 |

Sensitivity: Cloudflare only wins if infrastructure consistency weighs 40 or more. OpenNext
supports Next.js 16, `'use cache'` and Partial Prerendering, but not Node.js middleware yet
(opennext.js.org/cloudflare, read 2026-10-30); in
Next.js 16 `proxy.ts` runs on Node.js, which is where a CSP nonce would be generated.

## Consequences

### Positive

- Every listed feature runs natively on Vercel.
- Public data only: no account, no form, no personal data to protect.

### Negative

- One more platform account (Vercel) next to Cloudflare.
- Unauthenticated GitHub API calls are rate limited (60 per hour per IP); caching with
  `cacheLife` keeps calls low, and an optional read-only token can raise the limit.
- The CSP cannot be fully strict on scripts while Partial Prerendering is used (amendment below).

## Amendment 1 — CSP strategy (2026-10-30, issue #12)

A spike on Next.js 16.4.3 (local build, Playwright checking console CSP violations) gave:

| Variant | Build | Strict CSP holds |
|---|---|---|
| Hashes through `experimental.sri`, PPR kept | static | no: 8 inline Next.js scripts blocked, no hydration |
| Nonce set in `proxy.ts`, PPR kept | partial prerender | no: the static shell loads its scripts without the nonce |
| Nonce, fully dynamic page, Cache Components on | build refused | — |
| Nonce, Cache Components off | dynamic | yes |

The Next.js CSP guide confirms that PPR is incompatible with a nonce-based CSP.

MCDA (owner, 2026-10-30) — weights: modern Next.js showcase 35, CSP strength 30, KISS 20,
robustness 15.

| Option | Showcase | CSP | KISS | Robustness | Total /500 |
|---|---|---|---|---|---|
| **Keep PPR; strict CSP except `script-src 'self' 'unsafe-inline'`; SRI on script files** | 5 | 3 | 5 | 4 | **425** |
| Nonce and dynamic rendering, Cache Components off | 3 | 5 | 4 | 5 | 410 |
| PPR and inline-script hashes computed after the build | 4 | 5 | 1 | 1 | 325 |

Sensitivity: the nonce option wins when CSP strength weighs 40 and the showcase 25.

Decision: the first option. Every other directive stays strict (`default-src 'self'`,
`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, no
`unsafe-eval` in production). The site renders public data only and takes no user input, which
limits what `'unsafe-inline'` exposes. No `proxy.ts` is needed. Experimental SRI hashes five of
the six script files of the home page in 16.4.3; the end-to-end test checks that SRI is active,
not that it is complete. Re-check this amendment on every Next.js upgrade.
HSTS with `includeSubDomains` will apply to every subdomain of a future custom domain. Revisit when Next.js supports
nonces or hashes for prerendered shells.

## Amendment 2 — Hosting re-check and not-found status (2026-10-30, issue #16)

Once amendment 1 removed `proxy.ts`, the owner asked whether Cloudflare, the existing platform,
could replace Vercel. Spike with `@opennextjs/cloudflare` 1.20.13 and Next.js 16.4.3 (local
`wrangler dev`): the Worker weighs 980 KiB gzip, under the 3 MiB free-plan limit, but every page
request returns 500; the Workers runtime cancels it as hung after Next.js warns that Cache
Components cannot be guaranteed with the runtime's `setTimeout()`.

| Option | Fidelity 35 | Cost 25 | Consistency 20 | Security 20 | Total /500 |
|---|---|---|---|---|---|
| **Vercel Hobby, Cloudflare tracked in issue #15** | 5 | 5 | 2 | 4 | **420** |
| Cloudflare with Cache Components off | 2 | 5 | 5 | 5 | 395 |
| Wait for OpenNext before going live | 5 | 5 | 5 | 5 | blocked, no date |

Decision (owner): stay on Vercel Hobby, free; re-test Cloudflare on each OpenNext release
(issue #15) and amend this ADR when the home page renders there with Cache Components on.

Not-found status: with Partial Prerendering, an unknown `/projects/<name>` streams its shell before
`notFound()` runs, so the response stays 200 and Next.js adds `<meta name="robots"
content="noindex">` (Next.js `notFound` reference). `dynamicParams` is unavailable with Cache
Components. Accepted: the page is not indexed and shows the not-found UI.

# ADR-0001: Build a GitHub projects dashboard with Next.js 16 App Router on Vercel

- Status: Accepted
- Date: 2026-10-30
- Origin: benoit-bremaud/benoitbremaud.fr#128 (follow-up of ADR-0002 in that repository)

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
   `loading` / `error` / `not-found` files, security headers and a per-request CSP nonce set in
   `proxy.ts`.
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
supports Next.js 16, `'use cache'` and Partial Prerendering, but not Node.js middleware yet; in
Next.js 16 `proxy.ts` runs on Node.js, which is where the CSP nonce is generated.

## Consequences

### Positive

- Every listed feature runs natively, including the nonce-based CSP.
- Public data only: no account, no form, no personal data to protect.

### Negative

- One more platform account (Vercel) next to Cloudflare.
- Unauthenticated GitHub API calls are rate limited (60 per hour per IP); caching with
  `cacheLife` keeps calls low, and an optional read-only token can raise the limit.
- A nonce-based CSP requires dynamic rendering (Next.js documentation), which conflicts with a
  prerendered static shell. The implementation must confirm, page by page, how the nonce and
  Partial Prerendering coexist; if they cannot, the CSP falls back to hashes on prerendered
  routes, and this ADR is amended.

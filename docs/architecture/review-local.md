# Local review — nextjs-showcase (branch diff main...HEAD)

- Date: 2026-10-30
- Commit: e1a754a + review fixes
- Scope: docs only (ADR-0001, dashboard UML 01–04)
- Checks run: docs + UML + design (doc-auditor); security (gitleaks + manual diff read); correctness (manual). Tests, coverage, SonarQube and QA: not applicable, no code yet.
- Verdict: ship after fixes · Must 3 (fixed) · Should 6 (5 fixed, 1 kept) · Nice 3 (2 fixed)

## Pre-merge gate
| Step | Result |
|---|---|
| 1 Tests | ⚠️ n/a — no code |
| 2 Coverage | ⚠️ n/a — no code |
| 3 SonarQube | ⚠️ n/a — no code, no project yet |
| 4 Secrets | ✅ gitleaks clean (main..HEAD) · no tracked .env · diff read: nothing sensitive |
| 5 QA pass | ⚠️ n/a — no running product |

## 🔴 Must Have (all fixed)
- `03-sequence.md` `[docs]` · PPR shell vs nonce contradiction · marked provisional, prerendered variant shown
- `03-sequence.md` `[docs]` · activations, function as participant · added activations, participant renamed "Data cache"
- `0001-nextjs-16-on-vercel.md:23` `[docs]` · nonce stated as decided while consequences allow a fallback · Decision now says nonce is the target, settled by a spike

## 🟡 Should Have
- `01-use-case.md` · fixed: approximation note, UC-03 reframed as an actor goal
- `04-deployment.md` · fixed: stereotypes, HTTPS label, dashed deploy flow
- `0001…md:55` · fixed: OpenNext claim sourced and dated
- `0001…md` rate limit wording · kept: cache bounds calls, token stays optional

## 🔵 Nice to Have
- `02-component.md` · fixed: domain merged into lib/projects.ts (KISS), request flow dashed
- `0001…md:5` · fixed: clickable origin link

## ⚪ Disagree / Intentional
_None._

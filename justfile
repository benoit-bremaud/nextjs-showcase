# Local CI (skill local-ci): four tiers, one recipe each, scoped to a Next.js app without Docker.

set shell := ["sh", "-eu", "-c"]

# semgrep-core fails on io_uring under a low memlock limit (sandboxes, some CI); use the posix backend
export EIO_BACKEND := "posix"

default: check

# L0 — pre-commit checks on the staged files (< 10 s)
fast:
    lefthook run pre-commit

lint:
    npm run lint
    npm run typecheck
    typos
    actionlint
    zizmor --quiet .github/workflows

# Unit tests with the coverage floor enforced by vitest.config.ts (>= 80 %)
test:
    npm run test:coverage

# SAST and app dependency vulnerabilities (Semgrep CE, no login, metrics off; osv-scanner on the npm
# lockfile only, the mise tool locks are dev tooling)
security:
    semgrep scan --config p/default --error --metrics=off
    osv-scanner scan source --lockfile package-lock.json

secrets:
    gitleaks git --redact --no-banner .

# L1 — pre-push and GitHub CI (< 3 min)
check: lint test security secrets

# L2 — pre-merge, called by review-local § 2b
gate base="origin/main": check
    GITHUB_FIXTURES=1 npm run build
    npm run test:e2e
    if [ -f sonar-project.properties ]; then \
      command -v sonar-scanner > /dev/null || { echo "gate: sonar-scanner not on PATH (system tool, skill local-ci rule 2)" >&2; exit 1; }; \
      [ -n "${SONAR_TOKEN:-}" ] || [ ! -r "$HOME/.config/sonarqube/analysis-token" ] || SONAR_TOKEN=$(cat "$HOME/.config/sonarqube/analysis-token"); \
      SONAR_TOKEN="${SONAR_TOKEN:-}" sonar-scanner -Dsonar.qualitygate.wait=true; \
    else echo "gate: WARNING no sonar-project.properties, SonarQube step not run"; fi

# L3 — nightly (no time budget)
nightly: check
    trufflehog git "file://$PWD" --no-verification --fail --no-update
    mise outdated

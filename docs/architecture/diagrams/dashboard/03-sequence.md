# Sequence diagram — UC-01 Browse public projects

How a request is served with Partial Prerendering and the data cache. The CSP and security headers
are static, set in `next.config.ts` (ADR-0001, amendment 1).

```mermaid
sequenceDiagram
  actor V as Visitor
  participant R as Page (Server Component)
  participant D as Data cache (lib/projects.ts)
  participant G as GitHub REST API
  V->>R: GET /
  activate R
  R-->>V: prerendered shell + Suspense fallback, CSP and security headers
  R->>D: getProjects()
  activate D
  alt cache hit (within cacheLife)
    D-->>R: cached projects
  else cache miss or stale
    D->>G: GET /users/benoit-bremaud/repos
    G-->>D: repositories JSON
    D-->>R: mapped projects
  end
  deactivate D
  R-->>V: streamed project list (same response)
  deactivate R
```

If GitHub fails, `error.tsx` renders a retry message; no stale data is invented.

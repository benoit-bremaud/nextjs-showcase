# Sequence diagram — UC-01 Browse public projects

How a request is served with Partial Prerendering and the data cache. Provisional: it shows the
prerendered variant (hash-based CSP); the CSP spike of ADR-0001 may make the route fully dynamic
with a nonce, in which case the shell is rendered per request.

```mermaid
sequenceDiagram
  actor V as Visitor
  participant P as proxy.ts
  participant R as Page (Server Component)
  participant D as Data cache (lib/projects.ts)
  participant G as GitHub REST API
  V->>P: GET /
  activate P
  P->>P: set CSP and security headers
  P->>R: forward request
  deactivate P
  activate R
  R-->>V: prerendered shell + Suspense fallback
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

# Sequence diagram — UC-01 Browse public projects

How a request is served with Partial Prerendering and the data cache.

```mermaid
sequenceDiagram
  actor V as Visitor
  participant P as proxy.ts
  participant R as Page (Server Component)
  participant C as getProjects ('use cache')
  participant G as GitHub REST API
  V->>P: GET /
  P->>P: generate nonce, set CSP and security headers
  P->>R: forward request (nonce in header)
  R-->>V: static shell + Suspense fallback (streamed)
  R->>C: getProjects()
  alt cache hit (within cacheLife)
    C-->>R: cached projects
  else cache miss or stale
    C->>G: GET /users/benoit-bremaud/repos
    G-->>C: repositories JSON
    C-->>R: mapped projects
  end
  R-->>V: streamed project list
```

If GitHub fails, `error.tsx` renders a retry message; no stale data is invented.

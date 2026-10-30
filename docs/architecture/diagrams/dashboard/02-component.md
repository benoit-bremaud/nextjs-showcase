# Component diagram — dashboard

The parts of the application and their dependencies; only `lib/github.ts` touches the network.

```mermaid
flowchart TB
  subgraph app [Next.js app]
    config[next.config.ts<br/>CSP + security headers, SRI]
    pages[app/ pages<br/>Server Components + Suspense]
    api[app/api/projects/route.ts<br/>Route Handler]
    data[lib/projects.ts<br/>'use cache' + cacheLife<br/>Project type + pure mapping]
    client[lib/github.ts<br/>GitHub REST client]
  end
  github[(GitHub REST API)]
  config -.->|response headers| pages
  pages --> data
  api --> data
  data --> client
  client --> github
```

`lib/projects.ts` holds the `Project` type and a pure mapping from GitHub payloads, unit tested
without network; a separate domain module waits until a second data source exists (KISS). `lib/github.ts` is the only module that calls `fetch`.

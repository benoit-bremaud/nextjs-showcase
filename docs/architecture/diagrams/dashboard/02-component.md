# Component diagram — dashboard

The parts of the application and their dependencies; the domain never imports the GitHub client.

```mermaid
flowchart TB
  subgraph app [Next.js app]
    proxy[proxy.ts<br/>CSP nonce + security headers]
    pages[app/ pages<br/>Server Components + Suspense]
    api[app/api/projects/route.ts<br/>Route Handler]
    data[lib/projects.ts<br/>'use cache' + cacheLife]
    domain[lib/project.ts<br/>Project type + mapping]
    client[lib/github.ts<br/>GitHub REST client]
  end
  github[(GitHub REST API)]
  proxy --> pages
  pages --> data
  api --> data
  data --> domain
  data --> client
  client --> github
```

`lib/project.ts` holds the `Project` type and the pure mapping from GitHub payloads; it is unit
tested without network. `lib/github.ts` is the only module that calls `fetch`.

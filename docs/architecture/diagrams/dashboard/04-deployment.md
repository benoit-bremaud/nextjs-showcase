# Deployment diagram — dashboard

Where the application runs (ADR-0001: Vercel Hobby).

```mermaid
flowchart LR
  browser[«device» Browser]
  subgraph vercel [«node» Vercel]
    edge[«executionEnvironment» CDN<br/>static assets, prerendered shells]
    fn[«executionEnvironment» Node.js functions<br/>pages, route handler]
  end
  gh[«external system» api.github.com]
  repo[«artifact» GitHub repository<br/>benoit-bremaud/nextjs-showcase]
  browser -- HTTPS 443 --> edge
  edge -- HTTPS --> fn
  fn -- HTTPS 443, optional read-only token --> gh
  repo -. deploy on push / pull request .-> vercel
```

| Tier | Trigger | URL |
|---|---|---|
| staging | each pull request (Vercel preview) | `*.vercel.app` preview URL |
| prod | merge to `main` | Vercel production URL (custom domain decided later) |

# Use case diagram — dashboard

The goals a visitor reaches on the GitHub projects dashboard (ADR-0001). Mermaid has no use case
notation; this flowchart approximates it, GitHub being a secondary actor.

```mermaid
flowchart LR
  visitor([Visitor])
  github([GitHub REST API]):::secondary
  subgraph dashboard [nextjs-showcase]
    UC1((UC-01 Browse public projects))
    UC2((UC-02 Read a project's details))
    UC3((UC-03 Reuse the project data in my own tool))
  end
  visitor --- UC1
  visitor --- UC2
  visitor --- UC3
  UC1 --- github
  UC2 --- github
  UC3 --- github
  classDef secondary stroke-dasharray: 4 4
```

| ID | Goal | Primary actor | Notes |
|---|---|---|---|
| UC-01 | Browse the owner's public repositories, sorted by last push | Visitor | Shell + streamed list (CSP spike may make it dynamic) |
| UC-02 | Read one repository's description, languages and recent releases | Visitor | Paths prebuilt with `generateStaticParams` |
| UC-03 | Reuse the project list in my own tool | Visitor (developer) | Route Handler `GET /api/projects` |

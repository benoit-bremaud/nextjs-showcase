import { afterEach, describe, expect, it, vi } from "vitest";
import fixtureRepos from "./fixtures/repos.json";

// 'use cache' and cacheLife need the Next.js runtime; the boundary is stubbed, not the domain.
vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

const { getProject, getProjects, safeHttpUrl, toProjects } = await import("./projects");

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("toProjects", () => {
  it("hides forks and sorts by newest push", () => {
    const projects = toProjects(fixtureRepos);
    expect(projects.map((project) => project.name)).toEqual(["brickpix", "retro-shmup", "old-experiment"]);
  });

  it("normalises empty fields", () => {
    const old = toProjects(fixtureRepos).find((project) => project.name === "old-experiment");
    expect(old).toMatchObject({ description: "", homepage: null, language: null, topics: [], archived: true });
  });

  it("defaults missing topics to an empty list", () => {
    const [repo] = fixtureRepos;
    expect(toProjects([{ ...repo, topics: undefined }])[0].topics).toEqual([]);
  });
});

describe("safeHttpUrl", () => {
  it("keeps http(s) and drops other schemes or invalid values", () => {
    expect(safeHttpUrl("https://example.com")).toBe("https://example.com");
    expect(safeHttpUrl("javascript:alert(1)")).toBeNull();
    expect(safeHttpUrl("not a url")).toBeNull();
    expect(safeHttpUrl(null)).toBeNull();
  });
});

describe("getProject", () => {
  it("finds a project by name or returns undefined", async () => {
    vi.stubEnv("GITHUB_FIXTURES", "1");
    expect(await getProjects()).toHaveLength(3);
    expect((await getProject("brickpix"))?.language).toBe("TypeScript");
    expect(await getProject("missing")).toBeUndefined();
  });
});

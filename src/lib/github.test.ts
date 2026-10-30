import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchRepos } from "./github";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("fetchRepos", () => {
  it("returns the fixtures without network when GITHUB_FIXTURES=1", async () => {
    vi.stubEnv("GITHUB_FIXTURES", "1");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect(await fetchRepos()).toHaveLength(4);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("calls the GitHub API anonymously by default", async () => {
    vi.stubEnv("GITHUB_FIXTURES", "");
    vi.stubEnv("GITHUB_TOKEN", "");
    const fetchSpy = vi.fn().mockResolvedValue(Response.json([]));
    vi.stubGlobal("fetch", fetchSpy);
    await fetchRepos();
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toContain("/users/benoit-bremaud/repos");
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("sends the token when one is set", async () => {
    vi.stubEnv("GITHUB_FIXTURES", "");
    vi.stubEnv("GITHUB_TOKEN", "test-token");
    const fetchSpy = vi.fn().mockResolvedValue(Response.json([]));
    vi.stubGlobal("fetch", fetchSpy);
    await fetchRepos();
    expect(fetchSpy.mock.calls[0][1].headers.Authorization).toBe("Bearer test-token");
  });

  it("throws when the body is not a list", async () => {
    vi.stubEnv("GITHUB_FIXTURES", "");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ message: "oops" })));
    await expect(fetchRepos()).rejects.toThrow("non-array body");
  });

  it("throws on a non-200 answer", async () => {
    vi.stubEnv("GITHUB_FIXTURES", "");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 403, statusText: "Forbidden" })));
    await expect(fetchRepos()).rejects.toThrow("GitHub API answered 403 Forbidden");
  });
});

import fixtureRepos from "./fixtures/repos.json";

/** The subset of the GitHub REST "repository" payload that the dashboard reads. */
export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export const GITHUB_OWNER = "benoit-bremaud";

/**
 * Fetches the owner's public repositories, the only network call of the app.
 * Anonymous by default (60 requests per hour); GITHUB_TOKEN, read-only, raises the limit.
 * GITHUB_FIXTURES=1 returns committed fixtures so builds and end-to-end tests are deterministic.
 * Both variables are read inside the cached getProjects(), so they are not part of the cache key:
 * never share a cache between a fixtures build and a real one.
 * One page of 100 repositories is enough for the owner (65 today); add pagination beyond that.
 */
export async function fetchRepos(): Promise<GitHubRepo[]> {
  if (process.env.GITHUB_FIXTURES === "1") {
    return fixtureRepos;
  }
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&type=owner&sort=pushed`,
    { headers, signal: AbortSignal.timeout(10_000) },
  );
  if (!response.ok) {
    throw new Error(`GitHub API answered ${response.status} ${response.statusText}`);
  }
  const body: unknown = await response.json();
  if (!Array.isArray(body)) {
    throw new TypeError("GitHub API answered a non-array body");
  }
  return body as GitHubRepo[];
}

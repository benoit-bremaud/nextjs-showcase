import { cacheLife } from "next/cache";
import { fetchRepos, type GitHubRepo } from "./github";

/** A public project as the dashboard shows it. */
export interface Project {
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  pushedAt: string;
  archived: boolean;
}

/** Keeps a URL only when it is http(s), so a crafted "javascript:" homepage never reaches an href. */
export function safeHttpUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

/** Maps GitHub payloads to projects: forks are hidden, newest push first. */
export function toProjects(repos: GitHubRepo[]): Project[] {
  return repos
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      name: repo.name,
      description: repo.description ?? "",
      url: repo.html_url,
      homepage: safeHttpUrl(repo.homepage),
      language: repo.language,
      topics: repo.topics ?? [],
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
      archived: repo.archived,
    }))
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
}

/** All public projects, cached for hours: one GitHub call per revalidation. */
export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  return toProjects(await fetchRepos());
}

/** One project by name, read from the cached list; undefined when it does not exist. */
export async function getProject(name: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.name === name);
}

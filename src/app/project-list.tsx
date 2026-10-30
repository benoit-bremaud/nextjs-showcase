import Link from "next/link";
import { getProjects } from "@/lib/projects";
import { formatDate } from "@/lib/format";

/** Server Component streamed inside a Suspense boundary on the home page. */
export async function ProjectList() {
  const projects = await getProjects();
  return (
    <ul className="projects">
      {projects.map((project) => (
        <li key={project.name} className="card">
          <h2>
            <Link href={`/projects/${project.name}`}>{project.name}</Link>
            {project.archived ? <span className="badge">archived</span> : null}
          </h2>
          {project.description ? <p>{project.description}</p> : null}
          <p className="meta">
            {project.language ?? "No language"} · ★ {project.stars} · pushed{" "}
            <time dateTime={project.pushedAt}>{formatDate(project.pushedAt)}</time>
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Placeholder shown while the list streams in. */
export function ProjectListSkeleton() {
  return <output className="meta">Loading projects…</output>;
}

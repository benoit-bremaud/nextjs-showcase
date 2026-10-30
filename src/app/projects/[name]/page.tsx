import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/projects";
import { formatDate } from "@/lib/format";

/** Prebuilds one page per project at build time. */
export async function generateStaticParams(): Promise<{ name: string }[]> {
  const projects = await getProjects();
  return projects.map((project) => ({ name: project.name }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[name]">): Promise<Metadata> {
  const { name } = await params;
  const project = await getProject(name);
  return project
    ? { title: `${project.name} — Next.js showcase`, description: project.description || undefined }
    : {};
}

// Next.js requires a default export for route segments.
export default async function ProjectPage({ params }: Readonly<PageProps<"/projects/[name]">>) {
  const { name } = await params;
  const project = await getProject(name);
  if (!project) {
    notFound();
  }
  return (
    <main>
      <p>
        <Link href="/">← All projects</Link>
      </p>
      <h1>{project.name}</h1>
      {project.archived ? <p className="badge">archived</p> : null}
      <p className="lead">{project.description || "No description yet."}</p>
      <dl className="facts">
        <dt>Language</dt>
        <dd>{project.language ?? "None"}</dd>
        <dt>Stars</dt>
        <dd>{project.stars}</dd>
        <dt>Last push</dt>
        <dd>
          <time dateTime={project.pushedAt}>{formatDate(project.pushedAt)}</time>
        </dd>
        {project.topics.length > 0 ? (
          <>
            <dt>Topics</dt>
            <dd>{project.topics.join(", ")}</dd>
          </>
        ) : null}
      </dl>
      <p>
        <a href={project.url}>Source on GitHub</a>
        {project.homepage ? (
          <>
            {" · "}
            <a href={project.homepage}>Live</a>
          </>
        ) : null}
      </p>
    </main>
  );
}

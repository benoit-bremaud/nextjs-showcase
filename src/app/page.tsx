import { Suspense } from "react";
import { ProjectList, ProjectListSkeleton } from "./project-list";

// Next.js requires a default export for route segments.
export default function Home() {
  return (
    <main>
      <h1>Next.js showcase</h1>
      <p className="lead">
        My public GitHub projects, newest push first. Built with Next.js 16: Server Components, cached
        data and Partial Prerendering.
      </p>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList />
      </Suspense>
    </main>
  );
}

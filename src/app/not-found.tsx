import Link from "next/link";

// Next.js requires a default export for route segments.
export default function NotFound() {
  return (
    <main>
      <h1>Not found</h1>
      <p>This project does not exist or is not public.</p>
      <p>
        <Link href="/">Back to all projects</Link>
      </p>
    </main>
  );
}

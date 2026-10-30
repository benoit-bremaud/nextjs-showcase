import { siteTitle } from "@/lib/site";

// Next.js requires a default export for route segments.
export default function Home() {
  return (
    <main>
      <h1>{siteTitle}</h1>
      <p>The dashboard of my public GitHub projects is under construction.</p>
    </main>
  );
}

"use client";

// Next.js requires a default export for route segments; error boundaries are Client Components.
export default function ErrorPage({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>The GitHub data could not be loaded. Please try again in a moment.</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}

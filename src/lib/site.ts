/** Title shown on the home page and reused by the metadata. */
export const siteTitle = "Next.js showcase";

/** Builds the absolute GitHub URL of one of the owner's repositories. */
export function repoUrl(name: string): string {
  if (!/^[\w.-]+$/.test(name) || name === "." || name === "..") {
    throw new Error(`Invalid repository name: ${name}`);
  }
  return `https://github.com/benoit-bremaud/${name}`;
}

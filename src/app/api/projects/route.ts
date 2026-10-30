import { getProjects } from "@/lib/projects";

/** GET /api/projects: the cached project list as JSON, for reuse in other tools. */
export async function GET() {
  return Response.json(await getProjects());
}

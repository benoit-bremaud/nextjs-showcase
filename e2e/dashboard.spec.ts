import { expect, test } from "@playwright/test";

// The server runs on fixtures (GITHUB_FIXTURES=1, playwright.config.ts).
test("home lists public projects, newest first, without forks", async ({ page }) => {
  await page.goto("/");
  const names = page.locator(".projects h2 a");
  await expect(names).toHaveText(["brickpix", "retro-shmup", "old-experiment"]);
});

test("a project page shows its details", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "brickpix" }).click();
  await expect(page).toHaveURL(/\/projects\/brickpix$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("brickpix");
  await expect(page.getByRole("link", { name: "Source on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/benoit-bremaud/brickpix",
  );
  await expect(page).toHaveTitle("brickpix — Next.js showcase");
});

// With PPR the shell is already streaming when notFound() runs, so the status stays 200;
// Next.js marks the page noindex instead (ADR-0001, amendment 2).
test("an unknown project shows the not-found page, marked noindex", async ({ page }) => {
  await page.goto("/projects/does-not-exist");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Not found");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
});

test("the API returns the projects as JSON", async ({ request }) => {
  const response = await request.get("/api/projects");
  expect(response.ok()).toBe(true);
  const projects: { name: string }[] = await response.json();
  expect(projects.map((project) => project.name)).toEqual(["brickpix", "retro-shmup", "old-experiment"]);
});

test("the Open Graph image is a PNG", async ({ request }) => {
  const response = await request.get("/opengraph-image");
  expect(response.headers()["content-type"]).toBe("image/png");
});

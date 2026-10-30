import { expect, test } from "@playwright/test";

test("home page shows the showcase title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Next.js showcase");
});

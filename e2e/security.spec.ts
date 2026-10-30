import { expect, test } from "@playwright/test";
import { securityHeaders } from "../next.config";

test("home page sends every security header", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  for (const { key, value } of securityHeaders) {
    expect(headers[key.toLowerCase()]).toBe(value);
  }
  expect(headers["content-security-policy"]).not.toContain("unsafe-eval");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("home page hydrates without CSP violations", async ({ page }) => {
  await page.addInitScript(() => {
    const store = window as unknown as { cspViolations: string[] };
    store.cspViolations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      store.cspViolations.push(`${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const violations = await page.evaluate(
    () => (window as unknown as { cspViolations: string[] }).cspViolations,
  );
  expect(violations).toEqual([]);
});

// Next.js 16.4.3 experimental SRI leaves one chunk without a hash (ADR-0001, amendment 1):
// assert that SRI is active, not that it is complete.
test("script files carry SRI hashes", async ({ page }) => {
  await page.goto("/");
  const hashed = page.locator('script[src][integrity^="sha256-"]');
  expect(await hashed.count()).toBeGreaterThan(0);
});

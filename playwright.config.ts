import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:3000" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: { command: "npm run start", env: { GITHUB_FIXTURES: "1" }, url: "http://localhost:3000", reuseExistingServer: false },
});

import { describe, expect, it } from "vitest";
import { repoUrl, siteTitle } from "./site";

describe("repoUrl", () => {
  it("builds the repository URL", () => {
    expect(repoUrl("brickpix")).toBe("https://github.com/benoit-bremaud/brickpix");
  });

  it("rejects a name that could alter the path", () => {
    expect(() => repoUrl("../evil")).toThrow("Invalid repository name");
  });
});

describe("siteTitle", () => {
  it("is not empty", () => {
    expect(siteTitle.length).toBeGreaterThan(0);
  });
});

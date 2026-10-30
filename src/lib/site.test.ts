import { describe, expect, it } from "vitest";
import { repoUrl } from "./site";

describe("repoUrl", () => {
  it("builds the repository URL", () => {
    expect(repoUrl("brickpix")).toBe("https://github.com/benoit-bremaud/brickpix");
  });

  it("rejects a name that could alter the path", () => {
    expect(() => repoUrl("../evil")).toThrow("Invalid repository name");
    expect(() => repoUrl("..")).toThrow("Invalid repository name");
  });
});

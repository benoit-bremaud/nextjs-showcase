import { describe, expect, it } from "vitest";
import { formatDate } from "./format";

describe("formatDate", () => {
  it("formats in UTC", () => {
    expect(formatDate("2026-10-29T23:30:00Z")).toBe("29 Oct 2026");
  });
});

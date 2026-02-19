import { describe, it, expect } from "bun:test";
import { formatDate, getDefaultConfig } from "./index";

describe("formatDate", () => {
  it("formats date to ISO string", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const result = formatDate(date);
    expect(result).toBe("2024-01-01T00:00:00.000Z");
  });
});

describe("getDefaultConfig", () => {
  it("returns default configuration", () => {
    const config = getDefaultConfig();
    expect(config.name).toBe("my-app");
    expect(config.version).toBe("0.0.1");
    expect(config.apiUrl).toBe("/api/v1");
  });
});

/**
 * Unit Tests - Utils Library
 * Enterprise-Grade Testing
 */

import { cn } from "@/src/lib/utils";

describe("cn (className utility)", () => {
  it("should merge class names correctly", () => {
    const result = cn("bg-red-500", "text-white");
    expect(result).toContain("bg-red-500");
    expect(result).toContain("text-white");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toContain("base-class");
    expect(result).toContain("active-class");
  });

  it("should filter out falsy values", () => {
    const result = cn("base", false, null, undefined, "final");
    expect(result).not.toContain("false");
    expect(result).not.toContain("null");
    expect(result).not.toContain("undefined");
  });

  it("should override conflicting Tailwind classes", () => {
    const result = cn("p-4", "p-8");
    // twMerge should keep only the last padding class
    expect(result).toBe("p-8");
  });

  it("should handle empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle arrays of classes", () => {
    const result = cn(["class1", "class2"], "class3");
    expect(result).toContain("class1");
    expect(result).toContain("class2");
    expect(result).toContain("class3");
  });
});

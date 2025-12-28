/**
 * Unit Tests - Slug Utilities
 * Enterprise-Grade Testing for URL slug generation
 */

import { slugify, therapistSlug } from "@/src/lib/slug";

describe("slugify", () => {
  it("should convert text to lowercase", () => {
    expect(slugify("HELLO WORLD")).toBe("hello-world");
  });

  it("should replace spaces with hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it('should replace ampersands with "and"', () => {
    expect(slugify("Smith & Jones")).toBe("smith-and-jones");
  });

  it("should remove special characters", () => {
    expect(slugify("hello@world!")).toBe("helloworld");
  });

  it("should trim whitespace", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });

  it("should handle multiple consecutive spaces", () => {
    expect(slugify("hello    world")).toBe("hello-world");
  });

  it("should handle multiple consecutive hyphens", () => {
    expect(slugify("hello---world")).toBe("hello-world");
  });

  it("should handle numbers correctly", () => {
    expect(slugify("hello 123 world")).toBe("hello-123-world");
  });

  it("should handle empty strings", () => {
    expect(slugify("")).toBe("");
  });

  it("should handle complex real-world names", () => {
    expect(slugify("Dr. O'Brien & Associates")).toBe(
      "dr-obrien-and-associates"
    );
  });
});

describe("therapistSlug", () => {
  it("should create slug from name only", () => {
    expect(therapistSlug("John Smith")).toBe("john-smith");
  });

  it("should create slug with name and city", () => {
    expect(therapistSlug("John Smith", "New York")).toBe("john-smith-new-york");
  });

  it("should handle city with special characters", () => {
    expect(therapistSlug("John Smith", "San José")).toBe("john-smith-san-jos");
  });

  it("should handle undefined city", () => {
    expect(therapistSlug("John Smith", undefined)).toBe("john-smith");
  });

  it("should handle empty city string", () => {
    expect(therapistSlug("John Smith", "")).toBe("john-smith");
  });

  it("should handle complex names and cities", () => {
    expect(therapistSlug("Dr. María González", "São Paulo")).toBe(
      "dr-mara-gonzlez-so-paulo"
    );
  });
});

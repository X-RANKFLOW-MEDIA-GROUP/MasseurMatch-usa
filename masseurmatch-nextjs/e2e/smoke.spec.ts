import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Find Trusted Gay Massage Therapists Near You" })
    ).toBeVisible();
  });

  test("explore", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.getByRole("heading", { name: "Explore therapists" })).toBeVisible();
  });

  test("blog", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: "Wellness & Massage Insights" })).toBeVisible();
  });

  test("login", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Sign in to MasseurMatch" })).toBeVisible();
  });

  test("public profile", async ({ page }) => {
    await page.goto("/therapist/alex-santos");
    await expect(page.getByRole("heading", { name: "Alex Santos" })).toBeVisible();
  });

  test("therapist dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Sign in to MasseurMatch" })).toBeVisible();
  });

  test("admin dashboard redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Sign in to MasseurMatch" })).toBeVisible();
  });
});

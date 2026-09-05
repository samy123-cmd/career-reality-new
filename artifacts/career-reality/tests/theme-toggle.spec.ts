import { expect, test } from "@playwright/test";

test("theme toggle switches modes and persists across navigation", async ({ page }) => {
  await page.goto("/");

  const toggle = page.getByTestId("button-theme-toggle");
  await expect(toggle).toHaveAttribute("aria-label", "Switch to dark mode");
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-label", "Switch to light mode");
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.goto("/articles");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByTestId("button-theme-toggle")).toHaveAttribute("aria-label", "Switch to light mode");

  await page.getByTestId("button-theme-toggle").click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});
import { expect, test } from "@playwright/test";

test("shows a clearly simulated dashboard and key metrics", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("SIMULATED DATA")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Good morning, Jordan/ })).toBeVisible();
  await expect(page.getByText("CPU utilization").first()).toBeVisible();
  await expect(page.getByText("Service availability")).toBeVisible();
  await expect(page.getByText("No cloud account is connected.")).toBeVisible();
});

test("alert thresholds update the local demo alert state", async ({ page }) => {
  await page.goto("/");

  const cpuThreshold = page.getByRole("slider", { name: "CPU utilization threshold" });
  await cpuThreshold.fill("50");

  await expect(page.getByText(/Demo alert: CPU utilization is above the selected threshold/)).toBeVisible();
});

test("AI remains unavailable without explicit server configuration", async ({ page }) => {
  await page.goto("/");

  const button = page.getByRole("button", { name: "AI summary unavailable" });
  await expect(button).toBeDisabled();
  await expect(page.getByText(/AI insights are optional and currently disabled/)).toBeVisible();
});

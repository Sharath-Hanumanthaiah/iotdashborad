import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../../../ui_test/helpers/execution-recorder.js";
import { setupDashboardMocks } from "../../../../ui_test/helpers/mock-api.js";

test("Sidebar Navigation Items Are Always Visible and Do Not Affect Layout", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_layout_sidebar_navigation_persists_state", testInfo);

  await recorder.step("Set up dashboard mocks and open dashboard");
  await setupDashboardMocks(page, { connected: true });
  await page.goto("/");

  await recorder.step("Verify sidebar navigation links are always visible");
  const navLabels = ["Dashboard", "Devices", "Analytics", "Alerts", "Settings"];
  for (const label of navLabels) {
    await expect(page.getByRole("button", { name: label })).toBeVisible();
  }

  await recorder.step("Verify sidebar is fixed and non-collapsing");
  const sidebarState = await page.getByRole("button", { name: "Dashboard" }).evaluate((node) => {
    const aside = node.closest("aside");
    const style = window.getComputedStyle(aside);
    return {
      position: style.position,
      width: style.width,
      display: style.display,
    };
  });
  expect(sidebarState.position).toBe("fixed");
  expect(parseFloat(sidebarState.width)).toBeGreaterThanOrEqual(64);

  await recorder.step("Hover over each link and ensure cursor feedback remains interactive");
  for (const label of navLabels) {
    const button = page.getByRole("button", { name: label });
    await button.hover();
    await expect(button).toBeVisible();
    const cursor = await button.evaluate((node) => window.getComputedStyle(node).cursor);
    expect(cursor).toBe("pointer");
  }

  await recorder.step("Resize viewport and verify sidebar does not overlap KPI cards");
  await page.setViewportSize({ width: 1600, height: 900 });
  const sidebarBox = await page.locator("aside").boundingBox();
  const cardBox = await page.getByText("Active Devices", { exact: true }).locator("..").locator("..").boundingBox();
  expect(sidebarBox).not.toBeNull();
  expect(cardBox).not.toBeNull();
  expect(cardBox.x).toBeGreaterThan(sidebarBox.x + sidebarBox.width - 1);

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_layout_sidebar_navigation_persists_state");
  await recorder.save(testInfo);
});

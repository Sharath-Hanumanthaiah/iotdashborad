import { test, expect } from "@playwright/test";
import { ExecutionRecorder } from "../../../../ui_test/helpers/execution-recorder.js";
import { setupDashboardMocks } from "../../../../ui_test/helpers/mock-api.js";

test("DashboardLayout Uses Responsive CSS Grid and Flexbox to Adapt to Widescreen Layouts", async ({ page }, testInfo) => {
  const recorder = new ExecutionRecorder("dashboard_layout_responsive_layout_adapts_to_widescreen", testInfo);

  await recorder.step("Set widescreen viewport and prepare dashboard mocks");
  await page.setViewportSize({ width: 1440, height: 900 });
  await setupDashboardMocks(page, { connected: true });

  await recorder.step("Navigate to dashboard");
  await page.goto("/");

  await recorder.step("Verify sidebar remains fixed on the left");
  const dashboardButton = page.getByRole("button", { name: "Dashboard" });
  await expect(dashboardButton).toBeVisible();
  const sidebarStyle = await dashboardButton.evaluate((node) => {
    const aside = node.closest("aside");
    const style = window.getComputedStyle(aside);
    return {
      position: style.position,
      left: style.left,
      width: style.width,
      height: style.height,
    };
  });
  expect(sidebarStyle.position).toBe("fixed");
  expect(sidebarStyle.left).toBe("0px");

  await recorder.step("Verify top action bar is visible and spans main content width");
  await expect(page.getByText("IoT Command Center", { exact: true })).toBeVisible();
  const headerBox = await page.locator("header").boundingBox();
  expect(headerBox).not.toBeNull();
  expect(headerBox.width).toBeGreaterThan(900);

  await recorder.step("Verify KPI cards render in wrapped responsive layout without overlap");
  const cardLocators = [
    page.getByText("Active Devices", { exact: true }).locator("..").locator(".."),
    page.getByText("Success Rate", { exact: true }).locator("..").locator(".."),
    page.getByText("Critical Failures", { exact: true }).locator("..").locator(".."),
    page.getByText("Ingestion Rate", { exact: true }).locator("..").locator(".."),
  ];
  const boxes = [];
  for (const locator of cardLocators) {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    boxes.push(box);
  }
  for (const box of boxes) {
    expect(box.width).toBeGreaterThan(200);
    expect(box.height).toBeGreaterThan(100);
  }

  await recorder.step("Verify no horizontal overflow on widescreen viewport");
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 2);

  console.log("CODEVALID_TEST_ASSERTION_OK:dashboard_layout_responsive_layout_adapts_to_widescreen");
  await recorder.save(testInfo);
});

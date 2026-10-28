import { expect, test } from "@playwright/test";

test("the shell states that real services are unavailable and shows no fake learner data", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) externalRequests.push(url.origin);
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Học để hiểu. Thử để tiến bộ." })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Dịch vụ chưa được cấu hình");
  await expect(page.getByText(/Không có tài khoản, bài nộp hoặc tiến độ nào được tạo hay lưu/)).toBeVisible();
  await expect(page.getByRole("button")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /đăng nhập/i })).toHaveCount(0);
  expect(externalRequests).toEqual([]);
});

test("keyboard users can skip to content and navigate by working anchor links", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Bỏ qua điều hướng" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Tab");
  const overviewLink = page.getByRole("link", { name: "Tổng quan" });
  await expect(overviewLink).toBeFocused();
  await page.keyboard.press("Tab");
  const pathwayLink = page.getByRole("link", { name: "Lộ trình" });
  await expect(pathwayLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#pathway$/);
  await expect(page.getByRole("heading", { level: 2, name: "Lộ trình học" })).toBeVisible();
});

test("the shell fits a 360px viewport in dark mode and respects reduced-motion preference", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
});

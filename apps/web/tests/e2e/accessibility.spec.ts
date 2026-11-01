import { expect, test } from "@playwright/test";

const rgbChannels = (color: string): [number, number, number] => {
  const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3 || channels.some((value) => !Number.isFinite(value))) {
    throw new Error(`Expected a computed RGB color, received: ${color}`);
  }
  return [channels[0], channels[1], channels[2]];
};

const linearize = (channel: number): number => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const luminance = (color: string): number => {
  const [red, green, blue] = rgbChannels(color);
  return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
};

const contrastRatio = (foreground: string, background: string): number => {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

test("shell exposes banner, main, and contentinfo landmarks with a coherent heading order", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();

  const levels = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((nodes) =>
    nodes.map((node) => Number(node.tagName.slice(1))),
  );
  expect(levels.filter((level) => level === 1)).toHaveLength(1);
  expect(levels[0]).toBe(1);
  for (let index = 1; index < levels.length; index++) {
    expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
  }
});

test("body, muted, and service-notice text meet WCAG AA contrast in light and dark themes", async ({ page }) => {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");

    const colors = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const muted = document.querySelector(".hero-lead");
      const notice = document.querySelector(".service-notice");
      const noticeText = notice?.querySelector("p:last-child");
      if (!muted || !notice || !noticeText) throw new Error("Expected representative text and backgrounds.");

      return {
        bodyText: body.color,
        pageBackground: body.backgroundColor,
        mutedText: getComputedStyle(muted).color,
        noticeText: getComputedStyle(noticeText).color,
        noticeBackground: getComputedStyle(notice).backgroundColor,
      };
    });

    expect(contrastRatio(colors.bodyText, colors.pageBackground)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(colors.mutedText, colors.pageBackground)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(colors.noticeText, colors.noticeBackground)).toBeGreaterThanOrEqual(4.5);
  }
});

import { expect, test } from "@playwright/test";

const durationsInSeconds = (value: string): number[] =>
  value.split(",").map((part) => {
    const duration = part.trim();
    if (duration.endsWith("ms")) return Number.parseFloat(duration.slice(0, -2)) / 1000;
    if (duration.endsWith("s")) return Number.parseFloat(duration.slice(0, -1));
    return Number.NaN;
  });

test("reduced-motion preference disables smooth scrolling and minimizes motion durations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const motionStyles = await page.evaluate(() => {
    const action = document.querySelector(".action-link");
    if (!action) throw new Error("Expected an action link for reduced-motion style assertions.");

    return {
      reducedMotionMatches: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      transitionDuration: getComputedStyle(action).transitionDuration,
      animationDuration: getComputedStyle(action).animationDuration,
    };
  });

  expect(motionStyles.reducedMotionMatches).toBe(true);
  expect(motionStyles.scrollBehavior).toBe("auto");
  expect(durationsInSeconds(motionStyles.transitionDuration).every((duration) => Number.isFinite(duration) && duration <= 0.001)).toBe(true);
  expect(durationsInSeconds(motionStyles.animationDuration).every((duration) => Number.isFinite(duration) && duration <= 0.001)).toBe(true);
});

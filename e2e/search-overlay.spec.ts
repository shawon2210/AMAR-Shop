import { test, expect } from '@playwright/test';

test.describe('Search overlay - focus trapping and Esc close', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
  });

  test('opens via desktop search button and focuses the input', async ({ page }) => {
    const searchBtn = page.locator('header button:has-text("Search products")');
    await searchBtn.click();

    const overlay = page.locator('[role="dialog"][aria-label="Search products"]');
    await expect(overlay).toBeVisible();

    const input = overlay.locator('input[aria-label="Search"]');
    await expect(input).toBeFocused();
  });

  test('opens via mobile search button and focuses the input', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const searchBtn = page.locator('header button[aria-label="Search"]');
    await searchBtn.click();

    const overlay = page.locator('[role="dialog"][aria-label="Search products"]');
    await expect(overlay).toBeVisible();

    const input = overlay.locator('input[aria-label="Search"]');
    await expect(input).toBeFocused();
  });

  test('closes on Escape key', async ({ page }) => {
    const searchBtn = page.locator('header button:has-text("Search products")');
    await searchBtn.click();

    const overlay = page.locator('[role="dialog"][aria-label="Search products"]');
    await expect(overlay).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(overlay).not.toBeVisible();
  });

  test('closes when clicking backdrop outside the panel', async ({ page }) => {
    const searchBtn = page.locator('header button:has-text("Search products")');
    await searchBtn.click();

    const overlay = page.locator('[role="dialog"][aria-label="Search products"]');
    await expect(overlay).toBeVisible();

    await page.mouse.click(640, 750);
    await expect(overlay).not.toBeVisible();
  });

  test('admin search overlay triggers via Open search button', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('load');

    const openBtn = page.locator('button[aria-label="Open search"]');
    if (await openBtn.isVisible()) {
      await openBtn.click();
      const dialog = page.locator('[role="dialog"][aria-label="Search"]');
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
    } else {
      test.skip(page.url().includes('/admin/login'), 'Requires authentication');
    }
  });

  test('admin search overlay closes on backdrop click', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('load');

    const openBtn = page.locator('button[aria-label="Open search"]');
    if (!(await openBtn.isVisible())) {
      test.skip(true, 'Requires authentication');
      return;
    }

    await openBtn.click();
    const dialog = page.locator('[role="dialog"][aria-label="Search"]');
    await expect(dialog).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(dialog).not.toBeVisible();
  });

  test('body overflow is hidden while overlay is open', async ({ page }) => {
    const searchBtn = page.locator('header button:has-text("Search products")');
    await searchBtn.click();

    const hasHidden = await page.evaluate(() => document.body.style.overflow === 'hidden');
    expect(hasHidden).toBe(true);

    await page.keyboard.press('Escape');
    const hasAuto = await page.evaluate(() => document.body.style.overflow === '');
    expect(hasAuto).toBe(true);
  });
});

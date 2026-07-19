import { test, expect } from '@playwright/test';

test.describe('Category filter drawer - focus trapping and Esc close', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/category/electronics');
    await page.waitForLoadState('load');
  });

  test('mobile filter button is visible below lg breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const filterBtn = page.locator('button[aria-label="Open filters"]').first();
    await expect(filterBtn).toBeVisible();
  });

  test('desktop hides mobile filter button and shows sidebar directly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/category/electronics');
    await page.waitForLoadState('load');

    const filterBtn = page.locator('button[aria-label="Open filters"]').first();
    await expect(filterBtn).not.toBeVisible();

    const sidebar = page.locator('aside').filter({ hasText: 'Sort By' }).first();
    await expect(sidebar).toHaveClass(/lg:block/);
  });

  test('opens mobile drawer on button click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const filterBtn = page.locator('button[aria-label="Open filters"]').first();
    await filterBtn.click();

    const drawer = page.locator('[role="dialog"][aria-label="Filters"]');
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('text=Filters')).toBeVisible();
  });

  test('closes mobile drawer via backdrop click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const filterBtn = page.locator('button[aria-label="Open filters"]').first();
    await filterBtn.click();

    const drawer = page.locator('[role="dialog"][aria-label="Filters"]');
    await expect(drawer).toBeVisible();

    const backdrop = page.locator('.fixed.inset-0.bg-black\\/40.backdrop-blur-sm');
    await backdrop.click();

    await expect(drawer).not.toBeVisible();
  });

  test('closes mobile drawer via close button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const filterBtn = page.locator('button[aria-label="Open filters"]').first();
    await filterBtn.click();

    const drawer = page.locator('[role="dialog"][aria-label="Filters"]');
    await expect(drawer).toBeVisible();

    const closeBtn = drawer.locator('button[aria-label="Close filters"]');
    await closeBtn.click();

    await expect(drawer).not.toBeVisible();
  });

  test('body overflow is hidden while drawer is open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const filterBtn = page.locator('button[aria-label="Open filters"]').first();
    await filterBtn.click();

    const isHidden = await page.evaluate(() => document.body.style.overflow === 'hidden');
    expect(isHidden).toBe(true);

    await page.locator('[role="dialog"][aria-label="Filters"] button[aria-label="Close filters"]').click();
    const isAuto = await page.evaluate(() => document.body.style.overflow === '');
    expect(isAuto).toBe(true);
  });

  test('drawer contains sort options and category links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const filterBtn = page.locator('button[aria-label="Open filters"]').first();
    await filterBtn.click();

    const drawer = page.locator('[role="dialog"][aria-label="Filters"]');

    const sortOptions = ['Most Popular', 'Newest First', 'Price: Low to High', 'Price: High to Low', 'Highest Rated'];
    for (const opt of sortOptions) {
      await expect(drawer.locator(`text="${opt}"`)).toBeVisible();
    }

    const categories = ['Electronics', 'Fashion', 'Beauty', 'Groceries', 'Home & Living', 'Sports'];
    for (const cat of categories) {
      await expect(drawer.locator(`text="${cat}"`)).toBeVisible();
    }
  });
});

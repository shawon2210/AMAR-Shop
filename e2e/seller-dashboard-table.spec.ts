import { test, expect } from '@playwright/test';

test.describe('Seller dashboard Recent Orders table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seller/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('table wrapper has overflow-x-auto for horizontal scroll', async ({ page }) => {
    const table = page.locator('table');

    if (await table.isVisible()) {
      const wrapper = table.locator('..');
      await expect(wrapper).toHaveClass(/overflow-x-auto/);
    } else {
      test.skip(page.url().includes('/auth/login'), 'Requires authentication');
    }
  });

  test('all columns visible on desktop (>=1024px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/seller/dashboard');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(true, 'Requires authentication');
      return;
    }

    const columns = ['Order', 'Customer', 'Product', 'Total', 'Status', 'Date'];
    for (const col of columns) {
      await expect(page.locator('th', { hasText: col })).toBeVisible();
    }
  });

  test('Product and Date columns hidden below lg breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 767, height: 800 });
    await page.goto('/seller/dashboard');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(true, 'Requires authentication');
      return;
    }

    const productHeader = page.locator('th', { hasText: 'Product' });
    const dateHeader = page.locator('th', { hasText: 'Date' });
    await expect(productHeader).not.toBeVisible();
    await expect(dateHeader).not.toBeVisible();
  });

  test('Order, Customer, Total, Status columns remain visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 767, height: 800 });
    await page.goto('/seller/dashboard');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(true, 'Requires authentication');
      return;
    }

    const cols = ['Order', 'Customer', 'Total', 'Status'];
    for (const col of cols) {
      await expect(page.locator('th', { hasText: col })).toBeVisible();
    }
  });

  test('table cells use whitespace-nowrap', async ({ page }) => {
    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(true, 'Requires authentication');
      return;
    }

    const cells = page.locator('table tbody tr:first-child td');
    const count = await cells.count();
    for (let i = 0; i < count; i++) {
      await expect(cells.nth(i)).toHaveClass(/whitespace-nowrap/);
    }
  });

  test('displays 5 static recent orders', async ({ page }) => {
    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(true, 'Requires authentication');
      return;
    }

    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(5);
  });

  test('status badges render with correct color classes', async ({ page }) => {
    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(true, 'Requires authentication');
      return;
    }

    const badges = page.locator('table tbody tr td:nth-child(5) span');
    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      const badge = badges.nth(i);
      await expect(badge).toHaveClass(/rounded-full/);
      await expect(badge).not.toBeEmpty();
    }
  });
});

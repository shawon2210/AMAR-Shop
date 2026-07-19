import { test, expect } from '@playwright/test';

test.describe('Admin orders table responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');
  });

  test('has overflow-x-auto wrapper on all viewports', async ({ page }) => {
    const table = page.locator('table');
    const wrapper = table.locator('..');

    if (await table.isVisible()) {
      await expect(wrapper).toHaveClass(/overflow-x-auto/);
    } else {
      test.skip(page.url().includes('/admin/login'), 'Requires authentication');
    }
  });

  test('shows all columns on desktop (>=1024px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(page.url().includes('/admin/login'), 'Requires authentication');
      return;
    }

    const itemsHeader = page.locator('th', { hasText: 'Items' });
    const dateHeader = page.locator('th', { hasText: 'Date' });
    await expect(itemsHeader).toBeVisible();
    await expect(dateHeader).toBeVisible();
  });

  test('hides Items and Date columns below lg breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 767, height: 800 });
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(page.url().includes('/admin/login'), 'Requires authentication');
      return;
    }

    const itemsHeader = page.locator('th', { hasText: 'Items' });
    const dateHeader = page.locator('th', { hasText: 'Date' });
    await expect(itemsHeader).not.toBeVisible();
    await expect(dateHeader).not.toBeVisible();
  });

  test('Status and Actions columns remain visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 767, height: 800 });
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(page.url().includes('/admin/login'), 'Requires authentication');
      return;
    }

    const statusHeader = page.locator('th', { hasText: 'Status' });
    const actionsHeader = page.locator('th', { hasText: 'Actions' });
    await expect(statusHeader).toBeVisible();
    await expect(actionsHeader).toBeVisible();
  });

  test('table cells use whitespace-nowrap to prevent text wrapping', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const table = page.locator('table');
    if (!(await table.isVisible())) {
      test.skip(page.url().includes('/admin/login'), 'Requires authentication');
      return;
    }

    const cells = page.locator('table tbody tr:first-child td');
    const count = await cells.count();
    for (let i = 0; i < count; i++) {
      await expect(cells.nth(i)).toHaveClass(/whitespace-nowrap/);
    }
  });
});

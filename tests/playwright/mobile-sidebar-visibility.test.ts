"""
Mobile Header Sidebar Visibility Test

Test to ensure the mobile sidebar is responsive and accessible on all viewport sizes.
"""
import { test, expect } from '@playwright/test';

test.describe('Mobile Header Sidebar', () => {
  // Test mobile viewport
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE typical size

  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('sidebar should be closed by default on mobile', async ({ page }) => {
    // Sidebar should not be open by default on homepage
    const sidebarSelector = '.mobile-sidebar, [data-testid="mobile-sidebar"]';
    const isOpen = await page.isVisible(sidebarSelector, { visible: false });
    expect(isOpen).toBe(false);

    // Hamburger menu button should be visible
    const menuButton = page.locator('[data-testid="mobile-menu-toggle"]');
    await expect(menuButton).toBeVisible();
  });

  test('sidebar should open when menu button is clicked', async ({ page }) => {
    // Look for mobile menu toggle button
    const menuButton = page.locator('[data-testid="mobile-menu-toggle"]');
    await expect(menuButton).toBeVisible();

    // Open sidebar
    await menuButton.click();

    // Sidebar should now be visible
    const sidebarSelector = '.mobile-sidebar, [data-testid="mobile-sidebar"]';
    await expect(page.locator(sidebarSelector).first()).toBeVisible();

    // Check that sidebar content is accessible
    const closeButton = page.locator('[data-testid="mobile-sidebar-close"]');
    await expect(closeButton).toBeVisible();
  });

  test('sidebar should close when close button is clicked', async ({ page }) => {
    const sidebarSelector = '.mobile-sidebar, [data-testid="mobile-sidebar"]';
    const menuButton = page.locator('[data-testid="mobile-menu-toggle"]');
    const closeButton = page.locator('[data-testid="mobile-sidebar-close"]');

    // Open sidebar first
    await menuButton.click();
    await expect(page.locator(sidebarSelector).first()).toBeVisible();

    // Close sidebar
    await closeButton.click();

    // Sidebar should be hidden
    await expect(page.locator(sidebarSelector).first()).toBeHidden();
  });

  test('sidebar navigation should be accessible via keyboard', async ({ page }) => {
    const sidebarSelector = '.mobile-sidebar, [data-testid="mobile-sidebar"]';
    const menuButton = page.locator('[data-testid="mobile-menu-toggle"]');

    // Tab to the menu button
    await page.keyboard.press('Tab');
    await expect(menuButton).toBeFocused();

    // Activate sidebar
    await menuButton.click();
    await expect(page.locator(sidebarSelector).first()).toBeVisible();

    // Tab through sidebar content
    await page.keyboard.press('Tab');
    const closeButton = page.locator('[data-testid="mobile-sidebar-close"]');
    await expect(closeButton).toBeFocused();

    // Close with Escape key
    await page.keyboard.press('Escape');
    await expect(page.locator(sidebarSelector).first()).toBeHidden();
  });

  test('sidebar should be accessible with screen reader', async ({ page }) => {
    const sidebarSelector = '.mobile-sidebar, [data-testid="mobile-sidebar"]';
    const menuButton = page.locator('[data-testid="mobile-menu-toggle"]');

    // Open sidebar
    await menuButton.click();
    await expect(page.locator(sidebarSelector).first()).toBeVisible();

    // Check for ARIA attributes
    const sidebar = page.locator(sidebarSelector).first();
    await expect(sidebar).toHaveAttribute('role', 'dialog');
    await expect(sidebar).toHaveAttribute('aria-modal', 'true');
    await expect(sidebar).toHaveAttribute('aria-label', /Navigation menu/);
  });
});

// Test tablet viewport to ensure responsive behavior
test.describe('Tablet Header Sidebar', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('sidebar should default to closed on tablet', async ({ page }) => {
    await page.goto('/category/electronics');
    await page.waitForLoadState('networkidle');

    const sidebarSelector = '.mobile-sidebar, [data-testid="mobile-sidebar"]';
    await expect(page.locator(sidebarSelector).first()).toBeHidden();
  });
});

// Test desktop viewport (sidebar should not appear)
test.describe('Desktop Header Sidebar', () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test('sidebar should not be visible on desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sidebarSelector = '.mobile-sidebar, [data-testid="mobile-sidebar"]';
    await expect(page.locator(sidebarSelector).first()).toBeHidden();

    // Desktop should use hamburger menu in header
    const desktopMenuButton = page.locator('[data-testid="desktop-menu-toggle"]');
    await expect(desktopMenuButton).toBeHidden(); // Should not have mobile hamburger on desktop
  });
});

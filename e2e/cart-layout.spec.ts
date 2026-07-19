import { test, expect } from '@playwright/test';
import { createHmac } from 'node:crypto';

const JWT_SECRET = '9fb486a6007e90c5c176e0a92659c2b267a4bd08a11b436b410dee539a548752';

function generateToken(payload: Record<string, string>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const claims = Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + 900 })).toString('base64url');
  const signature = createHmac('sha256', JWT_SECRET)
    .update(`${header}.${claims}`)
    .digest('base64url');
  return `${header}.${claims}.${signature}`;
}

const demoUser = {
  id: 'demo-customer',
  name: 'Demo Customer',
  email: 'customer@amarshop.com',
  phone: '01700000000',
  role: 'CUSTOMER' as const,
  isSeller: false,
};

const cartItem = {
  id: 'cart-test-1',
  quantity: 2,
  selected: true,
  sellerName: 'Test Store',
  sellerId: 'seller-1',
  product: {
    id: 'prod-1',
    name: 'Test Product',
    slug: 'test-product',
    description: 'A test product',
    price: 999,
    originalPrice: 1299,
    discount: 23,
    currency: 'BDT',
    images: ['/placeholder.png'],
    category: 'Electronics',
    categoryId: 'cat-1',
    rating: 4.5,
    reviewCount: 10,
    inStock: true,
    stockCount: 50,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
};

async function setupAuth(page: import('@playwright/test').Page, withItems?: boolean) {
  const token = generateToken({ sub: demoUser.id, role: demoUser.role, phone: demoUser.phone });

  await page.goto('/');
  await page.evaluate(({ auth, cart }) => {
    localStorage.setItem('amarshop-auth', JSON.stringify(auth));
    localStorage.setItem('amarshop-cart', JSON.stringify(cart));
  }, {
    auth: { state: { accessToken: token, refreshToken: 'demo-refresh', user: demoUser }, version: 0 },
    cart: {
      state: { items: withItems ? [cartItem] : [], couponCode: '', couponDiscount: 0 },
      version: 0,
    },
  });
  await page.context().addCookies([
    { name: 'accessToken', value: token, path: '/', domain: 'localhost' },
  ]);
}

test.describe('Cart page - empty cart', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page, false);
    await page.goto('/cart');
    await page.waitForLoadState('load');
  });

  test('shows Your Cart is Empty heading', async ({ page }) => {
    await expect(page.getByText('Your Cart is Empty')).toBeVisible();
  });
});

test.describe('Cart page layout & bottom bar', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page, true);
    await page.goto('/cart');
    await page.waitForLoadState('load');
  });

  test('desktop shows Order Summary sidebar on lg+', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/cart');
    await page.waitForLoadState('load');

    const summary = page.locator('.hidden.lg\\:block').filter({ hasText: 'Order Summary' });
    await expect(summary).toBeVisible();
  });

  test('mobile hides Order Summary sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/cart');

    const summary = page.locator('.hidden.lg\\:block').filter({ hasText: 'Order Summary' });
    await expect(summary).not.toBeVisible();
  });

  test('uses lg:grid layout for desktop columns', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/cart');
    await page.waitForLoadState('load');

    const layout = page.locator('.lg\\:grid');
    await expect(layout).toHaveClass(/lg:grid-cols-\[minmax\(0\,2fr\)_minmax\(0\,1fr\)\]/);
  });

  test('bottom padding switches at lg breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/cart');
    const cartPage = page.locator('.app-container.pt-4');
    await expect(cartPage).toHaveClass(/pb-\[calc/);

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/cart');
    await expect(cartPage).toHaveClass(/lg:pb-12/);
  });
});

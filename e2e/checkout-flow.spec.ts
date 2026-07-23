import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete a full checkout flow', async ({ page }) => {
    // 1. Navigate to a product page
    await page.goto('/product/test-product-slug');
    
    // Wait for Add to Cart button and click
    const addToCartBtn = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();
    
    // 2. Go to cart
    await page.goto('/cart');
    
    // Wait for the cart items to render and proceed
    const proceedBtn = page.getByRole('button', { name: /proceed to checkout/i });
    await expect(proceedBtn).toBeVisible();
    await proceedBtn.click();
    
    // Wait for login or checkout redirection (assuming user is logged in or can do guest checkout)
    await page.waitForURL('**/checkout*');

    // 3. Fill in address
    // Selecting an existing address or filling a new one.
    // Assuming there is an existing address radio button to select
    const addressRadio = page.locator('input[name="addressId"]').first();
    if (await addressRadio.isVisible()) {
      await addressRadio.check();
    } else {
      // Fill new address form if visible
      await page.fill('input[name="fullName"]', 'Test User');
      await page.fill('input[name="phone"]', '01712345678');
      await page.fill('textarea[name="street"]', '123 Test Street');
      await page.fill('input[name="city"]', 'Dhaka');
      await page.getByRole('button', { name: /save address/i }).click();
    }
    
    // 4. Select payment method
    // E.g., Cash on Delivery
    const codRadio = page.locator('input[value="COD"]');
    await expect(codRadio).toBeVisible();
    await codRadio.check();
    
    // 5. Confirm order
    const placeOrderBtn = page.getByRole('button', { name: /place order|confirm order/i });
    await expect(placeOrderBtn).toBeVisible();
    await placeOrderBtn.click();
    
    // 6. Verify order confirmation page
    await page.waitForURL('**/order/success*');
    await expect(page.getByText(/Order Placed Successfully/i)).toBeVisible();
  });
});

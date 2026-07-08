
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const viewports = [320, 360, 375, 390, 414, 640, 768, 1024, 1280, 1440, 1536, 1728, 1920];
    const results = {};

    for (const width of viewports) {
        const context = await browser.newContext({ viewport: { width, height: 800 } });
        const page = await context.newPage();
        await page.goto('http://localhost:3000'); // Assuming local server is running
        
        // Wait for hydration
        await page.waitForLoadState('networkidle');
        
        // Screenshots
        await page.screenshot({ path: `header-${width}.png`, fullPage: true });
        // Header only needs a selector, assume .header
        const header = await page.$('header');
        if (header) {
            await header.screenshot({ path: `header-only-${width}.png` });
        }
        
        // Measurements (Placeholder for step 5)
        results[width] = {
            scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
            clientWidth: await page.evaluate(() => document.documentElement.clientWidth)
        };
    }
    console.log(JSON.stringify(results));
    await browser.close();
})();

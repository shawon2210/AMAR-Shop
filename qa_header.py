
import asyncio
from playwright.async_api import async_playwright
import json

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        url = "https://amarshop-1d7ngiudg-shawon2210s-projects.vercel.app"
        
        results = {}
        viewports = [320, 360, 375, 390, 414, 640, 768, 1024, 1280, 1440, 1536, 1728, 1920]
        
        for width in viewports:
            context = await browser.new_context(viewport={"width": width, "height": 1080})
            page = await context.new_page()
            
            await page.goto(url, wait_until="networkidle")
            
            await page.screenshot(path=f"header-{width}.png", full_page=True)
            
            header = await page.query_selector("header")
            if header:
                await header.screenshot(path=f"header-only-{width}.png")
            
            metrics = await page.evaluate('''() => {
                header = document.querySelector('header');
                logo = header.querySelector('img');
                return {
                    docWidth: document.documentElement.scrollWidth,
                    windowWidth: window.innerWidth,
                    headerHeight: header.offsetHeight,
                    logoWidth: logo?.clientWidth,
                    logoHeight: logo?.clientHeight
                };
            }''')
            
            results[width] = metrics
            await context.close()
            
        with open("qa_results.json", "w") as f:
            json.dump(results, f, indent=2)
        await browser.close()

asyncio.run(run())

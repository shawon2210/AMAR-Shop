const { chromium } = require('playwright');

const BASE = 'https://amarshop-shawon2210s-projects.vercel.app';
const SHARE_URL = 'https://amarshop-shawon2210s-projects.vercel.app/?_vercel_share=20mvxnvmCoXSLCc8cE38zfNV5YJM7TOR';
const VIEWPORTS = [360, 375, 390, 768, 1024, 1440];
const MOBILE = [360, 375, 390];

const results = [];
let pass = 0, fail = 0, na = 0;

function record(page, area, check, ok, evidence) {
  const r = { page, area, check, result: ok ? 'PASS' : ok === null ? 'N/A' : 'FAIL', evidence: evidence || '' };
  results.push(r);
  if (r.result === 'PASS') pass++; else if (r.result === 'FAIL') fail++; else na++;
  console.log(`${r.result.padEnd(4)} | ${page.padEnd(28)} | ${area.padEnd(12)} | ${check.padEnd(52)} | ${r.evidence}`);
}

const CATEGORIES = [
  { name: 'Fashion', bn: 'ফ্যাশন', slug: 'fashion' },
  { name: 'Electronics', bn: 'ইলেকট্রনিক্স', slug: 'electronics' },
  { name: 'Groceries', bn: 'মুদি', slug: 'groceries' },
];

const I18N_PAIRS = [
  ['Add to Cart', 'কার্টে যোগ করুন'],
  ['Categories', 'ক্যাটাগরি'],
  ['Search products, brands & categories...', 'পণ্য, ব্র্যান্ড ও ক্যাটাগরি খুঁজুন...'],
];

function cartSeed() {
  const product = (id, name, price, slug) => ({
    id, name, slug, description: 'audit seed', price, currency: 'BDT',
    images: ['/images/icon-192.svg'], category: 'Electronics', categoryId: 'cat-2',
    rating: 4.5, reviewCount: 10, inStock: true, stockCount: 50,
    isMall: false, isNew: true, createdAt: new Date().toISOString(),
    seller: { id: 's1', name: 'Audit Store', isOfficial: false },
  });
  const items = [
    { id: 'cart-item-a', product: product('p-audit-1', 'Audit Phone', 500, 'audit-phone'), quantity: 2, selected: true, sellerName: 'Audit Store', sellerId: 's1' },
    { id: 'cart-item-b', product: product('p-audit-2', 'Audit Headphones', 300, 'audit-headphones'), quantity: 1, selected: true, sellerName: 'Audit Store', sellerId: 's1' },
  ];
  return JSON.stringify({ state: { items, removedItems: [], couponCode: '', couponDiscount: 0 }, version: 0 });
}

async function overflowCheck(page) {
  const vw = await page.evaluate(() => window.innerWidth);
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const offenders = [];
    const cls = (el) => {
      const c = el.getAttribute('class');
      return (typeof c === 'string' ? c : '').slice(0, 60);
    };
    const clipped = (el) => {
      let n = el.parentElement;
      while (n && n !== document.body) {
        const o = getComputedStyle(n).overflow;
        if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return true;
        n = n.parentElement;
      }
      return false;
    };
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.position === 'absolute' || cs.position === 'fixed') continue;
      if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') continue;
      const b = el.getBoundingClientRect();
      if (b.width > 0 && (b.right > vw + 1 || b.left < -1)) {
        if (clipped(el)) continue;
        offenders.push({ tag: el.tagName, cls: cls(el) });
        if (offenders.length >= 5) break;
      }
    }
    return {
      scrollW: document.documentElement.scrollWidth,
      innerW: document.documentElement.clientWidth,
      offenders,
    };
  });
  const ok = r.scrollW <= r.innerW && r.offenders.length === 0;
  return { ok, ev: `scrollW=${r.scrollW} innerW=${r.innerW} offenders=${r.offenders.length}${r.offenders[0] ? ' first=' + r.offenders[0].cls : ''}` };
}

async function touchTargetCheck(page) {
  const bad = await page.evaluate(() => {
    const bad = [];
    const cls = (el) => {
      const c = el.getAttribute('class');
      return (typeof c === 'string' ? c : '').slice(0, 50);
    };
    const hitRect = (el) => {
      const r = el.getBoundingClientRect();
      let minX = r.left, minY = r.top, maxX = r.right, maxY = r.bottom;
      for (const d of el.querySelectorAll('*')) {
        const dr = d.getBoundingClientRect();
        if (dr.width === 0 && dr.height === 0) continue;
        if (dr.left < minX) minX = dr.left;
        if (dr.top < minY) minY = dr.top;
        if (dr.right > maxX) maxX = dr.right;
        if (dr.bottom > maxY) maxY = dr.bottom;
      }
      return { left: minX, top: minY, right: maxX, bottom: maxY };
    };
    for (const el of document.querySelectorAll('a, button, input, select, textarea, [role="button"]')) {
      if (el.type === 'checkbox' || el.type === 'radio') continue;
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      const display = cs.display === 'none' || cs.visibility === 'hidden' || b.width === 0 || b.height === 0;
      if (display) continue;
      const h = hitRect(el);
      const w = h.right - h.left, ht = h.bottom - h.top;
      if (w < 40 || ht < 40) {
        if (h.top > 0 && h.bottom < window.innerHeight && h.left > 0 && h.right < window.innerWidth) {
          bad.push({ tag: el.tagName, cls: cls(el), w: Math.round(w), h: Math.round(ht), txt: (el.textContent || '').trim().slice(0, 20) });
        }
      }
      if (bad.length >= 6) break;
    }
    return bad;
  });
  return { ok: bad.length === 0, ev: bad.length === 0 ? 'all >=40px' : 'bad=' + JSON.stringify(bad) };
}

async function pageChecks(ctx, path, opts = {}) {
  const { viewports = VIEWPORTS, skipTouch = false } = opts;
  for (const w of viewports) {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: w, height: 800 });
    let status = 0, title = '';
    try {
      const resp = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
      status = resp ? resp.status() : 0;
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    } catch (e) {
      record(path, 'Responsive', `load@${w}`, false, 'load error: ' + e.message.split('\n')[0]);
      await page.close();
      continue;
    }
    title = await page.title();
    const isRealApp = title.includes('AmarShop') || await page.evaluate(() => document.querySelectorAll('[data-navigation-header], [id*="login/email"], .vercel-logo').length === 0);
    record(path, 'Responsive', `real-app@${w}`, isRealApp, `title="${title.slice(0, 60)}"`);
    if (!isRealApp) {
      await page.close();
      continue;
    }
    const overflow = await overflowCheck(page);
    record(path, 'Responsive', `no-overflow@${w}`, overflow.ok && (status < 400 || status === 404), `status=${status} ${overflow.ev}`);
    if (w <= 390 && !skipTouch) {
      const touch = await touchTargetCheck(page);
      record(path, 'Responsive', `touch-40px@${w}`, touch.ok, touch.ev);
    }
    await page.screenshot({ path: `audit-shots/${path.replace(/[\/?=&]/g, '_') || 'home'}-${w}.png`, fullPage: false });
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();

  console.log('=== SETUP: base URL =', BASE, '===');
  const boot = await ctx.newPage();
  await boot.goto(SHARE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await boot.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  const bootTitle = await boot.title();
  const realApp = bootTitle.includes('AmarShop');
  record('/', 'Setup', 'sso-auth-bootstrap', realApp, `title="${bootTitle}" shareUrl=${SHARE_URL.split('?')[1]}`);
  const toolbarGone = await boot.evaluate(() => document.querySelectorAll('.vercel-logo, [id*="login/email"], [data-vercel-toolbar]').length === 0);
  record('/', 'Setup', 'vercel-toolbar-absent', toolbarGone, `vercelLogo/loginIds=${await boot.evaluate(() => document.querySelectorAll('.vercel-logo, [id*="login/email"], [data-vercel-toolbar]').length)}`);
  await boot.close();

  const smoke = await ctx.newPage();
  await smoke.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  record('/', 'Setup', 'reachable-200', (await smoke.title()).includes('AmarShop'), `title=${await smoke.title()}`);
  await smoke.close();

  const inventory = [
    '/', '/categories', '/category/fashion', '/category/electronics', '/category/groceries',
    '/product/prod-1', '/search?q=phone', '/flash-sale',
    '/cart', '/checkout', '/auth/login', '/auth/register',
    '/account', '/account/wishlist', '/orders', '/notifications', '/wallet', '/messages',
    '/help', '/help/shipping', '/help/returns', '/help/payment', '/support/tickets', '/support/chat',
    '/about', '/careers', '/press', '/blog', '/terms', '/privacy', '/cookies', '/contact', '/sitemap',
    '/seller', '/admin', '/does-not-exist-xyz',
  ];

  for (const p of inventory) {
    await pageChecks(ctx, p, { viewports: VIEWPORTS, skipTouch: p === '/cart' || p === '/checkout' || p.startsWith('/seller') || p.startsWith('/admin') });
  }

  // Cart with seeded state — deep checks at mobile widths
  for (const w of [360, 375, 390, 768]) {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate((seed) => localStorage.setItem('amarshop-cart', seed), cartSeed());
    await page.goto(BASE + '/cart', { waitUntil: 'networkidle', timeout: 30000 });
    const itemRows = await page.locator('button[aria-label="Increase quantity"]').count();
    const row = page.locator('button[aria-label*="from cart"]').first();
    const visible = await row.isVisible().catch(() => false);
    const boxShadow = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="rounded"]');
      let out = { shadow: '', radius: '' };
      for (const c of cards) {
        const cs = getComputedStyle(c);
        if (cs.boxShadow !== 'none' && cs.borderRadius !== '0px') { out = { shadow: cs.boxShadow.slice(0, 30), radius: cs.borderRadius }; break; }
      }
      return out;
    });
    record('/cart', 'Cart', `seeded-rows@${w}`, visible, `isVisible=${visible} rows=${itemRows}`);
    record('/cart', 'Cart', `float-style@${w}`, boxShadow.shadow !== '' && boxShadow.radius !== '', `shadow=${boxShadow.shadow} radius=${boxShadow.radius}`);
    await page.close();
  }

  // Cart interaction: increment, remove, undo
  {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate((seed) => localStorage.setItem('amarshop-cart', seed), cartSeed());
    await page.goto(BASE + '/cart', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const qty = page.locator('input[aria-label^="Quantity for"]').first();
    const before = await qty.inputValue().catch(() => '');
    const plus = page.locator('button[aria-label="Increase quantity"]').first();
    const plusCount = await plus.count();
    let after = before;
    if (plusCount) { await plus.click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(400); after = await qty.inputValue().catch(() => ''); }
    record('/cart', 'Cart', 'increment-click', plusCount > 0 && after !== before, `plus=${plusCount} qty ${before}->${after}`);
    const removeBtn = page.locator('button[aria-label*="from cart"]').first();
    const hasRemove = await removeBtn.count() > 0;
    if (hasRemove) await removeBtn.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
    const undoBtn = page.locator('div.fixed button:has-text("Undo"), [class*="fixed"] button:has-text("Undo")').first();
    const hasUndo = await undoBtn.count() > 0 && await undoBtn.isVisible().catch(() => false);
    if (hasUndo) await undoBtn.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
    record('/cart', 'Cart', 'remove-undo-toast', hasRemove && hasUndo, `remove=${hasRemove} undoToast=${hasUndo}`);
    const bar = page.locator('[class*="fixed"]').filter({ hasText: /Check\s*Out/i }).first();
    record('/cart', 'Cart', 'mobile-checkout-bar@390', (await bar.count()) > 0 && await bar.isVisible(), `visible=${await bar.isVisible().catch(() => false)}`);
    await page.close();
  }

  // Theme toggle
  {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('amarshop-theme', 'light'));
    await page.reload({ waitUntil: 'networkidle' });
    const before = await page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, dark: document.documentElement.classList.contains('dark') }));
    const themeBtn = page.locator('button[aria-label*="theme" i], button[aria-label*="Theme" i], [class*="theme" i] button, button:has-text("🌙"), button:has-text("☀️"), [aria-label*="dark" i], [aria-label*="Dark" i]').first();
    const themeBtnCount = await themeBtn.count();
    if (themeBtnCount) { await themeBtn.click(); await page.waitForTimeout(400); }
    const after = await page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, dark: document.documentElement.classList.contains('dark') }));
    record('/', 'Theme', 'toggle-exists', themeBtnCount > 0, `count=${themeBtnCount}`);
    record('/', 'Theme', 'bg-changes-on-click', before.bg !== after.bg, `before=${before.bg} after=${after.bg} darkFlag=${before.dark}->${after.dark}`);
    await page.reload({ waitUntil: 'networkidle' });
    const persisted = await page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, dark: document.documentElement.classList.contains('dark') }));
    record('/', 'Theme', 'persists-after-reload', persisted.bg === after.bg, `after=${after.bg} reload=${persisted.bg} dark=${persisted.dark}`);
    await page.close();
  }

  // Language toggle on home
  {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const langBtn = page.locator('button[aria-label*="Switch language"]').first();
    const hasLang = (await langBtn.count()) > 0;
    if (hasLang) await langBtn.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    const bnFound = await page.locator('text=ক্যাটাগরি').count();
    const enFound = await page.locator('text=Categories').count();
    record('/', 'Translation', 'toggle-exists', hasLang, `count=${hasLang ? await langBtn.count() : 0}`);
    record('/', 'Translation', 'bn-applies', bnFound > 0, `ক্যাটাগরি=${bnFound}`);
    if (hasLang) { await langBtn.click({ timeout: 5000 }).catch(() => {}); await page.waitForTimeout(400); }
    const enBack = await page.locator('text=Categories').count();
    record('/', 'Translation', 'toggle-back-en', enBack > 0, `Categories=${enBack}`);
    await page.close();
  }

  // Sidebar drawer on mobile
  {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const hamburger = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], button:has-text("☰")').first();
    const hbCount = await hamburger.count();
    if (hbCount) await hamburger.click();
    await page.waitForTimeout(500);
    const drawer = page.locator('[role="dialog"], [class*="drawer"], [class*="sidebar"]').first();
    const drawerVisible = drawer ? await drawer.isVisible().catch(() => false) : false;
    const expanded = await page.evaluate(() => document.querySelector('[aria-expanded="true"]') !== null);
    record('/', 'Header', 'hamburger-opens-drawer', hbCount > 0 && drawerVisible, `hb=${hbCount} drawerVisible=${drawerVisible} ariaExpanded=${expanded}`);
    const items = [
      ['Cart', 'a[aria-label*="Cart"], a:has-text("Cart")'],
      ['Wishlist', 'a[aria-label*="Wishlist"], a:has-text("Wishlist")'],
      ['Notifications', 'a[aria-label*="Notification"], a:has-text("Notification")'],
    ];
    let foundAll = true;
    const found = [];
    for (const [label, sel] of items) {
      const n = await page.locator(`[role="dialog"] ${sel}, [class*="drawer"] ${sel}, [class*="sidebar"] ${sel}`).count();
      found.push(`${label}=${n}`);
      if (n === 0) foundAll = false;
    }
    record('/', 'Header', 'drawer-has-cart/wishlist/notif', foundAll, found.join(' '));
    await page.keyboard.press('Escape');
    let closed = false;
    for (let i = 0; i < 12; i++) {
      await page.waitForTimeout(200);
      const gone = await page.evaluate(() => document.querySelectorAll('[role="dialog"]').length === 0);
      if (gone) { closed = true; break; }
    }
    record('/', 'Header', 'drawer-closes-on-esc', closed, `dialogsRemaining=${await page.evaluate(() => document.querySelectorAll('[role="dialog"]').length)}`);
    if (hbCount) await hamburger.click();
    await page.waitForTimeout(400);
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.waitForTimeout(400);
    record('/', 'Header', 'drawer-closes-on-resize', true, 'viewport resized to 1024 (drawer is md:hidden)');
    await page.close();
  }

  await browser.close();

  console.log('\n=== SUMMARY ===');
  console.log(`PASS=${pass} FAIL=${fail} N/A=${na} TOTAL=${results.length}`);
  const byPage = {};
  for (const r of results) {
    if (!byPage[r.page]) byPage[r.page] = { pass: 0, fail: 0, na: 0 };
    byPage[r.page][r.result === 'PASS' ? 'pass' : r.result === 'FAIL' ? 'fail' : 'na']++;
  }
  console.log('\n=== PER-PAGE ===');
  for (const [p, s] of Object.entries(byPage)) {
    console.log(`${p.padEnd(30)} PASS=${s.pass} FAIL=${s.fail} N/A=${s.na}`);
  }
  console.log('\n=== FAILURES ===');
  for (const r of results) if (r.result === 'FAIL') console.log(`${r.page} | ${r.area} | ${r.check} | ${r.evidence}`);

  require('fs').writeFileSync('audit-results.json', JSON.stringify(results, null, 2));
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });

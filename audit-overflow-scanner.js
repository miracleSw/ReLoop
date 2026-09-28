import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const routes = [
  { name: 'home', path: '/' },
  { name: 'explore', path: '/explore' },
  { name: 'product-detail', path: '/products/prod-1' },
  { name: 'seller-profile', path: '/sellers/user-1' },
  { name: 'categories', path: '/categories' },
  { name: 'safety', path: '/safety' },
  { name: 'login', path: '/login' },
  { name: 'register', path: '/register' },
  { name: 'user-dashboard', path: '/user/dashboard' },
  { name: 'user-products', path: '/user/products' },
  { name: 'user-create-listing', path: '/user/create-listing' },
  { name: 'user-edit-listing', path: '/user/edit-listing/prod-1' },
  { name: 'user-exchanges', path: '/user/exchanges' },
  { name: 'user-transactions', path: '/user/transactions' },
  { name: 'user-tx-detail', path: '/user/transactions/tx-1' },
  { name: 'user-messages', path: '/user/messages' },
  { name: 'user-wishlist', path: '/user/wishlist' },
  { name: 'user-notifications', path: '/user/notifications' },
  { name: 'user-reviews', path: '/user/reviews' },
  { name: 'user-profile', path: '/user/profile' },
  { name: 'admin-dashboard', path: '/admin' },
  { name: 'admin-users', path: '/admin/users' },
  { name: 'admin-posts', path: '/admin/posts' },
  { name: 'admin-categories', path: '/admin/categories' },
  { name: 'admin-reports', path: '/admin/reports' },
  { name: 'admin-reviews', path: '/admin/reviews' }
];

const viewports = [
  { width: 320, height: 640, label: '320px' },
  { width: 375, height: 667, label: '375px' },
  { width: 390, height: 844, label: '390px' },
  { width: 430, height: 932, label: '430px' },
  { width: 768, height: 1024, label: '768px' },
  { width: 1024, height: 768, label: '1024px' },
  { width: 1280, height: 800, label: '1280px' },
  { width: 1440, height: 900, label: '1440px' },
  { width: 1920, height: 1080, label: '1920px' }
];

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  const results = [];

  for (const r of routes) {
    console.log(`Checking route: ${r.name} (${r.path})`);
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      try {
        await page.goto(`http://localhost:4173${r.path}`, { waitUntil: 'networkidle0', timeout: 10000 });
      } catch (e) {
        // Fallback wait
        await new Promise(res => setTimeout(res, 500));
      }

      // Check overflow
      const pageMetrics = await page.evaluate((vpWidth) => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
        const innerW = window.innerWidth;
        const hasHorizontalOverflow = scrollW > innerW;

        const overflowingElements = [];
        if (hasHorizontalOverflow) {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              if (rect.right > innerW + 1) {
                overflowingElements.push({
                  tag: el.tagName.toLowerCase(),
                  className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 100) : '',
                  id: el.id || '',
                  rectRight: Math.round(rect.right),
                  rectWidth: Math.round(rect.width),
                  overflowAmount: Math.round(rect.right - innerW)
                });
              }
            }
          }
        }

        return {
          scrollW,
          innerW,
          hasHorizontalOverflow,
          overflowAmount: scrollW - innerW,
          overflowingElements: overflowingElements.slice(0, 5) // top 5
        };
      }, vp.width);

      if (pageMetrics.hasHorizontalOverflow) {
        console.warn(`[OVERFLOW] Route ${r.name} @ ${vp.label}: scrollWidth=${pageMetrics.scrollW} > innerWidth=${pageMetrics.innerW} (diff: +${pageMetrics.overflowAmount}px)`);
        results.push({
          route: r.name,
          path: r.path,
          viewport: vp.label,
          metrics: pageMetrics
        });
      }
    }
  }

  await browser.close();
  fs.writeFileSync('audit-overflow-results.json', JSON.stringify(results, null, 2));
  console.log(`Audit complete. Found ${results.length} overflow incidents.`);
}

runAudit().catch(console.error);

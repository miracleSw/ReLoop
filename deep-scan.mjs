import puppeteer from 'puppeteer-core';
import fs from 'fs';

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

async function scanAll() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const violations = [];

  for (const r of routes) {
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      try {
        await page.goto('http://localhost:4173' + r.path, { waitUntil: 'networkidle0', timeout: 5000 });
      } catch (e) {
        await new Promise(res => setTimeout(res, 300));
      }

      const issues = await page.evaluate((vpWidth) => {
        const found = [];
        const all = document.querySelectorAll('body *');
        for (const el of all) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
          
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) continue;

          // If element extends past viewport width
          if (rect.right > vpWidth + 2) {
            // Is it decorative blur background?
            const isDecorative = el.classList.contains('pointer-events-none') || 
                                 el.classList.contains('blur-3xl') || 
                                 el.classList.contains('blur-2xl') ||
                                 (el.classList.contains('rounded-full') && el.className.includes('bg-gradient-') && el.classList.contains('absolute'));
            
            let parent = el.parentElement;
            let clippedByParent = false;
            while (parent && parent !== document.body) {
              const pStyle = window.getComputedStyle(parent);
              if (pStyle.overflow === 'hidden' || pStyle.overflowX === 'hidden') {
                clippedByParent = true;
                break;
              }
              parent = parent.parentElement;
            }

            found.push({
              tag: el.tagName.toLowerCase(),
              className: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 6).join(' ') : '',
              textContent: (el.children.length === 0 && el.textContent) ? el.textContent.trim().slice(0, 35) : '',
              rectRight: Math.round(rect.right),
              rectWidth: Math.round(rect.width),
              overflow: Math.round(rect.right - vpWidth),
              isDecorative,
              clippedByParent
            });
          }
        }
        return found;
      }, vp.width);

      const contentIssues = issues.filter(i => !i.isDecorative);
      if (contentIssues.length > 0) {
        console.log(`Route [${r.name}] @ ${vp.label}: ${contentIssues.length} content elements extending past viewport!`);
        for (const ci of contentIssues.slice(0, 5)) {
          console.log(`   -> <${ci.tag}> (${ci.className}) text: '${ci.textContent}' right=${ci.rectRight} ovf=+${ci.overflow}px clipped=${ci.clippedByParent}`);
        }
        violations.push({ route: r.name, viewport: vp.label, issues: contentIssues });
      }
    }
  }

  await browser.close();
  fs.writeFileSync('deep-scan-results.json', JSON.stringify(violations, null, 2));
  console.log(`\nScan finished. Found violations in ${violations.length} route-viewport combinations.`);
}

scanAll().catch(console.error);

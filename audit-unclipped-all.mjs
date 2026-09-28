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

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const summary = {
    totalCombinations: routes.length * viewports.length,
    pageBlowouts: [],
    uncontainedElements: []
  };

  for (const r of routes) {
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      try {
        await page.goto('http://localhost:4173' + r.path, { waitUntil: 'networkidle0', timeout: 5000 });
      } catch (e) {
        await new Promise(res => setTimeout(res, 200));
      }

      const result = await page.evaluate((vpWidth) => {
        // Temporarily disable overflow-x hidden on root to test true unconstrained scroll width
        const origDocOverflow = document.documentElement.style.overflowX;
        const origBodyOverflow = document.body.style.overflowX;
        document.documentElement.style.overflowX = 'visible';
        document.body.style.overflowX = 'visible';
        
        const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        
        document.documentElement.style.overflowX = origDocOverflow;
        document.body.style.overflowX = origBodyOverflow;

        const uncontained = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
          
          const rect = el.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) continue;

          if (rect.right > vpWidth + 2) {
            // Check if inside a container that properly constrains/scrolls its content
            let parent = el.parentElement;
            let properlyContained = false;
            while (parent && parent !== document.body && parent !== document.documentElement) {
              const pStyle = window.getComputedStyle(parent);
              const pRect = parent.getBoundingClientRect();
              if (['hidden', 'auto', 'scroll'].includes(pStyle.overflowX) && pRect.right <= vpWidth + 2) {
                properlyContained = true;
                break;
              }
              parent = parent.parentElement;
            }

            if (!properlyContained) {
              const isDecorative = el.classList.contains('pointer-events-none') || 
                                   el.classList.contains('blur-3xl') || 
                                   el.classList.contains('blur-2xl') ||
                                   (el.classList.contains('rounded-full') && (el.className.includes('bg-gradient-') || el.className.includes('bg-eco-')) && el.classList.contains('absolute'));
              if (!isDecorative) {
                uncontained.push({
                  tag: el.tagName.toLowerCase(),
                  className: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 4).join(' ') : '',
                  text: el.textContent ? el.textContent.trim().slice(0, 30) : '',
                  right: Math.round(rect.right),
                  overflow: Math.round(rect.right - vpWidth)
                });
              }
            }
          }
        }

        return {
          scrollW,
          pageOverflow: Math.max(0, scrollW - vpWidth),
          uncontained
        };
      }, vp.width);

      if (result.pageOverflow > 2) {
        summary.pageBlowouts.push({
          route: r.name,
          path: r.path,
          viewport: vp.label,
          overflow: result.pageOverflow
        });
      }

      if (result.uncontained.length > 0) {
        summary.uncontainedElements.push({
          route: r.name,
          path: r.path,
          viewport: vp.label,
          elements: result.uncontained
        });
      }
    }
  }

  await browser.close();
  fs.writeFileSync('audit-unclipped-results.json', JSON.stringify(summary, null, 2));
  console.log(`\nAudit Complete:`);
  console.log(`- Total Tested: ${summary.totalCombinations} route-viewport combinations`);
  console.log(`- Page Blowouts (scrollWidth > innerWidth): ${summary.pageBlowouts.length}`);
  console.log(`- Uncontained Elements extending past screen: ${summary.uncontainedElements.length}`);
  
  if (summary.pageBlowouts.length > 0) {
    console.log('Top Blowouts:', summary.pageBlowouts.slice(0, 10));
  }
  if (summary.uncontainedElements.length > 0) {
    console.log('Top Uncontained:', summary.uncontainedElements.slice(0, 10));
  }
}

runAudit().catch(console.error);

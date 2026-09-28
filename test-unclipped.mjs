import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testContainers() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const testCases = [
    { route: '/', vp: 320 },
    { route: '/products/prod-1', vp: 320 },
    { route: '/user/products', vp: 320 },
    { route: '/user/exchanges', vp: 320 },
    { route: '/user/transactions', vp: 320 },
    { route: '/admin', vp: 320 },
    { route: '/admin/users', vp: 320 },
    { route: '/admin/posts', vp: 320 },
    { route: '/admin/users', vp: 768 },
    { route: '/admin/posts', vp: 768 },
    { route: '/admin/users', vp: 1024 }
  ];

  for (const tc of testCases) {
    await page.setViewport({ width: tc.vp, height: 700 });
    await page.goto('http://localhost:4173' + tc.route, { waitUntil: 'networkidle0' });

    const analysis = await page.evaluate((vp) => {
      document.documentElement.style.overflowX = 'visible';
      document.body.style.overflowX = 'visible';
      const actualScrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';

      const unclippedOffscreen = [];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) continue;
        if (rect.right > vp + 1) {
          let ancestor = el.parentElement;
          let isContained = false;
          while (ancestor && ancestor !== document.body && ancestor !== document.documentElement) {
            const aStyle = window.getComputedStyle(ancestor);
            const aRect = ancestor.getBoundingClientRect();
            if (['hidden', 'auto', 'scroll'].includes(aStyle.overflowX) && aRect.right <= vp + 2) {
              isContained = true;
              break;
            }
            ancestor = ancestor.parentElement;
          }
          if (!isContained) {
            const isDecorative = el.classList.contains('pointer-events-none') || 
                                 el.classList.contains('blur-3xl') || 
                                 el.classList.contains('blur-2xl') ||
                                 (el.classList.contains('rounded-full') && el.className.includes('bg-gradient-') && el.classList.contains('absolute'));
            if (!isDecorative) {
              unclippedOffscreen.push({
                tag: el.tagName.toLowerCase(),
                className: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 4).join(' ') : '',
                text: el.textContent ? el.textContent.trim().slice(0, 25) : '',
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                overflow: Math.round(rect.right - vp)
              });
            }
          }
        }
      }

      return {
        actualScrollW,
        pageOverflow: actualScrollW - vp,
        unclippedCount: unclippedOffscreen.length,
        top3: unclippedOffscreen.slice(0, 3)
      };
    }, tc.vp);

    console.log(`[${tc.route} @ ${tc.vp}px]: pageOverflow=${analysis.pageOverflow}px, unclipped=${analysis.unclippedCount}`);
    if (analysis.unclippedCount > 0) {
      console.log('   Top:', JSON.stringify(analysis.top3, null, 2));
    }
  }

  await browser.close();
}

testContainers().catch(console.error);

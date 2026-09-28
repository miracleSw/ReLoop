import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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

const targetPages = [
  { name: 'home', path: '/' },
  { name: 'explore', path: '/explore' },
  { name: 'product-detail', path: '/products/prod-1' },
  { name: 'user-dashboard', path: '/user/dashboard' },
  { name: 'user-messages', path: '/user/messages' },
  { name: 'user-create-listing', path: '/user/create-listing' },
  { name: 'admin-dashboard', path: '/admin' }
];

const outputDir = path.resolve('audit-screenshots');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  for (const p of targetPages) {
    console.log(`Capturing page: ${p.name}...`);
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      const url = `http://localhost:4173${p.path}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
      } catch (e) {
        await new Promise(r => setTimeout(r, 600));
      }

      // Small pause for rendering stability
      await new Promise(r => setTimeout(r, 300));

      const filename = path.join(outputDir, `${p.name}-${vp.label}.png`);
      await page.screenshot({ path: filename, fullPage: false });
      console.log(`Saved ${filename}`);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});

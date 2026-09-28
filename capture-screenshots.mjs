import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const targetPages = [
  { name: 'home', path: '/' },
  { name: 'explore', path: '/explore' },
  { name: 'product-detail', path: '/products/prod-1' },
  { name: 'user-dashboard', path: '/user/dashboard' },
  { name: 'user-exchanges', path: '/user/exchanges' },
  { name: 'admin-dashboard', path: '/admin' },
  { name: 'admin-users', path: '/admin/users' }
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

async function capture() {
  const outDir = path.resolve('audit-screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  for (const p of targetPages) {
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      try {
        await page.goto('http://localhost:4173' + p.path, { waitUntil: 'networkidle0', timeout: 5000 });
      } catch (e) {
        await new Promise(r => setTimeout(r, 200));
      }
      const filename = path.join(outDir, `${p.name}-${vp.label}.png`);
      await page.screenshot({ path: filename, fullPage: false });
    }
  }

  await browser.close();
  console.log(`Captured screenshots across 9 viewports in ${outDir}`);
}

capture().catch(console.error);

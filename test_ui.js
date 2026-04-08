const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.stack));
  page.on('error', err => console.log('CRASH:', err));
  
  try {
    const url = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
    console.log('Navigating to', url);
    await page.goto(url, { waitUntil: 'load', timeout: 5000 });
    console.log('Page loaded successfully');
  } catch (e) {
    console.log('Goto failed:', e.message);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();

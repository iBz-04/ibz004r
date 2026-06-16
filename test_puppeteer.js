import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
  });
  
  page.on('pageerror', err => {
    console.error('Page error:', err);
  });

  console.log('Navigating...');
  await page.goto('http://localhost:4321/blog/career-tree', { waitUntil: 'networkidle2' });
  console.log('Done!');
  await browser.close();
})();

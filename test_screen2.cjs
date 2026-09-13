const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8443', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('jsic_screen', 'uni-challenge-detail');
    localStorage.setItem('jsic_role', 'university');
  });
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('ERROR:', error.message));
  
  await page.goto('http://localhost:8443', { waitUntil: 'networkidle0' });
  
  const html = await page.content();
  console.log("HTML length:", html.length);
  await browser.close();
})();

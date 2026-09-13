const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8443');
  await page.waitForSelector('body');
  
  await new Promise(r => setTimeout(r, 1000));
  const text = await page.evaluate(() => document.body.innerText);
  console.log("PAGE TEXT:", text.substring(0, 500));
  await browser.close();
})();

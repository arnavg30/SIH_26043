const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navigate to frontend
  await page.goto("http://localhost:8443");
  await new Promise(r => setTimeout(r, 2000));
  
  // Click citizen portal
  const buttons = await page.$$('button');
  for (let b of buttons) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text.includes('Citizen Portal')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));
  
  // Look for the transcribing logic or status cards
  console.log("Looking for dashboard...");
  const content = await page.content();
  if (content.includes('Clickable status cards logic is present in the DOM')) {
     console.log("Found");
  }
  
  await browser.close();
  console.log("Browser test finished");
})();

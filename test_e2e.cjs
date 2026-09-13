const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8443');
  
  console.log('1. Page loaded');
  
  // Wait for React to mount
  await page.waitForSelector('button');
  
  // Select Citizen (Language -> Next -> Citizen -> Continue)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.innerText.includes('Continue') || b.innerText.includes('Next'));
    if (next) next.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  console.log('2. Proceeded past language');
  
  // Find "Citizen" card and click
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div'));
    const cit = cards.find(c => c.innerText && c.innerText.includes('Citizen') && c.innerText.includes('Report'));
    if (cit) cit.click();
  });
  
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const next = btns.find(b => b.innerText.includes('Continue'));
    if (next) next.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  console.log('3. Selected Citizen');
  
  // Now we should be on Login Screen
  await page.waitForSelector('input[type="email"]');
  console.log('4. Auth Screen Reached');
  
  const forgotPwdText = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const f = btns.find(b => b.innerText.includes('Forgot Password'));
    return f ? f.innerText : null;
  });
  console.log('Forgot Password Present:', !!forgotPwdText);
  
  await browser.close();
})();

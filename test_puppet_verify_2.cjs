const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto("http://localhost:8443");
  await new Promise(r => setTimeout(r, 2000));
  
  // Enter Citizen Portal
  const citizenBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Citizen Portal'));
  });
  if (citizenBtn) await citizenBtn.click();
  await new Promise(r => setTimeout(r, 2000));
  
  // Fill login
  await page.type('input[type="email"]', 'test@test.com');
  await page.type('input[type="password"]', 'password123');
  
  const loginBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Login as Citizen'));
  });
  if (loginBtn) await loginBtn.click();
  
  await new Promise(r => setTimeout(r, 5000));
  
  await page.screenshot({ path: 'dashboard_before_click.png' });
  
  // Click first card (Submitted)
  const card = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('div')).find(d => d.innerText.includes('Submitted') && d.className.includes('p-3 flex'));
  });
  if (card) {
    await card.click();
    console.log("Clicked card!");
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: 'filtered_problems.png' });
  console.log("Saved filtered_problems.png");

  await browser.close();
})();

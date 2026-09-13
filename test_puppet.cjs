const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set window size for screenshot
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Navigating...');
  await page.goto('http://localhost:8443');
  
  // Wait for React to load
  await page.waitForSelector('body');
  
  console.log('Bypassing language and welcome modals using eval...');
  // Instead of guessing selectors, let's inject a global variable to force the screen to 'citizen-login'
  // But React state is hidden. 
  // Let's just click 'English', then 'Continue' (welcome modal)
  
  await page.evaluate(() => {
    return new Promise(resolve => setTimeout(resolve, 2000));
  });

  // Try clicking English
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const englishBtn = btns.find(b => b.innerText.includes('English'));
    if (englishBtn) englishBtn.click();
  });
  
  await page.evaluate(() => {
    return new Promise(resolve => setTimeout(resolve, 1000));
  });
  
  // Try clicking Continue (Welcome Modal)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const contBtn = btns.find(b => b.innerText.includes('Continue') || b.innerText.includes('Get Started'));
    if (contBtn) contBtn.click();
  });
  
  await page.evaluate(() => {
    return new Promise(resolve => setTimeout(resolve, 1000));
  });

  // Now click "Citizen" -> "Report"
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div'));
    const cit = cards.find(c => c.innerText && c.innerText.includes('Citizen') && c.innerText.includes('Report Problem'));
    if (cit) cit.click();
  });
  
  await page.evaluate(() => {
    return new Promise(resolve => setTimeout(resolve, 1000));
  });

  // Take screenshot of Citizen Login Screen
  await page.screenshot({ path: 'C:/Users/Arnav/.gemini/antigravity/brain/241f6399-f41e-40ca-b7e9-763960e29282/citizen_login.png' });
  console.log('Screenshot 1 taken: citizen_login.png');

  // Let's try to find "Forgot Password?" text
  const forgotPwd = await page.evaluate(() => {
    return document.body.innerText.includes('Forgot Password?');
  });
  console.log('Forgot Password Present:', forgotPwd);
  
  await browser.close();
})();

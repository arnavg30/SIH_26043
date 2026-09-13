const puppeteer = require("puppeteer");

(async () => {
  try {
    const testEmail = "test@test.com";
    const testPass = 'password123';

    console.log("Starting Puppeteer...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto("http://localhost:8443");
    await page.evaluate(() => localStorage.setItem("jsic_lang", "en"));
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    
    // We can evaluate directly to avoid brittle text searching:
    await page.evaluate(() => {
      // Find landing cards
      Array.from(document.querySelectorAll('.cursor-pointer')).find(el => el.innerText.includes('facing a problem')).click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
      Array.from(document.querySelectorAll('.cursor-pointer')).find(el => el.innerText.includes('Individual')).click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
      Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('Use Email instead')).click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', testPass);
    
    await page.evaluate(() => {
      Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Login')).click();
    });
    await new Promise(r => setTimeout(r, 4000));
    
    let content = await page.content();
    if (!content.includes('Welcome') && !content.includes('Problems')) {
      console.log("Failed to login to dashboard.");
      await page.screenshot({path: 'fail_login.png'});
      process.exit(1);
    }
    console.log("Dashboard visible.");
    
    console.log("Refreshing...");
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    
    content = await page.content();
    if (!content.includes('Welcome') && !content.includes('Problems') && !content.includes('Ji')) {
      console.log("REFRESH-LOGIN: FAIL");
      await page.screenshot({path: 'fail_refresh.png'});
    } else {
      console.log("REFRESH-LOGIN: PASS");
    }
    
    await page.evaluate(() => {
      Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Logout')).click();
    });
    await new Promise(r => setTimeout(r, 2000));
    
    content = await page.content();
    if (content.includes('facing a problem')) {
      console.log("LOGOUT: PASS");
    } else {
      console.log("LOGOUT: FAIL");
    }
    
    await browser.close();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
})();

const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto("http://localhost:8443");
    await page.evaluate(() => localStorage.setItem("jsic_lang", "en"));
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    
    const clickByText = async (text) => {
      await page.evaluate((t) => {
        const els = Array.from(document.querySelectorAll('button, div, span, h3'));
        const el = els.find(e => e.innerText && e.innerText.includes(t));
        if (el) el.click();
      }, text);
      await new Promise(r => setTimeout(r, 1000));
    };

    console.log("Navigating to login...");
    await clickByText('facing a problem'); // landing -> victim-select
    await clickByText('Individual'); // victim-select -> citizen-login
    
    // In citizen-login, it defaults to phone login maybe?
    // Let's click "Use Email instead"
    await clickByText('Email'); 
    await new Promise(r => setTimeout(r, 500));
    
    await page.type('input[type="email"]', 'test@test.com');
    await page.type('input[type="password"]', 'password123');
    
    // Find login button
    await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('button'));
      const el = els.find(e => e.innerText && e.innerText.includes('Login'));
      if(el) el.click();
    });
    console.log("Clicked login...");
    await new Promise(r => setTimeout(r, 4000));
    
    let content = await page.content();
    if (!content.includes('Welcome') && !content.includes('Problems')) {
      console.log("Failed to login to dashboard.");
      await page.screenshot({path: 'fail_login.png'});
      await browser.close();
      process.exit(1);
    }
    console.log("Dashboard visible.");
    
    console.log("Refreshing...");
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    
    content = await page.content();
    if (!content.includes('Welcome') && !content.includes('Problems') && !content.includes('Ji')) {
      console.log("REFRESH-LOGIN: FAIL");
      await page.screenshot({path: 'fail_refresh.png'});
    } else {
      console.log("REFRESH-LOGIN: PASS");
    }
    
    // Now logout
    // It's the right-most icon in the bottom NavBar.
    console.log("Logging out...");
    await page.evaluate(() => {
      // Find all buttons in the NavBar at the bottom (usually fixed bottom-0)
      const navBar = document.querySelector('.fixed.bottom-0');
      if (navBar) {
         const buttons = navBar.querySelectorAll('button');
         // the last button is usually profile or logout, wait, the navbar has Profile
         // let's just click 'Profile' or click any button that has logout
         const allBtns = document.querySelectorAll('button');
         const logoutBtn = Array.from(allBtns).find(b => b.innerText.includes('Logout') || b.innerHTML.includes('lucide-log-out'));
         if(logoutBtn) logoutBtn.click();
      }
    });
    await new Promise(r => setTimeout(r, 2000));
    // Check if we are on landing page
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

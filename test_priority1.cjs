const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set language to English so the modal doesn't block
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("jsic_lang", "en");
      localStorage.setItem("active_screen", "report-step1");
      // mock geolocation
      navigator.geolocation.getCurrentPosition = (cb) => {
        cb({ coords: { latitude: 23.3441, longitude: 85.3096 } });
      };
    });

    await page.goto('http://localhost:8443');
    await new Promise(r => setTimeout(r, 2000));
    
    // Type description
    await page.type('textarea', 'The main water pipeline is broken in Kanke and water is leaking everywhere.');
    
    // Find 'Next' button and click
    const nextBtns = await page.('button');
    for (const b of nextBtns) {
      const text = await page.evaluate(el => el.innerText, b);
      if (text.includes('Next')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    
    // Location step
    const mapBtns = await page.('button');
    for (const b of mapBtns) {
      const text = await page.evaluate(el => el.innerText, b);
      if (text.includes('Use current GPS')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));

    // Next on location
    const next2Btns = await page.('button');
    for (const b of next2Btns) {
      const text = await page.evaluate(el => el.innerText, b);
      if (text.includes('Next')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    
    // Review step - Submit to AI
    const submitBtns = await page.('button');
    for (const b of submitBtns) {
      const text = await page.evaluate(el => el.innerText, b);
      if (text.includes('Analyze')) {
        await b.click();
        break;
      }
    }
    
    console.log("Waiting for AI processing...");
    await page.waitForFunction(() => document.body.innerText.includes('AI Detection Results'), { timeout: 30000 });
    
    const text = await page.evaluate(() => document.body.innerText);
    console.log("--- AI RESULT SCREEN ---");
    console.log(text);
    
    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

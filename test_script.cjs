const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('jsic_lang', 'en');
      localStorage.setItem('active_screen', 'report-step1');
      navigator.geolocation.getCurrentPosition = (cb) => cb({coords: {latitude: 23.3, longitude: 85.3}});
    });
    
    await page.goto('http://localhost:8443');
    await new Promise(r => setTimeout(r, 2000));
    
    await page.type('textarea', 'The main water pipeline is broken.');
    
    const clickBtn = async (txt) => {
      const btns = await page.$($)('button');
      for(const b of btns) {
        const t = await page.evaluate(e => e.innerText, b);
        if(t.includes(txt)) {
          await b.click();
          return;
        }
      }
    };
    
    await clickBtn('Next');
    await new Promise(r => setTimeout(r, 1000));
    
    await clickBtn('Use GPS');
    await new Promise(r => setTimeout(r, 1000));
    
    await clickBtn('Next');
    await new Promise(r => setTimeout(r, 1000));
    
    await clickBtn('Analyze');
    console.log('Waiting for AI processing...');
    
    await page.waitForFunction(() => document.body.innerText.includes('AI Detection Results'), {timeout: 30000});
    
    const text = await page.evaluate(() => document.body.innerText);
    console.log('--- AI RESULT ---');
    console.log(text);
    
    await browser.close();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
})();

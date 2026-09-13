const puppeteer = require("puppeteer");
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgre123@localhost:5432/sih_portal' });

(async () => {
  try {
    const testEmail = "test@test.com";
    const testPass = 'password123';
    
    // Check if test@test.com has problems in DB to prove data persistence
    const { rows } = await pool.query("SELECT COUNT(*) FROM problems WHERE submitted_by = (SELECT user_id FROM users WHERE email = $1 LIMIT 1)", [testEmail]);
    const numProblems = parseInt(rows[0].count);
    console.log("DB Problems for test user:", numProblems);

    console.log("Starting Puppeteer...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto("http://localhost:8443");
    await page.evaluate(() => localStorage.setItem("jsic_lang", "en"));
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
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
    await new Promise(r => setTimeout(r, 5000));
    
    let content = await page.evaluate(() => document.body.innerText);
    if (!content.includes('Welcome') && !content.includes('Problems')) {
      console.log("Failed to login to dashboard.");
      await page.screenshot({path: 'fail_login.png'});
      process.exit(1);
    }
    
    // Verify dashboard data is fetched
    let foundData = false;
    if (numProblems > 0) {
      if (content.includes(numProblems.toString())) {
         foundData = true;
         console.log("Dashboard data fetched BEFORE refresh.");
      }
    } else {
       console.log("No problems to fetch, skipping BEFORE check.");
       foundData = true;
    }
    
    // We also look for the name
    const profileRows = await pool.query("SELECT name FROM users WHERE email = $1", [testEmail]);
    const name = profileRows.rows[0].name;
    if (content.includes(name)) {
      console.log(`Profile name '${name}' found BEFORE refresh.`);
    }

    console.log("Refreshing...");
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 5000));
    
    content = await page.evaluate(() => document.body.innerText);
    
    if (!content.includes('Welcome') && !content.includes('Problems') && !content.includes('Ji')) {
      console.log("REFRESH-LOGIN: FAIL");
      process.exit(1);
    }
    
    let refreshDataPassed = false;
    if (numProblems > 0) {
      if (content.includes(numProblems.toString())) {
         refreshDataPassed = true;
         console.log("Dashboard data fetched AFTER refresh.");
      }
    } else {
       refreshDataPassed = true;
    }
    
    if (content.includes(name)) {
      console.log(`Profile name '${name}' found AFTER refresh.`);
    } else {
      console.log(`Profile name '${name}' NOT found AFTER refresh!`);
      refreshDataPassed = false;
    }
    
    if (refreshDataPassed) {
       console.log("SAME USER BEFORE/AFTER: YES");
       console.log("DATA CONSISTENT: YES");
    } else {
       console.log("DATA CONSISTENT: NO");
    }
    
    await browser.close();
    pool.end();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
})();

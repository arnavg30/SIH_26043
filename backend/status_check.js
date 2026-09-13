const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgre123@localhost:5432/sih_portal' });
(async () => {
  const r1 = await pool.query("SELECT conname FROM pg_constraint WHERE conname = 'unique_email'");
  console.log("Unique constraint exists:", r1.rows.length > 0);
  
  const fs = require('fs');
  const serverJs = fs.readFileSync('server.js', 'utf8');
  console.log("Check-email endpoint exists:", serverJs.includes('/api/auth/check-email'));
  
  const appTsx = fs.readFileSync('../src/App.tsx', 'utf8');
  console.log("Dashboard data fetching exists:", appTsx.includes('getMyProblems().then(data => { if(data) setProblems(data.problems || data)'));
  
  pool.end();
})();

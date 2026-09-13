const fetch = require("node-fetch");
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgre123@localhost:5432/sih_portal' });

async function checkPort(port) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}`);
    return res.ok || res.status === 404; // if it responds, it's up
  } catch(e) {
    return false;
  }
}

(async () => {
  const backendUp = await checkPort(5000);
  const aiUp = await checkPort(8000);
  const frontendUp = await checkPort(8443);
  
  console.log("Backend 5000:", backendUp);
  console.log("AI 8000:", aiUp);
  console.log("Frontend 8443:", frontendUp);
  pool.end();
})();

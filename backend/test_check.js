const fetch = require("node-fetch");

(async () => {
  console.log("Checking unknown email:");
  const r1 = await fetch("http://localhost:5000/api/auth/check-email", {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email: "unknown_test_12345@gmail.com" })
  });
  console.log("Status:", r1.status);
  console.log(await r1.json());

  console.log("Checking known email:");
  // Let's find an existing email from DB
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: 'postgresql://postgres:postgre123@localhost:5432/sih_portal' });
  const { rows } = await pool.query("SELECT email FROM users LIMIT 1");
  const knownEmail = rows[0]?.email || "test@test.com";

  const r2 = await fetch("http://localhost:5000/api/auth/check-email", {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email: knownEmail })
  });
  console.log("Status:", r2.status);
  console.log(await r2.json());
  
  pool.end();
})();

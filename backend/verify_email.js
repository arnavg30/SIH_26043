const fetch = require("node-fetch");
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgre123@localhost:5432/sih_portal' });

(async () => {
  // DB Constraint
  const con = await pool.query("SELECT conname FROM pg_constraint WHERE conname = 'unique_email'");
  console.log("DB Constraint 'unique_email':", con.rows.length > 0 ? "PASSED" : "FAILED");
  
  // Existing Email
  const { rows } = await pool.query("SELECT email FROM users LIMIT 1");
  const existingEmail = rows[0]?.email;
  
  if (existingEmail) {
    const res1 = await fetch("http://127.0.0.1:5000/api/auth/check-email", {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email: existingEmail })
    });
    const json1 = await res1.json();
    console.log("Check existing email:", res1.status === 409 && json1.exists === true ? "PASSED" : "FAILED", json1);
  }
  
  // New Email
  const res2 = await fetch("http://127.0.0.1:5000/api/auth/check-email", {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email: "fresh_new_email_001@test.com" })
  });
  const json2 = await res2.json();
  console.log("Check new email:", res2.status === 200 && json2.exists === false ? "PASSED" : "FAILED", json2);

  pool.end();
})();

require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function check() {
  const r = await pool.query("SELECT user_id, domain_expertise FROM universities");
  console.log("Universities:", r.rows);
  const p = await pool.query("SELECT p.problem_code, p.status, c.category_name FROM problems p JOIN problem_categories c ON p.category_id = c.category_id");
  console.log("Problems:", p.rows);
  pool.end();
}
check();

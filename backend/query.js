const { Pool } = require("pg");
const pool = new Pool({ connectionString: "postgresql://postgres:postgre123@localhost:5432/sih_portal" });
pool.query("SELECT problem_code FROM problems WHERE status = 'IN_PROGRESS' LIMIT 1").then(res => {
  console.log(res.rows[0]);
  process.exit(0);
}).catch(console.error);

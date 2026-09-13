const { Pool } = require('pg');
const pool = new Pool({ connectionString: require('dotenv').config().parsed.DATABASE_URL });
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'").then(res => {
  console.log(res.rows.map(r => r.table_name).join(', '));
  pool.end();
});

const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgre123@localhost:5432/sih_portal' });
(async () => {
  try {
    const { rows } = await pool.query(`
      SELECT email, COUNT(*) as total_count
      FROM users GROUP BY email HAVING COUNT(*) > 1;
    `);
    console.log("Same-email duplicates:");
    console.log(JSON.stringify(rows, null, 2));
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
})();

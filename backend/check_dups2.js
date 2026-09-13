const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgre123@localhost:5432/sih_portal' });
(async () => {
  try {
    const { rows } = await pool.query(`
      SELECT email, COUNT(DISTINCT user_type) as role_count, 
      array_agg(DISTINCT user_type) as roles
      FROM users GROUP BY email HAVING COUNT(DISTINCT user_type) > 1;
    `);
    console.log("Duplicates:");
    console.log(JSON.stringify(rows, null, 2));
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
})();

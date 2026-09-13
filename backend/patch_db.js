const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:postgre123@localhost:5432/sih_portal' });
(async () => {
  try {
    await pool.query('ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);');
    console.log("Unique constraint added successfully.");
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
})();

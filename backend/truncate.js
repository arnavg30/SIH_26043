const { Pool } = require('pg');
const pool = new Pool({ connectionString: require('dotenv').config().parsed.DATABASE_URL });

async function run() {
  try {
    const resUsersBefore = await pool.query('SELECT count(*) FROM users');
    const usersBefore = resUsersBefore.rows[0].count;

    await pool.query("TRUNCATE TABLE industries, notifications, organizations, otp_verifications, panchayats, local_organizations, citizens, problem_feedback, project_milestones, problem_initiatives, problems, problem_media, project_partnerships, universities, impact_reports CASCADE;");
    
    const resUsersAfter = await pool.query('SELECT count(*) FROM users');
    const resLang = await pool.query('SELECT count(*) FROM languages');
    const resCat = await pool.query('SELECT count(*) FROM problem_categories');
    const resProb = await pool.query('SELECT count(*) FROM problems');

    console.log('Users Before:', usersBefore);
    console.log('Users After:', resUsersAfter.rows[0].count);
    console.log('Languages:', resLang.rows[0].count);
    console.log('Categories:', resCat.rows[0].count);
    console.log('Problems (Truncated Check):', resProb.rows[0].count);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();

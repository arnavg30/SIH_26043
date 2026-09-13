const { Pool } = require('pg');
const pool = new Pool({ connectionString: require('dotenv').config().parsed.DATABASE_URL });
async function test() {
  await pool.query("INSERT INTO problems (problem_code, title, description, category_id, status) VALUES ('TEST-001', 'Test Problem', 'A test problem description', 1, 'IN_PROGRESS') ON CONFLICT DO NOTHING");
  await pool.query("INSERT INTO problem_initiatives (problem_id, initiative_title, proposed_solution, status) VALUES ((SELECT problem_id FROM problems WHERE problem_code = 'TEST-001'), 'Test Solution', 'A test solution description', 'ACTIVE')");
  
  let probDesc = 'A test problem description';
  let solDesc = 'A test solution description';
  const fetch = require('node-fetch');
  const aiRes = await fetch('http://127.0.0.1:8000/generate-impact-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_data: { description: probDesc }, solution_data: { solution: solDesc }, feedback_list: [] })
  });
  const aiData = await aiRes.json();
  const reportRes = await pool.query(
    `INSERT INTO impact_reports (problem_code, title, summary, key_metrics, challenges_overcome) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    ['TEST-001', 'AI Impact Report', aiData.report || 'No summary generated', '[]', '']
  );
  console.log('SAVED ROW:', reportRes.rows[0]);
  
  // Clean up
  await pool.query("DELETE FROM problem_initiatives WHERE problem_id IN (SELECT problem_id FROM problems WHERE problem_code = 'TEST-001')");
  await pool.query("DELETE FROM impact_reports WHERE problem_code = 'TEST-001'");
  await pool.query("DELETE FROM problems WHERE problem_code = 'TEST-001'");
  pool.end();
}
test().catch(console.error);

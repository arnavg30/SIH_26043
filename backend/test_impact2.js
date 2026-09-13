const { Pool } = require('pg');
const pool = new Pool({ connectionString: require('dotenv').config().parsed.DATABASE_URL });
async function test() {
  
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
    ['TEST-002', 'AI Impact Report', aiData.report || 'No summary generated', '[]', '']
  );
  console.log('SAVED ROW:', reportRes.rows[0]);
  
  // Clean up
  await pool.query("DELETE FROM impact_reports WHERE problem_code = 'TEST-002'");
  pool.end();
}
test().catch(console.error);

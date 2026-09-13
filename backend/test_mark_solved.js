const { Pool } = require("pg");
const pool = new Pool({ connectionString: "postgresql://postgres:postgre123@localhost:5432/sih_portal" });
const fetch = require("node-fetch");

async function test() {
  const problemCode = "JH-AGRI-MTYQCNNM";
  console.log("Marking solved:", problemCode);
  
  await pool.query(`UPDATE problems SET status = 'SOLVED' WHERE problem_code = $1`, [problemCode]);
  const probRes = await pool.query(`SELECT description FROM problems WHERE problem_code = $1`, [problemCode]);
  const initRes = await pool.query(`SELECT proposed_solution FROM problem_initiatives pi JOIN problems p ON pi.problem_id = p.problem_id WHERE p.problem_code = $1`, [problemCode]);
  
  let probDesc = probRes.rows[0]?.description || "";
  let solDesc = initRes.rows[0]?.proposed_solution || "";
  
  console.log("Prob:", probDesc);
  console.log("Sol:", solDesc);
  
  console.log("Calling AI generation...");
  const aiRes = await fetch('http://127.0.0.1:8000/generate-impact-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_data: { description: probDesc }, solution_data: { solution: solDesc }, feedback_list: [] })
  });
  
  const aiData = await aiRes.json();
  console.log("AI Response:", aiData);
  
  const reportRes = await pool.query(
    `INSERT INTO impact_reports (problem_code, title, summary, key_metrics, challenges_overcome) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [problemCode, "AI Impact Report", aiData.report || "No summary generated", "[]", ""]
  );
  
  console.log("Saved to DB:", reportRes.rows[0]);
  process.exit(0);
}
test().catch(console.error);
